import { describe, expect, test } from 'bun:test';
import { windowsArabic } from '@/layouts/windows-arabic';

describe('windowsArabic layout map', () => {
  test('QWERTY row (q–p, [, ])', () => {
    expect(windowsArabic['ض']).toBe('q');
    expect(windowsArabic['ص']).toBe('w');
    expect(windowsArabic['ث']).toBe('e');
    expect(windowsArabic['ق']).toBe('r');
    expect(windowsArabic['ف']).toBe('t');
    expect(windowsArabic['غ']).toBe('y');
    expect(windowsArabic['ع']).toBe('u');
    expect(windowsArabic['ه']).toBe('i');
    expect(windowsArabic['خ']).toBe('o');
    expect(windowsArabic['ح']).toBe('p');
    expect(windowsArabic['ج']).toBe('[');
    expect(windowsArabic['د']).toBe(']');
  });

  test('home row (a–l, ;, quote)', () => {
    expect(windowsArabic['ش']).toBe('a');
    expect(windowsArabic['س']).toBe('s');
    expect(windowsArabic['ي']).toBe('d');
    expect(windowsArabic['ب']).toBe('f');
    expect(windowsArabic['ل']).toBe('g');
    expect(windowsArabic['ا']).toBe('h');
    expect(windowsArabic['ت']).toBe('j');
    expect(windowsArabic['ن']).toBe('k');
    expect(windowsArabic['م']).toBe('l');
    expect(windowsArabic['ك']).toBe(';');
    expect(windowsArabic['ط']).toBe("'");
  });

  test('bottom row (z–/, backtick)', () => {
    expect(windowsArabic['ئ']).toBe('z');
    expect(windowsArabic['ء']).toBe('x');
    expect(windowsArabic['ؤ']).toBe('c');
    expect(windowsArabic['ر']).toBe('v');
    expect(windowsArabic['ى']).toBe('n');
    expect(windowsArabic['ة']).toBe('m');
    expect(windowsArabic['و']).toBe(',');
    expect(windowsArabic['ز']).toBe('.');
    expect(windowsArabic['ظ']).toBe('/');
    expect(windowsArabic['ذ']).toBe('`');
  });

  test('arabic punctuation maps to latin equivalents', () => {
    expect(windowsArabic['،']).toBe(',');
    expect(windowsArabic['؟']).toBe('?');
    expect(windowsArabic['؛']).toBe(';');
  });
});
