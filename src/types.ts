export type SneakerCategory = 'Running' | 'Sneakers' | 'Basketball' | 'Training' | 'Outdoor';

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: SneakerCategory;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  features: string[];
  images: string[]; // Let's use placeholders/custom stylable visual identifiers
  colors: string[];
  sizes: number[];
  stock: number;
  reviews: Review[];
  gender: 'Men' | 'Women' | 'Unisex';
  releaseYear: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  sneakerPrefs?: string[];
  budget?: number;
  shippingAddress?: {
    address: string;
    city: string;
    zip: string;
  };
}

export interface CartItem {
  id: string; // unique item instance id (productId + size + color)
  productId: string;
  name: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  size: number;
  color: string;
  quantity: number;
}

export interface OrderTrackingStep {
  title: string;
  desc: string;
  time: string;
  completed: boolean;
  status: 'pending' | 'active' | 'success';
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  trackingNumber: string;
  trackingSteps: OrderTrackingStep[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'offer' | 'system';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
}
