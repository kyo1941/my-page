---
name: ship
description: Lint check, commit, push, and create a PR following this project's conventions
disable-model-invocation: true
allowed-tools: Bash(pnpm *), Bash(git *), Bash(gh *)
---

実装が完了したら、以下の手順で lint チェック・コミット・プッシュ・PR 作成を行ってください。

## 1. Lint チェック

変更が含まれる領域に応じて実行してください。

- **Frontend** (`frontend/` に変更がある場合): `cd frontend && pnpm lint`
- **Backend** (`backend/` に変更がある場合): `cd backend && ./gradlew :app:ktlintCheck`

エラーがあれば修正してから次に進む。

## 2. git の現状確認

以下を並列で実行して内容を把握する。

```
git status
git diff
git log --oneline -5
```

## 3. コミット

- 変更ファイルを個別に `git add` する（`git add -A` は使わない）
- コミットメッセージは既存のログに倣い `<type>: <summary>` 形式（英語）
- 末尾に必ず `Co-Authored-By: Claude <model> <version> <noreply@anthropic.com>` を付ける（例: `Claude Sonnet 4.6`）
- HEREDOC でメッセージを渡す

### コミットの粒度

- **1コミット = 1つの論理的な変更単位**。複数の独立した変更は分けてコミットする
- **各コミットはビルドが通る状態**にしておく。壊れた状態でコミットしない

## 4. プッシュ

```
git push -u origin <current-branch>
```

## 5. PR 作成

### タイトル形式

過去の PR を参考にスコープを `[]` で示す:

- `[Frontend] ...`
- `[Backend] ...`
- `[Infra] ...`
- 複数領域にまたがる場合は `/` 区切り: `[Frontend/Backend] ...`, `[Frontend/Infra] ...`

### ラベル

変更スコープに応じて付与（複数可）: `Frontend`, `Backend`, `Infra`, `Bug`, `Document`

### 本文

`.github/PULL_REQUEST_TEMPLATE.md` のテンプレートに従う:

```
## 変更内容
- <箇条書き>

## 該当するissue

<!-- もしあれば -->

- close #<number>
```

### コマンド例

```
gh pr create --title "[Frontend] ..." --label "Frontend" --body "$(cat <<'EOF'
## 変更内容
- ...

## 該当するissue

- close #...
EOF
)"
```
