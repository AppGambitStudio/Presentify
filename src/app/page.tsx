import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8" style={{ backgroundColor: "var(--slide-bg)" }}>
      <h1 className="text-6xl font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>Presentify</h1>
      <p className="text-xl" style={{ color: "var(--slide-text-muted)" }}>AI-powered presentation builder</p>
      <Link href="/create" className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}>
        <Sparkles size={20} /> Create Presentation
      </Link>
      <div className="flex gap-6">
        <Link href="/p/sample/present" className="text-base underline underline-offset-4" style={{ color: "var(--slide-text-muted)" }}>
          Sample presentation
        </Link>
        <Link href="/help" className="text-base underline underline-offset-4" style={{ color: "var(--slide-text-muted)" }}>
          Component docs
        </Link>
      </div>
    </div>
  );
}
