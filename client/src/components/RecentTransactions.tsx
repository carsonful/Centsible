// src/components/RecentTransactions.tsx
import React from 'react';
import { transactionType } from '../types/types';
import { formatDate } from '../utils/utils';
import './RecentTransactions.css';

interface RecentTransactionsProps {
  transactions: transactionType[];
  limit?: number;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  limit = 5 
}) => {
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date || 0);
    const dateB = b.date instanceof Date ? b.date : new Date(b.date || 0);
    return dateB.getTime() - dateA.getTime();
  });

  // Limit the number of transactions shown
  const displayedTransactions = sortedTransactions.slice(0, limit);

  // Helper function to determine if a transaction is an expense
  const isExpense = (transaction: transactionType) => {
    return transaction.category !== 'Income';
  };

  if (transactions.length === 0) {
    return <p>No transactions yet. Add your first transaction to get started!</p>;
  }

  return (
    <div className="recent-transactions">
      <ul className="transactions-list">
        {displayedTransactions.map((transaction, index) => (
          <li key={transaction.id || index} className="transaction-item">
            <div className="transaction-details">
              <div className="transaction-name">{transaction.name}</div>
              <div className="transaction-meta">
                <span className="transaction-category">{transaction.category}</span>
              </div>
              <div className="transaction-date">
                {formatDate(transaction.date)}
              </div>
            </div>
            <div className={`transaction-amount ${isExpense(transaction) ? 'negative' : 'positive'}`}>
              ${Math.abs(parseFloat(transaction.amount?.toString() || "0")).toFixed(2)}
            </div>
          </li>
        ))}
      </ul>
      
      {transactions.length > limit && (
        <div className="view-all-link">
          <button className="button button-secondary">View All Transactions</button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;