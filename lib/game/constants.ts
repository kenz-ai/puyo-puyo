import type { PuyoColor, Orientation, Position } from './types';

export const BOARD_COLS = 6;
export const BOARD_ROWS = 13;
export const VISIBLE_ROWS = 12;
export const HIDDEN_ROW = 0;

export const SPAWN_PIVOT: Position = { row: 1, col: 2 };
export const SPAWN_ORIENTATION: Orientation = 'up';

export const FALL_SPEEDS: Record<number, number> = {
  1: 48, 2: 43, 3: 38, 4: 33, 5: 28,
  6: 23, 7: 18, 8: 13, 9: 8, 10: 6,
};

export const LOCK_DELAY_FRAMES = 30;
export const CLEAR_ANIM_FRAMES = 45;
export const DROP_SETTLE_FRAMES = 20;

export const CHAIN_BONUS: Record<number, number> = {
  1: 1, 2: 8, 3: 16, 4: 32,
};
export const CHAIN_BONUS_MAX = 64;

export const MIN_CONNECT = 4;
export const LEVEL_UP_THRESHOLD = 30;

export const PUYO_COLORS: PuyoColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export const DAS_DELAY = 16;
export const ARR_SPEED = 6;

export const CELL_SIZE = 44;

export const STORAGE_KEY_HIGHSCORE = 'puyo-highscore';
export const STORAGE_KEY_BGM = 'puyo-bgm';
export const STORAGE_KEY_SFX = 'puyo-sfx';
