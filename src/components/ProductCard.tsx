import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plus, Leaf } from "lucide-react";
import { NutritionBadge } from "./NutritionBadge";
import { OrderFrequency } from "./FrequencySelector";

export interface Product {
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
  farmSource: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, price: number) => void;
  selectedFrequency: OrderFrequency;
}

export function ProductCard({ product, onAddToCart, selectedFrequency }: ProductCardProps) {
  const currentPrice = product.pricing[selectedFrequency];
  const savings = selectedFrequency !== 'weekly' 
    ? Math.round(((product.pricing.weekly - currentPrice) / product.pricing.weekly) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 shadow-md">
      <div className="relative overflow-hidden">
        {/* Image with hover effect */}
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Farm source badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/95 hover:bg-white backdrop-blur-sm border-0 shadow-lg" style={{ color: '#A67C52' }}>
            <Leaf className="h-3 w-3 mr-1" />
            {product.farmSource}
          </Badge>
        </div>
        
        {/* Product tags */}
        {product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
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
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <NutritionBadge nutrition={product.nutrition} compact />
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold" style={{ color: '#E87722' }}>
              ₹{currentPrice.toFixed(0)}
            </span>
            {savings > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.pricing.weekly.toFixed(0)}
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
          onClick={() => onAddToCart(product, currentPrice)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
