import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { userStorage, sessionStorage } from '@/lib/localStorage';
import { navigate } from '@/lib/router';
import { PawPrint, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }

      // Authenticate user
      const user = userStorage.authenticate(formData.email, formData.password);
      
      if (user) {
        // Create session
        sessionStorage.create(user.id);
        
        toast({
          title: "Welcome back!",
          description: `Successfully logged in as ${user.name}`,
        });

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6 bg-gradient-to-br from-background to-muted/20">
      <div className="w-full max-w-md">
        <Card className="shadow-hero">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="gradient-hero p-3 rounded-full">
                <PawPrint className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your PetConnect account
            </p>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Demo credentials: sarah@example.com / password123
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-primary hover:underline font-medium"
                >
                  Create account
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;