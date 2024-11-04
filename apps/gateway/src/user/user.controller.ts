import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { IUserData } from 'libs/types/user.types';
import { CreateUserDto } from '../dto/user/createUser.dto';
import { UpdateUserDto } from '../dto/user/updateUser.dto';

@Controller('users')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  get(): Promise<IUserData[]> {
    return this.userService.get();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getById(@Param('id') id: number): Promise<IUserData> {
    return this.userService.getById(Number(id));
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateUserDto): Promise<{id: number}> {
    return this.userService.create(body);
  }

  @Patch('update/:id')
  @HttpCode(HttpStatus.OK)
  async udate(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<{id: number}> {
    return await this.userService.udate({ id: Number(id), ...body });
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
  ): Promise<boolean>  {
    return await this.userService.delete(Number(id));
  }
}
