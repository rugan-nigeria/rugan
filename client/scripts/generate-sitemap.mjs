import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { ARTICLES } from "../src/pages/blog/articleData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "../public/sitemap.xml");
const baseUrl = "https://rugan.org";

const staticPages = [
  "/",
  "/about",
  "/team",
  "/programmes",
  "/impact",
  "/volunteers",
  "/partnership",
  "/blog",
  "/donate",
  "/donation/success",
  "/privacy",
  "/terms",
  "/login",
];

const programSlugs = [
  "rugan-idgc-school-tours",
  "rugan-healthy-period-project",
  "the-rise-project",
  "excellence-award-project",
  "rural-to-global-programme",
];

function formatDate(dateString) {
  const parsed = Date.parse(dateString);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return new Date(parsed).toISOString().split("T")[0];
}

function buildUrl(pathname, lastmod) {
  return `  <url>\n    <loc>${baseUrl}${pathname}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`;
}

async function main() {
  const pageUrls = staticPages.map((pathname) =>
    buildUrl(pathname, new Date().toISOString().split("T")[0]),
  );

  const programUrls = programSlugs.map((slug) =>
    buildUrl(`/programmes/${slug}`, new Date().toISOString().split("T")[0]),
  );

  const articleUrls = ARTICLES.map((article) => {
    const lastmod =
      formatDate(article.date) || new Date().toISOString().split("T")[0];
    return buildUrl(`/blog/${article.slug}`, lastmod);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...pageUrls, ...programUrls, ...articleUrls].join("\n")}\n</urlset>`;

  await writeFile(outputPath, xml, "utf8");
  console.log(`Sitemap generated at ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
