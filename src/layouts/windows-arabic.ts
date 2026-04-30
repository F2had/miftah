// Reverse map of Windows Arabic (101) keyboard layout.
// Key: Arabic character produced. Value: Latin key that produces it.
// Source: Windows Arabic (101) .klc — Microsoft Keyboard Layout Creator.
// Characters appearing on multiple keys use the most common Gulf/MENA mapping.
export const windowsArabic: Record<string, string> = {
  // QWERTY row
  'ض': 'q', 'ص': 'w', 'ث': 'e', 'ق': 'r', 'ف': 't',
  'غ': 'y', 'ع': 'u', 'ه': 'i', 'خ': 'o', 'ح': 'p',
  'ج': '[', 'د': ']',
  // Home row
  'ش': 'a', 'س': 's', 'ي': 'd', 'ب': 'f', 'ل': 'g',
  'ا': 'h', 'ت': 'j', 'ن': 'k', 'م': 'l',
  'ك': ';', 'ط': "'",
  // Bottom row
  'ئ': 'z', 'ء': 'x', 'ؤ': 'c', 'ر': 'v',
  'ى': 'n', 'ة': 'm',
  'و': ',', 'ز': '.', 'ظ': '/',
  'ذ': '`',
  // Arabic punctuation → Latin equivalent
  '،': ',', '؟': '?', '؛': ';',
};
