// src/components/ViewAllTransactions.tsx
import React, { useState, useMemo } from 'react';
import { transactionType } from '../types/types';
import './ViewAllTransactions.css';
import { formatDate, formatCurrency } from '../utils/utils';

// Create a separate TransactionRow component for better reusability
const TransactionRow: React.FC<{ transaction: transactionType }> = ({ transaction }) => (
  <tr>
    <td className="date-cell">
      {formatDate(transaction.date)}
    </td>
    <td className="name-cell">{transaction.name}</td>
    <td className="category-cell">
      <span className="category-tag">{transaction.category}</span>
    </td>
    <td className="user-cell">{transaction.userfullname}</td>
    <td className="amount-cell">
      {formatCurrency(transaction.amount)}
    </td>
  </tr>
);

interface ViewAllTransactionsProps {
  transactions: transactionType[];
  onClose: () => void;
}

const ViewAllTransactions: React.FC<ViewAllTransactionsProps> = ({ 
  transactions, 
  onClose 
}) => {
  // State for sorting and filtering
  const [sortConfig, setSortConfig] = useState({
    key: 'date' as 'date' | 'amount',
    direction: 'desc' as 'asc' | 'desc'
  });
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Get unique categories from transactions - moved to useMemo for performance
  const categories = useMemo(() => 
    [...new Set(transactions.map(t => t.category))].filter(Boolean) as string[],
    [transactions]
  );
  
  // Sort and filter transactions - moved to useMemo to avoid recalculating on every render
  const sortedAndFilteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => 
        !filterCategory || transaction.category === filterCategory
      )
      .sort((a, b) => {
        // Handle date comparison
        if (sortConfig.key === 'date') {
          const dateA = a.date instanceof Date ? a.date : new Date(a.date || 0);
          const dateB = b.date instanceof Date ? b.date : new Date(b.date || 0);
          
          return sortConfig.direction === 'desc' 
            ? dateB.getTime() - dateA.getTime() 
            : dateA.getTime() - dateB.getTime();
        }
        
        // Handle amount comparison
        const amountA = parseFloat(a.amount?.toString() || '0');
        const amountB = parseFloat(b.amount?.toString() || '0');
        
        return sortConfig.direction === 'desc' 
          ? amountB - amountA 
          : amountA - amountB;
      });
  }, [transactions, filterCategory, sortConfig]);
  
  // Close when clicking outside the modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Toggle sort direction
  const toggleSort = (key: 'date' | 'amount') => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="transactions-overlay" onClick={handleOverlayClick}>
      <div className="transactions-modal">
        <div className="transactions-header">
          <h2>All Transactions</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="transactions-controls">
          <div className="filter-control">
            <label htmlFor="category-filter">Filter by:</label>
            <select 
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="sort-controls">
            <button 
              className={`sort-button ${sortConfig.key === 'date' ? 'active' : ''}`}
              onClick={() => toggleSort('date')}
            >
              Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`sort-button ${sortConfig.key === 'amount' ? 'active' : ''}`}
              onClick={() => toggleSort('amount')}
            >
              Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
        
        <div className="transactions-container">
          {sortedAndFilteredTransactions.length === 0 ? (
            <p className="no-transactions">No transactions match your filter criteria.</p>
          ) : (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Expense</th>
                  <th>Category</th>
                  <th>Paid By</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {sortedAndFilteredTransactions.map(transaction => (
                  <TransactionRow 
                    key={transaction.id} 
                    transaction={transaction} 
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div className="transactions-footer">
          <p>Total: {sortedAndFilteredTransactions.length} transactions</p>
          <button className="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllTransactions;