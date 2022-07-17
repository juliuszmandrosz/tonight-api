import { Module, DynamicModule } from '@nestjs/common';
import {
  GooglePlacesProvider,
  GooglePlacesOptionsProvider,
} from './google-places-providers';
import { AppConfigService } from '@config/app-config.service';
import { GooglePlacesConfig } from '@config/config-template';
import GooglePlaces from 'google-places-web';
import { GooglePlacesService } from './google-places.service';
import { GooglePlacesController } from './google-places.controller';

type GooglePlacesModuleOptions = {
  imports: any[];
  useFactory: (appConfigService: AppConfigService) => GooglePlacesConfig;
  inject: any[];
};

@Module({})
export class GooglePlacesModule {
  static forRoot(options: GooglePlacesModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: GooglePlacesOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const googlePlacesProvider = {
      provide: GooglePlacesProvider,
      useFactory: (config: GooglePlacesConfig) => {
        GooglePlaces.apiKey = config.apiKey;
        return GooglePlaces;
      },
      inject: [GooglePlacesOptionsProvider],
    };

    return {
      module: GooglePlacesModule,
      imports: options.imports,
      providers: [optionsProvider, googlePlacesProvider, GooglePlacesService],
      controllers: [GooglePlacesController],
    };
  }
}
