/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IUserChatRepository } from '../generics/generic.repository.abstract';

export class UserChatRepository<T>
  extends MongoGenericRepository<T>
  implements IUserChatRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }
}
