import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { petStorage } from '@/lib/localStorage';
import { getCurrentUser } from '@/lib/auth';
import { navigate } from '@/lib/router';
import { validateImage, resizeImage } from '@/lib/imageUtils';
import { Upload, Bot, CheckCircle, XCircle, AlertTriangle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  type: 'bot' | 'system';
  message: string;
  timestamp: Date;
}

const AddPetPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    healthInfo: '',
    description: '',
    contact: '',
    image: '',
  });
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      type: 'bot',
      message: 'Hello! I\'m your PetConnect validation assistant. I\'ll help ensure your pet listing meets our standards. Please fill out the form and I\'ll validate your information.',
      timestamp: new Date(),
    }
  ]);
  
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'pending' | 'validating' | 'approved' | 'rejected'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setValidationStatus('pending');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const isValid = await validateImage(file);
      if (!isValid) {
        toast({
          variant: "destructive",
          title: "Invalid image",
          description: "Please upload a valid image file under 5MB.",
        });
        return;
      }

      const resizedImage = await resizeImage(file, 800, 600);
      setFormData(prev => ({ ...prev, image: resizedImage }));
      
      addChatMessage('system', 'Image uploaded successfully! ✅');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to process the image. Please try again.",
      });
    }
  };

  const addChatMessage = (type: 'bot' | 'system', message: string) => {
    setChatMessages(prev => [...prev, {
      type,
      message,
      timestamp: new Date(),
    }]);
  };

  const validateForm = async () => {
    setIsValidating(true);
    setValidationStatus('validating');
    
    addChatMessage('bot', 'Starting validation... Let me check your pet listing details.');

    // Simulate chatbot validation process
    await new Promise(resolve => setTimeout(resolve, 1000));

    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check required fields
    if (!formData.name.trim()) issues.push('Pet name is required');
    if (!formData.breed.trim()) issues.push('Breed information is required');
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      issues.push('Valid age is required');
    }
    if (!formData.gender) issues.push('Gender selection is required');
    if (!formData.healthInfo.trim()) issues.push('Health information is required');
    if (!formData.description.trim()) issues.push('Description is required');
    if (!formData.contact.trim()) issues.push('Contact information is required');
    if (!formData.image) issues.push('Pet image is required');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check data quality
    if (formData.description.length < 20) {
      suggestions.push('Consider adding more details to the description (at least 20 characters)');
    }
    
    if (formData.healthInfo.length < 10) {
      suggestions.push('More detailed health information would be helpful for potential adopters');
    }

    if (Number(formData.age) > 20) {
      issues.push('Age seems unusually high - please verify the pet\'s age');
    }

    // Check for appropriate content
    const inappropriateWords = ['free', 'urgent', 'must go', 'moving'];
    const descriptionLower = formData.description.toLowerCase();
    if (inappropriateWords.some(word => descriptionLower.includes(word))) {
      suggestions.push('Consider revising description to focus on the pet\'s positive qualities rather than urgency');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (issues.length > 0) {
      setValidationStatus('rejected');
      addChatMessage('bot', `❌ I found ${issues.length} issue(s) that need to be addressed:`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      for (const issue of issues) {
        addChatMessage('bot', `• ${issue}`);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      addChatMessage('bot', 'Please fix these issues and try validating again.');
    } else {
      setValidationStatus('approved');
      addChatMessage('bot', '✅ Excellent! Your pet listing looks great and meets all our requirements.');
      
      if (suggestions.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
        addChatMessage('bot', 'I have some suggestions to make your listing even better:');
        for (const suggestion of suggestions) {
          addChatMessage('bot', `💡 ${suggestion}`);
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      addChatMessage('bot', '🎉 Your listing is ready to be published! Click "Submit Pet Listing" when you\'re ready.');
    }

    setIsValidating(false);
  };

  const handleSubmit = async () => {
    if (validationStatus !== 'approved') {
      toast({
        variant: "destructive",
        title: "Validation required",
        description: "Please validate your pet listing with the chatbot first.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const user = getCurrentUser();
      if (!user) {
        throw new Error('User not found');
      }

      // Create pet listing
      const newPet = petStorage.create({
        name: formData.name,
        breed: formData.breed,
        age: Number(formData.age),
        gender: formData.gender as 'male' | 'female',
        healthInfo: formData.healthInfo,
        description: formData.description,
        contact: formData.contact,
        image: formData.image,
        ownerId: user.id,
      });

      toast({
        title: "Pet listing created!",
        description: `${newPet.name} has been added to PetConnect successfully.`,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "Failed to create pet listing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Add New Pet</h1>
          <p className="text-muted-foreground">
            Create a listing to help your pet find a loving home
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="shadow-card">
            <CardHeader>
              <h2 className="text-xl font-semibold">Pet Information</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter pet's name"
                  />
                </div>
                <div>
                  <Label htmlFor="breed">Breed *</Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    placeholder="e.g., Golden Retriever"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age (years) *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="25"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Enter age in years"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Health Info */}
              <div>
                <Label htmlFor="healthInfo">Health Information *</Label>
                <Textarea
                  id="healthInfo"
                  value={formData.healthInfo}
                  onChange={(e) => handleInputChange('healthInfo', e.target.value)}
                  placeholder="Vaccination status, spay/neuter status, any health conditions..."
                  rows={3}
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your pet's personality, habits, ideal home..."
                  rows={4}
                />
              </div>

              {/* Contact */}
              <div>
                <Label htmlFor="contact">Contact Information *</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  placeholder="Email or phone number"
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label htmlFor="image">Pet Photo *</Label>
                <div className="mt-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a clear photo of your pet (max 5MB)
                  </p>
                </div>
                
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Pet preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Validation Button */}
              <div className="pt-4">
                <Button
                  onClick={validateForm}
                  disabled={isValidating}
                  className="w-full mb-4"
                  variant="outline"
                >
                  {isValidating ? (
                    <>
                      <Bot className="h-4 w-4 mr-2 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4 mr-2" />
                      Validate with AI Assistant
                    </>
                  )}
                </Button>

                {/* Validation Status */}
                {validationStatus !== 'pending' && (
                  <Alert className={`mb-4 ${validationStatus === 'approved' ? 'border-success' : validationStatus === 'rejected' ? 'border-destructive' : ''}`}>
                    {validationStatus === 'validating' && <Bot className="h-4 w-4 animate-spin" />}
                    {validationStatus === 'approved' && <CheckCircle className="h-4 w-4 text-success" />}
                    {validationStatus === 'rejected' && <XCircle className="h-4 w-4 text-destructive" />}
                    <AlertDescription>
                      {validationStatus === 'validating' && 'AI assistant is validating your listing...'}
                      {validationStatus === 'approved' && 'Listing validated successfully! Ready to publish.'}
                      {validationStatus === 'rejected' && 'Please fix the issues identified by the AI assistant.'}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={validationStatus !== 'approved' || isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Pet Listing
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chatbot */}
          <Card className="shadow-card">
            <CardHeader className="border-b">
              <div className="flex items-center space-x-2">
                <div className="gradient-hero p-2 rounded-lg">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">AI Validation Assistant</h2>
                  <p className="text-sm text-muted-foreground">
                    Get instant feedback on your listing
                  </p>
                </div>
                <Badge variant={validationStatus === 'approved' ? 'default' : 'secondary'} className="ml-auto">
                  {validationStatus === 'pending' && 'Ready'}
                  {validationStatus === 'validating' && 'Checking...'}
                  {validationStatus === 'approved' && 'Approved'}
                  {validationStatus === 'rejected' && 'Issues Found'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'system' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.type === 'bot'
                          ? 'bg-muted text-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.message}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddPetPage;