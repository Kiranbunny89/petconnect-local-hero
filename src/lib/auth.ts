import { sessionStorage } from './localStorage';
import { navigate } from './router';

// Authentication guard for protected routes
export const requireAuth = (): boolean => {
  const user = sessionStorage.getCurrentUser();
  if (!user) {
    navigate('/login');
    return false;
  }
  return true;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return sessionStorage.getCurrentUser() !== null;
};

// Logout user
export const logout = (): void => {
  sessionStorage.clear();
  navigate('/');
};

// Get current user
export const getCurrentUser = () => {
  return sessionStorage.getCurrentUser();
};