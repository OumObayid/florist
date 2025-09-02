import { Component } from '@angular/core';
import { TemplateDashboardComponent } from '../../../components/templates/template-dashboard.component';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { Store } from '@ngrx/store';
import {
  getActiveUserInfo,
  selectUserInfoConnecter,
} from '../../../ngrx/auth.slice';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../components/button/button.component';
import { UsersService } from '../../../services/users/users.service';

@Component({
  selector: 'app-profil',
  imports: [
    TemplateDashboardComponent,
    FormsModule,
    CommonModule,
    ButtonComponent,
  ],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css',
})
export class ProfilComponent {
  user$!: Observable<User | null>;
  editMode = false;

  oldPassword = '';
  newPassword = '';

  successMessage: string = '';
  successMessagePw: string = '';
  errorMessage: string = '';
  errorMessagePw: string = '';
  isloading: boolean = false;
  // Valeur locale pour édition
  userEdit!: User;

  constructor(
    private store: Store,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.user$ = this.store.select(selectUserInfoConnecter);

    // Initialiser userEdit avec les données du store
    this.user$.subscribe((user) => {
      if (user) this.userEdit = { ...user }; // clone pour édition
    });
  }

  saveUserInfo(form: NgForm) {
    this.successMessage = '';
    this.errorMessage = '';
    if (!form.valid) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.isloading = true;
    const data = {
      id: this.userEdit.id,
      firstname: this.userEdit.firstname,
      lastname: this.userEdit.lastname,
      email: this.userEdit.email,
      phone: this.userEdit.phone,
      address: this.userEdit.address,
    };

    this.usersService.updateUserInfos(data).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Modification de vos information réussie !';
          this.store.dispatch(getActiveUserInfo(response.user));
          this.store.dispatch(getActiveUserInfo(this.userEdit));
        } else {
          this.errorMessage =
            'Erreur lors de Modification de vos données, Veuillez essayer ultérieurement';
          console.log('response.message :', response.message);
        }
      },
      error: () => {
        this.errorMessage = 'Erreur de connexion au serveur';
      },
      complete: () => {
        this.isloading = false;
        this.editMode = false;
      },
    });
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword) {
      this.errorMessagePw = 'Veuillez remplir tous les champs';
      return;
    }
    this.isloading = true;
    this.authService
      .updatePassword(this.userEdit.id, this.oldPassword, this.newPassword)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessagePw = 'Mot de passe changé avec succès !';
            this.oldPassword = '';
            this.newPassword = '';
          } else {
            this.errorMessagePw =
              'Erreur lors de Modification de vos do nnées, Veuillez essayer ultérieurement';
            console.log(response.message);
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessagePw = 'Erreur lors du changement de mot de passe';
          this.isloading = false;
        },
        complete: () => {
          this.isloading = false;
        },
      });
  }
}
