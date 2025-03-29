// src/components/ViewAllTransactions.tsx
import React, { useState } from 'react';
import { transactionType } from '../types/types';
import './ViewAllTransactions.css';

interface ViewAllTransactionsProps {
  transactions: transactionType[];
  onClose: () => void;
}

const ViewAllTransactions: React.FC<ViewAllTransactionsProps> = ({ 
  transactions, 
  onClose 
}) => {
  // State for sorting and filtering
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Get unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category))].filter(Boolean);
  
  // Sort and filter transactions
  const sortedAndFilteredTransactions = transactions
    .filter(transaction => 
      !filterCategory || transaction.category === filterCategory
    )
    .sort((a, b) => {
      // Handle date comparison
      if (sortBy === 'date') {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date || 0);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date || 0);
        
        return sortDirection === 'desc' 
          ? dateB.getTime() - dateA.getTime() 
          : dateA.getTime() - dateB.getTime();
      }
      
      // Handle amount comparison
      const amountA = parseFloat(a.amount?.toString() || '0');
      const amountB = parseFloat(b.amount?.toString() || '0');
      
      return sortDirection === 'desc' 
        ? amountB - amountA 
        : amountA - amountB;
    });
  
  // Close when clicking outside the modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Toggle sort direction
  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
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
              className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
              onClick={() => toggleSort('date')}
            >
              Date {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`sort-button ${sortBy === 'amount' ? 'active' : ''}`}
              onClick={() => toggleSort('amount')}
            >
              Amount {sortBy === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                  <tr key={transaction.id}>
                    <td className="date-cell">
                      {transaction.date instanceof Date 
                        ? transaction.date.toLocaleDateString() 
                        : new Date(transaction.date || 0).toLocaleDateString()
                      }
                    </td>
                    <td className="name-cell">{transaction.name}</td>
                    <td className="category-cell">
                      <span className="category-tag">{transaction.category}</span>
                    </td>
                    <td className="user-cell">{transaction.userfullname}</td>
                    <td className="amount-cell">${parseFloat(transaction.amount?.toString() || "0").toFixed(2)}</td>
                  </tr>
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