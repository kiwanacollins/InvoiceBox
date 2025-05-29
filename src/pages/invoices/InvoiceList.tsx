import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useInvoiceStore } from '../../stores/invoiceStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Invoice } from '../../types';

const InvoiceList: React.FC = () => {
  const { user } = useAuthStore();
  const { invoices, fetchInvoices } = useInvoiceStore();
  
  // Filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Invoice>('issueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Load invoices
  useEffect(() => {
    if (user) {
      fetchInvoices(user.id, user.role);
    }
  }, [user, fetchInvoices]);
  
  // Apply filters and sorting
  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => {
        // Apply search term filter
        const searchLower = searchTerm.toLowerCase();
        return (
          searchTerm === '' ||
          invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
          (user?.role === 'provider' 
            ? invoice.purchaserName.toLowerCase().includes(searchLower)
            : invoice.providerName.toLowerCase().includes(searchLower)
          )
        );
      })
      .filter(invoice => {
        // Apply status filter
        if (statusFilter === 'all') return true;
        return invoice.status === statusFilter;
      })
      .sort((a, b) => {
        // Apply sorting
        const fieldA = a[sortField];
        const fieldB = b[sortField];
        
        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return sortDirection === 'asc'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }
        
        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
          return sortDirection === 'asc'
            ? fieldA - fieldB
            : fieldB - fieldA;
        }
        
        // Default sort for dates
        const dateA = new Date(a.issueDate).getTime();
        const dateB = new Date(b.issueDate).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [invoices, searchTerm, statusFilter, sortField, sortDirection, user]);
  
  // Pagination logic
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInvoices, currentPage]);
  
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  
  // Handle sort toggle
  const handleSort = (field: keyof Invoice) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-gray-500">Manage your invoices</p>
        </div>
        
        {user?.role === 'provider' && (
          <Link to="/invoices/create">
            <Button className="mt-4 sm:mt-0">
              <Plus size={16} className="mr-2" />
              Create Invoice
            </Button>
          </Link>
        )}
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <Select
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'paid', label: 'Paid' },
                { value: 'pending', label: 'Pending' },
                { value: 'partial', label: 'Partial' },
                { value: 'overdue', label: 'Overdue' },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
          
          <div>
            <Button variant="outline">
              <Filter size={16} className="mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </div>
      
      {/* Invoice Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {paginatedInvoices.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('invoiceNumber')}
                      >
                        Invoice Number
                        <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      {user?.role === 'provider' ? 'Purchaser' : 'Provider'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('issueDate')}
                      >
                        Issue Date
                        <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                      </button>
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      <button 
                        className="flex items-center"
                        onClick={() => handleSort('dueDate')}
                      >
                        Due Date
                        <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                      </button>
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">
                      <button 
                        className="flex items-center ml-auto"
                        onClick={() => handleSort('total')}
                      >
                        Total
                        <ArrowUpDown size={14} className="ml-1 text-gray-400" />
                      </button>
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <FileText size={16} className="text-gray-400 mr-2" />
                          <Link 
                            to={`/invoices/${invoice.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {invoice.invoiceNumber}
                          </Link>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-800">
                        {user?.role === 'provider' ? invoice.purchaserName : invoice.providerName}
                      </td>
                      <td className="py-3 px-4 text-gray-800">{formatDate(invoice.issueDate)}</td>
                      <td className="py-3 px-4 text-gray-800">{formatDate(invoice.dueDate)}</td>
                      <td className="py-3 px-4 text-gray-800 text-right">
                        {formatCurrency(invoice.total, invoice.currency)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              invoice.status === 'paid'
                                ? 'bg-success/10 text-success-700'
                                : invoice.status === 'partial'
                                ? 'bg-primary/10 text-primary-700'
                                : invoice.status === 'pending'
                                ? 'bg-secondary/10 text-secondary-700'
                                : 'bg-error/10 text-error-700'
                            }`}
                          >
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link 
                          to={`/invoices/${invoice.id}`}
                          className="text-sm text-primary font-medium hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredInvoices.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredInvoices.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-l-md"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                        className="hidden md:inline-flex"
                      >
                        {i + 1}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-r-md"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results'
                : user?.role === 'provider'
                ? 'Create your first invoice to get started'
                : 'You have no invoices yet'}
            </p>
            {user?.role === 'provider' && !searchTerm && statusFilter === 'all' && (
              <div className="mt-6">
                <Link to="/invoices/create">
                  <Button>
                    <Plus size={16} className="mr-2" />
                    Create Invoice
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;