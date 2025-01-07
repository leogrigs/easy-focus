import React from "react";
import "./Tab.css";
import PropTypes from "prop-types";

const Tab = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="tab">
      {tabs.map((tab, index) => (
        <button
          key={index}
          type="button"
          className={`tab-item ${activeTab === index ? "active" : ""}`}
          onClick={() => setActiveTab(index)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

Tab.propTypes = {
  tabs: PropTypes.array.isRequired,
  activeTab: PropTypes.number.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Tab;
