import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const EXPECTED_PUBLIC_SPKI = "MCowBQYDK2VwAyEAP5NCVP7CT0tgaGLSGMe4r87SjYRWTM6gN6igBZYSXys=";

const ALL_18_SLUGS = [
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
  "bid-docx-checker",
  "paper-clean",
  "exam-trap-cards",
  "silicon-brief",
  "safari-clean-speed"
];

test("opc-tools hub unlocks all 18 web/CLI tools 100% free, separates 7 iOS App Store apps, and exposes 3-way backend monetization", () => {
  const html = fs.readFileSync(path.join(root, "docs/index.html"), "utf8");
  const llms = fs.readFileSync(path.join(root, "docs/llms.txt"), "utf8");
  const smbHtml = fs.readFileSync(path.join(root, "docs/smb-contract-guard/index.html"), "utf8");

  // 1. Zero upfront paywall / OPC1. lock & 100% Free open-access messaging
  assert.ok(html.includes("18 款效率与防封微工具 100% 免费开放"), "index.html must highlight 18 tools 100% free open access");
  assert.ok(llms.includes("100% Free & Fully Unlocked"), "llms.txt must document 100% Free & Fully Unlocked");
  for (const [label, content] of [["hub", html], ["llms", llms], ["smb-contract-guard", smbHtml]]) {
    assert.ok(!content.includes("OPC1."), `${label} must not require OPC1. activation codes`);
    assert.ok(!content.includes("¥39"), `${label} must not contain ¥39 bundle paywall`);
    assert.ok(!content.includes("168"), `${label} must not contain legacy ¥168 price`);
  }

  // 2. Exact 18 free web/CLI tools listed in TOOLS & llms.txt
  const slugMatches = [...html.matchAll(/\{\s*id:\s*"[^"]+",\s*slug:\s*"([^"]+)"/g)].map(m => m[1]);
  assert.equal(slugMatches.length, 18, `Expected 18 tools in TOOLS, got ${slugMatches.length}`);
  assert.deepEqual(slugMatches, ALL_18_SLUGS);

  for (const s of ALL_18_SLUGS) {
    assert.ok(llms.includes(`/${s}/`), `llms.txt missing /${s}/`);
  }

  // 3. CleanShield & iOS native suite strictly separated from web TOOLS
  assert.ok(!slugMatches.includes("clean-shield"), "clean-shield must not be inside web TOOLS array");
  assert.ok(html.includes("苹果 App Store 官方原生软件"), "must include dedicated App Store native section");
  for (const appSlug of ["clean-shield", "purescan", "waitcam", "cupsnap", "flatbill", "miledeck", "flatshift"]) {
    assert.ok(html.includes(`/${appSlug}/`), `iOS section missing ${appSlug}`);
  }

  // 4. Filter chip counts in initial HTML match actual TOOLS category counts (18 = 5 + 3 + 5 + 5)
  assert.ok(html.includes('data-cat="all" type="button">全部 (18)</button>'));
  assert.ok(html.includes('data-cat="dev" type="button">开发者与 AI Agent (5)</button>'));
  assert.ok(html.includes('data-cat="b2b" type="button">跨境电商与 B2B 排雷 (3)</button>'));
  assert.ok(html.includes('data-cat="doc" type="button">办公印章·发票·合同·论文 (5)</button>'));
  assert.ok(html.includes('data-cat="life" type="button">考公证件·口播·声控净化 (5)</button>'));

  // 5. Three backend monetization channels + Studio contact + zero empty links or leaked local paths
  assert.ok(html.includes("离线百宝箱一键转存"), "must include netdisk offline vault channel");
  assert.ok(html.includes("数创引擎工作室"), "must include B2B custom studio channel");
  assert.ok(html.includes("严选开发者基础设施推荐"), "must include affiliate & sponsor channel");

  for (const [label, content] of [["hub", html], ["smb-contract-guard", smbHtml]]) {
    assert.ok(content.includes("3152557994"), `${label} must include contact 3152557994`);
    assert.ok(content.includes("3152557994@qq.com"), `${label} must include QQ email`);
    assert.ok(content.includes("a3152557994@gmail.com"), `${label} must include Gmail`);
    assert.ok(!/href=["'](?:#|)["']/i.test(content), `${label} must have zero empty/# links`);
    assert.ok(!content.includes("/Users/wang"), `${label} must not leak local paths`);
  }

  assert.ok(html.includes(EXPECTED_PUBLIC_SPKI), "hub must retain canonical Ed25519 SPKI constant");
  const pubKey = crypto.createPublicKey({ key: Buffer.from(EXPECTED_PUBLIC_SPKI, "base64"), format: "der", type: "spki" });
  assert.equal(pubKey.asymmetricKeyType, "ed25519");
});
