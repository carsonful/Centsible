import React, { useState } from 'react';
import { transactionType } from '../types/types';
import { addHouseholdTransaction } from '../firebase/firebase';
import './AddHouseHoldTransaction.css';
import { useUser } from '@clerk/clerk-react';

// Predefined categories with colors
const CATEGORIES = [
  { id: 'rent', label: 'Rent', color: '#2196F3' },
  { id: 'utilities', label: 'Utilities', color: '#4CAF50' },
  { id: 'groceries', label: 'Groceries', color: '#FF9800' },
  { id: 'household', label: 'Household Items', color: '#9C27B0' },
  { id: 'internet', label: 'Internet', color: '#00BCD4' },
  { id: 'other', label: 'Other', color: '#757575' },
];

// Define props interface with the callback
interface AddHouseholdTransactionProps {
  householdId: string | undefined;
  userId: string | undefined;
  onTransactionAdded?: () => void;
}

// Interface for our unified UI state
interface UIState {
  isOpen: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// Use the props interface in the component definition
const AddHouseholdTransaction: React.FC<AddHouseholdTransactionProps> = ({ 
  householdId, 
  userId,
  onTransactionAdded 
}) => {
  // Consolidated UI state
  const [uiState, setUIState] = useState<UIState>({
    isOpen: false,
    isSubmitting: false,
    error: null
  });
  
  const { user } = useUser();
  
  // Format today's date in YYYY-MM-DD format for the date input
  const today = new Date().toISOString().split('T')[0];
  
  // Get user's full name once to avoid repetition
  const userFullName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
  
  const [transaction, setTransaction] = useState<transactionType>({
    name: '',
    amount: undefined,
    category: '',
    date: new Date(),
    notes: '',
    userfullname: userFullName,
  });

  // Helper functions to update specific parts of UI state
  const openModal = () => setUIState(prev => ({ ...prev, isOpen: true }));
  const closeModal = () => setUIState(prev => ({ ...prev, isOpen: false }));
  const setError = (error: string | null) => setUIState(prev => ({ ...prev, error }));
  const setSubmitting = (isSubmitting: boolean) => setUIState(prev => ({ ...prev, isSubmitting }));

  // Close modal when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Button click handler for Save
  const handleSaveClick = async () => {
    if (!householdId || !userId) {
      setError('Missing household or user information');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    // Create transaction object with user info
    const transactionWithUser = {
      ...transaction,
      userfullname: userFullName
    };
    
    try {
      // Call the function to add transaction to household
      await addHouseholdTransaction(householdId, userId, transactionWithUser);
      
      // Close the modal and reset the form
      closeModal();
      setTransaction({
        name: '',
        amount: undefined,
        category: '',
        date: new Date(),
        notes: ''
      });
      
      // Call the refresh callback if provided
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError(error instanceof Error ? error.message : 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setTransaction(prev => ({ 
      ...prev, 
      [name]: name === 'date' ? new Date(value) : 
              name === 'amount' ? parseFloat(value) : value 
    }));
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setTransaction(prev => ({ ...prev, category }));
  };

  return (
    <>
      <button 
        type="button" 
        className="button button-primary" 
        onClick={openModal}
      >
        Add Expense
      </button>
      
      {uiState.isOpen && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup">
            <h3>Add Household Expense</h3>
            
            {uiState.error && (
              <div className="error-message">{uiState.error}</div>
            )}
            
            <div className="form-group">
              <label htmlFor="expense-name">Expense Name</label>
              <input
                id="expense-name"
                type="text"
                name="name"
                placeholder="What is this expense for?"
                value={transaction.name || ''}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expense-amount">Amount</label>
              <input
                id="expense-amount"
                type="number"
                name="amount"
                placeholder="0.00"
                value={transaction.amount || ''}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <div className="category-selector">
                {CATEGORIES.map(cat => (
                  <div 
                    key={cat.id}
                    className={`category-chip ${transaction.category === cat.id ? 'selected' : ''}`}
                    style={{
                      backgroundColor: transaction.category === cat.id ? `${cat.color}20` : undefined,
                      color: transaction.category === cat.id ? cat.color : undefined,
                      borderColor: transaction.category === cat.id ? cat.color : undefined
                    }}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
              
              <select
                name="category"
                value={transaction.category || ''}
                onChange={handleChange}
                required
                style={{ display: 'none' }}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="expense-date">Date</label>
              <input
                id="expense-date"
                type="date"
                name="date"
                value={transaction.date instanceof Date ? 
                  transaction.date.toISOString().split('T')[0] : 
                  today}
                onChange={handleChange}
                max={today}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expense-notes">Notes (Optional)</label>
              <textarea
                id="expense-notes"
                name="notes"
                placeholder="Any additional details about this expense..."
                value={transaction.notes || ''}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="popup-buttons">
              <button 
                type="button" 
                onClick={closeModal}
                disabled={uiState.isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleSaveClick}
                disabled={uiState.isSubmitting}
              >
                {uiState.isSubmitting ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddHouseholdTransaction;