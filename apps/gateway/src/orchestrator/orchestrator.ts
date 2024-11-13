import { Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { IRmqResp } from "libs/types/base.types";
import { firstValueFrom } from "rxjs";

export interface IOrchestratorStep<P = any> {
  cmd: string;
  client: ClientProxy;
  withResult?: boolean;
  payload?: P;
  snapshotCmd?: string;
}

export interface ISnapshotItem<P = any> {
  snapshotCmd: string;
  snapshotClient: ClientProxy;
  snapshotPayload?: P;
}

export interface IOrchestratorResp<T = any> {
  result: T;
  errors: string[];
}

@Injectable()
export class Orchestrator {
    async execute<R>(steps: IOrchestratorStep[]): Promise<IOrchestratorResp<R | null>> {
        const errors: string[] = [];
        const snapshots: ISnapshotItem[] = [];
        let result: R | null = null;
        
        for(let i = 0; i < steps.length; i++) {
            const currentStep = steps[i];
            const { cmd, client, payload, snapshotCmd, withResult } = currentStep;
            try {
                const rmqResp = await client.send({ cmd }, payload);
                const data = await firstValueFrom<IRmqResp<R>>(rmqResp);
                if(data.errors && data.errors.length > 0) {
                    errors.push(...data.errors);
                    if(snapshots.length > 0) {
                        const handleSnapshotErrors = await this.handleSnapshots(snapshots);
                        if(handleSnapshotErrors.length > 0) {
                            errors.push(...handleSnapshotErrors);
                        }
                    }
                    return { result, errors };
                }
                if(snapshotCmd) {
                    snapshots.push({
                        snapshotCmd,
                        snapshotClient: client,
                        snapshotPayload: data.payload,
                    });
                }
                if(withResult) {
                    result = data.payload;
                }
            } catch (error) {
                errors.push(`ошибка в шаге ${i + 1} - ${error.message}`);
                const handleSnapshotErrors = await this.handleSnapshots(snapshots);
                if(handleSnapshotErrors.length > 0) {
                    errors.push(...handleSnapshotErrors);
                }
                return { result, errors };
            }
        }
        return {result, errors};
    }

    private async handleSnapshots(snapshots: ISnapshotItem[]): Promise<string[]> {
        const errors: string[] = [];
        for (let j = snapshots.length - 1; j >= 0; j--) {
            const snapshotItem = snapshots[j];
            const { snapshotCmd, snapshotClient, snapshotPayload } = snapshotItem;
            const rmqSnapshotResp = await snapshotClient.send({ cmd: snapshotCmd }, snapshotPayload);
            const snapshotResp = await firstValueFrom<IRmqResp<any>>(rmqSnapshotResp);
            if(snapshotResp.errors && snapshotResp.errors.length > 0) {
                errors.push(...snapshotResp.errors);
            }
        }
        return errors;
    }
}