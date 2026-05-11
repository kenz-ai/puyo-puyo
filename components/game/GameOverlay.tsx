interface GameOverlayProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

export default function GameOverlay({ score, highScore, onRestart }: GameOverlayProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded gap-4 z-10">
      <h2 className="text-red-400 text-3xl font-bold font-mono tracking-widest uppercase">
        Game Over
      </h2>
      <div className="text-center font-mono">
        <p className="text-slate-400 text-xs uppercase tracking-widest">Score</p>
        <p className="text-white text-2xl font-bold">{score.toLocaleString()}</p>
        {score >= highScore && score > 0 && (
          <p className="text-yellow-400 text-xs mt-1">New High Score!</p>
        )}
      </div>
      <button
        onClick={onRestart}
        className="mt-2 px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold rounded-full transition-colors text-sm tracking-widest uppercase"
      >
        Restart [R]
      </button>
    </div>
  );
}
