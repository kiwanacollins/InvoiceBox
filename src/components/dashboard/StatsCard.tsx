import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    positive: boolean;
  };
  bgClass?: string;
  textClass?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  bgClass = 'bg-primary/10',
  textClass = 'text-primary-700',
}) => {
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h4 className="text-2xl font-bold mt-1">{value}</h4>
            
            {change && (
              <div className="flex items-center mt-2">
                <span
                  className={cn(
                    'text-xs font-medium',
                    change.positive ? 'text-success-600' : 'text-error-600'
                  )}
                >
                  {change.positive ? '↑' : '↓'} {change.value}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs. last month</span>
              </div>
            )}
          </div>
          
          <div className={cn('p-3 rounded-full', bgClass)}>
            <div className={cn('w-6 h-6', textClass)}>{icon}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;