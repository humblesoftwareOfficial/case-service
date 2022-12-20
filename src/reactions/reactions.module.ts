import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { DataServicesModule } from '../core/abstracts/GR-data-services-module';

@Module({
  providers: [ReactionsService],
  controllers: [ReactionsController],
  imports: [DataServicesModule],
})
export class ReactionsModule {}
