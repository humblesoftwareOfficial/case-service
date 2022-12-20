import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { DataServicesModule } from '../core/abstracts/GR-data-services-module';

@Module({
  providers: [SectionsService],
  controllers: [SectionsController],
  imports: [DataServicesModule],
})
export class SectionsModule {}
