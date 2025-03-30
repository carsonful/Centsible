// src/components/PersonalExpenseChart.tsx
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { transactionType } from '../types/types';

// Colors for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface PersonalExpenseChartProps {
  transactions: transactionType[];
}

const PersonalExpenseChart: React.FC<PersonalExpenseChartProps> = ({ transactions }) => {
  // Group transactions by category and prepare data for chart
  const categoryData = useMemo(() => {
    // Group transactions by category and sum amounts
    const categoryMap = new Map<string, number>();
    
    // Filter to only include expense transactions based on category
    const expenseTransactions = transactions.filter(t => {
      // Check if it's an expense (not income category and/or notes)
      const isExpenseCategory = t.category !== 'Income';
      const isExpenseNote = t.notes?.includes('EXPENSE:') || !t.notes?.includes('INCOME:');
      return isExpenseCategory && isExpenseNote;
    });
    
    expenseTransactions.forEach(transaction => {
      if (transaction.category) {
        const category = transaction.category;
        // Use absolute value for chart display
        const amount = Math.abs(parseFloat(transaction.amount?.toString() || "0"));
        
        const currentAmount = categoryMap.get(category) || 0;
        categoryMap.set(category, currentAmount + amount);
      }
    });
    
    // Convert map to array for the pie chart
    return Array.from(categoryMap, ([name, value]) => ({ name, value }));
  }, [transactions]); 

  // If no transactions, show a message
  if (transactions.length === 0) {
    return (
      <div className="empty-chart-message">
        Add transactions to see your spending breakdown
      </div>
    );
  }

  // If no expense transactions, show a message
  if (categoryData.length === 0) {
    return (
      <div className="empty-chart-message">
        Add expense transactions to see your spending breakdown
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PersonalExpenseChart;