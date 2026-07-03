import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// Uses the NEXT_INC_CACHE_R2_BUCKET binding (see wrangler.jsonc) so ISR/Cache
// Components revalidation survives across Worker invocations.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
