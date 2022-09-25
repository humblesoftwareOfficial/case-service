/* eslint-disable prettier/prettier */
import { Model, Types } from 'mongoose';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { ISectionRepository } from '../generics/generic.repository.abstract';

export class SectionRepository<T>
  extends MongoGenericRepository<T>
  implements ISectionRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }

  listSections(): Promise<any[]> {
    return this._repository
      .aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'categories',
            foreignField: '_id',
            as: 'categories',
          },
        },
        {
          $project: {
            _id: 0,
            code: 1,
            label: 1,
            description: 1,
            'categories.code': 1,
            'categories.label': 1,
            'categories.description': 1,
            'categories.tags': 1,
          },
        },
      ])
      .exec();
  }

  insertMany(items: T[]): Promise<T[]> {
    return this._repository.insertMany(items);
  }

  linkCategoriesToSection(
    code: string,
    categoriesIds: Types.ObjectId[],
  ): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            categories: categoriesIds,
          },
        },
      )
      .exec();
  }
}
