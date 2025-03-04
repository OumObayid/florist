import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';  // Ajout du router
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataState, selectIsLoggedIn } from '../ngrx/data.slice';

export const loginGuard: CanActivateFn = (route, state) => {
    const store = inject(Store<DataState>);
    const router = inject(Router);
  
    return store.select(selectIsLoggedIn).pipe(
      map(isLoggedIn => {
        if (isLoggedIn) {
          router.navigate(['/dashboard']);  // Redirection si l'utilisateur est déjà connecté
          return false;
        }
        return true;
      })
    );
  };
  