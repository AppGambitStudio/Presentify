"use client";

import React, { useRef, useCallback } from "react";

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  editable: boolean;
  className?: string;
  style?: React.CSSProperties;
  tag?: "span" | "p" | "h1" | "h2" | "h3" | "div";
}

export function EditableText({
  value,
  onChange,
  editable,
  className = "",
  style,
  tag = "span",
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);

  const handleBlur = useCallback(() => {
    if (ref.current) {
      const newText = ref.current.innerText.trim();
      if (newText !== value) {
        onChange(newText);
      }
    }
  }, [value, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
    e.stopPropagation();
  }, []);

  const props = {
    className: editable ? `${className} outline-none cursor-text` : className,
    style: editable
      ? { ...style, borderBottom: "1px dashed transparent" }
      : style,
  };

  if (!editable) {
    return React.createElement(tag, props, value);
  }

  return React.createElement(tag, {
    ...props,
    ref,
    contentEditable: true,
    suppressContentEditableWarning: true,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onFocus: () => {
      if (ref.current) ref.current.style.borderBottomColor = "var(--slide-primary)";
    },
  }, value);
}
