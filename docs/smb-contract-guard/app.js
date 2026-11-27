import {
  LEGAL_DISCLAIMER,
  ORDER_CHANNELS,
  CONTRACT_SCENARIOS,
  SAMPLE_CONTRACTS,
  SUPPLEMENTAL_TEMPLATES,
  scanContractText,
  exportScanReportMarkdown,
} from "./contract-scanner.js";

let isUnlocked = true;
let currentScenario = "shop_lease";
let lastReport = null;

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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
          共命中 <strong>${report.totalRedFlags}</strong> 类霸王条款（已 100% 免费解锁全部微信谈判话术与替换条文）
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
}

function renderTemplatesSection() {
  const grid = document.getElementById("templatesGrid");
  grid.innerHTML = SUPPLEMENTAL_TEMPLATES.map((tpl) => {
    return `
      <div class="tpl-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
          <strong style="font-size:14.5px;">${escapeHtml(tpl.title)}</strong>
          <button type="button" class="secondary-btn tpl-dl-btn" data-tpl-id="${tpl.id}" style="padding:5px 10px;font-size:12px;">
            📥 免费下载 .md 模板
          </button>
        </div>
        <pre class="tpl-pre">${escapeHtml(tpl.content)}</pre>
      </div>
    `;
  }).join("");

  grid.querySelectorAll(".tpl-dl-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tpl = SUPPLEMENTAL_TEMPLATES.find((t) => t.id === btn.dataset.tplId);
      if (tpl) {
        downloadTextFile(tpl.filename, tpl.content);
      }
    });
  });
}

async function copyTextWithFeedback(text, btn, okLabel) {
  const prev = btn.textContent;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = okLabel;
    setTimeout(() => {
      btn.textContent = prev;
    }, 1800);
  } catch {
    btn.textContent = text;
  }
}

function init() {
  document.getElementById("topDisclaimer").textContent = LEGAL_DISCLAIMER;
  document.getElementById("bottomDisclaimer").textContent = LEGAL_DISCLAIMER;

  renderSampleButtons();

  document.getElementById("contractInput").value = SAMPLE_CONTRACTS.shop_lease.text;
  runScan();

  document.getElementById("btnRunScan").addEventListener("click", runScan);
  document.getElementById("contractInput").addEventListener("input", runScan);

  document.getElementById("btnExportReport").addEventListener("click", () => {
    if (lastReport) {
      const md = exportScanReportMarkdown(lastReport, { unlocked: true });
      downloadTextFile(`合同霸王条款排雷与谈判清单_${new Date().toISOString().slice(0, 10)}.md`, md);
    }
  });

  const mailBtn = document.getElementById("btnCopyStudioMail");
  if (mailBtn) {
    mailBtn.addEventListener("click", (e) => {
      copyTextWithFeedback(ORDER_CHANNELS.emailPrimary, e.currentTarget, "✅ 已复制 3152557994@qq.com");
    });
  }
  const qqBtn = document.getElementById("btnCopyStudioQq");
  if (qqBtn) {
    qqBtn.addEventListener("click", (e) => {
      copyTextWithFeedback("3152557994", e.currentTarget, "✅ 已复制微信/QQ 3152557994");
    });
  }
}

init();
