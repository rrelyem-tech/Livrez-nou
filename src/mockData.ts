import { User, Driver, Order, AvailableOrder } from './types';

export const mockUser: User = {
  id: 'usr-001',
  name: 'Jean-Baptiste Pierre',
  phone: '+509 3712-3456',
  email: 'jean.pierre@gmail.com',
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  role: 'client',
  balance: 2500,
  savedAddresses: [
    { id: 'addr-1', title: 'Kay mwen', fullAddress: '12 Rue Panaméricaine, Pétion-Ville' },
    { id: 'addr-2', title: 'Travay', fullAddress: '45 Boulevard 15 Octobre, Tabarre' }
  ]
};

export const mockDriver: Driver = {
  id: 'drv-101',
  name: 'Joseph Samuel',
  photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  phone: '+509 3899-0011',
  rating: 4.9,
  totalDeliveries: 342,
  vehicle: 'Honda CB 125 (Rouge)',
  licensePlate: 'MC-4821',
  isOnline: true,
  earningsToday: 1850,
  earningsTotal: 45200,
};

export const mockDriver2: Driver = {
  id: 'drv-102',
  name: 'Michel Saint-Louis',
  photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  phone: '+509 3611-2233',
  rating: 4.7,
  totalDeliveries: 128,
  vehicle: 'Yamaha Express 150',
  licensePlate: 'MC-9102',
  isOnline: false,
  earningsToday: 0,
  earningsTotal: 18400,
};

export const mockOrders: Order[] = [
  {
    id: 'LN-2026-9081',
    clientId: 'usr-001',
    driverId: 'drv-101',
    pickupAddress: 'Pétion-Ville, Rue Clerveaux',
    deliveryAddress: 'Delmas 75, Rue Capois',
    serviceType: 'Pakè',
    description: 'Yon ti bwat dokiman ak yon kle USB',
    recipientName: 'Marie Lucie',
    recipientPhone: '+509 3400-1122',
    status: 'delivered',
    createdAt: '2026-09-05T14:30:00Z',
    estimatedMinutes: 25,
    distanceKm: 4.2,
    deliveryFee: 350,
    serviceFee: 35,
    total: 385,
    paymentMethod: 'wallet',
    isPaid: true,
    rating: 5,
  },
  {
    id: 'LN-2026-9082',
    clientId: 'usr-001',
    driverId: 'drv-101',
    pickupAddress: 'Tabarre 27',
    deliveryAddress: 'Aéroport International Toussaint Louverture',
    serviceType: 'Dokiman',
    recipientName: 'Frantz Alexis',
    recipientPhone: '+509 3100-5544',
    status: 'on_the_way',
    createdAt: '2026-09-06T11:10:00Z',
    estimatedMinutes: 15,
    distanceKm: 2.8,
    deliveryFee: 250,
    serviceFee: 25,
    total: 275,
    paymentMethod: 'moncash',
    isPaid: true,
    rating: 4,
  }
];

export const mockAvailableOrders: AvailableOrder[] = [
  {
    id: 'LN-2026-9100',
    clientId: 'usr-002',
    clientName: 'Florence D.',
    clientPhone: '+509 3700-8899',
    pickupAddress: 'Pétion-Ville, Complexe Promesse',
    deliveryAddress: 'Lalue, MTPTC',
    serviceType: 'Acha Espesyal',
    description: '2 plat manje ak yon boutèy ji',
    recipientName: 'Patrick V.',
    recipientPhone: '+509 3600-4411',
    status: 'pending',
    createdAt: '2026-09-06T12:00:00Z',
    estimatedMinutes: 30,
    distanceKm: 6.1,
    deliveryFee: 500,
    serviceFee: 50,
    total: 550,
    paymentMethod: 'cash',
    isPaid: false,
  }
];