import type { BlockConfig } from "../types";

export interface BlockFieldConfig {
  key: keyof BlockConfig;
  label: string;
  type: "text" | "number";
  colSpan: string;
  condition?: (block: BlockConfig) => boolean;
}

export function useBlockEditorFields(): BlockFieldConfig[] {
  return [
    { key: "position", label: "Position", type: "number", colSpan: "col-span-1" },
    { key: "size", label: "Size", type: "number", colSpan: "col-span-1" },
    { key: "name", label: "Name", type: "text", colSpan: "col-span-2" },
    {
      key: "recommendedName",
      label: "Recommended Name",
      type: "text",
      colSpan: "col-span-1",
      condition: (b) => b.recommendedName !== undefined,
    },
    {
      key: "recommendedSize",
      label: "Recommended Size",
      type: "number",
      colSpan: "col-span-1",
      condition: (b) => b.recommendedName !== undefined,
    },
    {
      key: "heroName",
      label: "Hero Product Name",
      type: "text",
      colSpan: "col-span-2",
      condition: (b) => b.heroName !== undefined,
    },
  ];
}
