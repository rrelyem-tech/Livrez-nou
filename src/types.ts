export type UserRole = 'client' | 'driver' | 'admin';

export type Screen = 
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'client-home'
  | 'new-delivery'
  | 'price-estimation'
  | 'order-confirmation'
  | 'delivery-tracking'
  | 'delivery-history'
  | 'profile'
  | 'driver-dashboard'
  | 'driver-onboarding'
  | 'messages'
  | 'admin-dashboard';

export type PaymentMethod = 'wallet' | 'moncash' | 'natcash' | 'cash';

export type OrderStatus = 'pending' | 'accepted' | 'on_the_way' | 'in_transit' | 'delivered' | 'cancelled';

export type ServiceType = 'Pakè' | 'Manje' | 'Dokiman' | 'Medyaman' | 'Acha Espesyal';

export type ClientTab = 'home' | 'history' | 'messages' | 'profile';

export interface Address {
  id: string;
  title: string;
  fullAddress: string;
  coords?: [number, number];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  role: UserRole;
  balance: number;
  savedAddresses?: Address[];
}

export interface Driver {
  id: string;
  name: string;
  photo: string;
  phone: string;
  rating: number;
  totalDeliveries: number;
  vehicle: string;
  licensePlate: string;
  isOnline: boolean;
  earningsToday: number;
  earningsTotal: number;
}

export interface DeliveryForm {
  pickupAddress: string;
  deliveryAddress: string;
  serviceType: string;
  description: string;
  recipientName: string;
  recipientPhone: string;
  instructions: string;
  isScheduled: boolean;
  scheduledTime: string;
  paymentMethod: PaymentMethod;
}

export interface Order {
  id: string;
  clientId: string;
  driverId?: string;
  pickupAddress: string;
  deliveryAddress: string;
  serviceType: string;
  description?: string;
  recipientName: string;
  recipientPhone: string;
  instructions?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedMinutes: number;
  distanceKm: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  rating?: number;
}

export interface ActiveOrder extends Order {
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  driverVehicle?: string;
  driverLicensePlate?: string;
  currentCoords?: [number, number];
}

export interface AvailableOrder extends Order {
  clientName: string;
  clientPhone: string;
}

export interface DriverVerification {
  id: string;
  userId: string;
  uniqueDriverId: string;
  idCardPhoto: string;
  vehicleType: string;
  licensePlate: string;
  payoutPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface DriverPayoutRequest {
  id: string;
  driverId: string;
  amount: number;
  paymentMethod: 'moncash' | 'natcash' | 'bank_transfer';
  accountNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// ── KONSTANTES YO ──

export const SERVICE_ICONS: Record<string, string> = {
  'Pakè': '📦',
  'Manje': '🍔',
  'Dokiman': '📄',
  'Medyaman': '💊',
  'Acha Espesyal': '🛍️',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'An atant',
  accepted: 'Aksepte',
  on_the_way: 'Chofè sou wout',
  in_transit: 'Livrezon ap fèt',
  delivered: 'Livre ak siksè',
  cancelled: 'Anule',
};

export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-amber-100', text: 'text-amber-800' },
  accepted: { bg: 'bg-blue-100', text: 'text-blue-800' },
  on_the_way: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  in_transit: { bg: 'bg-purple-100', text: 'text-purple-800' },
  delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};