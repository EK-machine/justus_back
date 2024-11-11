import { Reflector } from '@nestjs/core';
import { Methods } from 'libs/consts/methods';

export const Method = Reflector.createDecorator<Methods[]>();