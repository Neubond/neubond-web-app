import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache override: this app has no ISR/revalidated routes (static
// pages are served from assets; all dynamic routes are on-demand and no-store),
// so a persistent cache adds no value. Omitting it also skips the deploy-time
// "populate remote R2 cache" step, which proxies writes through a local workerd
// process that times out in some network environments. The IFU document store
// (IFU_BUCKET) is a separate R2 binding and is unaffected.
export default defineCloudflareConfig();
