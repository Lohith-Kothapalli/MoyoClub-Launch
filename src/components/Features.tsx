import { Card, CardContent } from "./ui/card";
import { Leaf, Truck, Award, Heart, Clock, Shield, Star, Users } from "lucide-react";
import { getStoredContent } from "./ContentManagement";
import { useEffect, useState } from "react";

export function Features() {
  const [content, setContent] = useState(getStoredContent().features);

  useEffect(() => {
    // Listen for content changes
    const handleStorageChange = () => {
      setContent(getStoredContent().features);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically
    const interval = setInterval(() => {
      setContent(getStoredContent().features);
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Leaf,
      Heart,
      Truck,
      Award,
      Clock,
      Shield,
      Star,
      Users
    };
    return iconMap[iconName] || Leaf;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block rounded-full px-4 py-2 mb-4" style={{ backgroundColor: '#FEE8D6', color: '#E87722' }}>
            <span className="text-sm font-semibold">Why Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">{content.heading}</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content.subheading}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.features.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            return (
              <Card key={index} className="group border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-white hover:-translate-y-2">
                <CardContent className="pt-10 pb-8 text-center">
                  {/* Icon with animated background */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110" 
                       style={{ backgroundColor: '#FEE8D6' }}>
                    <Icon className="h-10 w-10 transition-transform group-hover:scale-110" style={{ color: '#E87722' }} />
                    {/* Decorative ring */}
                    <div className="absolute inset-0 rounded-2xl ring-4 ring-orange-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <h3 className="text-xl text-gray-900 mb-3 font-semibold">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Star className="h-8 w-8 mx-auto mb-3" style={{ color: '#E87722' }} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">4.8/5</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
            <div>
              <Shield className="h-8 w-8 mx-auto mb-3" style={{ color: '#E87722' }} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-600">Quality Assured</div>
            </div>
            <div>
              <Truck className="h-8 w-8 mx-auto mb-3" style={{ color: '#E87722' }} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">24hrs</div>
              <div className="text-sm text-gray-600">Fresh Delivery</div>
            </div>
            <div>
              <Users className="h-8 w-8 mx-auto mb-3" style={{ color: '#E87722' }} />
              <div className="text-2xl font-semibold text-gray-900 mb-1">50K+</div>
              <div className="text-sm text-gray-600">Happy Families</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
