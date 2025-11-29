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
  DialogFooter,
} from "./ui/dialog";
import { 
  Truck, 
  User, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  Navigation,
  Phone,
  Mail,
  TrendingUp
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Order } from "./OrderManagement";

export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicleType: 'bike' | 'scooter' | 'van';
  vehicleNumber: string;
  status: 'available' | 'on_delivery' | 'off_duty';
  currentOrders: string[]; // Order IDs
  maxCapacity: number;
  rating: number;
  totalDeliveries: number;
  zone: string;
  createdAt: string;
}

interface OrderWithDelivery extends Order {
  assignedTo?: string;
  deliveryBoyName?: string;
}

export function DeliveryAssignment() {
  const [orders, setOrders] = useState<OrderWithDelivery[]>([]);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithDelivery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDelivery | null>(null);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isAddDeliveryBoyOpen, setIsAddDeliveryBoyOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'unassigned' | 'assigned' | 'all'>('unassigned');

  const [newDeliveryBoy, setNewDeliveryBoy] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleType: 'bike' as 'bike' | 'scooter' | 'van',
    vehicleNumber: '',
    zone: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, viewMode]);

  const loadData = () => {
    // Load orders
    const storedOrders = JSON.parse(localStorage.getItem('moyoclub_orders') || '[]');
    const ordersWithDelivery = storedOrders.map((order: Order) => ({
      ...order,
      assignedTo: order.assignedTo || undefined,
      deliveryBoyName: order.deliveryBoyName || undefined
    }));
    setOrders(ordersWithDelivery);

    // Load or initialize delivery boys
    let storedDeliveryBoys = JSON.parse(localStorage.getItem('moyoclub_delivery_boys') || 'null');
    
    if (!storedDeliveryBoys) {
      // Initialize with demo delivery boys
      storedDeliveryBoys = [
        {
          id: 'db_001',
          name: 'Rajesh Kumar',
          phone: '9876543210',
          email: 'rajesh@delivery.moyoclub.one',
          vehicleType: 'bike',
          vehicleNumber: 'MH 01 AB 1234',
          status: 'available',
          currentOrders: [],
          maxCapacity: 10,
          rating: 4.8,
          totalDeliveries: 245,
          zone: 'South Mumbai',
          createdAt: new Date().toISOString()
        },
        {
          id: 'db_002',
          name: 'Amit Sharma',
          phone: '9876543211',
          email: 'amit@delivery.moyoclub.one',
          vehicleType: 'scooter',
          vehicleNumber: 'MH 01 CD 5678',
          status: 'available',
          currentOrders: [],
          maxCapacity: 8,
          rating: 4.6,
          totalDeliveries: 189,
          zone: 'Central Mumbai',
          createdAt: new Date().toISOString()
        },
        {
          id: 'db_003',
          name: 'Priya Patel',
          phone: '9876543212',
          email: 'priya@delivery.moyoclub.one',
          vehicleType: 'van',
          vehicleNumber: 'MH 02 EF 9012',
          status: 'on_delivery',
          currentOrders: [],
          maxCapacity: 25,
          rating: 4.9,
          totalDeliveries: 312,
          zone: 'North Mumbai',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('moyoclub_delivery_boys', JSON.stringify(storedDeliveryBoys));
    }
    
    setDeliveryBoys(storedDeliveryBoys);
  };

  const filterOrders = () => {
    // Only show orders that are packed or shipped (ready for delivery)
    let filtered = orders.filter(order => 
      order.status === 'packed' || order.status === 'shipped'
    );

    // View mode filter
    if (viewMode === 'unassigned') {
      filtered = filtered.filter(order => !order.assignedTo);
    } else if (viewMode === 'assigned') {
      filtered = filtered.filter(order => order.assignedTo);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(search) ||
        order.customerName.toLowerCase().includes(search) ||
        order.deliveryBoyName?.toLowerCase().includes(search)
      );
    }

    // Sort: unassigned first, then by date
    filtered.sort((a, b) => {
      if (!a.assignedTo && b.assignedTo) return -1;
      if (a.assignedTo && !b.assignedTo) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setFilteredOrders(filtered);
  };

  const handleAssignOrder = (order: OrderWithDelivery) => {
    setSelectedOrder(order);
    setSelectedDeliveryBoy('');
    setIsAssignDialogOpen(true);
  };

  const confirmAssignment = () => {
    if (!selectedOrder || !selectedDeliveryBoy) {
      toast.error('Please select a delivery person');
      return;
    }

    const deliveryBoy = deliveryBoys.find(db => db.id === selectedDeliveryBoy);
    if (!deliveryBoy) return;

    // Check capacity
    if (deliveryBoy.currentOrders.length >= deliveryBoy.maxCapacity) {
      toast.error('This delivery person is at maximum capacity');
      return;
    }

    // Update order
    const updatedOrders = orders.map(order => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          assignedTo: deliveryBoy.id,
          deliveryBoyName: deliveryBoy.name,
          status: 'shipped' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });

    // Update delivery boy
    const updatedDeliveryBoys = deliveryBoys.map(db => {
      if (db.id === deliveryBoy.id) {
        return {
          ...db,
          currentOrders: [...db.currentOrders, selectedOrder.id],
          status: 'on_delivery' as const
        };
      }
      return db;
    });

    // Save to localStorage
    localStorage.setItem('moyoclub_orders', JSON.stringify(updatedOrders));
    localStorage.setItem('moyoclub_delivery_boys', JSON.stringify(updatedDeliveryBoys));

    setOrders(updatedOrders);
    setDeliveryBoys(updatedDeliveryBoys);
    setIsAssignDialogOpen(false);

    toast.success('Order assigned successfully!', {
      description: `Assigned to ${deliveryBoy.name}`,
    });
  };

  const handleUnassignOrder = (order: OrderWithDelivery) => {
    if (!order.assignedTo) return;

    // Update order
    const updatedOrders = orders.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          assignedTo: undefined,
          deliveryBoyName: undefined,
          status: 'packed' as const,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    });

    // Update delivery boy
    const updatedDeliveryBoys = deliveryBoys.map(db => {
      if (db.id === order.assignedTo) {
        const newOrders = db.currentOrders.filter(id => id !== order.id);
        return {
          ...db,
          currentOrders: newOrders,
          status: newOrders.length === 0 ? 'available' as const : 'on_delivery' as const
        };
      }
      return db;
    });

    localStorage.setItem('moyoclub_orders', JSON.stringify(updatedOrders));
    localStorage.setItem('moyoclub_delivery_boys', JSON.stringify(updatedDeliveryBoys));

    setOrders(updatedOrders);
    setDeliveryBoys(updatedDeliveryBoys);

    toast.success('Order unassigned');
  };

  const handleAddDeliveryBoy = () => {
    const { name, phone, email, vehicleType, vehicleNumber, zone } = newDeliveryBoy;

    if (!name || !phone || !vehicleNumber || !zone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const newDB: DeliveryBoy = {
      id: `db_${Date.now()}`,
      name,
      phone,
      email,
      vehicleType,
      vehicleNumber,
      status: 'available',
      currentOrders: [],
      maxCapacity: vehicleType === 'van' ? 25 : vehicleType === 'scooter' ? 8 : 10,
      rating: 5.0,
      totalDeliveries: 0,
      zone,
      createdAt: new Date().toISOString()
    };

    const updatedDeliveryBoys = [...deliveryBoys, newDB];
    localStorage.setItem('moyoclub_delivery_boys', JSON.stringify(updatedDeliveryBoys));
    setDeliveryBoys(updatedDeliveryBoys);

    setNewDeliveryBoy({
      name: '',
      phone: '',
      email: '',
      vehicleType: 'bike',
      vehicleNumber: '',
      zone: ''
    });
    setIsAddDeliveryBoyOpen(false);

    toast.success('Delivery person added successfully!');
  };

  const getStats = () => {
    const readyOrders = orders.filter(o => o.status === 'packed' || o.status === 'shipped');
    const unassigned = readyOrders.filter(o => !o.assignedTo).length;
    const assigned = readyOrders.filter(o => o.assignedTo).length;
    const availableDB = deliveryBoys.filter(db => db.status === 'available').length;
    const busyDB = deliveryBoys.filter(db => db.status === 'on_delivery').length;

    return { readyOrders: readyOrders.length, unassigned, assigned, availableDB, busyDB };
  };

  const getStatusColor = (status: DeliveryBoy['status']) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      on_delivery: 'bg-blue-100 text-blue-800',
      off_duty: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  const getVehicleIcon = (vehicleType: string) => {
    return <Truck className="h-4 w-4" />;
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl mb-1" style={{ color: '#E87722' }}>{stats.readyOrders}</div>
            <div className="text-sm text-gray-600">Ready for Delivery</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-red-600 mb-1">{stats.unassigned}</div>
            <div className="text-sm text-gray-600">Unassigned Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-blue-600 mb-1">{stats.assigned}</div>
            <div className="text-sm text-gray-600">Assigned Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-green-600 mb-1">{stats.availableDB}</div>
            <div className="text-sm text-gray-600">Available Delivery</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl text-purple-600 mb-1">{deliveryBoys.length}</div>
            <div className="text-sm text-gray-600">Total Delivery Staff</div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for unassigned orders */}
      {stats.unassigned > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-1" />
              <div>
                <h4 className="text-sm text-red-900 mb-1">Assignment Required</h4>
                <p className="text-sm text-red-700">
                  {stats.unassigned} orders are packed and ready but not assigned to any delivery person yet.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Section (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" style={{ color: '#E87722' }} />
                Order Assignment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Label>Search Orders</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by order ID, customer, or delivery person..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-48">
                  <Label>View</Label>
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned Only</SelectItem>
                      <SelectItem value="assigned">Assigned Only</SelectItem>
                      <SelectItem value="all">All Orders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No orders ready for delivery</p>
                  {viewMode !== 'all' && (
                    <Button
                      variant="link"
                      onClick={() => setViewMode('all')}
                    >
                      View all orders
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className={order.assignedTo ? 'bg-blue-50 border-blue-200' : 'bg-white'}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono" style={{ color: '#E87722' }}>
                                {order.orderId}
                              </span>
                              {order.assignedTo ? (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Assigned
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Unassigned
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                {order.customerName}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {order.deliveryAddress}
                              </p>
                              <p className="flex items-center gap-2">
                                <Package className="h-3 w-3" />
                                {order.items.length} items • ₹{order.total.toFixed(2)}
                              </p>
                              {order.assignedTo && (
                                <p className="flex items-center gap-2 text-blue-700">
                                  <Truck className="h-3 w-3" />
                                  Assigned to: {order.deliveryBoyName}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {!order.assignedTo ? (
                              <Button
                                size="sm"
                                style={{ backgroundColor: '#E87722' }}
                                onClick={() => handleAssignOrder(order)}
                              >
                                Assign
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnassignOrder(order)}
                              >
                                Unassign
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Delivery Personnel Section (1/3 width) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5" style={{ color: '#E87722' }} />
                Delivery Personnel
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddDeliveryBoyOpen(true)}
              >
                Add New
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deliveryBoys.map((db) => (
                  <Card key={db.id} className="bg-gray-50">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{db.name}</p>
                            <p className="text-xs text-gray-500">{db.zone}</p>
                          </div>
                          <Badge className={getStatusColor(db.status)}>
                            {db.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="flex items-center gap-2">
                            {getVehicleIcon(db.vehicleType)}
                            {db.vehicleType} • {db.vehicleNumber}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {db.phone}
                          </p>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">
                              Capacity: {db.currentOrders.length}/{db.maxCapacity}
                            </span>
                            <span className="flex items-center gap-1 text-yellow-600">
                              ⭐ {db.rating}
                            </span>
                          </div>
                          <div className="mt-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all"
                              style={{ 
                                width: `${(db.currentOrders.length / db.maxCapacity) * 100}%`,
                                backgroundColor: db.currentOrders.length >= db.maxCapacity ? '#ef4444' : '#E87722'
                              }}
                            />
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">
                          <TrendingUp className="h-3 w-3 inline mr-1" />
                          {db.totalDeliveries} total deliveries
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Order to Delivery Person</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p className="text-sm"><strong>Order:</strong> {selectedOrder.orderId}</p>
                <p className="text-sm"><strong>Customer:</strong> {selectedOrder.customerName}</p>
                <p className="text-sm"><strong>Items:</strong> {selectedOrder.items.length}</p>
                <p className="text-sm"><strong>Address:</strong> {selectedOrder.deliveryAddress}</p>
              </div>

              <div>
                <Label>Select Delivery Person</Label>
                <Select value={selectedDeliveryBoy} onValueChange={setSelectedDeliveryBoy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose delivery person..." />
                  </SelectTrigger>
                  <SelectContent>
                    {deliveryBoys
                      .filter(db => db.status !== 'off_duty')
                      .map((db) => (
                        <SelectItem 
                          key={db.id} 
                          value={db.id}
                          disabled={db.currentOrders.length >= db.maxCapacity}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{db.name}</span>
                            <span className="text-xs text-gray-500 ml-4">
                              {db.currentOrders.length}/{db.maxCapacity} • {db.zone}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedDeliveryBoy && (
                  <p className="text-xs text-gray-500 mt-2">
                    ⭐ Rating: {deliveryBoys.find(db => db.id === selectedDeliveryBoy)?.rating}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: '#E87722' }}
              onClick={confirmAssignment}
              disabled={!selectedDeliveryBoy}
            >
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Delivery Boy Dialog */}
      <Dialog open={isAddDeliveryBoyOpen} onOpenChange={setIsAddDeliveryBoyOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Delivery Person</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                placeholder="Enter name"
                value={newDeliveryBoy.name}
                onChange={(e) => setNewDeliveryBoy(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone *</Label>
                <Input
                  placeholder="9876543210"
                  maxLength={10}
                  value={newDeliveryBoy.phone}
                  onChange={(e) => setNewDeliveryBoy(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={newDeliveryBoy.email}
                  onChange={(e) => setNewDeliveryBoy(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Vehicle Type *</Label>
                <Select 
                  value={newDeliveryBoy.vehicleType} 
                  onValueChange={(value: any) => setNewDeliveryBoy(prev => ({ ...prev, vehicleType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bike">Bike (10 orders)</SelectItem>
                    <SelectItem value="scooter">Scooter (8 orders)</SelectItem>
                    <SelectItem value="van">Van (25 orders)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vehicle Number *</Label>
                <Input
                  placeholder="MH 01 AB 1234"
                  value={newDeliveryBoy.vehicleNumber}
                  onChange={(e) => setNewDeliveryBoy(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>Zone *</Label>
              <Input
                placeholder="e.g., South Mumbai"
                value={newDeliveryBoy.zone}
                onChange={(e) => setNewDeliveryBoy(prev => ({ ...prev, zone: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDeliveryBoyOpen(false)}
            >
              Cancel
            </Button>
            <Button
              style={{ backgroundColor: '#E87722' }}
              onClick={handleAddDeliveryBoy}
            >
              Add Delivery Person
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
