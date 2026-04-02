"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sparkles, Trash2, Edit, Presentation as PresentationIcon, Clock } from "lucide-react";
import { getAllPresentations, deletePresentation } from "@/lib/store";
import type { PresentationConfig } from "@/lib/types";

export default function Home() {
  const [presentations, setPresentations] = useState<PresentationConfig[]>([]);

  useEffect(() => {
    setPresentations(getAllPresentations());
  }, []);

  function handleDelete(id: string) {
    deletePresentation(id);
    setPresentations(getAllPresentations());
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 py-12"
      style={{ backgroundColor: "var(--slide-bg)" }}
    >
      <h1
        className="text-6xl font-bold"
        style={{ fontFamily: "var(--slide-font-heading)" }}
      >
        Presentify
      </h1>
      <p className="text-xl" style={{ color: "var(--slide-text-muted)" }}>
        AI-powered Presentation Builder
      </p>
      <Link
        href="/create"
        className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105"
        style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}
      >
        <Sparkles size={20} /> Create Presentation
      </Link>
      <div className="flex gap-6">
        <Link
          href="/p/sample/present"
          className="text-base underline underline-offset-4"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Sample presentation
        </Link>
        <Link
          href="/help"
          className="text-base underline underline-offset-4"
          style={{ color: "var(--slide-text-muted)" }}
        >
          Component docs
        </Link>
      </div>

      {presentations.length > 0 && (
        <div className="w-full max-w-2xl mt-4">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--slide-text-muted)" }}
          >
            Saved Presentations
          </h2>
          <ul className="flex flex-col gap-3">
            {presentations.map((pres) => (
              <li
                key={pres.id}
                className="glass-panel flex items-center justify-between gap-4 px-5 py-4 rounded-xl"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span
                    className="font-semibold text-base truncate"
                    style={{ color: "var(--slide-text)" }}
                  >
                    {pres.title}
                  </span>
                  <div
                    className="flex items-center gap-3 text-sm"
                    style={{ color: "var(--slide-text-muted)" }}
                  >
                    <span>{pres.slides.length} slide{pres.slides.length !== 1 ? "s" : ""}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} />
                      {formatDate(pres.lastModified)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/p/${pres.id}`}
                    title="Edit"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-75"
                    style={{
                      backgroundColor: "var(--slide-surface)",
                      color: "var(--slide-text)",
                      border: "1px solid var(--slide-border)",
                    }}
                  >
                    <Edit size={14} /> Edit
                  </Link>
                  <Link
                    href={`/p/${pres.id}/present`}
                    title="Present"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-75"
                    style={{
                      backgroundColor: "var(--slide-primary)",
                      color: "var(--slide-bg)",
                    }}
                  >
                    <PresentationIcon size={14} /> Present
                  </Link>
                  <button
                    onClick={() => handleDelete(pres.id)}
                    title="Delete"
                    className="flex items-center justify-center p-1.5 rounded-lg transition-opacity hover:opacity-75"
                    style={{
                      backgroundColor: "var(--slide-surface)",
                      color: "var(--slide-text-muted)",
                      border: "1px solid var(--slide-border)",
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
