import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const rootDir = process.cwd();
const blogDir = path.join(rootDir, "content", "blog");

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

const today = getToday();
const files = (await fs.readdir(blogDir)).filter((f) => f.endsWith(".md"));

const published = [];

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const raw = await fs.readFile(filePath, "utf8");
  const { data } = matter(raw);

  if (!data.draft) continue;
  if (!data.publishedAt || data.publishedAt > today) continue;

  // Targeted line replace rather than re-serializing frontmatter via
  // gray-matter.stringify, which would reformat/reorder the whole file.
  const updated = raw.replace(/^draft:\s*true\s*$/m, "draft: false");
  if (updated === raw) {
    console.warn(`Skipped ${file}: draft:true not found as an exact line match.`);
    continue;
  }

  await fs.writeFile(filePath, updated, "utf8");
  published.push({ file, title: data.title, publishedAt: data.publishedAt });
}

if (published.length === 0) {
  console.log("No scheduled drafts due for publishing today.");
} else {
  console.log(`Published ${published.length} post(s):`);
  for (const p of published) {
    console.log(`  - ${p.file} ("${p.title}", publishedAt: ${p.publishedAt})`);
  }
}
