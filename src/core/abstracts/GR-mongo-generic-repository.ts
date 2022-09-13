/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';

import { IGenericRepository } from '../generics/generic.repository.abstract';

export class MongoGenericRepository<T> implements IGenericRepository<T> {
  private _repository: Model<T>;
  private _populateOnFind: string[];

  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    this._repository = repository;
    this._populateOnFind = populateOnFind;
  }

  findAll(ignoreAttributes: string): Promise<T[]> {
    return this._repository
      .find({}, ignoreAttributes, { lean: true })
      .populate(this._populateOnFind)
      .exec();
  }

  findOne(code: string, ignoreAttributes: string): Promise<T> {
    return this._repository.findOne({ code }, ignoreAttributes, { lean: true }).exec();
  }

  create(item: T): Promise<T> {
    return this._repository.create(item);
  }
}