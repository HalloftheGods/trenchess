import React, { useState } from "react";

interface JsonTreeNodeProps {
  label: string;
  value: unknown;
  depth?: number;
}

const isExpandable = (val: unknown): boolean => {
  const isNotNull = val !== null;
  const isObject = typeof val === "object";
  return isNotNull && isObject;
};

const getPreviewLabel = (val: unknown): string => {
  const isArray = Array.isArray(val);
  if (isArray) {
    const arrayLength = (val as unknown[]).length;
    return `Array(${arrayLength})`;
  }

  const isNull = val === null;
  if (isNull) return "null";

  const isObject = typeof val === "object";
  if (isObject) {
    const keyCount = Object.keys(val as object).length;
    return `{${keyCount}}`;
  }

  return String(val);
};

const getValueColorClass = (val: unknown): string => {
  const isNullOrUndefined = val === null || val === undefined;
  if (isNullOrUndefined) return "text-slate-500";

  const isBoolean = typeof val === "boolean";
  if (isBoolean) {
    return val
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";
  }

  const isNumber = typeof val === "number";
  if (isNumber) return "text-sky-600 dark:text-sky-400";

  const isString = typeof val === "string";
  if (isString) return "text-amber-600 dark:text-amber-300";

  return "text-slate-700 dark:text-slate-300";
};

/**
 * JsonTreeNode (Atom)
 * Recursively renders a single node in the state tree.
 */
const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({
  label,
  value,
  depth = 0,
}) => {
  const isRootLevel = depth < 1;
  const [isOpen, setIsOpen] = useState(isRootLevel);

  const expandable = isExpandable(value);
  const maxDepthIndent = Math.min(depth, 4);
  const indentationStyle = { paddingLeft: `${maxDepthIndent * 12}px` };

  const handleToggle = () => setIsOpen((prev) => !prev);

  if (!expandable) {
    const isValueNull = value === null;
    const displayValue = isValueNull ? "null" : String(value);
    const colorClass = getValueColorClass(value);

    return (
      <div
        className="flex gap-1.5 py-0.5 items-baseline"
        style={indentationStyle}
      >
        <span className="text-slate-500 shrink-0">{label}:</span>
        <span className={`${colorClass} truncate`}>{displayValue}</span>
      </div>
    );
  }

  const isArrayValue = Array.isArray(value);
  const entries = isArrayValue
    ? (value as unknown[]).map(
        (val, index) => [String(index), val] as [string, unknown],
      )
    : Object.entries(value as Record<string, unknown>);

  const isEmpty = entries.length === 0;
  const previewLabel = getPreviewLabel(value);

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="flex gap-1.5 py-0.5 items-baseline w-full text-left cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03] rounded"
        style={indentationStyle}
      >
        <span
          className={`text-[8px] transition-transform duration-150 text-slate-600 ${isOpen ? "rotate-90" : ""}`}
        >
          ▶
        </span>
        <span className="text-slate-400 shrink-0">{label}</span>
        <span className="text-slate-600">{previewLabel}</span>
      </button>

      {isOpen && !isEmpty && (
        <div>
          {entries.map(([key, val]) => (
            <JsonTreeNode key={key} label={key} value={val} depth={depth + 1} />
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

/**
 * JsonTreeViewer (Molecule)
 * Renders a searchable, expandable JSON tree representation of an object.
 */
const JsonTreeViewer: React.FC<JsonTreeViewerProps> = ({ data }) => {
  const hasData = !!data;
  if (!hasData) {
    return <span className="text-slate-600 italic">No data available</span>;
  }

  const entries = Object.entries(data!);

  return (
    <div className="text-xs font-mono leading-relaxed">
      {entries.map(([key, value]) => (
        <JsonTreeNode key={key} label={key} value={value} />
      ))}
    </div>
  );
};

export default JsonTreeViewer;
