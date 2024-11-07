import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { IRole, IRule } from 'libs/types/rbac.types';
import { RbacService } from './rbac.service';
import { GetRolesDto } from '../dto/rbac/getRoles.dto';
import { CreateRoleDto } from '../dto/rbac/createRole.dto';
import { UpdateRoleDto } from '../dto/rbac/updateRole.dto';
import { RulesToRoleDto } from '../dto/rbac/rulesToRole.dto';
import { RoleToUserDto } from '../dto/rbac/roleToUser.dto';

@Controller('rbac')
@UsePipes(new ValidationPipe())
export class RbacController {
  constructor(
    private readonly rbacService: RbacService,
  ) {}

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  getRoles(@Body() dto: GetRolesDto ): Promise<IRole[]> {
    return this.rbacService.getRoles(dto.withRules);
  }

  @Get('roles/:id')
  @HttpCode(HttpStatus.OK)
  getRoleById(@Param('id') id: string, @Body() dto: GetRolesDto): Promise<IRole> {
    return this.rbacService.getRoleById(Number(id), dto.withRules);
  }

  @Post('roles/create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateRoleDto): Promise<{id: number}> {
    return this.rbacService.create(body);
  }

  @Patch('roles/update/:id')
  @HttpCode(HttpStatus.OK)
  async udate(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
  ): Promise<IRole> {
    return await this.rbacService.udate({ id: Number(id), ...body });
  }

  @Delete('roles/delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
  ): Promise<boolean>  {
    return await this.rbacService.delete(Number(id));
  }

  @Get('rules')
  @HttpCode(HttpStatus.OK)
  getRules(): Promise<IRule[]> {
    return this.rbacService.getRules();
  }

  @Post('roles/add-rules/:id')
  @HttpCode(HttpStatus.CREATED)
  addRules(@Param('id') id: string, @Body() body: RulesToRoleDto): Promise<boolean> {
    return this.rbacService.addRules({ id: Number(id), ...body });
  }

  @Delete('roles/del-rules/:id')
  @HttpCode(HttpStatus.OK)
  delRules(@Param('id') id: string, @Body() body: RulesToRoleDto): Promise<boolean> {
    return this.rbacService.delRules({ id: Number(id), ...body });
  }

  @Post('roles/add-roles/:id')
  @HttpCode(HttpStatus.CREATED)
  addRoles(@Param('id') role_id: string, @Body() body: RoleToUserDto): Promise<boolean> {
    return this.rbacService.addRoles({ role_id: Number(role_id), user_id: body.user_id });
  }

  @Delete('roles/del-roles/:id')
  @HttpCode(HttpStatus.CREATED)
  delRoles(@Param('id') role_id: string, @Body() body: RoleToUserDto): Promise<boolean> {
    return this.rbacService.delRoles({ role_id: Number(role_id), user_id: body.user_id });
  }
}
