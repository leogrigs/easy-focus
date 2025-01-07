import PropTypes from "prop-types";
import "./Button.css";

const Button = ({ icon: Icon, className, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      <Icon className={className} />
    </button>
  );
};

Button.propTypes = {
  icon: PropTypes.elementType.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

Button.defaultProps = {
  className: "",
};

export default Button;
