import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';
import { fail, Result, succeed } from 'src/config/htt-response';
import { IDataServices } from 'src/core/generics/data.services.abstract';
import { NewMediaDto } from 'src/medias/medias.dto';
import { getWeekNumber, stringToDate } from 'src/shared/date.helpers';
import { codeGenerator, ErrorMessages } from 'src/shared/utils';
import {
  NewProductDto,
  ProductColorDto,
  ProductsListDto,
  ProductStockProvisioningDto,
} from './product.dto';
import { Product } from './products.entity';

const PopulateOptions = [
  {
    path: 'colors.media',
    select: '-_id code url type',
    model: 'Media',
  },
];

@Injectable()
export class ProductsService {
  constructor(private dataServices: IDataServices) {}

  async create(value: NewProductDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(value.user, 'code');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const category = await this.dataServices.category.findOne(
        value.category,
        'code section',
      );
      if (!category) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Category not found',
          error: 'Not found resource',
        });
      }
      const creationDate = new Date();
      const product = {
        code: codeGenerator('PRO'),
        label: value.label,
        description: value.description,
        price: value.price,
        devise: value.devise,
        stock: {
          ...value.stock,
          expirationDate: value.stock.expirationDate
            ? stringToDate(value.stock.expirationDate)
            : null,
        },
        isInPromotion: value.isInPromotion || false,
        user: user['_id'],
        section: category.section,
        category: category['_id'],
        tags: value.tags || [],
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        medias: [],
        colors: [],
        publications: [],
        priceHistory: [
          {
            date: creationDate,
            price: value.price,
            week: getWeekNumber(creationDate),
            month: creationDate.getMonth() + 1,
            year: creationDate.getFullYear(),
            isInPromotion: value.isInPromotion || false,
          },
        ],
      };
      const createdProduct = await this.dataServices.product.create(product);
      if (value.colors) {
        await this.__createProductColorsMedia(
          value.colors,
          createdProduct['_id'],
          createdProduct.code,
        );
      }
      if (value.medias) {
        await this.__createMedias(
          value.medias,
          createdProduct['_id'],
          createdProduct.code,
        );
      }
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          code: createdProduct.code,
        },
      });
    } catch (error) {
      console.log({ error });
      throw new HttpException(
        `Error while creating new publication. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(code: string): Promise<Result> {
    try {
      const result = await this.dataServices.product.getProductInfos(code);
      if (!result?.length) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Product not found',
          error: 'Not found resource!',
        });
      }
      const product = result[0];
      await this.dataServices.product.populateProductColors(
        product,
        PopulateOptions,
      );
      return succeed({
        code: HttpStatus.OK,
        data: product,
      });
    } catch (error) {
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async list(filter: ProductsListDto): Promise<Result> {
    try {
      const skip = (filter.page - 1) * filter.limit;
      let user = null;
      if (filter.user) {
        user = await this.dataServices.users.findOne(filter.user, '_id');
        if (!user) {
          return fail({
            code: HttpStatus.NOT_FOUND,
            message: 'User not found',
            error: 'Not found resource!',
          });
        }
      }
      const result = await this.dataServices.product.getPublicationsList({
        ...filter,
        skip,
        user: user ? user['_id'] : undefined,
      });
      if (!result?.length) {
        return succeed({
          code: HttpStatus.OK,
          data: {
            total: 0,
            publications: [],
          },
        });
      }
      const total = result[0].total;
      const products = result.flatMap((p) => ({
        ...p,
        medias:
          p.medias?.flatMap((m) => ({
            code: m.code,
            url: m.url,
            type: m.type,
          })) || [],
        total: undefined,
      }));
      await this.dataServices.product.populateProductColors(
        products,
        PopulateOptions,
      );
      return succeed({
        code: HttpStatus.OK,
        data: {
          total,
          products,
        },
      });
    } catch (error) {
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async provisioning(provision: ProductStockProvisioningDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(
        provision.author,
        'code',
      );
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const product = await this.dataServices.product.findOne(
        provision.product,
        'code user stock',
      );
      if (!product) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Product not found',
          error: 'Not found resource',
        });
      }
      console.log({ user });
      console.log({ product });
      const userId = user['_id'].toString();
      const productOwner = product.user.toString();
      if (userId !== productOwner) {
        return fail({
          code: HttpStatus.UNAUTHORIZED,
          message: 'Not authorized action',
          error: 'Not authorized action',
        });
      }
      const creationDate = new Date();
      const date = stringToDate(provision.date);
      const week = getWeekNumber(date);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const newStockValue = product.stock.quantity + provision.value;
      const newProvision = {
        code: codeGenerator('SPV'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        value: provision.value,
        date: creationDate,
        week,
        month,
        year,
        product: product['_id'],
        user: user['_id'],
        oldStockValue: product.stock.quantity,
        newStockValue,
      };
      const createdProvisioning = await this.dataServices.provisioning.create(
        newProvision,
      );
      await this.dataServices.product.provisioningProduct({
        newStock: {
          ...product.stock,
          quantity: newStockValue,
        },
        product: product['_id'],
        provisionId: createdProvisioning['_id'],
      });
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          code: product.code,
          stock: {
            ...product.stock,
            quantity: newProvision.newStockValue,
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        'Error while provisioning product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async __createProductColorsMedia(
    colors: ProductColorDto[],
    productId: Types.ObjectId,
    productCode: string,
  ) {
    try {
      const createdMedias = [];
      for (let i = 0; i < colors.length; i++) {
        const creationDate = new Date();
        const media = {
          code: codeGenerator('MED'),
          url: colors[i].url,
          description: colors[i].description,
          price: colors[i].price,
          type: colors[i].type,
          createdAt: creationDate,
          lastUpdatedAt: creationDate,
          week: getWeekNumber(creationDate),
          month: creationDate.getMonth() + 1,
          year: creationDate.getFullYear(),
          onModel: Product.name,
          entity: productId,
        };
        const result = await this.dataServices.medias.create(media);
        createdMedias.push({
          value: colors[i].value,
          media: result['_id'],
        });
      }
      await this.dataServices.product.linkMediasProductColor(
        productCode,
        createdMedias,
      );
    } catch (error) {
      return null;
    }
  }

  async __createMedias(
    medias: NewMediaDto[],
    productId: Types.ObjectId,
    productCode: string,
  ) {
    const createdMedias = [];
    for (let i = 0; i < medias.length; i++) {
      const creationDate = new Date();
      const newMedia = {
        ...medias[i],
        code: codeGenerator('MED'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        onModel: Product.name,
        entity: productId,
      };
      const result = await this.dataServices.medias.create(newMedia);
      createdMedias.push(result['_id']);
    }
    await this.dataServices.product.linkMediasToProduct(
      productCode,
      createdMedias,
    );
  }
}
