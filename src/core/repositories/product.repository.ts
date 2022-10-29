/* eslint-disable prettier/prettier */
import { Model, Types } from 'mongoose';
import { IProductionListFilter, IProductProvisioning } from 'src/products/product.helper';
import { MongoGenericRepository } from '../abstracts/GR-mongo-generic-repository';
import { IProductRepository } from '../generics/generic.repository.abstract';

export class ProductRepository<T>
  extends MongoGenericRepository<T>
  implements IProductRepository<T>
{
  constructor(repository: Model<T>, populateOnFind: string[] = []) {
    super(repository, populateOnFind);
  }

  insertMany(items: T[]): Promise<T[]> {
    return this._repository.insertMany(items);
  }

  linkMediasProductColor(
    code: string,
    values: { value: string; media: Types.ObjectId }[],
  ): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            colors: { $each: values },
          },
        },
      )
      .exec();
  }

  linkMediasToProduct(code: string, values: Types.ObjectId[]): Promise<T> {
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            medias: values,
          },
        },
      )
      .exec();
  }

  getProductInfos(code: string): Promise<any[]> {
    return this._repository
      .aggregate([
        {
          $match: {
            code,
          },
        },
        {
          $lookup: {
            from: 'media',
            localField: 'medias',
            foreignField: '_id',
            as: 'medias',
          },
        },
        {
          $lookup: {
            from: 'sections',
            localField: 'section',
            foreignField: '_id',
            as: 'section',
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
          },
        },
        {
          $unwind: {
            path: '$section',
          },
        },
        {
          $unwind: {
            path: '$category',
          },
        },
        {
          $project: {
            _id: 0,
            code: 1,
            label: 1,
            description: 1,
            price: 1,
            createdAt: 1,
            priceHistory: 1,
            stock: 1,
            colors: 1,
            week: 1,
            month: 1,
            year: 1,
            isInPromotion: 1,
            'section.code': 1,
            'section.label': 1,
            'section.description': 1,
            'category.code': 1,
            'category.label': 1,
            'category.description': 1,
            'user.code': 1,
            'user.firstName': 1,
            'user.lastName': 1,
            'user.pseudo': 1,
            'medias.code': 1,
            'medias.url': 1,
            'medias.type': 1,
            publications: { $cond: { if: { $isArray: "$publications" }, then: { $size: "$publications" }, else: 0} },
          },
        },
      ])
      .exec();
  }

  populateProductColors(product: any, populateOptions: any[]): Promise<any> {
    return this._repository.populate(product, populateOptions);
  }

  getPublicationsList(filter: IProductionListFilter): Promise<any[]> {
    const priceFilter = parseInt(filter.searchTerm) || null;
    return this._repository
      .aggregate([
        {
          $match: {
            ...(filter.week && {
              week: filter.week,
            }),
            ...(filter.month && {
              month: filter.month,
            }),
            ...(filter.year && {
              year: filter.year,
            }),
            ...(filter.user && {
              user: filter.user,
            }),
            ...(filter.isInPromotion != null &&
              filter.isInPromotion != undefined && {
                isInPromotion: filter.isInPromotion,
              }),
            ...(priceFilter && {
              price: priceFilter,
            }),
            ...(filter.searchTerm &&
              !priceFilter && {
                $or: [
                  {
                    label: {
                      $regex: new RegExp(filter.searchTerm, 'i'),
                    },
                  },
                  {
                    description: {
                      $regex: new RegExp(filter.searchTerm, 'i'),
                    },
                  },
                ],
              }),
            isDeleted: false,
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $facet: {
            count: [
              {
                $group: {
                  _id: null,
                  value: {
                    $sum: 1,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
            data: [
              {
                $skip: filter.skip,
              },
              {
                $limit: filter.limit,
              },
            ],
          },
        },
        {
          $unwind: {
            path: '$count',
          },
        },
        {
          $unwind: {
            path: '$data',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'data.user',
            foreignField: '_id',
            as: 'data.user',
          },
        },
        {
          $lookup: {
            from: 'media',
            localField: 'data.medias',
            foreignField: '_id',
            as: 'data.medias',
          },
        },
        {
          $lookup: {
            from: 'sections',
            localField: 'data.section',
            foreignField: '_id',
            as: 'data.section',
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'data.category',
            foreignField: '_id',
            as: 'data.category',
          },
        },
        {
          $unwind: {
            path: '$data.user',
          },
        },
        {
          $unwind: {
            path: '$data.section',
          },
        },
        {
          $unwind: {
            path: '$data.category',
          },
        },
        {
          $project: {
            total: '$count.value',
            code: '$data.code',
            label: '$data.label',
            description: '$data.description',
            price: '$data.price',
            createdAt: '$data.createdAt',
            priceHistory: '$data.priceHistory',
            stock: '$data.stock',
            week: '$data.week',
            month: '$data.month',
            year: '$data.year',
            isInPromotion: '$data.isInPromotion',
            'section.code': '$data.section.code',
            'section.label': '$data.section.label',
            'section.description': '$data.section.description',
            'category.code': '$data.category.code',
            'category.label': '$data.category.label',
            'category.description': '$data.category.description',
            'user.code': '$data.user.code',
            'user.firstName': '$data.user.firstName',
            'user.lastName': '$data.user.lastName',
            'user.pseudo': '$data.user.pseudo',
            medias: '$data.medias',
            colors: '$data.colors',
            publications: { $cond: { if: { $isArray: "$data.publications" }, then: { $size: "$data.publications" }, else: 0} },
          },
        },
      ])
      .exec();
  }

  linkPublicationToProduct(code: string, idPublication: Types.ObjectId): Promise<T> { 
    return this._repository
      .findOneAndUpdate(
        { code },
        {
          $addToSet: {
            publications: idPublication,
          },
        },
      )
      .exec();
  }

  provisioningProduct(value: IProductProvisioning): Promise<T> {
    return this._repository.findOneAndUpdate({ code: value.product }, {
      stock: value.newStock,
      $addToSet: {
        provisions: value.provisionId,
      }
    }).exec()
  }
}
