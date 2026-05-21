import type { FallingPair, PuyoColor } from '@/lib/game/types';
import { PUYO_COLOR_CLASSES } from './puyoColors';

interface MiniPuyoProps {
  color: PuyoColor;
  size?: 'lg' | 'sm';
}

function MiniPuyo({ color, size = 'lg' }: MiniPuyoProps) {
  if (!color) return <div className={size === 'lg' ? 'w-8 h-8' : 'w-5 h-5'} />;

  const sizeClass = size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';

  return (
    <div className={`${sizeClass} rounded-full relative ${PUYO_COLOR_CLASSES[color] ?? ''}`}>
      <div className="absolute top-0.5 left-1 w-1.5 h-1.5 rounded-full bg-white/50" />
    </div>
  );
}

interface PairPreviewProps {
  pair: FallingPair;
  size?: 'lg' | 'sm';
}

function PairPreview({ pair, size = 'lg' }: PairPreviewProps) {
  const gap = size === 'lg' ? 'gap-1' : 'gap-0.5';
  return (
    <div className={`flex flex-col items-center ${gap}`}>
      <MiniPuyo color={pair.satelliteColor} size={size} />
      <MiniPuyo color={pair.pivotColor} size={size} />
    </div>
  );
}

interface NextPreviewProps {
  nextPairs: [FallingPair, FallingPair];
}

export default function NextPreview({ nextPairs }: NextPreviewProps) {
  return (
    <div className="flex flex-col gap-4 bg-slate-900/80 backdrop-blur-sm border border-violet-500/10 rounded-lg p-4 min-w-[80px]">
      <p className="text-slate-400 text-[10px] uppercase tracking-widest text-center font-mono">Next</p>
      <div className="flex flex-col items-center gap-6">
        <PairPreview pair={nextPairs[0]} size="lg" />
        <PairPreview pair={nextPairs[1]} size="sm" />
      </div>
    </div>
  );
}
