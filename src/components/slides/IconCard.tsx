import { resolveIcon } from "@/lib/iconResolver";
import { parseInlineMarkdown } from "@/lib/parseMarkdown";

interface IconCardProps {
  icon?: string;
  title: string;
  desc: string;
  color?: string;
  layout?: "vertical" | "horizontal";
  align?: "left" | "center" | "right";
  action?: string;           // highlighted action text (e.g. "Try this week: ...")
  tags?: string[];            // tag badges at the bottom
  footer?: string;            // subtle muted text at the bottom
  __editable?: boolean;
  __onPropsChange?: (props: Record<string, any>) => void;
}

export function IconCard({ icon, title, desc, color, layout = "vertical", align = "left", action, tags, footer, __editable, __onPropsChange }: IconCardProps) {
  const accentColor = color || "var(--slide-primary)";
  const Icon = icon ? resolveIcon(icon) : null;
  const isHorizontal = layout === "horizontal";
  const alignClass = align === "center" ? "items-center text-center" : align === "right" ? "items-end text-right" : "items-start text-left";

  const titleEl = __editable ? (
    <h3
      className="text-lg font-bold outline-none cursor-text"
      style={{ fontFamily: "var(--slide-font-heading)", color: accentColor !== "var(--slide-primary)" ? accentColor : undefined }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => __onPropsChange?.({ icon, title: e.currentTarget.innerText.trim(), desc, color, layout, action, tags, footer })}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {title}
    </h3>
  ) : (
    <h3 className="text-lg font-bold" style={{ fontFamily: "var(--slide-font-heading)", color: accentColor !== "var(--slide-primary)" ? accentColor : undefined }}>
      {title}
    </h3>
  );

  const descEl = __editable ? (
    <p
      className="text-sm outline-none cursor-text leading-relaxed"
      style={{ color: "var(--slide-text-muted)" }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => __onPropsChange?.({ icon, title, desc: e.currentTarget.innerText.trim(), color, layout, action, tags, footer })}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {desc}
    </p>
  ) : (
    <p className="text-sm leading-relaxed" style={{ color: "var(--slide-text-muted)" }}>{parseInlineMarkdown(desc)}</p>
  );

  // Action text (highlighted call-to-action line)
  const actionEl = action ? (
    <p className="text-sm font-medium mt-1" style={{ color: accentColor }}>{parseInlineMarkdown(action)}</p>
  ) : null;

  // Tag badges
  const tagsEl = tags && tags.length > 0 ? (
    <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
          style={{ backgroundColor: "var(--slide-card-bg)", color: "var(--slide-text-muted)", border: "1px solid var(--slide-card-border)" }}
        >
          {tag}
        </span>
      ))}
    </div>
  ) : null;

  // Footer text (subtle muted quote/note)
  const footerEl = footer ? (
    <div className="mt-auto pt-2">
      <p className="text-xs italic" style={{ color: "var(--slide-text-muted)", opacity: 0.7 }}>
        {parseInlineMarkdown(footer)}
      </p>
    </div>
  ) : null;

  if (isHorizontal) {
    return (
      <div className={`glass-panel flex gap-4 ${align === "center" ? "items-center" : "items-start"}`}>
        {Icon && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${accentColor}20` }}>
            <Icon size={20} style={{ color: accentColor }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {titleEl}
          {descEl}
          {actionEl}
          {tagsEl}
          {footerEl}
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel flex flex-col gap-2 ${alignClass}`}>
      {Icon && (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1" style={{ backgroundColor: `${accentColor}20` }}>
          <Icon size={20} style={{ color: accentColor }} />
        </div>
      )}
      {titleEl}
      {descEl}
      {actionEl}
      {tagsEl}
      {footerEl}
    </div>
  );
}
