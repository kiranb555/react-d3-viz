import { useState, useEffect, type RefObject } from 'react';

export interface ContainerSize {
  width: number;
  height: number;
}

export function useContainerSize(ref: RefObject<HTMLElement | null>): ContainerSize {
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { width, height } = el.getBoundingClientRect();
    setSize({ width, height });

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
