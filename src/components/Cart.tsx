import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "./ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Product } from "./ProductCard";
import { OrderFrequency } from "./FrequencySelector";

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
  frequency: OrderFrequency;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function Cart({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout 
}: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const frequencyLabels = {
    weekly: 'Weekly',
    biweekly: 'Bi-Weekly',
    monthly: 'Monthly'
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" style={{ color: '#E87722' }} />
            Your Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add some delicious meals to get started!
            </p>
            <Button 
              onClick={onClose}
              style={{ backgroundColor: '#E87722' }}
              className="hover:opacity-90"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-gray-900 mb-1">{item.product.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">
                        {frequencyLabels[item.frequency]} Delivery
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto"
                          onClick={() => onRemoveItem(item.product.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: '#E87722' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        ₹{item.price.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-900">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              {subtotal < 500 && subtotal > 0 && (
                <p className="text-xs text-gray-500">
                  Add ₹{(500 - subtotal).toFixed(2)} more for free delivery!
                </p>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-xl" style={{ color: '#E87722' }}>
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <SheetFooter className="mt-4">
              <Button
                className="w-full hover:opacity-90"
                size="lg"
                style={{ backgroundColor: '#E87722' }}
                onClick={onCheckout}
              >
                Proceed to Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
