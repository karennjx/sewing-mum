"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The dashed line running through the three promises, drawn left to right the
 * first time the band reaches the middle of the screen.
 *
 * The one client component on the homepage. There is no way to know the band is
 * on screen without an observer, and it disconnects after the first hit: this
 * runs once per page load and then stops listening.
 *
 * Revealed with clip-path rather than a scaled width, because scaling the box
 * stretches the dashes themselves and the line stops looking like stitching.
 * It is decorative and aria-hidden, so where scripting never runs the line
 * simply does not appear and nothing is lost.
 */
export function StitchLine({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`${className} transition-[clip-path] duration-[1100ms] ease-out ${
        drawn ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_100%_0_0)]"
      }`}
    />
  );
}
