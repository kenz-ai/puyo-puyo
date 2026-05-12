function chainColor(chain: number): string {
  if (chain >= 5) return 'text-yellow-300 drop-shadow-[0_0_8px_#fde047]';
  if (chain >= 4) return 'text-pink-400';
  if (chain >= 3) return 'text-red-400';
  return 'text-orange-400';
}

interface ScorePanelProps {
  score: number;
  highScore: number;
  level: number;
  chain: number;
  totalCleared: number;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-400 text-[10px] uppercase tracking-widest font-mono">{children}</p>;
}

function Value({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-mono font-bold tabular-nums ${className}`}>{children}</p>;
}

export default function ScorePanel({ score, highScore, level, chain, totalCleared, bgmEnabled, sfxEnabled, onToggleBgm, onToggleSfx }: ScorePanelProps) {
  return (
    <div className="flex flex-col gap-5 bg-slate-900/80 backdrop-blur-sm border border-violet-500/10 rounded-lg p-4 min-w-[100px]">
      <div>
        <Label>Hi-Score</Label>
        <Value className="text-yellow-400 text-sm">{highScore.toLocaleString()}</Value>
      </div>

      <div>
        <Label>Score</Label>
        <Value className="text-white text-lg">{score.toLocaleString()}</Value>
      </div>

      <div>
        <Label>Level</Label>
        <Value className="text-violet-300 text-2xl">{level}</Value>
      </div>

      <div>
        <Label>Cleared</Label>
        <Value className="text-slate-300 text-sm">{totalCleared}</Value>
      </div>

      {chain >= 2 && (
        <div key={chain} className="animate-chain-pop text-center">
          <Label>Chain</Label>
          <Value className={`text-3xl ${chainColor(chain)}`}>{chain}!!</Value>
          {chain >= 5 && (
            <p className="text-[9px] font-mono text-yellow-300 tracking-widest animate-pulse">AMAZING</p>
          )}
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-slate-700/50 flex flex-col gap-2">
        <div className="flex gap-1">
          <button
            onClick={onToggleBgm}
            title={bgmEnabled ? 'BGM ON' : 'BGM OFF'}
            className={`flex-1 text-[9px] font-mono py-1 rounded border transition-colors ${
              bgmEnabled
                ? 'border-violet-500/40 text-violet-300 bg-violet-900/20'
                : 'border-slate-700 text-slate-600 bg-transparent'
            }`}
          >
            ♪ BGM
          </button>
          <button
            onClick={onToggleSfx}
            title={sfxEnabled ? 'SFX ON' : 'SFX OFF'}
            className={`flex-1 text-[9px] font-mono py-1 rounded border transition-colors ${
              sfxEnabled
                ? 'border-violet-500/40 text-violet-300 bg-violet-900/20'
                : 'border-slate-700 text-slate-600 bg-transparent'
            }`}
          >
            ◈ SFX
          </button>
        </div>
        <p className="text-slate-600 text-[9px] font-mono leading-4">
          ←→ Move<br />
          ↑/Z Rotate R<br />
          X Rotate L<br />
          ↓ Soft Drop<br />
          SPC Hard Drop<br />
          P Pause<br />
          R Restart
        </p>
      </div>
    </div>
  );
}
