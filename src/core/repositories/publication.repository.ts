/* eslint-disable prettier/prettier */

import { Model, Types } from 'mongoose';
import { IPublicationsListFilter } from 'src/publication/publication.helper';
import { EReactionsType } from 'src/reactions/reactions.helpers';

import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IPublicationRepository } from '../generics/generic.repository.abstract';

const PopulateOptions = [
  {
    path: 'user',
    select: 'code firstName lastName phone -_id',
  },
  {
    path: 'medias',
    select: 'code url description type price createdAt week month year -_id',
  },
];

const PopulateProductOptions = [
  {
    path: 'product.colors.media',
    select: '-_id code url type',
    model: 'Media',
  },
  {
    path: 'product.medias',
    select: '-_id code url type',
    model: 'Media',
  },
  {
    path: 'product.section',
    select: '-_id code label description',
    model: 'Section',
  },
  {
    path: 'product.category',
    select: '-_id code label description',
    model: 'Category',
  },
];

const PopulateUsersReactions = [
  {
    path: 'likes.user',
    select: '-_id code firstName lastName pseudo phone',
    model: 'User',
  },
  {
    path: 'records.user',
    select: '-_id code firstName lastName pseudo phone',
    model: 'User',
  },
];

export class PublicationRepository<T>
  extends MongoGenericRepository<T>
  implements IPublicationRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }

  getPublicationInfoByCode(code: string): Promise<any> {
    return this._repository
      .aggregate([
        {
          $match: {
            code,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'media',
            localField: 'medias',
            foreignField: '_id',
            as: 'medias',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products',
            foreignField: '_id',
            as: 'products',
          },
        },
        {
          $lookup: {
            from: 'reactions',
            localField: 'likes',
            foreignField: '_id',
            pipeline: [
              {
                $match: {
                  isDeleted: false,
                },
              },
            ],
            as: 'likes',
          },
        },
        {
          $lookup: {
            from: 'reactions',
            localField: 'records',
            foreignField: '_id',
            pipeline: [
              {
                $match: {
                  isDeleted: false,
                },
              },
            ],
            as: 'records',
          },
        },
        {
          $unwind: {
            path: '$user',
          },
        },
        {
          $unwind: {
            path: '$products',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            code: 1,
            createdAt: 1,
            lastUpdatedAt: 1,
            label: 1,
            description: 1,
            price: 1,
            type: 1,
            week: 1,
            month: 1,
            year: 1,
            user: {
              code: '$user.code',
              firstName: '$user.firstName',
              lastName: '$user.lastName',
              profile_picture: '$user.profile_picture',
              phone: '$user.phone',
              publications: {
                $cond: {
                  if: {
                    $isArray: '$user.publications',
                  },
                  then: {
                    $size: '$user.publications',
                  },
                  else: 0,
                },
              },
              followers: {
                $cond: {
                  if: {
                    $isArray: '$user.followers',
                  },
                  then: {
                    $size: '$user.followers',
                  },
                  else: 0,
                },
              },
              subscriptions: {
                $cond: {
                  if: {
                    $isArray: '$user.subscriptions',
                  },
                  then: {
                    $size: '$user.subscriptions',
                  },
                  else: 0,
                },
              },
            },
            medias: 1,
            product: '$products',
            likes: {
              $cond: {
                if: {
                  $isArray: '$likes',
                },
                then: '$likes',
                else: [],
              },
            },
            likesCount: {
              $cond: {
                if: {
                  $isArray: '$likes',
                },
                then: {
                  $size: '$likes',
                },
                else: 0,
              },
            },
            records: {
              $cond: {
                if: {
                  $isArray: '$records',
                },
                then: '$records',
                else: [],
              },
            },
            recordsCount: {
              $cond: {
                if: {
                  $isArray: '$records',
                },
                then: {
                  $size: '$records',
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
            'records._id': 0,
            'records.__v': 0,
            'records.publication': 0,
          },
        },
      ])
      .exec();
  }

  linkMediasToPublication(
    code: string,
    mediasId: Types.ObjectId[],
  ): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            medias: mediasId,
          },
        },
      )
      .exec();
  }

  getPublicationsList(filter: IPublicationsListFilter): Promise<any[]> {
    const priceFilter = parseInt(filter.searchTerm) || null;
    return this._repository
      .aggregate([
        {
          $match: {
            ...(filter.type && {
              type: filter.type,
            }),
            ...(filter.week && {
              week: filter.week,
            }),
            ...(filter.month && {
              week: filter.month,
            }),
            ...(filter.year && {
              week: filter.year,
            }),
            ...(filter.user && {
              user: filter.user,
            }),
            ...(filter.section && {
              section: filter.section,
            }),
            ...(priceFilter && {
              price: priceFilter,
            }),
            ...(filter.searchTerm &&
              !priceFilter && {
                $or: [
                  {
                    label: {
                      $regex: new RegExp(filter.searchTerm, 'i'),
                    },
                  },
                  {
                    description: {
                      $regex: new RegExp(filter.searchTerm, 'i'),
                    },
                  },
                ],
              }),
            isDeleted: false,
            ...(filter.ignorePublications?.length && {
              code: {
                $nin: filter.ignorePublications,
              },
            }),
            ...(filter.categories?.length && {
              category: {
                $in: filter.categories,
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
            from: 'users',
            localField: 'data.user',
            foreignField: '_id',
            as: 'data.user',
          },
        },
        {
          $lookup: {
            from: 'media',
            localField: 'data.medias',
            foreignField: '_id',
            as: 'data.medias',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'data.products',
            foreignField: '_id',
            as: 'data.products',
          },
        },
        {
          $lookup: {
            from: 'reactions',
            localField: 'data.likes',
            foreignField: '_id',
            as: 'data.likes',
          },
        },
        {
          $unwind: {
            path: '$data.user',
          },
        },
        {
          $unwind: {
            path: '$data.products',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            total: '$count.value',
            code: '$data.code',
            createdAt: '$data.createdAt',
            lastUpdatedAt: '$data.lastUpdatedAt',
            label: '$data.label',
            description: '$data.description',
            type: '$data.type',
            week: '$data.week',
            month: '$data.month',
            year: '$data.year',
            price: '$data.price',
            user: {
              code: '$data.user.code',
              firstName: '$data.user.firstName',
              lastName: '$data.user.lastName',
              profile_picture: '$data.user.profile_picture',
              phone: '$data.user.phone',
              pseudo: '$data.user.pseudo',
              publications: {
                $cond: {
                  if: { $isArray: '$data.user.publications' },
                  then: { $size: '$data.user.publications' },
                  else: 0,
                },
              },
              followers: {
                $cond: {
                  if: { $isArray: '$data.user.followers' },
                  then: { $size: '$data.user.followers' },
                  else: 0,
                },
              },
              subscriptions: {
                $cond: {
                  if: { $isArray: '$data.user.subscriptions' },
                  then: { $size: '$data.user.subscriptions' },
                  else: 0,
                },
              },
            },
            medias: '$data.medias',
            product: '$data.products',
            likes: {
              $cond: {
                if: { $isArray: '$data.likes' },
                then: '$data.likes',
                else: [],
              },
            },
            likesCount: {
              $cond: {
                if: { $isArray: '$data.likes' },
                then: { $size: '$data.likes' },
                else: 0,
              },
            },
            viewsCount: {
              $cond: {
                if: { $isArray: '$data.views' },
                then: { $size: '$data.views' },
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

  populateMediasAndColorsOptions(value: any): Promise<any> {
    return this._repository.populate(
      value,
      PopulateProductOptions.concat(PopulateUsersReactions),
    );
  }

  addNewView(code: string, viewId: Types.ObjectId): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            views: viewId,
          },
        },
      )
      .exec();
  }

  addNewReaction(
    code: string,
    reactionId: Types.ObjectId,
    type: EReactionsType,
  ): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            ...(type === EReactionsType.LIKE && {
              likes: reactionId,
            }),
            ...(type === EReactionsType.COMMENT && {
              comments: reactionId,
            }),
            ...(type === EReactionsType.SAVE_PUBLICATION && {
              records: reactionId,
            }),
          },
        },
      )
      .exec();
  }

  removeReaction(
    code: string,
    reactionId: Types.ObjectId,
    type: EReactionsType,
  ): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $pull: {
            ...(type === EReactionsType.LIKE && {
              likes: reactionId,
            }),
            ...(type === EReactionsType.COMMENT && {
              comments: reactionId,
            }),
          },
        },
      )
      .exec();
  }
}
