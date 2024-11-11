import { RBAC_CLIENT, RBAC_MSGS } from "@app/contracts/rbac";
import { USER_CLIENT, USER_MSGS } from "@app/contracts/user";
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClientProxy } from "@nestjs/microservices";
import { Method } from "libs/decorators/method.decorator";
import { catchError, Observable, of, switchMap, firstValueFrom } from "rxjs";


@Injectable()
export class RBACGuard implements CanActivate {
  constructor(
    @Inject(USER_CLIENT) private readonly userService: ClientProxy,
    @Inject(RBAC_CLIENT) private readonly rbacService: ClientProxy,
    private reflector: Reflector,
  ){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if(context.getType() !== 'http') {
      return false;
    }

    const authHeader = context.switchToHttp().getRequest().headers.authorization as string;

    if(!authHeader) return false;
    const authHeaderParts = authHeader.split(' ');
    if (authHeaderParts.length !== 2) return false;

    const [, at] = authHeaderParts;
    
    const methods = this.reflector.get(Method, context.getHandler());
    if(!methods) return true;

    const userIdRmqData = await this.userService.send<number>({ cmd: USER_MSGS.GET_ID_BY_AT }, at);
    const user_id = await firstValueFrom(userIdRmqData);
    const rbacRmqData = await this.rbacService.send<boolean>({ cmd: RBAC_MSGS.CHECK_USERS_ROLES }, { methods, user_id });
    return await firstValueFrom(rbacRmqData);
  }
}