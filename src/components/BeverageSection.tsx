import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Droplets, Coffee, Leaf, Sparkles, Apple, Milk } from "lucide-react";
import { NutritionBadge } from "./NutritionBadge";
import { OrderFrequency } from "./FrequencySelector";

export interface Beverage {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  pricing: {
    weekly: number;
    biweekly: number;
    monthly: number;
  };
  image: string;
  category: 'juices' | 'smoothies' | 'tea' | 'functional' | 'dairy' | 'kombucha';
  farmSource: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
  volume: string; // e.g., "250ml", "500ml"
}

interface BeverageSectionProps {
  onAddToCart: (beverage: Beverage, price: number) => void;
  selectedFrequency: OrderFrequency;
}

export function BeverageSection({ onAddToCart, selectedFrequency }: BeverageSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample beverage data - in production, this would come from an API
  const beverages: Beverage[] = [
    {
      id: 'bev-1',
      name: 'Green Detox Juice',
      description: 'Fresh cucumber, celery, green apple, and spinach blend. Perfect morning cleanse.',
      basePrice: 120,
      pricing: { weekly: 120, biweekly: 110, monthly: 100 },
      image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800',
      category: 'juices',
      farmSource: 'Green Valley',
      nutrition: { calories: 85, protein: 2, carbs: 18, fat: 0.5 },
      tags: ['Detox', 'Vegan'],
      volume: '250ml'
    },
    {
      id: 'bev-2',
      name: 'Berry Blast Smoothie',
      description: 'Antioxidant-rich blend of strawberries, blueberries, and acai with almond milk.',
      basePrice: 150,
      pricing: { weekly: 150, biweekly: 140, monthly: 130 },
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',
      category: 'smoothies',
      farmSource: 'Berry Farms',
      nutrition: { calories: 180, protein: 5, carbs: 35, fat: 4 },
      tags: ['High Protein', 'Vegan'],
      volume: '350ml'
    },
    {
      id: 'bev-3',
      name: 'Turmeric Golden Milk',
      description: 'Anti-inflammatory golden milk with turmeric, ginger, and organic honey.',
      basePrice: 100,
      pricing: { weekly: 100, biweekly: 90, monthly: 80 },
      image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36a61?w=800',
      category: 'functional',
      farmSource: 'Spice Gardens',
      nutrition: { calories: 120, protein: 8, carbs: 12, fat: 5 },
      tags: ['Immunity', 'Organic'],
      volume: '250ml'
    },
    {
      id: 'bev-4',
      name: 'Chamomile Sleep Tea',
      description: 'Calming blend of chamomile, lavender, and valerian root for restful sleep.',
      basePrice: 80,
      pricing: { weekly: 80, biweekly: 70, monthly: 60 },
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
      category: 'tea',
      farmSource: 'Herbal Hills',
      nutrition: { calories: 5, protein: 0, carbs: 1, fat: 0 },
      tags: ['Caffeine-Free', 'Organic'],
      volume: '200ml'
    },
    {
      id: 'bev-5',
      name: 'Cold Brew Coffee',
      description: 'Smooth, rich cold brew coffee made from single-origin organic beans.',
      basePrice: 110,
      pricing: { weekly: 110, biweekly: 100, monthly: 90 },
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
      category: 'functional',
      farmSource: 'Mountain Coffee',
      nutrition: { calories: 5, protein: 0.3, carbs: 0, fat: 0 },
      tags: ['Organic', 'Energy'],
      volume: '300ml'
    },
    {
      id: 'bev-6',
      name: 'Ginger Kombucha',
      description: 'Probiotic-rich fermented tea with fresh ginger. Gut health in a bottle.',
      basePrice: 130,
      pricing: { weekly: 130, biweekly: 120, monthly: 110 },
      image: 'https://images.unsplash.com/photo-1559839914-17aae19c8a99?w=800',
      category: 'kombucha',
      farmSource: 'Ferment Co.',
      nutrition: { calories: 45, protein: 0, carbs: 11, fat: 0 },
      tags: ['Probiotic', 'Organic'],
      volume: '330ml'
    },
    {
      id: 'bev-7',
      name: 'Fresh Almond Milk',
      description: 'Creamy, unsweetened almond milk made daily from organic almonds.',
      basePrice: 90,
      pricing: { weekly: 90, biweekly: 80, monthly: 70 },
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800',
      category: 'dairy',
      farmSource: 'Nut Orchards',
      nutrition: { calories: 60, protein: 2, carbs: 2, fat: 5 },
      tags: ['Vegan', 'No Sugar'],
      volume: '500ml'
    },
    {
      id: 'bev-8',
      name: 'Carrot Orange Juice',
      description: 'Vitamin-rich blend of fresh carrots and sweet oranges. Immunity booster.',
      basePrice: 110,
      pricing: { weekly: 110, biweekly: 100, monthly: 95 },
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
      category: 'juices',
      farmSource: 'Citrus Farms',
      nutrition: { calories: 110, protein: 2, carbs: 26, fat: 0.3 },
      tags: ['Vitamin C', 'Fresh'],
      volume: '250ml'
    },
    {
      id: 'bev-9',
      name: 'Protein Power Smoothie',
      description: 'Banana, peanut butter, oats, and plant protein. Perfect post-workout fuel.',
      basePrice: 160,
      pricing: { weekly: 160, biweekly: 150, monthly: 140 },
      image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800',
      category: 'smoothies',
      farmSource: 'Protein Farms',
      nutrition: { calories: 320, protein: 18, carbs: 45, fat: 8 },
      tags: ['High Protein', 'Post-Workout'],
      volume: '400ml'
    },
    {
      id: 'bev-10',
      name: 'Matcha Green Tea',
      description: 'Premium ceremonial grade matcha. Rich in antioxidants and natural energy.',
      basePrice: 140,
      pricing: { weekly: 140, biweekly: 130, monthly: 120 },
      image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800',
      category: 'tea',
      farmSource: 'Tea Gardens',
      nutrition: { calories: 35, protein: 2, carbs: 5, fat: 0 },
      tags: ['Antioxidant', 'Energy'],
      volume: '250ml'
    },
    {
      id: 'bev-11',
      name: 'Watermelon Mint Juice',
      description: 'Refreshing summer blend of watermelon and fresh mint. Hydration boost.',
      basePrice: 100,
      pricing: { weekly: 100, biweekly: 90, monthly: 80 },
      image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800',
      category: 'juices',
      farmSource: 'Melon Fields',
      nutrition: { calories: 70, protein: 1, carbs: 17, fat: 0.2 },
      tags: ['Hydrating', 'Fresh'],
      volume: '300ml'
    },
    {
      id: 'bev-12',
      name: 'Oat Milk Latte',
      description: 'Creamy oat milk latte with organic espresso. Vegan coffee perfection.',
      basePrice: 120,
      pricing: { weekly: 120, biweekly: 110, monthly: 100 },
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800',
      category: 'dairy',
      farmSource: 'Oat Farms',
      nutrition: { calories: 150, protein: 4, carbs: 24, fat: 5 },
      tags: ['Vegan', 'Barista'],
      volume: '350ml'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Beverages', icon: Droplets, color: '#E87722' },
    { id: 'juices', name: 'Fresh Juices', icon: Apple, color: '#F59E0B' },
    { id: 'smoothies', name: 'Smoothies', icon: Sparkles, color: '#EC4899' },
    { id: 'tea', name: 'Herbal Teas', icon: Leaf, color: '#10B981' },
    { id: 'functional', name: 'Functional', icon: Coffee, color: '#8B4513' },
    { id: 'dairy', name: 'Plant Milk', icon: Milk, color: '#6366F1' },
    { id: 'kombucha', name: 'Kombucha', icon: Droplets, color: '#F97316' }
  ];

  const filteredBeverages = selectedCategory === 'all' 
    ? beverages 
    : beverages.filter(bev => bev.category === selectedCategory);

  const BeverageCard = ({ beverage }: { beverage: Beverage }) => {
    const currentPrice = beverage.pricing[selectedFrequency];
    const savings = selectedFrequency !== 'weekly' 
      ? Math.round(((beverage.pricing.weekly - currentPrice) / beverage.pricing.weekly) * 100)
      : 0;

    return (
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-md">
        <div className="relative overflow-hidden">
          {/* Image with hover effect */}
          <div className="relative h-56 overflow-hidden bg-gray-100">
            <img 
              src={beverage.image} 
              alt={beverage.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          {/* Volume badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/95 hover:bg-white backdrop-blur-sm border-0 shadow-lg" style={{ color: '#A67C52' }}>
              <Droplets className="h-3 w-3 mr-1" />
              {beverage.volume}
            </Badge>
          </div>
          
          {/* Product tags */}
          {beverage.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {beverage.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} className="text-white shadow-md backdrop-blur-sm" style={{ backgroundColor: '#E87722' }}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Savings badge */}
          {savings > 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge className="text-white font-semibold shadow-lg" style={{ backgroundColor: '#E87722' }}>
                Save {savings}%
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-5">
          <h3 className="text-lg text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
            {beverage.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {beverage.description}
          </p>
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <Leaf className="h-3 w-3" style={{ color: '#A67C52' }} />
            <span>{beverage.farmSource}</span>
          </div>
          <NutritionBadge nutrition={beverage.nutrition} compact />
        </CardContent>
        
        <div className="px-5 pb-5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold" style={{ color: '#E87722' }}>
                ₹{currentPrice.toFixed(0)}
              </span>
              {savings > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{beverage.pricing.weekly.toFixed(0)}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              per delivery
            </div>
          </div>
          <Button 
            size="sm" 
            style={{ backgroundColor: '#E87722' }}
            className="hover:opacity-90 shadow-md hover:shadow-lg transition-all"
            onClick={() => onAddToCart(beverage as any, currentPrice)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/30 to-white" id="beverages">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block rounded-full px-4 py-2 mb-4" style={{ backgroundColor: '#E3F2FD', color: '#2196F3' }}>
            <span className="text-sm font-semibold">Refresh & Rejuvenate</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">Farm-Fresh Beverages</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From cold-pressed juices to functional drinks, every sip is packed with nutrition from our managed farms
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'shadow-lg scale-105' 
                      : 'shadow-md hover:shadow-lg hover:scale-105 bg-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? category.color : '#ffffff',
                    color: isActive ? '#ffffff' : '#6B7280'
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{category.name}</span>
                  <Badge 
                    className="ml-1" 
                    style={{ 
                      backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : '#F3F4F6',
                      color: isActive ? '#ffffff' : '#4B5563'
                    }}
                  >
                    {category.id === 'all' ? beverages.length : beverages.filter(b => b.category === category.id).length}
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Beverages Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredBeverages.map((beverage) => (
            <BeverageCard key={beverage.id} beverage={beverage} />
          ))}
        </div>

        {/* Empty State */}
        {filteredBeverages.length === 0 && (
          <div className="text-center py-16">
            <Droplets className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl text-gray-900 mb-2">No beverages found</h3>
            <p className="text-gray-600">Try selecting a different category</p>
          </div>
        )}

        {/* Benefits Banner */}
        <div className="mt-16 rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}>
                <Droplets className="h-8 w-8" style={{ color: '#2196F3' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cold-Pressed Fresh</h3>
              <p className="text-gray-600">Made fresh daily with no preservatives or added sugars</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}>
                <Leaf className="h-8 w-8" style={{ color: '#10B981' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Organic</h3>
              <p className="text-gray-600">All ingredients sourced from certified organic farms</p>
            </div>
            <div>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(33, 150, 243, 0.2)' }}>
                <Sparkles className="h-8 w-8" style={{ color: '#F59E0B' }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nutrient Dense</h3>
              <p className="text-gray-600">Packed with vitamins, minerals, and natural goodness</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
