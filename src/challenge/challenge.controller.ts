import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import { InvalidCodeException } from 'src/exceptions/invalicode.exception.filter';
import {
  GetChallengeListDto,
  NewChallengeDto,
  UpdateChallengeDto,
} from './challenge.dto';
import { Challenge } from './challenge.entity';
import { isValidChallengeCode } from './challenge.helper';
import { ChallengeService } from './challenge.service';

@ApiTags('Challenges')
@UseGuards(JwtAuthGuard)
@Controller('challenge')
export class ChallengeController {
  constructor(private service: ChallengeService) {}

  @ApiOkResponse({
    description: 'List of challenges.',
    type: Challenge,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/list')
  async list(@Body() value: GetChallengeListDto) {
    return this.service.list(value);
  }

  @ApiCreatedResponse({
    description: 'New Challenge created.',
    type: Challenge,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/new')
  async create(@Body() value: NewChallengeDto) {
    return this.service.create(value);
  }

  @ApiOkResponse({
    description: '',
    type: Challenge,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request. Invalid publication code.',
  })
  @ApiNotFoundResponse({
    description: 'Challenge not found.',
  })
  @Get(':code')
  async findOne(@Param('code') code: string) {
    if (!isValidChallengeCode(code)) {
      throw new InvalidCodeException('Challenge code is incorrect!');
    }
    return this.service.findOne(code);
  }

  @ApiCreatedResponse({
    description: 'New Challenge created.',
    type: Challenge,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Patch(':code')
  async update(@Param('code') code: string, @Body() value: UpdateChallengeDto) {
    if (!isValidChallengeCode(code)) {
      throw new InvalidCodeException('Challenge code is incorrect!');
    }
    return this.service.update(code, value);
  }
}
