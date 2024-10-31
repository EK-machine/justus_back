import { CreateUserDto } from '@app/contracts/user/createUser.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser() {
    return {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
    };
  }


  async createUser(dto: CreateUserDto) {
    console.log(dto);

  }
}
