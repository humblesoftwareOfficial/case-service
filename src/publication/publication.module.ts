/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PublicationController } from './publication.controller';
import { PublicationService } from './publication.service';
import { DataServicesModule } from '../core/abstracts/GR-data-services-module';
import { UserInterceptorMiddleware } from '../middlewares/user-interceptor.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [PublicationService],
  controllers: [PublicationController],
  imports: [
    DataServicesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [PublicationService],
})
export class PublicationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserInterceptorMiddleware).forRoutes('/publication/new');
  }
}
