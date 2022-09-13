import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediasController } from './medias.controller';
import { Media, MediaSchema } from './medias.entity';
import { MediasExtraService } from './medias.extra.service';
import { MediasService } from './medias.service';
import { DataServicesModule } from '../core/abstracts/GR-data-services-module';

@Module({
  controllers: [MediasController],
  providers: [MediasService],
  imports: [DataServicesModule],
  exports: [],
})
export class MediasModule {}
