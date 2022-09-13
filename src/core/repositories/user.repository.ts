/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IUserRepository } from '../generics/generic.repository.abstract';

export class UserRepository<T>
  extends MongoGenericRepository<T>
  implements IUserRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }

  authentification(phone: string, password: string): Promise<T> {
    
    return this._repository.findOne({ phone }, '-__v',{ lean: true }).exec();
  }
}
