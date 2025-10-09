export const TAGS = ["雑記", "技術", "Android", "WEB", "フロントエンド", "バックエンド"] as const;
export type Tag = (typeof TAGS)[number];