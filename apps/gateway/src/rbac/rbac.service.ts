import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { IRmqResp } from 'libs/types/base.types';
import { IRole, IRule } from 'libs/types/rbac.types';
import { RBAC_CLIENT, RBAC_MSGS } from '@app/contracts/rbac';
import { CreateRoleDto } from '../dto/rbac/createRole.dto';
import { UpdateRolePayload } from '../dto/rbac/updateRole.dto';
import { RulesToRolePayload } from '../dto/rbac/rulesToRole.dto';
import { RoleToUserPayload } from '../dto/rbac/roleToUser.dto';
import { GetRolesDto } from '../dto/rbac/getRoles.dto';

@Injectable()
export class RbacService {
  constructor(@Inject(RBAC_CLIENT) private readonly rbacClient: ClientProxy) {}
  async getRoles(dto: GetRolesDto): Promise<IRole[]> {
    try {
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.GET_ROLES }, dto);
      const data = await firstValueFrom<IRmqResp<IRole[] | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error('роли не найдены');
      }

      return data.payload;
    } catch (error) {
      throw new NotFoundException(`Ошибка получения ролей: ${error.message}`);
    }
  }

  async getRoleById(id: number, dto: GetRolesDto): Promise<IRole> {
    try {
      const payload = { id, withRules: dto.withRules, withUsers: dto.withUsers };
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.GET_ROLE }, payload);
      const data = await firstValueFrom<IRmqResp<IRole | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error(`роль c id ${id} не найдена`);
      }

      return data.payload;
    } catch (error) {
      throw new NotFoundException(`Ошибка получения роли: ${error.message}`);
    }
  }

  async create(createPayload: CreateRoleDto): Promise<{id: number}> {
    try {
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.CREATE_ROLE }, createPayload);
      const data = await firstValueFrom<IRmqResp<{id: number} | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error(`роль с наименованием ${createPayload.name} не создана`);
      }
      return data.payload;
    }
    catch (error) {
      if(error.message.includes('duplicate key value')) {
        throw new ConflictException(`Ошибка создания роли: ${error.message}`)
      }
      throw new BadRequestException(`Ошибка создания роли: ${error.message}`);
    }
  }

  async udate(updatePayload: UpdateRolePayload): Promise<IRole> {
    try {
      if(updatePayload.id === 1) {
        throw new Error('ненвозможно обновить главную роль');
      }
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.UPDATE_ROLE }, updatePayload);
      const data = await firstValueFrom<IRmqResp<IRole | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error(`роль c id ${updatePayload.id} не обновлена`);
      }
      return data.payload;
    }
    catch (error) {
      throw new BadRequestException(`Ошибка обновления роли: ${error.message}`);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      if(id === 1) {
        throw new Error('ненвозможно удалить главную роль');
      }
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.DELETE_ROLE }, { id });
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error(`роль c id ${id} не удалось удалить`);
      }
      return data.payload;
    }
    catch (error) {
      if(error.message.includes('не существует')) {
        throw new ConflictException(`Ошибка удаления роли: ${error.message}`)
      }
      throw new BadRequestException(`Ошибка удаления роли: ${error.message}`);
    }
  }

  async getRules(): Promise<IRule[]> {
    try {
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.GET_RULES }, {});
      const data = await firstValueFrom<IRmqResp<IRule[] | null>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error('права не найдены');
      }

      return data.payload;
    } catch (error) {
      throw new NotFoundException(`Ошибка получения прав: ${error.message}`);
    }
  }

  async addRules(dto: RulesToRolePayload): Promise<boolean> {
    try {
      if(dto.id === 1) {
        throw new Error('ненвозможно добавить права к главной роли');
      }
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.ADD_RULES_TO_ROLE }, dto);
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error('права не добавлены к роли');
      }

      return data.payload;
    } catch (error) {
      throw new BadRequestException(`Ошибка добавления прав: ${error.message}`);
    }
  }

  async delRules(dto: RulesToRolePayload): Promise<boolean> {
    try {
      if(dto.id === 1) {
        throw new Error('ненвозможно убрать права с главной роли');
      }
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.DELETE_RULES_FROM_ROLE }, dto);
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error('права не убраны с роли');
      }

      return data.payload;
    } catch (error) {
      throw new BadRequestException(`Ошибка удаления прав: ${error.message}`);
    }
  }

  async addRoles(dto: RoleToUserPayload): Promise<boolean> {
    try {
      if(dto.role_id === 1) {
        throw new Error('ненвозможно добавить главную роль другим пользователям');
      }
      if(dto.user_id === 1) {
        throw new Error('ненвозможно добавить роль главному пользователю');
      }
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.ADD_ROLE_TO_USER }, dto);
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error('роль не добавлена');
      }

      return data.payload;
    } catch (error) {
      throw new BadRequestException(`Ошибка добавления роли: ${error.message}`);
    }
  }

  async delRoles(dto: RoleToUserPayload): Promise<boolean> {
    try {
      if(dto.role_id === 1 || dto.user_id === 1) {
        throw new Error('ненвозможно снять главную роль');
      }
      const rmqResp = await this.rbacClient.send({ cmd: RBAC_MSGS.DELETE_ROLE_FROM_USER }, dto);
      const data = await firstValueFrom<IRmqResp<boolean>>(rmqResp);
      if(data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]);
      }
      if(!data.payload) {
        throw new Error('роль не удалена');
      }

      return data.payload;
    } catch (error) {
      throw new BadRequestException(`Ошибка удаления роли: ${error.message}`);
    }
  }
}
