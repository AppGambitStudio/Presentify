import { ExternalLink } from "lucide-react";
import { resolveIcon } from "@/lib/iconResolver";
import QRCode from "react-qr-code";

interface ShowcaseCardProps {
  title: string;
  desc: string;
  icon: string;
  url: string;
  qrCode?: boolean;
  tags?: string[];
}

export function ShowcaseCard({ title, desc, icon, url, qrCode = true, tags = [] }: ShowcaseCardProps) {
  const Icon = resolveIcon(icon);
  return (
    <div className="glass-panel flex flex-col gap-5">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--slide-card-bg)" }}>
          <Icon size={24} style={{ color: "var(--slide-primary)" }} />
        </div>
        {qrCode && (
          <div className="flex flex-col items-end gap-1">
            <div className="bg-white p-1.5 rounded-lg">
              <QRCode value={url} size={56} />
            </div>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-wider font-bold flex items-center gap-1" style={{ color: "var(--slide-text-muted)" }}>
              Visit <ExternalLink size={10} />
            </a>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--slide-font-heading)" }}>{title}</h3>
        <p className="text-base" style={{ color: "var(--slide-text-muted)" }}>{desc}</p>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <span key={tag} className="text-xs uppercase tracking-wider font-bold px-2 py-1 rounded" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)", color: "var(--slide-text-muted)" }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
