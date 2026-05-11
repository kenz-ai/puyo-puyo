import type { Board, Position } from './types';
import { BOARD_COLS, BOARD_ROWS, CHAIN_BONUS, CHAIN_BONUS_MAX, MIN_CONNECT } from './constants';

const DIRECTIONS: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

export function findConnectedGroups(board: Board): Position[][] {
  const visited: boolean[][] = Array.from({ length: BOARD_ROWS }, () => new Array(BOARD_COLS).fill(false));
  const groups: Position[][] = [];

  for (let row = 0; row < BOARD_ROWS; row++) {
    for (let col = 0; col < BOARD_COLS; col++) {
      const color = board[row][col];
      if (visited[row][col] || color === null || color === 'garbage') continue;

      const group: Position[] = [];
      const queue: Position[] = [{ row, col }];
      visited[row][col] = true;

      while (queue.length > 0) {
        const pos = queue.shift()!;
        group.push(pos);

        for (const [dr, dc] of DIRECTIONS) {
          const nr = pos.row + dr;
          const nc = pos.col + dc;
          if (nr < 0 || nr >= BOARD_ROWS || nc < 0 || nc >= BOARD_COLS) continue;
          if (visited[nr][nc] || board[nr][nc] !== color) continue;
          visited[nr][nc] = true;
          queue.push({ row: nr, col: nc });
        }
      }

      groups.push(group);
    }
  }

  return groups;
}

export function findClearTargets(board: Board): Position[] {
  return findConnectedGroups(board)
    .filter(group => group.length >= MIN_CONNECT)
    .flat();
}

export function findGarbageToClear(board: Board, clearTargets: Position[]): Position[] {
  const targetKeys = new Set(clearTargets.map(p => `${p.row},${p.col}`));
  const garbageKeys = new Set<string>();
  const garbage: Position[] = [];

  for (const pos of clearTargets) {
    for (const [dr, dc] of DIRECTIONS) {
      const nr = pos.row + dr;
      const nc = pos.col + dc;
      if (nr < 0 || nr >= BOARD_ROWS || nc < 0 || nc >= BOARD_COLS) continue;
      const key = `${nr},${nc}`;
      if (targetKeys.has(key) || garbageKeys.has(key)) continue;
      if (board[nr][nc] === 'garbage') {
        garbageKeys.add(key);
        garbage.push({ row: nr, col: nc });
      }
    }
  }

  return garbage;
}

export function clearCells(board: Board, positions: Position[]): Board {
  const newBoard = board.map(row => [...row]);
  for (const pos of positions) {
    newBoard[pos.row][pos.col] = null;
  }
  return newBoard;
}

export function getChainBonus(chainCount: number): number {
  if (chainCount >= 5) return CHAIN_BONUS_MAX;
  return CHAIN_BONUS[chainCount] ?? 1;
}

export function calcScore(clearedCount: number, chainCount: number): number {
  return clearedCount * 10 * getChainBonus(chainCount);
}
