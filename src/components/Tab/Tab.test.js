import { fireEvent, render, screen } from "@testing-library/react";
import Tab from "./Tab";

describe("Tab Component", () => {
  const mockSetActiveTab = jest.fn();

  const tabs = ["Tab 1", "Tab 2", "Tab 3"];

  it("renders the tabs correctly", () => {
    render(<Tab tabs={tabs} activeTab={0} setActiveTab={mockSetActiveTab} />);

    tabs.forEach((tab) => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it("applies the active class to the active tab", () => {
    render(<Tab tabs={tabs} activeTab={1} setActiveTab={mockSetActiveTab} />);

    const activeTab = screen.getByText("Tab 2");
    expect(activeTab).toHaveClass("active");

    const nonActiveTab = screen.getByText("Tab 1");
    expect(nonActiveTab).not.toHaveClass("active");
  });

  it("calls setActiveTab when a tab is clicked", () => {
    render(<Tab tabs={tabs} activeTab={0} setActiveTab={mockSetActiveTab} />);

    const tab = screen.getByText("Tab 2");
    fireEvent.click(tab);

    expect(mockSetActiveTab).toHaveBeenCalledWith(1); // Tab 2 is at index 1
  });
});
