import { Clock } from "lucide-react";
import PropTypes from "prop-types";
import "./Title.css";

const Title = ({ label }) => {
  return (
    <div className="title-container">
      <Clock className="title--icon" />
      <h1 className="title">{label}</h1>
    </div>
  );
};

Title.propTypes = {
  label: PropTypes.string,
};

Title.defaultProps = {
  label: "EASY FOCUS",
};

export default Title;
