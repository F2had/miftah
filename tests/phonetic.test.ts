import { describe, expect, test } from 'bun:test';
import { phonetic } from '@/phonetic';

describe('phonetic map', () => {
  test('single-char outputs', () => {
    expect(phonetic['ا']).toBe('a');
    expect(phonetic['ب']).toBe('b');
    expect(phonetic['ت']).toBe('t');
    expect(phonetic['د']).toBe('d');
    expect(phonetic['ر']).toBe('r');
    expect(phonetic['ز']).toBe('z');
    expect(phonetic['س']).toBe('s');
    expect(phonetic['ص']).toBe('s');
    expect(phonetic['ض']).toBe('d');
    expect(phonetic['ط']).toBe('t');
    expect(phonetic['ظ']).toBe('z');
    expect(phonetic['ع']).toBe('a');
    expect(phonetic['ف']).toBe('f');
    expect(phonetic['ق']).toBe('q');
    expect(phonetic['ك']).toBe('k');
    expect(phonetic['ل']).toBe('l');
    expect(phonetic['م']).toBe('m');
    expect(phonetic['ن']).toBe('n');
    expect(phonetic['ه']).toBe('h');
    expect(phonetic['و']).toBe('w');
    expect(phonetic['ي']).toBe('y');
  });

  test('multi-char outputs', () => {
    expect(phonetic['ث']).toBe('th');
    expect(phonetic['ذ']).toBe('th');
    expect(phonetic['خ']).toBe('kh');
    expect(phonetic['ش']).toBe('sh');
    expect(phonetic['غ']).toBe('gh');
  });

  test('alef variants all map to a', () => {
    expect(phonetic['أ']).toBe('a');
    expect(phonetic['إ']).toBe('a');
    expect(phonetic['آ']).toBe('a');
    expect(phonetic['ى']).toBe('a');
    expect(phonetic['ة']).toBe('a');
  });

  test('hamza variants', () => {
    expect(phonetic['ء']).toBe('a');
    expect(phonetic['ئ']).toBe('y');
    expect(phonetic['ؤ']).toBe('w');
  });
});
