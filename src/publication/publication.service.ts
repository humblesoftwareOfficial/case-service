import { Injectable, HttpException } from '@nestjs/common';
import { IDataServices } from '../core/generics/data.services.abstract';
import { NewPublicationDto, PublicationsListDto } from './publication.dto';
import { fail, Result, succeed } from '../config/htt-response';
import { HttpStatus } from '@nestjs/common/enums';
import { codeGenerator, ErrorMessages } from '../shared/utils';
import { getWeekNumber } from '../shared/date.helpers';

@Injectable()
export class PublicationService {
  constructor(private dataServices: IDataServices) {}

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
      if (!publication) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Publication not found',
          error: 'Not found resource',
        });
      }
      return succeed({
        code: HttpStatus.OK,
        data: publication,
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
      const result = await this.dataServices.publications.getPublicationsList({
        ...value,
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
      console.log({ error })
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
