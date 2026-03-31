import { render, screen, fireEvent } from "@testing-library/react";
import { PresentationRenderer } from "@/components/renderer/PresentationRenderer";
import type { PresentationConfig } from "@/lib/types";

const sampleConfig: PresentationConfig = {
  id: "test", createdAt: "2026-01-01", lastModified: "2026-01-01",
  title: "Test Presentation",
  speaker: { name: "Test Speaker", role: "Tester", organization: "TestCo" },
  audience: "Testers", purpose: "Testing", duration: 10,
  tone: ["professional"], keyPoints: [], dos: [], donts: [],
  theme: {
    name: "Test", primaryColor: "#FF9900", accentColor: "#0073BB",
    backgroundColor: "#0f1115", textColor: "#ffffff",
    fontHeading: "Space Grotesk", fontBody: "Inter",
    style: "glass-morphism", darkMode: true,
  },
  slides: [
    { id: "s1", number: 1, summary: "First", title: "Slide One", sections: [], speakerNotes: "", decorations: [] },
    { id: "s2", number: 2, summary: "Second", title: "Slide Two", sections: [], speakerNotes: "", decorations: [] },
  ],
};

describe("PresentationRenderer", () => {
  test("renders first slide on mount", () => {
    render(<PresentationRenderer config={sampleConfig} />);
    expect(screen.getByText("Slide One")).toBeInTheDocument();
  });

  test("shows slide counter", () => {
    render(<PresentationRenderer config={sampleConfig} />);
    const counters = screen.getAllByText("1 / 2");
    expect(counters.length).toBeGreaterThanOrEqual(1);
  });

  test("navigates to next slide on ArrowRight", () => {
    render(<PresentationRenderer config={sampleConfig} />);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    const counters = screen.getAllByText("2 / 2");
    expect(counters.length).toBeGreaterThanOrEqual(1);
  });
});
