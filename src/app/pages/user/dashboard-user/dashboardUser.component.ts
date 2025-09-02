import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { User } from '../../../interfaces/user';
import { Store } from '@ngrx/store';
import { selectUserInfoConnecter } from '../../../ngrx/auth.slice';

@Component({
  imports: [CommonModule,TemplateDashboardComponent],
  selector: 'app-dashboard-user',
  templateUrl: './dashboardUser.component.html',
  styleUrls: ['./dashboardUser.component.css'],
})
export class DashboardUserComponent implements OnInit {
constructor(
  private store : Store
){}

userConnected!:User|null
  ngOnInit(): void {
  this.store.select(selectUserInfoConnecter).subscribe(user => this.userConnected=user);
  }
}
