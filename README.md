# 我也要唱K (CLB Sing K)

A spotify web player chrome extension that converts traditional chinese to simplified chinese, and adds pinyin above the lines.

Designed for fellow [Chinese Language Basic (CLB)](https://www.languagecouncils.sg/mandarin/en/learning-resources/singaporean-mandarin-database/terms/chinese-language-b-syllabus) people who want to sing karaoke, but cannot read traditional chinese, or need pinyin assistance.

## Installation Guide

TODO

# Documentation

This app is split into two portions:

1. The JavaScript which is injected into Spotify's web player page to modify the lyric HTML elements
2. Unihan Converter which contains the scripts to generate the mappings from traditional to simplified chinese and its pinyin.

### Caveats

There are some characters that will have two ways of pronouncing, as outlined in the Unihan database.

For instance, the character `萎` which means "wilt" has 2 pronunciations:
- `wěi` for zh-Hans (CN) - third tone
- `wēi` for zh-Hant (TW) - first tone

I have decided to go with the zh-Hans pinyin representation for now, as afterall, the traditional text is being translated to simplified.

However, do note that the pronunciation between the provided pinyin and the actual singer may differ due to this.

I may add some functionality in the future to allow you to switch between the two.

## Acknowledgements

1. Character data is provided by the [Unihan Database](https://www.unicode.org/charts/unihan.html)
    - Pinyin info is from the `kMandarin` property of the `Unihan_Readings` file
    - Conversion from traditional to simplified chinese is from the `kSimplifiedVariant` property of the `Unihan_Variants` file
2. Myself for letting my mandarin get so bad that I need to develop this extension for myself (and possibly others) 😬