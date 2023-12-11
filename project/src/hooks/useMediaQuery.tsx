import { useEffect, useState } from "react";

export const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  useEffect(() => {
    const updateTarget = (event: any) => {
      setTargetReached(event.matches);
    };

    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    // Clean up function
    return () => media.removeEventListener("change", updateTarget);
  }, [width]); // dependency on 'width' to re-run effect when 'width' changes

  return targetReached;
};
