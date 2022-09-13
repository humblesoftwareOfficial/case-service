/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Media, MediaSchema } from '../../medias/medias.entity';
import { Publication, PublicationSchema } from '../../publication/publication.entity';
import { User, UserSchema } from '../../users/users.entity';
import { IDataServices } from '../generics/data.services.abstract';
import { MongoDataServices } from './GR-mongo-data-services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Publication.name, schema: PublicationSchema },
      { name: Media.name, schema: MediaSchema },
    ]),
    // MongooseModule.forRoot(DATA_BASE_CONFIGURATION.mongoConnectionString),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: IDataServices,
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
