import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { fail, Result, succeed } from '../config/htt-response';
import { IDataServices } from '../core/generics/data.services.abstract';
import { codeGenerator, generateDefaultPassword } from '../shared/utils';
import { NewUserChatDto } from './user-chat.dto';

@Injectable()
export class UserChatService {
  constructor(
    private dataServices: IDataServices,
    private jwtService: JwtService,
  ) {}

  async list(): Promise<Result> {
    try {
      const users = await this.dataServices.userChat.findAll('-_id -__v');
      return succeed({
        code: HttpStatus.CREATED,
        data: users || [],
        message: '',
      });
    } catch (error) {
      throw new HttpException(
        `Error while getting users. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(newUser: NewUserChatDto): Promise<Result> {
    try {
      const salt = await bcrypt.genSalt();
      const password = newUser.password || generateDefaultPassword();
      const user = {
        code: codeGenerator('USC'),
        phone: newUser.phone,
        fullName: newUser.fullName,
        password: await bcrypt.hash(password, salt),
        push_tokens: newUser.push_tokens || [],
      };
      const createdUser = await this.dataServices.userChat.create(user);
      const payload = {
        userId: createdUser['_id'],
        code: user.code,
      };
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          ...user,
          password: undefined,
          access_token: this.jwtService.sign(payload),
        },
        message: 'User successfully registered.',
      });
    } catch (error) {
      if (error?.code === 11000) {
        return fail({
          code: 400,
          message: 'An user with the same infos like (phone) already exists.',
          error: 'Already exist',
        });
      } else {
        throw new HttpException(
          `Error while creating new user. Try again.`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
