import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Minus, Plus, ShoppingCart, CheckCircle2, Leaf, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { API_ENDPOINTS, apiRequest } from "../config/api";
import { UserData } from "./Auth";
import { analytics } from "../utils/analytics";

interface SingleProductPurchaseProps {
  user: UserData;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string; // Can be string from database
  image_url: string;
}

interface Order {
  order_id: string;
  transaction_id: string;
  total_amount: number;
  quantity: number;
  product_name: string;
}

export function SingleProductPurchase({ user }: SingleProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch product on mount
  useEffect(() => {
    fetchProduct();
  }, []);

  // Generate QR code when payment step is shown
  useEffect(() => {
    if (showPayment && product) {
      generateQRCode();
    }
  }, [showPayment, product, quantity]);

  const fetchProduct = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.PRODUCTS.LIST);
      if (response.success && response.products.length > 0) {
        const productData = response.products[0];
        // Convert price to number (PostgreSQL returns as string)
        const product = {
          ...productData,
          price: typeof productData.price === 'string' ? parseFloat(productData.price) : productData.price
        };
        setProduct(product);
        
        // Track product view
        analytics.viewProduct(
          product.id.toString(),
          product.name
        );
      } else {
        toast.error("Product not found");
      }
    } catch (error: any) {
      toast.error("Failed to load product", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    try {
      // Generate QR code with payment details
      const paymentData = {
        amount: (product ? Number(product.price) : 0) * quantity,
        merchant: "MoyoClub",
        orderId: `MOYO${Date.now()}`,
      };
      
      // For now, use a simple UPI payment string format
      const upiString = `upi://pay?pa=moyoclub@paytm&pn=MoyoClub&am=${paymentData.amount}&cu=INR&tn=Order%20${paymentData.orderId}`;
      
      // Use a QR code generation library or API
      // For simplicity, we'll use a placeholder QR code service
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
      setQrCodeUrl(qrCodeApiUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
    
    // Track begin checkout event
    if (product) {
      analytics.beginCheckout(
        Number(product.price) * quantity,
        [{
          id: product.id.toString(),
          name: product.name,
          quantity,
          price: Number(product.price),
        }]
      );
    }
    
    toast.success("Proceeding to payment", {
      description: "Please scan the QR code and enter your payment ID",
      duration: 3000,
    });
  };

  const handleConfirmPayment = async () => {
    if (!paymentId.trim()) {
      toast.error("Payment ID required", {
        description: "Please enter your payment transaction ID",
        duration: 3000,
      });
      return;
    }

    if (!product) {
      toast.error("Product not loaded");
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = Number(product.price) * quantity;
      const deliveryAddress = {
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
      };

      const response = await apiRequest(API_ENDPOINTS.ORDERS.CREATE, {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity,
          totalAmount,
          transactionId: paymentId,
          deliveryAddress,
        }),
      });

      if (response.success) {
        setOrder({
          order_id: response.order.order_id,
          transaction_id: paymentId,
          total_amount: totalAmount,
          quantity,
          product_name: product.name,
        });
        setOrderConfirmed(true);
        
        // Track purchase event
        analytics.purchase(
          paymentId,
          totalAmount,
          [{
            id: product.id.toString(),
            name: product.name,
            quantity,
            price: Number(product.price),
          }]
        );
        
        toast.success("Order confirmed!", {
          description: `Your order #${response.order.order_id} has been successfully placed`,
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast.error("Failed to confirm order", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewOrder = () => {
    setQuantity(1);
    setShowPayment(false);
    setPaymentId("");
    setOrderConfirmed(false);
    setOrder(null);
  };

  // Helper function to get image URL
  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it starts with /, it's a public path
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    // Default: treat as public path
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: "#E87722" }} />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>Product not available. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalAmount = Number(product.price) * quantity;
  const imageUrl = getImageUrl(product.image_url);

  if (orderConfirmed && order) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="border-2 border-green-500">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl" style={{ color: "#E87722" }}>
              Order Confirmed!
            </CardTitle>
            <CardDescription>Thank you for your purchase, {user.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono font-semibold">{order.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Transaction ID:</span>
                <span className="font-mono">{order.transaction_id}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span>{order.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span>{order.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span style={{ color: "#E87722" }} className="font-semibold">
                  ₹{order.total_amount.toFixed(2)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{user.email}</span>
              </div>
              {user.address && (
                <div>
                  <span className="text-gray-600">Delivery Address:</span>
                  <p className="text-sm mt-1">
                    {user.address}, {user.city}, {user.state} - {user.pincode}
                  </p>
                </div>
              )}
            </div>

            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                A confirmation email has been sent to {user.email}. Your order will be delivered
                within 2-3 business days.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleNewOrder}
              className="w-full"
              style={{ backgroundColor: "#E87722" }}
              size="lg"
            >
              Place Another Order
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl mb-2" style={{ color: "#E87722" }}>
          MoyoClub
        </h1>
        <p className="text-gray-600">Premium Nutrition Delivered Fresh from Our Farms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Section */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder or default image
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1644204317919-a0185a4997f9?w=800";
                    target.onerror = null; // Prevent infinite loop
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Leaf className="h-16 w-16" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl">{product.name}</h3>
                <Badge variant="outline" style={{ borderColor: "#E87722", color: "#E87722" }}>
                  <Leaf className="h-3 w-3 mr-1" />
                  Farm Fresh
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm mb-3" style={{ color: "#A67C52" }}>
                Premium Quality
              </h4>
              <p className="text-xs text-gray-600">
                Sourced directly from our managed farms ensuring quality and freshness
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Checkout Section */}
        <div className="space-y-6">
          {!showPayment ? (
            <>
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Select quantity and proceed to payment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>Quantity</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl w-12 text-center">{quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per unit</span>
                      <span>₹{Number(product.price).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity</span>
                      <span>×{quantity}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-xl">Total Amount</span>
                      <span className="text-3xl" style={{ color: "#E87722" }}>
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full"
                    style={{ backgroundColor: "#E87722" }}
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Proceed to Payment
                  </Button>
                </CardContent>
              </Card>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600">Customer Name</Label>
                    <p>{user.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Email Address</Label>
                    <p>{user.email}</p>
                  </div>
                  {user.address && (
                    <div>
                      <Label className="text-xs text-gray-600">Delivery Address</Label>
                      <p className="text-sm">
                        {user.address}, {user.city}, {user.state} - {user.pincode}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Payment Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" style={{ color: "#E87722" }} />
                    Payment
                  </CardTitle>
                  <CardDescription>Scan the QR code to complete payment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* QR Code Display */}
                  <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center">
                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                      {qrCodeUrl ? (
                        <img src={qrCodeUrl} alt="Payment QR Code" className="h-48 w-48" />
                      ) : (
                        <div className="h-48 w-48 bg-white border-4 border-gray-900 flex items-center justify-center">
                          <div className="text-center">
                            <QrCode className="h-32 w-32 mx-auto mb-2" />
                            <p className="text-xs text-gray-600">Loading QR Code...</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-center mb-2 font-semibold" style={{ color: "#E87722" }}>
                      Amount: ₹{totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 text-center">
                      Scan this QR code using any UPI payment app (PhonePe, Google Pay, Paytm)
                    </p>
                  </div>

                  <Separator />

                  {/* Payment ID Input */}
                  <div className="space-y-3">
                    <Label htmlFor="paymentId">Payment Transaction ID *</Label>
                    <Input
                      id="paymentId"
                      placeholder="Enter your UPI transaction ID"
                      value={paymentId}
                      onChange={(e) => setPaymentId(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-xs text-gray-600">
                      After completing the payment, enter the transaction ID from your payment app
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowPayment(false)}
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleConfirmPayment}
                      className="flex-1"
                      style={{ backgroundColor: "#E87722" }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Confirm Payment
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary (Compact) */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product</span>
                    <span className="text-sm text-right">{product.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity</span>
                    <span>×{quantity}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>Total</span>
                    <span className="text-xl" style={{ color: "#E87722" }}>
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
