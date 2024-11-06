import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserData } from 'libs/types/user.types';
import { CreateUserDto } from '../dto/user/createUser.dto';
import { UpdateUserDto } from '../dto/user/updateUser.dto';
import { LoginDto } from '../dto/user/login.dto';
import { AuthGuard } from 'libs/guards/auth.guard';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GetRefreshToken } from 'libs/decorators/get-rt.decorator';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  get(): Promise<IUserData[]> {
    return this.userService.get();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: string): Promise<IUserData> {
    return this.userService.getById(Number(id));
  }

  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateUserDto): Promise<{id: number}> {
    return this.userService.create(body);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async udate(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<IUserData> {
    return await this.userService.udate({ id: Number(id), ...body });
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
  ): Promise<boolean>  {
    return await this.userService.delete(Number(id));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const key = this.configService.get<string>('SECRET_KEY') as string;
    const data = await this.userService.login(dto);
    
    response.cookie(key, data.rt, { httpOnly: true });
    return data.at;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @GetRefreshToken() rt: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    // todo decorator to get user email or
    // todo dto
    const key = this.configService.get<string>('SECRET_KEY') as string;
    response.clearCookie(key);
    return this.userService.logout(rt);
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetRefreshToken() rt: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    // todo decorator to get user email or
    // todo dto
    // todo check if email is needed
    const data = await this.userService.refresh(rt);
    const key = this.configService.get<string>('SECRET_KEY') as string;
    response.cookie(key, data.rt, { httpOnly: true });
    return data.at;
  }
}
