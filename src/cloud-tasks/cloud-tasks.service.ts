import { Inject, Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import Timestamp = firestore.Timestamp;
import { CloudTasksClient, protos } from '@google-cloud/tasks';
import { CloudTasksClientProvider } from './cloud-task-providers';
import { AppConfigService } from '@config/app-config.service';

@Injectable()
export class CloudTasksService {
  constructor(
    private appConfigService: AppConfigService,
    @Inject(CloudTasksClientProvider)
    private cloudTasksClient: CloudTasksClient,
  ) {}

  /// Returns task id
  async createCloudTask<T>(params: CreateCloudTaskParams<T>): Promise<string> {
    const projectId = this.appConfigService.getFirestoreConfig().projectId;
    const functionsLocation =
      this.appConfigService.getCloudFunctionsConfig().location;

    const queuePath = this.cloudTasksClient.queuePath(
      projectId,
      functionsLocation,
      params.queueName,
    );

    const task = this.getCloudTaskBody(params);

    const [response] = await this.cloudTasksClient.createTask({
      parent: queuePath,
      task,
    });

    return response.name;
  }

  async deleteCloudTask(id: string) {
    try {
      await this.cloudTasksClient.deleteTask({ name: id });
    } catch {}
  }

  private getCloudTaskBody<T>(params: CreateCloudTaskParams<T>) {
    return {
      httpRequest: {
        httpMethod: protos.google.cloud.tasks.v2.HttpMethod.POST,
        url: this.getUrl(params),
        body: CloudTasksService.getPayloadBody(params.payload),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      scheduleTime: {
        seconds: CloudTasksService.getScheduleTime<T>(params),
      },
    };
  }

  private getUrl<T>(params: CreateCloudTaskParams<T>) {
    const endpoint = this.appConfigService.getCloudFunctionsConfig().endpoint;
    return `${endpoint}${params.callbackName}`;
  }

  private static getPayloadBody<T>(payload: T) {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  private static getScheduleTime<T>(params: CreateCloudTaskParams<T>) {
    if (params.executionTimeInSeconds) {
      return Date.now() / 1000 + params.executionTimeInSeconds;
    }

    if (params.executesAt) {
      return params.executesAt.seconds;
    }

    return Timestamp.now().seconds;
  }
}

interface CreateCloudTaskParams<T> {
  payload: T;
  queueName: string;
  callbackName: string;
  executionTimeInSeconds?: number;
  executesAt?: Timestamp;
}
