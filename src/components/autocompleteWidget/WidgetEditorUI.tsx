import type { BlockConfig } from "../../types";
import type { Dispatch, SetStateAction } from "react";
import { useBlockEditorFields } from "../../hooks/useBlockEditorFields";

interface Props {
  blockConfigs: BlockConfig[];
  fixarAberto: boolean;
  updateBlock: (id: BlockConfig["id"], key: keyof BlockConfig, value: any) => void;
  setFixarAberto: Dispatch<SetStateAction<boolean>>;
}

const WidgetEditorUI = ({
  blockConfigs,
  fixarAberto,
  updateBlock,
  setFixarAberto,
}: Props) => {
  const fields = useBlockEditorFields();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3 text-sm p-2 bg-gray-50 rounded">
      {blockConfigs.map((block) => (
        <div key={block.id} className="border p-2 rounded bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <label className="font-semibold capitalize">{block.id}</label>
            <input
              type="checkbox"
              checked={block.enabled}
              onChange={() => updateBlock(block.id, "enabled", !block.enabled)}
              className="accent-purple-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {fields
              .filter((f) => !f.condition || f.condition(block))
              .map(({ key, label, type, colSpan }) => (
                <label key={key} className={colSpan}>
                  {label}
                  <input
                    type={type}
                    className="border rounded px-1 w-full"
                    value={block[key] as string | number}
                    onChange={(e) =>
                      updateBlock(
                        block.id,
                        key,
                        type === "number" ? parseInt(e.target.value) : e.target.value
                      )
                    }
                  />
                </label>
              ))}
          </div>
        </div>
      ))}

      <div className="col-span-full text-right mt-2">
        <label className="text-red-600 font-medium">
          <input
            type="checkbox"
            checked={fixarAberto}
            onChange={() => setFixarAberto((prev) => !prev)}
            className="mr-1"
          />
          manter aberto
        </label>
      </div>
    </div>
  );
};

export default WidgetEditorUI;
