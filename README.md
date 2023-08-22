# Bookmark App with Remix + Cloudflare Stacks

- Remix
  - Drizzle ORM, Drizzle Kit
- Cloudflare Pages
- KV
- D1
- Queue
- R2
- Cron Triggers

## Structure

- `app/routes`
  - URLに紐づくルートページを配置する。
  - [Folders for Organization](https://remix.run/docs/en/main/file-conventions/route-files-v2#folders-for-organization)のパターンに従ってRouting Pathをディレクトリにして`route.tsx`ファイルを配置する。
  - ディレクトリの中にはそのページでのみ使うコンポーネントなどを配置する。
- `app/features`
  - ページ横断で使うコンポーネントや関数などを配置する。
  - `app/features/feature-name`のようにディレクトリを作成し、その中に`components`や`services`などのように階層を設けてファイルを配置する。
- `app/db`
  - データベースのスキーマファイルとマイグレーションファイルを配置する。

## Development

### Migration

```sh
npm run migrations:gen
```

### Start server

```sh
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

## Deployment

### Deploy

```sh
pages:deploy
```
