import { OrderItem } from "./orderItem";

export interface Order {
  id: number;
  user_id: number;
  total: number;
  payment_mode: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];     // tableau des produits commandés
  created_at?: string;
  updated_at?: string;
  archived?: boolean;     // optionnel
}
