/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EMediaType } from 'src/core/entities/Media';

import { getWeekNumber } from '../shared/date.helpers';
import { codeGenerator } from '../shared/utils';
import { Media, MediaDocument } from './medias.entity';

interface INewMedia {
  url: string;
  type: EMediaType;
  onModel: string;
  entity: Types.ObjectId;
  description?: string;
  price?: number;
}


@Injectable()
export class MediasExtraService {
  constructor(
    @InjectModel(Media.name)
    private readonly model: Model<MediaDocument>,
  ) {}

  async __newMedia({
    url,
    type,
    onModel,
    entity,
    description,
    price,
  }: INewMedia) {
    const creationDate = new Date();
    const week = getWeekNumber(creationDate);
    const month = creationDate.getMonth() + 1;
    const year = creationDate.getFullYear();
    const media = {
      code: codeGenerator('MED'),
      createdAt: creationDate,
      lastUpdatedAt: creationDate,
      week,
      month,
      year,
      url,
      type,
      onModel,
      entity,
      price,
      description,
    };
    return await this.model.create(media);
  }

  async __findOne(code: string) {
    return await this.model.findOne({ code });
  }
}
