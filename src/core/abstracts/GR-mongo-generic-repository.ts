/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';

import { IGenericRepository } from '../generics/generic.repository.abstract';

export class MongoGenericRepository<T> implements IGenericRepository<T> {
  public readonly _repository: Model<T>;
  public readonly _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }
  
  findAll(filterAttributes: string): Promise<T[]> {
    return this._repository
      .find({}, filterAttributes, { lean: true })
      .populate(this._populateOnFind)
      .exec();
  }

  findOne(code: string, filterAttributes: string): Promise<T> {
    return this._repository.findOne({ code }, filterAttributes, { lean: true }).exec();
  }

  create(item: T): Promise<T> {
    return this._repository.create(item);
  }

  update(code: string, update: any): Promise<T> {
    return this._repository.findOneAndUpdate({ code }, update, { new: true }).exec()
  }

  findAllByCodes(codes: string[], filterAttributes: string): Promise<T[]> {
   return this._repository.find({ code: {$in: codes }}, filterAttributes, { lean: true}).exec();
  }

}