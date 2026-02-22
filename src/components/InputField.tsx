"use client";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  placeholder?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  suffix,
  placeholder,
}: InputFieldProps) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1">
      <label className="text-sm text-text-secondary font-medium">{label}</label>
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => {
            // Allow digits, dots, commas, and minus
            const filtered = e.target.value.replace(/[^0-9.,-]/g, "");
            onChange(filtered);
          }}
          placeholder={placeholder}
          className="w-28 text-right text-sm font-semibold text-primary bg-transparent
                     border-b-2 border-border focus:border-primary-light outline-none
                     py-1 px-1 transition-colors"
        />
        {suffix && (
          <span className="text-xs text-text-secondary font-medium w-6 text-left">{suffix}</span>
        )}
      </div>
    </div>
  );
}
