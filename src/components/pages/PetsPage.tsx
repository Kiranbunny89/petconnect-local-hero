import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import PetCard from '@/components/PetCard';
import { petStorage, Pet } from '@/lib/localStorage';
import { Search, Filter, PawPrint } from 'lucide-react';

const PetsPage = () => {
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [breedFilter, setBreedFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');

  useEffect(() => {
    const pets = petStorage.getAll();
    setAllPets(pets);
    setFilteredPets(pets);
  }, []);

  useEffect(() => {
    let filtered = allPets;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Breed filter
    if (breedFilter !== 'all') {
      filtered = filtered.filter(pet => pet.breed === breedFilter);
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(pet => pet.gender === genderFilter);
    }

    // Age filter
    if (ageFilter !== 'all') {
      if (ageFilter === 'young') {
        filtered = filtered.filter(pet => pet.age <= 2);
      } else if (ageFilter === 'adult') {
        filtered = filtered.filter(pet => pet.age > 2 && pet.age <= 6);
      } else if (ageFilter === 'senior') {
        filtered = filtered.filter(pet => pet.age > 6);
      }
    }

    setFilteredPets(filtered);
  }, [allPets, searchTerm, breedFilter, genderFilter, ageFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setBreedFilter('all');
    setGenderFilter('all');
    setAgeFilter('all');
  };

  // Get unique breeds for filter options
  const breeds = [...new Set(allPets.map(pet => pet.breed))].sort();

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All Pets</h1>
          <p className="text-muted-foreground">
            Browse through all available pets looking for loving homes
          </p>
        </div>

        {/* Filters */}
        <Card className="shadow-card mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Filter & Search</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search pets by name, breed, or description..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Breed Filter */}
              <Select value={breedFilter} onValueChange={setBreedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All breeds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All breeds</SelectItem>
                  {breeds.map(breed => (
                    <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Gender Filter */}
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>

              {/* Age Filter */}
              <Select value={ageFilter} onValueChange={setAgeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ages</SelectItem>
                  <SelectItem value="young">Young (0-2 years)</SelectItem>
                  <SelectItem value="adult">Adult (3-6 years)</SelectItem>
                  <SelectItem value="senior">Senior (7+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || breedFilter !== 'all' || genderFilter !== 'all' || ageFilter !== 'all') && (
              <div className="mt-4">
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredPets.length === 1 
              ? '1 pet found' 
              : `${filteredPets.length} pets found`
            }
          </p>
        </div>

        {/* Pet Grid */}
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} showOwnerInfo={true} />
            ))}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="text-center py-16">
              <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No pets found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || breedFilter !== 'all' || genderFilter !== 'all' || ageFilter !== 'all'
                  ? 'Try adjusting your search criteria to find more pets.'
                  : 'No pets are currently available. Check back soon!'
                }
              </p>
              {(searchTerm || breedFilter !== 'all' || genderFilter !== 'all' || ageFilter !== 'all') && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PetsPage;