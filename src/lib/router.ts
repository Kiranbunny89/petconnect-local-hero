// PetConnect routing utilities for SPA navigation

export type RouteParams = Record<string, string>;

export interface Route {
  path: string;
  component: string;
  requiresAuth?: boolean;
  title?: string;
}

export const routes: Route[] = [
  { path: '/', component: 'Home', title: 'PetConnect - Find Your Perfect Pet' },
  { path: '/login', component: 'Login', title: 'Login - PetConnect' },
  { path: '/register', component: 'Register', title: 'Register - PetConnect' },
  { path: '/dashboard', component: 'Dashboard', requiresAuth: true, title: 'Dashboard - PetConnect' },
  { path: '/pets', component: 'Pets', requiresAuth: true, title: 'All Pets - PetConnect' },
  { path: '/pets/:id', component: 'PetDetails', requiresAuth: true, title: 'Pet Details - PetConnect' },
  { path: '/add-pet', component: 'AddPet', requiresAuth: true, title: 'Add Pet - PetConnect' },
  { path: '/contact', component: 'Contact', title: 'Contact - PetConnect' },
];

export class Router {
  private currentRoute: Route | null = null;
  private params: RouteParams = {};

  constructor() {
    // Listen for navigation events
    window.addEventListener('popstate', () => this.handleRouteChange());
    
    // Handle initial route
    this.handleRouteChange();
  }

  private parseRoute(path: string): { route: Route | null; params: RouteParams } {
    for (const route of routes) {
      const pattern = route.path.replace(/:([^\/]+)/g, '([^/]+)');
      const regex = new RegExp(`^${pattern}$`);
      const match = path.match(regex);

      if (match) {
        const paramNames = route.path.match(/:([^\/]+)/g) || [];
        const params: RouteParams = {};
        
        paramNames.forEach((param, index) => {
          const paramName = param.slice(1); // Remove the ':'
          params[paramName] = match[index + 1];
        });

        return { route, params };
      }
    }

    return { route: null, params: {} };
  }

  private handleRouteChange(): void {
    const path = window.location.pathname;
    const { route, params } = this.parseRoute(path);

    if (route) {
      this.currentRoute = route;
      this.params = params;
      
      // Update document title
      if (route.title) {
        document.title = route.title;
      }

      // Emit route change event
      window.dispatchEvent(new CustomEvent('routechange', {
        detail: { route, params }
      }));
    }
  }

  navigate(path: string): void {
    window.history.pushState({}, '', path);
    this.handleRouteChange();
  }

  replace(path: string): void {
    window.history.replaceState({}, '', path);
    this.handleRouteChange();
  }

  back(): void {
    window.history.back();
  }

  getCurrentRoute(): Route | null {
    return this.currentRoute;
  }

  getParams(): RouteParams {
    return this.params;
  }

  getParam(name: string): string | undefined {
    return this.params[name];
  }
}

// Create global router instance
export const router = new Router();

// Navigation helper functions
export const navigate = (path: string) => router.navigate(path);
export const replace = (path: string) => router.replace(path);
export const back = () => router.back();
export const getCurrentRoute = () => router.getCurrentRoute();
export const getParams = () => router.getParams();
export const getParam = (name: string) => router.getParam(name);