import { IconCard } from "./IconCard";

interface CardGridProps {
  cards: { icon?: string; title: string; desc: string; color?: string; action?: string; tags?: string[]; footer?: string }[];
  columns?: number;
}

export function CardGrid({ cards, columns = 3 }: CardGridProps) {
  // Auto-adjust: don't use more columns than cards, and cap at 4 for readability
  const effectiveCols = Math.min(columns, cards.length, 4);
  // Compact gap when many cards
  const gap = cards.length > 4 ? "gap-3" : "gap-5";

  return (
    <div className={`grid ${gap}`} style={{ gridTemplateColumns: `repeat(${effectiveCols}, 1fr)` }}>
      {cards.map((card, i) => (
        <IconCard key={i} {...card} />
      ))}
    </div>
  );
}
