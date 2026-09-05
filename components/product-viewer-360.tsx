"use client"

import Image from "next/image"
import { RotateCcw } from "lucide-react"
import { KeyboardEvent, PointerEvent, useMemo, useRef, useState } from "react"

type Props = { name: string; image?: string | null; images?: string[]; priority?: boolean; compact?: boolean }
const fallbackFrames = Array.from({ length: 7 }, (_, index) => `/cars/porsche-911/frame-${String(index).padStart(2, "0")}.png`)

export function ProductViewer360({ name, image, images = [], priority = false, compact = false }: Props) {
  const frames = useMemo(() => images.length > 1 ? images : image ? [image] : fallbackFrames, [image, images])
  const [frame, setFrame] = useState(0)
  const start = useRef<number | null>(null)
  const move = (x: number) => { if (start.current === null || frames.length < 2) return; const delta = x - start.current; if (Math.abs(delta) < 18) return; setFrame(current => (current + (delta > 0 ? -1 : 1) + frames.length) % frames.length); start.current = x }
  const down = (event: PointerEvent<HTMLDivElement>) => { start.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId) }
  const up = () => { start.current = null }
  const key = (event: KeyboardEvent<HTMLDivElement>) => { if (frames.length < 2) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); setFrame(current => (current + (event.key === "ArrowRight" ? 1 : -1) + frames.length) % frames.length) } }
  return <div className={compact ? "model-preview compact" : "model-preview"} onPointerDown={down} onPointerMove={e => move(e.clientX)} onPointerUp={up} onPointerCancel={up} onKeyDown={key} tabIndex={0} role="group" aria-label={`${name} interactive vehicle preview. Drag or use left and right arrow keys to rotate.`}>
    <Image src={frames[frame]} alt={`${name}, view ${frame + 1} of ${frames.length}`} fill priority={priority} sizes={compact ? "(max-width: 700px) 100vw, 33vw" : "(max-width: 700px) 100vw, 62vw"} className="model-preview-image" />
    {frames.length > 1 && <><span className="viewer-hint">Drag to rotate</span><button type="button" className="viewer-reset" aria-label="Reset vehicle preview" onClick={() => setFrame(0)}><RotateCcw size={15} /></button><div className="viewer-progress" aria-hidden="true"><span style={{ width: `${((frame + 1) / frames.length) * 100}%` }} /></div></>}
  </div>
}
