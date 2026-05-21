import { useMemo } from 'react';
import type { Board, FallingPair, GamePhase, Position, PuyoColor } from '@/lib/game/types';
import { BOARD_COLS, VISIBLE_ROWS } from '@/lib/game/constants';
import { getHardDropPosition } from '@/lib/game/board';
import PuyoCell, { type CellType } from './PuyoCell';

interface RenderCell {
  color: PuyoColor;
  cellType: CellType;
  isClearing: boolean;
}

function posKey(pos: Position) {
  return `${pos.row},${pos.col}`;
}

function composeBoardForRender(
  board: Board,
  currentPair: FallingPair,
  clearingCells: Position[],
  phase: GamePhase,
): RenderCell[][] {
  const clearingSet = new Set(clearingCells.map(posKey));
  const ghost = phase !== 'gameover' ? getHardDropPosition(board, currentPair) : null;

  const ghostSet = new Set<string>();
  if (ghost) {
    ghostSet.add(posKey(ghost.pivotPos));
    ghostSet.add(posKey(ghost.satellitePos));
  }

  const fallingSet = new Map<string, PuyoColor>();
  if (phase === 'falling' || phase === 'locking') {
    fallingSet.set(posKey(currentPair.pivotPos), currentPair.pivotColor);
    fallingSet.set(posKey(currentPair.satellitePos), currentPair.satelliteColor);
  }

  // row 0 is hidden; we render rows 1..BOARD_ROWS-1 = VISIBLE_ROWS rows
  const result: RenderCell[][] = [];
  for (let row = 1; row < 1 + VISIBLE_ROWS; row++) {
    const rowCells: RenderCell[] = [];
    for (let col = 0; col < BOARD_COLS; col++) {
      const key = `${row},${col}`;
      const isClearing = clearingSet.has(key);

      if (fallingSet.has(key)) {
        rowCells.push({ color: fallingSet.get(key)!, cellType: 'falling', isClearing: false });
      } else if (board[row][col] !== null) {
        rowCells.push({ color: board[row][col], cellType: 'fixed', isClearing });
      } else if (ghostSet.has(key) && !fallingSet.has(key)) {
        // ghost only where falling pair isn't
        const ghostColor = key === posKey(ghost!.pivotPos)
          ? currentPair.pivotColor
          : currentPair.satelliteColor;
        rowCells.push({ color: ghostColor, cellType: 'ghost', isClearing: false });
      } else {
        rowCells.push({ color: null, cellType: 'empty', isClearing: false });
      }
    }
    result.push(rowCells);
  }

  return result;
}

interface GameBoardProps {
  board: Board;
  currentPair: FallingPair;
  clearingCells: Position[];
  phase: GamePhase;
}

export default function GameBoard({ board, currentPair, clearingCells, phase }: GameBoardProps) {
  const renderBoard = useMemo(
    () => composeBoardForRender(board, currentPair, clearingCells, phase),
    [board, currentPair, clearingCells, phase],
  );

  return (
    <div
      role="grid"
      aria-label="ぷよぷよ盤面"
      className="border border-violet-500/20 rounded bg-slate-900/60"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_COLS}, 44px)`,
        gridTemplateRows: `repeat(${VISIBLE_ROWS}, 44px)`,
      }}
    >
      {renderBoard.map((row, ri) =>
        row.map((cell, ci) => (
          <PuyoCell
            key={`${ri}-${ci}`}
            color={cell.color}
            cellType={cell.cellType}
            isClearing={cell.isClearing}
          />
        ))
      )}
    </div>
  );
}
