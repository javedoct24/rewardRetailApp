import PropTypes from 'prop-types';
import '../Table.css';

/**
 * MonthlyRewardsTable - Displays aggregated reward points per customer per <month />
 * Date arrive per-sorted (sorted during aggregation not in state) 
*/

function MonthlyRewardsTable({ monthlyRewards }) {
    return (
        <section className="table-section">
            <h2 className="table-title">User Monthly Rewards</h2>
            <div className="table-scroll">
                <table className="rewards-table" aria-label="Monthly rewards points per customer">
                    <thead>
                        <tr>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Name</th>
                            <th scope="col">Month</th>
                            <th scope="col">Year</th>
                            <th scope="col">Reward Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthlyRewards.map((row) => (
                            <tr key={`${row.customerId}-${row.year}-${row.month}`}>
                                <td>{row.customerId}</td>
                                <td>{row.customerName}</td>
                                <td>{row.monthName}</td>
                                <td>{row.year}</td>
                                <td className="points-cell">{row.rewardPoints}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

MonthlyRewardsTable.propTypes = {
    monthlyRewards: PropTypes.arrayOf(
        PropTypes.shape({
            customerId: PropTypes.string.isRequired,
            customerName: PropTypes.string.isRequired,
            month: PropTypes.number.isRequired,
            monthName: PropTypes.string.isRequired,
            year: PropTypes.number.isRequired,
            rewardPoints: PropTypes.number.isRequired
        })
    ).isRequired
}; 

export default MonthlyRewardsTable;