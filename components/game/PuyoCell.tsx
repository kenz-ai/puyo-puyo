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

function NormalFace() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ gap: '2px', paddingTop: '3px' }}
    >
      <div className="flex" style={{ gap: '4px' }}>
        {/* 左目 */}
        <div className="w-2 h-2.5 rounded-full bg-white flex items-end justify-center" style={{ paddingBottom: '2px' }}>
          <div className="w-1 h-1 rounded-full bg-slate-900" />
        </div>
        {/* 右目 */}
        <div className="w-2 h-2.5 rounded-full bg-white flex items-end justify-center" style={{ paddingBottom: '2px' }}>
          <div className="w-1 h-1 rounded-full bg-slate-900" />
        </div>
      </div>
      {/* 笑顔 */}
      <div className="w-3.5 h-1.5 border-b-2 border-white/90 rounded-b-full" />
    </div>
  );
}

function ScaredFace() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ gap: '2px', paddingTop: '2px' }}
    >
      <div className="flex" style={{ gap: '3px' }}>
        {/* 見開いた左目 */}
        <div className="w-2.5 h-3 rounded-full bg-white flex items-center justify-center">
          <div className="w-1.5 h-2 rounded-full bg-slate-900" />
        </div>
        {/* 見開いた右目 */}
        <div className="w-2.5 h-3 rounded-full bg-white flex items-center justify-center">
          <div className="w-1.5 h-2 rounded-full bg-slate-900" />
        </div>
      </div>
      {/* 驚いた口（○形） */}
      <div className="w-3 h-3 rounded-full border-2 border-white/90" />
    </div>
  );
}

function GarbageFace() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ gap: '3px' }}
    >
      <div className="flex" style={{ gap: '5px' }}>
        <span className="text-white/80 font-bold leading-none" style={{ fontSize: '9px' }}>✕</span>
        <span className="text-white/80 font-bold leading-none" style={{ fontSize: '9px' }}>✕</span>
      </div>
      <div className="w-3 border-b-2 border-white/60" />
    </div>
  );
}

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

  const isGarbage = color === 'garbage';

  return (
    <div className="aspect-square p-0.5">
      <div
        className={`
          w-full h-full rounded-full relative
          ${COLOR_CLASSES[color]}
          ${isClearing ? 'animate-puyo-clear' : ''}
        `}
      >
        {/* ハイライト（つや） */}
        <div className="absolute top-1 left-1.5 w-2 h-2 rounded-full bg-white/50" />

        {/* 顔 */}
        {isGarbage
          ? <GarbageFace />
          : isClearing
            ? <ScaredFace />
            : <NormalFace />
        }
      </div>
    </div>
  );
}
