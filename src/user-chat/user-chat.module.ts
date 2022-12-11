import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DataServicesModule } from 'src/core/abstracts/GR-data-services-module';
import { UserChatController } from './user-chat.controller';
import { UserChatService } from './user-chat.service';

@Module({
  controllers: [UserChatController],
  providers: [UserChatService],
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
      }),
      inject: [ConfigService],
    }),
    DataServicesModule,
  ],
})
export class UserChatModule {}
