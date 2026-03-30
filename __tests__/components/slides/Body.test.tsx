import { render, screen } from "@testing-library/react";
import { Body } from "@/components/slides/Body";

describe("Body", () => {
  test("renders markdown text as paragraph", () => {
    render(<Body markdown="Hello **world**" />);
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
  });

  test("renders bold text with strong tag", () => {
    const { container } = render(<Body markdown="This is **bold** text" />);
    const strong = container.querySelector("strong");
    expect(strong).toHaveTextContent("bold");
  });

  test("renders italic text with em tag", () => {
    const { container } = render(<Body markdown="This is *italic* text" />);
    const em = container.querySelector("em");
    expect(em).toHaveTextContent("italic");
  });
});
