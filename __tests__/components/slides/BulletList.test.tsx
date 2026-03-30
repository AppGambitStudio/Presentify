import { render, screen } from "@testing-library/react";
import { BulletList } from "@/components/slides/BulletList";

describe("BulletList", () => {
  test("renders all items", () => {
    render(<BulletList items={["First", "Second", "Third"]} />);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  test("renders correct number of list items", () => {
    const { container } = render(<BulletList items={["A", "B", "C", "D"]} />);
    const items = container.querySelectorAll("li");
    expect(items).toHaveLength(4);
  });
});
