import { Injectable, HttpException } from '@nestjs/common';
import { IDataServices } from '../core/generics/data.services.abstract';
import {
  NewPublicationDto,
  NewPublicationFromProductDto,
  PublicationsListDto,
  UpdatePublicationDto,
} from './publication.dto';
import { fail, Result, succeed } from '../config/htt-response';
import { HttpStatus } from '@nestjs/common/enums';
import { codeGenerator, ErrorMessages } from '../shared/utils';
import { getWeekNumber } from '../shared/date.helpers';
import { JwtService } from '@nestjs/jwt';
import { Publication } from './publication.entity';
import { Types } from 'mongoose';

@Injectable()
export class PublicationService {
  constructor(
    private dataServices: IDataServices,
    private jwtService: JwtService,
  ) {}

  async create(value: NewPublicationDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(value.user, 'code');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const creationDate = new Date();
      const publication = {
        code: codeGenerator('PUB'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        label: value.label || '',
        description: value.description || '',
        price: value.price || null,
        type: value.type,
        medias: [],
        user: user['_id'],
        products: [],
        category: null,
        section: null,
        tags: [],
        views: [],
      };
      const createdPublication = await this.dataServices.publications.create(
        publication,
      );
      await this.dataServices.users.linkPublicationToUser(
        user.code,
        createdPublication['_id'],
      );
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          code: createdPublication.code,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while creating new publication. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(code: string): Promise<Result> {
    try {
      const publication =
        await this.dataServices.publications.getPublicationInfoByCode(code);
      if (!publication?.length) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Publication not found',
          error: 'Not found resource',
        });
      }
      await this.dataServices.publications.populateMediasAndColorsOptions(
        publication,
      );
      return succeed({
        code: HttpStatus.OK,
        data: publication[0] || null,
      });
    } catch (error) {
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async list(value: PublicationsListDto): Promise<Result> {
    try {
      const skip = (value.page - 1) * value.limit;
      let user = null;
      let section = null;
      if (value.user) {
        user = await this.dataServices.users.findOne(value.user, '_id code');
        if (!user) {
          return fail({
            code: HttpStatus.NOT_FOUND,
            message: 'User not found',
            error: 'Not found resource!',
          });
        }
      }
      if (value.section) {
        section = await this.dataServices.section.findOne(
          value.section,
          '_id code',
        );
        if (!section) {
          return fail({
            code: HttpStatus.NOT_FOUND,
            message: 'Section not found',
            error: 'Not found resource!',
          });
        }
      }
      const result = await this.dataServices.publications.getPublicationsList({
        ...value,
        skip,
        user: user ? user['_id'] : undefined,
        section: section ? section['_id'] : undefined,
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
      await this.dataServices.publications.populateMediasAndColorsOptions(
        result,
      );
      const total = result[0].total;
      const publications = result.flatMap((r) => ({
        ...r,
        total: undefined,
      }));
      return succeed({
        code: HttpStatus.OK,
        data: {
          total,
          publications,
        },
      });
    } catch (error) {
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(code: string, value: UpdatePublicationDto): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(
        value.user,
        '_id code',
      );
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const publication = await this.dataServices.publications.findOne(
        code,
        '-_id',
      );
      if (!publication) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      if (publication.user.toString() !== user['_id'].toString()) {
        return fail({
          code: HttpStatus.UNAUTHORIZED,
          message: 'Bad request',
          error: 'UNAUTHORIZED',
        });
      }
      const update = {
        ...(value.label && {
          label: value.label,
        }),
        ...(value.description && {
          description: value.description,
        }),
        ...(value.price && {
          price: value.price,
        }),
        ...(value.type && {
          type: value.type,
        }),
        lastUpdatedAt: new Date(),
      };
      const result = await this.dataServices.publications.update(
        publication.code,
        update,
      );
      if (!result) {
        return fail({
          code: HttpStatus.NOT_MODIFIED,
          message: '',
          error: '',
        });
      }
      return succeed({
        code: HttpStatus.OK,
        data: await this.dataServices.publications.getPublicationInfoByCode(
          code,
        ),
      });
    } catch (error) {
      throw new HttpException(
        `Error while updating publication. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createFromProduct(
    value: NewPublicationFromProductDto,
  ): Promise<Result> {
    try {
      const user = await this.dataServices.users.findOne(value.user, 'code');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const product = await this.dataServices.product.findOne(
        value.product,
        'code category section user',
      );
      if (!product) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const creationDate = new Date();
      const userId = user['_id'];
      const productOwner = product.user;
      if (userId?.toString() !== productOwner?.toString()) {
        //Add this to logs
        return fail({
          code: HttpStatus.BAD_REQUEST,
          message: 'Bad request',
          error: 'Bad request',
        });
      }
      const publication = {
        code: codeGenerator('PUB'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        label: value.label || '',
        description: value.description || '',
        price: value.price || null,
        type: value.type,
        medias: [],
        user: user['_id'],
        products: [product['_id']],
        section: product.section,
        category: product.category,
        tags: product.tags,
        views: [],
      };
      const createdPublication = await this.dataServices.publications.create(
        publication,
      );
      await this.dataServices.product.linkPublicationToProduct(
        product.code,
        createdPublication['_id'],
      );
      await this.dataServices.users.linkPublicationToUser(
        user.code,
        createdPublication['_id'],
      );
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          code: publication.code,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error while creating new publication. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async __registerPublicationView(
    userId: Types.ObjectId,
    publicationId: Types.ObjectId,
    publicationCode: string,
  ) {
    try {
      const creationDate = new Date();
      const publicationView = {
        code: codeGenerator('PVI'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        user: userId,
        publication: publicationId,
        publicationFrom: null, //publicationFrom ? publicationFrom['_id'] :
        isInPromotion: false,
      };
      const createdViewPublication =
        await this.dataServices.publicationView.create(publicationView);
      await this.dataServices.publications.addNewView(
        publicationCode,
        createdViewPublication['_id'],
      );
    } catch (error) {
      // console.log({ error });
    }
  }

  //LIKE UNLIKE  PUBLICATION
}
