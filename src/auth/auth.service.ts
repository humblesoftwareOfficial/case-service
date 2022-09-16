/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { fail, Result, succeed } from '../config/htt-response';
import { IDataServices } from '../core/generics/data.services.abstract';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private dataServices: IDataServices,
    private jwtService: JwtService,
  ) {}

  async login(authDto: AuthDto): Promise<Result> {
    const result = await this.validateUser(authDto);
    if (!result.success) {
      return fail({
        code: HttpStatus.OK,
        message: result.message,
        error: 'Authentification failed!'
      })
    }
    const user = result.user;
    const payload = {
      userId: user['_id'],
      code: user.code,
    };
    const data = {
      ...user,
      _id: undefined,
      password: undefined,
      access_token: this.jwtService.sign(payload),
    };
    return succeed({ data });
  }

  async validateUser(authDto: AuthDto) {
    const { email, password, phone } = authDto;
    console.log({ phone });
    console.log({ password });
    const user = await this.dataServices.users.authentification(phone);
    if (!user) {
      // throw new HttpException(
      //   `Authentication failed. Please check your login informations and try again`,
      //   HttpStatus.BAD_REQUEST,
      // );
      return {
        success: false,
        message: 'Account not found',
        user: null,
      }
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // throw new UnauthorizedException('Wrong password . Please Try again.');
      return {
        success: false,
        message: 'Wrong password',
        user: null,
      }
    }
    return {
      success: true,
      user,
    };
  }

  async verifyToken(tokenValue: string): Promise<Result> {
    try {
      const result = this.jwtService.verify(tokenValue);
      if (!result.code) {
        throw new UnauthorizedException('Error when verifying the token.');
      }
      const user = await this.dataServices.users.findOne(result.code, '-_id -__v -publications -password');
      if (!user) {
        throw new UnauthorizedException('Error when verifying the token.');
      }
      // const payload = {
      //   userId: user['_id'],
      //   code: user.code,
      // };
      // const data = {
      //   ...user,
      //   _id: undefined,
      //   password: undefined,
      //   access_token: this.jwtService.sign(payload),
      // };
      return succeed({ data: user });
    } catch (error) {
      throw new UnauthorizedException('Error when verifying the token.');
    }
  }
}
