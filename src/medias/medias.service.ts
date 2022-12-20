import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { fail, Result, succeed } from '../config/htt-response';

import { IDataServices } from '../core/generics/data.services.abstract';
import { ErrorMessages, codeGenerator } from '../shared/utils';
import { NewPublicationMediasDto } from './medias.dto';
import { getWeekNumber } from '../shared/date.helpers';
import { Publication } from '../publication/publication.entity';

@Injectable()
export class MediasService {
  constructor(private dataServices: IDataServices) {}

  async findAll(): Promise<Result> {
    try {
      const medias = await this.dataServices.medias.findAll('-_id -__v');
      if (!medias?.length) {
        return succeed({
          code: HttpStatus.OK,
          data: [],
        });
      }
      return succeed({
        code: HttpStatus.OK,
        data: medias,
      });
    } catch (error) {
      throw new HttpException(
        ErrorMessages.ERROR_GETTING_DATA,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMediasForPublication(
    value: NewPublicationMediasDto,
  ): Promise<Result> {
    try {
      const publication = await this.dataServices.publications.findOne(
        value.publication,
        'code',
      );
      if (!publication) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Publication not found!',
          error: 'Not found resource!',
        });
      }
      const creationDate = new Date();
      const newMedias = value.medias.flatMap((m) => ({
        ...m,
        code: codeGenerator('MED'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        onModel: Publication.name,
        entity: publication['_id'],
      }));
      const resultMedias = await this.dataServices.medias.insertMany(newMedias);
      const mediasId = resultMedias.flatMap((r) => r['_id']);
      await this.dataServices.publications.linkMediasToPublication(
        publication.code,
        mediasId,
      );
      return succeed({
        code: HttpStatus.CREATED,
        data: {
          medias: resultMedias.flatMap((r) => r.code),
        },
      });
    } catch (error) {
      console.log({ error });
      throw new HttpException(
        `Error while creating new media. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
