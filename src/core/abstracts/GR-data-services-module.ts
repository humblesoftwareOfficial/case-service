/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { MongoDataServicesModule } from './GR-mongo-module';

@Module({
  imports: [MongoDataServicesModule],
  exports: [MongoDataServicesModule],
})
export class DataServicesModule {}