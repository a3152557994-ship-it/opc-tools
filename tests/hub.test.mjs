import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

test("opc-tools hub contains all 16 self-serve tools and SEO/GEO files", () => {
  const html = fs.readFileSync(path.join(root, "docs/index.html"), "utf8");
  const llms = fs.readFileSync(path.join(root, "docs/llms.txt"), "utf8");
  const slugs = [
    "agent-guard", "geo-doctor", "idphoto-kb", "store-radar-mcp",
    "edge-table-cleaner", "safari-clean-speed", "seal-pdf", "invoice-a4",
    "paper-clean", "island-prompter", "exam-trap-cards", "opc-tools/smb-contract-guard",
    "agent-shipkit", "shopify-faq-geo", "silicon-brief", "bid-docx-checker"
  ];
  for (const s of slugs) {
    assert.ok(html.includes(`slug: "${s}"`), `index.html missing ${s}`);
    assert.ok(llms.includes(`/${s}/`), `llms.txt missing ${s}`);
  }
  assert.ok(!html.includes("/Users/wang"), "must not leak local paths");
});
