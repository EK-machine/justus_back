import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('POSTGRES_HOST');
        const port = Number(configService.get<string>('POSTGRES_PORT'));
        const username = configService.get<string>('POSTGRES_USER');
        const password = configService.get<string>('POSTGRES_PASSWORD');
        const database = configService.get<string>('USERS_DB');
        return {
        type: 'postgres',
        host,
        port,
        username,
        password,
        database,
        synchronize: false,
        entities: [__dirname + '/entities/**/*.entity.{ts,js}'],
        autoLoadEntities: true
      }},
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
