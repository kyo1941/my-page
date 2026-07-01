/**
 * 雲の静的ジオメトリ。パス・座標など単体では意味の読み取れない値を集約する。
 * 雲（viewBox 480x130）の土台になる楕円の集合。
 */
export const cloudEllipses = [
  { cx: 240, cy: 94, rx: 220, ry: 18 },
  { cx: 210, cy: 68, rx: 120, ry: 34 },
  { cx: 96, cy: 82, rx: 86, ry: 26 },
  { cx: 372, cy: 80, rx: 100, ry: 30 },
  { cx: 270, cy: 54, rx: 72, ry: 26 },
  { cx: 140, cy: 62, rx: 80, ry: 28 },
] as const;
