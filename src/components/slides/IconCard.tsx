import * as LucideIcons from "lucide-react";

interface IconCardProps {
  icon: string;
  title: string;
  desc: string;
  color?: string;
}

function getIcon(name: string) {
  const formatted = name.replace(/-./g, (m) => m[1].toUpperCase()).replace(/^./, (m) => m.toUpperCase());
  return (LucideIcons as any)[formatted] || LucideIcons.Circle;
}

export function IconCard({ icon, title, desc, color }: IconCardProps) {
  const Icon = getIcon(icon);
  const accentColor = color || "var(--slide-primary)";
  return (
    <div className="glass-panel flex flex-col gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
        <Icon size={24} style={{ color: accentColor }} />
      </div>
      <h3 className="text-lg font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>{title}</h3>
      <p className="text-base" style={{ color: "var(--slide-text-muted)" }}>{desc}</p>
    </div>
  );
}
