'use client';

import { useEffect } from 'react';

const WHEEL_DISTANCE = 0.65;
const EASING_TIME_MS = 90;

export function SmoothWheelScroll() {
  useEffect(() => {
    const root = document.documentElement;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let lastTime = 0;
    let lastScroll = window.scrollY;
    let position = lastScroll;
    let target = lastScroll;

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const isLocked = () =>
      root.classList.contains('chandra-intro-active') ||
      document.body.style.overflow === 'hidden';

    const scrollLimit = () => Math.max(0, root.scrollHeight - root.clientHeight);

    const animate = (time: number) => {
      if (motion.matches || isLocked() || window.scrollY !== lastScroll) {
        stop();
        return;
      }

      target = Math.min(target, scrollLimit());
      const remaining = target - position;
      const done = Math.abs(remaining) < 0.75;
      const elapsed = Math.max(0, time - lastTime);
      const progress = 1 - Math.exp(-elapsed / EASING_TIME_MS);
      position = done ? target : position + remaining * progress;
      window.scrollTo({ top: position, behavior: 'instant' });
      lastScroll = window.scrollY;
      lastTime = time;
      frame = done ? 0 : requestAnimationFrame(animate);
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        motion.matches || isLocked() || event.defaultPrevented ||
        !event.cancelable || event.ctrlKey || event.metaKey || event.shiftKey ||
        !event.deltaY || Math.abs(event.deltaX) >= Math.abs(event.deltaY)
      ) return;

      // Keep native wheel handling inside independently scrolling panels and controls.
      const useNative = event.composedPath().some((element) =>
        element instanceof HTMLElement &&
        element !== root && element !== document.body &&
        (element.matches('select, input, textarea, [contenteditable]') ||
          (element.scrollHeight > element.clientHeight &&
            /^(auto|scroll|overlay)$/.test(getComputedStyle(element).overflowY)))
      );
      if (useNative) return;

      event.preventDefault();
      const current = window.scrollY;
      if (!frame || current !== lastScroll) {
        stop();
        position = target = lastScroll = current;
        lastTime = performance.now();
        frame = requestAnimationFrame(animate);
      }

      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? root.clientHeight : 1;
      const delta = event.deltaY * unit * WHEEL_DISTANCE;
      // A direction change should respond immediately, even with momentum left over.
      if ((target - current) * delta < 0) target = current;

      const maxAhead = root.clientHeight * 0.5;
      const queued = Math.max(-maxAhead, Math.min(maxAhead, target + delta - current));
      target = Math.max(0, Math.min(scrollLimit(), current + queued));
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('pointerdown', stop, { passive: true });
    window.addEventListener('keydown', stop);
    window.addEventListener('blur', stop);
    motion.addEventListener('change', stop);

    return () => {
      stop();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', stop);
      window.removeEventListener('blur', stop);
      motion.removeEventListener('change', stop);
    };
  }, []);

  return null;
}
