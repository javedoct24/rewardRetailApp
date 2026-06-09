import PropTypes from "prop-types";
import { calculatePointsForTransaction } from "../../utils/calculateRewards";
import "../Table.css";
/** 
 * TransactionTable - Displays all transactions records sorted by purchase date.
 * Reward points are computed on the fly from the price; they are NOT sorted in state.
 */

function TransactionTable({ transactions }) {
    return (
        <section className="table-section">
            <h2 className="table-title">All Transactions</h2>
            <div className="table-scroll">
                <table className="rewards-table" aria-label="All transactions sorted by purchase date"> 
                    <thead>
                        <tr>
                            <th scope="col">Transaction ID</th>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Purchase Date</th>
                            <th scope="col">Product Purchase</th>
                            <th scope="col">Price ($)</th>
                            <th scope="col">Reward Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.transactionId}>
                                <td>{txn.transactionId}</td>
                                <td>{txn.customerName}</td>
                                <td>{new Date(txn.purchaseDate).toLocaleDateString()}</td>
                                <td>{txn.productPurchase}</td>
                                <td>${txn.price.toFixed(2)}</td>
                                <td className="points-cell">{calculatePointsForTransaction(txn.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

TransactionTable.propTypes = {
    transactions: PropTypes.arrayOf(
        PropTypes.shape({
            transactionId: PropTypes.string.isRequired,
            customerId: PropTypes.string.isRequired,
            customerName: PropTypes.string.isRequired,
            purchaseDate: PropTypes.string.isRequired,
            productPurchase: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
        })
    ).isRequired
};

export default TransactionTable;