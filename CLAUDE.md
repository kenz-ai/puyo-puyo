# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build (also runs type generation)
npm run start    # Start production server (run build first)
npm run lint     # Run ESLint
```

Type checking (no dedicated script — use the TypeScript compiler directly):
```bash
npx tsc --noEmit
```

## Architecture

This is a **Next.js 16** app using the **App Router** with React 19, TypeScript, and Tailwind CSS v4.

**Routing**: File-based via `app/` directory. `app/layout.tsx` is the root layout (sets fonts, metadata, global styles). `app/page.tsx` is the `/` route. New routes are added as `app/<route>/page.tsx`.

**Styling**: Tailwind CSS v4 configured via `postcss.config.mjs` + `@tailwindcss/postcss`. Global CSS in `app/globals.css`. No `tailwind.config.js` — v4 uses CSS-native configuration.

**Path alias**: `@/*` maps to the project root (e.g., `@/app/...`, `@/components/...`).

**Fonts**: Geist Sans and Geist Mono loaded via `next/font/google` in the root layout and exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`).

**No test framework** is configured. Add one (e.g., Jest + Testing Library or Vitest) if tests are needed.

---

## ぷよぷよアプリ 要件定義

### 概要

Next.js + React 19 上で動作するブラウザ版ぷよぷよ。モダンで先進的なUI/UXを目指す。

---

### ゲームルール

#### フィールド
- 盤面サイズ: 横6列 × 縦13行（上2行は隠しエリア＝出現バッファ）
- ぷよの色: 赤・青・緑・黄・紫 の5色

#### 操作単位: ぷよペア
- 常に2つのぷよがペアで落下する
- 軸ぷよ（pivot）と副ぷよ（satellite）で構成
- 副ぷよは軸ぷよを中心に上下左右に回転

#### 落下・固定
- ぷよペアは一定間隔で1マス落下（落下速度はレベルに応じて加速）
- 着地後、一定時間内に操作がなければ固定される
- 固定後、連鎖処理に移行する

#### 消去ルール
- 同色ぷよが上下左右に4つ以上連結したグループは消える
- 消去後に空中に浮いたぷよは落下する（重力）

#### 連鎖（チェーン）
1. 消去 → 落下 → 再消去 を繰り返す
2. 連鎖数に応じてスコア倍率が増加（連鎖ボーナス）

#### スコア計算
```
得点 = (消去ぷよ数 × 10) × 連鎖ボーナス倍率
```
| 連鎖数 | 倍率 |
|--------|------|
| 1      | 1×   |
| 2      | 8×   |
| 3      | 16×  |
| 4      | 32×  |
| 5+     | 64×  |

#### おじゃまぷよ
- 連鎖による高得点時、相手フィールド（将来の2P対戦モード）に降ってくる妨害ぷよ
- おじゃまぷよは色がなく消去できない（隣接する同色グループが消えると一緒に消える）

#### ゲームオーバー
- 出現位置（隠しエリア）にぷよが積み上がり、新しいペアが出現できなくなったとき

---

### 機能要件

#### Phase 1（MVP）
- [ ] シングルプレイヤーモード
- [ ] キーボード操作（← → 移動 / ↑ Z 回転右 / X 回転左 / ↓ 高速落下 / Space ハードドロップ）
- [ ] NEXT ぷよ（次の2ペア）プレビュー表示
- [ ] スコア・レベル・連鎖数のリアルタイム表示
- [ ] レベルアップによる落下速度加速
- [ ] ゲームオーバー検出とリスタート
- [ ] ハイスコアのローカル保存（localStorage）

#### Phase 2
- [ ] アニメーション（消去エフェクト、連鎖カウンター演出）
- [ ] BGM・SE（Web Audio API）
- [ ] ダークモード対応（Tailwind `dark:` クラス）
- [ ] モバイル向けタッチ操作（スワイプ・タップ）
- [ ] ポーズ機能

#### Phase 3（将来）
- [ ] 2プレイヤー対戦モード（同一デバイス）
- [ ] AI対戦モード
- [ ] オンラインランキング

---

### 非機能要件

- **フレームレート**: 60fps を維持（`requestAnimationFrame` ベースのゲームループ）
- **レスポンシブ**: モバイル〜デスクトップで崩れないレイアウト
- **アクセシビリティ**: キーボードフォーカス管理、色覚多様性への配慮（形・パターンで色を補助）

---

### 技術設計方針

#### ディレクトリ構成（予定）
```
app/
  page.tsx              # ゲームエントリーポイント
  layout.tsx
components/
  game/
    GameBoard.tsx       # 盤面描画
    PuyoPair.tsx        # 落下中のペア
    NextPreview.tsx     # NEXTぷよ表示
    ScorePanel.tsx      # スコア・レベル表示
lib/
  game/
    engine.ts           # ゲームループ・状態管理
    board.ts            # 盤面データ操作（衝突判定・固定・消去）
    chain.ts            # 連鎖・スコア計算ロジック
    types.ts            # 型定義（Cell, PuyoColor, GameState など）
    constants.ts        # BOARD_WIDTH, BOARD_HEIGHT, COLORS など
```

#### 状態管理
- React の `useReducer` + `useRef` でゲーム状態を管理
- ゲームロジック（`lib/game/`）は Pure Function で実装し、UIから分離する
- ゲームループは `useEffect` 内で `requestAnimationFrame` を使用

#### 描画
- HTML の CSS Grid / Flexbox でセルを描画（Canvas は使わない）
- ぷよの見た目は Tailwind + CSS カスタムプロパティで管理
- 消去・連鎖アニメーションは CSS `@keyframes` + Tailwind `animate-` クラス

#### 型定義（`lib/game/types.ts`）
```ts
type PuyoColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'garbage' | null;
type Board = PuyoColor[][];  // [row][col], row 0 = top
interface PuyoPair {
  pivot: { row: number; col: number; color: PuyoColor };
  satellite: { row: number; col: number; color: PuyoColor };
}
interface GameState {
  board: Board;
  currentPair: PuyoPair;
  nextPairs: [PuyoPair, PuyoPair];
  score: number;
  level: number;
  chain: number;
  phase: 'falling' | 'locking' | 'clearing' | 'dropping' | 'gameover';
}
```
