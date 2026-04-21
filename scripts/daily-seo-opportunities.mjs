import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const seedPath = path.join(rootDir, "data", "seo", "keyword-seeds.json");
const outputJsonPath = path.join(rootDir, "data", "seo", "daily-opportunities.json");
const outputMdPath = path.join(rootDir, "data", "seo", "latest-report.md");

const modifierWeights = {
  cost: 4,
  permit: 4,
  permits: 4,
  timeline: 4,
  code: 3,
  insurance: 3,
  rebuild: 3,
  contractor: 3,
  builder: 3,
  fire: 2,
  hillside: 2,
  adu: 2,
  zoning: 2,
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function stripCdata(value) {
  return value
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .trim();
}

function decodeXml(value) {
  return stripCdata(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTag(item, tag) {
  const match = item.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function parseRssItems(xml) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];
  return items.map((item) => ({
    title: extractTag(item, "title"),
    link: extractTag(item, "link"),
    pubDate: extractTag(item, "pubDate"),
    source: extractTag(item, "source"),
    description: extractTag(item, "description"),
  }));
}

function scoreOpportunity(seed, item) {
  const haystack = `${seed.keyword} ${item.title} ${item.description}`.toLowerCase();
  let score = 0;

  if (haystack.includes(seed.area.toLowerCase())) score += 6;
  if (haystack.includes(seed.service.toLowerCase())) score += 5;
  if (haystack.includes("los angeles")) score += 3;

  for (const [word, weight] of Object.entries(modifierWeights)) {
    if (haystack.includes(word)) score += weight;
  }

  const published = item.pubDate ? new Date(item.pubDate) : null;
  if (published && Number.isFinite(published.getTime())) {
    const ageDays = Math.max(0, (Date.now() - published.getTime()) / 86400000);
    score += Math.max(0, 6 - Math.floor(ageDays));
  }

  return score;
}

function createSuggestion(seed, item) {
  const title = `${seed.area} ${seed.service} Update: ${item.title}`;
  return {
    suggestedTitle: title,
    suggestedSlug: slugify(title),
    suggestedKeyword: seed.keyword,
    suggestedCategory: seed.category,
    whyItMatters: `Fresh web coverage connected to ${seed.area} and ${seed.service} creates a timely angle for ranking on ${seed.keyword}.`,
  };
}

const seeds = JSON.parse(await fs.readFile(seedPath, "utf8"));
const collected = [];

for (const seed of seeds) {
  const query = `${seed.keyword} ${seed.area} site:ladbs.org OR site:lacity.gov OR site:latimes.com OR site:patch.com`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "econstruct-seo-agent/1.0 (+https://econstructhomes.com)",
      },
    });

    if (!response.ok) {
      collected.push({
        seed,
        opportunities: [],
        error: `RSS request failed with ${response.status}`,
      });
      continue;
    }

    const xml = await response.text();
    const opportunities = parseRssItems(xml)
      .slice(0, 8)
      .map((item) => {
        const score = scoreOpportunity(seed, item);
        return {
          ...item,
          score,
          ...createSuggestion(seed, item),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    collected.push({
      seed,
      opportunities,
      error: null,
    });
  } catch (error) {
    collected.push({
      seed,
      opportunities: [],
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const flattened = collected
  .flatMap((entry) => entry.opportunities.map((opportunity) => ({
    seed: entry.seed,
    ...opportunity,
  })))
  .sort((a, b) => b.score - a.score)
  .slice(0, 12);

const report = {
  generatedAt: new Date().toISOString(),
  topOpportunities: flattened,
  seedResults: collected,
};

const markdown = [
  `# Daily SEO Opportunities`,
  ``,
  `Generated: ${report.generatedAt}`,
  ``,
  ...flattened.map((item, index) => [
    `## ${index + 1}. ${item.suggestedKeyword}`,
    ``,
    `- Score: ${item.score}`,
    `- Area: ${item.seed.area}`,
    `- Service: ${item.seed.service}`,
    `- Suggested title: ${item.suggestedTitle}`,
    `- Suggested slug: ${item.suggestedSlug}`,
    `- Source headline: ${item.title}`,
    `- Source: ${item.source || "Unknown publisher"}`,
    `- Link: ${item.link}`,
    `- Why now: ${item.whyItMatters}`,
    ``,
  ].join("\n")),
].join("\n");

await fs.mkdir(path.dirname(outputJsonPath), { recursive: true });
await fs.writeFile(outputJsonPath, JSON.stringify(report, null, 2), "utf8");
await fs.writeFile(outputMdPath, markdown, "utf8");

console.log(`Wrote ${flattened.length} SEO opportunities.`);
