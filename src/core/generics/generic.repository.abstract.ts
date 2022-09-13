/* eslint-disable prettier/prettier */
export abstract class IGenericRepository<T> {
  abstract findAll(ignoreAttributes: string): Promise<T[]>;

  abstract findOne(code: string, ignoreAttributes: string): Promise<T>;

  abstract create(item: T): Promise<T>;

  // abstract update(id: string, item: T): Promise<T>;
}
