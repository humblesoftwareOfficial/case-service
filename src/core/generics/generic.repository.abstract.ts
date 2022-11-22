/* eslint-disable prettier/prettier */
import { Types } from 'mongoose';
import {
  IProductionListFilter,
  IProductProvisioning,
} from 'src/products/product.helper';
import { IPublicationsListFilter } from 'src/publication/publication.helper';
import { EReactionsType } from 'src/reactions/reactions.helpers';

export abstract class IGenericRepository<T> {
  abstract findAll(ignoreAttributes: string): Promise<T[]>;

  abstract findOne(code: string, ignoreAttributes: string): Promise<T>;

  abstract create(item: T): Promise<T>;

  abstract update(code: string, update: any): Promise<T>;

  abstract findAllByCodes(
    codes: string[],
    filterAttributes: string,
  ): Promise<T[]>;
}

export abstract class IUserRepository<T> {
  abstract authentification(phone: string, password: string): Promise<T>;
  abstract updatePushTokens(code: string, pushtoken: string): Promise<T>;
  abstract findByPhoneNumber(phone: string): Promise<T>;
  abstract linkPublicationToUser(
    code: string,
    idPublication: Types.ObjectId,
  ): Promise<T>;
  abstract findByPseudo(pseudo: string): Promise<T>;
  abstract getAccountInfos(code: string): Promise<any[]>;
  abstract addAccountFollower(
    idUser: Types.ObjectId,
    accountToFlowId: Types.ObjectId,
  ): Promise<T>;
  abstract subscribeAccount(
    idUser: Types.ObjectId,
    accountSubscribedId: Types.ObjectId,
  ): Promise<T>;
  abstract removeAccountFollower(
    idUser: Types.ObjectId,
    accountToFlowId: Types.ObjectId,
  ): Promise<T>;
  abstract unSubscribeAccount(
    idUser: Types.ObjectId,
    accountSubscribedId: Types.ObjectId,
  ): Promise<T>;
}

export abstract class IPublicationRepository<T> {
  abstract linkMediasToPublication(
    code: string,
    mediasId: Types.ObjectId[],
  ): Promise<T>;
  abstract getPublicationInfoByCode(code: string): Promise<T>;
  abstract getPublicationsList(filter: IPublicationsListFilter): Promise<any[]>;
  abstract populateMediasAndColorsOptions(value: any): Promise<any>;
  abstract addNewView(code: string, viewId: Types.ObjectId): Promise<T>;
  abstract addNewReaction(
    code: string,
    reactionId: Types.ObjectId,
    type: EReactionsType,
  ): Promise<T>;
  abstract removeReaction(
    code: string,
    reactionId: Types.ObjectId,
    type: EReactionsType,
  ): Promise<T>;
}

export abstract class IMediaRepository<T> {
  abstract insertMany(items: T[]): Promise<T[]>;
}
export abstract class ISectionRepository<T> {
  abstract insertMany(items: T[]): Promise<T[]>;
  abstract linkCategoriesToSection(
    code: string,
    categoriesIds: Types.ObjectId[],
  ): Promise<T>;
  abstract listSections(): Promise<any[]>;
}

export abstract class ICategoryRepository<T> {
  abstract insertMany(items: T[]): Promise<T[]>;
}

export abstract class IProductRepository<T> {
  abstract insertMany(items: T[]): Promise<T[]>;
  abstract linkMediasProductColor(
    code: string,
    values: { value: string; media: Types.ObjectId }[],
  ): Promise<T>;
  abstract linkMediasToProduct(
    code: string,
    values: Types.ObjectId[],
  ): Promise<T>;
  abstract getProductInfos(code: string): Promise<any[]>;
  abstract populateProductColors(
    product: any,
    populateOptions: any[],
  ): Promise<any>;
  abstract getPublicationsList(filter: IProductionListFilter): Promise<any[]>;
  abstract linkPublicationToProduct(
    code: string,
    idPublication: Types.ObjectId,
  ): Promise<T>;
  abstract provisioningProduct(value: IProductProvisioning): Promise<T>;
}

export abstract class IProvisioningRepository<T> {}

export abstract class IPublicationViewRepository<T> {}

export abstract class IReactionsRepository<T> {
  abstract getUserLikeOrRecordForPublication(
    user: Types.ObjectId,
    publication: Types.ObjectId,
    type: EReactionsType,
  ): Promise<T>;
}
