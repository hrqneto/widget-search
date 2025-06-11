import type { BlockConfig } from "../types";
import type { Dispatch, SetStateAction } from "react";

export const useBlockUpdater = (
  setBlockConfigs: Dispatch<SetStateAction<BlockConfig[]>>
) => {
  return (id: BlockConfig["id"], key: keyof BlockConfig, value: any) => {
    setBlockConfigs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [key]: value } : b))
    );
  };
};