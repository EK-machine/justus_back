import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserData } from 'libs/types/user.types';
import { CreateUserDto } from '../dto/user/createUser.dto';
import { UpdateUserDto } from '../dto/user/updateUser.dto';
import { LoginDto } from '../dto/user/login.dto';
import { AuthGuard } from 'libs/guards/auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GetRT } from 'libs/decorators/get-rt.decorator';
import { Method } from 'libs/decorators/method.decorator';
import { Methods } from 'libs/consts/methods';
import { RBACGuard } from 'libs/guards/rbac.guard';
import { GetUserId } from 'libs/decorators/get-user-id.decorator';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @Method([Methods.USERS_GET])
  @UseGuards(AuthGuard, RBACGuard)
  @HttpCode(HttpStatus.OK)
  get(): Promise<IUserData[]> {
    return this.userService.get();
  }

  @Get(':id')
  @Method([Methods.USERS_GET_BY_ID])
  @UseGuards(AuthGuard, RBACGuard)
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string): Promise<IUserData> {
    return this.userService.getById(Number(id));
  }

  @Post('create')
  @Method([Methods.USERS_CREATE])
  @UseGuards(AuthGuard, RBACGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @GetUserId() currentUserId,
    @Body() body: CreateUserDto,
  ): Promise<{id: number}> {
    return this.userService.create(body, currentUserId);
  }

  @Patch('update/:id')
  @Method([Methods.USERS_UPDATE])
  @UseGuards(AuthGuard, RBACGuard)
  @HttpCode(HttpStatus.OK)
  async udate(
    @GetUserId() currentUserId,
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<IUserData> {
    return await this.userService.udate({ id: Number(id), ...body }, currentUserId);
  }

  @Delete('delete/:id')
  @Method([Methods.USERS_DELETE])
  @UseGuards(AuthGuard, RBACGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @GetUserId() currentUserId,
    @Param('id') id: string,
  ): Promise<boolean>  {
    return await this.userService.delete(Number(id), currentUserId);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{
    superAdmin: boolean,
    at: string, 
  }> {
    const key = this.configService.get<string>('SECRET_KEY') as string;
    const user_key = this.configService.get<string>('USER_ID_KEY') as string;
    const data = await this.userService.login(dto);
    
    response.cookie(key, data.atrt.rt, { httpOnly: true });
    response.cookie(user_key, data.userId, { httpOnly: true });
    const superAdmin = data.userId === 1;
    return {
      superAdmin,
      at: data.atrt.at, 
    };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetRT() rt: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    const logoutResult = await this.userService.logout(rt);
    if(logoutResult) {
      const key = this.configService.get<string>('SECRET_KEY') as string;
      const user_key = this.configService.get<string>('USER_ID_KEY') as string;
      response.clearCookie(key);
      response.clearCookie(user_key);
    }
    return logoutResult;
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetRT() rt: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.userService.refresh(rt);
    const key = this.configService.get<string>('SECRET_KEY') as string;
    response.cookie(key, data.rt, { httpOnly: true });
    return data.at;
  }
}
