import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { transactionType } from '../types/types';
import { format, startOfMonth, isAfter, subMonths } from 'date-fns';

interface ExpenseTrendChartProps {
  transactions: transactionType[];
  months?: number; // Number of months to display, defaults to 6
}

// Interface for aggregated monthly data
interface MonthlyData {
  month: string;
  monthDate?: Date; // Added to store the actual date for comparison
  total: number;
  [category: string]: number | string | Date | undefined;
}

const ExpenseTrendChart: React.FC<ExpenseTrendChartProps> = ({ 
  transactions, 
  months = 6 
}) => {
  // Custom theme colors for the chart
  const CHART_COLORS = {
    total: '#2E7D32', // Primary green from your theme
    grid: '#e0e0e0',
    tooltip: '#f5f5f5',
    categories: [
      '#4CAF50', // Light green
      '#1976D2', // Blue
      '#FF9800', // Orange
      '#9C27B0', // Purple
      '#F44336', // Red
      '#00BCD4', // Cyan
    ]
  };

  // Process transaction data into monthly aggregates
  const monthlyData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    // Get date for the start of current month
    const currentMonth = startOfMonth(new Date());
    
    // Create array of month start dates going back X months
    const monthStarts = Array.from({ length: months }, (_, i) => {
      return subMonths(currentMonth, i);
    }).reverse();
    
    // Initialize data structure with months and zero values
    const monthlyTotals: MonthlyData[] = monthStarts.map(date => {
      return {
        month: format(date, 'MMM yyyy'),
        monthDate: date, // Store the actual date for comparison
        total: 0,
        // We'll add categories dynamically
      };
    });

    // Get unique categories from transactions
    const categories = [...new Set(
      transactions
        .filter(t => t.category)
        .map(t => t.category as string)
    )];
    
    // Initialize category totals for each month
    monthlyTotals.forEach(month => {
      categories.forEach(category => {
        month[category] = 0;
      });
    });

    // Log month ranges for debugging
    console.log('Month ranges:', monthStarts.map(date => format(date, 'MMM yyyy')));

    // Aggregate transaction amounts by month and category
    transactions.forEach(transaction => {
      if (!transaction.date || !transaction.amount) return;
      
      const transactionDate = transaction.date instanceof Date
        ? transaction.date
        : new Date(transaction.date);
      
      console.log('Processing transaction:', {
        name: transaction.name,
        date: format(transactionDate, 'yyyy-MM-dd'),
        amount: transaction.amount
      });
      
      // Get the start of the month for the transaction
      const transactionMonth = startOfMonth(transactionDate);
      
      // Find which month bucket this transaction belongs to
      // by comparing year and month directly
      const monthIndex = monthlyTotals.findIndex(entry => {
        const entryDate = entry.monthDate as Date;
        return entryDate.getFullYear() === transactionMonth.getFullYear() && 
               entryDate.getMonth() === transactionMonth.getMonth();
      });
      
      console.log('Found month index:', monthIndex, 
                 monthIndex >= 0 ? format(monthlyTotals[monthIndex].monthDate as Date, 'MMM yyyy') : 'none');
      
      if (monthIndex >= 0 && monthIndex < monthlyTotals.length) {
        const amount = parseFloat(transaction.amount.toString());
        
        // Add to total
        monthlyTotals[monthIndex].total += amount;
        
        // Add to category if it exists
        if (transaction.category) {
          const category = transaction.category as string;
          monthlyTotals[monthIndex][category] = 
            (monthlyTotals[monthIndex][category] as number || 0) + amount;
        }
      }
    });

    return monthlyTotals;
  }, [transactions, months]);

  // Get the top 5 categories by total amount
  const topCategories = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const categoryTotals: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      if (!transaction.category || !transaction.amount) return;
      
      const category = transaction.category;
      const amount = parseFloat(transaction.amount.toString());
      
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
    
    // Sort categories by total amount and get top 5
    return Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category]) => category);
  }, [transactions]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null;
    }
    
    return (
      <div className="expense-chart-tooltip">
        <p className="tooltip-label">{label}</p>
        <div className="tooltip-content">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="tooltip-item">
              <div 
                className="color-indicator" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="name">{entry.name}: </span>
              <span className="value">${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // If no data, show a placeholder
  if (monthlyData.length === 0) {
    return (
      <div className="expense-chart-placeholder">
        <p>Add expenses over time to see your spending trends</p>
      </div>
    );
  }

  return (
    <div className="expense-trend-chart">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={monthlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#757575' }}
            tickLine={{ stroke: '#757575' }}
          />
          <YAxis 
            tick={{ fill: '#757575' }}
            tickLine={{ stroke: '#757575' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {/* Line for total expenses */}
          <Line
            type="monotone"
            dataKey="total"
            name="Total Expenses"
            stroke={CHART_COLORS.total}
            strokeWidth={3}
            dot={{ r: 4, fill: CHART_COLORS.total }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1500}
          />
          
          {/* Lines for top categories */}
          {topCategories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              name={category}
              stroke={CHART_COLORS.categories[index % CHART_COLORS.categories.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              strokeDasharray="5 5"
              isAnimationActive={true}
              animationDuration={1500}
              animationBegin={300 + index * 150}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseTrendChart;