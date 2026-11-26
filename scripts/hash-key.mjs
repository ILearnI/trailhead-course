import { hashKey } from "../src/lib/api-keys.js";

// The hash of the key that we give to a client
console.log(hashKey(process.argv[2]));
