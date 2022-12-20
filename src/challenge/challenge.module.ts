import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DataServicesModule } from '../core/abstracts/GR-data-services-module';
import { UserInterceptorMiddleware } from '../middlewares/user-interceptor.middleware';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService],
  imports: [DataServicesModule],
  exports: [ChallengeService],
})
export class ChallengeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(UserInterceptorMiddleware).forRoutes('/challenge');
  }
}
