'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { GameAction, GamePhase } from '@/lib/game/types';
import { createInitialState, gameReducer } from '@/lib/game/engine';
import { DAS_DELAY, ARR_SPEED } from '@/lib/game/constants';

const KEY_TO_ACTION: Record<string, GameAction> = {
  ArrowLeft: { type: 'MOVE_LEFT' },
  ArrowRight: { type: 'MOVE_RIGHT' },
  ArrowDown: { type: 'SOFT_DROP' },
};

const ONE_SHOT_KEYS: Record<string, GameAction> = {
  ArrowUp: { type: 'ROTATE_CW' },
  KeyZ: { type: 'ROTATE_CW' },
  KeyX: { type: 'ROTATE_CCW' },
  Space: { type: 'HARD_DROP' },
};

export function useGameLoop() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const keysRef = useRef<Set<string>>(new Set());
  const firstPressFrameRef = useRef<Record<string, number>>({});
  const lastDasFrameRef = useRef<Record<string, number>>({});

  const processKeys = useCallback((frame: number, phase: GamePhase, paused: boolean) => {
    if (paused || phase === 'gameover' || phase === 'clearing' || phase === 'dropping') return;

    for (const [key, action] of Object.entries(KEY_TO_ACTION)) {
      if (!keysRef.current.has(key)) {
        delete firstPressFrameRef.current[key];
        delete lastDasFrameRef.current[key];
        continue;
      }

      const firstFrame = firstPressFrameRef.current[key];
      if (firstFrame === undefined) {
        firstPressFrameRef.current[key] = frame;
        lastDasFrameRef.current[key] = frame;
        dispatch(action);
        continue;
      }

      const elapsed = frame - firstFrame;
      const lastDas = lastDasFrameRef.current[key] ?? firstFrame;

      if (elapsed >= DAS_DELAY && frame - lastDas >= ARR_SPEED) {
        lastDasFrameRef.current[key] = frame;
        dispatch(action);
      }
    }
  }, []);

  useEffect(() => {
    let rafId: number;
    let frame = 0;

    function loop() {
      frame++;
      const { phase, paused } = stateRef.current;
      processKeys(frame, phase, paused);
      dispatch({ type: 'TICK' });
      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [processKeys]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      keysRef.current.add(e.code);

      if (e.repeat) return;

      const oneShotAction = ONE_SHOT_KEYS[e.code];
      if (oneShotAction) {
        e.preventDefault();
        dispatch(oneShotAction);
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        dispatch({ type: 'HARD_DROP' });
        return;
      }

      if (e.code === 'KeyP') {
        dispatch({ type: 'TOGGLE_PAUSE' });
        return;
      }

      if (e.code === 'KeyR' && stateRef.current.phase === 'gameover') {
        dispatch({ type: 'RESTART' });
        return;
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.code);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return { state, dispatch };
}
