import { Injectable, HttpException } from '@nestjs/common';
import { IDataServices } from '../core/generics/data.services.abstract';
import { NewPublicationDto } from './publication.dto';
import { fail, Result, succeed } from '../config/htt-response';
import { HttpStatus } from '@nestjs/common/enums';
import { codeGenerator } from '../shared/utils';
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
        price: value.price,
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
}
