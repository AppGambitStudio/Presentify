import { render, screen } from "@testing-library/react";
import { CTABox } from "@/components/slides/CTABox";

describe("CTABox", () => {
  test("renders text content", () => {
    render(<CTABox text="Take action now!" />);
    expect(screen.getByText("Take action now!")).toBeInTheDocument();
  });

  test("uses primary color as background by default", () => {
    const { container } = render(<CTABox text="CTA" />);
    const box = container.firstChild as HTMLElement;
    expect(box.style.backgroundColor).toBe("var(--slide-primary)");
  });
});
