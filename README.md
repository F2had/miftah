# miftah

[![CI](https://github.com/F2had/miftah/actions/workflows/ci.yml/badge.svg)](https://github.com/F2had/miftah/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/miftah)](https://www.npmjs.com/package/miftah)
[![bundle size](https://img.shields.io/bundlephobia/minzip/miftah)](https://bundlephobia.com/package/miftah)
[![license](https://img.shields.io/npm/l/miftah)](./LICENSE)

Arabic-speaking users often type on a QWERTY keyboard with their OS input switched to Arabic. Their muscle memory produces Arabic characters — `عربي` instead of `uvfd` — because the mapping is by key position, not by sound.

`miftah` handles both: it maps Arabic keyboard layout characters back to the Latin keys that produced them, and also matches by phonetic transliteration — as a drop-in filter function for any search input.

## Install

```bash
bun add miftah
# or
npm install miftah
```

## Usage

```ts
import { keyboardUnmap, keyboardRemap, keyboardFilter } from 'miftah'

// Unmap — Arabic keyboard input → Latin
keyboardUnmap('عربي')   // → 'uvfd'
keyboardUnmap('hello')  // → 'hello'  (Latin passes through)

// Remap — Latin keys → Arabic chars (reverse direction)
keyboardRemap('flag')   // → 'بمشل'  (what those keys produce on Arabic layout)
keyboardRemap('عربي')   // → 'عربي'  (Arabic passes through)

// Plain JS filter
items.filter(item => keyboardFilter(item.name, searchQuery))

// Vuetify
// <VAutocomplete :custom-filter="(v, s) => keyboardFilter(v, s)" />

// With options
keyboardFilter('arabic', 'عربي')                                  // → true  (keyboard unmap match)
keyboardFilter('بمشل', 'flag')                                    // → true  (keyboard remap match)
keyboardFilter('thursday', 'ث')                                   // → true  (phonetic: th)
keyboardFilter('2024', '٢٠٢٤')                                    // → true  (numeral normalization)
keyboardFilter('Hello', 'HELLO', { caseSensitive: true })         // → false
```

## API

### `keyboardUnmap(input, layout?)`

Converts Arabic keyboard layout characters back to the Latin keys that produced them. Non-Arabic characters pass through unchanged.

| Parameter | Type | Default |
|---|---|---|
| `input` | `string` | — |
| `layout` | `'windows-arabic' \| 'mac-arabic'` | `'windows-arabic'` |

### `keyboardRemap(input, layout?)`

Converts Latin keys to the Arabic characters they produce on the given keyboard layout. The reverse of `keyboardUnmap`. Non-Latin characters and unmapped keys pass through unchanged.

| Parameter | Type | Default |
|---|---|---|
| `input` | `string` | — |
| `layout` | `'windows-arabic' \| 'mac-arabic'` | `'windows-arabic'` |

### `keyboardFilter(value, search, options?)`

Returns `true` if `value` matches `search` via any of these strategies, in order:

1. Empty search — always true
2. Direct match (case and numeral normalized)
3. Keyboard layout unmap — convert Arabic chars in `search` to Latin keys, check against `value`
4. Phonetic match — transliterate Arabic chars in `search` to Latin, check against `value`
5. Keyboard layout remap — convert Latin keys in `search` to Arabic chars, check against `value`
6. No match — false

| Option | Type | Default |
|---|---|---|
| `layout` | `'windows-arabic' \| 'mac-arabic'` | `'windows-arabic'` |
| `phonetic` | `boolean` | `true` |
| `caseSensitive` | `boolean` | `false` |

## Keyboard layout notes

The default is Windows Arabic (101) — the most common layout in Gulf/MENA regions. The map is verified against the Windows Arabic (101) .klc source from Microsoft Keyboard Layout Creator.

Mac Arabic is supported as a named variant via `layout: 'mac-arabic'`.

## License

[MIT](./LICENSE)
