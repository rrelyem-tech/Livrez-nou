import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { Screen, DeliveryForm, UserRole, OrderStatus, ActiveOrder } from './types';

// Importasyon tout ekran yo
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import AuthScreen from './screens/AuthScreen';
import ClientHome from './screens/ClientHome';
import NewDelivery from './screens/NewDelivery';
import PriceEstimation from './screens/PriceEstimation';
import OrderConfirmation from './screens/OrderConfirmation';
import DeliveryTracking from './screens/DeliveryTracking';
import DeliveryHistory from './screens/DeliveryHistory';
import DriverDashboard from './screens/DriverDashboard';
import DriverOnboarding from './screens/DriverOnboarding';
import ProfileScreen from './screens/ProfileScreen';
import MessagesScreen from './screens/MessagesScreen';
import AdminDashboard from './screens/AdminDashboard';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class GlobalErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erè Aplikasyon Livrez-Nou:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-slate-950 flex justify-center items-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-3xl">⚠️</div>
            <h2 className="font-display font-black text-xl text-navy">Yon pwoblèm rive!</h2>
            <p className="text-xs text-slate-500">Nou pa t kapab chaje paj sa a. Tanpri klike sou bouton anba a pou w re-antre.</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="w-full h-12 rounded-2xl bg-brand text-white font-bold text-xs"
            >
              🔄 Eseye Ankò
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const INITIAL_FORM: DeliveryForm = {
  pickupAddress: '',
  deliveryAddress: '',
  serviceType: 'Pakè',
  description: '',
  recipientName: '',
  recipientPhone: '',
  instructions: '',
  isScheduled: false,
  scheduledTime: '',
  paymentMethod: 'wallet',
};

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [deliveryForm, setDeliveryForm] = useState<DeliveryForm>(INITIAL_FORM);
  const [, setUserRole] = useState<UserRole>('client');
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleDeliverySubmit = (form: DeliveryForm) => {
    setDeliveryForm(form);
    setCurrentScreen('price-estimation');
  };

  const handleStatusUpdate = (status: OrderStatus) => {
    setActiveOrder(prev => (prev ? { ...prev, status } : prev));
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'driver') {
      setCurrentScreen('driver-dashboard');
    } else {
      setCurrentScreen('client-home');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen navigate={navigate} />;
      case 'onboarding':
        return <OnboardingScreen navigate={navigate} />;
      case 'auth':
        return <AuthScreen navigate={navigate} onLogin={handleLogin} />;
      case 'client-home':
        return <ClientHome navigate={navigate} activeOrder={activeOrder} />;
      case 'new-delivery':
        return <NewDelivery navigate={navigate} onSubmit={handleDeliverySubmit} />;
      case 'price-estimation':
        return <PriceEstimation navigate={navigate} form={deliveryForm} />;
      case 'order-confirmation':
        return <OrderConfirmation navigate={navigate} form={deliveryForm} />;
      case 'delivery-tracking':
        return <DeliveryTracking navigate={navigate} activeOrder={activeOrder} onStatusUpdate={handleStatusUpdate} />;
      case 'delivery-history':
        return <DeliveryHistory navigate={navigate} />;
      case 'driver-dashboard':
        return <DriverDashboard navigate={navigate} />;
      case 'driver-onboarding':
        return <DriverOnboarding navigate={navigate} />;
      case 'profile':
        return <ProfileScreen navigate={navigate} />;
      case 'messages':
        return <MessagesScreen navigate={navigate} />;
      case 'admin-dashboard':
        return <AdminDashboard navigate={navigate} />;
      default:
        return <ClientHome navigate={navigate} activeOrder={activeOrder} />;
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 flex justify-center items-center font-sans antialiased">
      <div className="w-full max-w-md h-full sm:h-[844px] bg-white sm:rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-[8px] sm:border-slate-800">
        {renderScreen()}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <AppContent />
    </GlobalErrorBoundary>
  );
}