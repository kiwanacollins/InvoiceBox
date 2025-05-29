import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Invoice } from '../../types';
import { formatCurrency, formatDate, getStatusColorClass } from '../../utils/helpers';
import { ChevronRight } from 'lucide-react';

interface RecentInvoicesProps {
  invoices: Invoice[];
  viewAllLink: string;
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({ invoices, viewAllLink }) => {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Recent Invoices</CardTitle>
        <Link to={viewAllLink}>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            View all
            <ChevronRight size={16} />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <Link to={`/invoices/${invoice.id}`}>
                    <h3 className="font-medium hover:text-primary transition-colors">
                      {invoice.invoiceNumber}
                    </h3>
                  </Link>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {formatDate(invoice.issueDate)}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </div>
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mt-1 ${getStatusColorClass(
                      invoice.status
                    )}`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No invoices found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentInvoices;