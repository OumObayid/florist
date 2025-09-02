/*
 * Projet Flower-Shop
 * Page : Order Slide
 *
 * Description :
 * Composant affichant le slide de commande pour l'utilisateur. 
 * Il gère la récupération des informations utilisateur et du panier depuis le store NgRx, 
 * l'affichage et l'édition de l'adresse de livraison, la saisie des informations de paiement, 
 * la validation des champs, la confirmation de la commande via l'API et la mise à jour du store.
 *
 * Développé par :
 * OUMAIMA EL OBAYID
 *
 * Licence :
 * Licence MIT
 * https://opensource.org/licenses/MIT
 */

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { User } from '../../interfaces/user';
import { CartItem } from '../../interfaces/cartItem';
import { OrdersService } from '../../services/orders/orders.service';
import { UsersService } from '../../services/users/users.service';
import {
  getActiveUserInfo,
  selectUserInfoConnecter,
} from '../../ngrx/auth.slice';
import {
  clearCartItems,
  selectCartItems,
  selectCartTotal,
} from '../../ngrx/carts.slice';
import { addOrder } from '../../ngrx/orders.slice';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orderslide',
  templateUrl: './orderslide.component.html',
  styleUrls: ['./orderslide.component.css'],
  imports: [CommonModule, FormsModule],
})
export class OrderSlideComponent {
  // Observables du store pour utilisateur, panier et total
  user$!: Observable<User | null>;
  cartItems$!: Observable<CartItem[]>;
  total$!: Observable<number>;

  // Champs de saisie pour adresse et paiement
  address: string = '';
  card_number: string = '';
  card_expiry_date: string = '';
  card_cvv: string = '';
  card_holder_name: string = '';
  expiryError: string = '';

  // Etats du composant
  editAddressMode: boolean = false;
  isloading: boolean = false;
  endOrder: boolean = false;

  constructor(
    private toastr: ToastrService,
    private store: Store,
    private ordersService: OrdersService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    // Récupération des données utilisateur et panier depuis le store
    this.user$ = this.store.select(selectUserInfoConnecter);
    this.cartItems$ = this.store.select(selectCartItems);
    this.total$ = this.store.select(selectCartTotal);

    // Initialisation de l'adresse et informations de paiement
    this.user$.subscribe((user) => {
      if (user) {
        this.address = user.address || '';
        this.card_number = user.card_number;
        this.card_expiry_date = this.formatExpiryFromDb(user.card_expiry_date);
        console.log('this.card_expiry_date :', this.card_expiry_date);
        this.card_cvv = user.card_cvv;
        this.card_holder_name = user.card_holder_name;
        this.editAddressMode = false;
      }
    });
  }

  /**
   * Toggle entre édition et enregistrement de l’adresse
   */
  toggleAddress(user: User) {
    if (this.editAddressMode) {
      if (this.address && this.address.trim() !== '') {
        this.usersService.updateUserAddress(user.id, this.address).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success('Adresse mise à jour');
              this.address = response.user.address;
              this.store.dispatch(getActiveUserInfo(response.user));
              this.editAddressMode = false;
            } else {
              this.toastr.error('Erreur lors de la mise à jour de l’adresse');
              console.log(response.message);
            }
          },
          error: () => {
            this.toastr.error('Erreur lors de la mise à jour de l’adresse');
            console.log('Erreur lors de la mise à jour de l’adresse');
          },
        });
      } else {
        this.toastr.error('Veuillez entrer une adresse valide');
        console.log('Veuillez entrer une adresse valide');
      }
    } else {
      this.editAddressMode = true;
    }
  }

  /**
   * Confirmer la commande et envoyer à l’API
   */
  confirmOrder(cartItems: CartItem[], total: number, userId: number) {
    this.isloading = true;

    // Validation des champs obligatoires
    if (
      !this.address ||
      this.address.trim() === '' ||
      !this.card_number ||
      this.card_number.trim() === '' ||
      !this.card_expiry_date ||
      this.card_expiry_date.trim() === '' ||
      !this.card_holder_name ||
      this.card_holder_name.trim() === '' ||
      !this.card_cvv ||
      this.card_cvv.trim() === ''
    ) {
      this.toastr.error(
        'Veuillez remplir tous les champs de paiement et votre adresse.'
      );
      console.log('Champs de paiement ou adresse manquants');
      this.isloading = false;
      return;
    }

    const expiryDate = this.convertExpiryToDateTime(this.card_expiry_date);
    console.log('expiryDate :', expiryDate);
    if (!expiryDate) {
      this.toastr.error('Date d’expiration invalide.');
      return;
    }

    // Construction de l'objet commande
    const order = {
      user_id: userId,
      payment_mode: 'carte',
      card_number: this.card_number,
      card_expiry_date: expiryDate,
      card_holder_name: this.card_holder_name,
      card_cvv: this.card_cvv,
      items: cartItems.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
        price: i.prix,
        product_name: i.nom,
        product_image: i.image,
      })),
    };

    // Appel API pour créer la commande
    this.ordersService.createOrder(order).subscribe({
      next: (response) => {
        console.log('response :', response);
        if (response.success) {
          this.store.dispatch(clearCartItems());
          this.store.dispatch(addOrder({ order: response.order }));
          this.endOrder = true;
        } else {
          this.toastr.error('Erreur lors de la commande.');
          console.log(response.message);
        }
      },
      error: () => {
        this.toastr.error('Erreur lors de la commande.');
        console.log('Erreur lors de la commande.');
      },
      complete: () => {
        this.isloading = false;
      },
    });
  }

  // =======================================
  // Bloque la saisie de tout caractère sauf les chiffres
  // =======================================
  allowOnlyNumbers(event: KeyboardEvent) {
    const char = event.key;
    if (!/[0-9]/.test(char)) {
      event.preventDefault();
    }
  }

  // Formate le numéro de carte avec espace tous les 4 chiffres
  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 16);

    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }

    input.value = formatted;
    this.card_number = formatted;
  }

  // =======================================
  // Formate et valide le champ Date d’expiration (MM/AA)
  // =======================================
  formatExpiry(event: Event) {
    let value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);

    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);

    this.card_expiry_date = value;
    this.expiryError = '';

    if (value.length === 5) {
      const [monthStr, yearStr] = value.split('/');
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const currentYear = new Date().getFullYear() % 100;

      if (month < 1 || month > 12) this.expiryError = 'Le mois doit être entre 01 et 12';
      else if (year < currentYear) this.expiryError = `L'année doit être >= ${currentYear}`;
    }
  }

  // Filtre le champ Nom sur la carte (lettres et espaces uniquement)
  filterCardName(value: string) {
    this.card_holder_name = value.replace(/[^a-zA-Z ]/g, '');
  }

  // Convertit MM/AA → YYYY-MM-DD
  convertExpiryToDateTime(expiry: string): string {
    if (!expiry || !expiry.includes('/')) return '';
    const [month, year] = expiry.split('/');
    return `20${year}-${month.padStart(2, '0')}-01`;
  }

  // Formate une date DB YYYY-MM-DD → MM/AA
  formatExpiryFromDb(dateString: string): string {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    return `${month}/${year.slice(-2)}`;
  }
}
