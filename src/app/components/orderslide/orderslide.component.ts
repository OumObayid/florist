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
  user$!: Observable<User | null>;
  cartItems$!: Observable<CartItem[]>;
  total$!: Observable<number>;
  address: string = '';
  card_number: string = '';
  card_expiry_date: string = '';
  card_cvv: string = '';
  card_holder_name: string = '';
  expiryError: string = '';

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
    this.user$ = this.store.select(selectUserInfoConnecter);
    this.cartItems$ = this.store.select(selectCartItems);
    this.total$ = this.store.select(selectCartTotal);

    // Initialiser adresse
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
   * Toggle entre édition / enregistrement de l’adresse
   */
  toggleAddress(user: User) {
    if (this.editAddressMode) {
      // Enregistrer dans l’API + mise à jour du store
      if (this.address && this.address.trim() !== '') {
        this.usersService.updateUserAddress(user.id, this.address).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastr.success('Adresse mise à jour');

              // Garder la nouvelle adresse dans le champ
              this.address = response.user.address;

              // Mise à jour NgRx du store utilisateur
              this.store.dispatch(getActiveUserInfo(response.user));

              // Retour en mode lecture (champ disabled)
              this.editAddressMode = false;
            } else {
              this.toastr.error('Erreur lors de la mise à jour de l’adresse'),
                console.log(response.message);
            }
          },
          error: () => {
            this.toastr.error('Erreur lors de la mise à jour de l’adresse');
            console.log('Erreur lors de la mise à jour de l’adresse');
          },
        });
      } else {
        alert('adress');
        this.toastr.error('Veuillez entrer une adresse valide');
        console.log('Veuillez entrer une adresse valide');
      }
    } else {
      // Passer en mode édition
      this.editAddressMode = true;
    }
  }

  /**
   * Confirmer la commande
   */
  confirmOrder(cartItems: CartItem[], total: number, userId: number) {
    this.isloading = true;

    // Vérification que tous les champs sont remplis
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

    // Construction de l'objet order avec les noms exacts demandés
    const expiryDate = this.convertExpiryToDateTime(this.card_expiry_date);
    console.log('expiryDate :', expiryDate);
    if (!expiryDate) {
      this.toastr.error('Date d’expiration invalide.');
      return;
    }
    const order = {
      user_id: userId,
      payment_mode: 'carte',
      card_number: this.card_number, // numéro de carte
      card_expiry_date: this.convertExpiryToDateTime(this.card_expiry_date), // date d'expiration
      card_holder_name: this.card_holder_name, // nom sur la carte
      card_cvv: this.card_cvv, // code CVC
      items: cartItems.map((i) => ({
        product_id: i.productId,
        quantity: i.quantity,
        price: i.prix,
        product_name: i.nom, 
        product_image: i.image,
      })),
    };

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
  // Utilisé par exemple pour le champ Numéro de carte ou CVC
  // =======================================
  allowOnlyNumbers(event: KeyboardEvent) {
    const char = event.key; // Récupère la touche saisie par l'utilisateur
    if (!/[0-9]/.test(char)) {
      // Vérifie si ce n'est pas un chiffre (0-9)
      event.preventDefault(); // Bloque la saisie si ce n'est pas un chiffre
    }
  }

  // Formate le numéro de carte avec un espace tous les 4 chiffres
  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;

    // Supprime tout sauf chiffres
    let value = input.value.replace(/\D/g, '');

    // Limite à 16 chiffres max
    value = value.substring(0, 16);

    // Ajoute un espace tous les 4 chiffres
    let formatted = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }

    // Met à jour l'input ET ngModel
    input.value = formatted;
    this.card_number = formatted;
  }

  // =======================================
  // Formate et valide le champ Date d’expiration (MM/AA)
  // =======================================
  formatExpiry(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    // Supprime tout caractère qui n’est pas un chiffre
    value = value.replace(/\D/g, '');

    // Limite à 4 chiffres max (MM + AA)
    value = value.slice(0, 4);

    // Ajoute automatiquement un slash après les 2 premiers chiffres (MM)
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    this.card_expiry_date = value; // Met à jour le champ du modèle

    // ===============================
    // Validation de la date
    // ===============================
    this.expiryError = ''; // Réinitialise le message d'erreur
    if (value.length === 5) {
      // Si on a le format complet MM/AA
      const [monthStr, yearStr] = value.split('/');
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);
      const currentYear = new Date().getFullYear() % 100; // Récupère l'année sur 2 chiffres (ex: 2025 → 25)

      // Vérifie que le mois est valide (01-12)
      if (month < 1 || month > 12) {
        this.expiryError = 'Le mois doit être entre 01 et 12';
      }
      // Vérifie que l'année n'est pas inférieure à l'année actuelle
      else if (year < currentYear) {
        this.expiryError = `L'année doit être >= ${currentYear}`;
      }
    }
  }

  // =======================================
  // Filtre le champ Nom sur la carte
  // =======================================
  filterCardName(value: string) {
    // Supprime tous les caractères qui ne sont pas des lettres (a-z, A-Z) ou des espaces
    // Les chiffres et caractères spéciaux sont bloqués automatiquement
    this.card_holder_name = value.replace(/[^a-zA-Z ]/g, '');
  }

  // expiry = "11/25" (MM/YY)
  convertExpiryToDateTime(expiry: string): string {
    if (!expiry || !expiry.includes('/')) return '';

    const [month, year] = expiry.split('/');

    // convertir année "26" → "2026"
    const fullYear = '20' + year;

    // retourner au format DATE MySQL (YYYY-MM-DD)
    return `${fullYear}-${month.padStart(2, '0')}-01`;
  }

  formatExpiryFromDb(dateString: string): string {
    if (!dateString) return '';
    const [year, month] = dateString.split('-'); // ["2026","12","01"]
    return `${month}/${year.slice(-2)}`; // "12/26"
  }
}
