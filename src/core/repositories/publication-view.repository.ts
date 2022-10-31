/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IPublicationViewRepository } from '../generics/generic.repository.abstract';

export class PublicationViewRepository<T>
  extends MongoGenericRepository<T>
  implements IPublicationViewRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }
  
}
