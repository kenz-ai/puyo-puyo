import type { Board, FallingPair, Orientation, Position, PuyoColor } from './types';
import { BOARD_COLS, BOARD_ROWS, HIDDEN_ROW } from './constants';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () => new Array(BOARD_COLS).fill(null));
}

export function calcSatellitePos(pivot: Position, orientation: Orientation): Position {
  const deltas: Record<Orientation, [number, number]> = {
    up: [-1, 0], right: [0, 1], down: [1, 0], left: [0, -1],
  };
  const [dr, dc] = deltas[orientation];
  return { row: pivot.row + dr, col: pivot.col + dc };
}

function rotateOrientationCW(o: Orientation): Orientation {
  const map: Record<Orientation, Orientation> = { up: 'right', right: 'down', down: 'left', left: 'up' };
  return map[o];
}

function rotateOrientationCCW(o: Orientation): Orientation {
  const map: Record<Orientation, Orientation> = { up: 'left', left: 'down', down: 'right', right: 'up' };
  return map[o];
}

export function canPlace(board: Board, pivotPos: Position, orientation: Orientation): boolean {
  const satellitePos = calcSatellitePos(pivotPos, orientation);
  for (const pos of [pivotPos, satellitePos]) {
    if (pos.col < 0 || pos.col >= BOARD_COLS) return false;
    if (pos.row >= BOARD_ROWS) return false;
    if (pos.row >= 0 && board[pos.row][pos.col] !== null) return false;
  }
  return true;
}

function applyMove(board: Board, pair: FallingPair, dr: number, dc: number): FallingPair | null {
  const newPivot = { row: pair.pivotPos.row + dr, col: pair.pivotPos.col + dc };
  if (!canPlace(board, newPivot, pair.orientation)) return null;
  const newSatellite = calcSatellitePos(newPivot, pair.orientation);
  return { ...pair, pivotPos: newPivot, satellitePos: newSatellite };
}

export function movePairLeft(board: Board, pair: FallingPair): FallingPair | null {
  return applyMove(board, pair, 0, -1);
}

export function movePairRight(board: Board, pair: FallingPair): FallingPair | null {
  return applyMove(board, pair, 0, 1);
}

export function movePairDown(board: Board, pair: FallingPair): FallingPair | null {
  return applyMove(board, pair, 1, 0);
}

function tryRotate(board: Board, pair: FallingPair, newOrientation: Orientation): FallingPair | null {
  const kicks: [number, number][] = [[0, 0], [0, -1], [0, 1], [-1, 0]];
  for (const [dr, dc] of kicks) {
    const newPivot = { row: pair.pivotPos.row + dr, col: pair.pivotPos.col + dc };
    if (canPlace(board, newPivot, newOrientation)) {
      return {
        ...pair,
        pivotPos: newPivot,
        satellitePos: calcSatellitePos(newPivot, newOrientation),
        orientation: newOrientation,
      };
    }
  }
  return null;
}

export function rotatePairCW(board: Board, pair: FallingPair): FallingPair | null {
  return tryRotate(board, pair, rotateOrientationCW(pair.orientation));
}

export function rotatePairCCW(board: Board, pair: FallingPair): FallingPair | null {
  return tryRotate(board, pair, rotateOrientationCCW(pair.orientation));
}

export function isLanded(board: Board, pair: FallingPair): boolean {
  const pivotBelow = { row: pair.pivotPos.row + 1, col: pair.pivotPos.col };
  const satBelow = { row: pair.satellitePos.row + 1, col: pair.satellitePos.col };

  const blocked = (pos: Position) =>
    pos.row >= BOARD_ROWS || (pos.row >= 0 && board[pos.row][pos.col] !== null);

  return blocked(pivotBelow) || blocked(satBelow);
}

export function getHardDropPosition(board: Board, pair: FallingPair): { pivotPos: Position; satellitePos: Position } {
  let current = pair;
  for (let i = 0; i < BOARD_ROWS; i++) {
    const next = movePairDown(board, current);
    if (!next) break;
    current = next;
  }
  return { pivotPos: current.pivotPos, satellitePos: current.satellitePos };
}

export function lockPair(board: Board, pair: FallingPair): Board {
  const newBoard = board.map(row => [...row]);
  const positions = [pair.pivotPos, pair.satellitePos];
  const colors = [pair.pivotColor, pair.satelliteColor];
  positions.forEach((pos, i) => {
    if (pos.row >= 0 && pos.row < BOARD_ROWS) {
      newBoard[pos.row][pos.col] = colors[i];
    }
  });
  return newBoard;
}

export function applyGravity(board: Board): Board {
  const newBoard: Board = Array.from({ length: BOARD_ROWS }, () => new Array(BOARD_COLS).fill(null));
  for (let col = 0; col < BOARD_COLS; col++) {
    const cells: NonNullable<PuyoColor>[] = [];
    for (let row = 0; row < BOARD_ROWS; row++) {
      const cell = board[row][col];
      if (cell !== null) cells.push(cell);
    }
    for (let i = 0; i < cells.length; i++) {
      newBoard[BOARD_ROWS - cells.length + i][col] = cells[i];
    }
  }
  return newBoard;
}

export function isGameOver(board: Board): boolean {
  for (let col = 0; col < BOARD_COLS; col++) {
    if (board[HIDDEN_ROW][col] !== null) return true;
  }
  return false;
}
