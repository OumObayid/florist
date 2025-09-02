import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Store } from '@ngrx/store';
import { removeActiveUser } from '../../../ngrx/auth.slice';
import { ButtonComponent } from "../../button/button.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebarUser',
  imports: [RouterLink, ButtonComponent,CommonModule],
  templateUrl: './sidebarUser.component.html',
  styleUrl: './sidebarUser.component.css'
})
export class SidebarUserComponent {
  sidebarVisible:boolean=false;
   isMobile(): boolean {
    return window.innerWidth < 768; // correspond à Bootstrap md
  }
  constructor(
      public router: Router,
      private store: Store
    ) {}
   logout(){
      this.store.dispatch(removeActiveUser());
      this.router.navigate(['/login']);
    }
}
