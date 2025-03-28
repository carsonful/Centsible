import React, { useState, useEffect } from 'react';
import './HouseHold.css';
import { createHouseHold, getUserHousehold, getHouseholdTransactions } from '../../../firebase/firebase'; // Adjust path as needed
import { usertype, householdType, transactionType } from '../../../types/types';
import { useUser } from '@clerk/clerk-react';
import AddHouseholdTransaction from '../../../components/AddHouseholdTransaction';


const Household: React.FC = () => {
  const { user } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [householdName, setHouseholdName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [household, setHousehold] = useState<householdType>();
  const [isLoadingHousehold, setIsLoadingHousehold] = useState(true);
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  
  // Current user info
  const currentUser: usertype = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    emailAddress: user?.emailAddresses[0].emailAddress
  };

  // Fetch user's household
  useEffect(() => {
    const fetchUserHousehold = async () => {
      if (!user?.id) return;
      
      setIsLoadingHousehold(true);
      
      try {
        const userHousehold = await getUserHousehold(user.id);
        setHousehold(userHousehold);
        
        // If user has a household, fetch its transactions
        if (userHousehold) {
          const householdTransactions = await getHouseholdTransactions(userHousehold.id);
          console.log("Household transactions:", householdTransactions);
          setTransactions(householdTransactions);
        }
      } catch (error) {
        console.error("Error fetching household:", error);
        setError("Failed to load your household");
      } finally {
        setIsLoadingHousehold(false);
      }
    };
    
    fetchUserHousehold();
  }, [user?.id]);

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create the household object
      const newHousehold: householdType = {
        name: householdName,
        ownerId: user.id
      };
      
      // Call your createHouseHold function
      await createHouseHold(newHousehold, currentUser);
      
      // Reset form and state
      setHouseholdName('');
      setIsCreating(false);
      
      // Refresh the household data
      const userHousehold = await getUserHousehold(user.id);
      setHousehold(userHousehold);
    } catch (err) {
      setError('Failed to create household. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="household-container">
      <div className="page-title">
        <h1>Household Dashboard</h1>
        <p>Manage your shared expenses with roommates.</p>
      </div>
      
      {/* Household Creation Form */}
      {isCreating ? (
        <div className="card">
          <div className="card-header">
            <h2>Create a New Household</h2>
          </div>
          <div className="card-content">
            <form onSubmit={handleCreateHousehold}>
              <div className="form-group">
                <label htmlFor="householdName">Household Name</label>
                <input 
                  type="text" 
                  id="householdName"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  placeholder="e.g. Main Apartment"
                  required
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="button button-secondary"
                  onClick={() => setIsCreating(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="button"
                  disabled={isLoading || !householdName.trim()}
                >
                  {isLoading ? 'Creating...' : 'Create Household'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : isLoadingHousehold ? (
        // Loading state
        <div className="card">
          <div className="card-content">
            <p className="loading-text">Loading your household...</p>
          </div>
        </div>
      ) : !household ? (
        // No household state
        <div className="card">
          <div className="card-header">
            <h2>Welcome to Household</h2>
          </div>
          <div className="card-content">
            <p>You don't have a household yet. Create one to get started!</p>
            <button 
              className="button" 
              style={{ marginTop: '20px' }}
              onClick={() => setIsCreating(true)}
            >
              Create a Household
            </button>
          </div>
        </div>
      ) : (
        // User has a household
        <>
          <div className="card">
            <div className="card-header">
              <h2>Your Household</h2>
            </div>
            <div className="card-content">
              <div className="household-details">
                <h3>{household.name}</h3>
                <p className="household-role">Your role: {household.ownerId === user?.id ? 'Owner' : 'Member'}</p>
              </div>
            </div>
          </div>
          
          {/* Display transactions if available */}
          <div className="card">
            <div className="card-header">
                <h2>Recent Transactions</h2>
                {household && <AddHouseholdTransaction householdId={household.id} userId={user?.id} />}
            </div>
            <div className="card-content">
              {transactions.length === 0 ? (
                <p>No transactions yet. Add your first expense!</p>
              ) : (
                <ul className="transactions-list">
                {transactions.map(transaction => (
                    <li key={transaction.id} className="transaction-item">
                    <div className="transaction-details">
                        <div className="transaction-name">{transaction.name}</div>
                        <div className="transaction-category">{transaction.userfullname}</div>
                        <div className="transaction-date">
                        {transaction.date instanceof Date ? transaction.date.toLocaleDateString() : 'No date'}
                        </div>
                    </div>
                    <div className="transaction-amount">
                        ${parseFloat(transaction.amount).toFixed(2)}
                    </div>
                    </li>
                ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Household;