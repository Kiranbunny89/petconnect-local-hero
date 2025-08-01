import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Clock } from 'lucide-react';
import { Pet } from '@/lib/localStorage';
import { navigate } from '@/lib/router';

interface PetCardProps {
  pet: Pet;
  showOwnerInfo?: boolean;
}

const PetCard = ({ pet, showOwnerInfo = false }: PetCardProps) => {
  const handleViewDetails = () => {
    navigate(`/pets/${pet.id}`);
  };

  const getAgeText = (age: number) => {
    if (age < 1) return 'Puppy/Kitten';
    if (age === 1) return '1 year old';
    return `${age} years old`;
  };

  return (
    <Card className="pet-card h-full">
      <div className="relative">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={pet.gender === 'male' ? 'default' : 'secondary'}>
            {pet.gender}
          </Badge>
        </div>
        {pet.featured && (
          <div className="absolute top-3 left-3">
            <Badge className="gradient-accent text-accent-foreground">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-semibold text-foreground">{pet.name}</h3>
            <p className="text-muted-foreground">{pet.breed}</p>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {getAgeText(pet.age)}
          </div>

          <p className="text-sm text-foreground line-clamp-2">
            {pet.description}
          </p>

          {showOwnerInfo && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              Contact: {pet.contact}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleViewDetails}
          className="w-full"
          variant="default"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PetCard;