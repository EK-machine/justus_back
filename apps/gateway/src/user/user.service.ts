import { USER_CLIENT, USER_MSGS } from '@app/contracts/user';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(@Inject(USER_CLIENT) private readonly userClient: ClientProxy) {}
  getUser() {
    return this.userClient.send({ cmd: USER_MSGS.GET_USER }, {});
  }
}
