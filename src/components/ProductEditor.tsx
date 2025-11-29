import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Save, X } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { InventoryItem } from "./InventoryManagement";

interface ProductEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  editItem?: InventoryItem | null;
  mode: 'add' | 'edit';
}

export function ProductEditor({ isOpen, onClose, onSave, editItem, mode }: ProductEditorProps) {
  const [formData, setFormData] = useState<InventoryItem>({
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    pricing: {
      weekly: 0,
      biweekly: 0,
      monthly: 0
    },
    image: '',
    farmSource: '',
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    tags: [],
    stock: 0,
    reorderLevel: 20,
    lastUpdated: new Date().toISOString()
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
      setTagInput(editItem.tags.join(', '));
    } else {
      resetForm();
    }
  }, [editItem, isOpen]);

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      basePrice: 0,
      pricing: {
        weekly: 0,
        biweekly: 0,
        monthly: 0
      },
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      farmSource: '',
      nutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      },
      tags: [],
      stock: 0,
      reorderLevel: 20,
      lastUpdated: new Date().toISOString()
    });
    setTagInput('');
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof InventoryItem] as any),
        [field]: value
      }
    }));
  };

  const handleBasePriceChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      basePrice: value,
      pricing: {
        weekly: Math.round(value * 0.85), // 15% discount
        biweekly: Math.round(value * 0.90), // 10% discount
        monthly: Math.round(value * 0.95) // 5% discount
      }
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.id.trim()) {
      toast.error('Product ID is required');
      return false;
    }

    if (mode === 'add') {
      // Check for duplicate ID
      const existingInventory = JSON.parse(localStorage.getItem('moyoclub_inventory') || '[]');
      if (existingInventory.some((item: InventoryItem) => item.id === formData.id)) {
        toast.error('Product ID already exists');
        return false;
      }
    }

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }

    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }

    if (formData.basePrice <= 0) {
      toast.error('Base price must be greater than 0');
      return false;
    }

    if (!formData.farmSource.trim()) {
      toast.error('Farm source is required');
      return false;
    }

    if (formData.stock < 0) {
      toast.error('Stock cannot be negative');
      return false;
    }

    if (formData.reorderLevel < 0) {
      toast.error('Reorder level cannot be negative');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    // Parse tags
    const tags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const itemToSave: InventoryItem = {
      ...formData,
      tags,
      lastUpdated: new Date().toISOString()
    };

    onSave(itemToSave);
    handleClose();

    toast.success(mode === 'add' ? 'Product added successfully!' : 'Product updated successfully!');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === 'add' ? 'Add New Product' : 'Edit Product'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg" style={{ color: '#A67C52' }}>Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-id">Product ID *</Label>
                <Input
                  id="product-id"
                  placeholder="e.g., meal-001"
                  value={formData.id}
                  onChange={(e) => handleChange('id', e.target.value)}
                  disabled={mode === 'edit'}
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for the product</p>
              </div>

              <div>
                <Label htmlFor="farm-source">Farm Source *</Label>
                <Input
                  id="farm-source"
                  placeholder="e.g., Green Valley Farm"
                  value={formData.farmSource}
                  onChange={(e) => handleChange('farmSource', e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="product-name">Product Name *</Label>
              <Input
                id="product-name"
                placeholder="e.g., Grilled Chicken Bowl"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the product..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                placeholder="https://..."
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank for default image</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg" style={{ color: '#A67C52' }}>Pricing</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="base-price">Base Price (₹) *</Label>
                <Input
                  id="base-price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="299.00"
                  value={formData.basePrice || ''}
                  onChange={(e) => handleBasePriceChange(parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">Auto-calculates frequency prices</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weekly-price">Weekly Price (₹)</Label>
                <Input
                  id="weekly-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricing.weekly || ''}
                  onChange={(e) => handleNestedChange('pricing', 'weekly', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="biweekly-price">Bi-weekly Price (₹)</Label>
                <Input
                  id="biweekly-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricing.biweekly || ''}
                  onChange={(e) => handleNestedChange('pricing', 'biweekly', parseFloat(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="monthly-price">Monthly Price (₹)</Label>
                <Input
                  id="monthly-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.pricing.monthly || ''}
                  onChange={(e) => handleNestedChange('pricing', 'monthly', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="space-y-4">
            <h3 className="text-lg" style={{ color: '#A67C52' }}>Nutrition Information</h3>
            
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  placeholder="450"
                  value={formData.nutrition.calories || ''}
                  onChange={(e) => handleNestedChange('nutrition', 'calories', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  min="0"
                  placeholder="35"
                  value={formData.nutrition.protein || ''}
                  onChange={(e) => handleNestedChange('nutrition', 'protein', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  min="0"
                  placeholder="45"
                  value={formData.nutrition.carbs || ''}
                  onChange={(e) => handleNestedChange('nutrition', 'carbs', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  min="0"
                  placeholder="12"
                  value={formData.nutrition.fat || ''}
                  onChange={(e) => handleNestedChange('nutrition', 'fat', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg" style={{ color: '#A67C52' }}>Inventory</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="50"
                  value={formData.stock || ''}
                  onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="reorder-level">Reorder Level *</Label>
                <Input
                  id="reorder-level"
                  type="number"
                  min="0"
                  placeholder="20"
                  value={formData.reorderLevel || ''}
                  onChange={(e) => handleChange('reorderLevel', parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg" style={{ color: '#A67C52' }}>Tags</h3>
            
            <div>
              <Label htmlFor="tags">Product Tags</Label>
              <Input
                id="tags"
                placeholder="High Protein, Vegan, Gluten Free (comma-separated)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg" style={{ color: '#A67C52' }}>Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>ID:</strong> {formData.id || 'N/A'}</p>
              <p><strong>Name:</strong> {formData.name || 'N/A'}</p>
              <p><strong>Base Price:</strong> ₹{formData.basePrice.toFixed(2)}</p>
              <p><strong>Stock:</strong> {formData.stock} units</p>
              <p><strong>Status:</strong> {formData.stock === 0 ? '🔴 Out of Stock' : formData.stock <= formData.reorderLevel ? '🟡 Low Stock' : '🟢 In Stock'}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: '#E87722' }}
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            {mode === 'add' ? 'Add Product' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
