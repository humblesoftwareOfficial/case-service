/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { IProductProvisioning } from 'src/products/product.helper';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IProvisioningRepository } from '../generics/generic.repository.abstract';

export class ProvisioningRepository<T>
  extends MongoGenericRepository<T>
  implements IProvisioningRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }
}
