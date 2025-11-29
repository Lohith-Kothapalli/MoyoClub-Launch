import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { 
  Image, 
  Type, 
  Layout, 
  Save, 
  Eye, 
  RotateCcw, 
  Upload,
  Palette,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface HeroContent {
  badge: {
    text: string;
    loggedInText: string;
  };
  heading: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
  stats: {
    customers: { value: string; label: string };
    farms: { value: string; label: string };
    organic: { value: string; label: string };
  };
  heroImage: string;
  deliveryCard: {
    label: string;
    value: string;
  };
}

interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FeaturesContent {
  heading: string;
  subheading: string;
  features: FeatureItem[];
}

interface ContentData {
  hero: HeroContent;
  features: FeaturesContent;
}

export function ContentManagement() {
  const [content, setContent] = useState<ContentData>(getDefaultContent());
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = () => {
    const stored = localStorage.getItem('moyoclub_content');
    if (stored) {
      setContent(JSON.parse(stored));
    } else {
      setContent(getDefaultContent());
    }
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    localStorage.setItem('moyoclub_content', JSON.stringify(content));
    setHasUnsavedChanges(false);
    
    toast.success('Content saved successfully!', {
      description: 'Changes will appear on the consumer page',
    });
  };

  const handleReset = () => {
    if (!confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      return;
    }
    
    const defaults = getDefaultContent();
    setContent(defaults);
    localStorage.setItem('moyoclub_content', JSON.stringify(defaults));
    setHasUnsavedChanges(false);
    
    toast.success('Content reset to defaults');
  };

  const updateHeroField = (field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updateHeroNestedField = (parent: string, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [parent]: {
          ...(prev.hero[parent as keyof HeroContent] as any),
          [field]: value
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updateHeroStatsField = (stat: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        stats: {
          ...prev.hero.stats,
          [stat]: {
            ...(prev.hero.stats[stat as keyof typeof prev.hero.stats]),
            [field]: value
          }
        }
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updateFeaturesHeading = (field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [field]: value
      }
    }));
    setHasUnsavedChanges(true);
  };

  const updateFeature = (index: number, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      features: {
        ...prev.features,
        features: prev.features.features.map((f, i) => 
          i === index ? { ...f, [field]: value } : f
        )
      }
    }));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900 flex items-center gap-2">
            <Layout className="h-6 w-6" style={{ color: '#E87722' }} />
            Content Management
          </h2>
          <p className="text-gray-600 mt-1">
            Customize the content and images on the consumer main page
          </p>
        </div>
        <div className="flex gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              <AlertCircle className="h-3 w-3 mr-1" />
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={handleReset}
            className="text-gray-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
          <Button
            style={{ backgroundColor: '#E87722' }}
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hero">
            <Image className="h-4 w-4 mr-2" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="features">
            <Palette className="h-4 w-4 mr-2" />
            Features Section
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" style={{ color: '#A67C52' }} />
                Hero Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badge */}
              <div className="space-y-4">
                <h3 className="text-lg" style={{ color: '#A67C52' }}>Top Badge</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="badge-default">Badge Text (Not Logged In)</Label>
                    <Input
                      id="badge-default"
                      value={content.hero.badge.text}
                      onChange={(e) => updateHeroNestedField('badge', 'text', e.target.value)}
                      placeholder="No Wet Kitchen Needed • Farm to Table in 24 Hours"
                    />
                  </div>
                  <div>
                    <Label htmlFor="badge-logged-in">Badge Text (Logged In)</Label>
                    <Input
                      id="badge-logged-in"
                      value={content.hero.badge.loggedInText}
                      onChange={(e) => updateHeroNestedField('badge', 'loggedInText', e.target.value)}
                      placeholder="Welcome back, {name}! 👋"
                    />
                    <p className="text-xs text-gray-500 mt-1">{'{name}'} will be replaced with user's first name</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Main Heading */}
              <div>
                <Label htmlFor="heading">Main Heading</Label>
                <Input
                  id="heading"
                  value={content.hero.heading}
                  onChange={(e) => updateHeroField('heading', e.target.value)}
                  placeholder="Nutritious Meals from Local Farms • 20min to Cook"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={content.hero.description}
                  onChange={(e) => updateHeroField('description', e.target.value)}
                  placeholder="Quick, nutritious meals that are easy to prepare..."
                />
              </div>

              <Separator />

              {/* Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg" style={{ color: '#A67C52' }}>Call-to-Action Buttons</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-button">Primary Button Text</Label>
                    <Input
                      id="primary-button"
                      value={content.hero.primaryButton}
                      onChange={(e) => updateHeroField('primaryButton', e.target.value)}
                      placeholder="Browse Meals"
                    />
                  </div>
                  <div>
                    <Label htmlFor="secondary-button">Secondary Button Text</Label>
                    <Input
                      id="secondary-button"
                      value={content.hero.secondaryButton}
                      onChange={(e) => updateHeroField('secondaryButton', e.target.value)}
                      placeholder="Track Order"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stats */}
              <div className="space-y-4">
                <h3 className="text-lg" style={{ color: '#A67C52' }}>Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Customers</Label>
                    <Input
                      value={content.hero.stats.customers.value}
                      onChange={(e) => updateHeroStatsField('customers', 'value', e.target.value)}
                      placeholder="500+"
                    />
                    <Input
                      value={content.hero.stats.customers.label}
                      onChange={(e) => updateHeroStatsField('customers', 'label', e.target.value)}
                      placeholder="Happy Customers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Farms</Label>
                    <Input
                      value={content.hero.stats.farms.value}
                      onChange={(e) => updateHeroStatsField('farms', 'value', e.target.value)}
                      placeholder="50+"
                    />
                    <Input
                      value={content.hero.stats.farms.label}
                      onChange={(e) => updateHeroStatsField('farms', 'label', e.target.value)}
                      placeholder="Partner Farms"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organic</Label>
                    <Input
                      value={content.hero.stats.organic.value}
                      onChange={(e) => updateHeroStatsField('organic', 'value', e.target.value)}
                      placeholder="100%"
                    />
                    <Input
                      value={content.hero.stats.organic.label}
                      onChange={(e) => updateHeroStatsField('organic', 'label', e.target.value)}
                      placeholder="Organic"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" style={{ color: '#A67C52' }} />
                Hero Image & Delivery Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Image */}
              <div>
                <Label htmlFor="hero-image">Hero Image URL</Label>
                <Input
                  id="hero-image"
                  value={content.hero.heroImage}
                  onChange={(e) => updateHeroField('heroImage', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 1080x500px minimum</p>
                {content.hero.heroImage && (
                  <div className="mt-4 border rounded-lg overflow-hidden">
                    <img 
                      src={content.hero.heroImage} 
                      alt="Hero preview" 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1666819691716-827f78d892f3';
                      }}
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Delivery Card */}
              <div className="space-y-4">
                <h3 className="text-lg" style={{ color: '#A67C52' }}>Delivery Info Card</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="delivery-label">Card Label</Label>
                    <Input
                      id="delivery-label"
                      value={content.hero.deliveryCard.label}
                      onChange={(e) => updateHeroNestedField('deliveryCard', 'label', e.target.value)}
                      placeholder="Next Delivery"
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-value">Card Value</Label>
                    <Input
                      id="delivery-value"
                      value={content.hero.deliveryCard.value}
                      onChange={(e) => updateHeroNestedField('deliveryCard', 'value', e.target.value)}
                      placeholder="Tomorrow, 2PM"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" style={{ color: '#A67C52' }} />
                Section Headers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="features-heading">Main Heading</Label>
                <Input
                  id="features-heading"
                  value={content.features.heading}
                  onChange={(e) => updateFeaturesHeading('heading', e.target.value)}
                  placeholder="Why Choose MoyoClub?"
                />
              </div>
              <div>
                <Label htmlFor="features-subheading">Subheading</Label>
                <Textarea
                  id="features-subheading"
                  rows={3}
                  value={content.features.subheading}
                  onChange={(e) => updateFeaturesHeading('subheading', e.target.value)}
                  placeholder="We connect you directly with local farmers..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.features.features.map((feature, index) => (
              <Card key={feature.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getFeatureIcon(feature.icon)}
                    Feature {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Icon</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                    >
                      <option value="Leaf">🌿 Leaf (Farm/Organic)</option>
                      <option value="Heart">❤️ Heart (Health/Care)</option>
                      <option value="Truck">🚚 Truck (Delivery)</option>
                      <option value="Award">🏆 Award (Quality/Certified)</option>
                      <option value="Clock">⏰ Clock (Fast/Quick)</option>
                      <option value="Shield">🛡️ Shield (Safe/Secure)</option>
                      <option value="Star">⭐ Star (Premium/Best)</option>
                      <option value="Users">👥 Users (Community)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      placeholder="Feature title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      placeholder="Feature description"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Content Preview
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-8">
            {/* Hero Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gradient-to-b from-orange-50 to-white p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="inline-block rounded-full px-4 py-2 mb-4 bg-orange-100 text-orange-700">
                    {content.hero.badge.text}
                  </div>
                  <h1 className="text-4xl text-gray-900 mb-4">
                    {content.hero.heading}
                  </h1>
                  <p className="text-lg text-gray-600 mb-6">
                    {content.hero.description}
                  </p>
                  <div className="flex gap-4 mb-8">
                    <Button style={{ backgroundColor: '#E87722' }}>
                      {content.hero.primaryButton}
                    </Button>
                    <Button variant="outline">
                      {content.hero.secondaryButton}
                    </Button>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <div className="text-2xl" style={{ color: '#E87722' }}>
                        {content.hero.stats.customers.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {content.hero.stats.customers.label}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl" style={{ color: '#E87722' }}>
                        {content.hero.stats.farms.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {content.hero.stats.farms.label}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl" style={{ color: '#E87722' }}>
                        {content.hero.stats.organic.value}
                      </div>
                      <div className="text-sm text-gray-600">
                        {content.hero.stats.organic.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="border rounded-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl text-gray-900 mb-4">
                  {content.features.heading}
                </h2>
                <p className="text-lg text-gray-600">
                  {content.features.subheading}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {content.features.features.map((feature) => (
                  <div key={feature.id} className="border rounded-lg p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                      {getFeatureIcon(feature.icon)}
                    </div>
                    <h3 className="text-lg text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper function to get feature icon
function getFeatureIcon(iconName: string) {
  const iconProps = { className: "h-5 w-5", style: { color: '#E87722' } };
  
  switch (iconName) {
    case 'Leaf': return <div className="text-xl">🌿</div>;
    case 'Heart': return <div className="text-xl">❤️</div>;
    case 'Truck': return <div className="text-xl">🚚</div>;
    case 'Award': return <div className="text-xl">🏆</div>;
    case 'Clock': return <div className="text-xl">⏰</div>;
    case 'Shield': return <div className="text-xl">🛡️</div>;
    case 'Star': return <div className="text-xl">⭐</div>;
    case 'Users': return <div className="text-xl">👥</div>;
    default: return <div className="text-xl">🌿</div>;
  }
}

// Default content
function getDefaultContent(): ContentData {
  return {
    hero: {
      badge: {
        text: "No Wet Kitchen Needed • Farm to Table in 24 Hours",
        loggedInText: "Welcome back, {name}! 👋"
      },
      heading: "Nutritious Meals from Local Farms • 20min to Cook",
      description: "Quick, nutritious meals that are easy to prepare. Try at least weekly or bi-weekly to see the real difference. Consistency is key to experiencing the health benefits of nutrient-rich meals sourced directly from farmers we trust.",
      primaryButton: "Browse Meals",
      secondaryButton: "Track Order",
      stats: {
        customers: { value: "500+", label: "Happy Customers" },
        farms: { value: "50+", label: "Partner Farms" },
        organic: { value: "100%", label: "Organic" }
      },
      heroImage: "https://images.unsplash.com/photo-1666819691716-827f78d892f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMGJvd2x8ZW58MXx8fHwxNzYzMTYxMTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      deliveryCard: {
        label: "Next Delivery",
        value: "Tomorrow, 2PM"
      }
    },
    features: {
      heading: "Why Choose MoyoClub?",
      subheading: "We connect you directly with local farmers to deliver the freshest, most nutritious meals possible.",
      features: [
        {
          id: "1",
          icon: "Leaf",
          title: "Farm Direct",
          description: "Sourced directly from local farms we manage and trust for maximum freshness."
        },
        {
          id: "2",
          icon: "Heart",
          title: "Nutrition First",
          description: "Every meal is designed by nutritionists to support your health journey."
        },
        {
          id: "3",
          icon: "Truck",
          title: "Fast Delivery",
          description: "From farm to your table in 24 hours. Track your order in real-time."
        },
        {
          id: "4",
          icon: "Award",
          title: "100% Organic",
          description: "Certified organic ingredients with complete transparency on sourcing."
        }
      ]
    }
  };
}

// Export function to get content (for use in Hero and Features components)
export function getStoredContent(): ContentData {
  const stored = localStorage.getItem('moyoclub_content');
  return stored ? JSON.parse(stored) : getDefaultContent();
}
