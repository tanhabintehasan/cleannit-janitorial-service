"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";

// Interactive before/after comparison slider — drag or touch to reveal the
// "after" state over the "before" image. Visually demonstrates the
// balcony cleaning / netting transformation.
export default function BeforeAfterSlider({ before, after, beforeLabel = "Before", afterLabel = "After" }) {
  const wrapRef = useRef(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const update = useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(97, Math.max(3, pct)));
  }, []);

  function onPointerDown(e) {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    update(e.clientX);
  }
  function onPointerMove(e) {
    if (dragging.current) update(e.clientX);
  }
  function onPointerUp() {
    dragging.current = false;
  }

  return (
    <div
      ref={wrapRef}
      className="ba-slider"
      role="slider"
      aria-label="Before and after comparison slider"
      aria-valuenow={Math.round(pos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") setPos((p) => Math.max(3, p - 4));
        if (e.key === "ArrowRight") setPos((p) => Math.min(97, p + 4));
      }}
    >
      <div className="ba-img ba-before">
        <Image src={before.src} alt={before.alt} width={800} height={534} sizes="(max-width: 720px) 100vw, 60vw" style={{ width: "100%", height: "auto" }} />
      </div>
      <div className="ba-img ba-after" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Image src={after.src} alt={after.alt} width={800} height={534} sizes="(max-width: 720px) 100vw, 60vw" style={{ width: "100%", height: "auto" }} />
      </div>
      <span className="ba-tag ba-tag-before">{beforeLabel}</span>
      <span className="ba-tag ba-tag-after">{afterLabel}</span>
      <div className="ba-handle" style={{ left: `${pos}%` }}>
        <span className="ba-handle-line" />
        <span className="ba-handle-knob">⇔</span>
        <span className="ba-handle-line" />
      </div>
    </div>
  );
}
