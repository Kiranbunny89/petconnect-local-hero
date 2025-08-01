import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone, Send, MessageCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again later or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about PetConnect? We're here to help! Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <h3 className="text-xl font-semibold">Get in Touch</h3>
                <p className="text-muted-foreground">
                  We'd love to hear from you. Choose the best way to reach us.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="gradient-hero p-2 rounded-lg mt-1">
                    <Mail className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-muted-foreground">support@petconnect.com</p>
                    <p className="text-sm text-muted-foreground">For general inquiries</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="gradient-hero p-2 rounded-lg mt-1">
                    <Phone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-muted-foreground">+1 (555) 123-PETS</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-5PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="gradient-hero p-2 rounded-lg mt-1">
                    <Clock className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Response Time</h4>
                    <p className="text-muted-foreground">Within 24 hours</p>
                    <p className="text-sm text-muted-foreground">Usually much faster!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="shadow-card">
              <CardHeader>
                <h3 className="text-lg font-semibold">Quick Help</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1">How do I list a pet?</h4>
                  <p className="text-sm text-muted-foreground">
                    Register an account, go to your dashboard, and click "Add Pet" to create a listing.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Is PetConnect free?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! Creating listings and browsing pets is completely free for all users.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">How do I contact pet owners?</h4>
                  <p className="text-sm text-muted-foreground">
                    View a pet's details page and click "Contact Owner" to send them an email directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardHeader>
                <h3 className="text-xl font-semibold flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  Send us a Message
                </h3>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full md:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Send className="h-5 w-5 mr-2 animate-pulse" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="shadow-card max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-lg font-semibold mb-4">About PetConnect Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our support team consists of pet lovers who understand the importance of finding the right home for every animal. 
                Whether you need help with your listing, have questions about the platform, or want to report an issue, 
                we're committed to providing you with prompt and helpful assistance. Your feedback helps us make PetConnect 
                better for everyone in our community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;