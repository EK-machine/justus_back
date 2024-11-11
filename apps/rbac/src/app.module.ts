import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role/role.module';
import { RuleModule } from './rule/rule.module';
import { RoleRulesModule } from './role_rules/role_rules.module';
import { RolesUsersModule } from './roles_users/roles_users.module';
import { HealthModule } from './health/health.module';

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
        const database = configService.get<string>('RBAC_DB');
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
    RoleModule,
    RuleModule,
    RoleRulesModule,
    RolesUsersModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
