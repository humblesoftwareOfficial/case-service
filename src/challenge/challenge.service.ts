import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { fail, Result, succeed } from 'src/config/htt-response';
import { IDataServices } from 'src/core/generics/data.services.abstract';
import { getWeekNumber } from 'src/shared/date.helpers';
import { codeGenerator } from 'src/shared/utils';
import { GiftDto, NewChallengeDto, UpdateChallengeDto } from './challenge.dto';
import { Challenge } from './challenge.entity';

@Injectable()
export class ChallengeService {
  constructor(private dataServices: IDataServices) {}

  async findOne(code: string): Promise<Result> {
    try {
      const challenge =
        await this.dataServices.challenge.getChallengeInfosByCode(code);
      if (!challenge) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: `Challenge with code: ${code} not found`,
          error: 'Not found resource',
        });
      }
      return succeed({
        code: HttpStatus.OK,
        message: '',
        data: challenge,
      });
    } catch (error) {
      throw new HttpException(
        `Error while creating new challenge. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(value: NewChallengeDto): Promise<Result> {
    try {
      const creator = await this.dataServices.users.findOne(
        value.user,
        '_id code',
      );
      if (!creator) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const creationDate = new Date();

      //check gift number collision
      if (value.gifts?.length) {
        const result = this.__checkGift(value.gifts);
        if (!result.success) {
          return fail({
            code: HttpStatus.BAD_REQUEST,
            message: result.message,
            error: 'Gifts error',
          });
        }
      }

      const challenge: Challenge = {
        code: codeGenerator('CHL'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        isStillRunning: true,
        description: value.description,
        label: value.label,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        gifts: value.gifts || [],
        createdBy: creator['_id'],
        lastUpdatedBy: creator['_id'],
      };
      const createdChallenge = await this.dataServices.challenge.create(
        challenge,
      );
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          code: createdChallenge.code,
          description: createdChallenge.description,
          label: createdChallenge.label,
          gifts: createdChallenge.gifts,
          isStillRunning: createdChallenge.isStillRunning,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while creating new challenge. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(code: string, value: UpdateChallengeDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(
        value.user,
        '_id code',
      );
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const challenge = await this.dataServices.challenge.findOne(code, '');
      if (!challenge) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: `Challenge with code: ${code} not found`,
          error: 'Not found resource',
        });
      }
      if (!challenge.isStillRunning) {
        return fail({
          code: HttpStatus.BAD_REQUEST,
          message: `Cannot update this challenge. It's closed`,
          error: 'Bad request',
        });
      }
      if (value.gifts?.length) {
        const result = this.__checkGift(value.gifts);
        if (!result.success) {
          return fail({
            code: HttpStatus.BAD_REQUEST,
            message: result.message,
            error: 'Gifts error',
          });
        }
      }
      await this.dataServices.challenge.update(code, {
        lastUpdatedBy: user['_id'],
        label: value.label || challenge.label,
        description: value.description || challenge.description,
        lastUpdatedAt: new Date(),
        gifts: value.gifts?.length ? value.gifts : challenge.gifts,
        isStillRunning:
          value.isStillRunning !== null && value.isStillRunning !== undefined
            ? value.isStillRunning
            : challenge.isStillRunning,
      });
      return succeed({
        code: HttpStatus.OK,
        message: 'Challenge updated!',
        data: {},
      });
    } catch (error) {
      throw new HttpException(
        `Error while updating challenge. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  __checkGift(gifts: GiftDto[]) {
    const giftSet = new Set();
    const findDuplicates = gifts.some(
      (g) => giftSet.size === (giftSet.add(g.giftNumber), giftSet.size),
    );
    if (findDuplicates) {
      return {
        success: false,
        message: 'Duplicated gift number',
        data: [],
      };
    }
    const orderedGifts = gifts.sort((a, b) =>
      a.giftNumber > b.giftNumber ? 1 : b.giftNumber > a.giftNumber ? -1 : 0,
    );
    return {
      success: true,
      message: '',
      data: orderedGifts,
    };
  }
}
