/* eslint-disable prettier/prettier */
import { Model, Types } from 'mongoose';
import { IPublicationsListByReactionsFilter } from 'src/publication/publication.helper';
import { EReactionsType } from 'src/reactions/reactions.helpers';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IReactionsRepository } from '../generics/generic.repository.abstract';

export class ReactionsRepository<T>
  extends MongoGenericRepository<T>
  implements IReactionsRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }

  getUserLikeOrRecordForPublication(
    user: Types.ObjectId,
    publication: Types.ObjectId,
    type: EReactionsType,
  ): Promise<T> {
    return this._repository
      .findOne({
        $and: [{ user }, { publication }, { type }, { isDeleted: false }],
      })
      .exec();
  }

  getPublicationsListByReactions(
    filter: IPublicationsListByReactionsFilter,
  ): Promise<any[]> {
    return this._repository
      .aggregate([
        {
          $match: {
            type: {
              $in: filter.types,
            },
            isDeleted: false,
            ...(filter.users?.length && {
              user: {
                $in: filter.users,
              },
            }),
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $facet: {
            count: [
              {
                $group: {
                  _id: null,
                  value: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
            data: [
              {
                $skip: filter.skip,
              },
              {
                $limit: filter.limit,
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$count',
          },
        },
        {
          $unwind: {
            path: '$data',
          },
        },
        {
          $lookup: {
            from: 'publications',
            localField: 'data.publication',
            foreignField: '_id',
            as: 'data.publication',
          },
        },
        {
          $unwind: {
            path: '$data.publication',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'data.user',
            foreignField: '_id',
            as: 'data.user',
          },
        },
        {
          $unwind: {
            path: '$data.user',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'data.publication.user',
            foreignField: '_id',
            as: 'data.publication.user',
          },
        },
        {
          $lookup: {
            from: 'media',
            localField: 'data.publication.medias',
            foreignField: '_id',
            as: 'data.publication.medias',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'data.publication.products',
            foreignField: '_id',
            as: 'data.publication.products',
          },
        },
        {
          $lookup: {
            from: 'reactions',
            localField: 'data.publication.likes',
            foreignField: '_id',
            as: 'data.publication.likes',
          },
        },
        {
          $unwind: {
            path: '$data.publication.user',
          },
        },
        {
          $unwind: {
            path: '$data.publication.products',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            total: '$count.value',
            code: "$data.publication.code",
            codeRecord: "$data.code",
            createdAt: "$data.publication.createdAt",
            lastUpdatedAt: "$data.publication.lastUpdatedAt",
            createdAtRecord: "$data.createdAt",
            lastUpdatedAtRecord: "$data.lastUpdatedAt",
            price: "$data.publication.price",
            label: "$data.publication.label",
            description: "$data.publication.description",
            message: '$data.message',
            typeRecord: "$data.type",
            type: "$data.publication.type",
            week: '$data.week',
            month: '$data.month',
            year: '$data.year',
            user: {
              code: '$data.user.code',
              firstName: '$data.user.firstName',
              lastName: '$data.user.lastName',
              profile_picture: '$data.user.profile_picture',
              phone: '$data.user.phone',
              publications: {
                $cond: {
                  if: {
                    $isArray: '$data.user.publications',
                  },
                  then: {
                    $size: '$data.user.publications',
                  },
                  else: 0,
                },
              },
              followers: {
                $cond: {
                  if: {
                    $isArray: '$data.user.followers',
                  },
                  then: {
                    $size: '$data.user.followers',
                  },
                  else: 0,
                },
              },
              subscriptions: {
                $cond: {
                  if: {
                    $isArray: '$data.user.subscriptions',
                  },
                  then: {
                    $size: '$data.user.subscriptions',
                  },
                  else: 0,
                },
              },
            },
            medias: '$data.publication.medias',
            product: '$data.publication.products',
            likes: {
              $cond: {
                if: {
                  $isArray: '$data.publication.likes',
                },
                then: '$data.publication.likes',
                else: [],
              },
            },
            likesCount: {
              $cond: {
                if: {
                  $isArray: '$data.publication.likes',
                },
                then: {
                  $size: '$data.publication.likes',
                },
                else: 0,
              },
            },
            viewsCount: {
              $cond: {
                if: {
                  $isArray: '$data.publication.views',
                },
                then: {
                  $size: '$data.publication.views',
                },
                else: 0,
              },
            },
          },
        },
        {
          $project: {
            'medias._id': 0,
            'medias.entity': 0,
            'medias.onModel': 0,
            'medias.__v': 0,
            'product._id': 0,
            'product.__v': 0,
            'product.publications': 0,
            'product.user': 0,
            'product.priceHistory': 0,
            'likes._id': 0,
            'likes.__v': 0,
            'likes.publication': 0,
          },
        },
      ])
      .exec();
  }
}
