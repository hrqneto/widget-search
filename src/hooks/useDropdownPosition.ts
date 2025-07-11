import { useEffect } from "react";
import type { RefObject } from "react";

interface UseDropdownPositionProps {
  inputRef: RefObject<HTMLInputElement | null>;
  dropdownRef: RefObject<HTMLDivElement | null>;
  setDropdownLeftOffset: (val: number) => void;
  setCaretLeftOffset: (val: number) => void;
  deps: unknown[];
  inputContainerRef?: RefObject<HTMLDivElement | null>;
}

export const useDropdownPosition = ({
  inputRef,
  dropdownRef,
  setDropdownLeftOffset,
  setCaretLeftOffset,
  deps,
  inputContainerRef,
}: UseDropdownPositionProps) => {
  useEffect(() => {
    const input = inputRef.current;
    const dropdown = dropdownRef.current;
    const container = inputContainerRef?.current;

    if (!input || !dropdown) return;

    const dropdownWidth = 980;
    const screenWidth = window.innerWidth;
    const margin = 12;

    const inputRect = input.getBoundingClientRect();

    // Detecta se o container usa justify-end
    const isRightAligned = container?.classList.contains("justify-end");

    let dropdownLeft: number;
    let caretLeft: number;

    if (isRightAligned) {
      // Força valores fixos quando estiver à direita
      dropdownLeft = 525;
      caretLeft = 880;
    } else {
      // Calcula posição normal (centralizada ao input)
      dropdownLeft = inputRect.left + input.offsetWidth / 2 - dropdownWidth / 2;
      const maxLeft = screenWidth - dropdownWidth - margin;
      dropdownLeft = Math.max(margin, Math.min(dropdownLeft, maxLeft));
      caretLeft = inputRect.left + input.offsetWidth / 2 - dropdownLeft;
    }

    setDropdownLeftOffset(dropdownLeft);
    setCaretLeftOffset(caretLeft);
  }, deps);
};
