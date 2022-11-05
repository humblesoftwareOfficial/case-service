/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getWeekNumber } from 'src/shared/date.helpers';
import { codeGenerator } from 'src/shared/utils';
import { fail, Result, succeed } from '../config/htt-response';
import { IDataServices } from '../core/generics/data.services.abstract';
import { NewPublicationViewDto } from './publication-view.dto';

@Injectable()
export class PublicationViewService {
  constructor(private dataServices: IDataServices) {}

  async registerNewView(value: NewPublicationViewDto): Promise<Result> {
    try {
      let publicationFrom = null;
      const user = await this.dataServices.users.findOne(value.user, 'code');
      if (!user) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: 'Not found resource',
        });
      }
      const publication = await this.dataServices.publications.findOne(
        value.publication,
        'code',
      );
      if (!publication) {
        return fail({
          code: HttpStatus.NOT_FOUND,
          message: 'Publication not found',
          error: 'Not found resource',
        });
      }

      if (value.publicationFrom) {
        publicationFrom = await this.dataServices.publications.findOne(
          value.publicationFrom,
          'code',
        );
        if (!publicationFrom) {
          return fail({
            code: HttpStatus.NOT_FOUND,
            message: 'Publication from not found',
            error: 'Not found resource',
          });
        }
      }
      const creationDate = new Date();
      const publicationView = {
        code: codeGenerator('PVI'),
        createdAt: creationDate,
        lastUpdatedAt: creationDate,
        week: getWeekNumber(creationDate),
        month: creationDate.getMonth() + 1,
        year: creationDate.getFullYear(),
        user: user['_id'],
        publication: publication['_id'],
        publicationFrom: publicationFrom ? publicationFrom['_id'] : null,
        isInPromotion: false,
      };
      const createdViewPublication =
        await this.dataServices.publicationView.create(publicationView);
      await this.dataServices.publications.addNewView(
        publication.code,
        createdViewPublication['_id'],
      );
      return succeed({
        code: HttpStatus.OK,
        data: {
          user: user.code,
          publication: publication.code,
          viewed: true,
        },
        message: 'View registered',
      });
    } catch (error) {
      console.log({ error });
      throw new HttpException(
        `Error while registering new view. Try again.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
