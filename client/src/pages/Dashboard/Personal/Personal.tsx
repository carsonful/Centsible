import React from 'react';
import './Personal.css';
import AddTransactionButton from '../../../components/AddTransaction';
import { usertype } from '../../types/types';

// Mock data for testing
const summaryData = [
  { title: 'Total Balance', value: '$15,781.90', trend: '+5.25%', positive: true },
  { title: 'Monthly Income', value: '$3,400.00', trend: 'This month', positive: null },
  { title: 'Monthly Expenses', value: '$2,150.00', trend: '-12% from last month', positive: true },
  { title: 'Savings Rate', value: '36%', trend: 'On track to goal', positive: true },
];

interface userIdProps {
  userId: string | undefined;
}

const Personal: React.FC<userIdProps> = ({ userId }) => {
  return (
    <div className="personal-container">
      <div className="page-title">
        <h1>Personal Dashboard</h1>
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
          </div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Transactions</h2>
          <button className="button button-secondary">View All</button>
        </div>
        <div>
          <AddTransactionButton userId={userId} />
        </div>
        <div className="card-content">
          <p>Transaction data will be displayed here.</p>
        </div>
      </div>
    </div>
  );
};

export default Personal;