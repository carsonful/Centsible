import React, { useState, useEffect } from 'react';
import './HouseHold.css';
import { createHouseHold, getUserHousehold, getHouseholdTransactions, inviteUserToHousehold } from '../../../firebase/firebase';
import { usertype, householdType, transactionType } from '../../../types/types';
import { useUser } from '@clerk/clerk-react';
import ExpenseTrendChart from '../../../components/ExpenseTrendChart'; // Import the ExpenseTrendChart component
import AddHouseholdTransaction from '../../../components/AddHouseholdTransaction';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import ViewAllTransactions from '../../../components/ViewAllTransactions';
// Get firestore instance from your firebase config
const db = getFirestore();

// Define a member type to include role information
interface HouseholdMember {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  joined: boolean;
  joinedAt: Date;
}

const Household: React.FC = () => {
  const { user } = useUser();
  const [isCreating, setIsCreating] = useState(false);
  const [householdName, setHouseholdName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [household, setHousehold] = useState<householdType>();
  const [isLoadingHousehold, setIsLoadingHousehold] = useState(true);
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [members, setMembers] = useState<HouseholdMember[]>([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  // Add a refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Current user info
  const currentUser: usertype = {
    id: user?.id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    emailAddress: user?.emailAddresses[0].emailAddress
  };

  // Function to refresh data
  const refreshData = () => {
    // Increment the trigger to cause effect to re-run
    setRefreshTrigger(prev => prev + 1);
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
          
          // Fetch household members
          const householdMembersRef = collection(db, "households", userHousehold.id, "members");
          const membersSnapshot = await getDocs(householdMembersRef);
          
          const fetchedMembers: HouseholdMember[] = [];
          membersSnapshot.forEach(doc => {
            if (doc.data().joined) {
              fetchedMembers.push({
                ...doc.data(),
                joinedAt: doc.data().joinedAt?.toDate()
              } as HouseholdMember);
            }
          });
          
          setMembers(fetchedMembers);
        }
      } catch (error) {
        console.error("Error fetching household:", error);
        setError("Failed to load your household");
      } finally {
        setIsLoadingHousehold(false);
      }
    };
    
    fetchUserHousehold();
  }, [user?.id, refreshTrigger]); // Add refreshTrigger to the dependency array

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

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!household?.id || !user?.id) {
      setError('Missing household or user information');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("About to call inviteUserToHousehold function");
      const result = await inviteUserToHousehold(
        household.id,
        inviteEmail,
        user.id
      );
      
      console.log("Invitation result:", result);
      
      if (result.success) {
        alert(result.message);
        setInviteEmail('');
        setIsInviting(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error in invitation process:", err);
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError('An error occurred while sending the invitation.');
      }
    } finally {
      setIsLoading(false);
      console.log("Invitation process completed");
    }
  };

  // Prepare data for the pie chart
  const prepareCategoryData = () => {
    // Group transactions by category and sum amounts
    const categoryMap = new Map<string, number>();
    
    transactions.forEach(transaction => {
      if (transaction.category) {
        const category = transaction.category;
        const amount = parseFloat(transaction.amount?.toString() || "0");
        
        if (categoryMap.has(category)) {
          categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
        } else {
          categoryMap.set(category, amount);
        }
      }
    });
    
    // Convert map to array for the pie chart
    return Array.from(categoryMap, ([name, value]) => ({ name, value }));
  };

  // Prepare data for the user contribution chart
  const prepareUserContributionData = () => {
    // Group transactions by user and sum amounts
    const userMap = new Map<string, number>();
    
    transactions.forEach(transaction => {
      const username = transaction.userfullname || 'Unknown';
      const amount = parseFloat(transaction.amount?.toString() || "0");
      
      if (userMap.has(username)) {
        userMap.set(username, (userMap.get(username) || 0) + amount);
      } else {
        userMap.set(username, amount);
      }
    });
    
    // Convert map to array for the pie chart
    return Array.from(userMap, ([name, value]) => ({ name, value }));
  };

  const calculateRecentExpenses = () => {
    // Calculate date from 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Filter transactions to only include those from the past 30 days
    return transactions
      .filter(transaction => {
        // Make sure transaction.date is a Date object
        const transactionDate = transaction.date instanceof Date 
          ? transaction.date 
          : new Date(transaction.date);
        
        // Check if the transaction date is after 30 days ago
        return transactionDate >= thirtyDaysAgo;
      })
      .reduce((total, transaction) => {
        return total + parseFloat(transaction.amount?.toString() || "0");
      }, 0);
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return transactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.amount?.toString() || "0");
    }, 0);
  };

  // Calculate the current user's contribution percentage
  const calculateUserContribution = () => {
    if (!user?.id || transactions.length === 0) return 0;
    
    const totalExpenses = calculateTotalExpenses();
    if (totalExpenses === 0) return 0;
    
    // Get the full name of the current user
    const userName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    
    // Calculate how much this user has contributed
    const userContribution = transactions.reduce((total, transaction) => {
      if (transaction.userfullname === userName) {
        return total + parseFloat(transaction.amount?.toString() || "0");
      }
      return total;
    }, 0);
    
    // Return as a percentage
    return (userContribution / totalExpenses) * 100;
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
          {/* Household Summary Cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Total Expenses</h3>
              <div className="summary-value">${calculateRecentExpenses().toFixed(2)}</div>
              <div className="summary-trend">Past 30 days</div>
            </div>
            
            {/* New contribution card */}
            <div className="summary-card">
              <h3>Your Contribution</h3>
              <div className="summary-value">{calculateUserContribution().toFixed(1)}%</div>
              <div className="summary-trend">Out of  
                {calculateUserContribution() > 0 
                  ? ` $${transactions
                      .filter(t => t.userfullname === (user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()))
                      .reduce((sum, t) => sum + parseFloat(t.amount?.toString() || "0"), 0)
                      .toFixed(2)} `
                  : 'No contributions yet'}
                   total
              </div>
            </div>
            
            <div className="summary-card">
              <h3>Household Members</h3>
              <div className="summary-value">{members.length}</div>
              <div className="summary-trend">Active members</div>
            </div>
            <div className="summary-card">
              <h3>Transactions</h3>
              <div className="summary-value">{transactions.length}</div>
              <div className="summary-trend">Total recorded expenses</div>
            </div>
          </div>
          
          <div className="household-grid">
            {/* Left Column */}
            <div className="household-column">
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
              
              {/* Household Members */}
              <div className="card">
                <div className="card-header">
                  <h2>Members</h2>
                  <button 
                    className="button button-secondary"
                    onClick={() => setIsInviting(true)}
                  >
                    Invite Member
                  </button>
                </div>
                <div className="card-content">
                  {isInviting ? (
                    <form onSubmit={handleInviteMember} className="invite-form">
                      <div className="form-group">
                        <label htmlFor="inviteEmail">Email Address</label>
                        <input
                          type="email"
                          id="inviteEmail"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="example@email.com"
                          required
                        />
                      </div>
                      
                      {/* Display error message if there is one */}
                      {error && (
                        <div className="error-message">
                          {error}
                        </div>
                      )}
                      
                      <div className="form-actions">
                        <button 
                          type="button" 
                          className="button button-secondary"
                          onClick={() => {
                            setIsInviting(false);
                            setError(null); // Clear error when canceling
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="button"
                          disabled={!inviteEmail.trim() || isLoading}
                        >
                          {isLoading ? 'Sending...' : 'Send Invitation'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <ul className="members-list">
                      {members.length > 0 ? (
                        members.map((member, index) => (
                          <li key={index} className="member-item">
                            <div className="member-avatar">
                              {/* Use first letter of first name as fallback */}
                              {member.firstName ? member.firstName.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="member-details">
                              <div className="member-name">
                                {`${member.firstName} ${member.lastName}`}
                              </div>
                              <div className="member-role">{member.role}</div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li className="member-item">
                          <div className="member-avatar">
                            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div className="member-details">
                            <div className="member-name">{user?.fullName || `${user?.firstName} ${user?.lastName}`}</div>
                            <div className="member-role">Owner</div>
                          </div>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
              
              {/* Recent Transactions - moved to left column */}
              <div className="card">
                <div className="card-header">
                  <h2>Recent Transactions</h2>
                  {household && 
                    <AddHouseholdTransaction 
                      householdId={household.id} 
                      userId={user?.id} 
                      onTransactionAdded={() => {
                        // Use a more controlled approach to refresh data
                        const fetchTransactions = async () => {
                          try {
                            if (household?.id) {
                              const householdTransactions = await getHouseholdTransactions(household.id);
                              setTransactions(householdTransactions);
                            }
                          } catch (error) {
                            console.error("Error fetching transactions:", error);
                          }
                        };
                        
                        fetchTransactions();
                        // Don't increment refreshTrigger here as it might cause a full re-render
                        // setRefreshTrigger(prev => prev + 1);
                      }}
                    />
                  }
                </div>
                <div className="card-content">
                  {transactions.length === 0 ? (
                    <p>No transactions yet. Add your first expense!</p>
                  ) : (
                    <>
                      <ul className="transactions-list compact">
                        {transactions.slice(0, 3).map(transaction => (
                          <li key={transaction.id} className="transaction-item">
                            <div className="transaction-details">
                              <div className="transaction-name">{transaction.name}</div>
                              <div className="transaction-meta">
                                <span className="transaction-category">{transaction.category}</span>
                                <span className="transaction-paid-by">Paid by: {transaction.userfullname}</span>
                              </div>
                              <div className="transaction-date">
                                {transaction.date instanceof Date 
                                  ? transaction.date.toLocaleDateString() 
                                  : 'No date'
                                }
                              </div>
                            </div>
                            <div className="transaction-amount">
                              ${parseFloat(transaction.amount?.toString() || "0").toFixed(2)}
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      {transactions.length > 5 && (
                        <div className="view-all-link">
                          <button 
                            className="button button-secondary"
                            onClick={() => setShowAllTransactions(true)}
                          >
                          View All {transactions.length} Transactions
                          </button>
                        </div>
                        
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column */}
            <div className="household-column">
              {/* Expense Breakdown Chart */}
              <div className="card">
                <div className="card-header">
                  <h2>Expense Breakdown</h2>
                </div>
                <div className="card-content">
                  {transactions.length > 0 ? (
                    <div className="chart-container" style={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareCategoryData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareCategoryData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="empty-chart-message">Add expenses to see your spending breakdown</p>
                  )}
                </div>
              </div>
              <div className="card">
              <div className="card-header">
                <h2>Expense Trends Over Time</h2>
              </div>
                <div className="card-content">
                  <ExpenseTrendChart transactions={transactions} months={6} />
                </div>
              </div>
              {/* User Contribution Chart */}
              <div className="card">
                <div className="card-header">
                  <h2>Expense Contributions</h2>
                </div>
                <div className="card-content">
                  {transactions.length > 0 ? (
                    <div className="chart-container" style={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareUserContributionData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareUserContributionData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <p className="empty-chart-message">Add expenses to see contribution distribution</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {showAllTransactions && (
        <ViewAllTransactions 
          transactions={transactions}
          householdId={household.id}
          onClose={() => setShowAllTransactions(false)}
          onTransactionDeleted={() => {
            // Refresh transactions after deletion
            const fetchTransactions = async () => {
              try {
                if (household?.id) {
                  const householdTransactions = await getHouseholdTransactions(household.id);
                  setTransactions(householdTransactions);
                }
              } catch (error) {
                console.error("Error fetching transactions:", error);
              }
            };
            
            fetchTransactions();
          }}
        />
      )}
    </div>
  );
};

export default Household;