import { log } from "@/lib/logger";

// Only for the Node.js server: it may use Node APIs
export function startNode() {
  log.info("server started", { node: process.version, mode: process.env.NODE_ENV });
}
