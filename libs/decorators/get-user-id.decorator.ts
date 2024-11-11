import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';

export const GetUserId = createParamDecorator(
  (_data: string, context: ExecutionContext) => {
    dotenv.config({
        path: path.resolve(__dirname, `../../.env`),
    });
    const key = process.env.USER_ID_KEY as string;
    const request: Request = context.switchToHttp().getRequest();
    return Number(request.cookies[key]);
  },
);