import { promises as fs } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const reportPath = path.join(rootDir, "data", "seo", "daily-opportunities.json");
const blogDir = path.join(rootDir, "content", "blog");

const DEFAULT_IMAGES = {
  "Fire Rebuilds": {
    heroImage: "/blog/blog_01_palisades_rebuild_guide.png",
    ogImage: "/blog/blog_01_palisades_rebuild_guide_og.png",
    heroImageAlt: "Los Angeles fire rebuild planning and construction guidance",
  },
  "Luxury Modernization": {
    heroImage: "/blog/blog_03_brentwood_luxury.png",
    ogImage: "/blog/blog_03_brentwood_luxury_og.png",
    heroImageAlt: "Luxury home modernization planning in Los Angeles",
  },
  "Custom Homes": {
    heroImage: "/hero-background.png",
    ogImage: "/global-cta-premium.png",
    heroImageAlt: "Custom home planning and construction in Los Angeles",
  },
  "Industry Insights": {
    heroImage: "/global-cta-premium.png",
    ogImage: "/global-cta-premium.png",
    heroImageAlt: "Los Angeles construction market and permit intelligence",
  },
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function yamlEscape(value) {
  return String(value).replace(/"/g, '\\"');
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function extractExistingCoverage(files) {
  return new Set(
    files.flatMap((file) => {
      const matches = file.match(/^(slug|targetKeyword):\s+"?(.+?)"?$/gm) || [];
      return matches.map((line) => line.replace(/^(slug|targetKeyword):\s+"?/, "").replace(/"?$/, ""));
    })
  );
}

function buildPrompt(opportunity) {
  return `
You are writing a premium, high-intent SEO blog post for econstruct Inc., a Los Angeles luxury home builder and general contractor.

Output valid JSON only with this exact shape:
{
  "title": string,
  "slug": string,
  "description": string,
  "category": string,
  "tags": string[],
  "excerpt": string,
  "targetKeyword": string,
  "takeaways": string[],
  "faq": [{"question": string, "answer": string}],
  "localAreas": string[],
  "relatedSlugs": string[],
  "bodyMarkdown": string
}

Requirements:
- Primary keyword: ${opportunity.suggestedKeyword}
- Area focus: ${opportunity.seed.area}
- Service focus: ${opportunity.seed.service}
- Category: ${opportunity.suggestedCategory}
- Source headline: ${opportunity.title}
- Source URL: ${opportunity.link}
- Source publisher: ${opportunity.source || "Unknown publisher"}
- Write for homeowners and high-intent leads in Los Angeles.
- Tone: premium, practical, authoritative, precise.
- Do not overhype or stuff keywords.
- Use markdown with H2/H3 sections.
- Include one natural internal link suggestion to /services/fire-rebuild-contractor-los-angeles, /services/luxury-home-builder-los-angeles, /services/custom-home-construction-los-angeles, or /services/home-additions-los-angeles where relevant.
- Include 4 FAQs.
- Make the post timely based on the source angle.
- Keep body length around 1200-1800 words.
`;
}

async function generateWithOpenAI(opportunity) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.OPENAI_MODEL || "gpt-5-mini";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: buildPrompt(opportunity),
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`);
  }

  const data = await response.json();
  const text = data.output_text;
  if (!text) {
    throw new Error("OpenAI response did not include output_text");
  }
  return JSON.parse(text);
}

const report = JSON.parse(await fs.readFile(reportPath, "utf8"));
const existingFiles = await Promise.all(
  (await fs.readdir(blogDir))
    .filter((file) => file.endsWith(".md"))
    .map((file) => fs.readFile(path.join(blogDir, file), "utf8"))
);

const existingCoverage = extractExistingCoverage(existingFiles);
const opportunity = report.topOpportunities.find((item) => {
  return !existingCoverage.has(item.suggestedSlug) && !existingCoverage.has(item.suggestedKeyword);
});

if (!opportunity) {
  console.log("No new keyword opportunity to publish today.");
  process.exit(0);
}

const draft = await generateWithOpenAI(opportunity);
if (!draft) {
  console.log("OPENAI_API_KEY not set. Skipping blog generation.");
  process.exit(0);
}

const images = DEFAULT_IMAGES[draft.category] || DEFAULT_IMAGES["Industry Insights"];
const today = getToday();
const safeSlug = slugify(draft.slug || draft.title);
const outputPath = path.join(blogDir, `${safeSlug}.md`);

const relatedSlugs = Array.isArray(draft.relatedSlugs) ? draft.relatedSlugs.filter(Boolean) : [];

const markdown = `---
title: "${yamlEscape(draft.title)}"
slug: "${yamlEscape(safeSlug)}"
description: "${yamlEscape(draft.description)}"
category: "${yamlEscape(draft.category)}"
tags:
${draft.tags.map((tag) => `  - "${yamlEscape(tag)}"`).join("\n")}
publishedAt: "${today}"
updatedAt: "${today}"
authorSlug: "frank-neimroozi"
reviewedBy: "Reviewed by econstruct editorial team"
factCheckedBy: "Fact-checked by econstruct project development team"
heroImage: "${images.heroImage}"
heroImageAlt: "${yamlEscape(images.heroImageAlt)}"
ogImage: "${images.ogImage}"
excerpt: "${yamlEscape(draft.excerpt)}"
targetKeyword: "${yamlEscape(draft.targetKeyword)}"
takeaways:
${draft.takeaways.map((item) => `  - "${yamlEscape(item)}"`).join("\n")}
sources:
  - title: "${yamlEscape(opportunity.title)}"
    url: "${yamlEscape(opportunity.link)}"
    publisher: "${yamlEscape(opportunity.source || "Google News")}"
faq:
${draft.faq
  .map(
    (item) => `  - question: "${yamlEscape(item.question)}"
    answer: "${yamlEscape(item.answer)}"`
  )
  .join("\n")}
relatedSlugs:${relatedSlugs.length ? `\n${relatedSlugs.map((slug) => `  - "${yamlEscape(slug)}"`).join("\n")}` : " []"}
localAreas:
${draft.localAreas.map((area) => `  - "${yamlEscape(area)}"`).join("\n")}
---
${draft.bodyMarkdown.trim()}
`;

await fs.writeFile(outputPath, markdown, "utf8");
console.log(`Generated blog post: ${path.basename(outputPath)}`);
