"use client";

/**
 * 依存性注入（DI）の設定を一元管理するファイル
 * このファイルは以下の責務を持ちます：
 * 1. DIコンテナの初期化と依存関係の登録
 * 2. DIコンテナをアプリケーションの初期化時に確実に読み込むためのコンポーネント提供
 */

import "reflect-metadata";
import { container } from 'tsyringe';
import { ContactFormRepository } from '@/app/repository/contactFormRepository';
import { SkillsRepository } from '@/app/repository/skillsRepository';
import { BlogRepository } from '@/app/repository/blogRepository';

// すべての依存関係を一箇所で登録
container.register('IContactFormRepository', { useClass: ContactFormRepository });
container.register('ISkillsRepository', { useClass: SkillsRepository });
container.register('IBlogRepository', { useClass: BlogRepository });

/**
 * DIコンテナを初期化するためだけのクライアントコンポーネント
 * レイアウトに配置され、アプリケーションの起動時に確実にDIコンテナが初期化される
 */
export function DIInitializer() {
  // 何もレンダリングしない
  return null;
}

/**
 * サーバーコンポーネントからDIInitializerを呼び出すためのラッパー
 */
export function DIProvider() {
  return <DIInitializer />;
}

// グローバルなDIコンテナをエクスポート
export { container };
