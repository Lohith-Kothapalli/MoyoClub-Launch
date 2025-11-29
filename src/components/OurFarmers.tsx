import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Play, Quote } from "lucide-react";
import { BRAND_COLORS } from "../constants";

interface FarmerVideo {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  farmerName: string;
  location: string;
  cropType: string;
}

interface FarmerTestimonial {
  id: string;
  name: string;
  location: string;
  farmSize: string;
  quote: string;
  imageUrl: string;
}

const farmerVideos: FarmerVideo[] = [
  {
    id: "1",
    thumbnailUrl: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
    title: "Organic Vegetable Farming",
    farmerName: "Ramesh Kumar",
    location: "Karnataka",
    cropType: "Organic Vegetables"
  },
  {
    id: "2",
    thumbnailUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
    title: "Sustainable Rice Cultivation",
    farmerName: "Lakshmi Devi",
    location: "Tamil Nadu",
    cropType: "Organic Rice"
  },
  {
    id: "3",
    thumbnailUrl: "https://images.unsplash.com/photo-1615671524827-c1fe3973b648?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
    title: "Natural Fruit Orchards",
    farmerName: "Suresh Patil",
    location: "Maharashtra",
    cropType: "Seasonal Fruits"
  },
  {
    id: "4",
    thumbnailUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Replace with actual video
    title: "Traditional Wheat Farming",
    farmerName: "Arvind Singh",
    location: "Punjab",
    cropType: "Wheat & Grains"
  }
];

const farmerTestimonials: FarmerTestimonial[] = [
  {
    id: "1",
    name: "Ramesh Kumar",
    location: "Bangalore Rural, Karnataka",
    farmSize: "5 acres",
    quote: "Working with MoyoClub has transformed my farming business. I get fair prices for my organic produce and the direct connection with consumers gives me confidence to invest in better farming practices. My family's income has increased by 40% in the last year.",
    imageUrl: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400"
  },
  {
    id: "2",
    name: "Lakshmi Devi",
    location: "Coimbatore, Tamil Nadu",
    farmSize: "8 acres",
    quote: "For 20 years I struggled with middlemen taking most of my profits. MoyoClub changed everything. Now I sell directly to health-conscious customers who appreciate quality. I've expanded my farm and employed 3 more workers from my village.",
    imageUrl: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400"
  },
  {
    id: "3",
    name: "Suresh Patil",
    location: "Nashik, Maharashtra",
    farmSize: "12 acres",
    quote: "MoyoClub helped me transition to organic farming. They provided training, certification support, and guaranteed purchase of my produce. My mangoes and pomegranates now reach customers who value pesticide-free food. It's a win-win partnership.",
    imageUrl: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400"
  },
  {
    id: "4",
    name: "Arvind Singh",
    location: "Ludhiana, Punjab",
    farmSize: "15 acres",
    quote: "The dignity of being a direct supplier cannot be measured in rupees alone. MoyoClub respects our work and pays on time. My children are proud to say their father supplies to health-conscious families across India. This is sustainable farming.",
    imageUrl: "https://images.unsplash.com/photo-1611689037241-d8dfe4280f2e?w=400"
  },
  {
    id: "5",
    name: "Meena Sharma",
    location: "Jaipur, Rajasthan",
    farmSize: "6 acres",
    quote: "As a woman farmer, I faced many challenges. MoyoClub gave me equal opportunity and fair treatment. I grow organic vegetables and herbs. The regular orders help me plan better and invest in drip irrigation. My farm is now a model in our district.",
    imageUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400"
  },
  {
    id: "6",
    name: "Gopal Reddy",
    location: "Hyderabad Rural, Telangana",
    farmSize: "10 acres",
    quote: "MoyoClub doesn't just buy our produce - they partner with us. They helped me get organic certification and introduced new crop varieties. The transparent pricing means I know exactly what I'll earn. No more guessing or haggling with middlemen.",
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400"
  }
];

export function OurFarmers() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div 
        className="relative h-[400px] bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1600')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl mb-4">Meet Our Farmers</h1>
            <p className="text-xl text-gray-200">
              The heart of MoyoClub - dedicated farmers growing nutritious, organic produce with care and tradition
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl mb-2" style={{ color: BRAND_COLORS.primary }}>150+</p>
              <p className="text-gray-700">Partner Farmers</p>
            </div>
            <div>
              <p className="text-4xl mb-2" style={{ color: BRAND_COLORS.primary }}>12</p>
              <p className="text-gray-700">States Across India</p>
            </div>
            <div>
              <p className="text-4xl mb-2" style={{ color: BRAND_COLORS.primary }}>2,500+</p>
              <p className="text-gray-700">Acres of Organic Farms</p>
            </div>
            <div>
              <p className="text-4xl mb-2" style={{ color: BRAND_COLORS.primary }}>100%</p>
              <p className="text-gray-700">Fair Trade Certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Farm Tours & Stories</h2>
            <p className="text-xl text-gray-600">
              Take a virtual tour of our farms and hear directly from the farmers who grow your food
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {farmerVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative group cursor-pointer">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: BRAND_COLORS.primary }}
                    >
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge style={{ backgroundColor: BRAND_COLORS.primary }}>
                      {video.cropType}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl mb-2">{video.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <p>{video.farmerName}</p>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <p className="text-sm">{video.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Farmer Testimonials</h2>
            <p className="text-xl text-gray-600">
              Real stories from farmers who partner with MoyoClub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmerTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1">{testimonial.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <MapPin className="h-3 w-3" />
                        <p>{testimonial.location}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.farmSize}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Quote 
                      className="h-8 w-8 text-orange-200 absolute -top-2 -left-2" 
                      style={{ color: BRAND_COLORS.primary, opacity: 0.2 }}
                    />
                    <p className="text-gray-700 italic relative z-10 pl-4">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div 
        className="py-20 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl mb-6">Support Our Farming Community</h2>
          <p className="text-xl mb-8 text-gray-200">
            Every purchase you make directly supports farmers and their families. 
            Join us in building a sustainable, fair-trade food system.
          </p>
          <button 
            className="px-8 py-4 text-white rounded-lg text-lg transition-transform hover:scale-105"
            style={{ backgroundColor: BRAND_COLORS.primary }}
          >
            Shop Farm-Fresh Products
          </button>
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">
              How MoyoClub is making a difference in farming communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${BRAND_COLORS.primary}20` }}
                >
                  <span className="text-2xl" style={{ color: BRAND_COLORS.primary }}>₹</span>
                </div>
                <h3 className="text-xl mb-2">Fair Pricing</h3>
                <p className="text-gray-600">
                  Farmers receive 40-60% more than traditional market rates by eliminating middlemen
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${BRAND_COLORS.primary}20` }}
                >
                  <span className="text-2xl" style={{ color: BRAND_COLORS.primary }}>🌱</span>
                </div>
                <h3 className="text-xl mb-2">Organic Transition</h3>
                <p className="text-gray-600">
                  Support for farmers transitioning to organic farming with training and certification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${BRAND_COLORS.primary}20` }}
                >
                  <span className="text-2xl" style={{ color: BRAND_COLORS.primary }}>👨‍👩‍👧‍👦</span>
                </div>
                <h3 className="text-xl mb-2">Community Development</h3>
                <p className="text-gray-600">
                  Creating employment opportunities and improving living standards in rural areas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
