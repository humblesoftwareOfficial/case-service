/* eslint-disable prettier/prettier */
import { Model, Types } from 'mongoose';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IMediaRepository } from '../generics/generic.repository.abstract';

export class MediaRepository<T>
  extends MongoGenericRepository<T>
  implements IMediaRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }
  
  insertMany(items: T[]): Promise<T[]> {
    return this._repository.insertMany(items);
  }

  addNewView(code: string, user: Types.ObjectId): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            views: user,
          },
        },
      )
      .exec();
  }
}
