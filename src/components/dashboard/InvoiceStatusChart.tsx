import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface InvoiceStatusChartProps {
  data: {
    paid: number;
    pending: number;
    partial: number;
    overdue: number;
  };
}

const InvoiceStatusChart: React.FC<InvoiceStatusChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Paid', 'Pending', 'Partial', 'Overdue'],
    datasets: [
      {
        data: [data.paid, data.pending, data.partial, data.overdue],
        backgroundColor: [
          '#10B981', // success
          '#F59E0B', // warning
          '#3B82F6', // primary
          '#EF4444', // error
        ],
        borderColor: [
          '#065F46', // success dark
          '#B45309', // warning dark
          '#1E40AF', // primary dark
          '#B91C1C', // error dark
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  const totalInvoices = Object.values(data).reduce((sum, value) => sum + value, 0);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-lg">Invoice Status Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-full max-w-[200px]">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold">{totalInvoices}</span>
            <span className="text-xs text-gray-500">Total Invoices</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 w-full mt-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Paid</span>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
              <span className="font-medium">{data.paid}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Pending</span>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
              <span className="font-medium">{data.pending}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Partial</span>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
              <span className="font-medium">{data.partial}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Overdue</span>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-error mr-2"></div>
              <span className="font-medium">{data.overdue}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceStatusChart;