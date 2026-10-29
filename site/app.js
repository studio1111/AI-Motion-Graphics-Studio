import { buildLocalCliCommand, buildWorkflowDispatchCommand } from "./brief-commands.mjs";

const $ = id => document.getElementById(id);
let lastBrief = null;

const labels = {
  fa: "فارسی", en: "English", de: "آلمانی", es: "اسپانیایی",
  fr: "فرانسوی", it: "ایتالیایی", pt: "پرتغالی", nl: "هلندی"
};
const styleNames = {
  auto: "هوشمند",
  "cinematic-documentary": "مستند سینمایی",
  "scientific-2-5d": "علمی و فناوری 2.5D",
  "data-journalism": "روزنامه‌نگاری داده‌محور",
  "editorial-kinetic-type": "تایپوگرافی متحرک",
  "premium-3d-product": "معرفی محصول لوکس",
  "tactile-collage": "کلاژ هنری",
  "swiss-modernist": "مینیمال مدرن",
  "procedural-generative": "گرافیک مولد",
  "vertical-social": "عمودی شبکه‌های اجتماعی"
};
const voiceNames = {
  "edge-tts": "عصبی آنلاین",
  auto: "موتور محلی",
  off: "خاموش"
};

function buildBrief() {
  const topic = $("topic").value.trim();
  if (topic.length < 8 || topic.length > 1200) {
    $("topic").reportValidity();
    return null;
  }

  const result = {
    topic,
    language: $("language").value,
    durationSeconds: Number($("duration").value),
    style: $("style").value,
    aspectRatio: $("ratio").value,
    voice: $("voice").value,
    allowPaidAi: $("allow-paid-ai").checked
  };
  const reference = $("reference").value.trim();
  if (reference) result.opus55Reference = reference;
  return result;
}

function setStatus(message, success = false) {
  $("status").className = success ? "status ok" : "status";
  $("status").textContent = message;
}

function updatePaidAiState() {
  const enabled = $("allow-paid-ai").checked;
  $("metric-paid-ai").textContent = enabled ? "فعال با انتخاب شما" : "خیر";
  $("metric-paid-ai").classList.toggle("safe", !enabled);
  document.querySelector(".consent-state").textContent = enabled
    ? "فعال شد؛ اجرای AI ممکن است هزینه داشته باشد"
    : "غیرفعال تا زمان انتخاب شما";
}

function updateBriefSummary(brief) {
  $("summary-language").textContent = labels[brief.language] || brief.language;
  $("summary-style").textContent = styleNames[brief.style] || brief.style;
  $("summary-ratio").textContent = brief.aspectRatio;
  $("summary-voice").textContent = voiceNames[brief.voice] || brief.voice;
}

function markBriefStale() {
  if (!lastBrief) {
    updatePaidAiState();
    return;
  }
  lastBrief = null;
  $("download").disabled = true;
  $("copy").disabled = true;
  $("copy-workflow").disabled = true;
  updatePaidAiState();
  setStatus("تنظیمات تغییر کرده‌اند. برای تولید دستور جدید، دوباره «آماده‌سازی تنظیمات» را بزن.");
}

async function copyCommand(command, successMessage) {
  try {
    await navigator.clipboard.writeText(command);
    setStatus(successMessage, true);
  } catch {
    setStatus("کپی خودکار در این مرورگر در دسترس نیست. دستور را از کادر زیر انتخاب و کپی کن:\n" + command);
  }
}

$("brief-form").addEventListener("submit", event => {
  event.preventDefault();
  lastBrief = buildBrief();
  if (!lastBrief) return;

  $("metric-duration").textContent = lastBrief.durationSeconds + " ثانیه";
  updatePaidAiState();
  updateBriefSummary(lastBrief);
  $("download").disabled = false;
  $("copy").disabled = false;
  $("copy-workflow").disabled = false;
  setStatus(
    lastBrief.allowPaidAi
      ? "تنظیمات آماده است. استفاده از AI پولی با انتخاب صریح شما فعال شده است."
      : "تنظیمات آماده است. AI پولی خاموش است و هیچ کلیدی در فایل brief یا دستور قرار نمی‌گیرد.",
    true
  );
});

$("download").addEventListener("click", () => {
  if (!lastBrief) return;
  const blob = new Blob([JSON.stringify(lastBrief, null, 2) + "\n"], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "motion-studio-brief.json";
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$("copy").addEventListener("click", async () => {
  if (!lastBrief) return;
  const command = buildLocalCliCommand(lastBrief);
  await copyCommand(
    command,
    lastBrief.allowPaidAi
      ? "دستور CLI کپی شد و شامل اجازه استفاده از AI پولی است."
      : "دستور CLI کپی شد؛ برای جلوگیری از هزینه ناخواسته، پرچم AI پولی اضافه نشده است."
  );
});

$("copy-workflow").addEventListener("click", async () => {
  if (!lastBrief) return;
  const command = buildWorkflowDispatchCommand(lastBrief);
  await copyCommand(
    command,
    lastBrief.allowPaidAi
      ? "دستور GitHub Actions کپی شد. با اجرای آن، گزینه use_ai=true صریحاً ارسال می‌شود."
      : "دستور GitHub Actions کپی شد. همه گزینه‌ها ارسال می‌شوند و use_ai=false باقی می‌ماند."
  );
});

$("reset").addEventListener("click", () => {
  $("brief-form").reset();
  lastBrief = null;
  $("download").disabled = true;
  $("copy").disabled = true;
  $("copy-workflow").disabled = true;
  $("metric-duration").textContent = "۹۰ ثانیه";
  $("summary-language").textContent = "فارسی";
  $("summary-style").textContent = "هوشمند";
  $("summary-ratio").textContent = "16:9";
  $("summary-voice").textContent = "عصبی آنلاین";
  updatePaidAiState();
  setStatus("فرم پاک شد.");
});

$("brief-form").addEventListener("input", event => {
  markBriefStale();
  if (event.target.id === "duration") {
    $("metric-duration").textContent = event.target.value + " ثانیه";
  }
});

updatePaidAiState();
