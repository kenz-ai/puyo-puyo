'use client';

import { useGameLoop } from '@/hooks/useGameLoop';
import { useAudio } from '@/hooks/useAudio';
import GameBoard from '@/components/game/GameBoard';
import NextPreview from '@/components/game/NextPreview';
import ScorePanel from '@/components/game/ScorePanel';
import GameOverlay from '@/components/game/GameOverlay';
import PauseOverlay from '@/components/game/PauseOverlay';
import TouchControls from '@/components/game/TouchControls';

export default function GamePage() {
  const { state, dispatch } = useGameLoop();
  const { initAudio, bgmEnabled, sfxEnabled, toggleBgm, toggleSfx } = useAudio(state);

  const handlePause = () => dispatch({ type: 'TOGGLE_PAUSE' });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none" onClick={initAudio}>
      {/* Background glow */}
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
          bgmEnabled={bgmEnabled}
          sfxEnabled={sfxEnabled}
          onToggleBgm={toggleBgm}
          onToggleSfx={toggleSfx}
        />

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-between w-full px-1">
            <p className="text-lg font-bold tracking-widest" aria-label="ぷよぷよ">
              {'ぷよぷよ'.split('').map((char, i) => {
                const colors = [
                  'text-red-400 drop-shadow-[0_0_6px_#f87171]',
                  'text-blue-400 drop-shadow-[0_0_6px_#60a5fa]',
                  'text-green-400 drop-shadow-[0_0_6px_#4ade80]',
                  'text-yellow-300 drop-shadow-[0_0_6px_#fde047]',
                  'text-purple-400 drop-shadow-[0_0_6px_#c084fc]',
                  'text-pink-400 drop-shadow-[0_0_6px_#f472b6]',
                  'text-cyan-400 drop-shadow-[0_0_6px_#22d3ee]',
                  'text-orange-400 drop-shadow-[0_0_6px_#fb923c]',
                ];
                return (
                  <span key={i} className={colors[i % colors.length]}>
                    {char}
                  </span>
                );
              })}
            </p>
            {/* ポーズボタン（デスクトップ） */}
            <button
              onClick={handlePause}
              className="hidden md:flex text-slate-500 hover:text-violet-300 transition-colors text-xs font-mono"
            >
              {state.paused ? '▶ Resume' : '⏸ Pause'}
            </button>
          </div>

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

            {state.paused && state.phase !== 'gameover' && (
              <PauseOverlay onResume={handlePause} />
            )}
          </div>

          {/* モバイルタッチコントロール */}
          <TouchControls
            dispatch={dispatch}
            paused={state.paused}
            onPause={handlePause}
          />
        </div>

        <NextPreview nextPairs={state.nextPairs} />
      </div>
    </div>
  );
}
