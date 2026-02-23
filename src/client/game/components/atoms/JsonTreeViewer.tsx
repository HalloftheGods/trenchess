import React, { useState } from "react";

interface JsonTreeNodeProps {
  label: string;
  value: unknown;
  depth?: number;
}

const isExpandable = (val: unknown): boolean =>
  val !== null && typeof val === "object";

const getPreviewLabel = (val: unknown): string => {
  if (Array.isArray(val)) return `Array(${val.length})`;
  if (val === null) return "null";
  if (typeof val === "object") return `{${Object.keys(val).length}}`;
  return String(val);
};

const valueColorClass = (val: unknown): string => {
  if (val === null || val === undefined) return "text-slate-500";
  if (typeof val === "boolean")
    return val
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";
  if (typeof val === "number") return "text-sky-600 dark:text-sky-400";
  if (typeof val === "string") return "text-amber-600 dark:text-amber-300";
  return "text-slate-700 dark:text-slate-300";
};

const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({
  label,
  value,
  depth = 0,
}) => {
  const [isOpen, setIsOpen] = useState(depth < 1);
  const expandable = isExpandable(value);
  const maxDepthIndent = Math.min(depth, 4);

  if (!expandable) {
    return (
      <div
        className="flex gap-1.5 py-0.5 items-baseline"
        style={{ paddingLeft: `${maxDepthIndent * 12}px` }}
      >
        <span className="text-slate-500 shrink-0">{label}:</span>
        <span className={`${valueColorClass(value)} truncate`}>
          {value === null ? "null" : String(value)}
        </span>
      </div>
    );
  }

  const entries = Array.isArray(value)
    ? value.map((v, i) => [String(i), v] as [string, unknown])
    : Object.entries(value as Record<string, unknown>);

  const isEmpty = entries.length === 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="flex gap-1.5 py-0.5 items-baseline w-full text-left cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03] rounded"
        style={{ paddingLeft: `${maxDepthIndent * 12}px` }}
      >
        <span
          className={`text-[8px] transition-transform duration-150 text-slate-600 ${isOpen ? "rotate-90" : ""}`}
        >
          ▶
        </span>
        <span className="text-slate-400 shrink-0">{label}</span>
        <span className="text-slate-600">{getPreviewLabel(value)}</span>
      </button>
      {isOpen && !isEmpty && (
        <div>
          {entries.map(([k, v]) => (
            <JsonTreeNode key={k} label={k} value={v} depth={depth + 1} />
          ))}
        </div>
      )}
      {isOpen && isEmpty && (
        <div
          className="text-slate-600 py-0.5"
          style={{ paddingLeft: `${(maxDepthIndent + 1) * 12}px` }}
        >
          (empty)
        </div>
      )}
    </div>
  );
};

interface JsonTreeViewerProps {
  data: Record<string, unknown> | null;
}

const JsonTreeViewer: React.FC<JsonTreeViewerProps> = ({ data }) => {
  if (!data) {
    return <span className="text-slate-600 italic">No data available</span>;
  }

  return (
    <div className="text-[10px] font-mono leading-relaxed">
      {Object.entries(data).map(([key, val]) => (
        <JsonTreeNode key={key} label={key} value={val} />
      ))}
    </div>
  );
};

export default JsonTreeViewer;
