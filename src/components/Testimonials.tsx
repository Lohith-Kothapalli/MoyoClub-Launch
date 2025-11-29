import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Health Enthusiast",
      location: "Mumbai",
      rating: 5,
      text: "MoyoClub transformed my family's eating habits. The farm-fresh produce and ready-to-cook meals save us time while keeping us healthy. Best decision ever!",
      initials: "PS"
    },
    {
      name: "Rajesh Kumar",
      role: "Corporate Professional",
      location: "Bangalore",
      rating: 5,
      text: "As someone with a hectic schedule, MoyoClub's subscription service is a lifesaver. Fresh, nutritious meals delivered consistently. No more last-minute unhealthy choices!",
      initials: "RK"
    },
    {
      name: "Anjali Desai",
      role: "Fitness Coach",
      location: "Delhi",
      rating: 5,
      text: "I recommend MoyoClub to all my clients. The nutrition information is accurate, portions are perfect, and the quality is unmatched. Game-changer for meal planning!",
      initials: "AD"
    },
    {
      name: "Vikram Patel",
      role: "Small Business Owner",
      location: "Pune",
      rating: 5,
      text: "We subscribed for our office team and the results are amazing. Healthier employees, better productivity. The corporate plan is flexible and affordable.",
      initials: "VP"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #FFF5ED, #ffffff)' }}>
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ backgroundColor: '#E87722' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full" style={{ backgroundColor: '#A67C52' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block rounded-full px-4 py-2 mb-4" style={{ backgroundColor: '#FEE8D6', color: '#E87722' }}>
            <span className="text-sm font-semibold">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of happy families enjoying nutritious meals daily
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardContent className="p-8">
                {/* Quote Icon */}
                <Quote className="h-10 w-10 mb-4 opacity-20" style={{ color: '#E87722' }} />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" style={{ color: '#E87722' }} />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2" style={{ borderColor: '#E87722' }}>
                    <AvatarFallback style={{ backgroundColor: '#FEE8D6', color: '#E87722' }}>
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm" style={{ color: '#E87722' }}>{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Rating Stats */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl shadow-xl p-8">
            <div>
              <div className="text-5xl font-bold mb-2" style={{ color: '#E87722' }}>4.8</div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" style={{ color: '#E87722' }} />
                ))}
              </div>
              <div className="text-sm text-gray-600">out of 5</div>
            </div>
            <div className="w-px h-20 bg-gray-200" />
            <div className="text-left">
              <div className="text-2xl font-semibold text-gray-900 mb-1">50,000+</div>
              <div className="text-gray-600">Happy Customers</div>
              <div className="text-sm text-gray-500 mt-1">across India</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
