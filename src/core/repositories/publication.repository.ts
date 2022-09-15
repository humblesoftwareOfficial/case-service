/* eslint-disable prettier/prettier */
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IPublicationRepository } from '../generics/generic.repository.abstract';
import { Model, Types } from 'mongoose';
import { IPublicationsListFilter } from 'src/publication/publication.helper';

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
export class PublicationRepository<T>
  extends MongoGenericRepository<T>
  implements IPublicationRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }

  getPublicationInfoByCode(code: string): Promise<any> {
    return this._repository
      .findOne({ code }, '-_id -__v', { lean: true })
      .populate(PopulateOptions)
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
    console.log({ priceFilter });
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
            ...(priceFilter && {
              price: priceFilter,
            }),
            ...(filter.searchTerm && !priceFilter && {
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
          $unwind: {
            path: '$data.user',
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
            },
            medias: '$data.medias',
          },
        },
        {
          $project: {
            'medias._id': 0,
            'medias.entity': 0,
            'medias.onModel': 0,
            'medias.__v': 0,
          },
        },
      ])
      .exec();
  }
}
