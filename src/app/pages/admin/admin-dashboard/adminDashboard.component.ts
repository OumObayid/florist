import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserInfoConnecter } from '../../../ngrx/auth.slice';
import { User } from '../../../interfaces/user';
import { TemplateDashboardComponent } from "../../../components/templates/template-dashboard.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TemplateDashboardComponent], // Ajout de CommonModule pour AsyncPipe
  templateUrl: './adminDashboard.component.html',
  styleUrls: ['./adminDashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  isSidebarOpen:boolean=true;

  toggleSidebar(){
   
    this.isSidebarOpen= !this.isSidebarOpen;
  }

  user: User | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectUserInfoConnecter).subscribe(userData => {
      this.user = userData;
    });
  }
  
}
