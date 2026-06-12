import logger from '../utils/logger.js';

/**
 * Fetch all transactions from the public JSON mock file.
 */
export const fetchTransactions = async () => {
    logger.info('fetchTransactions called');

    const response = await fetch('/transactions.json');
    if (!response.ok) {
        throw new Error(`Failed to load transactions: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
        throw new Error('Invalid mock transaction data format');
    }

    return data;
};