interface PauseOverlayProps {
  onResume: () => void;
}

export default function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center rounded gap-4 z-10">
      <div className="w-12 h-12 flex items-center justify-center gap-1.5">
        <div className="w-3.5 h-10 bg-violet-400 rounded-sm" />
        <div className="w-3.5 h-10 bg-violet-400 rounded-sm" />
      </div>
      <h2 className="text-violet-300 text-2xl font-bold font-mono tracking-widest uppercase">
        Pause
      </h2>
      <button
        onClick={onResume}
        className="mt-1 px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold rounded-full transition-colors text-sm tracking-widest uppercase"
      >
        Resume [P]
      </button>
    </div>
  );
}
