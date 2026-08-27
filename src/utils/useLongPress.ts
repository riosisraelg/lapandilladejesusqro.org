import { useCallback, useRef } from 'react';

export interface UseLongPressOptions {
  threshold?: number; // default 450ms
  cancelOnMoveDistance?: number; // default 10px
  vibrationPattern?: number | number[]; // default [20]
  onStart?: (event: React.TouchEvent | React.MouseEvent) => void;
  onFinish?: (event: React.TouchEvent | React.MouseEvent) => void;
  onCancel?: (event: React.TouchEvent | React.MouseEvent) => void;
}

export function useLongPress(
  onLongPress: (event: React.TouchEvent | React.MouseEvent) => void,
  options: UseLongPressOptions = {}
) {
  const {
    threshold = 450,
    cancelOnMoveDistance = 10,
    vibrationPattern = [20],
    onStart,
    onFinish,
    onCancel,
  } = options;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const isLongPressActiveRef = useRef<boolean>(false);

  const triggerVibration = useCallback(() => {
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(vibrationPattern);
      } catch {
        // Fallback gracefully on environments without vibration support
      }
    }
  }, [vibrationPattern]);

  const start = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      isLongPressActiveRef.current = false;

      let clientX = 0;
      let clientY = 0;
      if ('touches' in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ('clientX' in event) {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      startPosRef.current = { x: clientX, y: clientY };
      onStart?.(event);

      timerRef.current = setTimeout(() => {
        isLongPressActiveRef.current = true;
        triggerVibration();
        onLongPress(event);
        onFinish?.(event);
        timerRef.current = null;
      }, threshold);
    },
    [threshold, triggerVibration, onLongPress, onStart, onFinish]
  );

  const move = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (!startPosRef.current || !timerRef.current) return;

      let currentX = 0;
      let currentY = 0;
      if ('touches' in event && event.touches.length > 0) {
        currentX = event.touches[0].clientX;
        currentY = event.touches[0].clientY;
      } else if ('clientX' in event) {
        currentX = event.clientX;
        currentY = event.clientY;
      }

      const dx = currentX - startPosRef.current.x;
      const dy = currentY - startPosRef.current.y;
      const distance = Math.hypot(dx, dy);

      if (distance > cancelOnMoveDistance) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        onCancel?.(event);
      }
    },
    [cancelOnMoveDistance, onCancel]
  );

  const clear = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        onCancel?.(event);
      }
      startPosRef.current = null;
      isLongPressActiveRef.current = false;
    },
    [onCancel]
  );

  return {
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: clear,
    onTouchCancel: clear,
    onMouseDown: start,
    onMouseMove: move,
    onMouseUp: clear,
    onMouseLeave: clear,
  };
}

export default useLongPress;
