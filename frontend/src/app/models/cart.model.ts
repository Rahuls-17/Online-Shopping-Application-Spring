import { Product } from './product.model';

// Represents a single item within the shopping cart
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

// Represents the entire shopping cart
export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}
