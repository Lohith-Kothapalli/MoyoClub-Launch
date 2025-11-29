import { ProductCard, Product } from "./ProductCard";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, SlidersHorizontal, Grid3x3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useMemo, useEffect } from "react";
import { Badge } from "./ui/badge";
import { OrderFrequency } from "./FrequencySelector";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Skeleton } from "./ui/skeleton";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface ProductGridProps {
  onAddToCart: (product: Product, price: number) => void;
  selectedFrequency: OrderFrequency;
  onProductsLoaded?: (products: Product[]) => void;
}

// Beverage data
const beverageData: Product[] = [
  {
    id: 'bev-1',
    name: 'Green Detox Juice',
    description: 'Fresh cucumber, celery, green apple, and spinach blend. Perfect morning cleanse.',
    basePrice: 120,
    pricing: { weekly: 120, biweekly: 110, monthly: 100 },
    image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800',
    farmSource: 'Green Valley',
    nutrition: { calories: 85, protein: 2, carbs: 18, fat: 0.5 },
    tags: ['Beverages', 'Fresh Juices', 'Detox', 'Vegan']
  },
  {
    id: 'bev-2',
    name: 'Berry Blast Smoothie',
    description: 'Antioxidant-rich blend of strawberries, blueberries, and acai with almond milk.',
    basePrice: 150,
    pricing: { weekly: 150, biweekly: 140, monthly: 130 },
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800',
    farmSource: 'Berry Farms',
    nutrition: { calories: 180, protein: 5, carbs: 35, fat: 4 },
    tags: ['Beverages', 'Smoothies', 'High Protein', 'Vegan']
  },
  {
    id: 'bev-3',
    name: 'Turmeric Golden Milk',
    description: 'Anti-inflammatory golden milk with turmeric, ginger, and organic honey.',
    basePrice: 100,
    pricing: { weekly: 100, biweekly: 90, monthly: 80 },
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36a61?w=800',
    farmSource: 'Spice Gardens',
    nutrition: { calories: 120, protein: 8, carbs: 12, fat: 5 },
    tags: ['Beverages', 'Functional', 'Immunity', 'Organic']
  },
  {
    id: 'bev-4',
    name: 'Chamomile Sleep Tea',
    description: 'Calming blend of chamomile, lavender, and valerian root for restful sleep.',
    basePrice: 80,
    pricing: { weekly: 80, biweekly: 70, monthly: 60 },
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800',
    farmSource: 'Herbal Hills',
    nutrition: { calories: 5, protein: 0, carbs: 1, fat: 0 },
    tags: ['Beverages', 'Herbal Teas', 'Caffeine-Free', 'Organic']
  },
  {
    id: 'bev-5',
    name: 'Cold Brew Coffee',
    description: 'Smooth, rich cold brew coffee made from single-origin organic beans.',
    basePrice: 110,
    pricing: { weekly: 110, biweekly: 100, monthly: 90 },
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    farmSource: 'Mountain Coffee',
    nutrition: { calories: 5, protein: 0.3, carbs: 0, fat: 0 },
    tags: ['Beverages', 'Functional', 'Organic', 'Energy']
  },
  {
    id: 'bev-6',
    name: 'Ginger Kombucha',
    description: 'Probiotic-rich fermented tea with fresh ginger. Gut health in a bottle.',
    basePrice: 130,
    pricing: { weekly: 130, biweekly: 120, monthly: 110 },
    image: 'https://images.unsplash.com/photo-1559839914-17aae19c8a99?w=800',
    farmSource: 'Ferment Co.',
    nutrition: { calories: 45, protein: 0, carbs: 11, fat: 0 },
    tags: ['Beverages', 'Kombucha', 'Probiotic', 'Organic']
  },
  {
    id: 'bev-7',
    name: 'Fresh Almond Milk',
    description: 'Creamy, unsweetened almond milk made daily from organic almonds.',
    basePrice: 90,
    pricing: { weekly: 90, biweekly: 80, monthly: 70 },
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800',
    farmSource: 'Nut Orchards',
    nutrition: { calories: 60, protein: 2, carbs: 2, fat: 5 },
    tags: ['Beverages', 'Plant Milk', 'Vegan', 'No Sugar']
  },
  {
    id: 'bev-8',
    name: 'Carrot Orange Juice',
    description: 'Vitamin-rich blend of fresh carrots and sweet oranges. Immunity booster.',
    basePrice: 110,
    pricing: { weekly: 110, biweekly: 100, monthly: 95 },
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
    farmSource: 'Citrus Farms',
    nutrition: { calories: 110, protein: 2, carbs: 26, fat: 0.3 },
    tags: ['Beverages', 'Fresh Juices', 'Vitamin C', 'Fresh']
  },
  {
    id: 'bev-9',
    name: 'Protein Power Smoothie',
    description: 'Banana, peanut butter, oats, and plant protein. Perfect post-workout fuel.',
    basePrice: 160,
    pricing: { weekly: 160, biweekly: 150, monthly: 140 },
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800',
    farmSource: 'Protein Farms',
    nutrition: { calories: 320, protein: 18, carbs: 45, fat: 8 },
    tags: ['Beverages', 'Smoothies', 'High Protein', 'Post-Workout']
  },
  {
    id: 'bev-10',
    name: 'Matcha Green Tea',
    description: 'Premium ceremonial grade matcha. Rich in antioxidants and natural energy.',
    basePrice: 140,
    pricing: { weekly: 140, biweekly: 130, monthly: 120 },
    image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800',
    farmSource: 'Tea Gardens',
    nutrition: { calories: 35, protein: 2, carbs: 5, fat: 0 },
    tags: ['Beverages', 'Herbal Teas', 'Antioxidant', 'Energy']
  },
  {
    id: 'bev-11',
    name: 'Watermelon Mint Juice',
    description: 'Refreshing summer blend of watermelon and fresh mint. Hydration boost.',
    basePrice: 100,
    pricing: { weekly: 100, biweekly: 90, monthly: 80 },
    image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=800',
    farmSource: 'Melon Fields',
    nutrition: { calories: 70, protein: 1, carbs: 17, fat: 0.2 },
    tags: ['Beverages', 'Fresh Juices', 'Hydrating', 'Fresh']
  },
  {
    id: 'bev-12',
    name: 'Oat Milk Latte',
    description: 'Creamy oat milk latte with organic espresso. Vegan coffee perfection.',
    basePrice: 120,
    pricing: { weekly: 120, biweekly: 110, monthly: 100 },
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800',
    farmSource: 'Oat Farms',
    nutrition: { calories: 150, protein: 4, carbs: 24, fat: 5 },
    tags: ['Beverages', 'Plant Milk', 'Vegan', 'Barista']
  }
];

