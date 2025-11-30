import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Package, Search, AlertTriangle, TrendingUp, Edit2, Save, Plus, Minus, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Product } from "./ProductCard";
import { BulkInventoryUpload } from "./BulkInventoryUpload";
import { ProductEditor } from "./ProductEditor";

export interface InventoryItem extends Product {
  stock: number;
  reorderLevel: number;
  lastUpdated: string;
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editQuantity, setEditQuantity] = useState(0);
  const [editReorderLevel, setEditReorderLevel] = useState(0);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isProductEditorOpen, setIsProductEditorOpen] = useState(false);
  const [productEditorMode, setProductEditorMode] = useState<'add' | 'edit'>('add');
  const [editingProduct, setEditingProduct] = useState<InventoryItem | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm]);

  const loadInventory = () => {
    // Load products and initialize with stock levels
    const productsKey = 'moyoclub_products';
    const inventoryKey = 'moyoclub_inventory';
    
    let storedInventory = JSON.parse(localStorage.getItem(inventoryKey) || 'null');
    
    if (!storedInventory) {
      // Initialize inventory from products with default stock
      const products = getMockProducts();
      storedInventory = products.map(product => ({
        ...product,
        stock: Math.floor(Math.random() * 100) + 50, // Random initial stock 50-150
        reorderLevel: 20,
        lastUpdated: new Date().toISOString()
      }));
      localStorage.setItem(inventoryKey, JSON.stringify(storedInventory));
    }
    
    setInventory(storedInventory);
  };

  const filterInventory = () => {
    let filtered = [...inventory];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search) ||
        item.id.toLowerCase().includes(search) ||
        item.farmSource.toLowerCase().includes(search)
      );
    }

    // Sort by stock level (low to high) to prioritize items needing attention
    filtered.sort((a, b) => {
      const aLow = a.stock <= a.reorderLevel;
      const bLow = b.stock <= b.reorderLevel;
      if (aLow && !bLow) return -1;
      if (!aLow && bLow) return 1;
      return a.stock - b.stock;
    });

    setFilteredInventory(filtered);
  };

  const updateStock = (itemId: string, newStock: number, newReorderLevel: number) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          stock: newStock,
          reorderLevel: newReorderLevel,
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    localStorage.setItem('moyoclub_inventory', JSON.stringify(updatedInventory));
    
    toast.success('Inventory updated successfully', {
      description: `${inventory.find(i => i.id === itemId)?.name} stock updated`,
    });
  };

  const handleAddProduct = () => {
    setProductEditorMode('add');
    setEditingProduct(null);
    setIsProductEditorOpen(true);
  };

  const handleEditProduct = (item: InventoryItem) => {
    setProductEditorMode('edit');
    setEditingProduct(item);
    setIsProductEditorOpen(true);
  };

  const handleSaveProduct = (item: InventoryItem) => {
    if (productEditorMode === 'add') {
      // Add new product
      const updatedInventory = [...inventory, item];
      setInventory(updatedInventory);
      localStorage.setItem('moyoclub_inventory', JSON.stringify(updatedInventory));
      
      // Also add to products list for consumer side
      const existingProducts = JSON.parse(localStorage.getItem('moyoclub_products') || '[]');
      const newProduct = { ...item };
      delete (newProduct as any).stock;
      delete (newProduct as any).reorderLevel;
      delete (newProduct as any).lastUpdated;
      existingProducts.push(newProduct);
      localStorage.setItem('moyoclub_products', JSON.stringify(existingProducts));
    } else {
      // Update existing product
      const updatedInventory = inventory.map(i => 
        i.id === item.id ? item : i
      );
      setInventory(updatedInventory);
      localStorage.setItem('moyoclub_inventory', JSON.stringify(updatedInventory));
      
      // Update in products list too
      const existingProducts = JSON.parse(localStorage.getItem('moyoclub_products') || '[]');
      const updatedProducts = existingProducts.map((p: Product) => {
        if (p.id === item.id) {
          const newProduct = { ...item };
          delete (newProduct as any).stock;
          delete (newProduct as any).reorderLevel;
          delete (newProduct as any).lastUpdated;
          return newProduct;
        }
        return p;
      });
      localStorage.setItem('moyoclub_products', JSON.stringify(updatedProducts));
    }
  };

  const handleBulkUpload = (items: InventoryItem[]) => {
    // Merge with existing inventory (replace duplicates)
    const existingIds = new Set(inventory.map(i => i.id));
    const newItems = items.filter(item => !existingIds.has(item.id));
    const updatedItems = items.filter(item => existingIds.has(item.id));

    let updatedInventory = [...inventory];
    
    // Update existing items
    updatedInventory = updatedInventory.map(item => {
      const update = updatedItems.find(u => u.id === item.id);
      return update || item;
    });

    // Add new items
    updatedInventory = [...updatedInventory, ...newItems];

    setInventory(updatedInventory);
    localStorage.setItem('moyoclub_inventory', JSON.stringify(updatedInventory));

    // Update products list
    const products = updatedInventory.map(item => {
      const product = { ...item };
      delete (product as any).stock;
      delete (product as any).reorderLevel;
      delete (product as any).lastUpdated;
      return product;
    });
    localStorage.setItem('moyoclub_products', JSON.stringify(products));

    toast.success(`Bulk upload complete!`, {
      description: `${newItems.length} new products added, ${updatedItems.length} updated`,
    });
  };

  const handleDeleteProduct = (itemId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    const updatedInventory = inventory.filter(item => item.id !== itemId);
    setInventory(updatedInventory);
    localStorage.setItem('moyoclub_inventory', JSON.stringify(updatedInventory));

    // Remove from products list
    const existingProducts = JSON.parse(localStorage.getItem('moyoclub_products') || '[]');
    const updatedProducts = existingProducts.filter((p: Product) => p.id !== itemId);
    localStorage.setItem('moyoclub_products', JSON.stringify(updatedProducts));

    toast.success('Product deleted successfully');
  };

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditQuantity(item.stock);
    setEditReorderLevel(item.reorderLevel);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedItem) {
      updateStock(selectedItem.id, editQuantity, editReorderLevel);
      setIsEditOpen(false);
      setSelectedItem(null);
    }
  };

  const quickAdjustStock = (itemId: string, adjustment: number) => {
    const item = inventory.find(i => i.id === itemId);
    if (item) {
      const newStock = Math.max(0, item.stock + adjustment);
      updateStock(itemId, newStock, item.reorderLevel);
    }
  };

  const getStockStatus = (stock: number, reorderLevel: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= reorderLevel) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const getInventoryStats = () => {
    return {
      total: inventory.length,
      inStock: inventory.filter(i => i.stock > i.reorderLevel).length,
      lowStock: inventory.filter(i => i.stock > 0 && i.stock <= i.reorderLevel).length,
      outOfStock: inventory.filter(i => i.stock === 0).length,
      totalValue: inventory.reduce((sum, item) => sum + (item.basePrice * item.stock), 0)
    };
  };

  const stats = getInventoryStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1" style={{ color: '#E87722' }}>{stats.total}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-green-600 mb-1">{stats.inStock}</div>
            <div className="text-sm text-gray-600">In Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-yellow-600 mb-1">{stats.lowStock}</div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-red-600 mb-1">{stats.outOfStock}</div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-blue-600 mb-1">₹{(stats.totalValue / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-600">Inventory Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStock + stats.outOfStock > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
              <div>
                <h4 className="text-sm text-yellow-900 mb-1">Inventory Alert</h4>
                <p className="text-sm text-yellow-700">
                  {stats.outOfStock > 0 && `${stats.outOfStock} items out of stock. `}
                  {stats.lowStock > 0 && `${stats.lowStock} items below reorder level.`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" style={{ color: '#E87722' }} />
            Inventory Management
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleAddProduct}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button
              style={{ backgroundColor: '#A67C52' }}
              onClick={() => setIsBulkUploadOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label>Search Products</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by product name, ID, or farm source..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredInventory.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Farm Source</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const status = getStockStatus(item.stock, item.reorderLevel);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.id}</div>
                        </TableCell>
                        <TableCell className="text-sm">{item.farmSource}</TableCell>
                        <TableCell>₹{item.basePrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => quickAdjustStock(item.id, -10)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-lg w-12 text-center">{item.stock}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => quickAdjustStock(item.id, 10)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell>
                          <Badge className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(item)}
                              title="Quick stock update"
                            >
                              <Edit2 className="h-3 w-3 mr-2" />
                              Stock
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(item)}
                              title="Edit full product details"
                            >
                              <Package className="h-3 w-3 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(item.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete product"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Inventory</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Product</Label>
                <p className="text-sm text-gray-700 mt-1">{selectedItem.name}</p>
              </div>

              <div>
                <Label htmlFor="edit-stock">Stock Quantity</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(parseInt(e.target.value) || 0)}
                />
              </div>

              <div>
                <Label htmlFor="edit-reorder">Reorder Level</Label>
                <Input
                  id="edit-reorder"
                  type="number"
                  min="0"
                  value={editReorderLevel}
                  onChange={(e) => setEditReorderLevel(parseInt(e.target.value) || 0)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alert when stock falls below this level
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm mb-1">
                  <span>Current Stock:</span>
                  <span>{selectedItem.stock} units</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>New Stock:</span>
                  <span className={editQuantity < selectedItem.stock ? 'text-red-600' : 'text-green-600'}>
                    {editQuantity} units
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Change:</span>
                  <span style={{ color: editQuantity < selectedItem.stock ? '#dc2626' : '#16a34a' }}>
                    {editQuantity - selectedItem.stock > 0 ? '+' : ''}
                    {editQuantity - selectedItem.stock} units
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: '#E87722' }}
              onClick={handleSaveEdit}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <BulkInventoryUpload
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onUploadComplete={handleBulkUpload}
      />

      {/* Product Editor Dialog */}
      <ProductEditor
        isOpen={isProductEditorOpen}
        onClose={() => {
          setIsProductEditorOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editItem={editingProduct}
        mode={productEditorMode}
      />
    </div>
  );
}

// Mock products data (same structure as ProductGrid)
function getMockProducts(): Product[] {
  return [
    {
      id: "meal-001",
      name: "Grilled Chicken Bowl",
      description: "High-protein meal with grilled chicken, quinoa, and fresh vegetables",
      basePrice: 299,
      pricing: { weekly: 249, biweekly: 269, monthly: 289 },
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      farmSource: "Green Valley",
      nutrition: { calories: 450, protein: 35, carbs: 45, fat: 12 },
      tags: ["High Protein"]
    },
    {
      id: "meal-002",
      name: "Vegan Buddha Bowl",
      description: "Nutritious plant-based bowl with chickpeas, avocado, and mixed greens",
      basePrice: 279,
      pricing: { weekly: 229, biweekly: 249, monthly: 269 },
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      farmSource: "Organic Farms",
      nutrition: { calories: 380, protein: 15, carbs: 52, fat: 14 },
      tags: ["Vegan"]
    },
    // Add more products as needed
  ];
}
