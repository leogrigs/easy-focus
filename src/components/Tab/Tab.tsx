import "./Tab.css";

interface TabProps {
  tabs: string[];
  activeTab: number;
  setActiveTab: (index: number) => void;
}

const Tab = ({ tabs, activeTab, setActiveTab }: TabProps) => {
  return (
    <div className="tab">
      {tabs.map((tab, index) => (
        <button
          key={tab}
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

export default Tab;
