import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
} from "./ui/dialog";
import { Package, Search, Calendar, User, MapPin, Phone, Mail, Check, X } from "lucide-react";
import { toast } from "sonner";

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    frequency: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  deliveryBoyName?: string;
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('moyoclub_orders') || '[]');
    setOrders(storedOrders);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search) ||
        order.customerPhone.includes(search)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('moyoclub_orders', JSON.stringify(updatedOrders));
    
    toast.success('Order status updated', {
      description: `Order ${orders.find(o => o.id === orderId)?.orderId} marked as ${newStatus}`,
    });

    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      packed: 'bg-indigo-100 text-indigo-800',
      shipped: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => ['confirmed', 'processing', 'packed'].includes(o.status)).length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1" style={{ color: '#E87722' }}>{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-purple-600 mb-1">{stats.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-cyan-600 mb-1">{stats.shipped}</div>
            <div className="text-sm text-gray-600">Shipped</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-green-600 mb-1">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" style={{ color: '#E87722' }} />
            Order Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Label>Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by order ID, customer name, email, or phone..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-48">
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="packed">Packed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No orders found</p>
              {searchTerm || statusFilter !== 'all' ? (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  Clear filters
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.orderId}</TableCell>
                      <TableCell>
                        <div className="text-sm">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </TableCell>
                      <TableCell>{order.items.length} items</TableCell>
                      <TableCell>₹{order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Details</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order ID</Label>
                  <p className="font-mono text-lg" style={{ color: '#E87722' }}>
                    {selectedOrder.orderId}
                  </p>
                </div>
                <div>
                  <Label>Order Date</Label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    {selectedOrder.customerName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {selectedOrder.customerEmail}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {selectedOrder.customerPhone}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <span>{selectedOrder.deliveryAddress}</span>
                  </p>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="capitalize">{item.frequency}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Delivery Fee</span>
                      <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span>Total</span>
                      <span className="text-xl" style={{ color: '#E87722' }}>
                        ₹{selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Update */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Label>Current Status:</Label>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOrder.status === 'pending' && (
                      <>
                        <Button
                          style={{ backgroundColor: '#E87722' }}
                          onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Confirm Order
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      </>
                    )}
                    {selectedOrder.status === 'confirmed' && (
                      <Button
                        style={{ backgroundColor: '#E87722' }}
                        onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                      >
                        Start Processing
                      </Button>
                    )}
                    {selectedOrder.status === 'processing' && (
                      <Button
                        style={{ backgroundColor: '#E87722' }}
                        onClick={() => updateOrderStatus(selectedOrder.id, 'packed')}
                      >
                        Mark as Packed
                      </Button>
                    )}
                    {selectedOrder.status === 'packed' && (
                      <Button
                        style={{ backgroundColor: '#E87722' }}
                        onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                      >
                        Mark as Shipped
                      </Button>
                    )}
                    {selectedOrder.status === 'shipped' && (
                      <Button
                        style={{ backgroundColor: '#E87722' }}
                        onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      >
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
