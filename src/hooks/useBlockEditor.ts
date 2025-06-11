import { useCallback } from "react";
import type { BlockConfig } from "../types";

export function useBlockEditor(setBlockConfigs: React.Dispatch<React.SetStateAction<BlockConfig[]>>) {
  const updateBlock = useCallback(
    (id: BlockConfig["id"], key: keyof BlockConfig, value: any) => {
      setBlockConfigs(prev =>
        prev.map(b => (b.id === id ? { ...b, [key]: value } : b))
      );
    },
    [setBlockConfigs]
  );

  return { updateBlock };
}
