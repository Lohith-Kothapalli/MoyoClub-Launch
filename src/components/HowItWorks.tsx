import { Search, ShoppingBag, Truck, Heart } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Browse & Select",
      description: "Explore 700+ nutrition-packed meals from our managed farms. Filter by dietary preferences and nutritional goals."
    },
    {
      icon: ShoppingBag,
      title: "Choose Frequency",
      description: "Pick your delivery schedule - weekly, bi-weekly, or monthly. Customize portions for your family size."
    },
    {
      icon: Truck,
      title: "We Deliver Fresh",
      description: "Farm-fresh meals delivered right to your doorstep within 24 hours of harvest. Track in real-time."
    },
    {
      icon: Heart,
      title: "Enjoy & Thrive",
      description: "Experience the health benefits of consistent, nutritious eating. Your wellness journey starts here."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block rounded-full px-4 py-2 mb-4" style={{ backgroundColor: '#FEE8D6', color: '#E87722' }}>
            <span className="text-sm font-semibold">Simple Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            From farm to your table in just 4 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200" style={{ top: '4rem' }} />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-orange-100">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg" 
                       style={{ backgroundColor: '#E87722' }}>
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10" 
                       style={{ backgroundColor: '#FEE8D6' }}>
                    <Icon className="h-8 w-8" style={{ color: '#E87722' }} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                
                {/* Arrow (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 w-8 h-8 z-20">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent" 
                         style={{ borderLeftColor: '#E87722' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button 
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{ backgroundColor: '#E87722' }}
            onClick={() => {
              const productSection = document.getElementById('products');
              productSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
