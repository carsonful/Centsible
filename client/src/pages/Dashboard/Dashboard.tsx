import React from 'react';
import './Dashboard.css';
import { UserButton } from '@clerk/clerk-react';

// Mock data for testing
const summaryData = [
  { title: 'Total Balance', value: '$15,781.90', trend: '+5.25%', positive: true },
  { title: 'Monthly Income', value: '$3,400.00', trend: 'This month', positive: null },
  { title: 'Monthly Expenses', value: '$2,150.00', trend: '-12% from last month', positive: true },
  { title: 'Savings Rate', value: '36%', trend: 'On track to goal', positive: true },
];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          FairShare
        </div>
        <div className="user-section">
          <button className="button button-secondary">Help</button>
          <UserButton />
        </div>
      </header>

      <div className="dashboard-content">
        <div className="page-title">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your financial snapshot.</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-grid">
          {summaryData.map((item, index) => (
            <div key={index} className="summary-card">
              <h3>{item.title}</h3>
              <div className="summary-value">{item.value}</div>
              <div className={`summary-trend ${item.positive === true ? 'positive' : item.positive === false ? 'negative' : ''}`}>
                {item.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="card">
          <div className="card-header">
            <h2>Financial Overview</h2>
            <button className="button">Export</button>
          </div>
          <div className="card-content">
            {/* Chart placeholder - we'll add a real chart here later */}
            <div className="chart-container">
              Chart will be added here
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Transactions</h2>
            <button className="button button-secondary">View All</button>
          </div>
          <div className="card-content">
            <p>Transaction data will be displayed here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;