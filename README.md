# 我也要唱K (CLB Sing K)

A spotify web player chrome extension that converts traditional chinese to simplified chinese, and adds pinyin above the lines.

![Demo Gif](/docs/images/demo.gif)

Designed by a former [Chinese Language Basic (CLB)](https://www.languagecouncils.sg/mandarin/en/learning-resources/singaporean-mandarin-database/terms/chinese-language-b-syllabus) student, for fellow CLB people who want to sing along, but cannot read traditional chinese, or need pinyin assistance.

[![Latest Release](https://img.shields.io/github/v/release/QixyQix/CLB-Sing-K)](https://github.com/QixyQix/CLB-Sing-K/releases/latest)
[![Issues](https://img.shields.io/github/issues/QixyQix/CLB-Sing-K)](https://github.com/QixyQix/CLB-Sing-K/issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/QixyQix/CLB-Sing-K)](https://github.com/QixyQix/CLB-Sing-K/pulls)
[![MIT License](https://img.shields.io/packagist/l/QixyQix/CLB-Sing-K)](LICENSE)


## Installation Guide

1. Download the Latest Release **(CLB_Sing_K-x.x.x.zip)** [![Latest Release](https://img.shields.io/github/v/release/QixyQix/CLB-Sing-K)](https://github.com/QixyQix/CLB-Sing-K/releases/latest)
2. Extract the folder somewhere in your system
3. Open chrome (or any chromium based browser) and navigate to your extensions page (for Google Chrome it is `chrome://extensions`)
4. Enable developer mode
5. Click on "Load Unpacked" button
6. Select the folder which contains the plugin you extracted earlier
7. Open the Spotify Web Player, play any chinese song, and 

**Pin the extension for easy access to settings if you are going to change it often**

## Settings

Upon clicking the plugin, a settings menu should show. The plugin provides 3 settings:

1. Chinese Character - Select whether to display:
   - Simplified Chinese (default)
   - Traditional Chinese
2. Pinyin
   - Small text (default)
   - Regular size text
   - Disabled
3. Pinyin Preference
   - zh-Hans(CN) (default)
   - zh-Hant(TW)

**A note about pinyin preference:** There are some characters that have 2 ways of pronouncing. For instance, the character `萎` has 2 pronunciations:
- `wěi` for zh-Hans (CN) - third tone
- `wēi` for zh-Hant (TW) - first tone

You may choose either setting based on the origins of the songs which you're listening to.

## Documentation

For technical documentation, see [docs](/docs).

## Disclaimer

我也要唱K (CLB Sing K) is **not** affiliated with spotify.

**Caveats**

The conversion assumes a simple mapping of a traditional character to its simplified variant. There may be some edge cases where the conversion is incorrect.

## Privacy

我也要唱K (CLB Sing K) does not collect any personally identifiable information about you, such as your listening habits, or IP addresses. All conversions are done locally on your web browser.

CLB Sing K takes a small amount of storage on your device to store your settings.

## Acknowledgements

1. Character and Pinyin data from the [Unihan Database](https://www.unicode.org/charts/unihan.html), licensed under the [Unicode License V3](unihan-converter/Unihan/LICENSE).
    - Pinyin info is from the `kMandarin` property of the `Unihan_Readings` file
    - Conversion from traditional to simplified chinese is from the `kSimplifiedVariant` property of the `Unihan_Variants` file
2. Github Icon provided by [FontAwesome](https://fontawesome.com/), licensed under the [SIL OFL 1.1](https://openfontlicense.org/)
3. Myself for letting my mandarin get so bad that I need to develop this extension for myself (and possibly others) 😬

## License

This project is open source licensed under the [MIT license](LICENSE).

