import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';  // Ajout du router
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AuthState, selectUserRole } from '../ngrx/auth.slice.js';

export const userGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<AuthState>);
  const router = inject(Router);  // Injection du router

  return store.select(selectUserRole).pipe(
    map(role => {
      if (role === 'user') {
        return true;  // Utilisateur normal autorisé
      } else {
        router.navigate(['/admin']); // Redirection vers le dashboard admin
        return false;
      }
    })
  );
};

