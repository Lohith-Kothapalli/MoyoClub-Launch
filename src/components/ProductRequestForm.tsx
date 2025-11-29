import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Lightbulb, CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";

export interface ProductRequest {
  id: string;
  corporateId: string;
  companyName: string;
  productName: string;
  category: string;
  description: string;
  estimatedQuantity: number;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  requestDate: string;
  responseMessage?: string;
}

interface ProductRequestFormProps {
  corporateId: string;
  companyName: string;
}

export function ProductRequestForm({ corporateId, companyName }: ProductRequestFormProps) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing requests
  const [requests, setRequests] = useState<ProductRequest[]>(() => {
    const stored = localStorage.getItem('moyoclub_product_requests');
    if (stored) {
      const allRequests = JSON.parse(stored);
      return allRequests.filter((req: ProductRequest) => req.corporateId === corporateId);
    }
    return [];
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const newRequest: ProductRequest = {
      id: `req_${Date.now()}`,
      corporateId,
      companyName,
      productName,
      category,
      description,
      estimatedQuantity: parseInt(estimatedQuantity),
      urgency,
      status: 'pending',
      requestDate: new Date().toISOString()
    };

    // Save to localStorage
    const allRequests = JSON.parse(localStorage.getItem('moyoclub_product_requests') || '[]');
    allRequests.push(newRequest);
    localStorage.setItem('moyoclub_product_requests', JSON.stringify(allRequests));

    // Update local state
    setRequests(prev => [newRequest, ...prev]);

    // Reset form
    setProductName('');
    setCategory('');
    setDescription('');
    setEstimatedQuantity('');
    setUrgency('medium');

    toast.success('Product request submitted!', {
      description: 'Our team will review and respond within 48 hours'
    });

    setIsSubmitting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under-review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'under-review':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6" style={{ color: '#E87722' }} />
            <div>
              <CardTitle>Request New Products</CardTitle>
              <CardDescription>
                Can't find what you need? Let us know and we'll source it for you
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  placeholder="e.g., Quinoa Salad Bowl"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  placeholder="e.g., Salads, Breakfast, Snacks"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Please describe the product, ingredients, dietary requirements, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Estimated Monthly Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                  value={estimatedQuantity}
                  onChange={(e) => setEstimatedQuantity(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={urgency === 'low' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUrgency('low')}
                    className={urgency === 'low' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    Low
                  </Button>
                  <Button
                    type="button"
                    variant={urgency === 'medium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUrgency('medium')}
                    style={urgency === 'medium' ? { backgroundColor: '#E87722' } : {}}
                  >
                    Medium
                  </Button>
                  <Button
                    type="button"
                    variant={urgency === 'high' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setUrgency('high')}
                    className={urgency === 'high' ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    High
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#E87722' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Product Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Product Requests</CardTitle>
          <CardDescription>Track the status of your custom product requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No product requests yet</p>
              <p className="text-sm">Submit a request above to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{request.productName}</h4>
                      <p className="text-sm text-gray-600">{request.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                      <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                        {getStatusIcon(request.status)}
                        {request.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{request.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Qty: {request.estimatedQuantity}/month</span>
                    <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                  </div>

                  {request.responseMessage && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Response:</strong> {request.responseMessage}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
