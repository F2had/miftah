// Maps Arabic characters to their approximate Latin phonetic representation.
// Multi-char values (sh, kh, th, gh) are concatenated char-by-char in phoneticTransliterate.
export const phonetic: Record<string, string> = {
  // Alef and variants
  ا: 'a',
  أ: 'a',
  إ: 'a',
  آ: 'a',
  // Consonants — single char output
  ب: 'b',
  ت: 't',
  ج: 'j',
  د: 'd',
  ر: 'r',
  ز: 'z',
  س: 's',
  ص: 's',
  ض: 'd',
  ط: 't',
  ظ: 'z',
  ع: 'a',
  ف: 'f',
  ق: 'q',
  ك: 'k',
  ل: 'l',
  م: 'm',
  ن: 'n',
  ه: 'h',
  و: 'w',
  ي: 'y',
  // Consonants — multi-char output
  ث: 'th',
  ذ: 'th',
  خ: 'kh',
  ش: 'sh',
  غ: 'gh',
  // Alef maqsura and taa marbuta
  ى: 'a',
  ة: 'a',
  // Hamza variants
  ء: 'a',
  ئ: 'y',
  ؤ: 'w',
};
