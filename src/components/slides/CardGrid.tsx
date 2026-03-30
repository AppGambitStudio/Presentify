import { IconCard } from "./IconCard";

interface CardGridProps {
  cards: { icon: string; title: string; desc: string; color?: string }[];
  columns?: number;
}

export function CardGrid({ cards, columns = 3 }: CardGridProps) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {cards.map((card, i) => (
        <IconCard key={i} {...card} />
      ))}
    </div>
  );
}
