import type { PresentationConfig } from "./types";

const STORAGE_KEY = "presentify_presentations";

export function savePresentation(config: PresentationConfig): void {
  const all = getAllPresentations();
  const index = all.findIndex((p) => p.id === config.id);
  if (index >= 0) {
    all[index] = config;
  } else {
    all.push(config);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getPresentation(id: string): PresentationConfig | null {
  const all = getAllPresentations();
  return all.find((p) => p.id === id) ?? null;
}

export function getAllPresentations(): PresentationConfig[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function deletePresentation(id: string): void {
  const all = getAllPresentations().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function generateId(): string {
  return `pres_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
