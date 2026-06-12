import PropTypes from "prop-types";
import dayjs from 'dayjs';
import { calculatePointsForTransaction } from "../../utils/calculateRewards";
import GenericTable from '../GenericTable/GenericTable';
import '../Table.css';

/** 
 * TransactionTable - Displays all transactions records sorted by purchase date.
 * Reward points are computed on the fly from the price; they are NOT sorted in state.
 */

function TransactionTable({ transactions }) {
    const columns = [
        { header: 'Transaction ID', accessor: 'transactionId' },
        {
            header: 'Customer Name',
            render: (txn) => `${txn.firstName} ${txn.lastName}`,
        },
        {
            header: 'Purchase Date',
            render: (txn) => dayjs(txn.purchaseDate, 'MMM-DD-YYYY', true).format('MMM DD, YYYY'),
        },
        { header: 'Product Purchase', accessor: 'productPurchase' },
        {
            header: 'Price ($)',
            render: (txn) => `$${txn.price.toFixed(2)}`,
        },
        {
            header: 'Reward Points',
            render: (txn) => calculatePointsForTransaction(txn.price),
            className: 'points-cell',
        },
    ];

    return (
        <GenericTable
            title="All Transactions"
            ariaLabel="All transactions sorted by purchase date"
            columns={columns}
            data={transactions}
            rowKey="transactionId"
        />
    );
}

TransactionTable.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            transactionId: PropTypes.string.isRequired,
            customerId: PropTypes.string.isRequired,
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
            purchaseDate: PropTypes.string.isRequired,
            productPurchase: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default TransactionTable;