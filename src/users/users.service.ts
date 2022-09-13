/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { EUserGender } from 'src/core/entities/User';
import { IDataServices } from 'src/core/generics/data.services.abstract';

import { fail, Result, succeed } from '../config/htt-response';
import { codeGenerator, ErrorMessages, generateDefaultPassword } from '../shared/utils';
import { NewUserDto, UpdatePushTokenDto, UserPhoneDto } from './users.dto';
import { User, UserDocument } from './users.entity';
import { IFindUserbyEmailOrPhone, IUserTokenVerification } from './users.helper';
import { getDefaultUserInfos } from './users.helper';

const PopulateOptionsAuth = [];

@Injectable()
export class UsersService {
  // constructor(
  //   @InjectModel(User.name)
  //   private readonly model: Model<UserDocument>,
  // ) {}
  constructor(private dataServices: IDataServices) {}

  async findOne(code: string): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(code, '-_id -__v');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: "Not found!",
        })
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
        profile_picture: "",
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
        publications: [],
      };
      console.log({ password });
      const createdUser = await this.dataServices.users.create(user);
      // await this.model.create(user);
      console.log(createdUser.firstName);
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
      const user = await this.dataServices.users.findOne(value.user, '_id');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found!',
          error: 'Not found ressource',
        });
      }
      // await this.__updatePushTokens(user.code, value.tokenValue);
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
      // const user = await this.__findByPhone(value.phone);
      // if (!user) {
      //   return fail({
      //     code: HttpStatus.NOT_FOUND,
      //     message: 'Not registered!',
      //     error: '',
      //   });
      // }
      // return succeed({
      //   code: HttpStatus.OK,
      //   message: 'Already registred',
      //   data: {},
      // });
      return null;
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

  async __verifyUser(value: IUserTokenVerification) {
    // return await this.model
    //   .findOne(
    //     { $and: [{ _id: new Types.ObjectId(value.id) }, { code: value.code }] },
    //     '-__v',
    //   )
    //   .lean()
    //   .populate(PopulateOptionsAuth);
  }

  async __findByCode(code: string) {
    // return await this.model.findOne({ code });
  }

  async __findByPhone(phone: string) {
    // return await this.model.findOne({ phone });
  }

  async __updatePushTokens(idUser: string, pushTokenValue: string) {
    // return await this.model.findByIdAndUpdate(idUser, {
    //   $addToSet: {
    //     push_tokens: pushTokenValue,
    //   },
    // });
  }

  async __linkWalletToUser(idUser: string, walletId: any) {
    // return await this.model.findByIdAndUpdate(idUser, {
    //   $addToSet: {
    //     wallets: walletId,
    //   },
    // });
  }

  async __getWallets(code: string) {
    // return await this.model.aggregate([
    //   {
    //     $match: {
    //       code,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'wallets',
    //       localField: '_id',
    //       foreignField: 'owner',
    //       as: 'wallets',
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       wallet: '$wallets',
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: '$wallet',
    //     },
    //   },
    //   {
    //     $match: {
    //       'wallet.isDeleted': false,
    //     },
    //   },
    //   {
    //     $project: {
    //       'wallet._id': 0,
    //       'wallet.__v': 0,
    //       'wallet.transactions': 0,
    //     },
    //   },
    // ]);
  }
}
