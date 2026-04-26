"use client";

import { useState } from "react";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  placeholder?: string;
  step?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  suffix,
  placeholder,
  step = "any",
}: InputFieldProps) {
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        transition: "border-color .15s ease, box-shadow .15s ease",
        boxShadow: focus ? "0 0 0 3px color-mix(in oklch, var(--color-primary) 18%, transparent)" : "none",
      }}
    >
      <div className="text-[11px] text-muted font-semibold tracking-wide">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <input
          type="number"
          inputMode="decimal"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className="flex-1 min-w-0 border-none outline-none bg-transparent text-text text-lg font-semibold p-0"
          style={{ fontVariantNumeric: "tabular-nums" }}
        />
        {suffix && (
          <div className="text-sm text-text-secondary font-medium">{suffix}</div>
        )}
      </div>
    </label>
  );
}
