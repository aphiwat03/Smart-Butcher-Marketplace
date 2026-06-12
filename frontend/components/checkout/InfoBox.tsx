"use client";

interface InfoField {
  label: string;
  value: string;
}

interface InfoBoxProps {
  title: string;
  fields: InfoField[];
  onEdit?: () => void;
}

export default function InfoBox({ title, fields, onEdit }: InfoBoxProps) {
  return (
    <div className="info-box">
      <div className="info-box-header">
        <span className="info-box-title">{title}</span>
        {onEdit && (
          <button className="edit-btn" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
      <div className="info-box-body">
        {fields.map((f, i) => (
          <div key={i} className="info-field">
            <span className="field-label">{f.label}</span>
            <span className="field-value">{f.value}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .info-box {
          border: 1px solid #ede9e0;
          border-radius: 10px;
          overflow: hidden;
          background: #fff;
        }

        .info-box-header {
          background: #faf8f5;
          border-bottom: 1px solid #ede9e0;
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-box-title {
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .edit-btn {
          background: none;
          border: none;
          font-size: 12px;
          color: #b4915b;
          cursor: pointer;
          font-weight: 500;
          padding: 0;
        }

        .edit-btn:hover {
          text-decoration: underline;
        }

        .info-box-body {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .info-field {
          display: flex;
          gap: 8px;
          font-size: 13px;
          line-height: 1.5;
        }

        .field-label {
          color: #999;
          min-width: 72px;
          flex-shrink: 0;
        }

        .field-value {
          color: #2c2c2c;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
