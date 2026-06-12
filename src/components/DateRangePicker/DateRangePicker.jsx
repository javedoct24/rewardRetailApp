import PropTypes from 'prop-types';
import './DateRangePicker.css';

function DateRangePicker({ startDate, endDate, onRangeChange, validationMessage }) {
  return (
    <section className="date-range-picker">
      <div className="date-range-row">
        <label>
          Start date
          <input
            type="date"
            value={startDate}
            onChange={(event) => onRangeChange('startDate', event.target.value)}
          />
        </label>
        <label>
          End date
          <input
            type="date"
            value={endDate}
            onChange={(event) => onRangeChange('endDate', event.target.value)}
          />
        </label>
      </div>
      <p className="date-range-note">Showing up to 90 days of data. Select a smaller range to filter.</p>
      {validationMessage && <p className="date-range-error" role="alert">{validationMessage}</p>}
    </section>
  );
}

DateRangePicker.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onRangeChange: PropTypes.func.isRequired,
  validationMessage: PropTypes.string,
};

DateRangePicker.defaultProps = {
  validationMessage: '',
};

export default DateRangePicker;
