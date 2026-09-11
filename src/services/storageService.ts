import { 
  User, 
  Driver, 
  Order, 
  DeliveryForm, 
  DriverPayoutRequest, 
  DriverVerification,
  UserRole 
} from '../types';
import { mockUser, mockDriver, mockOrders } from '../mockData';

class StorageService {
  private USERS_KEY = 'livrez_nou_users';
  private CURRENT_USER_KEY = 'livrez_nou_current_user';
  private ORDERS_KEY = 'livrez_nou_orders';
  private VERIFICATIONS_KEY = 'livrez_nou_verifications';

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([mockUser, mockDriver]));
    }
    if (!localStorage.getItem(this.CURRENT_USER_KEY)) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(mockUser));
    }
    if (!localStorage.getItem(this.ORDERS_KEY)) {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(mockOrders));
    }
    if (!localStorage.getItem(this.VERIFICATIONS_KEY)) {
      localStorage.setItem(this.VERIFICATIONS_KEY, JSON.stringify([]));
    }
  }

  // ── USER MANAGEMENT ──

  public getUser(): User {
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : mockUser;
  }

  public getAllUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  public loginWithPhone(phone: string, role: UserRole): User {
    const users = this.getAllUsers();
    let existing = users.find(u => u.phone === phone);

    if (!existing) {
      existing = {
        id: `usr-${Date.now()}`,
        name: 'Itilizatè Nouvo',
        phone,
        email: `${phone.replace(/\D/g, '')}@livrez-nou.ht`,
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role,
        balance: role === 'client' ? 2000 : 0,
      };
      users.push(existing);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(existing));
    return existing;
  }

  public registerUser(name: string, phone: string, email: string, role: UserRole): User {
    const users = this.getAllUsers();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      phone,
      email: email || `${phone.replace(/\D/g, '')}@livrez-nou.ht`,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role,
      balance: role === 'client' ? 5000 : 0,
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
    return newUser;
  }

  public updateUserProfilePhoto(photoUrl: string): User {
    const user = this.getUser();
    user.photo = photoUrl;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));

    const users = this.getAllUsers().map(u => u.id === user.id ? user : u);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return user;
  }

  public updateBalance(amount: number): number {
    const user = this.getUser();
    user.balance += amount;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));

    const users = this.getAllUsers().map(u => u.id === user.id ? user : u);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return user.balance;
  }

  // ── ORDER MANAGEMENT ──

  public getOrders(): Order[] {
    return JSON.parse(localStorage.getItem(this.ORDERS_KEY) || '[]');
  }

  public saveOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
  }

  public saveNewOrder(form: DeliveryForm, total: number): Order {
    const currentUser = this.getUser();
    const newOrder: Order = {
      id: `LN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: currentUser.id,
      pickupAddress: form.pickupAddress,
      deliveryAddress: form.deliveryAddress,
      serviceType: form.serviceType || 'Pakè',
      description: form.description,
      recipientName: form.recipientName,
      recipientPhone: form.recipientPhone,
      instructions: form.instructions,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedMinutes: 20,
      distanceKm: 3.5,
      deliveryFee: total - 50,
      serviceFee: 50,
      total: total,
      paymentMethod: form.paymentMethod,
      isPaid: form.paymentMethod !== 'cash',
    };

    this.saveOrder(newOrder);
    return newOrder;
  }

  // ── DRIVER VERIFICATION ──

  public saveDriverVerification(verification: DriverVerification): void {
    const list: DriverVerification[] = JSON.parse(localStorage.getItem(this.VERIFICATIONS_KEY) || '[]');
    list.unshift(verification);
    localStorage.setItem(this.VERIFICATIONS_KEY, JSON.stringify(list));
  }

  public registerDriverVerification(data: { idCardPhoto: string; vehicleType: string; licensePlate: string; payoutPhone: string }): DriverVerification {
    const user = this.getUser();
    const verification: DriverVerification = {
      id: `ver-${Date.now()}`,
      userId: user.id,
      uniqueDriverId: `LIV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      idCardPhoto: data.idCardPhoto,
      vehicleType: data.vehicleType,
      licensePlate: data.licensePlate,
      payoutPhone: data.payoutPhone,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };

    this.saveDriverVerification(verification);
    
    // Update user role
    user.role = 'driver';
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    
    return verification;
  }

  public getDriverVerification(userId: string): DriverVerification | undefined {
    const list: DriverVerification[] = JSON.parse(localStorage.getItem(this.VERIFICATIONS_KEY) || '[]');
    return list.find(v => v.userId === userId);
  }
}

export const storageService = new StorageService();