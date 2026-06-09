import PropTypes from "prop-types";
import "./LoadingSpinner.css";
/**
 * LoadingSpinner component to display a loading spinner while data is being fetched.
*/

function LoadingSpinner({ message }) {
    return (
        <div className="spinner-wrapper" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            {message && <p className="spinner-message"  > {message}</p>}
        </div>
    );
}

LoadingSpinner.propTypes = {
    message: PropTypes.string
};
  
LoadingSpinner.defaultProps = {
    message: "Loading..."
};

export default LoadingSpinner;