import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { fail, Result, succeed } from 'src/config/htt-response';
import { IDataServices } from 'src/core/generics/data.services.abstract';
import { getWeekNumber } from 'src/shared/date.helpers';
import { codeGenerator } from 'src/shared/utils';
import {
  NewReactionDto,
  RemoveLikeOrRecordDto,
  RemoveReactionDto,
} from './reactions.dto';
import {
  EReactionsType,
  getCustomReactionTargetMessage,
} from './reactions.helpers';

interface IRemoveReaction {
  reactionId: Types.ObjectId;
  reactionCode: string;
  reactionType: EReactionsType;
  publicationCode: string;
}

@Injectable()
export class ReactionsService {
  constructor(private dataServices: IDataServices) {}

  async newReaction(value: NewReactionDto): Promise<Result> {
    try {
      let publicationFrom = null;
      const user = await this.dataServices.users.findOne(value.user, 'code');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const publication = await this.dataServices.publications.findOne(
        value.publication,
        'code user',
      );
      if (!publication) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Publication not found',
          error: 'Not found resource',
        });
      }

      if (value.publicationFrom) {
        publicationFrom = await this.dataServices.publications.findOne(
          value.publicationFrom,
          'code',
        );
        if (!publicationFrom) {
          return fail({
            code: HttpStatus.NOT_FOUND,
            message: 'Publication from not found',
            error: 'Not found resource',
          });
        }
      }
      if (
        [EReactionsType.LIKE, EReactionsType.SAVE_PUBLICATION].includes(
          value.reactionType,
        )
      ) {
        const userHasAlreadyLikedOrRecorded =
          await this.__hasAlreadyLikedOrRecorded(
            user['_id'],
            publication['_id'],
            value.reactionType,
          );
        if (userHasAlreadyLikedOrRecorded.success) {
          const customReaction = getCustomReactionTargetMessage(
            value.reactionType,
          );
          return fail({
            code: HttpStatus.BAD_REQUEST,
            message: `User has already ${customReaction} this publication`,
            error: `Already ${customReaction}`,
          });
        }
      }
      const creationDate = new Date();
      const newReaction = {
        code: codeGenerator('REA'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        user: user['_id'],
        publication: publication['_id'],
        publicationFrom: publicationFrom ? publicationFrom['_id'] : null,
        type: value.reactionType,
        message: value.message || '',
      };
      const createdReaction = await this.dataServices.reactions.create(
        newReaction,
      );
      await this.dataServices.publications.addNewReaction(
        publication.code,
        createdReaction['_id'],
        value.reactionType,
      );
      //SEND NOTIFICATION TO PUBLICATION'USER
      return succeed({
        code: HttpStatus.OK,
        message: '',
        data: {
          code: createdReaction.code,
          user: user.code,
          publication: publication.code,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while saving new reaction. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeReaction(value: RemoveReactionDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(value.user, 'code');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const publication = await this.dataServices.publications.findOne(
        value.publication,
        'code user',
      );
      if (!publication) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Publication not found',
          error: 'Not found resource',
        });
      }
      const reaction = await this.dataServices.reactions.findOne(
        value.reaction,
        'code user publication type',
      );
      if (!reaction) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Reaction not found',
          error: 'Not found resource',
        });
      }
      if (
        reaction.user?.toString() !== user['_id'].toString() ||
        reaction.publication?.toString() !== publication['_id'].toString()
      ) {
        return fail({
          code: HttpStatus.BAD_REQUEST,
          message: 'Bad request',
          error: 'Bad request',
        });
      }
      await this.__removeReaction({
        publicationCode: publication.code,
        reactionCode: reaction.code,
        reactionId: reaction['_id'],
        reactionType: reaction.type as EReactionsType,
      });
      return succeed({
        code: HttpStatus.OK,
        message: 'Reaction deleted',
        data: {
          reaction: reaction.code,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while removing reaction. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUserLikeOrSaveFromPublication(
    value: RemoveLikeOrRecordDto,
  ): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(value.user, 'code');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const publication = await this.dataServices.publications.findOne(
        value.publication,
        'code user',
      );
      if (!publication) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Publication not found',
          error: 'Not found resource',
        });
      }
      const result = await this.__hasAlreadyLikedOrRecorded(
        user['_id'],
        publication['_id'],
        value.reactionType,
      );
      if (!result.success) {
        const customReaction = getCustomReactionTargetMessage(
          value.reactionType,
        );
        return fail({
          code: HttpStatus.BAD_REQUEST,
          message: `User has not ${customReaction} this publication yet!`,
          error: `Already ${customReaction}`,
        });
      }
      await this.__removeReaction({
        publicationCode: publication.code,
        reactionCode: result.data.code,
        reactionId: result.data['_id'],
        reactionType: result.data.type as EReactionsType,
      });
      return succeed({
        code: HttpStatus.OK,
        message: 'Reaction deleted',
        data: {
          reaction: result.data.code,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while removing reaction. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async __hasAlreadyLikedOrRecorded(
    userId: Types.ObjectId,
    publicationId: Types.ObjectId,
    type: EReactionsType,
  ) {
    const result =
      await this.dataServices.reactions.getUserLikeOrRecordForPublication(
        userId,
        publicationId,
        type,
      );
    if (result) {
      if (result.isDeleted) return { success: false, data: null };
      return { success: true, data: result };
    }
    return { success: false, data: null };
  }

  async __removeReaction({
    publicationCode,
    reactionCode,
    reactionId,
    reactionType,
  }: IRemoveReaction) {
    const actionDate = new Date();
    await this.dataServices.reactions.update(reactionCode, {
      lastUpdatedtAt: actionDate,
      deletedAt: actionDate,
      isDeleted: true,
    });
    await this.dataServices.publications.removeReaction(
      publicationCode,
      reactionId,
      reactionType,
    );
  }
}
