import { useState, useEffect } from 'react';
import { getCurrentRoute, routes } from '@/lib/router';
import { requireAuth } from '@/lib/auth';
import { initializeSampleData } from '@/lib/localStorage';

// Import all page components
import HomePage from '@/components/pages/HomePage';
import LoginPage from '@/components/pages/LoginPage';
import RegisterPage from '@/components/pages/RegisterPage';
import DashboardPage from '@/components/pages/DashboardPage';
import PetsPage from '@/components/pages/PetsPage';
import PetDetailsPage from '@/components/pages/PetDetailsPage';
import AddPetPage from '@/components/pages/AddPetPage';
import ContactPage from '@/components/pages/ContactPage';

const AppRouter = () => {
  const [currentComponent, setCurrentComponent] = useState<React.ReactNode>(null);

  useEffect(() => {
    // Initialize sample data on app start
    initializeSampleData();

    const handleRouteChange = () => {
      const route = getCurrentRoute();
      
      if (!route) {
        // 404 - Route not found
        setCurrentComponent(
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-xl text-muted-foreground mb-4">Page not found</p>
              <button
                onClick={() => window.history.pushState({}, '', '/')}
                className="text-primary hover:underline"
              >
                Go home
              </button>
            </div>
          </div>
        );
        return;
      }

      // Check authentication for protected routes
      if (route.requiresAuth && !requireAuth()) {
        return; // requireAuth will handle navigation to login
      }

      // Render the appropriate component
      switch (route.component) {
        case 'Home':
          setCurrentComponent(<HomePage />);
          break;
        case 'Login':
          setCurrentComponent(<LoginPage />);
          break;
        case 'Register':
          setCurrentComponent(<RegisterPage />);
          break;
        case 'Dashboard':
          setCurrentComponent(<DashboardPage />);
          break;
        case 'Pets':
          setCurrentComponent(<PetsPage />);
          break;
        case 'PetDetails':
          setCurrentComponent(<PetDetailsPage />);
          break;
        case 'AddPet':
          setCurrentComponent(<AddPetPage />);
          break;
        case 'Contact':
          setCurrentComponent(<ContactPage />);
          break;
        default:
          setCurrentComponent(
            <div className="min-h-screen flex items-center justify-center">
              <p>Component not found</p>
            </div>
          );
      }
    };

    // Handle initial route
    handleRouteChange();

    // Listen for route changes
    window.addEventListener('routechange', handleRouteChange);
    
    return () => {
      window.removeEventListener('routechange', handleRouteChange);
    };
  }, []);

  return <>{currentComponent}</>;
};

export default AppRouter;