import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Product } from "./ProductCard";
import { OrderFrequency } from "./FrequencySelector";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { AlertCircle, CheckCircle2, Leaf, Plus, X, ShoppingCart } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";

interface MinimumOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentTotal: number;
  selectedProduct: Product | null;
  selectedPrice: number;
  availableProducts: Product[];
  selectedFrequency: OrderFrequency;
  onConfirmSelection: (selectedItems: Array<{ product: Product; price: number }>) => void;
  onProceedToCheckout: (selectedItems: Array<{ product: Product; price: number }>) => void;
  onProceedToCart: (selectedItems: Array<{ product: Product; price: number }>) => void;
}

const MINIMUM_ORDER_VALUE = 1500;

export function MinimumOrderDialog({
  isOpen,
  onClose,
  currentTotal,
  selectedProduct,
  selectedPrice,
  availableProducts,
  selectedFrequency,
  onConfirmSelection,
  onProceedToCheckout,
  onProceedToCart,
}: MinimumOrderDialogProps) {
  const [additionalItems, setAdditionalItems] = useState<Array<{ product: Product; price: number }>>([]);
  
  // Calculate totals
  const newTotal = currentTotal + selectedPrice;
  const remainingAmount = MINIMUM_ORDER_VALUE - newTotal;
  const additionalTotal = additionalItems.reduce((sum, item) => sum + item.price, 0);
  const projectedTotal = newTotal + additionalTotal;
  const stillNeeded = Math.max(0, MINIMUM_ORDER_VALUE - projectedTotal);

  // Filter out the selected product and get suggested products
  const suggestedProducts = availableProducts
    .filter(p => p.id !== selectedProduct?.id)
    .filter(p => {
      const price = p.pricing[selectedFrequency];
      // Suggest products that could help reach the minimum
      return price >= 100 && price <= remainingAmount + 200;
    })
    // Remove any potential duplicates by creating a Map with id as key
    .filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    )
    .slice(0, 12);

  useEffect(() => {
    // Reset additional items when dialog opens
    if (isOpen) {
      setAdditionalItems([]);
    }
  }, [isOpen]);

  const toggleItem = (product: Product) => {
    const price = product.pricing[selectedFrequency];
    const isSelected = additionalItems.some(item => item.product.id === product.id);

    if (isSelected) {
      setAdditionalItems(prev => prev.filter(item => item.product.id !== product.id));
    } else {
      // Limit to 3 additional items
      if (additionalItems.length < 3) {
        setAdditionalItems(prev => [...prev, { product, price }]);
      }
    }
  };

  const handleConfirm = () => {
    if (projectedTotal >= MINIMUM_ORDER_VALUE) {
      onConfirmSelection(additionalItems);
      onClose();
    }
  };

  const handleCancel = () => {
    setAdditionalItems([]);
    onClose();
  };

  const isItemSelected = (productId: string) => {
    return additionalItems.some(item => item.product.id === productId);
  };

  const canAddMore = additionalItems.length < 3;
  const meetsMinimum = projectedTotal >= MINIMUM_ORDER_VALUE;

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" style={{ color: '#E87722' }} />
            Minimum Order Value Required
          </DialogTitle>
          <DialogDescription>
            MoyoClub requires a minimum order of ₹1500 to ensure quality delivery and service.
          </DialogDescription>
        </DialogHeader>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Current Cart Total</p>
              <p className="text-xl">₹{currentTotal.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Adding Now</p>
              <p className="text-xl" style={{ color: '#E87722' }}>
                +₹{selectedPrice.toFixed(0)}
              </p>
            </div>
          </div>

          {selectedProduct && (
            <div className="bg-white rounded-md p-3 border">
              <div className="flex items-start gap-3">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm line-clamp-1">{selectedProduct.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      <Leaf className="h-3 w-3 mr-1" />
                      {selectedProduct.farmSource}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm" style={{ color: '#E87722' }}>
                  ₹{selectedPrice.toFixed(0)}
                </p>
              </div>
            </div>
          )}

          <Separator />

          {additionalItems.length > 0 && (
            <>
              <div>
                <p className="text-sm text-gray-600 mb-2">Selected Additional Items</p>
                <div className="space-y-2">
                  {additionalItems.map(({ product, price }) => (
                    <div key={product.id} className="bg-white rounded-md p-3 border">
                      <div className="flex items-start gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-sm line-clamp-1">{product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Leaf className="h-3 w-3 mr-1" />
                              {product.farmSource}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm" style={{ color: '#E87722' }}>
                            ₹{price.toFixed(0)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleItem(product)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Projected Total</p>
              <p className="text-2xl" style={{ color: meetsMinimum ? '#10b981' : '#E87722' }}>
                ₹{projectedTotal.toFixed(0)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Minimum Required</p>
              <p className="text-2xl">₹{MINIMUM_ORDER_VALUE.toFixed(0)}</p>
            </div>
          </div>

          {meetsMinimum ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Great! You've met the minimum order value. You can now proceed.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Please select {additionalItems.length === 0 ? "1-3" : `${Math.min(3 - additionalItems.length, Math.ceil(stillNeeded / 500))}`} more item(s) to add ₹{stillNeeded.toFixed(0)} to your order.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Available Products to Add */}
        {!meetsMinimum && (
          <>
            <div className="mt-4">
              <h3 className="mb-3">
                Select {canAddMore ? `${3 - additionalItems.length} more` : "items"} (up to 3 additional items)
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose from our suggested items to reach the minimum order value
              </p>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedProducts.map(product => {
                  const price = product.pricing[selectedFrequency];
                  const selected = isItemSelected(product.id);
                  const disabled = !canAddMore && !selected;

                  return (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selected
                          ? 'border-orange-500 bg-orange-50'
                          : disabled
                          ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                      onClick={() => !disabled && toggleItem(product)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selected}
                          disabled={disabled}
                          onCheckedChange={() => !disabled && toggleItem(product)}
                          className="mt-1"
                        />
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              <Leaf className="h-3 w-3 mr-1" />
                              {product.farmSource}
                            </Badge>
                            <p className="text-sm" style={{ color: '#E87722' }}>
                              ₹{price.toFixed(0)}
                            </p>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {product.nutrition.calories} cal • {product.nutrition.protein}g protein
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          {!meetsMinimum ? (
            <Button
              style={{ backgroundColor: '#E87722' }}
              onClick={handleConfirm}
              disabled={!meetsMinimum}
              className="disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Select More Items
            </Button>
          ) : (
            <>
              <Button
                style={{ backgroundColor: '#A67C52' }}
                onClick={handleConfirm}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
              <Button
                style={{ backgroundColor: '#E87722' }}
                onClick={() => onProceedToCart(additionalItems)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Cart
              </Button>
              <Button
                style={{ backgroundColor: '#E87722' }}
                onClick={() => onProceedToCheckout(additionalItems)}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Checkout Now
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}