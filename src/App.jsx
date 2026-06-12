import dayjs from 'dayjs';
import {
  aggregateMonthlyRewards,
  aggregateTotalRewards,
  sortTransactionsByDate,
} from './utils/calculateRewards';
import { useTransactionData } from './hooks/useTransactionData';
import { DATE_FORMAT_DISPLAY } from './constants/index.js';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import TransactionTable from './components/TransactionTable/TransactionTable.jsx';
import MonthlyRewardsTable from './components/MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewardsTable/TotalRewardsTable';
import DateRangePicker from './components/DateRangePicker/DateRangePicker';
import './App.css';

function App() {
  const {
    transactions,
    loading,
    error,
    dateRange,
    validationMessage,
    filteredTransactions,
    loadTransactions,
    handleRangeChange,
  } = useTransactionData();

  const sortedTransaction = sortTransactionsByDate(filteredTransactions);
  const monthlyRewards = aggregateMonthlyRewards(filteredTransactions);
  const totalRewards = aggregateTotalRewards(filteredTransactions);

  const formatDateRange = () =>
    `${dayjs(dateRange.startDate).format(DATE_FORMAT_DISPLAY)} - ${dayjs(dateRange.endDate).format(DATE_FORMAT_DISPLAY)}`;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadTransactions} />;
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
            <p>No total rewards data available for the selected date range ({formatDateRange()}).</p>
          </section>
        )}

        <hr />

        <MonthlyRewardsTable monthlyRewards={monthlyRewards} />
        {monthlyRewards.length === 0 && (
          <section className="no-data-message">
            <p>No monthly rewards data available for the selected date range ({formatDateRange()}).</p>
          </section>
        )}

        <hr />

        <TransactionTable transactions={sortedTransaction} />
        {sortedTransaction.length === 0 && (
          <section className="no-data-message">
            <p>No transaction data available for the selected date range ({formatDateRange()}).</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
