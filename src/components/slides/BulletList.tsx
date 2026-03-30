import * as LucideIcons from "lucide-react";

interface BulletListProps {
  items: string[];
  icon?: string;
}

function getIcon(name: string) {
  const IconComponent = (LucideIcons as any)[
    name.replace(/-./g, (m) => m[1].toUpperCase()).replace(/^./, (m) => m.toUpperCase())
  ];
  return IconComponent || LucideIcons.Circle;
}

export function BulletList({ items, icon }: BulletListProps) {
  const Icon = icon ? getIcon(icon) : null;
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-lg" style={{ color: "var(--slide-text-muted)" }}>
          {Icon ? (
            <Icon size={18} className="shrink-0 mt-1" style={{ color: "var(--slide-primary)" }} />
          ) : (
            <span className="shrink-0 mt-2 w-2 h-2 rounded-full" style={{ backgroundColor: "var(--slide-primary)" }} />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
