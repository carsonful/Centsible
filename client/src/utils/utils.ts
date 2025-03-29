// src/utils/utils.ts

/**
 * Formats a user's full name from user object
 * @param user User object from Clerk or other source
 * @returns Formatted full name
 */
export const formatUserName = (user: any): string => {
    if (!user) return '';
    return user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
  };
  
  /**
   * Formats a currency amount
   * @param amount Number or string amount to format
   * @returns Formatted currency string
   */
  export const formatCurrency = (amount: number | string | undefined): string => {
    if (amount === undefined || amount === null) return '$0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `$${numAmount.toFixed(2)}`;
  };
  
  /**
   * Formats a date object to localized string
   * @param date Date to format
   * @returns Formatted date string
   */
  export const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return '';
    
    return dateObj.toLocaleDateString();
  };
  
  /**
   * Safely parses a numeric value
   * @param value Value to parse as number
   * @param defaultValue Default if parsing fails
   * @returns Parsed number or default
   */
  export const parseNumberSafe = (value: any, defaultValue = 0): number => {
    if (value === undefined || value === null || value === '') return defaultValue;
    
    const parsed = parseFloat(String(value));
    return isNaN(parsed) ? defaultValue : parsed;
  };
  
  /**
   * Calculates percentage
   * @param value Current value
   * @param total Total value
   * @param decimalPlaces Number of decimal places
   * @returns Formatted percentage
   */
  export const calculatePercentage = (
    value: number, 
    total: number, 
    decimalPlaces = 1
  ): string => {
    if (total === 0) return '0%';
    
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(decimalPlaces)}%`;
  };
  
  /**
   * Groups an array by a key property
   * @param array Array to group
   * @param key Object property to group by
   * @returns Object with grouped items
   */
  export const groupBy = <T>(array: T[], key: keyof T): { [key: string]: T[] } => {
    return array.reduce((result, item) => {
      const groupKey = String(item[key] || 'undefined');
      result[groupKey] = result[groupKey] || [];
      result[groupKey].push(item);
      return result;
    }, {} as { [key: string]: T[] });
  };
  
  /**
   * Creates a date for a given number of days ago
   * @param days Number of days to go back
   * @returns Date object from n days ago
   */
  export const daysAgo = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };
  
  /**
   * Checks if an object has all required fields
   * @param obj Object to check
   * @param fields Array of required field names
   * @returns True if all fields exist and are not empty
   */
  export const hasRequiredFields = (obj: any, fields: string[]): boolean => {
    if (!obj) return false;
    
    return fields.every(field => {
      const value = obj[field];
      return value !== undefined && value !== null && value !== '';
    });
  };
  
  export default {
    formatUserName,
    formatCurrency,
    formatDate,
    parseNumberSafe,
    calculatePercentage,
    groupBy,
    daysAgo,
    hasRequiredFields
  };