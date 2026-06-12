import PropTypes from 'prop-types';
import GenericTable from '../GenericTable/GenericTable';
import '../Table.css';

/**
 * MonthlyRewardsTable - Displays aggregated reward points per customer per month.
 */

function MonthlyRewardsTable({ monthlyRewards }) {
    const columns = [
        { header: 'Customer ID', accessor: 'customerId' },
        { header: 'Customer Name', accessor: 'customerName' },
        { header: 'Month', accessor: 'monthName' },
        { header: 'Year', accessor: 'year' },
        {
            header: 'Reward Points',
            accessor: 'rewardPoints',
            className: 'points-cell',
        },
    ];

    return (
        <GenericTable
            title="User Monthly Rewards"
            ariaLabel="Monthly rewards points per customer"
            columns={columns}
            data={monthlyRewards}
            rowKey={(row) => `${row.customerId}-${row.year}-${row.month}`}
        />
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
            rewardPoints: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default MonthlyRewardsTable;