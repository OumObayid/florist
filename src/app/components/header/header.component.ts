import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {  Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeActiveUser, selectIsLoggedIn, selectUserInfoConnecter } from '../../ngrx/data.slice';

@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  
  lastName:string|undefined='';
  userRole: string | undefined = ''; // Stocker le rôle de l'utilisateur
  
  constructor(
    public router: Router,
    private store: Store
  ) {}
    isloggedIn =false;
 
    ngOnInit() {
      this.store
        .select(selectIsLoggedIn)
        .subscribe((islog) => {
          this.isloggedIn = islog; // Mettez à jour la variable isloggedIn  
    }),

        this.store.select(selectUserInfoConnecter).subscribe((user)=>{
             this.lastName=user?.lastname;
             this.userRole = user?.role; // Assurez-vous que le rôle est bien défini dans votre modèle User

        })
    }
  
  logout(){
    this.store.dispatch(removeActiveUser());
    this.router.navigate(['/login']);
  }
}
