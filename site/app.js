import { buildLocalCliCommand, buildWorkflowDispatchCommand } from "./brief-commands.mjs";

const $ = id => document.getElementById(id);
let lastBrief = null;
let promptRecipes = [];

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
  "edge-tts": "گویندگی آنلاین",
  auto: "موتور محلی",
  off: "خاموش"
};
const musicNames = {
  procedural: "مولد محلی",
  auto: "خودکار",
  "ace-step": "ACE-Step 1.5"
};
const recipeNames = {
  "cinematic-science-cutaway": "برش علمی سینمایی",
  "scientific-mechanism-cutaway": "نمایش سازوکار علمی",
  "kinetic-type": "تایپوگرافی جنبشی",
  "data-story": "روایت داده‌محور",
  "editorial-explainer": "مستند تحریریه‌ای",
  "cinematic-comparison": "مقایسهٔ سینمایی",
  "motion-design-showreel": "شو‌ریل حرفه‌ای موشن‌دیزاین",
  "real-footage-data-overlay": "تصاویر واقعی همراه داده",
  "product-launch": "معرفی سینمایی محصول",
  "cinematic-map-journey": "سفر سینمایی روی نقشه",
  "voiceover-first-explainer": "روایت‌محور و گویندگی‌محور",
  "cinematic-transition-library": "گذارهای سینمایی"
};

const categoryNames = {
  typography: "تایپوگرافی",
  "product-film": "فیلم محصول",
  "product-ui": "رابط و محصول دیجیتال",
  documentary: "مستند",
  transitions: "گذارها",
  science: "علم و فناوری",
  data: "داده",
  editorial: "تحریریه‌ای",
  abstract: "انتزاعی",
  branding: "هویت بصری",
  "image-to-video": "تصویر به ویدیو",
  storytelling: "داستان‌گویی",
  sound: "طراحی صدا",
  "social-video": "شبکه‌های اجتماعی"
};

function renderPromptRecipes(query = "") {
  const select = $("prompt-recipe");
  const selectedId = select.value || "cinematic-science-cutaway";
  const normalizedQuery = String(query).trim().toLocaleLowerCase();
  const matches = promptRecipes.filter(recipe =>
    [recipe.id, recipe.title, recipe.category, categoryNames[recipe.category] || ""]
      .some(value => String(value).toLocaleLowerCase().includes(normalizedQuery))
  );
  const selectedRecipe = promptRecipes.find(recipe => recipe.id === selectedId);
  const visible = selectedRecipe && !matches.some(recipe => recipe.id === selectedId)
    ? [selectedRecipe, ...matches]
    : matches;
  const fragment = document.createDocumentFragment();
  if (selectedRecipe && !matches.some(recipe => recipe.id === selectedId)) {
    fragment.append(new Option("انتخاب فعلی · " + selectedRecipe.title, selectedRecipe.id));
  }
  for (const recipe of visible) {
    if (recipe.id === selectedId && selectedRecipe && !matches.some(item => item.id === selectedId)) continue;
    const category = categoryNames[recipe.category] || recipe.category;
    fragment.append(new Option(recipe.title + (category ? " · " + category : ""), recipe.id));
  }
  if (!visible.length) {
    fragment.append(new Option("قالبی با این جست‌وجو پیدا نشد", selectedId, true, true));
  }
  select.replaceChildren(fragment);
  if (visible.some(recipe => recipe.id === selectedId)) select.value = selectedId;
  else if (visible.length) select.value = visible[0].id;
  $("prompt-recipe-count").textContent = normalizedQuery
    ? matches.length + " قالب پیدا شد از " + promptRecipes.length + " قالب"
    : promptRecipes.length + " قالب آمادهٔ انتخاب است";
}

