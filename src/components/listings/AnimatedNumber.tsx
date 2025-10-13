import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  duration?: number; // ms
  format?: (n: number) => string;
  startOnVisible?: boolean; // if true, waits until visible
  className?: string;
};

export default function AnimatedNumber({ value, duration = 900, format = (n) => Math.round(n).toLocaleString(), startOnVisible = true, className }: Props) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const nodeRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // optionally wait till element visible
    if (startOnVisible && !nodeRef.current) return;

    function startAnimation() {
      // if animating to the same value just set
      if (fromRef.current === value) {
        setDisplay(value);
        return;
      }
      startRef.current = null;
      const durationMs = Math.max(0, duration);
      const from = fromRef.current ?? 0;
      const delta = value - from;

      const step = (ts: number) => {
        if (!startRef.current) startRef.current = ts;
        const elapsed = ts - startRef.current;
        const t = Math.min(1, elapsed / durationMs);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(from + delta * eased);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          fromRef.current = value;
        }
      };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    }

    if (startOnVisible) {
      const el = nodeRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && !startedRef.current) {
              startedRef.current = true;
              startAnimation();
              io.disconnect();
            }
          }
        },
        { threshold: 0.3 }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    } else {
      startAnimation();
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, [value, duration, startOnVisible]);

  // update fromRef so consecutive updates animate from last shown numeric
  useEffect(() => {
    fromRef.current = typeof display === 'number' ? display : 0;
  }, [display]);

  return (
    <span
      ref={nodeRef}
      aria-live='polite'
      className={className}>
      {format(display)}
    </span>
  );
}
