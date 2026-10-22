"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// Galerija: glavna slika s prevlačenjem (scroll-snap) na mobitelu i sličice ispod.
export default function VehicleGallery({ urls, alt }: { urls: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  if (urls.length === 0) {
    return (
      <div className="aspect-[4/3] rounded-lg bg-paper border border-line flex items-center justify-center text-sm text-muted">
        Fotografije uskoro
      </div>
    );
  }

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div
          ref={track}
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto rounded-lg bg-paper [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {urls.map((u, i) => (
            <div key={u} className="relative h-full w-full shrink-0 snap-center">
              <Image
                src={u}
                alt={`${alt} — fotografija ${i + 1}`}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        {urls.length > 1 && (
          <>
            <NavBtn side="left" onClick={() => go(Math.max(0, index - 1))} disabled={index === 0} />
            <NavBtn side="right" onClick={() => go(Math.min(urls.length - 1, index + 1))} disabled={index === urls.length - 1} />
            <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-1 text-xs font-semibold text-white">
              {index + 1} / {urls.length}
            </span>
          </>
        )}
      </div>
      {urls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {urls.map((u, i) => (
            <button
              key={u}
              type="button"
              aria-label={`Fotografija ${i + 1}`}
              onClick={() => go(i)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded border-2 ${i === index ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <Image src={u} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavBtn({ side, onClick, disabled }: { side: "left" | "right"; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Prethodna fotografija" : "Sljedeća fotografija"}
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-3" : "right-3"} hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-lg font-bold shadow disabled:opacity-0`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