async function loadPromptRecipes() {
  const select = $("prompt-recipe");
  const fallback = Array.from(select.options).map(option => ({
    id: option.value,
    title: option.textContent,
    category: ""
  }));
  try {
    const response = await fetch("./prompt-recipes.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const catalog = await response.json();
    if (!Array.isArray(catalog.recipes) || !catalog.recipes.length) {
      throw new Error("Invalid prompt catalog");
    }
    const ids = new Set();
    for (const recipe of catalog.recipes) {
      if (!recipe || !/^[a-z0-9][a-z0-9-]{1,119}$/.test(recipe.id) ||
          typeof recipe.title !== "string" || !recipe.title.trim() || ids.has(recipe.id)) {
        throw new Error("Invalid prompt recipe entry");
      }
      ids.add(recipe.id);
    }
    promptRecipes = catalog.recipes;
    if (!ids.has(select.value)) select.value = ids.has("cinematic-science-cutaway")
      ? "cinematic-science-cutaway"
      : catalog.recipes[0].id;
    renderPromptRecipes($("prompt-recipe-search").value);
  } catch {
    promptRecipes = fallback;
    $("prompt-recipe-count").textContent =
      "کتابخانهٔ کامل بارگذاری نشد؛ فهرست پایه در دسترس است.";
  }
}

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
    musicEngine: $("music-engine").value,
    promptRecipe: $("prompt-recipe").value,
    planOnly: $("plan-only").checked,
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
  document.querySelector(".paid-consent:not(.plan-consent) .consent-state").textContent = enabled
    ? "فعال شد؛ اجرای AI ممکن است هزینه داشته باشد"
    : "غیرفعال تا زمان انتخاب شما";
}

function updateBriefSummary(brief) {
  $("summary-language").textContent = labels[brief.language] || brief.language;
  $("summary-style").textContent = styleNames[brief.style] || brief.style;
  $("summary-ratio").textContent = brief.aspectRatio;
  $("summary-voice").textContent = voiceNames[brief.voice] || brief.voice;
  $("summary-music").textContent = musicNames[brief.musicEngine] || brief.musicEngine;
  const selectedRecipe = promptRecipes.find(recipe => recipe.id === brief.promptRecipe);
  $("summary-recipe").textContent = selectedRecipe?.title || recipeNames[brief.promptRecipe] || brief.promptRecipe;
  $("summary-plan").textContent = brief.planOnly ? "فقط طرح و استوری‌بورد" : "ویدیوی کامل";
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
  $("command-fallback").hidden = true;
  $("command-fallback").value = "";
  updatePaidAiState();
  setStatus("تنظیمات تغییر کرده‌اند. برای تولید دستور جدید، دوباره «آماده‌سازی تنظیمات» را بزن.");
}

async function copyCommand(command, successMessage) {
  try {
    await navigator.clipboard.writeText(command);
    $("command-fallback").hidden = true;
    $("command-fallback").value = "";
    setStatus(successMessage, true);
  } catch {
    const fallback = $("command-fallback");
    fallback.value = command;
    fallback.hidden = false;
    fallback.focus();
    fallback.select();
    setStatus("کپی خودکار در این مرورگر در دسترس نیست. دستور داخل کادر زیر انتخاب شده؛ آن را کپی کن.");
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
  const modeMessage = lastBrief.planOnly
    ? "حالت فقط طرح فعال است؛ MP4 رندر نمی‌شود. "
    : "حالت تولید ویدیوی کامل انتخاب شده است. ";
  const costMessage = lastBrief.allowPaidAi
    ? "AI پولی با انتخاب صریح شما فعال است و مرحلهٔ تحقیق/برنامه‌ریزی ممکن است هزینه داشته باشد."
    : "AI پولی خاموش است و هیچ کلیدی در فایل brief یا دستور قرار نمی‌گیرد.";
  const musicMessage = lastBrief.musicEngine === "ace-step"
    ? " ACE-Step نیازمند API خودمیزبان پیکربندی‌شده در Secrets است."
    : "";
  setStatus(modeMessage + costMessage + musicMessage, true);
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
  $("command-fallback").hidden = true;
  $("command-fallback").value = "";
  $("metric-duration").textContent = "۹۰ ثانیه";
  $("summary-language").textContent = "فارسی";
  $("summary-style").textContent = "هوشمند";
  $("summary-ratio").textContent = "16:9";
  $("summary-voice").textContent = "گویندگی آنلاین";
  $("summary-music").textContent = "مولد محلی";
  $("summary-recipe").textContent = "برش علمی سینمایی";
  $("summary-plan").textContent = "ویدیوی کامل";
  updatePaidAiState();
  setStatus("فرم پاک شد.");
});

$("brief-form").addEventListener("input", event => {
  if (event.target.id !== "prompt-recipe-search") markBriefStale();
  if (event.target.id === "duration") {
    $("metric-duration").textContent = event.target.value + " ثانیه";
  }
});

updatePaidAiState();
$("prompt-recipe-search").addEventListener("input", event => renderPromptRecipes(event.target.value));
$("prompt-recipe").addEventListener("change", markBriefStale);
void loadPromptRecipes();
