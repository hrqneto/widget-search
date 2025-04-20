import { useEffect } from "react";

export function useOutsideClickClose(refClass: string, close: () => void) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const insideDropdown = target.closest(`.${refClass}`);
      const insideInput = target.closest("input[name='q']");
      if (!insideDropdown && !insideInput) close();
    };

    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [close, refClass]);
}
