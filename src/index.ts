import { macArabic } from '@/layouts/mac-arabic';
import { windowsArabic } from '@/layouts/windows-arabic';
import { phonetic as phoneticMap } from '@/phonetic';

export type Layout = 'windows-arabic' | 'mac-arabic';

export interface FilterOptions {
  layout?: Layout;
  phonetic?: boolean;
  caseSensitive?: boolean;
}

const layouts: Record<Layout, Record<string, string>> = {
  'windows-arabic': windowsArabic,
  'mac-arabic': macArabic,
};

// Arabic punctuation aliases share Latin keys with letter entries.
// Excluded from reverseLayouts so the letter mapping always wins on collision.
const PUNCTUATION_ALIASES = new Set(['،', '؟', '؛']);

const invertLayout = (map: Record<string, string>): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [arabic, latin] of Object.entries(map)) {
    if (!PUNCTUATION_ALIASES.has(arabic)) result[latin] = arabic;
  }
  return result;
};

const reverseLayouts: Record<Layout, Record<string, string>> = {
  'windows-arabic': invertLayout(windowsArabic),
  'mac-arabic': invertLayout(macArabic),
};

const normalize = (s: string, caseSensitive: boolean): string => {
  const lowered = caseSensitive ? s : s.toLowerCase();
  // Eastern Arabic numerals U+0660–U+0669 → Western 0–9
  return lowered.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));
};

const phoneticTransliterate = (input: string): string =>
  [...input].map((char) => phoneticMap[char] ?? char).join('');

export const keyboardUnmap = (
  input: string,
  layout: Layout = 'windows-arabic',
): string => [...input].map((char) => layouts[layout][char] ?? char).join('');

export const keyboardRemap = (
  input: string,
  layout: Layout = 'windows-arabic',
): string =>
  [...input].map((char) => reverseLayouts[layout][char] ?? char).join('');

export const keyboardFilter = (
  value: string,
  search: string,
  options: FilterOptions = {},
): boolean => {
  const {
    layout = 'windows-arabic',
    phonetic: usePhonetic = true,
    caseSensitive = false,
  } = options;

  if (search === '') return true;

  const nValue = normalize(value, caseSensitive);
  const nSearch = normalize(search, caseSensitive);

  if (nValue.includes(nSearch)) return true;

  const unmapped = keyboardUnmap(search, layout);
  if (
    unmapped !== search &&
    nValue.includes(normalize(unmapped, caseSensitive))
  )
    return true;

  if (usePhonetic) {
    const phonetized = phoneticTransliterate(search);
    if (
      phonetized !== search &&
      nValue.includes(normalize(phonetized, caseSensitive))
    )
      return true;
  }

  const remapped = keyboardRemap(nSearch, layout);
  if (
    remapped !== nSearch &&
    nValue.includes(normalize(remapped, caseSensitive))
  )
    return true;

  return false;
};
