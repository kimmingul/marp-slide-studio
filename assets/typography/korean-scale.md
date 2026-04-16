# Korean-Specific Notes

Moved to the unified CJK guide at [`cjk-scale.md`](cjk-scale.md). Korean now sits alongside Japanese and Chinese as one of four supported CJK locales.

Korean-specific rules still worth highlighting:

- **Primary font**: Pretendard Variable (SIL OFL) — superior Hangul + matched Latin
- **Body line-height**: 1.7 (vs 1.5 for Latin, 1.65 for Japanese body)
- **Quotation marks**: `" "` for modern technical writing, `「 」` / `『 』` for classical/editorial
- **Never italicize Hangul** — synthesized slant is broken in most fonts
- **Never UPPERCASE Hangul** — no case system exists

See `cjk-scale.md` for the full rule set and per-language calibration tables.

For layouts unique to Korean:
- Hanja ruby annotation: `assets/layouts/ruby-annotation.md` (shared with Japanese furigana and Chinese pinyin)
- Vertical writing (세로쓰기): `assets/layouts/vertical-writing.md` (shared with Japanese 縦書き and Chinese 竖排)
- Banner caption (방주): `assets/layouts/banner-caption.md` — also works for any language but roots in Korean classical commentary
