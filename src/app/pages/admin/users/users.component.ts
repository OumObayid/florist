import { Store } from '@ngrx/store';
import { User } from './../../../interfaces/user';
import { Component, OnInit } from '@angular/core';
import {
  deleteUser,
  selectUsers,
  updateRoleUser,
} from '../../../ngrx/data.slice';
import { CommonModule } from '@angular/common';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { UsersService } from '../../../services/users/users.service';
import { ButtonComponent } from "../../../components/button/button.component";

@Component({
  selector: 'app-users',
  imports: [CommonModule, TemplateDashboardComponent, ButtonComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  // Loading spécifique pour chaque utilisateur
  loadingUsers: { [id: number]: boolean } = {};
  loading: boolean = false;
  constructor(public store: Store, private usersService: UsersService) {}

  ngOnInit(): void {
    this.store.select(selectUsers).subscribe((datauser) => {
      this.users = datauser || [];
      if (this.users.length > 0) this.loading = false;
    });
  }

  deleteUser(id: number) {
    // Activer le loading pour cet utilisateur
    this.loadingUsers[id] = true;
    this.usersService.deleteUser(id).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Supprimer l'utilisateur du store
          this.store.dispatch(deleteUser(id));
        } else {
          console.error('Erreur: Format de données invalide!', response);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l’utilisateur:', err);
      },
      complete: () => {
        // Toujours désactiver le loading pour cet utilisateur
        this.loadingUsers[id] = false;
      },
    });
  }

  toggleRole(userId: number, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';

    this.usersService.updateUserRole(userId, newRole).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.store.dispatch(updateRoleUser(userId, newRole));
        } else {
          console.error(res.message);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
