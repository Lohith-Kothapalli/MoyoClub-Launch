import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
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
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { InventoryItem } from "./InventoryManagement";

interface BulkInventoryUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (items: InventoryItem[]) => void;
}

interface CSVRow {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  weeklyPrice: string;
  biweeklyPrice: string;
  monthlyPrice: string;
  farmSource: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  tags: string;
  stock: string;
  reorderLevel: string;
  image?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  row: number;
  data?: InventoryItem;
}

export function BulkInventoryUpload({ isOpen, onClose, onUploadComplete }: BulkInventoryUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ValidationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file');
        return;
      }
      setUploadedFile(file);
      parseCSVFile(file);
    }
  };

  const parseCSVFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const results = parseCSV(text);
      setParsedData(results);
      setIsProcessing(false);

      const validCount = results.filter(r => r.valid).length;
      const invalidCount = results.filter(r => !r.valid).length;

      if (invalidCount === 0) {
        toast.success(`Successfully parsed ${validCount} products`, {
          description: 'Ready to import',
        });
      } else {
        toast.warning(`Parsed with issues`, {
          description: `${validCount} valid, ${invalidCount} invalid rows`,
        });
      }
    };

    reader.onerror = () => {
      toast.error('Error reading file');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const parseCSV = (text: string): ValidationResult[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      return [{
        valid: false,
        errors: ['File is empty or has no data rows'],
        row: 0
      }];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const results: ValidationResult[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });

      const validation = validateRow(row as CSVRow, i + 1);
      results.push(validation);
    }

    return results;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    
    return result;
  };

  const validateRow = (row: CSVRow, rowNumber: number): ValidationResult => {
    const errors: string[] = [];

    // Required fields
    if (!row.id) errors.push('ID is required');
    if (!row.name) errors.push('Name is required');
    if (!row.description) errors.push('Description is required');
    if (!row.basePrice) errors.push('Base Price is required');
    if (!row.farmSource) errors.push('Farm Source is required');
    if (!row.stock) errors.push('Stock is required');

    // Numeric validations
    const basePrice = parseFloat(row.basePrice);
    if (isNaN(basePrice) || basePrice < 0) {
      errors.push('Base Price must be a positive number');
    }

    const weeklyPrice = parseFloat(row.weeklyPrice || row.basePrice);
    const biweeklyPrice = parseFloat(row.biweeklyPrice || row.basePrice);
    const monthlyPrice = parseFloat(row.monthlyPrice || row.basePrice);

    if (isNaN(weeklyPrice) || isNaN(biweeklyPrice) || isNaN(monthlyPrice)) {
      errors.push('Pricing must be valid numbers');
    }

    const stock = parseInt(row.stock);
    if (isNaN(stock) || stock < 0) {
      errors.push('Stock must be a non-negative number');
    }

    const reorderLevel = parseInt(row.reorderLevel || '20');
    if (isNaN(reorderLevel) || reorderLevel < 0) {
      errors.push('Reorder Level must be a non-negative number');
    }

    // Nutrition validations
    const calories = parseInt(row.calories || '0');
    const protein = parseInt(row.protein || '0');
    const carbs = parseInt(row.carbs || '0');
    const fat = parseInt(row.fat || '0');

    if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
      errors.push('Nutrition values must be numbers');
    }

    if (errors.length > 0) {
      return { valid: false, errors, row: rowNumber };
    }

    // Create valid inventory item
    const item: InventoryItem = {
      id: row.id.trim(),
      name: row.name.trim(),
      description: row.description.trim(),
      basePrice: basePrice,
      pricing: {
        weekly: weeklyPrice,
        biweekly: biweeklyPrice,
        monthly: monthlyPrice
      },
      image: row.image?.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      farmSource: row.farmSource.trim(),
      nutrition: {
        calories,
        protein,
        carbs,
        fat
      },
      tags: row.tags ? row.tags.split('|').map(t => t.trim()) : [],
      stock,
      reorderLevel,
      lastUpdated: new Date().toISOString()
    };

    return { valid: true, errors: [], row: rowNumber, data: item };
  };

  const handleImport = () => {
    const validItems = parsedData
      .filter(result => result.valid && result.data)
      .map(result => result.data!);

    if (validItems.length === 0) {
      toast.error('No valid items to import');
      return;
    }

    onUploadComplete(validItems);
    handleClose();

    toast.success('Bulk upload successful!', {
      description: `Imported ${validItems.length} products`,
    });
  };

  const downloadTemplate = () => {
    const template = `id,name,description,basePrice,weeklyPrice,biweeklyPrice,monthlyPrice,farmSource,calories,protein,carbs,fat,tags,stock,reorderLevel,image
meal-001,Grilled Chicken Bowl,"High-protein meal with grilled chicken, quinoa, and fresh vegetables",299,249,269,289,Green Valley Farm,450,35,45,12,High Protein|Lean,50,20,https://images.unsplash.com/photo-1546069901-ba9599a7e63c
meal-002,Vegan Buddha Bowl,"Nutritious plant-based bowl with chickpeas, avocado, and mixed greens",279,229,249,269,Organic Farms,380,15,52,14,Vegan|Plant Based,75,20,https://images.unsplash.com/photo-1512621776951-a57141f2eefd
meal-003,Salmon Power Bowl,"Omega-3 rich salmon with quinoa and roasted vegetables",349,299,319,339,Ocean Fresh Farms,520,42,38,22,High Protein|Omega-3,30,15,https://images.unsplash.com/photo-1473093295043-cdd812d0e601`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Template downloaded', {
      description: 'Use this template to prepare your bulk upload',
    });
  };

  const handleClose = () => {
    setUploadedFile(null);
    setParsedData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const getStats = () => {
    const total = parsedData.length;
    const valid = parsedData.filter(r => r.valid).length;
    const invalid = parsedData.filter(r => !r.valid).length;
    return { total, valid, invalid };
  };

  const stats = getStats();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Upload className="h-6 w-6" style={{ color: '#E87722' }} />
            Bulk Inventory Upload
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="text-blue-900">
                  <strong>How to use bulk upload:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
                  <li>Download the CSV template</li>
                  <li>Fill in your product data (use Excel, Google Sheets, or text editor)</li>
                  <li>Save as CSV file</li>
                  <li>Upload the file below</li>
                  <li>Review validation results</li>
                  <li>Click Import to add products</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Template Download */}
          <div>
            <Label>Step 1: Download Template</Label>
            <div className="mt-2">
              <Button
                variant="outline"
                onClick={downloadTemplate}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Template includes sample data and all required columns
              </p>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <Label>Step 2: Upload Your CSV File</Label>
            <div className="mt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Choose CSV File
                </Button>
                {uploadedFile && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
                    <FileSpreadsheet className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{uploadedFile.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Validation Results */}
          {parsedData.length > 0 && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl mb-1" style={{ color: '#E87722' }}>{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Rows</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl text-green-600 mb-1">{stats.valid}</div>
                    <div className="text-sm text-gray-600">Valid Products</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl text-red-600 mb-1">{stats.invalid}</div>
                    <div className="text-sm text-gray-600">Invalid Rows</div>
                  </CardContent>
                </Card>
              </div>

              {/* Validation Table */}
              <div>
                <Label>Step 3: Review Validation Results</Label>
                <div className="mt-2 border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Issues</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{result.row}</TableCell>
                          <TableCell>
                            {result.valid ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Valid
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800">
                                <XCircle className="h-3 w-3 mr-1" />
                                Invalid
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {result.data?.name || 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {result.data?.id || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {result.errors.length > 0 ? (
                              <div className="space-y-1">
                                {result.errors.map((error, i) => (
                                  <p key={i} className="text-xs text-red-600">
                                    • {error}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-green-600">No issues</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Warning for invalid rows */}
              {stats.invalid > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
                      <div>
                        <h4 className="text-sm text-yellow-900 mb-1">Validation Warnings</h4>
                        <p className="text-sm text-yellow-700">
                          {stats.invalid} rows have validation errors and will be skipped. 
                          Only {stats.valid} valid products will be imported.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            style={{ backgroundColor: '#E87722' }}
            onClick={handleImport}
            disabled={stats.valid === 0 || isProcessing}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import {stats.valid} Products
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
