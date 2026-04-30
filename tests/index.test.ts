import { describe, expect, test } from 'bun:test';
import { keyboardFilter, keyboardRemap, keyboardUnmap } from '@/index';

describe('keyboardUnmap', () => {
  test('empty string returns empty string', () => {
    expect(keyboardUnmap('')).toBe('');
  });

  test('latin input passes through unchanged', () => {
    expect(keyboardUnmap('hello')).toBe('hello');
    expect(keyboardUnmap('hello world')).toBe('hello world');
  });

  test('western numerals pass through', () => {
    expect(keyboardUnmap('2024')).toBe('2024');
  });

  test('eastern arabic numerals pass through unchanged (normalize handles them)', () => {
    expect(keyboardUnmap('٢٠٢٤')).toBe('٢٠٢٤');
  });

  test('spaces and punctuation pass through', () => {
    expect(keyboardUnmap('hello world')).toBe('hello world');
  });

  test('flag — f,l,a,g typed with Arabic input active', () => {
    // ب→f  م→l  ش→a  ل→g
    expect(keyboardUnmap('بمشل')).toBe('flag');
  });

  test('glad — g,l,a,d typed with Arabic input active', () => {
    // ل→g  م→l  ش→a  ي→d
    expect(keyboardUnmap('لمشي')).toBe('glad');
  });

  test('mixed latin and arabic', () => {
    expect(keyboardUnmap('hello بمشل')).toBe('hello flag');
  });

  test('mac-arabic layout', () => {
    expect(keyboardUnmap('بمشل', 'mac-arabic')).toBe('flag');
  });
});

describe('keyboardRemap', () => {
  test('empty string returns empty string', () => {
    expect(keyboardRemap('')).toBe('');
  });

  test('arabic input passes through unchanged', () => {
    expect(keyboardRemap('بمشل')).toBe('بمشل');
  });

  test('latin keys map to arabic chars — flag', () => {
    // f→ب  l→م  a→ش  g→ل
    expect(keyboardRemap('flag')).toBe('بمشل');
  });

  test('latin keys map to arabic chars — glad', () => {
    // g→ل  l→م  a→ش  d→ي
    expect(keyboardRemap('glad')).toBe('لمشي');
  });

  test('uppercase input passes through unchanged (no case folding — caller normalizes)', () => {
    expect(keyboardRemap('FLAG')).toBe('FLAG');
  });

  test('comma maps to waw — letter wins over arabic punctuation alias', () => {
    expect(keyboardRemap(',')).toBe('و');
  });

  test('mixed latin and arabic', () => {
    // h→ا  e→ث  l→م  l→م  o→خ; arabic chars pass through
    expect(keyboardRemap('hello بمشل')).toBe('اثممخ بمشل');
  });

  test('mac-arabic layout', () => {
    expect(keyboardRemap('flag', 'mac-arabic')).toBe('بمشل');
  });
});

