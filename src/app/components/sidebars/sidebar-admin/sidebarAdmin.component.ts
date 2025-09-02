import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { removeActiveUser } from '../../../ngrx/auth.slice';
import { ButtonComponent } from "../../button/button.component";

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterLink, ButtonComponent],
  templateUrl: './sidebarAdmin.component.html',
  styleUrl: './sidebarAdmin.component.css'
})
export class SidebarAdminComponent {
 constructor(
      public router: Router,
      private store: Store
    ) {}
   logout(){
      this.store.dispatch(removeActiveUser());
      this.router.navigate(['/login']);
    }
}
