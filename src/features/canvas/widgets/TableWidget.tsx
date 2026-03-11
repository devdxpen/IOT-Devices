"use client";
import React, { memo, useState, useCallback } from "react";
import { NodeProps } from "@xyflow/react";

type CellData = string[][];

function getDefaultCellData(rows: number, cols: number): CellData {
  const data: CellData = [];
  // header row
  data.push(Array.from({ length: cols }, (_, c) => `Header ${c + 1}`));
  // body rows
  for (let r = 1; r < rows; r++) {
    data.push(Array.from({ length: cols }, (_, c) => `Row ${r} Col ${c + 1}`));
  }
  return data;
}

export const TableWidget = memo(function TableWidget({ data, id }: NodeProps) {
  const d = data as Record<string, unknown>;
  const rows = (d.rows as number) || 4;
  const columns = (d.columns as number) || 3;
  const headerBgColor = (d.headerBgColor as string) || "#3b82f6";
  const borderColor = (d.borderColor as string) || "#e5e7eb";
  const borderWidth = (d.borderWidth as number) ?? 1;
  const fontColor = (d.fontColor as string) || "#1f2937";
  const fontSize = (d.fontSize as number) || 13;
  const opacity = ((d.opacity as number) ?? 100) / 100;

  const cellData: CellData =
    (d.cellData as CellData) || getDefaultCellData(rows, columns);

  const [editingCell, setEditingCell] = useState<{
    r: number;
    c: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = useCallback(
    (r: number, c: number) => {
      setEditingCell({ r, c });
      setEditValue(cellData[r]?.[c] || "");
    },
    [cellData],
  );

  const commitEdit = useCallback(() => {
    if (!editingCell) return;
    // Dispatch a custom event so the parent can update data
    const event = new CustomEvent("table-cell-edit", {
      detail: {
        nodeId: id,
        row: editingCell.r,
        col: editingCell.c,
        value: editValue,
      },
      bubbles: true,
    });
    document.dispatchEvent(event);
    setEditingCell(null);
  }, [editingCell, editValue, id]);

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden"
      style={{ opacity, minWidth: columns * 100 }}
    >
      <table
        className="w-full border-collapse"
        style={{
          borderColor,
          fontSize: `${fontSize}px`,
          color: fontColor,
        }}
      >
        <thead>
          <tr>
            {Array.from({ length: columns }, (_, c) => (
              <th
                key={c}
                className="px-3 py-2 text-left font-semibold text-white select-none"
                style={{
                  backgroundColor: headerBgColor,
                  border: `${borderWidth}px solid ${borderColor}`,
                  fontSize: `${fontSize}px`,
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startEdit(0, c);
                }}
              >
                {editingCell?.r === 0 && editingCell?.c === c ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit();
                      if (e.key === "Escape") setEditingCell(null);
                    }}
                    className="w-full bg-white/20 text-white outline-none border-none text-xs px-1 py-0.5 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  (cellData[0]?.[c] ?? `Header ${c + 1}`)
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows - 1 }, (_, r) => (
            <tr key={r + 1} className="hover:bg-gray-50/50 transition-colors">
              {Array.from({ length: columns }, (_, c) => (
                <td
                  key={c}
                  className="px-3 py-1.5 select-none"
                  style={{
                    border: `${borderWidth}px solid ${borderColor}`,
                    fontSize: `${fontSize}px`,
                    color: fontColor,
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    startEdit(r + 1, c);
                  }}
                >
                  {editingCell?.r === r + 1 && editingCell?.c === c ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit();
                        if (e.key === "Escape") setEditingCell(null);
                      }}
                      className="w-full outline-none border border-blue-300 text-xs px-1 py-0.5 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    (cellData[r + 1]?.[c] ?? "")
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
