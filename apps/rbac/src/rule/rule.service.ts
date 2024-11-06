import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRmqResp } from 'libs/types/base.types';
import { IRule } from 'libs/types/rbac.types';
import { RuleEntity } from '../entities/rule.entity';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(RuleEntity) private readonly ruleRepo: Repository<RuleEntity>,
  ) {}

  async get(): Promise<IRmqResp<IRule[] | null>> {
    try {
      const rules = await this.ruleRepo.find(); 
      return { payload: rules };
    } catch(error){
      return { payload: null, errors: ['Права не найдены'] };
    }
  }
}
