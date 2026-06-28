# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ベースガイド

このリポジトリの作業ガイド（アーキテクチャ、開発コマンド、環境変数、レイヤー構成、API 一覧、変更時の確認リスト）は `AGENTS.md` を正本とします。まずこちらを参照してください。

@AGENTS.md

`AGENTS.md` と実コード・設定ファイルが食い違う場合は、実コードを優先してください。設計・起動方法・環境変数・API 契約を変えたら `AGENTS.md` を更新します（この `CLAUDE.md` には設計詳細を重複させない）。

## Claude Code 固有メモ

- **MCP ブログ管理ツール**: このプロジェクトには `my-page-blog` MCP サーバーが登録済みで、`mcp__my-page-blog__{list_blogs,get_blog,create_blog,update_blog,delete_blog}` を直接呼べます。ブログの確認・作成・更新・削除はこれらを使うのが最短です。挙動は `AGENTS.md` の「MCP サーバー」節を参照（作成/更新/削除は frontend の `/api/admin` プロキシ経由で `revalidatePath()` が走る、日付入力は `yyyy年M月d日` 形式、など）。
- **作業ルール**: 未コミット変更を勝手に戻さない、秘密情報を含むファイル（`.env*`, `application.yaml`）をコミット対象にしない、生成物（`node_modules/`, `.next/`, `dist/`, `build/`, `.gradle/`）を編集しない。詳細は `AGENTS.md` の「重要な作業ルール」を参照。
- **変更後の最小チェック**: frontend は `cd frontend && pnpm check`、backend は `cd backend && ./gradlew :app:test`（style は `:app:ktlintCheck`）、MCP は `cd mcp && npm run build`。
