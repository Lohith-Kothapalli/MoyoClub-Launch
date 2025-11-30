/**
 * Checkout Component with Razorpay Payment Gateway Integration
 * 
 * TO INTEGRATE WITH REAL RAZORPAY:
 * 1. Sign up at https://razorpay.com/ and get your API keys
 * 2. Add Razorpay script to your index.html: <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 * 3. Create a backend endpoint to create Razorpay orders (see handleRazorpayPayment function)
 * 4. Replace YOUR_RAZORPAY_KEY_ID with your actual key
 * 5. Implement webhook to verify payment signature on your backend
 * 
 * For more info: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { CreditCard, Wallet, Building2, Loader2 } from "lucide-react";
import { CartItem } from "./Cart";
import { UserData } from "./Auth";
import { toast } from "sonner";
import { useEffect } from "react";

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onPaymentSuccess: (orderId: string) => void;
  user: UserData | null;
}

export function Checkout({ isOpen, onClose, items, total, onPaymentSuccess, user }: CheckoutProps) {
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        notes: ''
      });
    }
  }, [isOpen, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateDetails = () => {
    const { name, email, phone, address, city, state, pincode } = formData;
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      toast.error('Please fill in all required fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Generate mock order ID
      const orderId = `MYC${Date.now().toString().slice(-8)}`;
      
      setIsProcessing(false);
      onPaymentSuccess(orderId);
      onClose();
      setStep('details');
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        notes: ''
      });
      
      toast.success('Payment Successful!', {
        description: `Order ID: ${orderId}. You'll receive a confirmation email shortly.`,
        duration: 5000,
      });
    }, 2000);
  };

  // Razorpay integration (demo mode)
  const handleRazorpayPayment = () => {
    // In production, you would integrate with Razorpay like this:
    // const options = {
    //   key: "YOUR_RAZORPAY_KEY_ID", // Enter the Key ID generated from the Dashboard
    //   amount: total * 100, // Amount is in currency subunits (paise)
    //   currency: "INR",
    //   name: "MoyoClub",
    //   description: "Meal Subscription Order",
    //   image: "/logo.png",
    //   order_id: "", // This is the order_id created in the backend
    //   handler: function (response) {
    //     onPaymentSuccess(response.razorpay_order_id);
    //   },
    //   prefill: {
    //     name: formData.name,
    //     email: formData.email,
    //     contact: formData.phone
    //   },
    //   theme: {
    //     color: "#E87722"
    //   }
    // };
    // const rzp = new window.Razorpay(options);
    // rzp.open();

    // For now, using mock payment
    handlePayment();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 'details' ? 'Delivery Details' : 'Payment'}
          </DialogTitle>
        </DialogHeader>

        {step === 'details' ? (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="House/Flat No., Street Name"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Mumbai"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Maharashtra"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="400001"
                  maxLength={6}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special instructions for delivery"
                  rows={2}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm">Order Summary</h4>
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm text-gray-600">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-xl" style={{ color: '#E87722' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              style={{ backgroundColor: '#E87722' }}
              onClick={handleContinueToPayment}
            >
              Continue to Payment
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Amount to Pay</span>
                <span className="text-2xl" style={{ color: '#E87722' }}>₹{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">
                Delivering to: {formData.city}, {formData.state} - {formData.pincode}
              </p>
            </div>

            <div className="space-y-4">
              <Label>Select Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex-1 cursor-pointer flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    UPI (PhonePe, Google Pay, Paytm)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label htmlFor="netbanking" className="flex-1 cursor-pointer flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Net Banking
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800">
                <strong>Demo Mode:</strong> This is a test environment. No actual payment will be processed. 
                In production, this integrates with Razorpay payment gateway.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep('details')}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                size="lg"
                style={{ backgroundColor: '#E87722' }}
                onClick={handleRazorpayPayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${total.toFixed(2)}`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
