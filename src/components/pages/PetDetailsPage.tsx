import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { petStorage, Pet, userStorage } from '@/lib/localStorage';
import { getParam, navigate } from '@/lib/router';
import { ArrowLeft, Calendar, Heart, Info, Mail, User, Clock, Shield } from 'lucide-react';

const PetDetailsPage = () => {
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const petId = getParam('id');
    if (petId) {
      const petData = petStorage.getById(petId);
      if (petData) {
        setPet(petData);
        // Get owner information
        const users = userStorage.getAll();
        const ownerData = users.find(user => user.id === petData.ownerId);
        setOwner(ownerData);
      }
    }
    setLoading(false);
  }, []);

  const handleContactOwner = () => {
    if (pet && owner) {
      // Open email client
      window.location.href = `mailto:${pet.contact}?subject=Interested in ${pet.name}&body=Hi ${owner.name},%0D%0A%0D%0AI'm interested in learning more about ${pet.name}. Could we please discuss the details?%0D%0A%0D%0AThank you!`;
    }
  };

  const getAgeText = (age: number) => {
    if (age < 1) return 'Less than 1 year old';
    if (age === 1) return '1 year old';
    return `${age} years old`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading pet details...</p>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-6">
        <Card className="max-w-md w-full text-center shadow-card">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The pet you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/pets')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Pets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/pets')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Pets
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Image */}
          <div className="space-y-4">
            <Card className="shadow-card overflow-hidden">
              <div className="relative">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge variant={pet.gender === 'male' ? 'default' : 'secondary'}>
                    {pet.gender}
                  </Badge>
                  {pet.featured && (
                    <Badge className="gradient-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Info */}
            <Card className="shadow-card">
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Quick Info
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Breed</span>
                  <span className="font-medium">{pet.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-medium">{getAgeText(pet.age)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-medium capitalize">{pet.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed</span>
                  <span className="font-medium">
                    {new Date(pet.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pet Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{pet.name}</h1>
              <p className="text-xl text-muted-foreground">{pet.breed}</p>
            </div>

            {/* Description */}
            <Card className="shadow-card">
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-primary" />
                  About {pet.name}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{pet.description}</p>
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card className="shadow-card">
              <CardHeader>
                <h3 className="font-semibold flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-success" />
                  Health Information
                </h3>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{pet.healthInfo}</p>
              </CardContent>
            </Card>

            {/* Owner Information */}
            {owner && (
              <Card className="shadow-card">
                <CardHeader>
                  <h3 className="font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Owner Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">Owner:</span>
                    <span className="font-medium">{owner.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{pet.contact}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member since {new Date(owner.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Button */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    All communication happens directly between you and the pet owner. 
                    PetConnect facilitates the connection but is not involved in transactions.
                  </AlertDescription>
                </Alert>
                
                <Button 
                  onClick={handleContactOwner}
                  size="lg"
                  className="w-full"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Owner
                </Button>
                
                <p className="text-sm text-muted-foreground text-center mt-3">
                  Opens your email client to send a message
                </p>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Safety Reminder:</strong> Always meet in public places, verify pet health records, 
                and trust your instincts. PetConnect is not responsible for transactions between users.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPage;