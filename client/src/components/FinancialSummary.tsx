// src/components/FinancialSummary.tsx
import React from 'react';
import { transactionType } from '../types/types';
import './FinancialSummary.css';

interface FinancialSummaryProps {
  transactions: transactionType[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions }) => {
  // Calculate total income (positive transactions)
  const isIncome = (t: transactionType) => {
    return t.category === 'Income' || t.notes?.includes('INCOME:');
  };

  const totalIncome = transactions
    .filter(t => isIncome(t))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount?.toString() || "0")), 0);
  
  // Calculate total expenses (negative transactions)
  const totalExpenses = transactions
    .filter(t => !isIncome(t))
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount?.toString() || "0")), 0);
  // Calculate net balance
  const balance = totalIncome - totalExpenses;
  
  // Last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Filter for recent transactions
  const recentTransactions = transactions.filter(t => {
    const transactionDate = t.date instanceof Date 
      ? t.date 
      : new Date(t.date || 0);
    
    return transactionDate >= thirtyDaysAgo;
  });
  
  // Calculate recent income

  // Calculate recent expenses
  const recentExpenses = recentTransactions
    .filter(t => parseFloat(t.amount?.toString() || "0") < 0 && t.category !== 'Income')
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount?.toString() || "0")), 0);
  
  // Calculate savings rate (as a percentage of income)
  const savingsRate = recentIncome > 0 
    ? ((recentIncome - recentExpenses) / recentIncome * 100)
    : 0;
    
  return (
    <div className="financial-summary">
      <div className="summary-section">
        <h3>Overall Summary</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Total Income:</span>
            <span className="stat-value positive">${totalIncome.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Expenses:</span>
            <span className="stat-value negative">${totalExpenses.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Net Balance:</span>
            <span className={`stat-value ${balance >= 0 ? 'positive' : 'negative'}`}>
              ${balance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="summary-section">
        <h3>Last 30 Days</h3>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Recent Income:</span>
            <span className="stat-value positive">${recentIncome.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Recent Expenses:</span>
            <span className="stat-value negative">${recentExpenses.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Savings Rate:</span>
            <span className="stat-value">
              {savingsRate.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;