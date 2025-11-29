import { Card, CardContent } from "./ui/card";
import { Calendar, Package } from "lucide-react";

export type OrderFrequency = 'weekly' | 'biweekly' | 'monthly';

interface FrequencySelectorProps {
  selectedFrequency: OrderFrequency;
  onSelectFrequency: (frequency: OrderFrequency) => void;
}

const frequencyOptions = [
  {
    id: 'weekly' as OrderFrequency,
    name: 'Weekly',
    description: 'Delivered every week',
    icon: Calendar,
    discount: 0
  },
  {
    id: 'biweekly' as OrderFrequency,
    name: 'Bi-Weekly',
    description: 'Delivered every 2 weeks',
    icon: Package,
    discount: 8
  },
  {
    id: 'monthly' as OrderFrequency,
    name: 'Monthly',
    description: 'Delivered every month',
    icon: Calendar,
    discount: 15
  }
];

export function FrequencySelector({ selectedFrequency, onSelectFrequency }: FrequencySelectorProps) {
  return (
    <section className="py-8" style={{ background: 'linear-gradient(to bottom, #FFF5ED, #ffffff)' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Choose Your Order Frequency</h2>
          <p className="text-lg text-gray-600">
            Select how often you'd like to receive your meals. Prices adjust based on your choice.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {frequencyOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedFrequency === option.id;
            
            return (
              <Card
                key={option.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 shadow-lg' : 'hover:border-gray-300'
                }`}
                style={{
                  borderColor: isSelected ? '#E87722' : undefined,
                  '--tw-ring-color': '#E87722'
                } as any}
                onClick={() => onSelectFrequency(option.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
                       style={{ backgroundColor: isSelected ? '#E87722' : '#FEE8D6' }}>
                    <Icon className="h-6 w-6" style={{ color: isSelected ? '#ffffff' : '#E87722' }} />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                  {option.discount > 0 && (
                    <div className="inline-block px-3 py-1 rounded-full text-sm"
                         style={{ backgroundColor: '#FEE8D6', color: '#E87722' }}>
                      Save {option.discount}%
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
