import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@/components/renderer/ThemeProvider";
import type { ThemeConfig } from "@/lib/types";

const testTheme: ThemeConfig = {
  name: "Test Theme",
  primaryColor: "#FF9900",
  accentColor: "#0073BB",
  backgroundColor: "#0f1115",
  textColor: "#ffffff",
  fontHeading: "Space Grotesk",
  fontBody: "Inter",
  style: "glass-morphism",
  darkMode: true,
};

describe("ThemeProvider", () => {
  test("injects CSS custom properties on the wrapper div", () => {
    render(
      <ThemeProvider theme={testTheme}>
        <span data-testid="child">Hello</span>
      </ThemeProvider>
    );
    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();

    const wrapper = child.parentElement!;
    expect(wrapper.style.getPropertyValue("--slide-primary")).toBe("#FF9900");
    expect(wrapper.style.getPropertyValue("--slide-accent")).toBe("#0073BB");
    expect(wrapper.style.getPropertyValue("--slide-bg")).toBe("#0f1115");
    expect(wrapper.style.getPropertyValue("--slide-text")).toBe("#ffffff");
    expect(wrapper.style.getPropertyValue("--slide-font-heading")).toBe("'Space Grotesk', sans-serif");
    expect(wrapper.style.getPropertyValue("--slide-font-body")).toBe("'Inter', sans-serif");
  });

  test("sets background color and text color on wrapper", () => {
    render(
      <ThemeProvider theme={testTheme}>
        <span>Content</span>
      </ThemeProvider>
    );
    const wrapper = screen.getByText("Content").parentElement!;
    expect(wrapper.style.backgroundColor).toBe("rgb(15, 17, 21)");
    expect(wrapper.style.color).toBe("rgb(255, 255, 255)");
  });
});
