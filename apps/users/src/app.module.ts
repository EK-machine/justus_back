import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AtRtModule } from './atRt/at_rt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    UsersModule,
    AtRtModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
