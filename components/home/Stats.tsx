"use client";

import { useEffect, useRef, useState } from "react";

// TODO: zamijeniti stvarnim brojkama kad ih dobijemo (npr. broj uvezenih/prodanih vozila).
const STATS = [
  { value: 5, suffix: "+", label: "zemalja EU iz kojih uvozimo" },
  { value: 2, suffix: "", label: "vozila po jednom prijevozu" },
  { value: 100, suffix: "%", label: "vozila prolazi provjeru prije prodaje" },
  { value: 0, suffix: "", label: "posrednika — sve radimo sami", text: "Bez" },
];

function useCountUp(target: number, run: boolean, ms = 1200) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setN(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, ms]);
  return n;
}

function Stat({ s, run }: { s: (typeof STATS)[number]; run: boolean }) {
  const n = useCountUp(s.value, run);
  return (
    <div className="flex flex-col gap-1 border-l-2 border-accent pl-4">
      <span className="font-heading text-4xl sm:text-5xl text-white tabular-nums">
        {s.text ?? `${n}${s.suffix}`}
      </span>
      <span className="text-xs sm:text-sm text-white/60 leading-snug">{s.label}</span>
    </div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setRun(true), io.disconnect()), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
      {STATS.map((s) => (
        <Stat key={s.label} s={s} run={run} />
      ))}
    </div>
  );
}
