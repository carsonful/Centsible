// src/pages/Dashboard/Household/HouseholdDataProcessing.ts
import { transactionType } from '../../../types/types';
import { parseNumberSafe, formatCurrency, daysAgo } from '../../../utils/utils';

// Interface for processed transaction data
export interface ProcessedTransactionData {
  totalExpenses: number;
  recentExpenses: number;
  userContribution: {
    amount: number;
    percentage: number;
  };
  categoryData: Array<{ name: string; value: number }>;
  userContributionData: Array<{ name: string; value: number }>;
}

/**
 * Process transaction data to calculate derived values
 * @param transactions List of transactions
 * @param currentUserId Current user ID to calculate their contribution
 * @param currentUserName Current user name to calculate their contribution
 * @returns Processed data with calculated metrics
 */
export const processTransactionData = (
  transactions: transactionType[],
  currentUserId?: string,
  currentUserName?: string
): ProcessedTransactionData => {
  // Calculate total expenses
  const totalExpenses = transactions.reduce((total, transaction) => {
    return total + parseNumberSafe(transaction.amount);
  }, 0);
  
  // Calculate recent expenses (last 30 days)
  const thirtyDaysAgo = daysAgo(30);
  const recentExpenses = transactions
    .filter(transaction => {
      // Make sure transaction.date is a Date object
      const transactionDate = transaction.date instanceof Date 
        ? transaction.date 
        : new Date(transaction.date || 0);
      
      // Check if the transaction date is after 30 days ago
      return transactionDate >= thirtyDaysAgo;
    })
    .reduce((total, transaction) => {
      return total + parseNumberSafe(transaction.amount);
    }, 0);
  
  // Calculate the current user's contribution 
  const userContribution = calculateUserContribution(
    transactions, 
    totalExpenses, 
    currentUserName
  );
  
  // Group transactions by category
  const categoryData = prepareCategoryData(transactions);
  
  // Group transactions by user
  const userContributionData = prepareUserContributionData(transactions);
  
  return {
    totalExpenses,
    recentExpenses,
    userContribution,
    categoryData,
    userContributionData
  };
};

/**
 * Calculate user contribution amount and percentage
 */
const calculateUserContribution = (
  transactions: transactionType[],
  totalExpenses: number,
  currentUserName?: string
): { amount: number; percentage: number } => {
  if (!currentUserName || transactions.length === 0 || totalExpenses === 0) {
    return { amount: 0, percentage: 0 };
  }
  
  // Calculate how much this user has contributed
  const userContributionAmount = transactions
    .filter(transaction => transaction.userfullname === currentUserName)
    .reduce((total, transaction) => {
      return total + parseNumberSafe(transaction.amount);
    }, 0);
  
  // Calculate percentage
  const percentage = (userContributionAmount / totalExpenses) * 100;
  
  return {
    amount: userContributionAmount,
    percentage
  };
};

/**
 * Group transactions by category and calculate totals
 */
const prepareCategoryData = (transactions: transactionType[]): Array<{ name: string; value: number }> => {
  // Group transactions by category and sum amounts
  const categoryMap = new Map<string, number>();
  
  transactions.forEach(transaction => {
    if (transaction.category) {
      const category = transaction.category;
      const amount = parseNumberSafe(transaction.amount);
      
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + amount);
    }
  });
  
  // Convert map to array for the pie chart
  return Array.from(categoryMap, ([name, value]) => ({ name, value }));
};

/**
 * Group transactions by user and calculate totals
 */
const prepareUserContributionData = (transactions: transactionType[]): Array<{ name: string; value: number }> => {
  // Group transactions by user and sum amounts
  const userMap = new Map<string, number>();
  
  transactions.forEach(transaction => {
    const username = transaction.userfullname || 'Unknown';
    const amount = parseNumberSafe(transaction.amount);
    
    const currentAmount = userMap.get(username) || 0;
    userMap.set(username, currentAmount + amount);
  });
  
  // Convert map to array for the pie chart
  return Array.from(userMap, ([name, value]) => ({ name, value }));
};

export default {
  processTransactionData
};