import { Module } from '@nestjs/common';
import { CoreModule } from '@core/core.module';
import { TypesenseDataServicesModule } from '@data-services/typesense/typesense-data-services.module';
import { WallPhotosService } from './wall-photos.service';
import { WallPhotosController } from './wall-photos.controller';

@Module({
  imports: [CoreModule, TypesenseDataServicesModule],
  providers: [WallPhotosService],
  controllers: [WallPhotosController],
})
export class WallPhotosModule {}
