import React, { useState } from 'react';
import './Dashboard.css';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { UserButton } from '@clerk/clerk-react';
import { setupSampleData } from '../../firebase/firebase';

// Mock data for the dashboard
const monthlyData = [
  { name: 'Jan', income: 2800, expenses: 1800, balance: 1000 },
  { name: 'Feb', income: 2900, expenses: 2100, balance: 800 },
  { name: 'Mar', income: 3200, expenses: 1900, balance: 1300 },
  { name: 'Apr', income: 3100, expenses: 1700, balance: 1400 },
  { name: 'May', income: 2900, expenses: 1850, balance: 1050 },
  { name: 'Jun', income: 3400, expenses: 2150, balance: 1250 },
];

const recentTransactions = [
  { id: 1, name: "Grocery Store", category: "Food", amount: -89.75, date: "Today" },
  { id: 2, name: "Netflix Subscription", category: "Entertainment", amount: -15.99, date: "Yesterday" },
  { id: 3, name: "Paycheck", category: "Income", amount: 1450.00, date: "3 days ago" },
  { id: 4, name: "Uber", category: "Transportation", amount: -24.50, date: "4 days ago" },
  { id: 5, name: "Coffee Shop", category: "Food", amount: -6.25, date: "5 days ago" },
];

const upcomingBills = [
  { id: 1, name: "Rent", amount: 1200.00, dueDate: "Apr 1", paid: false },
  { id: 2, name: "Internet", amount: 65.00, dueDate: "Apr 3", paid: false },
  { id: 3, name: "Electricity", amount: 78.50, dueDate: "Apr 7", paid: false },
  { id: 4, name: "Phone Bill", amount: 45.00, dueDate: "Apr 12", paid: false },
];

const expensesByCategory = [
  { name: "Housing", value: 1200, color: "#8884d8" },
  { name: "Food", value: 430, color: "#82ca9d" },
  { name: "Transportation", value: 210, color: "#ffc658" },
  { name: "Entertainment", value: 180, color: "#ff8042" },
  { name: "Utilities", value: 195, color: "#0088fe" },
];

const savingsGoals = [
  { name: "Emergency Fund", current: 5000, target: 10000, percent: 50 },
  { name: "Vacation", current: 1500, target: 3000, percent: 50 },
  { name: "Down Payment", current: 25000, target: 60000, percent: 41.67 },
];

