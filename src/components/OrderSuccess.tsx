import { CheckCircle, Package, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface OrderSuccessProps {
  orderId: string;
  onViewOrder: () => void;
  onContinueShopping: () => void;
}

export function OrderSuccess({ orderId, onViewOrder, onContinueShopping }: OrderSuccessProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardContent className="pt-12 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="rounded-full p-4" style={{ backgroundColor: '#FEE8D6' }}>
                <CheckCircle className="h-16 w-16" style={{ color: '#E87722' }} />
              </div>
            </div>
            
            <h2 className="text-3xl text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your order. We've received your payment and started preparing your meals.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-8 inline-block">
              <p className="text-sm text-gray-600 mb-1">Your Order ID</p>
              <p className="text-2xl" style={{ color: '#E87722' }}>{orderId}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
              <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="h-5 w-5 mt-1" style={{ color: '#E87722' }} />
                <div>
                  <p className="text-sm text-gray-900 mb-1">Order Confirmation</p>
                  <p className="text-xs text-gray-600">Email sent to your inbox</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 mt-1" style={{ color: '#E87722' }} />
                <div>
                  <p className="text-sm text-gray-900 mb-1">Estimated Delivery</p>
                  <p className="text-xs text-gray-600">Within 24-48 hours</p>
                </div>
              </div>
              <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 mt-1" style={{ color: '#E87722' }} />
                <div>
                  <p className="text-sm text-gray-900 mb-1">Track Order</p>
                  <p className="text-xs text-gray-600">Real-time updates</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                style={{ borderColor: '#E87722', color: '#E87722' }}
                onClick={onContinueShopping}
              >
                Continue Shopping
              </Button>
              <Button
                size="lg"
                style={{ backgroundColor: '#E87722' }}
                className="hover:opacity-90"
                onClick={onViewOrder}
              >
                Track My Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
