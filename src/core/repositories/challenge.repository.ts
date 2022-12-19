/* eslint-disable prettier/prettier */
import { Model, Types } from 'mongoose';
import { IChallengeListFilter, IChallengeRankingFilter } from 'src/challenge/challenge.helper';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { EPublicationType } from '../entities/Publication';
import { IChallengeRepository } from '../generics/generic.repository.abstract';

const PopulateOptions = [
  {
    path: 'createdBy',
    select: '-_id code firstName lastName pseudo phone',
  },
  {
    path: 'lastUpdatedBy',
    select: '-_id code firstName lastName pseudo phone',
  },
];

export class ChallengeRepository<T>
  extends MongoGenericRepository<T>
  implements IChallengeRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }

  getChallengeList(filter: IChallengeListFilter): Promise<any[]> {
    return this._repository
      .aggregate([
        {
          $match: {
            ...(filter.searchTerm?.length && {
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
            ...(filter.isStillRunning !== null &&
              filter.isStillRunning !== undefined && {
                isStillRunning: filter.isStillRunning,
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
            localField: 'data.createdBy',
            foreignField: '_id',
            as: 'data.createdBy',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'data.lastUpdatedBy',
            foreignField: '_id',
            as: 'data.lastUpdatedBy',
          },
        },
        {
          $unwind: {
            path: '$data.createdBy',
          },
        },
        {
          $unwind: {
            path: '$data.lastUpdatedBy',
          },
        },
        {
          $project: {
            total: '$count.value',
            code: '$data.code',
            label: '$data.label',
            description: '$data.description',
            isStillRunning: '$data.isStillRunning',
            isDeleted: '$data.isDeleted',
            createdAt: '$data.createdAt',
            lastUpdatedAt: '$data.lastUpdatedAt',
            week: '$data.week',
            month: '$data.month',
            year: '$data.year',
            gifts: "$data.gifts",
            createdBy: {
              code: '$data.createdBy.code',
              firstName: '$data.createdBy.firstName',
              lastName: '$data.createdBy.lastName',
              pseudo: '$data.createdBy.pseudo',
              phone: '$data.createdBy.phone',
            },
            lastUpdatedBy: {
              code: '$data.lastUpdatedBy.code',
              firstName: '$data.lastUpdatedBy.firstName',
              lastName: '$data.lastUpdatedBy.lastName',
              pseudo: '$data.lastUpdatedBy.pseudo',
              phone: '$data.lastUpdatedBy.phone',
            },
          },
        },
      ])
      .exec();
  }

  getChallengeInfosByCode(code: string): Promise<any> {
    return this._repository
      .findOne({ code }, '-_id -__v')
      .populate(PopulateOptions)
      .exec();
  }
}
