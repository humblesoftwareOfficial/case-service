/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataServicesModule } from './core/abstracts/GR-data-services-module';
import { MediasModule } from './medias/medias.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PublicationModule } from './publication/publication.module';
import { UsersModule } from './users/users.module';
import { SectionsModule } from './sections/sections.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { PublicationViewModule } from './publication-view/publication-view.module';
import { ReactionsModule } from './reactions/reactions.module';
import { ChallengeModule } from './challenge/challenge.module';
import { UserChatModule } from './user-chat/user-chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules:
      envFilePath: ['.env', `.${process.env.NODE_ENV}.env`],
    }),
    UsersModule,
    AuthModule,
    PublicationModule,
    MediasModule,
    DataServicesModule,
    SectionsModule,
    CategoriesModule,
    ProductsModule,
    PublicationViewModule,
    ReactionsModule,
    ChallengeModule,
    UserChatModule,
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
