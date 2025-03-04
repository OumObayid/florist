import { UsersService } from './../../../services/users/users.service';
import { Store } from '@ngrx/store';
import { User } from './../../../interfaces/user';
import { Component, OnInit } from '@angular/core';
import { deleteUser, selectUsers } from '../../../ngrx/data.slice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeleteUserService } from '../../../services/users/deleteUser.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  users: User[] | null = null;

  constructor(public store: Store, private deleteUserService: DeleteUserService) {}

  ngOnInit(): void {
    this.store.select(selectUsers).subscribe((datauser) => {
      // console.log('datauser :', datauser);
      this.users = datauser;
    });
  }

  deleteUser(id: number) {
    console.log('from user')
    this.deleteUserService.deleteUser(id).subscribe((response: any) => {
      if (response.success) {
        this.store.dispatch(deleteUser(id));
      } else {
        console.error('Erreur: Format de données invalide!', response);
      }
    });
  }
}
