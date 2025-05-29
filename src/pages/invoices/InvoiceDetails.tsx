import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Printer } from 'lucide-react';
import { useInvoiceStore } from '../../stores/invoiceStore';
import { formatCurrency, formatDate, getStatusColorClass } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchInvoiceById, currentInvoice, payments, getInvoicePayments } = useInvoiceStore();

  useEffect(() => {
    if (id) {
      fetchInvoiceById(id);
    }
  }, [id, fetchInvoiceById]);

  if (!currentInvoice) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
          <p className="text-gray-500 mb-4">The invoice you're looking for doesn't exist.</p>
          <Link to="/invoices">
            <Button variant="outline">
              <ArrowLeft size={16} className="mr-2" />
              Back to Invoices
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const invoicePayments = getInvoicePayments(currentInvoice.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link to="/invoices" className="mr-4">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Invoice {currentInvoice.invoiceNumber}</h1>
            <p className="text-gray-500">View invoice details and payment history</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Information */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Invoice Number</h3>
                  <p className="mt-1">{currentInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColorClass(currentInvoice.status)}`}>
                    {currentInvoice.status.charAt(0).toUpperCase() + currentInvoice.status.slice(1)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Issue Date</h3>
                  <p className="mt-1">{formatDate(currentInvoice.issueDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
                  <p className="mt-1">{formatDate(currentInvoice.dueDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Provider</h3>
                  <p className="mt-1">{currentInvoice.providerName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Purchaser</h3>
                  <p className="mt-1">{currentInvoice.purchaserName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Quantity</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Unit Price</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentInvoice.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-right">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.unitPrice, currentInvoice.currency)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {formatCurrency(item.amount, currentInvoice.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">Subtotal</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(currentInvoice.subtotal, currentInvoice.currency)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">Tax</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(currentInvoice.tax, currentInvoice.currency)}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-gray-200">
                      <td colSpan={3} className="py-3 px-4 text-right font-medium">Total</td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(currentInvoice.total, currentInvoice.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {invoicePayments.length > 0 ? (
                <div className="space-y-4">
                  {invoicePayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount, payment.currency)}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(payment.paymentDate)} • {payment.paymentMethod.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Reference</p>
                        <p className="font-medium">{payment.reference}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>No payments recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-medium">
                      {formatCurrency(currentInvoice.total, currentInvoice.currency)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-medium">
                      {formatCurrency(currentInvoice.amountPaid, currentInvoice.currency)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success rounded-full" 
                      style={{ 
                        width: `${(currentInvoice.amountPaid / currentInvoice.total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Balance Due</span>
                    <span className="font-medium">
                      {formatCurrency(currentInvoice.balance, currentInvoice.currency)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-error rounded-full" 
                      style={{ 
                        width: `${(currentInvoice.balance / currentInvoice.total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Button className="w-full">Record Payment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;