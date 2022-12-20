import { Module } from '@nestjs/common';
import { DataServicesModule } from '../core/abstracts/GR-data-services-module';
import { PublicationViewController } from './publication-view.controller';
import { PublicationViewService } from './publication-view.service';

@Module({
  controllers: [PublicationViewController],
  providers: [PublicationViewService],
  imports: [DataServicesModule],
})
export class PublicationViewModule {}
