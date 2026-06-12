import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { fetchTransactions } from './api/api';
import {
  aggregateMonthlyRewards,
  aggregateTotalRewards,
  sortTransactionsByDate,
} from './utils/calculateRewards';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import TransactionTable from './components/TransactionTable/TransactionTable.jsx';
import MonthlyRewardsTable from './components/MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewardsTable/TotalRewardsTable';
import DateRangePicker from './components/DateRangePicker/DateRangePicker';
import logger from './utils/logger';
import './App.css';

const MAX_DAYS = 90;

function App() {
  const today = dayjs();
  const defaultDateRange = {
    startDate: today.subtract(MAX_DAYS - 1, 'day').format('YYYY-MM-DD'),
    endDate: today.format('YYYY-MM-DD'),
  };

  const [appState, setAppState] = useState({
    transactions: [],
    loading: true,
    error: null,
  });
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const [validationMessage, setValidationMessage] = useState('');

  const loadTransactions = () => {
    setAppState((prev) => ({ ...prev, loading: true, error: null }));

    fetchTransactions()
      .then((data) => {
        logger.info('Transaction loaded ', data.length);
        setAppState({ transactions: data, loading: false, error: null });
      })
      .catch((err) => {
        logger.error('Failed to load transactions', err);
        setAppState({
          transactions: [],
          loading: false,
          error: err instanceof Error ? err.message : String(err) || 'Failed to load data',
        });
      });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRangeChange = (field, value) => {
    const nextRange = { ...dateRange, [field]: value };
    const start = dayjs(nextRange.startDate, 'YYYY-MM-DD', true);
    const end = dayjs(nextRange.endDate, 'YYYY-MM-DD', true);
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
    if (!Array.isArray(appState.transactions) || appState.transactions.length === 0) {
      return [];
    }

    const start = dayjs(dateRange.startDate, 'YYYY-MM-DD', true);
    const end = dayjs(dateRange.endDate, 'YYYY-MM-DD', true);

    if (!start.isValid() || !end.isValid()) {
      return appState.transactions;
    }

    return appState.transactions.filter((txn) => {
      const purchaseDate = dayjs(txn.purchaseDate, 'MMM-DD-YYYY', true);
      return (
        purchaseDate.isValid() &&
        !purchaseDate.isBefore(start, 'day') &&
        !purchaseDate.isAfter(end, 'day')
      );
    });
  }, [appState.transactions, dateRange]);

  const sortedTransaction = sortTransactionsByDate(filteredTransactions);
  const monthlyRewards = aggregateMonthlyRewards(filteredTransactions);
  const totalRewards = aggregateTotalRewards(filteredTransactions);

  if (appState.loading) {
    return <LoadingSpinner />;
  }

  if (appState.error) {
    return <ErrorMessage message={appState.error} onRetry={loadTransactions} />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Customer Rewards</h1>
        <p className="app-subtitle">Showing reward points for the selected date range.</p>
      </header>

      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onRangeChange={handleRangeChange}
        validationMessage={validationMessage}
      />

      <main className="app-main">
        <TotalRewardsTable totalRewards={totalRewards} />
        {totalRewards.length === 0 && (
          <section className="no-data-message">
            <p>No total rewards data available for the selected date range ({dayjs(dateRange.startDate).format('MMM DD, YYYY')} - {dayjs(dateRange.endDate).format('MMM DD, YYYY')}).</p>
          </section>
        )}

        <hr />

        <MonthlyRewardsTable monthlyRewards={monthlyRewards} />
        {monthlyRewards.length === 0 && (
          <section className="no-data-message">
            <p>No monthly rewards data available for the selected date range ({dayjs(dateRange.startDate).format('MMM DD, YYYY')} - {dayjs(dateRange.endDate).format('MMM DD, YYYY')}).</p>
          </section>
        )}

        <hr />

        <TransactionTable transactions={sortedTransaction} />
        {sortedTransaction.length === 0 && (
          <section className="no-data-message">
            <p>No transaction data available for the selected date range ({dayjs(dateRange.startDate).format('MMM DD, YYYY')} - {dayjs(dateRange.endDate).format('MMM DD, YYYY')}).</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
