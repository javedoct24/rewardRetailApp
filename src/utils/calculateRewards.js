/** 
 * Reward Retail App - rules:
 * - 2 points per dollar spent over $100 
 * - 1 point per dollar spend between $50 and $100
 * - 0 points for purchases %50 and below
 *  - Fractional dollars are floored
*/
import {
    POINT_THRESHOLD_HIGH,
    POINTS_THRESHOLD_LOW,
    POINTS_RATE_HIGH,
    POINTS_RATE_LOW,
    MONTH_NAMES,
} from '../constants/index.js';

export const calculatePointsForTransaction = (price) => {
    if (typeof price !== 'number' || price < 0) {
        return 0; // Invalid price, no points
    }
    // points for the portion above $100 (floored)
    const highBandPoints = price > POINT_THRESHOLD_HIGH
        ? Math.floor(price - POINT_THRESHOLD_HIGH) * POINTS_RATE_HIGH
        : 0;
    // points for the portion between $50 and $100 (floored)
    const lowBandPoints = price > POINTS_THRESHOLD_LOW
        ? Math.floor(Math.min(price, POINT_THRESHOLD_HIGH) - POINTS_THRESHOLD_LOW) * POINTS_RATE_LOW
        : 0;

    return highBandPoints + lowBandPoints;
};

/* Aggregate monthly rewards  points per customer.*/
export const aggregateMonthlyRewards = (transactions) => {
    if(!Array.isArray(transactions) || transactions.length === 0) return [];
    
    //use reduce instead of forEach to build the aggregation in one pass
    const monthlysMap = transactions.reduce((acc, txn) => {
        const date = new Date(txn.purchaseDate);
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();
        const key = `${txn.customerId}-${year}-${month}`;

        if (!acc[key]) {
            acc[key] = {
                customerId: txn.customerId,
                customerName: txn.customerName,
                month,
                monthName: MONTH_NAMES[month - 1],
                year,
                rewardPoints: 0,
            };
        }
        acc[key] = {
            ...acc[key],
            rewardPoints: acc[key].rewardPoints + calculatePointsForTransaction(txn.price),
        };
        return acc;
    }, {});

    // Sort by year -> month -> customer name
    return Object.values(monthlysMap).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return a.customerName.localeCompare(b.customerName);
    }); 
};

// Aggregate total rewards points per customer across all transactions and sorted alphabetically by customer name
export const aggregateTotalRewards = (transactions) => {
    if(!Array.isArray(transactions) || transactions.length === 0) return [];
    const totalMap = transactions.reduce((acc, txn) => {
        const {customerId, customerName} = txn;
        if (!acc[customerId]) {
            acc[customerId] = {
                customerId,
                customerName,
                rewardPoints: 0
            };
        }
        acc[customerId] = {
            ...acc[customerId],
            rewardPoints: acc[customerId].rewardPoints + calculatePointsForTransaction(txn.price)
        };
        return acc;
    }, {});

    return Object.values(totalMap).sort((a, b) => a.customerName.localeCompare(b.customerName));
};

/*Sort transactions by purchase date*/
export const sortTransactionsByDate = (transactions) => {
    if(!Array.isArray(transactions)) return [];
    return [...transactions].sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));
};
