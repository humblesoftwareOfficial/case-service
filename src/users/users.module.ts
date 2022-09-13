import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DataServicesModule } from '../core/abstracts/GR-data-services-module';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.entity';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    // MongooseModule.forFeature([
    //   {
    //     name: User.name,
    //     schema: UserSchema,
    //   },
    // ]),
    DataServicesModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
