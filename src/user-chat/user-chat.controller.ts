import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { NewUserChatDto } from './user-chat.dto';
import { UserChat } from './user-chat.entity';
import { UserChatService } from './user-chat.service';

@Controller('user-chat')
export class UserChatController {
  constructor(private service: UserChatService) {}

  @ApiCreatedResponse({
    description: 'New user successfully registered.',
    type: UserChat,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description:
      'Bad Request. most often duplicated values such as (phone, email).',
  })
  @Post('/registration')
  async create(@Body() newUserDto: NewUserChatDto) {
    return this.service.create(newUserDto);
  }

  @ApiCreatedResponse({
    description: 'New user successfully registered.',
    type: UserChat,
    isArray: true,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error occured.',
  })
  @ApiBadRequestResponse({
    description: 'Bad Request.',
  })
  @Post('/list')
  async list() {
    return this.service.list();
  }
}
