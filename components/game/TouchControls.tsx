import type { GameAction } from '@/lib/game/types';
import type { Dispatch } from 'react';

interface TouchControlsProps {
  dispatch: Dispatch<GameAction>;
  paused: boolean;
  onPause: () => void;
}

function Btn({
  onAction,
  label,
  children,
  className = '',
}: {
  onAction: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      onPointerDown={(e) => { e.preventDefault(); onAction(); }}
      className={`
        flex items-center justify-center
        bg-slate-800/80 active:bg-slate-600/80
        border border-violet-500/20 rounded-xl
        text-slate-300 font-bold select-none touch-none
        transition-colors duration-75
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default function TouchControls({ dispatch, paused, onPause }: TouchControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2 mt-3 w-full md:hidden">
      {/* 上段: 回転 + ポーズ */}
      <div className="flex gap-2 justify-center">
        <Btn onAction={() => dispatch({ type: 'ROTATE_CCW' })} label="左回転" className="w-14 h-14 text-xl">
          ↺
        </Btn>
        <Btn onAction={onPause} label={paused ? '再開' : '一時停止'} className="w-14 h-14 text-sm">
          {paused ? '▶' : '⏸'}
        </Btn>
        <Btn onAction={() => dispatch({ type: 'ROTATE_CW' })} label="右回転" className="w-14 h-14 text-xl">
          ↻
        </Btn>
      </div>

      {/* 中段: 左・ソフトドロップ・右 */}
      <div className="flex gap-2 justify-center">
        <Btn onAction={() => dispatch({ type: 'MOVE_LEFT' })} label="左に移動" className="w-14 h-14 text-2xl">
          ←
        </Btn>
        <Btn onAction={() => dispatch({ type: 'SOFT_DROP' })} label="ソフトドロップ" className="w-14 h-14 text-xl">
          ↓
        </Btn>
        <Btn onAction={() => dispatch({ type: 'MOVE_RIGHT' })} label="右に移動" className="w-14 h-14 text-2xl">
          →
        </Btn>
      </div>

      {/* 下段: ハードドロップ */}
      <Btn onAction={() => dispatch({ type: 'HARD_DROP' })} label="ハードドロップ" className="w-44 h-12 text-sm tracking-widest">
        HARD DROP ⇓
      </Btn>
    </div>
  );
}
