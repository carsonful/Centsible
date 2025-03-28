import React, { useState } from 'react';
import { transactionType } from '../types/types';
import { addTransaction } from '../firebase/firebase';
import './AddTransaction.css';

// Define props interface
interface AddTransactionButtonProps {
  userId: string | undefined;
}

// Use the props interface in the component definition
const AddTransactionButton: React.FC<AddTransactionButtonProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transaction, setTransaction] = useState<transactionType>({
    name: '',
    amount: undefined,
    category: '',
    date: new Date(),
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Transaction added:', transaction);
    addTransaction(userId, transaction); // Now userId is properly passed
    setIsOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
  };

  return (
    <>
      <button className="button button-primary" onClick={() => setIsOpen(true)}>
        Add Transaction
      </button>
      {isOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add Transaction</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Transaction name"
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
                <option value="Food">Food</option>
                <option value="Income">Income</option>
                <option value="Other">Other</option>
              </select>
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

export default AddTransactionButton;