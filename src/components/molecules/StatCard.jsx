import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const colors = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    success: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    error: 'text-red-600 bg-red-100'
  };

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-surface-900">{value}</p>
          
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className={trend === 'up' ? 'text-green-500' : 'text-red-500'} 
              />
              <span className={`text-sm ml-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;