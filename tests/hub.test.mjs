import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const EXPECTED_PUBLIC_SPKI = "MCowBQYDK2VwAyEAP5NCVP7CT0tgaGLSGMe4r87SjYRWTM6gN6igBZYSXys=";

const RETAINED_14_SLUGS = [
  "claude-guard",
  "call-guard",
  "agent-guard",
  "geo-doctor",
  "idphoto-kb",
  "store-radar-mcp",
  "edge-table-cleaner",
  "seal-pdf",
  "invoice-a4",
  "island-prompter",
  "opc-tools/smb-contract-guard",
  "agent-shipkit",
  "shopify-faq-geo",
  "bid-docx-checker"
];

const REMOVED_SLUGS = [
  "safari-clean-speed",
  "silicon-brief",
  "exam-trap-cards",
  "paper-clean"
];

test("opc-tools hub focuses on exact 14 web/CLI tools, separates 7 iOS App Store apps, and unifies ¥39 / $14.99 pricing", () => {
  const html = fs.readFileSync(path.join(root, "docs/index.html"), "utf8");
  const llms = fs.readFileSync(path.join(root, "docs/llms.txt"), "utf8");
  const smbHtml = fs.readFileSync(path.join(root, "docs/smb-contract-guard/index.html"), "utf8");

  // 1. Unified All-Access pricing (¥39 / $14.99) & zero legacy ¥168 / $49
  assert.ok(html.includes("¥39 / $14.99"), "index.html must show ¥39 / $14.99 All-Access price");
  assert.ok(llms.includes("¥39 / $14.99"), "llms.txt must show ¥39 / $14.99 All-Access price");
  assert.ok(smbHtml.includes("¥39 / $14.99"), "smb-contract-guard must show ¥39 / $14.99 All-Access option");
  for (const content of [html, llms, smbHtml]) {
    assert.ok(!content.includes("168"), "must not contain legacy ¥168 price");
    assert.ok(!content.includes("$49"), "must not contain legacy $49 price");
  }

  // 2. BidGuard unified price
  assert.ok(html.includes("¥19.9 单次 / ¥59 买断"), "bid-docx-checker card must display ¥19.9 单次 / ¥59 买断");

  // 3. Exact 14 retained web/CLI tools & 4 removed entries
  const slugMatches = [...html.matchAll(/\{\s*id:\s*"[^"]+",\s*slug:\s*"([^"]+)"/g)].map(m => m[1]);
  assert.equal(slugMatches.length, 14, `Expected exactly 14 tools in TOOLS, got ${slugMatches.length}`);
  assert.deepEqual(slugMatches, RETAINED_14_SLUGS);

  for (const s of RETAINED_14_SLUGS) {
    assert.ok(llms.includes(`/${s}/`), `llms.txt missing /${s}/`);
  }
  for (const dropped of REMOVED_SLUGS) {
    assert.ok(!html.includes(dropped), `index.html must not contain removed tool ${dropped}`);
    assert.ok(!llms.includes(dropped), `llms.txt must not contain removed tool ${dropped}`);
  }

  // 4. CleanShield & iOS native suite strictly separated from web OPC1. TOOLS
  assert.ok(!slugMatches.includes("clean-shield"), "clean-shield must not be inside web TOOLS array");
  assert.ok(html.includes("苹果 App Store 官方原生软件"), "must include dedicated App Store native section");
  assert.ok(html.includes("独立于网页 OPC1. 激活码体系"), "must clarify App Store apps are separate from OPC1. keys");
  for (const appSlug of ["clean-shield", "purescan", "waitcam", "cupsnap", "flatbill", "miledeck", "flatshift"]) {
    assert.ok(html.includes(`/${appSlug}/`), `iOS section missing ${appSlug}`);
  }

  // 5. Filter chip counts in initial HTML match actual TOOLS category counts (14 = 4 + 3 + 4 + 3)
  assert.ok(html.includes('data-cat="all" type="button">全部 (14)</button>'));
  assert.ok(html.includes('data-cat="dev" type="button">开发者与 AI Agent (4)</button>'));
  assert.ok(html.includes('data-cat="b2b" type="button">跨境电商与 B2B 排雷 (3)</button>'));
  assert.ok(html.includes('data-cat="doc" type="button">办公印章·发票·合同·表格 (4)</button>'));
  assert.ok(html.includes('data-cat="life" type="button">考公证件·口播·声控免提 (3)</button>'));

  // 6. Unified checkout modal, public key, zero empty links or leaked local paths
  for (const [label, content] of [["hub", html], ["smb-contract-guard", smbHtml]]) {
    assert.ok(content.includes("3152557994"), `${label} must include support QQ 3152557994`);
    assert.ok(content.includes("3152557994@qq.com"), `${label} must include QQ email`);
    assert.ok(content.includes("a3152557994@gmail.com"), `${label} must include Gmail`);
    assert.ok(!/href=["'](?:#|)["']/i.test(content), `${label} must have zero empty/# links`);
    assert.ok(!content.includes("/Users/wang"), `${label} must not leak local paths`);
  }

  assert.ok(html.includes(EXPECTED_PUBLIC_SPKI), "hub must embed canonical Ed25519 SPKI public key");
  const pubKey = crypto.createPublicKey({ key: Buffer.from(EXPECTED_PUBLIC_SPKI, "base64"), format: "der", type: "spki" });
  assert.equal(pubKey.asymmetricKeyType, "ed25519");
});
