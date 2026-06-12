import PropTypes from 'prop-types';
import GenericTable from '../GenericTable/GenericTable';
import '../Table.css';

/** 
 * TotalRewardsTable - Displays total reward accumulated rewards points per customer.
 * Data arrives pre-sorted alphabetically by customerName
 */
function TotalRewardsTable({ totalRewards }) {
    const columns = [
        { header: 'Customer Name', accessor: 'customerName' },
        {
            header: 'Total Reward Points',
            accessor: 'rewardPoints',
            className: 'points-cell',
        },
    ];

    return (
        <GenericTable
            title="Total Rewards"
            ariaLabel="Total rewards points per customer"
            columns={columns}
            data={totalRewards}
            rowKey="customerId"
        />
    );
}

TotalRewardsTable.propTypes = {
    totalRewards: PropTypes.arrayOf(
        PropTypes.shape({
            customerId: PropTypes.string.isRequired,
            customerName: PropTypes.string.isRequired,
            rewardPoints: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default TotalRewardsTable;