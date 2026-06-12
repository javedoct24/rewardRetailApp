/** 
 * Reward Retail App - rules:
 * - 2 points per dollar spent over $100 
 * - 1 point per dollar spend between $50 and $100
 * - 0 points for purchases %50 and below
 *  - Fractional dollars are floored
*/
import dayjs from 'dayjs';
import {
    POINT_THRESHOLD_HIGH,
    POINTS_THRESHOLD_LOW,
    POINTS_RATE_HIGH,
    POINTS_RATE_LOW,
    MONTH_NAMES,
} from '../constants/index.js';

export const calculatePointsForTransaction = (price) => {
    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
        throw new Error('Invalid price value');
    }

    const dollars = Math.floor(price);
    const lowBand = Math.max(0, Math.min(dollars, POINT_THRESHOLD_HIGH) - POINTS_THRESHOLD_LOW);
    const highBand = Math.max(0, dollars - POINT_THRESHOLD_HIGH);

    return lowBand * POINTS_RATE_LOW + highBand * POINTS_RATE_HIGH;
};

/* Aggregate monthly rewards  points per customer.*/
export const aggregateMonthlyRewards = (transactions) => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    const monthlysMap = transactions.reduce((acc, txn) => {
        const date = dayjs(txn.purchaseDate, 'MMM-DD-YYYY', true);
        if (!date.isValid()) {
            throw new Error(`Invalid purchaseDate: ${txn.purchaseDate}`);
        }

        const month = date.month() + 1;
        const year = date.year();
        const key = `${txn.customerId}-${year}-${month}`;
        const customerName = `${txn.firstName} ${txn.lastName}`;

        if (!acc[key]) {
            acc[key] = {
                customerId: txn.customerId,
                customerName,
                month,
                monthName: MONTH_NAMES[month - 1],
                year,
                rewardPoints: 0,
            };
        }
        acc[key].rewardPoints += calculatePointsForTransaction(txn.price);
        return acc;
    }, {});

    return Object.values(monthlysMap).sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        if (a.month !== b.month) return a.month - b.month;
        return a.customerName.localeCompare(b.customerName);
    });
};

// Aggregate total rewards points per customer across all transactions and sorted alphabetically by customer name
export const aggregateTotalRewards = (transactions) => {
    if (!Array.isArray(transactions) || transactions.length === 0) return [];
    const totalMap = transactions.reduce((acc, txn) => {
        const customerName = `${txn.firstName} ${txn.lastName}`;
        const { customerId } = txn;
        if (!acc[customerId]) {
            acc[customerId] = {
                customerId,
                customerName,
                rewardPoints: 0,
            };
        }
        acc[customerId].rewardPoints += calculatePointsForTransaction(txn.price);
        return acc;
    }, {});

    return Object.values(totalMap).sort((a, b) => a.customerName.localeCompare(b.customerName));
};

/*Sort transactions by purchase date*/
export const sortTransactionsByDate = (transactions) => {
    if (!Array.isArray(transactions)) return [];
    return [...transactions].sort((a, b) => {
        const dateA = dayjs(a.purchaseDate, 'MMM-DD-YYYY', true);
        const dateB = dayjs(b.purchaseDate, 'MMM-DD-YYYY', true);
        if (!dateA.isValid() || !dateB.isValid()) return 0;
        return dateA.valueOf() - dateB.valueOf();
    });
};
