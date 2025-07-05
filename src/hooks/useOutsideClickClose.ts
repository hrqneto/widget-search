import { useEffect, RefObject } from "react";

export function useOutsideClickClose(
  refOrClass: string | RefObject<HTMLElement | null>,
  close: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      let insideDropdown = false;
      let insideInput = false;

      if (typeof refOrClass === "string") {
        insideDropdown = !!target.closest(`.${refOrClass}`);
      } else if (refOrClass?.current) {
        insideDropdown = refOrClass.current.contains(target);
      }

      insideInput = target.closest("input[name='q']") !== null;

      if (!insideDropdown && !insideInput) {
        close();
      }
    };

    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [refOrClass, close]);
}
