import {useState, useEffect} from 'react';
import { fetchTransactions } from './api/api';
import {aggregateMonthlyRewards, aggregateTotalRewards, sortTransactionsByDate} from './utils/calculateRewards';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner.jsx';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import TransactionTable from './components/TransactionTable/TransactionTable.jsx';
import MonthlyRewardsTable from './components/MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from './components/TotalRewardsTable/TotalRewardsTable';
import logger from './utils/logger';
import './App.css';

function App() {
  const [appState, setAppState] = useState({
    transactions: [],
    loading: true,
    error: null
  });

  const loadTransactions =  () => {
    setAppState((prev) => ({...prev, loading: true, error: null }));

    fetchTransactions()
    .then((data) => {
      logger.info('Transaction loaded ', data.length);
      setAppState({transactions: data, loading: false, error: null});
    })
    .catch((err)=> {
      logger.error('Failed to load transactions', err);
      setAppState({
        transactions: [],
        loading: false,
        error: err.message || 'Failed to load data',
      });
    });
  }

  useEffect(()=>{
    loadTransactions();
  }, []);

  //Derived data - computed at render time, Not stored in state

  const sortedTransaction = sortTransactionsByDate(appState.transactions);
  const monthlyRewards = aggregateMonthlyRewards(appState.transactions);
  const totalRewards = aggregateTotalRewards(appState.transactions);

  if (appState.loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Customer Rewards</h1>
        <p className="app-subtitle">
          Showing reward points earned over the list 3 months
        </p>
      </header>
      <main className="app-main">
        <TotalRewardsTable totalRewards={totalRewards} />
        <hr />
        <MonthlyRewardsTable monthlyRewards={monthlyRewards} />
        <hr />
        <TransactionTable transactions={sortedTransaction} />
      </main>
    </div>
  )
}
export default App;