interface ScorePanelProps {
  score: number;
  highScore: number;
  level: number;
  chain: number;
  totalCleared: number;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-400 text-[10px] uppercase tracking-widest font-mono">{children}</p>;
}

function Value({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-mono font-bold tabular-nums ${className}`}>{children}</p>;
}

export default function ScorePanel({ score, highScore, level, chain, totalCleared }: ScorePanelProps) {
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
        <div key={chain} className="animate-chain-pop">
          <Label>Chain</Label>
          <Value className="text-orange-400 text-3xl">{chain} !!</Value>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-slate-700/50">
        <p className="text-slate-600 text-[9px] font-mono leading-4">
          ←→ Move<br />
          ↑/Z Rotate R<br />
          X Rotate L<br />
          ↓ Soft Drop<br />
          SPC Hard Drop<br />
          R Restart
        </p>
      </div>
    </div>
  );
}
