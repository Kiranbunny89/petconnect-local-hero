import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PetCard from '@/components/PetCard';
import { petStorage, Pet } from '@/lib/localStorage';
import { getCurrentUser } from '@/lib/auth';
import { navigate } from '@/lib/router';
import { Plus, PawPrint, User, Calendar, Mail, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DashboardPage = () => {
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      const pets = petStorage.getByOwnerId(currentUser.id);
      setUserPets(pets);
    }
  }, []);

  const handleDeletePet = (petId: string) => {
    if (window.confirm('Are you sure you want to delete this pet listing?')) {
      if (petStorage.delete(petId)) {
        setUserPets(prev => prev.filter(pet => pet.id !== petId));
        toast({
          title: "Pet listing deleted",
          description: "The pet listing has been removed successfully.",
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-muted-foreground">
            Manage your pet listings and account information
          </p>
        </div>

        {/* User Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="gradient-hero p-2 rounded-lg">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">Account Information</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="gradient-hero p-2 rounded-lg">
                  <PawPrint className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">Your Statistics</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Pets Listed</span>
                <Badge variant="secondary">{userPets.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Featured Pets</span>
                <Badge variant="secondary">
                  {userPets.filter(pet => pet.featured).length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <h3 className="font-semibold">Quick Actions</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => navigate('/add-pet')}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Pet
              </Button>
              <Button 
                onClick={() => navigate('/pets')}
                variant="outline"
                className="w-full"
              >
                Browse All Pets
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* User's Pets */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Pet Listings</h2>
            <Button onClick={() => navigate('/add-pet')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Pet
            </Button>
          </div>

          {userPets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userPets.map((pet) => (
                <div key={pet.id} className="relative">
                  <PetCard pet={pet} showOwnerInfo={false} />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 left-2 p-2"
                    onClick={() => handleDeletePet(pet.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="text-center py-12">
                <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No pet listings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first pet to help them find a loving home.
                </p>
                <Button onClick={() => navigate('/add-pet')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Pet
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;