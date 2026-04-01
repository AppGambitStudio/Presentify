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
});
