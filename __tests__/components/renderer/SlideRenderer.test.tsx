import { render, screen } from "@testing-library/react";
import { SlideRenderer } from "@/components/renderer/SlideRenderer";
import type { Slide } from "@/lib/types";

const testSlide: Slide = {
  id: "test-1",
  number: 1,
  summary: "Test slide",
  layout: { columns: "1fr", rows: "auto auto", gap: "1rem" },
  cells: [
    {
      id: "c1",
      gridArea: "1 / 1 / 2 / 2",
      component: "Heading",
      props: { text: "Test Title", level: 1 },
    },
    {
      id: "c2",
      gridArea: "2 / 1 / 3 / 2",
      component: "Body",
      props: { markdown: "Test body content" },
    },
  ],
  speakerNotes: "",
  animations: "fade",
  decorations: [],
};

describe("SlideRenderer", () => {
  test("renders slide with heading and body from cells", () => {
    render(<SlideRenderer slide={testSlide} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
    expect(screen.getByText("Test body content")).toBeInTheDocument();
  });

  test("applies grid layout styles", () => {
    const { container } = render(<SlideRenderer slide={testSlide} />);
    const grid = container.querySelector("[data-slide-grid]") as HTMLElement;
    expect(grid.style.gridTemplateColumns).toBe("1fr");
    expect(grid.style.gridTemplateRows).toBe("auto auto");
    expect(grid.style.gap).toBe("1rem");
  });

  test("applies gridArea to each cell", () => {
    const { container } = render(<SlideRenderer slide={testSlide} />);
    const cells = container.querySelectorAll("[data-cell-id]");
    expect(cells).toHaveLength(2);
    expect((cells[0] as HTMLElement).style.gridArea).toBe("1 / 1 / 2 / 2");
  });
});
