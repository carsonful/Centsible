// src/components/AddTransaction.tsx
import React, { useState } from 'react';
import { transactionType } from '../types/types';
import { addTransaction } from '../firebase/firebase';
import './AddTransaction.css';

// Define props interface
interface AddTransactionButtonProps {
  userId: string | undefined;
  onTransactionAdded?: () => void;
}

// Use the props interface in the component definition
const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({ userId, onTransactionAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Keep track of transaction type explicitly
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  
  const [transaction, setTransaction] = useState<transactionType>({
    name: '',
    amount: undefined,
    category: '',
    date: new Date(),
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      setError("User information is missing");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create a modified transaction object with the category explicitly set based on transaction type
      const modifiedTransaction: transactionType = {
        ...transaction,
        // For expense, use original amount but set category to ensure it's tracked as expense
        // For income, set category to "Income" to ensure it's tracked as income
        category: transactionType === 'income' ? 'Income' : transaction.category || 'Other',
        // Store transaction type in notes to make it explicit
        notes: `${transactionType.toUpperCase()}: ${transaction.notes || ''}`
      };
      
      console.log("Submitting transaction:", modifiedTransaction);
      
      await addTransaction(userId, modifiedTransaction);
      
      // Reset form and close modal
      setTransaction({
        name: '',
        amount: undefined,
        category: '',
        date: new Date(),
        notes: ''
      });
      setIsOpen(false);
      
      // Call the callback if provided
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };
  
  // Handle date input separately
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransaction(prev => ({ 
      ...prev, 
      date: new Date(e.target.value) 
    }));
  };

  return (
    <>
      <button className="button" onClick={() => setIsOpen(true)}>
        Add Transaction
      </button>
      
      {isOpen && (
        <div className="popup-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}>
          <div className="popup">
            <h3>Add Transaction</h3>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Transaction type selector */}
              <div className="form-group transaction-type-selector">
                <label>Transaction Type</label>
                <div className="transaction-type-buttons">
                  <button
                    type="button"
                    className={`type-button ${transactionType === 'expense' ? 'active' : ''}`}
                    onClick={() => setTransactionType('expense')}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`type-button ${transactionType === 'income' ? 'active' : ''}`}
                    onClick={() => setTransactionType('income')}
                  >
                    Income
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="name">Transaction Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Transaction name"
                  value={transaction.name || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <div className="amount-input">
                  <span className="currency-symbol">$</span>
                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    placeholder="0.00"
                    value={transaction.amount || ''}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              {/* Only show category selection for expenses */}
              {transactionType === 'expense' && (
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={transaction.category || ''}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Food">Food</option>
                    <option value="Housing">Housing</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={transaction.date instanceof Date ? 
                    transaction.date.toISOString().split('T')[0] : 
                    new Date().toISOString().split('T')[0]}
                  onChange={handleDateChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional notes"
                  value={transaction.notes || ''}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <div className="popup-buttons">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={transactionType === 'income' ? 'income-button' : 'expense-button'}
                >
                  {isSubmitting ? 'Saving...' : `Save ${transactionType === 'income' ? 'Income' : 'Expense'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTransactionButton;