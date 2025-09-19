import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'cyan' | 'purple' | 'orange' | 'green' | 'red';
  subtitle?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'cyan',
  subtitle
}) => {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400'
  };

  return (
    <div className={`
      bg-gradient-to-br ${colorClasses[color]} border
      backdrop-blur-sm rounded-xl p-6
      hover:scale-105 transition-transform duration-200
    `}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8" />
        {trend && (
          <span className="text-sm font-medium">
            {trend}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-white text-2xl font-bold">
          {value}
        </h3>
        <p className="text-gray-300 text-sm">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs opacity-75">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusCard;