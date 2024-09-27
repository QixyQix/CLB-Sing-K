# Documentation

This documentation contains technical details about the extension, and is meant for developers.

For usage information, please see the [README](../README.md).

### Overview

The overall extension is built using Vite. The extension is comprised of 3 main areas:

1. **Settings web interface** which is built using  ReactJS.
   - This is found in the `src` folder
2. The **Background JavaScript which is injected into Spotify's web player** page to modify the lyric HTML elements
   - This is `background.js` found in the `public` folder
3. **Unihan Converter** which contains the scripts to generate the mappings from traditional to simplified chinese and its pinyin.
   - This is the `converter.js` found in the `unihan-converter` folder

Note: the `manifest.json` which chrome browses use to detect a plugin is also found in the `public` folder.

## Getting Started

1. Ensure you have [NodeJS](https://nodejs.org/en) installed
2. Clone the project
3. Install dependencies:
   ```
   npm install
   ```
4. Build the project:
   ```
   npm run build
   ```
5. Built plugin will be in a `dist` folder
6. Open chromium, go to extensions manager, load unpacked, and select the `dist` folder
7. Whenever you rebuild the extension, for changes to take effect, go to extensions manager and reload the extension

**Accessing console outputs**

- For the Settings Webapp, open the webapp, and open develoepr tools from there
- For background script, open spotify

## Settings Web Interface

The web application is built using React. It currently only has one component which is the `SelectInput`.

The settings web interface saves the settings into chrome's storage under the `sync` namespace, which allows it to be synced across user's browsers if enabled and acts as a `local` if sync is not enabled. [Chrome Docs](https://developer.chrome.com/docs/extensions/reference/api/storage#storage_areas)

### Settings Object

Upon change to any of the settings, it will save a settings object under the key `clbSingKSettings`. It should look like this:
```json
{ 
   "char": "char-simplified", 
   "pinyin": "pinyin-small", 
   "pinyinPref": "pinyin-pref-cn" 
}
```

Possible values for each setting:

- `char` to set what kind of character to display
  - `char-simplified` for simplified chinese (DEFAULT)
  - `char-traditional` for traditional chinese
  - This is working on the assumption that most (if not all) of the lyrics on spotify are in traditional chinese by default.
- `pinyin` to set the kind of pinyin to display
  - `pinyin-small` to display pinyin in a smaller font (DEFAULT)
  - `pinyin-reg` to display pinyin with the same size
  - `pinyin-disabled` to disable pinyin altogether
- `pinyinPref` to determine preference for pronunciation
  - `pinyin-pref-cn` for zh-Hans (CN)
  - `pinyin-pref-tw` for zh-Hant (TW)
  - If a song originates from taiwan, choosing TW would sound the most similar to the singer's pronunciation. (See [Settings](../README.md#settings) for more info.)

## Background Javascript

This plugin works by simply injecting some javascript files when the user has spotify's web player open, and manipulates the DOM to modify the text.

### Injected Javascript Files

There are 3 files injected:

- `background.js` that handles all the lyric conversion and rendering
- `t2s.js` stands for traditional-to-simplified, contains a mapping of traditional characters to simplified characters.
- `pinyin.js` contains a mapping of characters to their pinyin pronunciation
  - Where there are two pronunciations of the pinyin for the character, the values are delimited with a space
  - First value is zh-Hans, Second value is zh-Hant
  - Where there is only one value, it is used for both

### Spotify's web player

- Lyrics are stored as a child `<div>` element under another `<div>` element with a dataset tag: `data-testid="fullscreen-lyric"`
- All elements are held within a `<main>` element
- To detect when the page is ready, a MutationObserver is created to trigger `LoadSettings()` when it detects lyric elements.
  - This Mutation Observer is only used once at startup, and the observer disconnects once it is done
- To detect a change in song, a MutationObserver is used to watch the `<main>` element.
  - When a change is detected, the observer will disconnect
  - Lyrics are re-rendered
  - Observer is set to observe changes again
  - **Becareful with handling of the MutationObserver. Incorrect usage will lead to an infinite loop.**
- A chrome listener for settings is also initialsied, which processes the lyrics when there is a change in settings

### Conversion

Conversion is done by iterating through the lyric elements, and replacing the innerHTML with the converted string of the original lyrics.

To support re-rendering of the lyrics when the settings are changed, we cannot rely on the text in the innerHTML, and have to store it.

When lyrics are rendered, a dataset tag `lyricTag` is attached to the div delement.

- LyricTag is a generated UUID
- It is used as the key in lyricStorage which maps it to the lyric object

LyricStorage looks something like this:
```json
{
   "7dba83aa-4b4c-4c93-98e5-0b059c93cf5b": 
      {
         "originalText": "擠出的笑容 看起來好突兀", // Original text
         "simplfiedText": "挤出的笑容 看起来好突兀", // Simplified text
         "skipped": false, // true if original text has no chinese characters
      },
}
```

Conversion of Traditional to Simplified just gets the value from `t2s.js` using the tradtitional character as the key. Same as pinyin with `pinyin.js`.

- If pinyin-pref is set to zh-Hant (TW), it will get the pinyin using the `originalText`, and will use the 2nd pronunciation if available
- It will get pinyin using `simplifiedText` if set to zh-Hans (CN)
- Note that `t2s.js` and `pinyin.js` both expose a const object `tradToSimp` and `pinyin`. 
  - Make sure not to override these in `background.js`

## Unihan Converter

The converter is simply a js script `converter.js` that converts files from the unihan database into `t2s.js` and `pinyin.js` which are stored in the output.

To run:
```
node unihan-converter/converter.js 
```

This will convert the txt files and place the `t2s.js` and `pinyin.js` in to the `unihan-converter/Output` folder

For more info on unihan database:

- Simplified mapping data from [kSimplifiedVariant](https://www.unicode.org/reports/tr38/index.html#kSimplifiedVariant) in the Variants File. Additional information of `kSimplifiedVariant` and `kTraditionalVariant` is found [here](https://www.unicode.org/reports/tr38/index.html#SCTC)
- Pinyin data from [kMandarin](https://www.unicode.org/reports/tr38/index.html#kMandarin) in the Readings File

### Updating mapping data

1. Download `Unihan.zip` from [Unicode Character Database](https://www.unicode.org/Public/UCD/latest/ucd/)
2. Extract database txt files into `unihan-converter/Unihan`
3. Run the script with node:
   ```
   node unihan-converter/converter.js 
   ```
4. Copy `t2s.js` and `pinyin.js` from the `unihan-converter/Outputs` folder info the `Public` folder
5. Build the project
   ```
   npm run build
   ```

## Releasing

**Before release**

Bump up the version number in the `public/manifest.json`, and modify the version shield in `src/App.jsx`.

**Releasing**

Build the project, and zip up the `dist` folder contents.


## Potential Improvements

- Migrate to TypeScript 💀
- Modify vite config to build manifest.json, background.js, and t2s.js from src folder instead of the public folder.