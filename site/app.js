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

function buildBrief() {
  const topic = $("topic").value.trim();
  if (topic.length < 8) {
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

function shellQuote(value) {
  return "'" + String(value).replace(/'/g, "'\\''") + "'";
}

function buildCommand(brief) {
  const args = [
    "npm run produce -- --topic", shellQuote(brief.topic),
    "--language", brief.language,
    "--duration", String(brief.durationSeconds),
    "--style", brief.style,
    "--aspect-ratio", brief.aspectRatio,
    "--voice", brief.voice
  ];

  if (brief.opus55Reference) {
    args.push("--opus55-reference", brief.opus55Reference);
  }
  if (brief.allowPaidAi) {
    args.push("--allow-paid-ai");
  }
  return args.join(" ");
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

$("brief-form").addEventListener("submit", event => {
  event.preventDefault();
  lastBrief = buildBrief();
  if (!lastBrief) return;

  $("metric-duration").textContent = lastBrief.durationSeconds + " ثانیه";
  updatePaidAiState();
  $("download").disabled = false;
  $("copy").disabled = false;
  setStatus(
    lastBrief.allowPaidAi
      ? "تنظیمات آماده است. استفاده از AI پولی با انتخاب صریح شما فعال شده است."
      : "تنظیمات آماده است. AI پولی خاموش است و کلیدی در فایل brief قرار ندارد.",
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
  const text = buildCommand(lastBrief);
  try {
    await navigator.clipboard.writeText(text);
    setStatus(
      lastBrief.allowPaidAi
        ? "دستور کپی شد و شامل اجازه استفاده از AI پولی است."
        : "دستور کپی شد؛ برای جلوگیری از هزینه ناخواسته، پرچم AI پولی اضافه نشده است.",
      true
    );
  } catch {
    setStatus(text);
  }
});

$("reset").addEventListener("click", () => {
  $("brief-form").reset();
  lastBrief = null;
  $("download").disabled = true;
  $("copy").disabled = true;
  $("metric-duration").textContent = "۹۰ ثانیه";
  updatePaidAiState();
  setStatus("فرم پاک شد.");
});

$("duration").addEventListener("change", () => {
  $("metric-duration").textContent = $("duration").value + " ثانیه";
});
$("allow-paid-ai").addEventListener("change", updatePaidAiState);
updatePaidAiState();
