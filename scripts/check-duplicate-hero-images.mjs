import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const rootDir = process.cwd();
const blogDir = path.join(rootDir, "content", "blog");

const files = (await fs.readdir(blogDir)).filter((f) => f.endsWith(".md"));
const byHero = new Map();

for (const file of files) {
  const raw = await fs.readFile(path.join(blogDir, file), "utf8");
  const { data } = matter(raw);
  if (!data.heroImage) continue;
  const list = byHero.get(data.heroImage) ?? [];
  list.push({ file, title: data.title, publishedAt: data.publishedAt });
  byHero.set(data.heroImage, list);
}

const duplicates = [...byHero.entries()].filter(([, posts]) => posts.length > 1);

if (duplicates.length === 0) {
  console.log("No duplicate heroImage usage found across", files.length, "posts.");
  process.exit(0);
}

console.log(`Found ${duplicates.length} heroImage(s) reused across multiple posts:\n`);
for (const [image, posts] of duplicates) {
  console.log(`  ${image}`);
  for (const p of posts) {
    console.log(`    - ${p.file} ("${p.title}", ${p.publishedAt})`);
  }
  console.log("");
}
process.exitCode = 1;
