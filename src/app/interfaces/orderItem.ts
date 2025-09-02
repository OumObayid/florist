export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  nom?: string; // optionnel, utile pour affichage
  image?: string; // optionnel
  product_image?: string;
  product_nom?:string;
}
