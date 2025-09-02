import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { appStore } from './ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    appStore,
    provideHttpClient(),
    provideAnimations(), // required animations providers
    provideToastr({
      timeOut: 10000, // durée du toast
      positionClass: 'toast-top-right', // position
      preventDuplicates: true, // empêcher doublons
      closeButton: true, // bouton de fermeture
      progressBar: true, // barre de progression
      easeTime: 300, // durée de l'animation
      toastClass: 'ngx-toastr toast-slide', // classe CSS pour slide
    }),
  ],
};