describe('keyboardFilter', () => {
  describe('branch 1 — empty search always true', () => {
    test('empty search matches any value', () => {
      expect(keyboardFilter('anything', '')).toBe(true);
      expect(keyboardFilter('', '')).toBe(true);
    });
  });

  describe('branch 2 — direct match', () => {
    test('exact latin match', () => {
      expect(keyboardFilter('keyboard', 'key')).toBe(true);
    });

    test('case-insensitive by default', () => {
      expect(keyboardFilter('keyboard', 'KEY')).toBe(true);
    });

    test('case-sensitive when opted in', () => {
      expect(keyboardFilter('Keyboard', 'KEY', { caseSensitive: true })).toBe(false);
      expect(keyboardFilter('Keyboard', 'Key', { caseSensitive: true })).toBe(true);
    });

    test('eastern arabic numeral in value matches western numeral in search', () => {
      expect(keyboardFilter('٢٠٢٤', '2024')).toBe(true);
    });

    test('western numeral in value matches eastern arabic numeral in search', () => {
      expect(keyboardFilter('2024', '٢٠٢٤')).toBe(true);
    });
  });

  describe('branch 3 — keyboard layout match', () => {
    test('arabic-typed search matches latin value — flag', () => {
      expect(keyboardFilter('flag', 'بمشل')).toBe(true);
    });

    test('arabic-typed search matches latin value — glad', () => {
      expect(keyboardFilter('glad', 'لمشي')).toBe(true);
    });

    test('partial keyboard match', () => {
      expect(keyboardFilter('flag', 'بمش')).toBe(true);
    });

    test('mac-arabic layout option is respected', () => {
      expect(keyboardFilter('flag', 'بمشل', { layout: 'mac-arabic' })).toBe(true);
    });
  });

  describe('branch 4 — phonetic match', () => {
    // Phonetic path: transliterates the SEARCH (Arabic→Latin) then checks against value.
    // Value must be Latin; search must contain Arabic chars to trigger this branch.

    test('ث (th sound) matches latin value containing "th"', () => {
      // keyboardUnmap('ث') = 'e' → 'thursday'.includes('e') = false → branch 3 skipped
      // phonetic('ث') = 'th' → 'thursday'.includes('th') = true → branch 4 matches
      expect(keyboardFilter('thursday', 'ث')).toBe(true);
    });

    test('خ (kh sound) matches latin value containing "kh"', () => {
      // keyboardUnmap('خ') = 'o' → 'khaki'.includes('o') = false → branch 3 skipped
      // phonetic('خ') = 'kh' → 'khaki'.includes('kh') = true → branch 4 matches
      expect(keyboardFilter('khaki', 'خ')).toBe(true);
    });

    test('phonetic disabled via option', () => {
      expect(keyboardFilter('thursday', 'ث', { phonetic: false })).toBe(false);
    });
  });

  describe('branch 5 — latin search remaps to arabic value', () => {
    test('single latin key matches arabic value', () => {
      // keyboardUnmap('f') = 'f' (no change) → branch 3 skipped
      // phonetic('f') = 'f' (no change) → branch 4 skipped
      // keyboardRemap('f') = 'ب' → 'بمشل'.includes('ب') = true
      expect(keyboardFilter('بمشل', 'f')).toBe(true);
    });

    test('multi-char latin search matches consecutive arabic chars in value', () => {
      // keyboardRemap('fl') = 'بم' — appears at the start of 'بمشل'
      expect(keyboardFilter('بمشل', 'fl')).toBe(true);
    });

    test('full latin word matches arabic value that is the remap result', () => {
      // keyboardRemap('flag') = 'بمشل'
      expect(keyboardFilter('بمشل', 'flag')).toBe(true);
    });

    test('uppercase latin search is normalized before remapping', () => {
      expect(keyboardFilter('بمشل', 'FLAG')).toBe(true);
    });

    test('latin search that remaps to non-matching arabic returns false', () => {
      // keyboardRemap('glad') = 'لمشي' — not a substring of 'بمشل'
      expect(keyboardFilter('بمشل', 'glad')).toBe(false);
    });

    test('mac-arabic layout option is respected', () => {
      expect(keyboardFilter('بمشل', 'flag', { layout: 'mac-arabic' })).toBe(true);
    });
  });

  describe('branch 6 — no match', () => {
    test('unrelated strings do not match', () => {
      expect(keyboardFilter('hello', 'xyz')).toBe(false);
    });

    test('empty value with non-empty search', () => {
      expect(keyboardFilter('', 'search')).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('numbers in both value and search', () => {
      expect(keyboardFilter('order 2024', '2024')).toBe(true);
    });

    test('spaces handled correctly', () => {
      expect(keyboardFilter('hello world', 'hello world')).toBe(true);
    });

    test('fully latin search skips keyboard unmap path when unmap produces no change', () => {
      expect(keyboardFilter('world', 'hello')).toBe(false);
    });
  });
});
