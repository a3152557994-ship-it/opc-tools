import {
  PRODUCT_SLUG,
  FREE_SUGGESTION_LIMIT,
  LEGAL_DISCLAIMER,
  ORDER_CHANNELS,
  CONTRACT_SCENARIOS,
  SAMPLE_CONTRACTS,
  SUPPLEMENTAL_TEMPLATES,
  scanContractText,
  exportScanReportMarkdown,
  verifyLicenseToken,
} from "./contract-scanner.js";

const STORAGE_LICENSE_KEY = "opc_smb_contract_license_v1";

let isUnlocked = Boolean(globalThis.__OPC_OFFLINE_UNLOCKED__);
let licenseEmail = isUnlocked ? "离线完整版买家" : "";
let currentScenario = "shop_lease";
let lastReport = null;

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function restoreSavedLicense() {
  if (isUnlocked) return;
  try {
    const saved = localStorage.getItem(STORAGE_LICENSE_KEY);
    if (!saved) return;
    const res = await verifyLicenseToken(saved, { expectedProduct: PRODUCT_SLUG });
    if (res.valid) {
      isUnlocked = true;
      licenseEmail = res.payload?.e || "Pro已授权";
    }
  } catch {
    // Ignore
  }
}

function downloadTextFile(filename, content, mime = "text/markdown;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function renderSampleButtons() {
  const wrap = document.getElementById("sampleButtons");
  wrap.innerHTML = CONTRACT_SCENARIOS.map(
    (sc) =>
      `<button type="button" class="sample-btn ${currentScenario === sc.id ? "active" : ""}" data-sc="${sc.id}">${escapeHtml(sc.name)}</button>`
  ).join("");

  wrap.querySelectorAll(".sample-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentScenario = btn.dataset.sc;
      const sample = SAMPLE_CONTRACTS[currentScenario];
      if (sample) {
        document.getElementById("contractInput").value = sample.text;
      }
      runScan();
      renderSampleButtons();
    });
  });
}

function renderUnlockHeader() {
  const btn = document.getElementById("btnOpenUnlock");
  if (isUnlocked) {
    btn.textContent = "✓ 全套话术与4份协议已解锁";
    btn.classList.add("unlocked");
  } else {
    btn.textContent = `解锁全套话术 + 4份补充协议 (${ORDER_CHANNELS.priceText})`;
    btn.classList.remove("unlocked");
  }
}

function runScan() {
  const text = document.getElementById("contractInput").value;
  lastReport = scanContractText(text, { unlocked: isUnlocked, scenario: currentScenario });
  renderHighlightedText(lastReport);
  renderScanResults(lastReport);
  renderTemplatesSection();
}

function renderHighlightedText(report) {
  const box = document.getElementById("highlightedPreview");
  box.innerHTML = report.highlightedSegments
    .map((seg) => {
      if (!seg.flagged) return escapeHtml(seg.text);
      return `<mark class="red-flag-mark" title="${escapeHtml(seg.code)}">[${escapeHtml(seg.code)}] ${escapeHtml(seg.text)}</mark>`;
    })
    .join("");
}

function renderScanResults(report) {
  const container = document.getElementById("findingsContainer");
  const levelClass = report.riskLevel.toLowerCase();

  const bannerHtml = `
    <div class="score-banner ${levelClass}">
      <div>
        <div style="font-weight:800;font-size:15px;">${escapeHtml(report.riskSummary)}</div>
        <div style="font-size:12px;color:#cbd5e1;margin-top:4px;">
          共命中 <strong>${report.totalRedFlags}</strong> 类霸王条款（免费展示前 ${FREE_SUGGESTION_LIMIT} 条完整谈判话术${
            report.lockedCount > 0 ? `，另有 ${report.lockedCount} 条待解锁` : ""
          }）
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div class="score-num">${report.safetyScore}</div>
        <div style="font-size:11px;color:#cbd5e1;">安全健康分</div>
      </div>
    </div>
  `;

  if (report.findings.length === 0) {
    container.innerHTML =
      bannerHtml +
      `<div class="finding-card" style="border-color:rgba(16,185,129,0.4);">当前文本未触发内置 12 类高频霸王条款关键词。签约前仍请核对收款主体实名、金额大写、违约对等性，并优先加签下方《防坑补充协议》。</div>`;
    return;
  }

  const cardsHtml = report.findings
    .map((f) => {
      const quotes = f.matchedExcerpts
        .map((ex) => `<div class="excerpt-quote">🚩 原文标红：“${escapeHtml(ex)}”</div>`)
        .join("");

      if (f.locked) {
        return `
          <div class="finding-card">
            <div class="finding-head">
              <strong>${escapeHtml(f.code)} · ${escapeHtml(f.title)}</strong>
              <span class="sev-pill">${f.severity === "CRITICAL" ? "致命高危" : "高风险"}</span>
            </div>
            ${quotes}
            <div style="font-size:13px;color:#cbd5e1;margin-top:6px;"><strong>💥 踩坑后果：</strong>${escapeHtml(f.riskImpact)}</div>
            <div class="locked-box">
              <div style="font-size:13px;color:#fde68a;font-weight:700;margin-bottom:8px;">
                🔒 已生成针对该霸王条款的「微信谈判话术 + 对等替换合同条文」
              </div>
              <button type="button" class="unlock-btn trigger-unlock-btn" style="font-size:12.5px;padding:7px 15px;">
                输入 OPC1. 激活码 / ${ORDER_CHANNELS.priceText} 秒发解锁全套
              </button>
            </div>
          </div>
        `;
      }

      return `
        <div class="finding-card">
          <div class="finding-head">
            <strong>${escapeHtml(f.code)} · ${escapeHtml(f.title)}</strong>
            <span class="sev-pill">${f.severity === "CRITICAL" ? "致命高危" : "高风险"}</span>
          </div>
          ${quotes}
          <div style="font-size:13px;color:#cbd5e1;margin-top:6px;"><strong>💥 踩坑后果：</strong>${escapeHtml(f.riskImpact)}</div>
          <div class="talk-box">
            <strong>💬 微信直接发给对方的谈判话术：</strong><br/>
            ${escapeHtml(f.negotiationTalk)}
          </div>
          <div class="clause-box">
            <strong>📝 建议要求替换成的对等条文：</strong><br/>
            ${escapeHtml(f.replacementClause)}
          </div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = bannerHtml + cardsHtml;
  container.querySelectorAll(".trigger-unlock-btn").forEach((b) => {
    b.addEventListener("click", openModal);
  });
}

function renderTemplatesSection() {
  const grid = document.getElementById("templatesGrid");
  grid.innerHTML = SUPPLEMENTAL_TEMPLATES.map((tpl) => {
    const preview = isUnlocked
      ? tpl.content
      : tpl.content.split("\n").slice(0, 11).join("\n") + "\n\n🔒 完整可修改/可打印补充协议全文需激活码解锁...";
    return `
      <div class="tpl-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
          <strong style="font-size:14.5px;">${escapeHtml(tpl.title)}</strong>
          <button type="button" class="secondary-btn tpl-dl-btn" data-tpl-id="${tpl.id}" style="padding:5px 10px;font-size:12px;">
            ${isUnlocked ? "📥 下载 .md 模板" : "🔒 解锁下载"}
          </button>
        </div>
        <pre class="tpl-pre">${escapeHtml(preview)}</pre>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".tpl-dl-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!isUnlocked) {
        openModal();
        return;
      }
      const tpl = SUPPLEMENTAL_TEMPLATES.find((t) => t.id === btn.dataset.tplId);
      if (tpl) {
        downloadTextFile(tpl.filename, tpl.content);
      }
    });
  });
}

