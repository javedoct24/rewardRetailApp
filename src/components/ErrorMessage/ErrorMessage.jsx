import PropTypes from 'prop-types';
import './ErrorMessage.css';
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-wrapper" role="alert">
      <p className="error-text"> {message}</p>
      {onRetry && (<button type="button" className="retry-btn" onClick={onRetry}>Retry</button>)}
    </div>
  );
} 

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

ErrorMessage.defaultProps = {
  onRetry: null,
};

export default ErrorMessage;