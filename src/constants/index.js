// Reward points calculation threshold are rates
export const POINT_THRESHOLD_HIGH = 100; //purchases above this get POINTS_THRESHOLD_HIGH per dollar
export const POINTS_THRESHOLD_LOW = 50; // purchases above this (up to HIGH) get POINTS_RATE_LOW per dollar
export const POINTS_RATE_HIGH = 2; // points per dollar above THRESHOLD_HIGH
export const POINTS_RATE_LOW = 1; // points per dollar between THRESHOLD_LOW and THRESHOLD_HIGH

// Date and UI configuration
export const MAX_DAYS = 90; // maximum date range selection in days
export const DATE_FORMAT_DISPLAY = 'MMM DD, YYYY'; // format for displaying dates to users
export const DATE_FORMAT_INPUT = 'YYYY-MM-DD'; // format for date input fields
export const DATE_FORMAT_TRANSACTION = 'MMM-DD-YYYY'; // format for transaction purchase dates

//Month name mapping for display
export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];