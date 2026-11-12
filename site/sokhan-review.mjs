export function validateDraft(document, { allowEmptyTranslations = false } = {}) {
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    throw new Error("The selected file must contain a Sokhan JSON object.");
  }
  if (document.schemaVersion !== 1 ||
      document.sourceLanguage !== "en" ||
      document.targetLanguage !== "fa") {
    throw new Error("This review studio accepts Sokhan v1 English-to-Persian drafts only.");
  }
  if (!Array.isArray(document.segments) || document.segments.length < 1 || document.segments.length > 500) {
    throw new Error("The draft must contain between 1 and 500 narration segments.");
  }
  if (!["needs_human_review", "approved"].includes(document.reviewStatus)) {
    throw new Error("The draft reviewStatus is invalid.");
  }

  const ids = new Set();
  for (const segment of document.segments) {
    if (!segment || typeof segment !== "object" ||
        typeof segment.id !== "string" || !segment.id.trim() || segment.id.length > 128) {
      throw new Error("Every segment must have a valid ID.");
    }
    if (ids.has(segment.id)) throw new Error("The draft contains a duplicate segment ID: " + segment.id);
    ids.add(segment.id);
    if (typeof segment.sourceText !== "string" || !segment.sourceText.trim() ||
        typeof segment.translation !== "string" || (!allowEmptyTranslations && !segment.translation.trim())) {
      throw new Error("Every segment must have non-empty English source and Persian translation text.");
    }
  }
  return document;
}

export function canApproveDraft(document, reviewedIds) {
  try {
    validateDraft(document);
    const reviewed = reviewedIds instanceof Set ? reviewedIds : new Set(reviewedIds || []);
    return document.segments.every(segment => reviewed.has(segment.id) && segment.translation.trim().length > 0);
  } catch {
    return false;
  }
}

export function createApprovedDraft(document, reviewedIds) {
  validateDraft(document);
  if (!canApproveDraft(document, reviewedIds)) {
    throw new Error("Every segment must be reviewed before the draft can be approved.");
  }
  return {
    ...document,
    reviewStatus: "approved",
    reviewedSegmentIds: document.segments.map(segment => segment.id),
    segments: document.segments.map(segment => ({ ...segment }))
  };
}

export function updateDraftTranslation(document, segmentId, translation) {
  validateDraft(document, { allowEmptyTranslations: true });
  if (typeof translation !== "string") throw new TypeError("Translation must be text.");
  if (!document.segments.some(segment => segment.id === segmentId)) {
    throw new Error("Unknown segment ID: " + segmentId);
  }
  const updated = {
    ...document,
    reviewStatus: "needs_human_review",
    segments: document.segments.map(segment =>
      segment.id === segmentId ? { ...segment, translation } : { ...segment }
    )
  };
  delete updated.reviewedSegmentIds;
  return updated;
}

export function initSokhanReviewPage() {
  if (typeof document === "undefined") return;
  const root = document.querySelector("[data-sokhan-review]");
  if (!root) return;

  const fileInput = root.querySelector("#sokhan-file");
  const status = root.querySelector("#sokhan-status");
  const segmentList = root.querySelector("#sokhan-segments");
  const count = root.querySelector("#sokhan-review-count");
  const approveButton = root.querySelector("#sokhan-approve");
  let draft = null;
  let reviewedIds = new Set();
  let originalName = "narration-fa.json";

  const setStatus = (message, kind = "info") => {
    status.textContent = message;
    status.dataset.kind = kind;
  };

  const updateProgress = () => {
    const total = draft?.segments.length || 0;
    count.textContent = total ? reviewedIds.size + " / " + total + " بخش بازبینی شده" : "هنوز فایلی انتخاب نشده است";
    approveButton.disabled = !draft || !canApproveDraft(draft, reviewedIds);
  };

  const renderSegments = () => {
    segmentList.replaceChildren();
    draft.segments.forEach((segment, index) => {
      const card = document.createElement("article");
      card.className = "sokhan-segment";

      const header = document.createElement("header");
      header.className = "sokhan-segment-header";
      const heading = document.createElement("h2");
      heading.textContent = (index + 1) + ". " + segment.id;
      const reviewLabel = document.createElement("label");
      reviewLabel.className = "sokhan-review-check";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = reviewedIds.has(segment.id);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked && segment.translation.trim()) reviewedIds.add(segment.id);
        else reviewedIds.delete(segment.id);
        updateProgress();
      });
      const labelText = document.createElement("span");
      labelText.textContent = "این بخش را بازبینی کردم";
      reviewLabel.append(checkbox, labelText);
      header.append(heading, reviewLabel);

      const sourceLabel = document.createElement("h3");
      sourceLabel.textContent = "متن مبدأ انگلیسی";
      const source = document.createElement("pre");
      source.className = "sokhan-source";
      source.dir = "ltr";
      source.textContent = segment.sourceText;

      const translationLabel = document.createElement("label");
      translationLabel.className = "sokhan-translation-label";
      translationLabel.textContent = "ترجمهٔ فارسی";
      const textarea = document.createElement("textarea");
      textarea.className = "sokhan-translation";
      textarea.dir = "rtl";
      textarea.lang = "fa";
      textarea.rows = 4;
      textarea.value = segment.translation;
      textarea.setAttribute("aria-label", "ترجمهٔ فارسی بخش " + segment.id);
      textarea.addEventListener("input", () => {
        draft = updateDraftTranslation(draft, segment.id, textarea.value);
        reviewedIds.delete(segment.id);
        checkbox.checked = false;
        updateProgress();
        setStatus("ترجمه تغییر کرد؛ این بخش باید دوباره بازبینی شود.");
      });
      translationLabel.append(textarea);

      card.append(header, sourceLabel, source, translationLabel);
      segmentList.append(card);
    });
    updateProgress();
  };

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (file.size > 5_000_000) {
      setStatus("حجم فایل از ۵ مگابایت بیشتر است.", "error");
      fileInput.value = "";
      return;
    }
    try {
      const parsed = JSON.parse(await file.text());
      validateDraft(parsed);
      draft = { ...parsed, reviewStatus: "needs_human_review" };
      delete draft.reviewedSegmentIds;
      reviewedIds = new Set();
      originalName = file.name || originalName;
      renderSegments();
      setStatus("فایل بارگذاری شد. متن هر بخش را بررسی و پس از تأیید، تیک آن را فعال کن.", "success");
    } catch (error) {
      draft = null;
      reviewedIds = new Set();
      segmentList.replaceChildren();
      updateProgress();
      setStatus(error?.message || "فایل JSON معتبر نیست.", "error");
    }
  });

  approveButton.addEventListener("click", () => {
    try {
      const approved = createApprovedDraft(draft, reviewedIds);
      const blob = new Blob([JSON.stringify(approved, null, 2) + "\n"], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = originalName.replace(/\.json$/i, "") + ".approved.json";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      draft = approved;
      setStatus("ترجمه تأیید شد و فایل JSON دریافت شد. برای تولید صدا از همین فایل استفاده کن.", "success");
    } catch (error) {
      setStatus(error?.message || "امکان تأیید فایل وجود ندارد.", "error");
    }
  });

  updateProgress();
}

if (typeof document !== "undefined") initSokhanReviewPage();
