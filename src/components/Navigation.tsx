import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { navigate, getCurrentRoute } from '@/lib/router';
import { isAuthenticated, logout, getCurrentUser } from '@/lib/auth';
import { Heart, Menu, X, User, PawPrint } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const updateAuthState = () => {
      setIsAuth(isAuthenticated());
      setUser(getCurrentUser());
      setCurrentPath(window.location.pathname);
    };

    updateAuthState();

    // Listen for route changes
    const handleRouteChange = () => {
      updateAuthState();
    };

    window.addEventListener('routechange', handleRouteChange);
    return () => window.removeEventListener('routechange', handleRouteChange);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', public: true },
    { path: '/pets', label: 'All Pets', public: false },
    { path: '/contact', label: 'Contact', public: true },
  ];

  const authItems = isAuth
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/add-pet', label: 'Add Pet' },
      ]
    : [
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Register' },
      ];

  return (
    <nav className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <div className="gradient-hero p-2 rounded-lg">
              <PawPrint className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">PetConnect</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              (item.public || isAuth) && (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              )
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuth ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name}
                </span>
                {authItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={currentPath === item.path ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {authItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={item.label === 'Register' ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                (item.public || isAuth) && (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`nav-link text-left py-2 ${currentPath === item.path ? 'active' : ''}`}
                  >
                    {item.label}
                  </button>
                )
              ))}
              
              {isAuth ? (
                <div className="pt-3 border-t border-border space-y-2">
                  <div className="text-sm text-muted-foreground pb-2">
                    Welcome, {user?.name}
                  </div>
                  {authItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={currentPath === item.path ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-3 border-t border-border space-y-2">
                  {authItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={item.label === 'Register' ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;