import { describe, expect, test } from 'bun:test';
import { macArabic } from '@/layouts/mac-arabic';

// Mac Arabic v1 is identical to Windows Arabic (101) for all core letter keys.
// Update when confirmed differences are documented.
describe('macArabic layout map', () => {
  test('core letter keys match Windows Arabic', () => {
    expect(macArabic['ض']).toBe('q');
    expect(macArabic['ص']).toBe('w');
    expect(macArabic['ث']).toBe('e');
    expect(macArabic['ق']).toBe('r');
    expect(macArabic['ف']).toBe('t');
    expect(macArabic['غ']).toBe('y');
    expect(macArabic['ع']).toBe('u');
    expect(macArabic['ه']).toBe('i');
    expect(macArabic['خ']).toBe('o');
    expect(macArabic['ح']).toBe('p');
    expect(macArabic['ش']).toBe('a');
    expect(macArabic['س']).toBe('s');
    expect(macArabic['ي']).toBe('d');
    expect(macArabic['ب']).toBe('f');
    expect(macArabic['ل']).toBe('g');
    expect(macArabic['ا']).toBe('h');
    expect(macArabic['ت']).toBe('j');
    expect(macArabic['ن']).toBe('k');
    expect(macArabic['م']).toBe('l');
    expect(macArabic['ئ']).toBe('z');
    expect(macArabic['ء']).toBe('x');
    expect(macArabic['ؤ']).toBe('c');
    expect(macArabic['ر']).toBe('v');
    expect(macArabic['ى']).toBe('n');
    expect(macArabic['ة']).toBe('m');
    expect(macArabic['و']).toBe(',');
    expect(macArabic['ز']).toBe('.');
    expect(macArabic['ظ']).toBe('/');
  });
});
