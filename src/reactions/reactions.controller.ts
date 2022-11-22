import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.gard';
import {
  NewReactionDto,
  RemoveLikeOrRecordDto,
  RemoveReactionDto,
} from './reactions.dto';
import { ReactionsService } from './reactions.service';

@ApiTags('Reactions')
@UseGuards(JwtAuthGuard)
@Controller('reactions')
export class ReactionsController {
  constructor(private readonly service: ReactionsService) {}

  @ApiOkResponse({
    description: 'Add new reaction for publication.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiNotFoundResponse({
    description: 'Not found resource.',
  })
  @Post('/new')
  async newReaction(@Body() value: NewReactionDto) {
    return this.service.newReaction(value);
  }

  @ApiOkResponse({
    description: 'Remove reaction from publication.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiNotFoundResponse({
    description: 'Not found resource.',
  })
  @Post('/remove')
  async removeReaction(@Body() value: RemoveReactionDto) {
    return this.service.removeReaction(value);
  }

  @ApiOkResponse({
    description: 'Remove reaction from publication.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiNotFoundResponse({
    description: 'Not found resource.',
  })
  @Post('/remove/like')
  async removeUserLikeOrSaveFromPublication(
    @Body() value: RemoveLikeOrRecordDto,
  ) {
    return this.service.removeUserLikeOrSaveFromPublication(value);
  }
}
