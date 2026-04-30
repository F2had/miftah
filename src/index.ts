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

  return false;
};
