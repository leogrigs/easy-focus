import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Tab from "./Tab";

describe("Tab Component", () => {
  const tabs = ["Tab 1", "Tab 2", "Tab 3"];

  it("renders the tabs correctly", () => {
    const mockSetActiveTab = vi.fn();
    render(<Tab tabs={tabs} activeTab={0} setActiveTab={mockSetActiveTab} />);
    tabs.forEach((tab) => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });
  });

  it("applies the active class to the active tab", () => {
    const mockSetActiveTab = vi.fn();
    render(<Tab tabs={tabs} activeTab={1} setActiveTab={mockSetActiveTab} />);
    expect(screen.getByText("Tab 2")).toHaveClass("active");
    expect(screen.getByText("Tab 1")).not.toHaveClass("active");
  });

  it("calls setActiveTab when a tab is clicked", () => {
    const mockSetActiveTab = vi.fn();
    render(<Tab tabs={tabs} activeTab={0} setActiveTab={mockSetActiveTab} />);
    fireEvent.click(screen.getByText("Tab 2"));
    expect(mockSetActiveTab).toHaveBeenCalledWith(1);
  });
});
