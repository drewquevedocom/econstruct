import { readdirSync, readFileSync, statSync } from "fs";
import { join, extname } from "path";

function walk(dir, list = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "node_modules") {
      walk(full, list);
    } else if (extname(entry.name) === ".tsx") {
      list.push(full);
    }
  }
  return list;
}

const files = walk("src");
const issues = [];

for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isDarkBg =
      /bg-brand-dark|bg-\[#1[Cc]1[Cc]1[Ee]\]|bg-\[rgba\(/.test(line) &&
      !line.includes("hover:bg-brand-dark");

    if (!isDarkBg) continue;

    for (let j = i + 1; j < Math.min(i + 35, lines.length); j++) {
      const look = lines[j];
      if (/bg-(white|gray-50|gray-100|secondary|\[#F8F6F2\]|\[#FAFAF8\])/.test(look)) break;

      const m = look.match(/<h([1-6])\s+className="([^"]*)"/);
      if (m) {
        const classes = m[2];
        const hasColor = /text-white|text-accent-gold|text-\[#fff/.test(classes);
        if (!hasColor) {
          issues.push({
            file: file.replaceAll("\\", "/"),
            line: j + 1,
            darkBgLine: i + 1,
            tag: "h" + m[1],
            classes: classes.slice(0, 90),
          });
        }
      }
    }
  }
}

if (!issues.length) {
  console.log("No issues found.");
} else {
  console.log("Found " + issues.length + " suspicious heading(s):\n");
  for (const issue of issues) {
    console.log(
      "  " + issue.file + ":" + issue.line + "  <" + issue.tag + "> '" + issue.classes + "'"
    );
  }
}
