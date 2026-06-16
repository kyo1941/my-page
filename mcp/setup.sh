#!/usr/bin/env bash
# my-page MCP のセットアップ（このスクリプトは秘匿情報を含まない）。
# 設定値は macOS Keychain に保存し、サーバーが起動時に読み取る。
# 新しい Mac でも `./setup.sh` を実行してプロンプトに答えるだけで再現できる。
set -euo pipefail

SERVICE="my-page-mcp"
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== my-page MCP セットアップ ==="

echo "[1/3] 依存インストールとビルド..."
(cd "$DIR" && npm install --silent && npm run --silent build)

echo "[2/3] 設定値を Keychain に保存..."
# $1=Keychainの項目名 $2=プロンプト $3=既定値 $4=secret(指定時は非表示入力)
store() {
  local key="$1" prompt="$2" default="${3:-}" secret="${4:-}" val
  if [ -n "$secret" ]; then
    read -r -s -p "  $prompt: " val; echo
  elif [ -n "$default" ]; then
    read -r -p "  $prompt [$default]: " val; val="${val:-$default}"
  else
    read -r -p "  $prompt: " val
  fi
  security add-generic-password -U -s "$SERVICE" -a "$key" -w "$val"
  echo "    ✓ $key を保存"
}

store BACKEND_URL    "バックエンド URL（読み取り/ログイン先）" "http://localhost:8080"
store FRONTEND_URL   "フロントエンド URL（変更系の経路 & Origin）" "http://localhost:3000"
store ADMIN_USERNAME "管理者ユーザー名"
store ADMIN_PASSWORD "管理者パスワード" "" secret

echo "[3/3] Claude Code に user スコープで登録..."
if claude mcp list 2>/dev/null | grep -q '^my-page-blog:'; then
  echo "    ✓ 既に登録済み"
else
  claude mcp add my-page-blog -s user -- \
    sh -c "cd \"$DIR\" && [ -f dist/index.js ] || npm run --silent build 1>&2; exec node dist/index.js"
  echo "    ✓ 登録完了"
fi

echo "=== 完了。新しい claude セッションから利用できます ==="
echo "（値を変更したいときは ./setup.sh を再実行するか、Keychain Access.app で"
echo "  サービス名 '$SERVICE' の項目を編集してください）"
