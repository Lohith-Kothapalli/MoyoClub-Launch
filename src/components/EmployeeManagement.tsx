import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Users, UserPlus, Trash2, Mail, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export interface Employee {
  id: string;
  corporateId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: 'active' | 'inactive';
  mealsAllocated: number;
  mealsConsumed: number;
  joinedDate: string;
}

interface EmployeeManagementProps {
  corporateId: string;
  companyName: string;
}

export function EmployeeManagement({ corporateId, companyName }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const stored = localStorage.getItem('moyoclub_employees');
    if (stored) {
      const allEmployees = JSON.parse(stored);
      return allEmployees.filter((emp: Employee) => emp.corporateId === corporateId);
    }
    return [];
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [mealsAllocated, setMealsAllocated] = useState('20');

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();

    const newEmployee: Employee = {
      id: `emp_${Date.now()}`,
      corporateId,
      name,
      email,
      phone,
      department,
      status: 'active',
      mealsAllocated: parseInt(mealsAllocated),
      mealsConsumed: 0,
      joinedDate: new Date().toISOString()
    };

    // Save to localStorage
    const allEmployees = JSON.parse(localStorage.getItem('moyoclub_employees') || '[]');
    allEmployees.push(newEmployee);
    localStorage.setItem('moyoclub_employees', JSON.stringify(allEmployees));

    setEmployees(prev => [...prev, newEmployee]);

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setDepartment('');
    setMealsAllocated('20');
    setIsAddDialogOpen(false);

    toast.success('Employee added successfully!', {
      description: `${newEmployee.name} can now access the meal program`
    });
  };

  const handleRemoveEmployee = (employeeId: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;

    const allEmployees = JSON.parse(localStorage.getItem('moyoclub_employees') || '[]');
    const filtered = allEmployees.filter((emp: Employee) => emp.id !== employeeId);
    localStorage.setItem('moyoclub_employees', JSON.stringify(filtered));

    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    toast.success('Employee removed from program');
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      
      // Skip header row
      const dataLines = lines.slice(1);
      const newEmployees: Employee[] = [];

      dataLines.forEach(line => {
        const [name, email, phone, department, mealsAllocated] = line.split(',').map(s => s.trim());
        
        if (name && email) {
          newEmployees.push({
            id: `emp_${Date.now()}_${Math.random()}`,
            corporateId,
            name,
            email,
            phone: phone || '',
            department: department || 'General',
            status: 'active',
            mealsAllocated: parseInt(mealsAllocated) || 20,
            mealsConsumed: 0,
            joinedDate: new Date().toISOString()
          });
        }
      });

      if (newEmployees.length > 0) {
        const allEmployees = JSON.parse(localStorage.getItem('moyoclub_employees') || '[]');
        allEmployees.push(...newEmployees);
        localStorage.setItem('moyoclub_employees', JSON.stringify(allEmployees));

        setEmployees(prev => [...prev, ...newEmployees]);
        toast.success(`${newEmployees.length} employees added successfully!`);
        setIsBulkUploadOpen(false);
      }
    };

    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csv = 'Name,Email,Phone,Department,MealsAllocated\nJohn Doe,john@company.com,+91 98765 43210,Engineering,20\nJane Smith,jane@company.com,+91 98765 43211,Marketing,20';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_template.csv';
    a.click();
  };

  const totalMealsAllocated = employees.reduce((sum, emp) => sum + emp.mealsAllocated, 0);
  const totalMealsConsumed = employees.reduce((sum, emp) => sum + emp.mealsConsumed, 0);
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl mt-1">{employees.length}</p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl mt-1">{activeEmployees}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meals Allocated</p>
                <p className="text-2xl mt-1">{totalMealsAllocated}</p>
              </div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE8D6', color: '#E87722' }}>
                <span className="text-sm">📦</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Meals Consumed</p>
                <p className="text-2xl mt-1">{totalMealsConsumed}</p>
              </div>
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE8D6', color: '#E87722' }}>
                <span className="text-sm">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Manage meal allocations for your team</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBulkUploadOpen(true)}
              >
                Bulk Upload
              </Button>
              <Button
                style={{ backgroundColor: '#E87722' }}
                onClick={() => setIsAddDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg mb-2">No employees added yet</h3>
              <p className="text-gray-600 mb-4">Start by adding employees to your meal program</p>
              <Button
                style={{ backgroundColor: '#E87722' }}
                onClick={() => setIsAddDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Employee
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Meals Allocated</TableHead>
                    <TableHead className="text-right">Consumed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#A67C52' }}>
                            {employee.name.charAt(0)}
                          </div>
                          <span>{employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{employee.email}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <Badge className={employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{employee.mealsAllocated}</TableCell>
                      <TableCell className="text-right">{employee.mealsConsumed}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmployee(employee.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>Add a new employee to the meal program</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEmployee} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emp-name">Full Name *</Label>
              <Input
                id="emp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-email">Email *</Label>
              <Input
                id="emp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-phone">Phone Number</Label>
              <Input
                id="emp-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-dept">Department *</Label>
              <Input
                id="emp-dept"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emp-meals">Monthly Meals Allocated *</Label>
              <Input
                id="emp-meals"
                type="number"
                min="1"
                value={mealsAllocated}
                onChange={(e) => setMealsAllocated(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" style={{ backgroundColor: '#E87722' }}>
              Add Employee
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Upload Employees</DialogTitle>
            <DialogDescription>Upload a CSV file with employee information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-sm mb-2">CSV Format:</h4>
              <p className="text-xs text-gray-600 mb-3">
                Name, Email, Phone, Department, MealsAllocated
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="w-full"
              >
                Download Template CSV
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csv-upload">Upload CSV File</Label>
              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
