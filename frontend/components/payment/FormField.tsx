import React from "react";

export interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export function FormField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  error,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className="text-xs font-semibold text-gray-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full border rounded-xl px-4 py-3 text-sm transition-colors ${
          error
            ? "border-red-500 bg-red-50/30 focus:border-red-500 focus:bg-white"
            : "border-gray-200 bg-[#fafaf8] focus:bg-white focus:border-[#4E0707]"
        } focus:outline-none`}
      />
      {error && (
        <span className="text-xs text-red-500 mt-0.5 pl-1">{error}</span>
      )}
    </div>
  );
}
