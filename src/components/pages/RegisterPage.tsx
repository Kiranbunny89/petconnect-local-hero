import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { userStorage, sessionStorage } from '@/lib/localStorage';
import { navigate } from '@/lib/router';
import { PawPrint, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return 'Please fill in all fields';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    // Check if user already exists
    if (userStorage.findByEmail(formData.email)) {
      return 'An account with this email already exists';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      // Create user
      const user = userStorage.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Create session
      sessionStorage.create(user.id);

      toast({
        title: "Account created!",
        description: `Welcome to PetConnect, ${user.name}!`,
      });

      // Redirect to dashboard
      navigate('/dashboard');
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
            <h1 className="text-2xl font-bold">Join PetConnect</h1>
            <p className="text-muted-foreground">
              Create your account to start connecting with pets
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
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

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
                    placeholder="Create a password"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;