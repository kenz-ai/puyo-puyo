import type { PuyoColor } from '@/lib/game/types';

export const PUYO_COLOR_CLASSES: Record<NonNullable<Exclude<PuyoColor, null>>, string> = {
  red:     'bg-red-500 shadow-[0_0_14px_#ef4444bb]',
  blue:    'bg-blue-500 shadow-[0_0_14px_#3b82f6bb]',
  green:   'bg-green-500 shadow-[0_0_14px_#22c55ebb]',
  yellow:  'bg-yellow-400 shadow-[0_0_14px_#eab308bb]',
  purple:  'bg-purple-500 shadow-[0_0_14px_#a855f7bb]',
  garbage: 'bg-slate-400 shadow-[0_0_6px_#94a3b8aa]',
};

export const PUYO_GHOST_CLASSES: Record<NonNullable<Exclude<PuyoColor, null>>, string> = {
  red:     'border-2 border-red-500/60',
  blue:    'border-2 border-blue-500/60',
  green:   'border-2 border-green-500/60',
  yellow:  'border-2 border-yellow-400/60',
  purple:  'border-2 border-purple-500/60',
  garbage: 'border-2 border-slate-400/60',
};
