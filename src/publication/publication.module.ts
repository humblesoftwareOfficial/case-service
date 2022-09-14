import { Module } from '@nestjs/common';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { DataServicesModule } from '../core/abstracts/GR-data-services-module';

@Module({
  providers: [PublicationService],
  controllers: [PublicationController],
  imports: [DataServicesModule],
  exports: [PublicationService],
})
export class PublicationModule {}
