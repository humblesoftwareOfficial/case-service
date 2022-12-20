import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DataServicesModule } from '../core/abstracts/GR-data-services-module';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController],
  imports: [DataServicesModule],
})
export class CategoriesModule {}
