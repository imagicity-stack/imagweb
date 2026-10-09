import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Img from "./Img";
import { photo } from "../lib/media";

// Big service rows; on a mouse device a photo card trails the cursor and swaps
// to the hovered row's image. Movement is eased in one rAF loop that only runs
// while the pointer is over the list. Touch devices get inline thumbnails.
export default function HoverList({ items }) {
  const listRef = useRef(null);
  const floatRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  // Preview images are only requested once a mouse actually enters the list.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    const float = floatRef.current;
    if (!list || !float) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let frame = 0;
    let running = false;

    const loop = () => {
      const dx = tx - x;
      x += dx * 0.16;
      y += (ty - y) * 0.16;
      const tilt = Math.max(-12, Math.min(12, dx * 0.08));
      float.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      frame = running ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (event) => {
      tx = event.clientX;
      ty = event.clientY;
      if (!running) {
        setArmed(true);
        x = tx;
        y = ty;
        running = true;
        frame = requestAnimationFrame(loop);
      }
    };

    const onLeave = () => {
      running = false;
      setActiveIndex(-1);
    };

    list.addEventListener("pointermove", onMove);
    list.addEventListener("pointerleave", onLeave);
    return () => {
      list.removeEventListener("pointermove", onMove);
      list.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ix-hlist" ref={listRef}>
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={`ix-hrow ${activeIndex === index ? "is-active" : ""}`}
          onPointerEnter={() => setActiveIndex(index)}
        >
          <span className="ix-hrow-num">{item.number}</span>
          <span className="ix-hrow-thumb">
            <Img id={item.image} alt="" width={240} ratio={0.75} sizes="120px" />
          </span>
          <span className="ix-hrow-main">
            <span className="ix-hrow-title">{item.title}</span>
            <span className="ix-hrow-sub">{item.tagline}</span>
          </span>
          <span className="ix-hrow-tags">
            {item.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </span>
          <span className="ix-hrow-arrow" aria-hidden="true">→</span>
        </Link>
      ))}

      <div className={`ix-hfloat ${activeIndex >= 0 ? "is-on" : ""}`} ref={floatRef} aria-hidden="true">
        <div className="ix-hfloat-card">
          {items.map((item, index) => (
            <span
              key={item.href}
              className={`ix-hfloat-img ${activeIndex === index ? "is-on" : ""}`}
              style={armed ? { backgroundImage: `url(${photo(item.image, 520, 0.72)})` } : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
