import { useEffect, RefObject } from "react";

// Permite um ou mais refs
export function useOutsideClickClose(
  refs: Array<RefObject<HTMLElement | null>>,
  close: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const clickedInside = refs.some(ref => {
        return ref.current instanceof HTMLElement && ref.current.contains(target);
      });

      if (!clickedInside) {
        close();
      }
    };

    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [refs, close]);
}
