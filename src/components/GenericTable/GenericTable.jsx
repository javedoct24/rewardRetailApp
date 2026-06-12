import PropTypes from 'prop-types';
import '../Table.css';

function GenericTable({ title, ariaLabel, columns, data, rowKey }) {
  const getRowKey = (row) => (typeof rowKey === 'function' ? rowKey(row) : row[rowKey]);

  return (
    <section className="table-section">
      <h2 className="table-title">{title}</h2>
      <div className="table-scroll">
        <table className="rewards-table" aria-label={ariaLabel}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.header} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map((column) => (
                  <td key={`${getRowKey(row)}-${column.header}`} className={column.className || undefined}>
                    {column.render ? column.render(row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

GenericTable.propTypes = {
  title: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
      className: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
};

export default GenericTable;
