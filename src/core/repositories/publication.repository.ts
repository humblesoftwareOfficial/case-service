/* eslint-disable prettier/prettier */
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IPublicationRepository } from '../generics/generic.repository.abstract';
import { Model, Types } from 'mongoose';

export class PublicationRepository<T>
  extends MongoGenericRepository<T>
  implements IPublicationRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
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
}
