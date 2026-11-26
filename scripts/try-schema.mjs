import { z } from "zod";
import { messageSchema } from "../src/lib/message-schema.js";

// A bad message: every rule is broken
const bad = messageSchema.safeParse({ name: "A", text: "Hi", topic: "bikes", updates: false, source: "x" });
console.log("bad ok?", bad.success);
console.log(z.flattenError(bad.error).fieldErrors);

// A good one: the data is cleaned (trim)
const good = messageSchema.safeParse({ name: "  Ada ", text: "The trail was great.", topic: "trails", updates: true, source: "contact-page" });
console.log("good ok?", good.success, good.data.name);
