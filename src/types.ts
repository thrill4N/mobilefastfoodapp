export interface ToppingOption {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Bunny Chow' | 'Shwamma' | 'Vetkoek' | 'Burgers' | 'Pizza' | 'Desserts' | 'Beverages';
  price: number;
  description: string;
  image: string;
  optionsLabel?: string;
  availableToppings?: ToppingOption[];
  rating: number;
  ratingCount: number;
  popular?: boolean;
  preparationTime: number; // in minutes
}

export interface CartItem {
  id: string; // unique item-instance key combining menu ID + unique-toppings combination
  menuItem: MenuItem;
  selectedToppings: ToppingOption[];
  quantity: number;
  diningOption: 'dine-in' | 'takeaway';
  note?: string;
}

export type OrderStatus = 'placed' | 'preparing' | 'on-the-way' | 'delivered';

export interface TrackingStep {
  title: string;
  description: string;
  time: string;
  completed: boolean;
  active: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  pointsDiscount: number; // ZAR discount redeemed from points
  couponCode?: string;
  couponDiscount?: number;
  total: number;
  pointsEarned: number;
  status: OrderStatus;
  diningOption: 'dine-in' | 'takeaway';
  address?: string;
  tableNumber?: string;
  paymentMethod: 'card' | 'wallet' | 'points';
  paymentGateway?: 'Yoco' | 'PayFast';
  timestamp: string;
  estimatedArrival: string;
}

export interface LoyaltyRewards {
  pointsBalance: number;
  lifetimePoints: number;
  tier: 'Bronze Star' | 'Silver Feast' | 'Golden Chef';
  nextTierPointsNeeded: number;
  progressPercentage: number;
  xpPoints?: number;
  xpLevel?: number;
  unlockedCoupons?: string[];
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  icon: string;
}
