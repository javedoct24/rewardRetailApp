/**
 * Unit tests for rewad points calculation utilities.
 * Covers: edge cases, decimal handling, year boundary, multi-customer aggregation.
 * Run with: npm test  
 */

import { calculatePointsForTransaction, aggregateMonthlyRewards, aggregateTotalRewards, sortTransactionsByDate } from './calculateRewards';

// --- calculatePointsForTransaction tests ---
describe('calculatePointsForTransaction', () => {
    test('calculates points for price below low threshold', () => {
        expect(calculatePointsForTransaction(0)).toBe(0);
    });

    test('returns 0 for purchases at or below $50', () => {
        expect(calculatePointsForTransaction(40)).toBe(0);
        expect(calculatePointsForTransaction(50)).toBe(0);
    });

    test('returns correct points between $50 and $100 - $75 -> 25 pts', () => {
        expect(calculatePointsForTransaction(75)).toBe(25);
    });

    test('returns 50 pts for exactly $100', () => {
        expect(calculatePointsForTransaction(100)).toBe(50);
    });

    test('floors decimal values when calculating points', () => {
        expect(calculatePointsForTransaction(50.1)).toBe(0);
        expect(calculatePointsForTransaction(100.4)).toBe(50);
        expect(calculatePointsForTransaction(100.9)).toBe(50);
    });

    test('returns 90 pts for $120', () => {
        expect(calculatePointsForTransaction(120)).toBe(90);
    });

    test('handles 180 and decimal variations consistently', () => {
        expect(calculatePointsForTransaction(180)).toBe(210);
        expect(calculatePointsForTransaction(180.3)).toBe(210);
        expect(calculatePointsForTransaction(180.56)).toBe(210);
        expect(calculatePointsForTransaction(180.99)).toBe(210);
    });

    test('throws error for invalid price', () => {
        expect(() => calculatePointsForTransaction('abc')).toThrow('Invalid price value');
        expect(() => calculatePointsForTransaction(null)).toThrow('Invalid price value');
        expect(() => calculatePointsForTransaction(undefined)).toThrow('Invalid price value');
        expect(() => calculatePointsForTransaction(-10)).toThrow('Invalid price value');
    });
});

// --- aggregateMonthlyRewards tests ---
describe('aggregateMonthlyRewards', () => {
    const transactions = [
        {
            transactionId: 'T001',
            customerId: 'C001',
            firstName: 'Alice',
            lastName: 'Doe',
            purchaseDate: 'Mar-15-2026',
            productPurchase: 'TV',
            price: 120, // 90 points
        },
        {
            transactionId: 'T002',
            customerId: 'C001',
            firstName: 'Alice',
            lastName: 'Doe',
            purchaseDate: 'Apr-10-2026',
            productPurchase: 'Laptop',
            price: 200,
        },
        {
            transactionId: 'T003',
            customerId: 'C002',
            firstName: 'Bob',
            lastName: 'Smith',
            purchaseDate: 'Mar-28-2026',
            productPurchase: 'Tablet',
            price: 75, // 25 points 
        },
        {
            transactionId: 'T004',
            customerId: 'C001',
            firstName: 'Alice',
            lastName: 'Doe',
            purchaseDate: 'Mar-28-2026',
            productPurchase: 'Phone',
            price: 80, // 30 points
        },
    ];

    test('returns empty array for empty input', () => {
        expect(aggregateMonthlyRewards([])).toEqual([]);
    });
    
    test('returns empty array for non array input', () => {
        expect(aggregateMonthlyRewards(null)).toEqual([]);
        expect(aggregateMonthlyRewards(undefined)).toEqual([]);
        expect(aggregateMonthlyRewards({})).toEqual([]);
    } );

    test('correctly groups Alice Mar 2026 transaction: 90 + 30 = 120 pts', () => {
        const result = aggregateMonthlyRewards(transactions);
        const aliceMar2026 = result.find(r => r.customerId === 'C001' && r.year === 2026 && r.month === 3);
        expect(aliceMar2026).toBeDefined();
        expect(aliceMar2026.rewardPoints).toBe(120);
    });

    test('correctly isolates Alice Apr 2026 - 250 pts', () => {
        const result = aggregateMonthlyRewards(transactions);
        const aliceApr2026 = result.find(r => r.customerId === 'C001' && r.year === 2026 && r.month === 4);
        expect(aliceApr2026).toBeDefined();
        expect(aliceApr2026.rewardPoints).toBe(250);
    });

    test('does NOT merge Mar 2026 and Apr 2026 into the same bucket', () => {
        const result = aggregateMonthlyRewards(transactions);
        expect(result[0].year).toBe(2026);
        expect(result[0].month).toBe(3);
        expect(result[0].customerName).toBe('Alice Doe');
        expect(result[1].customerName).toBe('Bob Smith');
        expect(result[2].year).toBe(2026);
        expect(result[2].month).toBe(4);
    });

    test('monthName field is populated correctly', () => {
        const result = aggregateMonthlyRewards(transactions);
        const mar = result.find(r => r.month === 3);
        const apr = result.find(r => r.month === 4);
        expect(mar.monthName).toBe('March');
        expect(apr.monthName).toBe('April');
    });
});
// -- aggregateTotalRewards tests ---

