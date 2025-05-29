import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useInvoiceStore } from '../../stores/invoiceStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/helpers';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createInvoice } = useInvoiceStore();
  
  // Form state
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserId, setPurchaserId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'UGX' | 'LYD'>('USD');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.1; // 10% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: '',
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    setItems([...items, newItem]);
  };

  // Update item
  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = [...items];
    const item = { ...updatedItems[index] };
    
    if (field === 'quantity' || field === 'unitPrice') {
      item[field] = Number(value);
      item.amount = item.quantity * item.unitPrice;
    } else {
      item[field as 'description'] = value as string;
    }
    
    updatedItems[index] = item;
    setItems(updatedItems);
  };

  // Remove item
  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!user) {
      setError('You must be logged in to create an invoice');
      return;
    }
    
    if (items.length === 0) {
      setError('Please add at least one item to the invoice');
      return;
    }
    
    if (!purchaserName || !purchaserId || !dueDate) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      const invoice = await createInvoice({
        providerId: user.id,
        providerName: user.name,
        purchaserId,
        purchaserName,
        issueDate,
        dueDate,
        items,
        subtotal,
        tax,
        total,
        currency,
        notes,
      });
      
      // Show success message
      setSuccess(`Invoice ${invoice.invoiceNumber} has been created successfully!`);
      
      // Clear form after a short delay and navigate
      setTimeout(() => {
        navigate(`/invoices/${invoice.id}`);
      }, 1500);
      
    } catch (error) {
      setError('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            className="mr-4"
            onClick={() => navigate('/invoices')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Invoice</h1>
            <p className="text-gray-500">Create a new invoice for your customer</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-error/10 border border-error/20 text-error rounded-lg p-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-success/10 border border-success/20 text-success-700 rounded-lg p-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Purchaser Name"
                    value={purchaserName}
                    onChange={(e) => setPurchaserName(e.target.value)}
                    required
                  />
                  <Input
                    label="Purchaser ID"
                    value={purchaserId}
                    onChange={(e) => setPurchaserId(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Issue Date"
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                  />
                  <Input
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                  <Select
                    label="Currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as 'USD' | 'UGX' | 'LYD')}
                    options={[
                      { value: 'USD', label: 'US Dollar (USD)' },
                      { value: 'UGX', label: 'Uganda Shilling (UGX)' },
                      { value: 'LYD', label: 'Libyan Dinar (LYD)' },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-12 sm:col-span-4">
                        <Input
                          label={index === 0 ? "Description" : ""}
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Input
                          label={index === 0 ? "Quantity" : ""}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Input
                          label={index === 0 ? "Unit Price" : ""}
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-3">
                        <div className={index === 0 ? "mt-8" : ""}>
                          <div className="h-10 flex items-center">
                            {formatCurrency(item.amount, currency)}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <div className={index === 0 ? "mt-8" : ""}>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-error hover:text-error-600"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addItem}
                  >
                    <Plus size={16} className="mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full h-32 rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or payment instructions..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Invoice Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (10%)</span>
                  <span>{formatCurrency(tax, currency)}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">{formatCurrency(total, currency)}</span>
                </div>
                
                <Button
                  type="submit"
                  className="w-full mt-6"
                  loading={loading}
                >
                  Create Invoice
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;