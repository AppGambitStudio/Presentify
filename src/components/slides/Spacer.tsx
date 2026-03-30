interface SpacerProps { size?: "sm" | "md" | "lg"; }

export function Spacer({ size = "md" }: SpacerProps) {
  const heightMap = { sm: "1rem", md: "2rem", lg: "3rem" };
  return <div style={{ height: heightMap[size] }} />;
}
