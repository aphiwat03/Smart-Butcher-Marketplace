import React from "react";

interface InfoBoxField {
  label: string;
  value: string | undefined;
}

interface InfoBoxProps {
  title: string;
  fields: InfoBoxField[];
  onEdit?: () => void;
}

export function InfoBox({ title, fields, onEdit }: InfoBoxProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-[#fafaf8]">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-bold text-gray-700">{title}</h4>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-xs font-semibold text-[#4E0707] underline"
          >
            แก้ไข
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {fields.map((f, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:gap-4 text-sm">
            <span className="text-gray-400 w-20 shrink-0">{f.label}</span>
            <span className="text-gray-800 font-medium truncate">
              {f.value || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
