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

    test('returns 0 for purchases at or below %50', () => {
        expect(calculatePointsForTransaction(40)).toBe(0);
        expect(calculatePointsForTransaction(50)).toBe(0);
    });

    test('returns correct points between %50 and $100 - $75 -> 25 pts', () => { 
        expect(calculatePointsForTransaction(75)).toBe(25); // 25 points for $25 above $50
    });

    test('returns 50 pts for exaclty $100', () => {
        expect(calculatePointsForTransaction(100)).toBe(50); // 50 points for $50 above $50
    });

    test('handles decimal just above $50 - %50.1 -> 0 pts (floor) ', () => {
        expect(calculatePointsForTransaction(50.1)).toBe(0); // still 0 points as we floor the amount
    });

    test('handles decimal - $100.4 -> 50 pts (floor kills the 0.4)', () => {
        expect(calculatePointsForTransaction(100.4)).toBe(50); // 50 points for $50 above $50, no points for the 0.4 above $100
    });

    test('handle decimnal - $100.9 -> pts (floor, no high-band)', () => {
        expect(calculatePointsForTransaction(100.9)).toBe(50); // 50 points for $50 above $50, no points for the 0.9 above $100
    });

    test('returns 90 pts for $120', () => {
        // 2x20 + 1x50 = 40 + 50 = 90 points
        expect(calculatePointsForTransaction(120)).toBe(90); // 50 points for $50 between $50 and $100 + 40 points for $20 above $100
    });

    test('handles large amounts - $250 -> 2x150 + 1x50 = 350 pts', () => {
        expect(calculatePointsForTransaction(250)).toBe(350); // 50 points for $50 between $50 and $100 + 200 points for $100 above $100
    });

    test('returns 0 for negative price', () => {
        expect(calculatePointsForTransaction(-10)).toBe(0);
    });

    test('returns 0 for non-numeric input', () => {
        expect(calculatePointsForTransaction('abc')).toBe(0);
        expect(calculatePointsForTransaction(null)).toBe(0);
        expect(calculatePointsForTransaction(undefined)).toBe(0);
    });
});

// --- aggregateMonthlyRewards tests ---
describe('aggregateMonthlyRewards', () => {
    const transactions = [
        {
            transactionId: 'T001',
            customerId: 'C001',
            customerName: 'Alice',
            purchaseDate: '2025-12-15',
            productPurchase: 'TV',
            price: 120, // 90 points
        },
        {
            transactionId: 'T002',
            customerId: 'C001',
            customerName: 'Alice',
            purchaseDate: '2026-01-10',
            productPurchase: 'Laptop',
            price: 200,
        },
        {
            transactionId: 'T003',
            customerId: 'C002',
            customerName: 'Bob',
            purchaseDate: '2025-12-28',
            productPurchase: 'Tablet',
            price: 75, // 25 points 
        },
        {
            transactionId: 'T004',
            customerId: 'C001',
            customerName: 'Alice',
            purchaseDate: '2025-12-28',
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

    test('correctly groups Alice Dec 2025 transaction: 90 + 30 = 120 pts', () => {
        const result = aggregateMonthlyRewards(transactions);
        const aliceDec2025 = result.find(r => r.customerId === 'C001' && r.year === 2025 && r.month === 12);
        expect(aliceDec2025).toBeDefined();
        expect(aliceDec2025.rewardPoints).toBe(120);
    });

    test('correctly isolates Alice Jan 2026 (Year boundary) - 250 pts', () => {
        const result = aggregateMonthlyRewards(transactions);
        const aliceJan2026 = result.find(r => r.customerId === 'C001' && r.year === 2026 && r.month === 1);
        expect(aliceJan2026).toBeDefined();
        expect(aliceJan2026.rewardPoints).toBe(250);
    });

    test('does NOT merge Dec 2025 and Jan 2026 into the same bucket', () => {
        const result = aggregateMonthlyRewards(transactions);
        expect(result[0].year).toBe(2025);
        expect(result[0].month).toBe(12);
        expect(result[0].customerName).toBe('Alice');
        expect(result[1].customerName).toBe('Bob');
        expect(result[2].year).toBe(2026);
        expect(result[2].month).toBe(1);
    });

    test('monthName field is populated correctly', () => {
        const result = aggregateMonthlyRewards(transactions);
        const dec = result.find(r => r.month === 12);
        const jan = result.find(r => r.month === 1);
        expect(dec.monthName).toBe('December');
        expect(jan.monthName).toBe('January');
    });
});
// -- aggregateTotalRewards tests ---

describe('aggregateTotalRewards', () => {
    const transactions = [
        { transactionId: 'T001', customerId: 'C001', customerName: 'Alice', purchaseDate: '2026-01-05', productPurchase: 'TV', price: 120 },
        { transactionId: 'T002', customerId: 'C001', customerName: 'Alice', purchaseDate: '2026-02-10', productPurchase: 'phone', price: 80 }, 
        { transactionId: 'T003', customerId: 'C002', customerName: 'Bob', purchaseDate: '2026-01-15', productPurchase: 'Tablet', price: 200 },
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
        expect(result[0].customerName).toBe('Alice');
        expect(result[1].customerName).toBe('Bob');
    });
}); 

//--- sortTransactionsByDate tests ---

describe('sortTransactionsByDate', () => {
    const transactions = [
        { transactionId: 'T002', purchaseDate: '2026-02-01', price: 80 },
        { transactionId: 'T001', purchaseDate: '2025-12-01', price: 120 },
        { transactionId: 'T003', purchaseDate: '2026-01-15', price: 75 },
    ];

    test('sorts transactions by date ascending', () => {
        const sorted = sortTransactionsByDate(transactions);
        expect(sorted[0].transactionId).toBe('T001');
        expect(sorted[1].transactionId).toBe('T003');
        expect(sorted[2].transactionId).toBe('T002');
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