// import { CanActivateFn } from '@angular/router';

// export const adminGuard: CanActivateFn = (route, state) => {
//   const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
//   const role = localStorage.getItem('role');

//   if (!isLoggedIn || role !== 'admin') {
//     window.location.href = '/login'; // Redirection si non connecté ou pas admin
//     return false;
//   }

//   return true;
// };

// import { CanActivateFn } from '@angular/router';
// import { inject } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { DataState, selectUserRole } from '../ngrx/data.slice';

// export const adminGuard: CanActivateFn = (route, state) => {
//   const store = inject(Store<DataState>);

//   return new Observable<boolean>((observer) => {
//     store.select(selectUserRole).pipe(
//       map(role => {
//         if (role === 'admin') {
//           observer.next(true);  // Admin autorisé
//         } else {
//           window.location.href = '/dashboard'; // Redirection vers le dashboard user
//           observer.next(false);
//         }
//         observer.complete();
//       })
//     ).subscribe();
//   });
// };

import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';  // Ajout du router
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataState, selectUserRole } from '../ngrx/data.slice';
export const adminGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<DataState>);
  const router = inject(Router);  // Injection du router

  return store.select(selectUserRole).pipe(
    map(role => {    console.log('role :', role);

      if (role === 'admin') {
        return true;  // Admin autorisé
      } else {
        router.navigate(['/dashboard']);  // Redirection vers le dashboard user
        return false;
      }
    })
  );
};
