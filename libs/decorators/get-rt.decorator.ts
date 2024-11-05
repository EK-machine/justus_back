import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

export const GetRefreshToken = createParamDecorator(
  (_data: string, context: ExecutionContext) => {
    dotenv.config({
        path: path.resolve(__dirname, `../../.env`),
    });
    const key = process.env.SECRET_KEY as string;
    const request: Request = context.switchToHttp().getRequest();
    return request.cookies[key];
  },
);