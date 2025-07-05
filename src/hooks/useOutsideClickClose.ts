import { useEffect, RefObject } from "react";

type ValidRef = RefObject<HTMLElement> | RefObject<HTMLElement | null>;

export function useOutsideClickClose(
  refOrClass: string | ValidRef,
  close: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      let insideDropdown = false;
      let insideInput = false;

      if (typeof refOrClass === "string") {
        insideDropdown = !!target.closest(`.${refOrClass}`);
      } else if (refOrClass?.current instanceof HTMLElement) {
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
