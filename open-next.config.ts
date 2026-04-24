import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

// Serve prerendered HTML straight from the static asset bundle (the same
// .open-next/assets/ that Cloudflare already uploads), wrapped in a regional
// in-memory cache for repeat hits inside the same data center.
//
// Without this, OpenNext used "dummy" cache and re-rendered every page on
// every request — that 2.5 MB handler render is what was tripping the
// per-request CPU limit and producing Cloudflare Error 1102.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(staticAssetsIncrementalCache, {
    mode: "long-lived",
  }),
});
