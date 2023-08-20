import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey().notNull(),
  googleProfileId: text("googleProfileId").notNull(),
  iconUrl: text("iconUrl"),
  displayName: text("displayName").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});
