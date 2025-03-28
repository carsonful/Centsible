import React, { useState } from 'react';
import { transactionType } from '../types/types';
import { addHouseholdTransaction } from '../firebase/firebase'; // We'll need to create this function
import './AddTransaction.css'; // We can reuse the same CSS
import { useUser } from '@clerk/clerk-react'
// Define props interface
interface AddHouseholdTransactionProps {
  householdId: string | undefined;
  userId: string | undefined;
  fullname: string | undefined;
}

// Use the props interface in the component definition
const AddHouseholdTransaction: React.FC<AddHouseholdTransactionProps> = ({ householdId, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  
  const [transaction, setTransaction] = useState<transactionType>({
    name: '',
    amount: undefined,
    category: '',
    date: new Date(),
    notes: '',
    userfullname: user?.fullName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Household transaction added:', transaction);
    
    // Call the function to add transaction to household

    addHouseholdTransaction(householdId, userId, transaction);
    
    setIsOpen(false);
    // Reset the form
    setTransaction({
      name: '',
      amount: undefined,
      category: '',
      date: new Date(),
      notes: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ 
      ...prev, 
      [name]: name === 'amount' ? parseFloat(value) : value 
    }));
  };

  return (
    <>
      <button className="button button-primary" onClick={() => setIsOpen(true)}>
        Add Household Expense
      </button>
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add Household Expense</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Expense name"
                value={transaction.name || ''}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={transaction.amount || ''}
                onChange={handleChange}
                step="0.01"
                required
              />
              <select
                name="category"
                value={transaction.category || ''}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Groceries">Groceries</option>
                <option value="Household Items">Household Items</option>
                <option value="Internet">Internet</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                name="date"
                value={transaction.date instanceof Date ? transaction.date.toISOString().split('T')[0] : ''}
                onChange={handleChange}
                required
              />
              <textarea
                name="notes"
                placeholder="Notes (optional)"
                value={transaction.notes || ''}
                onChange={handleChange}
                rows={3}
              />
              <div className="popup-buttons">
                <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddHouseholdTransaction;