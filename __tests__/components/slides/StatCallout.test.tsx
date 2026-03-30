import { render, screen } from "@testing-library/react";
import { StatCallout } from "@/components/slides/StatCallout";

describe("StatCallout", () => {
  test("renders value and label", () => {
    render(<StatCallout value="$200" label="Free Credits" />);
    expect(screen.getByText("$200")).toBeInTheDocument();
    expect(screen.getByText("Free Credits")).toBeInTheDocument();
  });

  test("value is displayed larger than label", () => {
    render(<StatCallout value="12" label="Certifications" />);
    const value = screen.getByText("12");
    expect(value.className).toContain("text-5xl");
  });
});
