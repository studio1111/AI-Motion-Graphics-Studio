const PERSIAN_LANGUAGES = new Set(["fa", "fa-ir", "prs"]);

export function normalizeNarrationText(input, language = "fa") {
  const locale = String(language || "fa").trim().toLowerCase();
  let text = String(input ?? "").normalize("NFC")
    .replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, "")
    .replace(/[\u00ad\u034f\u061c]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[\t\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return "";
  if (PERSIAN_LANGUAGES.has(locale)) {
    text = text
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/,/g, "،")
      .replace(/;/g, "؛")
      .replace(/\?/g, "؟");
  }

  text = text
    .replace(/\s+([،؛؟.!:])/g, "$1")
    .replace(/([،؛؟.!:])(?=\S)/g, "$1 ")
    .replace(/([،؛])\s*([،؛])/g, "$1")
    .replace(/([.!؟]){2,}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (text && !/[.!؟…]$/.test(text)) text += ".";
  return text;
}
