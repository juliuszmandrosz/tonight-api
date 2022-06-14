import { DynamicModule, Module } from '@nestjs/common';
import { CloudTasksClientProvider } from './cloud-task-providers';
import { CloudTasksClient } from '@google-cloud/tasks';
import { CoreModule } from '@core/core.module';
import { CloudTasksService } from '@cloud-tasks/cloud-tasks.service';

@Module({})
export class CloudTasksModule {
  static forRoot(): DynamicModule {
    const cloudTasksClientProvider = {
      provide: CloudTasksClientProvider,
      useFactory: () => new CloudTasksClient(),
    };

    return {
      imports: [CoreModule],
      global: true,
      module: CloudTasksModule,
      providers: [cloudTasksClientProvider, CloudTasksService],
      exports: [cloudTasksClientProvider, CloudTasksService],
    };
  }
}
