import type {
  PresentationConfig,
  Slide,
  Section,
  ThemeConfig,
  ComponentType,
} from "@/lib/types";
import { isValidComponentType, COMPONENT_TYPES } from "@/lib/types";

describe("Type definitions", () => {
  test("COMPONENT_TYPES contains all 20 component types", () => {
    expect(COMPONENT_TYPES).toHaveLength(20);
    expect(COMPONENT_TYPES).toContain("Heading");
    expect(COMPONENT_TYPES).toContain("Body");
    expect(COMPONENT_TYPES).toContain("BulletList");
    expect(COMPONENT_TYPES).toContain("CTABox");
    expect(COMPONENT_TYPES).toContain("ShowcaseCard");
    expect(COMPONENT_TYPES).toContain("HeroIcon");
    expect(COMPONENT_TYPES).toContain("PromptBlock");
  });

  test("isValidComponentType returns true for valid types", () => {
    expect(isValidComponentType("Heading")).toBe(true);
    expect(isValidComponentType("BulletList")).toBe(true);
  });

  test("isValidComponentType returns false for invalid types", () => {
    expect(isValidComponentType("FooBar")).toBe(false);
    expect(isValidComponentType("")).toBe(false);
  });
});
