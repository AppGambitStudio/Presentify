import { render, screen } from "@testing-library/react";
import { SlideRenderer } from "@/components/renderer/SlideRenderer";
import type { Slide } from "@/lib/types";

const baseSlide: Slide = {
  id: "test-1",
  number: 1,
  summary: "Test slide",
  title: "Test Title",
  titleAccent: "Title",
  subtitle: "Test subtitle",
  sections: [
    { type: "full", component: "Body", props: { markdown: "Test body content" } },
  ],
  speakerNotes: "",
  decorations: [],
};

describe("SlideRenderer", () => {
  test("renders slide title", () => {
    render(<SlideRenderer slide={baseSlide} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Test Title");
  });

  test("renders subtitle", () => {
    render(<SlideRenderer slide={baseSlide} />);
    expect(screen.getByText("Test subtitle")).toBeInTheDocument();
  });

  test("renders section content", () => {
    render(<SlideRenderer slide={baseSlide} />);
    expect(screen.getByText("Test body content")).toBeInTheDocument();
  });

  test("hides deep sections in summary density mode", () => {
    const slide: Slide = {
      ...baseSlide,
      sections: [
        { type: "full", component: "Body", props: { markdown: "Visible" }, detailLevel: "summary" },
        { type: "full", component: "Body", props: { markdown: "Hidden" }, detailLevel: "deep" },
      ],
    };
    render(<SlideRenderer slide={slide} densityMode="summary" />);
    expect(screen.getByText("Visible")).toBeInTheDocument();
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  test("compresses bullet list items in summary mode", () => {
    const slide: Slide = {
      ...baseSlide,
      sections: [
        {
          type: "full",
          component: "BulletList",
          props: { items: ["One", "Two", "Three", "Four"] },
          detailLevel: "summary",
        },
      ],
    };
    render(<SlideRenderer slide={slide} densityMode="summary" />);
    expect(screen.getByText("...")).toBeInTheDocument();
  });
});
