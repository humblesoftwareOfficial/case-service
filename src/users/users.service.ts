/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EUserGender } from 'src/core/entities/User';
import { IDataServices } from 'src/core/generics/data.services.abstract';

import { fail, Result, succeed } from '../config/htt-response';
import {
  codeGenerator,
  ErrorMessages,
  generateDefaultPassword,
} from '../shared/utils';
import { NewUserDto, UpdatePushTokenDto, UserPhoneDto, UpdateUserDto } from './users.dto';
import {
  IFindUserbyEmailOrPhone,
  IUserTokenVerification,
} from './users.helper';
import { getDefaultUserInfos } from './users.helper';

@Injectable()
export class UsersService {
  constructor(private dataServices: IDataServices) {}

  async findOne(code: string): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(
        code,
        '-_id -__v -password -publications',
      );
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found!',
        });
      }
      return succeed({
        code: HttpStatus.OK,
        data: user,
      });
    } catch (error) {
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(newUser: NewUserDto): Promise<Result> {
    try {
      const salt = await bcrypt.genSalt();
      const password = newUser.password || generateDefaultPassword();
      const user = {
        code: codeGenerator('USR'),
        phone: newUser.phone,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        password: await bcrypt.hash(password, salt),
        gender: newUser.gender || EUserGender.OTHER,
        address: newUser.address,
        push_tokens: newUser.push_tokens || [],
        profile_picture: newUser.profile_picture || '',
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
        publications: [],
        pseudo: newUser.pseudo,
      };
      const createdUser = await this.dataServices.users.create(user);
      return succeed({
        code: HttpStatus.CREATED,
        data: getDefaultUserInfos(createdUser),
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

  async updatePushToken(value: UpdatePushTokenDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.updatePushTokens(
        value.user,
        value.tokenValue,
      );
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found!',
          error: 'Not found ressource',
        });
      }
      return succeed({
        code: HttpStatus.OK,
        data: {
          token: value.tokenValue,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while updating user push tokens. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isPhoneNumberRegistered(value: UserPhoneDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.findByPhoneNumber(value.phone);
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Not registered!',
          error: '',
        });
      }
      return succeed({
        code: HttpStatus.OK,
        message: 'Already registred',
        data: {},
      });
    } catch (error) {
      console.log({ error });
      throw new HttpException(
        `Error while verifying  user. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async __findByEmailOrLogin({ email, phone }: IFindUserbyEmailOrPhone) {
    // return await this.model
    //   .findOne(
    //     {
    //       $or: [{ email: email }, { phone: phone }],
    //     },
    //     '-__v',
    //   )
    //   .lean()
    //   .populate(PopulateOptionsAuth);
  }

  async update(code: string, value: UpdateUserDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(
        code,
        '_id code',
      );
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const salt = await bcrypt.genSalt();
      const update = {
        ...(value.firstName && {
          firstName: value.firstName,
        }),
        ...(value.lastName && {
          lastName: value.lastName,
        }),
        ...(value.address && {
          address: value.address,
        }),
        ...(value.email && {
          email: value.email,
        }),
        ...(value.gender && {
          gender: value.gender,
        }),
        ...(value.password && {
          password: await bcrypt.hash(value.password, salt),
        }),
        ...(value.phone && {
          phone: value.phone,
        }),
        ...(value.profile_picture && {
          profile_picture: value.profile_picture,
        }),
        ...(value.pseudo && {
          pseudo: value.pseudo,
        }),
        lastUpdatedAt: new Date(),
      };
      const result = await this.dataServices.users.update(
        code,
        update,
      );
      if (!result) {
        return fail({
          code: HttpStatus.NOT_MODIFIED,
          message: '',
          error: '',
        });
      }
      return succeed({
        code: HttpStatus.OK,
        data: await this.dataServices.users.findOne(code, '-_id -__v -password -publications'),
      });
    } catch (error) {
      console.log({ error })
      throw new HttpException(
        `Error while updating user. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async isPseudoAvailable(pseudo: string): Promise<Result> {
    try {
      const user = await this.dataServices.users.findByPseudo(pseudo);
      return succeed({
        code: HttpStatus.OK,
        data: {
          isAvailable: user ? false : true,
          pseudo,
        }
      });
    } catch (error) {
      console.log({ error })
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
