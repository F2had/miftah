import { describe, expect, test } from 'bun:test';
import { keyboardFilter, keyboardUnmap } from '@/index';

describe('keyboardUnmap', () => {
  test('empty string returns empty string', () => {
    expect(keyboardUnmap('')).toBe('');
  });

  test('latin input passes through unchanged', () => {
    expect(keyboardUnmap('hello')).toBe('hello');
    expect(keyboardUnmap('Saudi Arabia')).toBe('Saudi Arabia');
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

  test('saudi — s,a,u,d,i typed with Arabic input active', () => {
    // s→س  a→ش  u→ع  d→ي  i→ه
    expect(keyboardUnmap('سشعيه')).toBe('saudi');
  });

  test('riyal — r,i,y,a,l typed with Arabic input active', () => {
    // r→ق  i→ه  y→غ  a→ش  l→م
    expect(keyboardUnmap('قهغشم')).toBe('riyal');
  });

  test('mixed latin and arabic', () => {
    expect(keyboardUnmap('hello سشعيه')).toBe('hello saudi');
  });

  test('mac-arabic layout', () => {
    expect(keyboardUnmap('سشعيه', 'mac-arabic')).toBe('saudi');
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
      expect(keyboardFilter('Saudi Arabia', 'saudi')).toBe(true);
    });

    test('case-insensitive by default', () => {
      expect(keyboardFilter('Saudi Arabia', 'SAUDI')).toBe(true);
    });

    test('case-sensitive when opted in', () => {
      expect(keyboardFilter('Saudi Arabia', 'SAUDI', { caseSensitive: true })).toBe(false);
      expect(keyboardFilter('Saudi Arabia', 'Saudi', { caseSensitive: true })).toBe(true);
    });

    test('eastern arabic numeral in value matches western numeral in search', () => {
      expect(keyboardFilter('٢٠٢٤', '2024')).toBe(true);
    });

    test('western numeral in value matches eastern arabic numeral in search', () => {
      expect(keyboardFilter('2024', '٢٠٢٤')).toBe(true);
    });
  });

  describe('branch 3 — keyboard layout match', () => {
    test('arabic-typed search matches latin value — saudi', () => {
      expect(keyboardFilter('Saudi Arabia', 'سشعيه')).toBe(true);
    });

    test('arabic-typed search matches latin value — riyal', () => {
      expect(keyboardFilter('riyal', 'قهغشم')).toBe(true);
    });

    test('partial keyboard match', () => {
      expect(keyboardFilter('Saudi Arabia', 'سشع')).toBe(true);
    });

    test('mac-arabic layout option is respected', () => {
      expect(keyboardFilter('Saudi Arabia', 'سشعيه', { layout: 'mac-arabic' })).toBe(true);
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
      // keyboardUnmap('خ') = 'o' → 'khalid'.includes('o') = false → branch 3 skipped
      // phonetic('خ') = 'kh' → 'khalid'.includes('kh') = true → branch 4 matches
      expect(keyboardFilter('khalid', 'خ')).toBe(true);
    });

    test('phonetic disabled via option', () => {
      expect(keyboardFilter('thursday', 'ث', { phonetic: false })).toBe(false);
    });
  });

  describe('branch 5 — no match', () => {
    test('unrelated strings do not match', () => {
      expect(keyboardFilter('Saudi Arabia', 'xyz')).toBe(false);
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
      expect(keyboardFilter('Saudi Arabia', 'Saudi Arabia')).toBe(true);
    });

    test('fully latin search skips keyboard unmap path when unmap produces no change', () => {
      expect(keyboardFilter('world', 'hello')).toBe(false);
    });
  });
});
