import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarAdminComponent } from '../../sidebars/sidebar-admin/sidebarAdmin.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, SidebarAdminComponent, CommonModule],
  template: `
    <!-- Layout Desktop -->
    <div class="d-flex side-desktop" *ngIf="!isMobile">
      <app-sidebar-admin></app-sidebar-admin>
      <div class="flex-grow-1 p-4">
        <router-outlet></router-outlet>
      </div>
    </div>

    <!-- Layout Mobile -->
<div  class="side-mobile position-relative" *ngIf="isMobile">
  <!-- Icône hamburger -->
  <button
  class="btn d-md-none shadow-none border-0"
  (click)="sidebarVisible = !sidebarVisible"
  style="
    z-index: 1020;
    position: fixed;
    top: 120px;
    left: 0px;
  "
>
   <i
   style="color:var(--rouge-brique); font-size:25px"
    class="fa-solid "
    [ngClass]="{ 'fa-arrow-circle-right ': !sidebarVisible, 'fa-arrow-circle-left': sidebarVisible }"
  ></i>
</button>

  <!-- Sidebar mobile -->
  <div (click)="sidebarVisible = !sidebarVisible" class="mobile-sidebar" [ngClass]="{ show: sidebarVisible }">
    <app-sidebar-admin></app-sidebar-admin>
  </div>

  <!-- Overlay -->
  <div
    class="overlay"
    *ngIf="sidebarVisible"
    (click)="sidebarVisible = false"
  ></div>

  <!-- Contenu principal -->
  <div class="content flex-grow-1 px-4">
    <router-outlet></router-outlet>
  </div>
</div>

  `,
  styles: [
    `
     /* Sidebar mobile cachée */
.mobile-sidebar {
  position: fixed;
  top: 95px;
  left: -275px;
  width: 250px;
  height: 100%;
  transition: left 0.3s ease;
  z-index: 1000;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
}

/* Quand elle est ouverte */
.mobile-sidebar.show {
  left: -15px;
}

/* Overlay derrière */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 940;
}

/* Le contenu principal doit rester normal */
.side-mobile .content {
  margin-top: 45px; /* pour laisser la place à l’icône hamburger */
}

    `,
  ],
})
export class AdminLayoutComponent {
  sidebarVisible = false;
  isMobile = false;

  constructor() {
    this.checkScreen();
    window.addEventListener('resize', () => this.checkScreen());
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 768;
  }
}
