import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Package, Truck, CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import { Progress } from "./ui/progress";

interface OrderStatus {
  orderId: string;
  status: 'processing' | 'preparing' | 'in-transit' | 'delivered';
  estimatedDelivery: string;
  items: number;
  total: number;
  timeline: {
    step: string;
    completed: boolean;
    time?: string;
  }[];
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  deliveryAddress: string;
}

// Mock order data
const mockOrder: OrderStatus = {
  orderId: 'FF-2024-11-15-0042',
  status: 'in-transit',
  estimatedDelivery: 'Today, 2:30 PM',
  items: 7,
  total: 89.99,
  timeline: [
    { step: 'Order Confirmed', completed: true, time: '10:30 AM' },
    { step: 'Meals Prepared', completed: true, time: '11:45 AM' },
    { step: 'Out for Delivery', completed: true, time: '1:15 PM' },
    { step: 'Delivered', completed: false }
  ],
  driver: {
    name: 'Michael Johnson',
    phone: '+1 (555) 123-4567',
    vehicle: 'Green Van - GF-342'
  },
  deliveryAddress: '123 Main Street, Apt 4B, San Francisco, CA 94102'
};

const statusConfig = {
  processing: { color: '#3B82F6', text: 'Processing', icon: Clock },
  preparing: { color: '#EAB308', text: 'Preparing', icon: Package },
  'in-transit': { color: '#E87722', text: 'In Transit', icon: Truck },
  delivered: { color: '#22C55E', text: 'Delivered', icon: CheckCircle }
};

export function OrderTracker() {
  const config = statusConfig[mockOrder.status];
  const StatusIcon = config.icon;
  const progress = (mockOrder.timeline.filter(t => t.completed).length / mockOrder.timeline.length) * 100;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl text-gray-900 mb-2">Track Your Order</h2>
          <p className="text-gray-600">Stay updated on your delivery status in real-time</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">Order #{mockOrder.orderId}</CardTitle>
                <CardDescription className="text-base">
                  {mockOrder.items} meals • ₹{mockOrder.total.toFixed(2)}
                </CardDescription>
              </div>
              <Badge className="text-white" style={{ backgroundColor: config.color }}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {config.text}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Delivery Progress</span>
                  <span className="text-sm" style={{ color: '#E87722' }}>ETA: {mockOrder.estimatedDelivery}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {mockOrder.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center`}
                         style={{ backgroundColor: item.completed ? '#FEE8D6' : '#F3F4F6' }}>
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5" style={{ color: '#E87722' }} />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className={`${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.step}
                        </span>
                        {item.time && (
                          <span className="text-sm text-gray-500">{item.time}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Details */}
        {mockOrder.status === 'in-transit' && mockOrder.driver && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 mt-1" style={{ color: '#E87722' }} />
                <div>
                  <div className="text-gray-900">Driver: {mockOrder.driver.name}</div>
                  <div className="text-sm text-gray-600">{mockOrder.driver.vehicle}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1" style={{ color: '#E87722' }} />
                <div>
                  <div className="text-gray-900">{mockOrder.driver.phone}</div>
                  <div className="text-sm text-gray-600">Contact driver</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1" style={{ color: '#E87722' }} />
                <div>
                  <div className="text-gray-900">Delivering to:</div>
                  <div className="text-sm text-gray-600">{mockOrder.deliveryAddress}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="flex-1">
                Contact Support
              </Button>
              <Button variant="outline" className="flex-1">
                View Receipt
              </Button>
              <Button className="flex-1 hover:opacity-90" style={{ backgroundColor: '#E87722' }}>
                Rate Your Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
