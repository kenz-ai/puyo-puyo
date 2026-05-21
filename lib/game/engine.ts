import type { Board, FallingPair, GameAction, GameState } from './types';
import {
  CLEAR_ANIM_FRAMES, DROP_SETTLE_FRAMES,
  FALL_SPEEDS, LEVEL_UP_THRESHOLD, LOCK_DELAY_FRAMES,
  PUYO_COLORS, SPAWN_ORIENTATION, SPAWN_PIVOT,
  STORAGE_KEY_HIGHSCORE,
} from './constants';
import {
  applyGravity, calcSatellitePos, canPlace, createEmptyBoard,
  getHardDropPosition, isGameOver, isLanded, lockPair,
  movePairDown, movePairLeft, movePairRight, rotatePairCCW, rotatePairCW,
} from './board';
import { calcScore, clearCells, findClearTargets, findGarbageToClear } from './chain';

function randomColor() {
  return PUYO_COLORS[Math.floor(Math.random() * PUYO_COLORS.length)];
}

export function createNewPair(): FallingPair {
  const pivotColor = randomColor();
  const satelliteColor = randomColor();
  return {
    pivotPos: { ...SPAWN_PIVOT },
    satellitePos: calcSatellitePos(SPAWN_PIVOT, SPAWN_ORIENTATION),
    pivotColor,
    satelliteColor,
    orientation: SPAWN_ORIENTATION,
  };
}

function loadHighScore(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY_HIGHSCORE) ?? '0', 10);
}

export function createInitialState(): GameState {
  const board = createEmptyBoard();
  return {
    board,
    currentPair: createNewPair(),
    nextPairs: [createNewPair(), createNewPair()],
    score: 0,
    highScore: loadHighScore(),
    level: 1,
    chain: 0,
    totalCleared: 0,
    phase: 'falling',
    clearingCells: [],
    lockTimer: 0,
    fallTimer: 0,
    clearTimer: 0,
    dropTimer: 0,
    paused: false,
  };
}

function spawnNext(state: GameState, board: Board): GameState {
  const newCurrent = state.nextPairs[0];
  const newNextPairs: [FallingPair, FallingPair] = [state.nextPairs[1], createNewPair()];

  if (isGameOver(board) || !canPlace(board, newCurrent.pivotPos, newCurrent.orientation)) {
    const highScore = Math.max(state.score, state.highScore);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_HIGHSCORE, String(highScore));
    }
    return { ...state, board, phase: 'gameover', highScore };
  }

  return {
    ...state,
    board,
    currentPair: newCurrent,
    nextPairs: newNextPairs,
    phase: 'falling',
    fallTimer: 0,
    lockTimer: 0,
    chain: 0,
  };
}

function processClearPhase(state: GameState, board: Board, chainCount: number): GameState {
  const targets = findClearTargets(board);
  if (targets.length === 0) {
    return spawnNext(state, board);
  }

  const garbage = findGarbageToClear(board, targets);
  const clearingCells = [...targets, ...garbage];
  const score = state.score + calcScore(targets.length, chainCount);
  const totalCleared = state.totalCleared + targets.length;
  const level = Math.min(10, 1 + Math.floor(totalCleared / LEVEL_UP_THRESHOLD));
  const highScore = Math.max(score, state.highScore);

  return {
    ...state,
    board,
    score,
    highScore,
    totalCleared,
    level,
    chain: chainCount,
    clearingCells,
    phase: 'clearing',
    clearTimer: CLEAR_ANIM_FRAMES,
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'MOVE_LEFT': {
      if (state.phase !== 'falling' && state.phase !== 'locking') return state;
      const moved = movePairLeft(state.board, state.currentPair);
      if (!moved) return state;
      return { ...state, currentPair: moved, lockTimer: LOCK_DELAY_FRAMES };
    }

    case 'MOVE_RIGHT': {
      if (state.phase !== 'falling' && state.phase !== 'locking') return state;
      const moved = movePairRight(state.board, state.currentPair);
      if (!moved) return state;
      return { ...state, currentPair: moved, lockTimer: LOCK_DELAY_FRAMES };
    }

    case 'ROTATE_CW': {
      if (state.phase !== 'falling' && state.phase !== 'locking') return state;
      const rotated = rotatePairCW(state.board, state.currentPair);
      if (!rotated) return state;
      return { ...state, currentPair: rotated, lockTimer: LOCK_DELAY_FRAMES };
    }

    case 'ROTATE_CCW': {
      if (state.phase !== 'falling' && state.phase !== 'locking') return state;
      const rotated = rotatePairCCW(state.board, state.currentPair);
      if (!rotated) return state;
      return { ...state, currentPair: rotated, lockTimer: LOCK_DELAY_FRAMES };
    }

    case 'SOFT_DROP': {
      if (state.phase !== 'falling' && state.phase !== 'locking') return state;
      const moved = movePairDown(state.board, state.currentPair);
      if (!moved) return state;
      return { ...state, currentPair: moved, fallTimer: 0 };
    }

    case 'HARD_DROP': {
      if (state.phase !== 'falling' && state.phase !== 'locking') return state;
      const { pivotPos, satellitePos } = getHardDropPosition(state.board, state.currentPair);
      const droppedPair = { ...state.currentPair, pivotPos, satellitePos };
      const board = lockPair(state.board, droppedPair);
      const afterGravity = applyGravity(board);
      return processClearPhase(state, afterGravity, 1);
    }

    case 'TOGGLE_PAUSE': {
      if (state.phase === 'gameover') return state;
      return { ...state, paused: !state.paused };
    }

    case 'TICK': {
      if (state.phase === 'gameover' || state.paused) return state;

      if (state.phase === 'falling') {
        const newFallTimer = state.fallTimer + 1;
        const fallSpeed = FALL_SPEEDS[state.level] ?? 6;

        if (newFallTimer < fallSpeed) {
          return { ...state, fallTimer: newFallTimer };
        }

        const moved = movePairDown(state.board, state.currentPair);
        if (moved) {
          return { ...state, currentPair: moved, fallTimer: 0 };
        }

        return { ...state, fallTimer: 0, phase: 'locking', lockTimer: LOCK_DELAY_FRAMES };
      }

      if (state.phase === 'locking') {
        if (!isLanded(state.board, state.currentPair)) {
          return { ...state, phase: 'falling', fallTimer: 0 };
        }

        const newLockTimer = state.lockTimer - 1;
        if (newLockTimer > 0) {
          return { ...state, lockTimer: newLockTimer };
        }

        const board = lockPair(state.board, state.currentPair);
        const afterGravity = applyGravity(board);
        return processClearPhase(state, afterGravity, 1);
      }

      if (state.phase === 'clearing') {
        const newClearTimer = state.clearTimer - 1;
        if (newClearTimer > 0) {
          return { ...state, clearTimer: newClearTimer };
        }

        const board = clearCells(state.board, state.clearingCells);
        return {
          ...state,
          board,
          clearingCells: [],
          phase: 'dropping',
          dropTimer: DROP_SETTLE_FRAMES,
        };
      }

      if (state.phase === 'dropping') {
        const newDropTimer = state.dropTimer - 1;
        if (newDropTimer > 0) {
          return { ...state, dropTimer: newDropTimer };
        }

        const afterGravity = applyGravity(state.board);
        return processClearPhase(state, afterGravity, state.chain + 1);
      }

      return state;
    }

    case 'RESTART': {
      return createInitialState();
    }

    default:
      return state;
  }
}
