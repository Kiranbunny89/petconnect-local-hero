import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PetCard from '@/components/PetCard';
import { petStorage, Pet } from '@/lib/localStorage';
import { navigate } from '@/lib/router';
import { isAuthenticated } from '@/lib/auth';
import { ArrowRight, Shield, Users, Heart, PawPrint } from 'lucide-react';

const HomePage = () => {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);

  useEffect(() => {
    const featured = petStorage.getFeatured();
    setFeaturedPets(featured);
  }, []);

  const handleSeeMore = () => {
    if (isAuthenticated()) {
      navigate('/pets');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-foreground/20 p-4 rounded-full">
              <PawPrint className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Find Your Perfect Pet Companion
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 text-balance">
            Connect with loving pets looking for their forever homes. Join thousands of happy families who found their furry friends on PetConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/pets')}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Browse All Pets
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/register')}
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Join PetConnect
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Pets</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Meet some of our amazing pets currently looking for loving homes
            </p>
          </div>

          {featuredPets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {featuredPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  size="lg" 
                  onClick={handleSeeMore}
                  variant="outline"
                >
                  See All Pets
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No featured pets available right now. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Platform Rules Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Guidelines</h2>
            <p className="text-lg text-muted-foreground">
              Important information for all PetConnect users
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="gradient-hero p-3 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Accurate Information</h3>
                <p className="text-muted-foreground">
                  All sellers must provide accurate and truthful details about their pets, including health status, age, and temperament.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="gradient-hero p-3 rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Direct Communication</h3>
                <p className="text-muted-foreground">
                  All contact and transactions happen directly between buyers and sellers. PetConnect facilitates connections only.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <div className="gradient-hero p-3 rounded-full w-fit mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Platform Responsibility</h3>
                <p className="text-muted-foreground">
                  PetConnect is not responsible for transactions between users. Always meet in safe, public locations and verify all information.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Safety Disclaimer
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              PetConnect provides a platform for pet listings and connections but does not guarantee the accuracy of listings or the legitimacy of users. 
              Users are responsible for their own safety and due diligence when meeting or conducting transactions. Always verify pet health records, 
              meet in public places, and trust your instincts. Report any suspicious activity to maintain a safe community for all pet lovers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your New Best Friend?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of happy families who have found their perfect pet companions through PetConnect.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
            >
              Get Started Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/contact')}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;