import { AppLoadContext } from "@remix-run/cloudflare";
import { bookmarks } from "db/schema";
import { InferModel, desc, eq } from "drizzle-orm";
import { createClient } from "~/features/common/services/db.server";
import { Bookmark } from "~/features/bookmark/types/bookmark";

type CreateBookmark = InferModel<typeof bookmarks, "insert">;

export async function getBookmarks(
  context: AppLoadContext,
  userId: number
): Promise<Bookmark[]> {
  const env = context.env as Env;
  const db = createClient(env.DB);
  const records: Bookmark[] = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt))
    .limit(10)
    .all();
  return records;
}

export async function getBookmark(
  context: AppLoadContext,
  slug: string,
  userId: number
): Promise<Bookmark | undefined> {
  const env = context.env as Env;
  const db = createClient(env.DB);
  const record: Bookmark | undefined = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .where(eq(bookmarks.slug, slug))
    .get();
  return record;
}

export async function addBookmark(
  context: AppLoadContext,
  user: { id: number },
  url: string,
  comment: string | null
): Promise<Bookmark> {
  const env = context.env as Env;
  const db = createClient(env.DB);
  const slug = await getDigestString(url, env.SESSION_SECRET);
  const createBookmark: CreateBookmark = {
    slug: slug,
    userId: user.id,
    url: url,
    createdAt: new Date(),
  };

  if (comment) {
    createBookmark.comment = comment;
  }

  await env.QUEUE.send({ type: "addBookmark", url: url, slug: slug });

  const bookmark = await db
    .insert(bookmarks)
    .values(createBookmark)
    .returning()
    .get();

  return bookmark;
}

export async function updateBookmark(
  context: AppLoadContext,
  slug: string,
  comment: string | null
): Promise<Bookmark> {
  const env = context.env as Env;
  const db = createClient(env.DB);
  const updateBookmark: { comment: string } = {
    comment: `${comment}`,
  };

  const bookmark = await db
    .update(bookmarks)
    .set(updateBookmark)
    .where(eq(bookmarks.slug, slug))
    .returning()
    .get();

  return bookmark;
}

export async function deleteBookmark(
  context: AppLoadContext,
  slug: string
): Promise<void> {
  const env = context.env as Env;
  const db = createClient(env.DB);

  // TODO: returning().get() がないとクエリが実行されない
  await db.delete(bookmarks).where(eq(bookmarks.slug, slug)).returning().get();
}

async function getDigestString(str: string, salt?: string) {
  const buffer = await crypto.subtle.digest(
    {
      name: "SHA-256",
    },
    new TextEncoder().encode(`${salt}${str}`)
  );
  const hashArray = Array.from(new Uint8Array(buffer));
  const hashedText = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashedText;
}
