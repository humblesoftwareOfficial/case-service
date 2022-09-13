import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '../users/users.entity';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'User successfully authenticated.',
    type: User,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description:
      "Bad Request. Invalid auth credentials. You must give user's email and password /or user's card number",
  })
  @ApiNotFoundResponse({
    description: 'User not found.',
  })
  @Post('/login')
  async login(@Body() authDto: AuthDto) {
    if (!authDto.email && !authDto.phone) {
      return fail({
        error: `Authentification error`,
        code: HttpStatus.BAD_REQUEST,
        message: `Incomplete login information.`,
      });
    }
    return this.authService.login(authDto);
  }
}
