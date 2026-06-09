import transactionData from '../data/transactions.js';
import logger from '../utils/logger.js'

/**
 * Fetch all transactions, Returns a promise that resolved with the transaction data.
*/

export const fetchTransactions = () => {
    logger.info('fetchTransactions called');
    return Promise.resolve(transactionData);
};