import { render, screen } from "@testing-library/react";
import { Heading } from "@/components/slides/Heading";

describe("Heading", () => {
  test("renders h1 for level 1", () => {
    render(<Heading text="Hello World" level={1} />);
    const el = screen.getByRole("heading", { level: 1 });
    expect(el).toHaveTextContent("Hello World");
  });

  test("renders h2 for level 2", () => {
    render(<Heading text="Subtitle" level={2} />);
    const el = screen.getByRole("heading", { level: 2 });
    expect(el).toHaveTextContent("Subtitle");
  });

  test("renders accentText in primary color span", () => {
    render(<Heading text="Before " level={1} accentText="Highlighted" />);
    const accent = screen.getByText("Highlighted");
    expect(accent.tagName).toBe("SPAN");
    expect(accent.style.color).toBe("var(--slide-primary)");
  });

  test("applies text alignment", () => {
    render(<Heading text="Centered" level={1} align="center" />);
    const el = screen.getByRole("heading", { level: 1 });
    expect(el.className).toContain("text-center");
  });
});
