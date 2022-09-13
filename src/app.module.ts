import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataServicesModule } from './core/abstracts/GR-data-services-module';
import { MediasModule } from './medias/medias.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PublicationModule } from './publication/publication.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules:
      envFilePath: ['.env', `.${process.env.NODE_ENV}.env`],
    }),
    // MongooseModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     uri: configService.get<string>('DB_URL'),
    //   }),
    //   inject: [ConfigService],
    // }),
    UsersModule,
    AuthModule,
    PublicationModule,
    MediasModule,
    DataServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(ConfidenceMiddleware).forRoutes(TontineController);
    consumer.apply(LoggerMiddleware).forRoutes('/');
  }
}
