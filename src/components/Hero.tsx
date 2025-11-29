import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { UserData } from "./Auth";
import { getStoredContent } from "./ContentManagement";
import { useEffect, useState } from "react";

interface HeroProps {
  onNavigate: (page: string) => void;
  user: UserData | null;
}

export function Hero({ onNavigate, user }: HeroProps) {
  const [content, setContent] = useState(getStoredContent().hero);

  useEffect(() => {
    // Listen for content changes
    const handleStorageChange = () => {
      setContent(getStoredContent().hero);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check on mount and periodically
    const interval = setInterval(() => {
      setContent(getStoredContent().hero);
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const badgeText = user 
    ? content.badge.loggedInText.replace('{name}', user.name.split(' ')[0])
    : content.badge.text;

  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF5ED 0%, #FFEBD8 50%, #FFE5CC 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: '#E87722', filter: 'blur(100px)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: '#A67C52', filter: 'blur(100px)' }} />
      
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 mb-6 backdrop-blur-sm border" 
                 style={{ backgroundColor: 'rgba(254, 232, 214, 0.9)', borderColor: '#E87722', color: user ? '#E87722' : '#A67C52' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#E87722' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#E87722' }} />
              </span>
              <span className="text-sm font-medium">{badgeText}</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight">
              {content.heading}
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              {content.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                style={{ backgroundColor: '#E87722' }}
                className="hover:opacity-90 shadow-lg hover:shadow-xl transition-all text-base px-8 py-6"
                onClick={() => {
                  const productSection = document.getElementById('products');
                  productSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {content.primaryButton}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                style={{ borderColor: '#E87722', color: '#E87722', borderWidth: '2px' }}
                className="hover:bg-orange-50 transition-colors text-base px-8 py-6"
                onClick={() => onNavigate('tracker')}
              >
                {content.secondaryButton}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: 'rgba(230, 119, 34, 0.2)' }}>
              <div>
                <div className="text-3xl md:text-4xl mb-1 font-semibold" style={{ color: '#E87722' }}>
                  {content.stats.customers.value}
                </div>
                <div className="text-sm text-gray-600">{content.stats.customers.label}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl mb-1 font-semibold" style={{ color: '#E87722' }}>
                  {content.stats.farms.value}
                </div>
                <div className="text-sm text-gray-600">{content.stats.farms.label}</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl mb-1 font-semibold" style={{ color: '#E87722' }}>
                  {content.stats.organic.value}
                </div>
                <div className="text-sm text-gray-600">{content.stats.organic.label}</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={content.heroImage}
                alt="Healthy meal bowl"
                className="w-full h-[400px] md:h-[550px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1666819691716-827f78d892f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMGJvd2x8ZW58MXx8fHwxNzYzMTYxMTYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
                }}
              />
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-4 md:-left-6 bg-white p-6 rounded-2xl shadow-xl backdrop-blur-sm border" style={{ borderColor: 'rgba(230, 119, 34, 0.1)' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE8D6' }}>
                  <ArrowRight className="h-6 w-6" style={{ color: '#E87722' }} />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">{content.deliveryCard.label}</div>
                  <div className="text-xl font-semibold text-gray-900">{content.deliveryCard.value}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