const accounts = [
  { name: "Checking Account", balance: 4532.65, institution: "Chase Bank" },
  { name: "Savings Account", balance: 12500.00, institution: "Chase Bank" },
  { name: "Credit Card", balance: -1250.75, institution: "Citi Bank" },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Get total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Get total expenses this month
  const currentMonthExpenses = monthlyData[monthlyData.length - 1].expenses;
  
  // Get total income this month
  const currentMonthIncome = monthlyData[monthlyData.length - 1].income;
  
  // Calculate savings rate
  const savingsRate = ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome * 100).toFixed(0);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo-container">
          <div className="logo-placeholder"></div>
          <span className="logo-text">centsible</span>
        </div>
        <div className="user-menu">
          <button className="profile-button">
            <UserButton />
          </button>
          <div>
            <button onClick={setupSampleData}>
              Initialize Sample Data
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back! Here's your financial snapshot.</p>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Balance</h3>
            <div className="amount">${totalBalance.toFixed(2)}</div>
            <p className="trend positive">+5.25% from last month</p>
          </div>
          <div className="summary-card">
            <h3>Income</h3>
            <div className="amount">${currentMonthIncome.toFixed(2)}</div>
            <p className="trend">This month</p>
          </div>
          <div className="summary-card">
            <h3>Expenses</h3>
            <div className="amount">${currentMonthExpenses.toFixed(2)}</div>
            <p className="trend negative">-12% from last month</p>
          </div>
          <div className="summary-card">
            <h3>Savings Rate</h3>
            <div className="amount">{savingsRate}%</div>
            <p className="trend">On track to goal</p>
          </div>
        </div>

        <div className="dashboard-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </button>
            <button 
              className={`tab-button ${activeTab === 'budgets' ? 'active' : ''}`}
              onClick={() => setActiveTab('budgets')}
            >
              Budgets
            </button>
            <button 
              className={`tab-button ${activeTab === 'goals' ? 'active' : ''}`}
              onClick={() => setActiveTab('goals')}
            >
              Goals
            </button>
          </div>
          
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="chart-section">
                <div className="section-header">
                  <h2>Monthly Overview</h2>
                </div>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={monthlyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="income" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="expenses" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="overview-grid">
                <div className="card transactions-card">
                  <div className="card-header">
                    <h3>Recent Transactions</h3>
                    <button className="view-all-btn">View All</button>
                  </div>
                  <div className="card-content">
                    <table className="transactions-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Category</th>
                          <th className="amount-column">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.slice(0, 4).map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{transaction.name}</td>
                            <td>{transaction.category}</td>
                            <td className={`amount-column ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                              {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card bills-card">
                  <div className="card-header">
                    <h3>Upcoming Bills</h3>
                    <button className="add-btn">+ Add</button>
                  </div>
                  <div className="card-content">
                    <div className="bills-list">
                      {upcomingBills.slice(0, 3).map((bill) => (
                        <div key={bill.id} className="bill-item">
                          <div className="bill-info">
                            <span className="bill-name">{bill.name}</span>
                            <span className="bill-date">{bill.dueDate}</span>
                          </div>
                          <div className="bill-amount">
                            ${bill.amount.toFixed(2)}
                            <span className={`bill-status ${bill.paid ? 'paid' : 'due'}`}>
                              {bill.paid ? 'Paid' : 'Due'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="card-footer">
                      <p>Total Upcoming: $1,388.50</p>
                    </div>
                  </div>
                </div>

                <div className="card expenses-card">
                  <div className="card-header">
                    <h3>Expenses by Category</h3>
                  </div>
                  <div className="card-content">
                    <div className="chart-container pie-container">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={expensesByCategory}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {expensesByCategory.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `$${value}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="card goals-card">
                  <div className="card-header">
                    <h3>Savings Goals</h3>
                    <button className="add-btn">+ Add</button>
                  </div>
                  <div className="card-content">
                    <div className="goals-list">
                      {savingsGoals.slice(0, 2).map((goal, index) => (
                        <div key={index} className="goal-item">
                          <div className="goal-info">
                            <span className="goal-name">{goal.name}</span>
                            <span className="goal-percentage">{goal.percent.toFixed(0)}%</span>
                          </div>
                          <div className="goal-progress-container">
                            <div 
                              className="goal-progress-bar" 
                              style={{width: `${goal.percent}%`}}
                            ></div>
                          </div>
                          <div className="goal-amounts">
                            <span>${goal.current.toLocaleString()}</span>
                            <span className="goal-target">${goal.target.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="tab-content">
              <div className="transaction-filters">
                <input type="text" placeholder="Search transactions..." className="search-input" />
                <select className="category-filter">
                  <option value="">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Income">Income</option>
                </select>
                <button className="date-filter-btn">Date Range</button>
              </div>
              
              <div className="card full-width">
                <div className="card-content">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th className="amount-column">Amount</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{transaction.date}</td>
                          <td>{transaction.name}</td>
                          <td>{transaction.category}</td>
                          <td className={`amount-column ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                            {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
                          </td>
                          <td>
                            <button className="action-btn">...</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <button className="pagination-btn">Previous</button>
                  <span>Page 1 of 10</span>
                  <button className="pagination-btn">Next</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="tab-content">
              <div className="budget-sections">
                <div className="card budget-overview-card">
                  <div className="card-header">
                    <h3>Budget Overview</h3>
                  </div>
                  <div className="card-content">
                    <div className="chart-container">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={expensesByCategory}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => `$${value}`} />
                          <Legend />
                          <Bar dataKey="value" name="Amount" fill="#85bb65" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="card budget-details-card">
                  <div className="card-header">
                    <h3>Budget Details</h3>
                    <button className="edit-btn">Edit Budgets</button>
                  </div>
                  <div className="card-content">
                    <div className="budget-categories">
                      {expensesByCategory.map((category, index) => {
                        // Adding fictional allocated amounts for demonstration
                        const allocated = category.value * 1.2;
                        const percentUsed = (category.value / allocated) * 100;
                        
                        return (
                          <div key={index} className="budget-category-item">
                            <div className="budget-category-header">
                              <span className="category-name">{category.name}</span>
                              <span className="category-values">
                                ${category.value} / ${allocated.toFixed(0)}
                              </span>
                            </div>
                            <div className="budget-progress-container">
                              <div 
                                className={`budget-progress-bar ${percentUsed > 100 ? 'over-budget' : ''}`}
                                style={{width: `${percentUsed > 100 ? 100 : percentUsed}%`}}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="tab-content">
              <div className="goals-grid">
                {savingsGoals.map((goal, index) => (
                  <div key={index} className="card goal-card">
                    <div className="card-header">
                      <h3>{goal.name}</h3>
                    </div>
                    <div className="card-content">
                      <div className="goal-amount">${goal.current.toLocaleString()}</div>
                      <div className="goal-target">of ${goal.target.toLocaleString()}</div>
                      <div className="goal-progress-container large">
                        <div 
                          className="goal-progress-bar" 
                          style={{width: `${goal.percent}%`}}
                        ></div>
                      </div>
                      <div className="goal-percentage-display">
                        {goal.percent.toFixed(0)}% Complete
                      </div>
                      <div className="goal-actions">
                        <button className="secondary-btn">Edit</button>
                        <button className="primary-btn">Add Funds</button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="card add-goal-card">
                  <div className="add-goal-content">
                    <div className="add-icon">+</div>
                    <h3>Add New Goal</h3>
                    <p>Create a new savings target</p>
                    <button className="primary-btn">Get Started</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;