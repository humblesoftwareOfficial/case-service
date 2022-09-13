import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { fail, Result, succeed } from 'src/config/htt-response';

import { IDataServices } from '../core/generics/data.services.abstract';
import { ErrorMessages } from '../shared/utils';

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
}
