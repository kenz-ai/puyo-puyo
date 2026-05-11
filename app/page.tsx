'use client';

import { useGameLoop } from '@/hooks/useGameLoop';
import GameBoard from '@/components/game/GameBoard';
import NextPreview from '@/components/game/NextPreview';
import ScorePanel from '@/components/game/ScorePanel';
import GameOverlay from '@/components/game/GameOverlay';

export default function GamePage() {
  const { state, dispatch } = useGameLoop();

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 select-none">
      {/* Background glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative flex items-start gap-3 z-10">
        <ScorePanel
          score={state.score}
          highScore={state.highScore}
          level={state.level}
          chain={state.chain}
          totalCleared={state.totalCleared}
        />

        <div className="flex flex-col items-center gap-2">
          <p className="text-violet-300/60 text-[10px] font-mono tracking-[0.3em] uppercase">
            Puyo Puyo
          </p>

          <div className="relative">
            <GameBoard
              board={state.board}
              currentPair={state.currentPair}
              clearingCells={state.clearingCells}
              phase={state.phase}
            />

            {state.phase === 'gameover' && (
              <GameOverlay
                score={state.score}
                highScore={state.highScore}
                onRestart={() => dispatch({ type: 'RESTART' })}
              />
            )}
          </div>
        </div>

        <NextPreview nextPairs={state.nextPairs} />
      </div>
    </div>
  );
}
