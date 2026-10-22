"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { createPhotoUploads, setVehiclePhotos } from "@/lib/admin/actions";

const BUCKET = "vehicle-photos";
const MAX_SIDE = 2000;

function publicUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

// Smanji fotografiju s mobitela na najviše 2000 px (JPEG) prije uploada; ako ne uspije, šalji original.
async function shrink(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    return blob ?? file;
  } catch {
    return file;
  }
}

export default function PhotoManager({ vehicleId, initial }: { vehicleId: string; initial: string[] }) {
  const [images, setImages] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function persist(next: string[]) {
    setImages(next);
    startTransition(async () => {
      await setVehiclePhotos(vehicleId, next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = Array.from(files).slice(0, 30);
    try {
      const uploads = await createPhotoUploads(vehicleId, list.length);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const done: string[] = [];
      for (let i = 0; i < list.length; i++) {
        setBusy(`Učitavanje ${i + 1}/${list.length}…`);
        const blob = await shrink(list[i]);
        const { path, token } = uploads[i];
        const { error } = await supabase.storage
          .from(BUCKET)
          .uploadToSignedUrl(path, token, blob, { contentType: "image/jpeg" });
        if (error) throw error;
        done.push(path);
      }
      persist([...images, ...done]);
    } catch (e) {
      setError(`Učitavanje nije uspjelo: ${e instanceof Error ? e.message : "greška"}`);
    } finally {
      setBusy(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    persist(next);
  };

  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold normal-case font-body">Fotografije</h2>
          <p className="text-xs text-muted">Prva fotografija je naslovna. {saved && <span className="text-emerald-600 font-semibold">✓ Spremljeno</span>}</p>
        </div>
        <label className="cursor-pointer bg-navy hover:bg-navy-soft text-white text-sm font-semibold px-4 py-2.5 rounded">
          {busy ?? "+ Dodaj fotografije"}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={!!busy}
            onChange={(e) => onFiles(e.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      {error && <p className="text-sm text-accent mb-3">{error}</p>}

      {images.length === 0 ? (
        <p className="text-sm text-muted">Još nema fotografija. Na mobitelu možete fotografirati direktno kamerom.</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((p, i) => (
            <li key={p} className="relative aspect-[4/3] overflow-hidden rounded border border-line bg-paper group">
              <Image src={publicUrl(p)} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-white">NASLOVNA</span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/55 p-1">
                <div className="flex gap-1">
                  <IconBtn label="Pomakni lijevo" onClick={() => move(i, -1)} disabled={i === 0}>←</IconBtn>
                  <IconBtn label="Pomakni desno" onClick={() => move(i, 1)} disabled={i === images.length - 1}>→</IconBtn>
                </div>
                <IconBtn
                  label="Obriši"
                  onClick={() => confirm("Obrisati ovu fotografiju?") && persist(images.filter((x) => x !== p))}
                >
                  ✕
                </IconBtn>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconBtn(props: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={props.label}
      title={props.label}
      onClick={props.onClick}
      disabled={props.disabled}
      className="h-7 w-7 rounded text-white text-sm font-bold hover:bg-white/20 disabled:opacity-30"
    >
      {props.children}
    </button>
  );
}
