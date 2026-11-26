import { relations, sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

// A timestamp column: seconds, filled by SQLite
const createdAt = integer("created_at", { mode: "timestamp" })
  .notNull()
  .default(sql`(unixepoch())`);

export const trails = sqliteTable("trails", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  photo: text("photo"),
  region: text("region", { enum: ["alps", "coast", "forest"] }).notNull(),
  level: text("level", { enum: ["Easy", "Moderate", "Hard"] }).notNull(),
  km: real("km").notNull(),
  createdAt,
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  role: text("role", { enum: ["user", "editor", "admin"] }).notNull().default("user"),
  createdAt,
});

export const reviews = sqliteTable(
  "reviews",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    trailId: integer("trail_id")
      .notNull()
      .references(() => trails.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    rating: integer("rating").notNull(),
    text: text("text").notNull(),
    createdAt,
  },
  (table) => [index("reviews_trail_idx").on(table.trailId)],
);

// How the tables are linked, for the queries
export const trailsRelations = relations(trails, ({ many }) => ({
  reviews: many(reviews),
}));

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  trail: one(trails, { fields: [reviews.trailId], references: [trails.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

// The row types, inferred from the tables
/** @typedef {typeof trails.$inferSelect} Trail */
/**
 * @typedef {typeof trails.$inferInsert} NewTrail
 */
/** @typedef {typeof reviews.$inferSelect} Review */
