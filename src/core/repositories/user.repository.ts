/* eslint-disable prettier/prettier */
import { Model, Types } from 'mongoose';

import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IUserRepository } from '../generics/generic.repository.abstract';

const PopulateFollowersAndSubscriptions = [
  { path: 'followers', select: 'code pseudo firstName lastName phone -_id' },
  {
    path: 'subscriptions',
    select: 'code pseudo firstName lastName phone -_id',
  },
];

export class UserRepository<T>
  extends MongoGenericRepository<T>
  implements IUserRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }

  linkPublicationToUser(
    code: string,
    idPublication: Types.ObjectId,
  ): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            publications: idPublication,
          },
        },
      )
      .exec();
  }

  findByPhoneNumber(phone: string): Promise<T> {
    return this._repository
      .findOne({ phone }, '-_id -__v -password', { lean: true })
      .exec();
  }

  authentification(phone: string): Promise<T> {
    return this._repository
      .findOne({ phone }, '-__v -publications', { lean: true })
      .exec();
  }

  updatePushTokens(code: string, token: string): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            push_tokens: token,
          },
        },
        { new: true },
      )
      .exec();
  }

  findByPseudo(pseudo: string): Promise<T> {
    return this._repository
      .findOne({ pseudo }, '-_id -__v', { lean: true })
      .exec();
  }

  getAccountInfos(code: string): Promise<any[]> {
    console.log("rtttr")
    return this._repository
      .aggregate([
        {
          $match: {
            code
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'followers',
            foreignField: '_id',
            as: 'followers',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'subscriptions',
            foreignField: '_id',
            as: 'subscriptions',
          },
        },
        {
          $project: {
            _id: 0,
            code: 1,
            pseudo: 1,
            firstName: 1,
            lastName: 1,
            address: 1,
            phone: 1,
            push_tokens: 1,
            profile_picture: 1,
            profile_picture_key: 1,
            gender: 1,
            email: 1,
            followers: {
              code: 1,
              firstName: 1,
              lastName: 1,
              profile_picture: 1,
              profile_picture_key: 1,
              pseudo: 1,
              phone: 1,
            },
            subscriptions: {
              code: 1,
              firstName: 1,
              lastName: 1,
              profile_picture: 1,
              profile_picture_key: 1,
              pseudo: 1,
              phone: 1,
            },
            publications: {
              $cond: {
                if: {
                  $isArray: '$publications',
                },
                then: {
                  $size: '$publications',
                },
                else: 0,
              },
            },
            followers_count: {
              $cond: {
                if: {
                  $isArray: '$followers',
                },
                then: {
                  $size: '$followers',
                },
                else: 0,
              },
            },
            subscriptions_count: {
              $cond: {
                if: {
                  $isArray: '$subscriptions',
                },
                then: {
                  $size: '$subscriptions',
                },
                else: 0,
              },
            },
          },
        },
      ])
      .exec();
  }

  addAccountFollower(
    idUser: Types.ObjectId,
    accountToFlowId: Types.ObjectId,
  ): Promise<T> {
    return this._repository
      .findByIdAndUpdate(accountToFlowId, {
        $addToSet: {
          followers: idUser,
        },
      })
      .exec();
  }

  subscribeAccount(
    idUser: Types.ObjectId,
    accountSubscribedId: Types.ObjectId,
  ): Promise<T> {
    return this._repository
      .findByIdAndUpdate(idUser, {
        $addToSet: {
          subscriptions: accountSubscribedId,
        },
      })
      .exec();
  }

  removeAccountFollower(
    idUser: Types.ObjectId,
    accountToFlowId: Types.ObjectId,
  ): Promise<T> {
    return this._repository
      .findByIdAndUpdate(accountToFlowId, {
        $pull: {
          followers: idUser,
        },
      })
      .exec();
  }

  unSubscribeAccount(
    idUser: Types.ObjectId,
    accountSubscribedId: Types.ObjectId,
  ): Promise<T> {
    return this._repository
      .findByIdAndUpdate(idUser, {
        $pull: {
          subscriptions: accountSubscribedId,
        },
      })
      .exec();
  }

  populateAccountFollowersAndSubscriptions(value: any): Promise<any> {
    return this._repository.populate(value, PopulateFollowersAndSubscriptions);
  }
}
