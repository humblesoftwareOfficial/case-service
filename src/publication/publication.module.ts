import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { PublicationController } from './publication.controller';
import { Publication, PublicationSchema } from './publication.entity';
import { PublicationService } from './publication.service';

@Module({
  providers: [],
  controllers: [PublicationController],
  // imports: [
  //   MongooseModule.forFeature([
  //     {
  //       name: Publication.name,
  //       schema: PublicationSchema,
  //     },
  //   ]),
  //   UsersModule,
  // ],
  exports: [],
})
export class PublicationModule {}
