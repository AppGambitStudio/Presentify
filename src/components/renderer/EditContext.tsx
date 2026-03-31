"use client";

import React, { createContext, useContext } from "react";
import type { Section } from "@/lib/types";

interface EditContextValue {
  editable: boolean;
  onSectionUpdate: (sectionIndex: number, updatedSection: Section) => void;
  onTitleUpdate: (title: string) => void;
  onSubtitleUpdate: (subtitle: string) => void;
}

const EditContext = createContext<EditContextValue>({
  editable: false,
  onSectionUpdate: () => {},
  onTitleUpdate: () => {},
  onSubtitleUpdate: () => {},
});

export function EditProvider({
  children,
  editable,
  onSectionUpdate,
  onTitleUpdate,
  onSubtitleUpdate,
}: EditContextValue & { children: React.ReactNode }) {
  return (
    <EditContext.Provider value={{ editable, onSectionUpdate, onTitleUpdate, onSubtitleUpdate }}>
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  return useContext(EditContext);
}