describe('aggregateTotalRewards', () => {
    const transactions = [
        { transactionId: 'T001', customerId: 'C001', firstName: 'Alice', lastName: 'Doe', purchaseDate: 'Mar-05-2026', productPurchase: 'TV', price: 120 },
        { transactionId: 'T002', customerId: 'C001', firstName: 'Alice', lastName: 'Doe', purchaseDate: 'Apr-10-2026', productPurchase: 'phone', price: 80 }, 
        { transactionId: 'T003', customerId: 'C002', firstName: 'Bob', lastName: 'Smith', purchaseDate: 'May-15-2026', productPurchase: 'Tablet', price: 200 },
    ];
    
    test('return empty array for empty input', () => {
        expect(aggregateTotalRewards([])).toEqual([]);
    });

    test('sums all points for Alice: 90 + 30 = 120 pts', () => {
        const result = aggregateTotalRewards(transactions);
        const alice = result.find(r => r.customerId === 'C001');
        expect(alice).toBeDefined();
        expect(alice.rewardPoints).toBe(120);
    });

    test('sums all points for Bob: 250 pts', () => {
        const result = aggregateTotalRewards(transactions);
        const bob = result.find(r => r.customerId === 'C002');
        expect(bob).toBeDefined();
        expect(bob.rewardPoints).toBe(250);
    });

    test('result are sorted alphabetically by customer name', () => {
        const result = aggregateTotalRewards(transactions);
        expect(result[0].customerName).toBe('Alice Doe');
        expect(result[1].customerName).toBe('Bob Smith');
    });
}); 

//--- sortTransactionsByDate tests ---

describe('sortTransactionsByDate', () => {
    const transactions = [
        { transactionId: 'T002', purchaseDate: 'Apr-01-2026', price: 80 },
        { transactionId: 'T001', purchaseDate: 'Mar-01-2026', price: 120 },
        { transactionId: 'T003', purchaseDate: 'May-15-2026', price: 75 },
    ];

    test('sorts transactions by date ascending', () => {
        const sorted = sortTransactionsByDate(transactions);
        expect(sorted[0].transactionId).toBe('T001');
        expect(sorted[1].transactionId).toBe('T002');
        expect(sorted[2].transactionId).toBe('T003');
    });

    test('does not mutate original array', () => {
        const transactionsCopy = [...transactions];
        sortTransactionsByDate(transactions);
        expect(transactions).toEqual(transactionsCopy);
    });

    test('returns empty array for non-array input', () => {
        expect(sortTransactionsByDate(null)).toEqual([]);
        expect(sortTransactionsByDate(undefined)).toEqual([]);
        expect(sortTransactionsByDate({})).toEqual([]);
    });
});