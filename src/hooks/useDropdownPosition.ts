import { useEffect } from "react";
import type { RefObject } from "react";

interface UseDropdownPositionProps {
  inputRef: RefObject<HTMLInputElement | null>;
  dropdownRef: RefObject<HTMLDivElement | null>;
  setDropdownLeftOffset: (val: number) => void;
  setCaretLeftOffset: (val: number) => void;
  deps: unknown[];
}

export const useDropdownPosition = ({
  inputRef,
  dropdownRef,
  setDropdownLeftOffset,
  setCaretLeftOffset,
  deps,
}: UseDropdownPositionProps) => {
  useEffect(() => {
    const input = inputRef.current;
    const dropdown = dropdownRef.current;
    if (!input || !dropdown) return;

    const inputRect = input.getBoundingClientRect();
    const dropdownWidth = 980;
    const screenWidth = window.innerWidth;
    const margin = 0;

    const idealLeft = inputRect.left + input.offsetWidth / 2 - dropdownWidth / 2;
    const maxLeft = screenWidth - dropdownWidth - margin;
    const boundedLeft = Math.max(margin, Math.min(idealLeft, maxLeft));
    setDropdownLeftOffset(boundedLeft);

    const dropdownRect = dropdown.getBoundingClientRect();
    const relativeCaretLeft =
      inputRect.left + inputRect.width / 2 - dropdownRect.left;
    setCaretLeftOffset(relativeCaretLeft);
  }, deps);
};
