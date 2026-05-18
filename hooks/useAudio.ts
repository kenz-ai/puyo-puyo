'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameState } from '@/lib/game/types';
import {
  BgmPlayer,
  sfxClear, sfxChain, sfxGameOver, sfxHardDrop,
  sfxLand, sfxLevelUp, sfxMove, sfxRotate,
} from '@/lib/game/audio';

export function useAudio(state: GameState) {
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('puyo-bgm') !== 'false';
  });
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('puyo-sfx') !== 'false';
  });

  const ctxRef = useRef<AudioContext | null>(null);
  const sfxGainRef = useRef<GainNode | null>(null);
  const bgmGainRef = useRef<GainNode | null>(null);
  const bgmPlayerRef = useRef<BgmPlayer | null>(null);
  const prevStateRef = useRef<GameState>(state);
  const bgmEnabledRef = useRef(bgmEnabled);
  const sfxEnabledRef = useRef(sfxEnabled);

  useEffect(() => { bgmEnabledRef.current = bgmEnabled; }, [bgmEnabled]);
  useEffect(() => { sfxEnabledRef.current = sfxEnabled; }, [sfxEnabled]);

  // Create AudioContext on first call (requires user gesture)
  const ensureCtx = useCallback((): { ctx: AudioContext; sfx: AudioNode; bgm: AudioNode } | null => {
    if (ctxRef.current) {
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      return { ctx: ctxRef.current, sfx: sfxGainRef.current!, bgm: bgmGainRef.current! };
    }

    const ctx = new AudioContext();
    const sfxGain = ctx.createGain();
    const bgmGain = ctx.createGain();
    sfxGain.gain.value = 0.7;
    bgmGain.gain.value = 0.35;
    sfxGain.connect(ctx.destination);
    bgmGain.connect(ctx.destination);
    ctxRef.current = ctx;
    sfxGainRef.current = sfxGain;
    bgmGainRef.current = bgmGain;

    const player = new BgmPlayer(ctx, bgmGain);
    bgmPlayerRef.current = player;
    if (bgmEnabledRef.current) player.start();

    return { ctx, sfx: sfxGain, bgm: bgmGain };
  }, []);

  // Detect state transitions and play SFX
  useEffect(() => {
    const prev = prevStateRef.current;
    prevStateRef.current = state;

    const audio = ctxRef.current
      ? { ctx: ctxRef.current, sfx: sfxGainRef.current!, bgm: bgmGainRef.current! }
      : null;

    // BGM: stop on gameover, restart on new game
    if (state.phase === 'gameover' && prev.phase !== 'gameover') {
      bgmPlayerRef.current?.stop();
    }
    if (prev.phase === 'gameover' && state.phase === 'falling') {
      bgmPlayerRef.current?.stop();
      if (bgmEnabledRef.current) bgmPlayerRef.current?.start();
    }

    // BGM: pause/resume AudioContext with game pause
    if (audio?.ctx) {
      if (state.paused && !prev.paused) audio.ctx.suspend();
      if (!state.paused && prev.paused) audio.ctx.resume();
    }

    if (!sfxEnabledRef.current || !audio) return;
    const { ctx, sfx } = audio;

    // Move (column changed during active play)
    if (
      (prev.phase === 'falling' || prev.phase === 'locking') &&
      (state.phase === 'falling' || state.phase === 'locking') &&
      prev.currentPair.pivotPos.col !== state.currentPair.pivotPos.col
    ) {
      sfxMove(ctx, sfx);
    }

    // Rotate (orientation changed)
    if (
      (prev.phase === 'falling' || prev.phase === 'locking') &&
      (state.phase === 'falling' || state.phase === 'locking') &&
      prev.currentPair.orientation !== state.currentPair.orientation
    ) {
      sfxRotate(ctx, sfx);
    }

    // Natural land (enters locking phase)
    if (prev.phase === 'falling' && state.phase === 'locking') {
      sfxLand(ctx, sfx);
    }

    // Hard drop (from falling - skips locking entirely)
    // Natural lock or hard drop from locking phase
    if (prev.phase === 'falling' && state.phase === 'clearing') {
      sfxHardDrop(ctx, sfx);
    } else if (prev.phase === 'locking' && state.phase === 'clearing') {
      sfxClear(ctx, sfx, Math.max(1, state.chain));
    }

    // Clear (continuing chain after drop)
    if (prev.phase === 'dropping' && state.phase === 'clearing') {
      sfxClear(ctx, sfx, state.chain);
    }

    // Chain sound (2nd chain and beyond)
    if (state.chain >= 2 && state.chain > prev.chain) {
      sfxChain(ctx, sfx, state.chain);
    }

    // Level up
    if (state.level > prev.level) {
      sfxLevelUp(ctx, sfx);
    }

    // Game over
    if (state.phase === 'gameover' && prev.phase !== 'gameover') {
      sfxGameOver(ctx, sfx);
    }
  }, [state]);

  // Initialize AudioContext on first meaningful user interaction
  const initAudio = useCallback(() => {
    ensureCtx();
  }, [ensureCtx]);

  const toggleBgm = useCallback(() => {
    setBgmEnabled(prev => {
      const next = !prev;
      localStorage.setItem('puyo-bgm', String(next));
      if (bgmPlayerRef.current) {
        if (next) bgmPlayerRef.current.start();
        else bgmPlayerRef.current.stop();
      }
      return next;
    });
  }, []);

  const toggleSfx = useCallback(() => {
    setSfxEnabled(prev => {
      const next = !prev;
      localStorage.setItem('puyo-sfx', String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    return () => {
      bgmPlayerRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  return { initAudio, bgmEnabled, sfxEnabled, toggleBgm, toggleSfx };
}