// Generate mock data simulating 700 items
const generateMockProducts = (): Product[] => {
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const cuisines = ['Indian', 'Mediterranean', 'Asian', 'Mexican', 'Italian', 'American', 'Middle Eastern'];
  const dietaryTags = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'High Protein', 'Low Carb', 'Paleo', 'Dairy-Free'];
  const farmSources = ['Green Valley Farm', 'Sunrise Acres', 'Meadow Ranch', 'Harmony Gardens', 'Coastal Harvest', 'Mountain View Organic', 'River Bend Farm'];
  
  const baseNames = [
    'Quinoa Bowl', 'Buddha Bowl', 'Power Bowl', 'Protein Box', 'Salad Box', 
    'Grain Bowl', 'Burrito Bowl', 'Poke Bowl', 'Noodle Box', 'Rice Bowl',
    'Curry Delight', 'Stir Fry', 'Grilled Platter', 'Wrap Box', 'Sandwich Box',
    'Soup & Salad', 'Meal Prep Box', 'Balanced Plate', 'Energy Bowl', 'Harvest Bowl'
  ];

  const prefixes = ['Mediterranean', 'Asian', 'Spicy', 'Herb', 'Citrus', 'Smoky', 'Garden', 'Fresh', 'Roasted', 'Grilled'];
  
  const products: Product[] = [];
  
  for (let i = 0; i < 700; i++) {
    const mealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];
    const cuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    const baseName = baseNames[Math.floor(Math.random() * baseNames.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const basePrice = Math.floor(Math.random() * 300) + 200; // ₹200-₹500
    
    const tags: string[] = [mealType, cuisine];
    const numDietaryTags = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numDietaryTags; j++) {
      const tag = dietaryTags[Math.floor(Math.random() * dietaryTags.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }
    
    const calories = Math.floor(Math.random() * 400) + 250;
    const protein = Math.floor(Math.random() * 35) + 15;
    const carbs = Math.floor(Math.random() * 50) + 20;
    const fat = Math.floor(Math.random() * 25) + 8;

    const images = [
      'https://images.unsplash.com/photo-1666819691716-827f78d892f3?w=400',
      'https://images.unsplash.com/photo-1584799650072-ee2c8f73b811?w=400',
      'https://images.unsplash.com/photo-1587996580981-bd03dde74843?w=400',
      'https://images.unsplash.com/photo-1643750182373-b4a55a8c2801?w=400',
      'https://images.unsplash.com/photo-1569420067112-b57b4f024595?w=400',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    ];

    products.push({
      id: `product-${i + 1}`,
      name: `${prefix} ${baseName}`,
      description: `Delicious ${cuisine.toLowerCase()} inspired ${mealType.toLowerCase()} with premium ingredients from local farms`,
      basePrice: basePrice,
      pricing: {
        weekly: basePrice,
        biweekly: Math.round(basePrice * 0.92 * 100) / 100,
        monthly: Math.round(basePrice * 0.85 * 100) / 100
      },
      image: images[Math.floor(Math.random() * images.length)],
      farmSource: farmSources[Math.floor(Math.random() * farmSources.length)],
      nutrition: { calories, protein, carbs, fat },
      tags
    });
  }
  
  return products;
};

const mockProducts = [...generateMockProducts(), ...beverageData];

const mealTypeCategories = ['All Meals', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Beverages'];
const cuisineCategories = ['Indian', 'Mediterranean', 'Asian', 'Mexican', 'Italian', 'American', 'Middle Eastern'];
const dietaryCategories = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Keto', 'High Protein', 'Low Carb', 'Paleo', 'Dairy-Free'];

const ITEMS_PER_PAGE = 18;

export function ProductGrid({ onAddToCart, selectedFrequency, onProductsLoaded }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('All Meals');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = mockProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMealType = selectedMealType === 'All Meals' || product.tags.includes(selectedMealType);
      const matchesCuisine = selectedCuisines.length === 0 || selectedCuisines.some(c => product.tags.includes(c));
      const matchesDietary = selectedDietary.length === 0 || selectedDietary.some(d => product.tags.includes(d));
      
      return matchesSearch && matchesMealType && matchesCuisine && matchesDietary;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricing[selectedFrequency] - b.pricing[selectedFrequency]);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricing[selectedFrequency] - a.pricing[selectedFrequency]);
        break;
      case 'calories-low':
        filtered.sort((a, b) => a.nutrition.calories - b.nutrition.calories);
        break;
      case 'protein-high':
        filtered.sort((a, b) => b.nutrition.protein - a.nutrition.protein);
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [searchQuery, selectedMealType, selectedCuisines, selectedDietary, sortBy, selectedFrequency]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
    handleFilterChange();
  };

  const toggleDietary = (dietary: string) => {
    setSelectedDietary(prev => 
      prev.includes(dietary) ? prev.filter(d => d !== dietary) : [...prev, dietary]
    );
    handleFilterChange();
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedMealType('All Meals');
    setSelectedCuisines([]);
    setSelectedDietary([]);
    setSortBy('featured');
    setCurrentPage(1);
  };

  const activeFiltersCount = 
    (selectedMealType !== 'All Meals' ? 1 : 0) +
    selectedCuisines.length +
    selectedDietary.length;

  useEffect(() => {
    if (onProductsLoaded) {
      onProductsLoaded(mockProducts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return (
    <section id="products" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header with count */}
        <div className="mb-8">
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-4xl text-gray-900">Explore Our Menu</h2>
            <Badge className="text-white px-3 py-1" style={{ backgroundColor: '#E87722' }}>
              700+ Items
            </Badge>
          </div>
          <p className="text-lg text-gray-600">
            Farm-fresh, nutrition-packed meals and beverages delivered to your door
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search from 700+ meals..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange();
                }}
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="calories-low">Calories: Low to High</SelectItem>
                <SelectItem value="protein-high">Protein: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Advanced Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge 
                      className="ml-2 text-white px-2 py-0.5" 
                      style={{ backgroundColor: '#E87722' }}
                    >
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Options</SheetTitle>
                  <SheetDescription>
                    Refine your search from 700+ meals
                  </SheetDescription>
                </SheetHeader>
                
                <ScrollArea className="h-[calc(100vh-200px)] mt-6">
                  <div className="space-y-6">
                    {/* Cuisine Filters */}
                    <div>
                      <h3 className="mb-3">Cuisine Type</h3>
                      <div className="space-y-2">
                        {cuisineCategories.map(cuisine => (
                          <div key={cuisine} className="flex items-center">
                            <Checkbox 
                              id={`cuisine-${cuisine}`}
                              checked={selectedCuisines.includes(cuisine)}
                              onCheckedChange={() => toggleCuisine(cuisine)}
                            />
                            <Label 
                              htmlFor={`cuisine-${cuisine}`}
                              className="ml-2 cursor-pointer"
                            >
                              {cuisine}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Dietary Filters */}
                    <div>
                      <h3 className="mb-3">Dietary Preferences</h3>
                      <div className="space-y-2">
                        {dietaryCategories.map(dietary => (
                          <div key={dietary} className="flex items-center">
                            <Checkbox 
                              id={`dietary-${dietary}`}
                              checked={selectedDietary.includes(dietary)}
                              onCheckedChange={() => toggleDietary(dietary)}
                            />
                            <Label 
                              htmlFor={`dietary-${dietary}`}
                              className="ml-2 cursor-pointer"
                            >
                              {dietary}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                <div className="mt-6 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearAllFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* View Toggle */}
            <div className="hidden md:flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-r-none"
                style={viewMode === 'grid' ? { backgroundColor: '#E87722' } : {}}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-l-none"
                style={viewMode === 'list' ? { backgroundColor: '#E87722' } : {}}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Meal Type Tabs */}
        <div className="mb-6">
          <Tabs value={selectedMealType} onValueChange={(value) => {
            setSelectedMealType(value);
            handleFilterChange();
          }}>
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
              {mealTypeCategories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category}
                  className="data-[state=active]:bg-[#E87722] data-[state=active]:text-white"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Active Filters Display */}
        {(selectedCuisines.length > 0 || selectedDietary.length > 0) && (
          <div className="mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600">Active filters:</span>
            {selectedCuisines.map(cuisine => (
              <Badge 
                key={cuisine}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                style={{ borderColor: '#E87722', color: '#E87722' }}
                onClick={() => toggleCuisine(cuisine)}
              >
                {cuisine} ×
              </Badge>
            ))}
            {selectedDietary.map(dietary => (
              <Badge 
                key={dietary}
                variant="outline"
                className="cursor-pointer hover:bg-gray-100"
                style={{ borderColor: '#A67C52', color: '#A67C52' }}
                onClick={() => toggleDietary(dietary)}
              >
                {dietary} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing <span className="text-gray-900">{paginatedProducts.length}</span> of{' '}
            <span className="text-gray-900">{filteredAndSortedProducts.length}</span> meals
          </p>
        </div>

        {/* Product Grid */}
        {paginatedProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" 
            : "space-y-4 mb-8"
          }>
            {paginatedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToCart={onAddToCart}
                selectedFrequency={selectedFrequency}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-600 text-lg mb-4">No meals found matching your criteria.</p>
            <Button 
              variant="outline"
              onClick={clearAllFilters}
              style={{ borderColor: '#E87722', color: '#E87722' }}
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }

                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    style={currentPage === pageNum ? { backgroundColor: '#E87722' } : {}}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <span className="text-sm text-gray-600 ml-4">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}