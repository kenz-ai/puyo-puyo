export type PuyoColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'garbage' | null;
export type Board = PuyoColor[][];
export type Orientation = 'up' | 'right' | 'down' | 'left';
export type GamePhase = 'falling' | 'locking' | 'clearing' | 'dropping' | 'gameover';

export interface Position {
  row: number;
  col: number;
}

export interface FallingPair {
  pivotPos: Position;
  satellitePos: Position;
  pivotColor: PuyoColor;
  satelliteColor: PuyoColor;
  orientation: Orientation;
}

export interface GameState {
  board: Board;
  currentPair: FallingPair;
  nextPairs: [FallingPair, FallingPair];
  score: number;
  highScore: number;
  level: number;
  chain: number;
  totalCleared: number;
  phase: GamePhase;
  clearingCells: Position[];
  lockTimer: number;
  fallTimer: number;
  clearTimer: number;
  dropTimer: number;
}

export type GameAction =
  | { type: 'MOVE_LEFT' }
  | { type: 'MOVE_RIGHT' }
  | { type: 'ROTATE_CW' }
  | { type: 'ROTATE_CCW' }
  | { type: 'SOFT_DROP' }
  | { type: 'HARD_DROP' }
  | { type: 'TICK' }
  | { type: 'RESTART' };
