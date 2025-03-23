import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

// Mock data for the charts
const monthlyData = [
  { name: 'Jan', income: 2300, expenses: 1800, savings: 500 },
  { name: 'Feb', income: 2100, expenses: 1900, savings: 200 },
  { name: 'Mar', income: 2450, expenses: 1850, savings: 600 },
  { name: 'Apr', income: 2800, expenses: 2100, savings: 700 },
  { name: 'May', income: 2200, expenses: 1700, savings: 500 },
  { name: 'Jun', income: 2500, expenses: 1800, savings: 700 },
];

const categorySpending = [
  { name: 'Food', value: 320 },
  { name: 'Utilities', value: 174 },
  { name: 'Entertainment', value: 95 },
  { name: 'Transportation', value: 142 },
  { name: 'Housing', value: 750 },
  { name: 'Shopping', value: 190 },
  { name: 'Other', value: 85 },
];

const dailySpending = [
  { date: '03/01', amount: 45 },
  { date: '03/02', amount: 28 },
  { date: '03/03', amount: 15 },
  { date: '03/04', amount: 87 },
  { date: '03/05', amount: 102 },
  { date: '03/06', amount: 32 },
  { date: '03/07', amount: 57 },
  { date: '03/08', amount: 76 },
  { date: '03/09', amount: 45 },
  { date: '03/10', amount: 65 },
  { date: '03/11', amount: 37 },
  { date: '03/12', amount: 28 },
  { date: '03/13', amount: 19 },
  { date: '03/14', amount: 45 },
];

// Process savings goals data to add the "remaining" amount for the stacked bar chart
const savingsGoals = [
  { name: 'Emergency Fund', goal: 5000, current: 3200, remaining: 1800 },
  { name: 'Vacation', goal: 2000, current: 1200, remaining: 800 },
  { name: 'New Car', goal: 10000, current: 3500, remaining: 6500 },
];

// Colors for the pie chart
const COLORS = ['#00C853', '#F44336', '#FFC107', '#2196F3', '#9C27B0', '#FF5722', '#607D8B'];

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('March 2025');
  
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Financial Overview</h1>
      <p className="dashboard-subtitle">Track your income, expenses, and savings with Centsible</p>
      
      <div className="month-selector">
        <button className="month-btn">←</button>
        <h2>{selectedMonth}</h2>
        <button className="month-btn">→</button>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Income</h3>
          <p className="stat-amount positive">$2,450</p>
          <p className="stat-change positive">↑ 16% from last month</p>
        </div>
        <div className="stat-card">
          <h3>Expenses</h3>
          <p className="stat-amount negative">$1,850</p>
          <p className="stat-change negative">↑ 2.7% from last month</p>
        </div>
        <div className="stat-card">
          <h3>Savings</h3>
          <p className="stat-amount positive">$600</p>
          <p className="stat-change positive">↑ 200% from last month</p>
        </div>
        <div className="stat-card">
          <h3>Savings Rate</h3>
          <p className="stat-amount">24.5%</p>
          <p className="stat-change positive">↑ 15% from last month</p>
        </div>
      </div>
      
      <div className="charts-row">
        <div className="chart-container">
          <h3>Income vs. Expenses (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="name" stroke="#DDD" />
              <YAxis stroke="#DDD" />
              <Tooltip
                contentStyle={{ backgroundColor: '#122431', border: 'none' }}
                itemStyle={{ color: '#FFF' }}
                formatter={(value) => [`$${value}`, '']}
              />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4CAF50" />
              <Bar dataKey="expenses" name="Expenses" fill="#F44336" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Spending by Category</h3>
          <div className="pie-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categorySpending}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']}
                  contentStyle={{ backgroundColor: '#122431', border: 'none' }}
                  itemStyle={{ color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="charts-row">
        <div className="chart-container">
          <h3>Daily Spending (Last 14 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailySpending}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3E63DD" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3E63DD" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#DDD" />
              <YAxis stroke="#DDD" />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Amount']}
                contentStyle={{ backgroundColor: '#122431', border: 'none' }}
                itemStyle={{ color: '#FFF' }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3E63DD" 
                fillOpacity={1} 
                fill="url(#colorSpending)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-container">
          <h3>Savings Goals Progress</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={savingsGoals}
              margin={{ left: 20 }}
            >
              <XAxis type="number" stroke="#DDD" />
              <YAxis type="category" dataKey="name" stroke="#DDD" />
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <Tooltip 
                formatter={(value) => [`$${value}`, '']}
                contentStyle={{ backgroundColor: '#122431', border: 'none' }}
                itemStyle={{ color: '#FFF' }}
              />
              <Legend />
              <Bar dataKey="current" name="Current Savings" stackId="a" fill="#00C853" />
              <Bar dataKey="remaining" name="Remaining" stackId="a" fill="#555" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="chart-container full-width">
        <h3>Savings Growth Trend (6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#DDD" />
            <YAxis stroke="#DDD" />
            <Tooltip 
              formatter={(value) => [`$${value}`, '']}
              contentStyle={{ backgroundColor: '#122431', border: 'none' }}
              itemStyle={{ color: '#FFF' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="savings" 
              stroke="#00C853" 
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;