/* eslint-disable prettier/prettier */
import { Model, Types } from 'mongoose';
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
}
