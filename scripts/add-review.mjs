import { eq } from "drizzle-orm";
import { db } from "./db.mjs";
import { reviews, trails } from "../src/db/schema.js";

// The trail, the rating and the text
const [slug, rating, text] = process.argv.slice(2);
const trail = db.select().from(trails).where(eq(trails.slug, slug)).get();
db.insert(reviews).values({ trailId: trail.id, rating: Number(rating), text }).run();
console.log(`review added to ${trail.name}`);
