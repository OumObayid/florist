import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUserInfoConnecter } from '../../../ngrx/data.slice';
import { User } from '../../../interfaces/user';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLink], // Ajout de CommonModule pour AsyncPipe
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardAdminComponent implements OnInit {

  isSidebarOpen:boolean=true;

  toggleSidebar(){
   
    this.isSidebarOpen= !this.isSidebarOpen;
    // console.log('isSidebarOpen :', this.isSidebarOpen);
  }

  user: User | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectUserInfoConnecter).subscribe(userData => {
      this.user = userData;
    });
  }
  
}
