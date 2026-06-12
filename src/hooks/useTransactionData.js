import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { fetchTransactions } from '../api/api';
import { MAX_DAYS, DATE_FORMAT_INPUT, DATE_FORMAT_TRANSACTION } from '../constants/index.js';
import logger from '../utils/logger.js';

/**
 * Custom hook for managing transaction data fetching and filtering.
 * Handles loading state, error management, and date range filtering.
 */
export const useTransactionData = () => {
  const [dataState, setDataState] = useState({
    transactions: [],
    loading: true,
    error: null,
  });
  const [dateRange, setDateRange] = useState(() => {
    const today = dayjs();
    return {
      startDate: today.subtract(MAX_DAYS - 1, 'day').format(DATE_FORMAT_INPUT),
      endDate: today.format(DATE_FORMAT_INPUT),
    };
  });
  const [validationMessage, setValidationMessage] = useState('');

  const loadTransactions = () => {
    setDataState((prev) => ({ ...prev, loading: true, error: null }));

    fetchTransactions()
      .then((data) => {
        logger.info('Transactions loaded:', data.length);
        setDataState({ transactions: data, loading: false, error: null });
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err) || 'Failed to load data';
        logger.error('Transaction fetch failed:', errorMessage);
        setDataState({
          transactions: [],
          loading: false,
          error: errorMessage,
        });
      });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRangeChange = (field, value) => {
    const nextRange = { ...dateRange, [field]: value };
    const start = dayjs(nextRange.startDate, DATE_FORMAT_INPUT, true);
    const end = dayjs(nextRange.endDate, DATE_FORMAT_INPUT, true);
    let validation = '';

    if (!start.isValid() || !end.isValid()) {
      validation = 'Please enter valid start and end dates.';
    } else if (end.isBefore(start, 'day')) {
      validation = 'End date cannot be before start date.';
    } else if (end.diff(start, 'day') + 1 > MAX_DAYS) {
      validation = `Please select a date range of ${MAX_DAYS} days or fewer.`;
    }

    setValidationMessage(validation);
    setDateRange(nextRange);
  };

  const filteredTransactions = useMemo(() => {
    if (!Array.isArray(dataState.transactions) || dataState.transactions.length === 0) {
      return [];
    }

    const start = dayjs(dateRange.startDate, DATE_FORMAT_INPUT, true);
    const end = dayjs(dateRange.endDate, DATE_FORMAT_INPUT, true);

    if (!start.isValid() || !end.isValid()) {
      return dataState.transactions;
    }

    return dataState.transactions.filter((txn) => {
      const purchaseDate = dayjs(txn.purchaseDate, DATE_FORMAT_TRANSACTION, true);
      return (
        purchaseDate.isValid() &&
        !purchaseDate.isBefore(start, 'day') &&
        !purchaseDate.isAfter(end, 'day')
      );
    });
  }, [dataState.transactions, dateRange]);

  return {
    ...dataState,
    dateRange,
    validationMessage,
    filteredTransactions,
    loadTransactions,
    handleRangeChange,
  };
};
