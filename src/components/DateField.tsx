"use client";

import { useState } from "react";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function DateField({ label, value, onChange }: DateFieldProps) {
  const [focus, setFocus] = useState(false);

  return (
    <label
      className="block cursor-text"
      style={{
        borderRadius: "var(--r-md)",
        border: `1.5px solid ${focus ? "var(--color-primary)" : "var(--color-line)"}`,
        background: "var(--color-surface)",
        padding: "10px 14px",
        minHeight: "var(--field-h)",
        transition: "border-color .15s",
      }}
    >
      <div className="text-[11px] text-muted font-semibold">{label}</div>
      <div className="flex items-center gap-2 mt-0.5">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="flex-1 border-none outline-none bg-transparent text-text text-base font-semibold p-0"
        />
        <span className="text-muted">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
            <path d="M8 3v4" />
            <path d="M16 3v4" />
            <path d="M3.5 10h17" />
          </svg>
        </span>
      </div>
    </label>
  );
}
