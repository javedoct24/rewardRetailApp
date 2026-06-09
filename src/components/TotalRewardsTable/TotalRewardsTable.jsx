import PropTypes from 'prop-types';
import '../Table.css';

/** 
 * TotalRewardsTable - Displays total reward accumulated rewards points per customer.
 * Data arrives pre-sorted alphabetically by customeName
 */
function TotalRewardsTable({ totalRewards }) {
    return (
        <section className="table-section">
            <h2 className="table-title">Total Rewards</h2>
            <div className="table-scroll">
                <table className="rewards-table" aria-label="Total rewards points per customer">
                    <thead>
                        <tr>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Total Reward Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {totalRewards.map((row) => (
                            <tr key={row.customerId}>
                                <td>{row.customerName}</td>
                                <td className="points-cell">{row.rewardPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

TotalRewardsTable.propTypes = {
    totalRewards: PropTypes.arrayOf(
        PropTypes.shape({
            customerId: PropTypes.string.isRequired,
            customerName: PropTypes.string.isRequired,
            rewardPoints: PropTypes.number.isRequired
        })
    ).isRequired
};

export default TotalRewardsTable;