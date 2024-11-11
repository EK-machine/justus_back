import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { IRole, IRule } from 'libs/types/rbac.types';
import { RbacService } from './rbac.service';
import { GetRolesDto } from '../dto/rbac/getRoles.dto';
import { CreateRoleDto } from '../dto/rbac/createRole.dto';
import { UpdateRoleDto } from '../dto/rbac/updateRole.dto';
import { RulesToRoleDto } from '../dto/rbac/rulesToRole.dto';
import { RoleToUserDto } from '../dto/rbac/roleToUser.dto';
import { Method } from 'libs/decorators/method.decorator';
import { AuthGuard } from 'libs/guards/auth.guard';
import { RBACGuard } from 'libs/guards/rbac.guard';
import { Methods } from 'libs/consts/methods';

@Controller('rbac')
@UseGuards(AuthGuard, RBACGuard)
@UsePipes(new ValidationPipe())
export class RbacController {
  constructor(
    private readonly rbacService: RbacService,
  ) {}

  @Get('roles')
  @Method([Methods.RBAC_GET_ROLES])
  @HttpCode(HttpStatus.OK)
  getRoles(@Body() dto: GetRolesDto ): Promise<IRole[]> {
    return this.rbacService.getRoles(dto.withRules);
  }

  @Get('roles/:id')
  @Method([Methods.RBAC_GET_ROLE_BY_ID])
  @HttpCode(HttpStatus.OK)
  getRoleById(@Param('id') id: string, @Body() dto: GetRolesDto): Promise<IRole> {
    return this.rbacService.getRoleById(Number(id), dto.withRules);
  }

  @Post('roles/create')
  @Method([Methods.RBAC_CREATE_ROLE])
  @HttpCode(HttpStatus.CREATED)
  create(@Body() body: CreateRoleDto): Promise<{id: number}> {
    return this.rbacService.create(body);
  }

  @Patch('roles/update/:id')
  @Method([Methods.RBAC_UPDATE_ROLE])
  @HttpCode(HttpStatus.OK)
  async udate(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
  ): Promise<IRole> {
    return await this.rbacService.udate({ id: Number(id), ...body });
  }

  @Delete('roles/delete/:id')
  @Method([Methods.RBAC_DELETE_ROLE])
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id') id: string,
  ): Promise<boolean>  {
    return await this.rbacService.delete(Number(id));
  }

  @Get('rules')
  @Method([Methods.RBAC_GET_RULES])
  @HttpCode(HttpStatus.OK)
  getRules(): Promise<IRule[]> {
    return this.rbacService.getRules();
  }

  @Post('roles/add-rules/:id')
  @Method([Methods.RBAC_ADD_RULES_TO_ROLE])
  @HttpCode(HttpStatus.CREATED)
  addRules(@Param('id') id: string, @Body() body: RulesToRoleDto): Promise<boolean> {
    return this.rbacService.addRules({ id: Number(id), ...body });
  }

  @Delete('roles/del-rules/:id')
  @Method([Methods.RBAC_DEL_RULES_FROM_ROLE])
  @HttpCode(HttpStatus.OK)
  delRules(@Param('id') id: string, @Body() body: RulesToRoleDto): Promise<boolean> {
    return this.rbacService.delRules({ id: Number(id), ...body });
  }

  @Post('roles/add-roles/:id')
  @Method([Methods.RBAC_ADD_ROLE_TO_USER])
  @HttpCode(HttpStatus.CREATED)
  addRoles(@Param('id') role_id: string, @Body() body: RoleToUserDto): Promise<boolean> {
    return this.rbacService.addRoles({ role_id: Number(role_id), user_id: body.user_id });
  }

  @Delete('roles/del-roles/:id')
  @Method([Methods.RBAC_DEL_ROLE_FROM_USER])
  @HttpCode(HttpStatus.CREATED)
  delRoles(@Param('id') role_id: string, @Body() body: RoleToUserDto): Promise<boolean> {
    return this.rbacService.delRoles({ role_id: Number(role_id), user_id: body.user_id });
  }
}
