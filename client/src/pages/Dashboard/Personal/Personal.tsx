// src/pages/Dashboard/Personal/Personal.tsx
import React, { useState, useEffect } from 'react';
import './Personal.css';
import AddTransactionButton from '../../../components/AddTransaction';
import { usertype, transactionType } from '../../../types/types';
import { getUserTransactions } from '../../../firebase/firebase';
import { useUser } from '@clerk/clerk-react';
import PersonalExpenseChart from '../../../components/PersonalExpenseChart';
import RecentTransactions from '../../../components/RecentTransactions';
import { formatDate } from '../utils/utils';
import FinancialSummary from '../../../components/FinancialSummary';

// Helper function to calculate summary data
// Helper function to calculate summary data
const calculateSummary = (transactions: transactionType[]) => {
  // Last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Filter for recent transactions
  const recentTransactions = transactions.filter(t => {
    // Make sure transaction.date is a Date object
    const transactionDate = t.date instanceof Date 
      ? t.date 
      : new Date(t.date || 0);
    
    return transactionDate >= thirtyDaysAgo;
  });
  
  // Calculate total balance
  const totalBalance = transactions.reduce((sum, t) => {
    return sum + parseFloat(t.amount?.toString() || "0");
  }, 0);
  
  // Calculate monthly income (positive transactions)
  const monthlyIncome = recentTransactions
    .filter(t => parseFloat(t.amount?.toString() || "0") > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount?.toString() || "0"), 0);
  
  // Calculate monthly expenses (negative transactions)
  const monthlyExpenses = recentTransactions
    .filter(t => parseFloat(t.amount?.toString() || "0") < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount?.toString() || "0")), 0);
  
  // Calculate savings rate
  const savingsRate = monthlyIncome > 0 
    ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 
    : 0;
  
  return {
    totalBalance: totalBalance.toFixed(2),
    monthlyIncome: monthlyIncome.toFixed(2),
    monthlyExpenses: monthlyExpenses.toFixed(2),
    savingsRate: savingsRate.toFixed(0)
  };
};

interface PersonalProps {
  userId: string | undefined;
}

const Personal: React.FC<PersonalProps> = ({ userId }) => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user's transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      
      try {
        const userTransactions = await getUserTransactions(userId);
        setTransactions(userTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load your transactions");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, [userId]);
  
  // Calculate summary data for the cards
  const summary = calculateSummary(transactions);
  
  // Format summary data for display
  const summaryData = [
    { 
      title: 'Total Balance', 
      value: `$${summary.totalBalance}`, 
      trend: '+5.25%', // This would ideally be calculated comparing to previous period
      positive: true 
    },
    { 
      title: 'Monthly Income', 
      value: `$${summary.monthlyIncome}`, 
      trend: 'This month', 
      positive: null 
    },
    { 
      title: 'Monthly Expenses', 
      value: `$${summary.monthlyExpenses}`, 
      trend: '-12% from last month', // This would be calculated
      positive: true 
    },
    { 
      title: 'Savings Rate', 
      value: `${summary.savingsRate}%`, 
      trend: 'On track to goal', 
      positive: true 
    },
  ];

  // Function to refresh transactions after adding a new one
  const refreshTransactions = async () => {
    if (!userId) return;
    
    try {
      const userTransactions = await getUserTransactions(userId);
      setTransactions(userTransactions);
    } catch (err) {
      console.error("Error refreshing transactions:", err);
    }
  };

 // In the return section of Personal.tsx component
  return (
    <div className="personal-container">
      <div className="page-title">
        <h1>Personal Dashboard</h1>
        <p>Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! Here's your financial snapshot.</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        {summaryData.map((item, index) => (
          <div key={index} className="summary-card">
            <h3>{item.title}</h3>
            <div className="summary-value">{item.value}</div>
            <div className={`summary-trend ${item.positive === true ? 'positive' : item.positive === false ? 'negative' : ''}`}>
              {item.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Financial Summary */}
      {!isLoading && !error && transactions.length > 0 && (
        <FinancialSummary transactions={transactions} />
      )}

      {/* Main Content Area */}
      <div className="personal-content-grid">
        {/* Financial Overview with Chart */}
        <div className="card">
          <div className="card-header">
            <h2>Spending Breakdown</h2>
            <button className="button button-secondary">Export</button>
          </div>
          <div className="card-content">
            {isLoading ? (
              <div className="loading-container">Loading your data...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <PersonalExpenseChart transactions={transactions} />
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Transactions</h2>
            <AddTransactionButton userId={userId} onTransactionAdded={refreshTransactions} />
          </div>
          <div className="card-content">
            {isLoading ? (
              <div className="loading-container">Loading transactions...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <RecentTransactions transactions={transactions} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Personal;