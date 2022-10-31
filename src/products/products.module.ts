import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DataServicesModule } from 'src/core/abstracts/GR-data-services-module';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [DataServicesModule],
})
export class ProductsModule {}
