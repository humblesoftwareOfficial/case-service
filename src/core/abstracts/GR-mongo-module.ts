/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../../categories/categories.entity';
import { Section, SectionSchema } from '../..//sections/sections.entity';

import { Media, MediaSchema } from '../../medias/medias.entity';
import {
  Publication,
  PublicationSchema,
} from '../../publication/publication.entity';
import { User, UserSchema } from '../../users/users.entity';
import { IDataServices } from '../generics/data.services.abstract';
import { MongoDataServices } from './GR-mongo-data-services';
import { Product, ProductSchema } from '../../products/products.entity';
import { StockProvisioning, StockProvisioningSchema } from '../../products/stock-provisioning.entity';
import { PublicationView, PublicationViewSchema } from '../../publication-view/publication-view.entity';
import { Reactions, ReactionsSchema } from '../../reactions/reactions.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Publication.name, schema: PublicationSchema },
      { name: Media.name, schema: MediaSchema },
      { name: Section.name, schema: SectionSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: StockProvisioning.name, schema: StockProvisioningSchema },
      { name: PublicationView.name, schema: PublicationViewSchema },
      { name: Reactions.name, schema: ReactionsSchema },
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
