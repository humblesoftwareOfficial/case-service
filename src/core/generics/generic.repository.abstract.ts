/* eslint-disable prettier/prettier */
import { Types } from 'mongoose';
import { IPublicationsListFilter } from 'src/publication/publication.helper';
export abstract class IGenericRepository<T> {
  abstract findAll(ignoreAttributes: string): Promise<T[]>;

  abstract findOne(code: string, ignoreAttributes: string): Promise<T>;

  abstract create(item: T): Promise<T>;
}

export abstract class IUserRepository<T> {
  abstract authentification(phone: string, password: string): Promise<T>;
  abstract updatePushTokens(code: string, pushtoken: string): Promise<T>;
  abstract findByPhoneNumber(phone: string): Promise<T>;
  abstract linkPublicationToUser(code: string, idPublication: Types.ObjectId): Promise<T>;
}

export abstract class IPublicationRepository<T>{
  abstract linkMediasToPublication(code: string, mediasId: Types.ObjectId[]): Promise<T>;
  abstract getPublicationInfoByCode(code: string): Promise<T>;
  abstract getPublicationsList(filter: IPublicationsListFilter): Promise<any[]>;
}

export abstract class IMediaRepository<T>{
  abstract insertMany(items: T[]): Promise<T[]>;
}