function openModal() {
  document.getElementById("unlockModal").hidden = false;
  document.getElementById("modalStatus").textContent = isUnlocked
    ? `当前已解锁完整商业谈判包（授权：${licenseEmail}）`
    : "输入 OPC1. 激活码，浏览器本地毫秒级 Ed25519 验签解锁全部逐条修改话术 + 4 套防坑补充协议下载。";
}

function closeModal() {
  document.getElementById("unlockModal").hidden = true;
}

async function init() {
  document.getElementById("topDisclaimer").textContent = LEGAL_DISCLAIMER;
  document.getElementById("bottomDisclaimer").textContent = LEGAL_DISCLAIMER;

  await restoreSavedLicense();
  renderUnlockHeader();
  renderSampleButtons();

  document.getElementById("contractInput").value = SAMPLE_CONTRACTS.shop_lease.text;
  runScan();

  document.getElementById("btnRunScan").addEventListener("click", runScan);
  document.getElementById("contractInput").addEventListener("input", runScan);

  document.getElementById("btnExportReport").addEventListener("click", () => {
    if (!isUnlocked) {
      openModal();
      return;
    }
    if (lastReport) {
      const md = exportScanReportMarkdown(lastReport, { unlocked: true });
      downloadTextFile(`合同霸王条款排雷与谈判清单_${new Date().toISOString().slice(0, 10)}.md`, md);
    }
  });

  document.getElementById("btnOpenUnlock").addEventListener("click", openModal);
  document.getElementById("btnCloseModal").addEventListener("click", closeModal);
  document.getElementById("unlockModal").addEventListener("click", (e) => {
    if (e.target.id === "unlockModal") closeModal();
  });

  document.getElementById("btnVerifyLicense").addEventListener("click", async () => {
    const val = document.getElementById("licenseInput").value.trim();
    const statusEl = document.getElementById("modalStatus");
    const res = await verifyLicenseToken(val, { expectedProduct: PRODUCT_SLUG });
    if (res.valid) {
      isUnlocked = true;
      licenseEmail = res.payload?.e || "Pro用户";
      try {
        localStorage.setItem(STORAGE_LICENSE_KEY, val);
      } catch {}
      statusEl.style.color = "#34d399";
      statusEl.textContent = `✅ Ed25519 本地验签通过！已解锁全部谈判话术与 4 套防坑补充协议（${licenseEmail}）`;
      renderUnlockHeader();
      runScan();
      setTimeout(closeModal, 900);
    } else {
      statusEl.style.color = "#f87171";
      statusEl.textContent = `❌ 验签失败：${res.message || res.reason}`;
    }
  });

  document.getElementById("btnCopyOrder").addEventListener("click", async () => {
    const txt = `你好，购买【小微商家合同12大霸王条款排雷器+4套防坑补充协议包 (${PRODUCT_SLUG})】完整版（${ORDER_CHANNELS.priceText}），接收邮箱：`;
    try {
      await navigator.clipboard.writeText(txt);
      document.getElementById("btnCopyOrder").textContent = "✅ 已复制下单信息";
    } catch {}
  });
}

init();
