import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Serve prerendered HTML straight from the static asset bundle.
// withRegionalCache(long-lived) was removed because it cached stale/blank
// responses across deploys for new or force-static pages that have no .cache
// file — clearing the CF zone cache does not clear Workers Cache Storage.
// staticAssetsIncrementalCache alone does not trigger SSR (no CPU 1102 risk).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
