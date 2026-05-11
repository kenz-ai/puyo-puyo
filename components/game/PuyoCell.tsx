import type { PuyoColor } from '@/lib/game/types';

export type CellType = 'fixed' | 'falling' | 'ghost' | 'clearing' | 'empty';

interface PuyoCellProps {
  color: PuyoColor;
  cellType: CellType;
  isClearing?: boolean;
}

const COLOR_CLASSES: Record<NonNullable<Exclude<PuyoColor, null>>, string> = {
  red:     'bg-red-500 shadow-[0_0_14px_#ef4444bb]',
  blue:    'bg-blue-500 shadow-[0_0_14px_#3b82f6bb]',
  green:   'bg-green-500 shadow-[0_0_14px_#22c55ebb]',
  yellow:  'bg-yellow-400 shadow-[0_0_14px_#eab308bb]',
  purple:  'bg-purple-500 shadow-[0_0_14px_#a855f7bb]',
  garbage: 'bg-slate-400 shadow-[0_0_6px_#94a3b8aa]',
};

const GHOST_CLASSES: Record<NonNullable<Exclude<PuyoColor, null>>, string> = {
  red:     'border-2 border-red-500/60',
  blue:    'border-2 border-blue-500/60',
  green:   'border-2 border-green-500/60',
  yellow:  'border-2 border-yellow-400/60',
  purple:  'border-2 border-purple-500/60',
  garbage: 'border-2 border-slate-400/60',
};

export default function PuyoCell({ color, cellType, isClearing }: PuyoCellProps) {
  if (!color || cellType === 'empty') {
    return <div className="aspect-square" />;
  }

  if (cellType === 'ghost') {
    return (
      <div className="aspect-square p-0.5">
        <div className={`w-full h-full rounded-full opacity-40 ${GHOST_CLASSES[color]}`} />
      </div>
    );
  }

  return (
    <div className="aspect-square p-0.5">
      <div
        className={`
          w-full h-full rounded-full relative overflow-hidden
          ${COLOR_CLASSES[color]}
          ${isClearing ? 'animate-puyo-clear' : ''}
          transition-transform duration-75
        `}
      >
        <div className="absolute top-1 left-1.5 w-2 h-2 rounded-full bg-white/50" />
      </div>
    </div>
  );
}
