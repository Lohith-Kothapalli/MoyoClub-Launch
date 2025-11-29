import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { User, MapPin, Phone, Mail, Calendar, Package, Edit2, Save, X, Loader2 } from "lucide-react";
import { UserData } from "./Auth";
import { toast } from "sonner@2.0.3";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onUpdateUser: (user: UserData) => void;
  onLogout: () => void;
}

export function UserProfile({ isOpen, onClose, user, onUpdateUser, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedUser, setEditedUser] = useState<UserData>(user);

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const validatePincode = (pincode: string) => {
    return !pincode || /^\d{6}$/.test(pincode);
  };

  const handleSave = () => {
    if (!editedUser.name || !editedUser.email || !editedUser.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validatePhone(editedUser.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (editedUser.pincode && !validatePincode(editedUser.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      // Update in localStorage
      const storedUsers = JSON.parse(localStorage.getItem('moyoclub_users') || '{}');
      const userWithPassword = storedUsers[user.email];
      
      if (userWithPassword) {
        const updatedUser = { ...userWithPassword, ...editedUser };
        storedUsers[user.email] = updatedUser;
        localStorage.setItem('moyoclub_users', JSON.stringify(storedUsers));
        localStorage.setItem('moyoclub_current_user', JSON.stringify(editedUser));
      }

      onUpdateUser(editedUser);
      setIsEditing(false);
      setIsSaving(false);
      
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('moyoclub_current_user');
    onLogout();
    onClose();
    toast.success('Logged out successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">My Account</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Personal Information</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      style={{ backgroundColor: '#E87722' }}
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={editedUser.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Email</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Phone</Label>
                    {isEditing ? (
                      <Input
                        value={editedUser.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        maxLength={10}
                      />
                    ) : (
                      <div className="flex items-center gap-2 mt-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" style={{ color: '#E87722' }} />
                    Delivery Address
                  </h4>

                  <div>
                    <Label>Street Address</Label>
                    {isEditing ? (
                      <Input
                        value={editedUser.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="House/Flat No., Street Name"
                      />
                    ) : (
                      <p className="mt-2 text-sm text-gray-600">
                        {user.address || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>City</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.city || ''}
                          onChange={(e) => handleChange('city', e.target.value)}
                          placeholder="Mumbai"
                        />
                      ) : (
                        <p className="mt-2 text-sm text-gray-600">
                          {user.city || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>State</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.state || ''}
                          onChange={(e) => handleChange('state', e.target.value)}
                          placeholder="Maharashtra"
                        />
                      ) : (
                        <p className="mt-2 text-sm text-gray-600">
                          {user.state || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label>Pincode</Label>
                      {isEditing ? (
                        <Input
                          value={editedUser.pincode || ''}
                          onChange={(e) => handleChange('pincode', e.target.value)}
                          placeholder="400001"
                          maxLength={6}
                        />
                      ) : (
                        <p className="mt-2 text-sm text-gray-600">
                          {user.pincode || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" style={{ color: '#E87722' }} />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No orders yet</p>
                  <p className="text-sm mt-1">Start shopping to see your orders here</p>
                  <Button
                    className="mt-4"
                    style={{ backgroundColor: '#E87722' }}
                    onClick={() => {
                      onClose();
                      const productSection = document.getElementById('products');
                      productSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Browse Meals
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
