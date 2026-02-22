"use client";

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function DateField({ label, value, onChange }: DateFieldProps) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1">
      <label className="text-sm text-text-secondary font-medium">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-semibold text-primary bg-transparent
                   border-b-2 border-border focus:border-primary-light outline-none
                   py-1 px-1 transition-colors"
      />
    </div>
  );
}
