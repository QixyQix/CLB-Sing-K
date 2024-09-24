const CHAR_SIMPLIFIED = "char-simplified";
const CHAR_TRADITIONAL = "char-traditional";

const PINYIN_SMALL = "pinyin-small";
const PINYIN_REG = "pinyin-reg";
const PINYIN_DISABLED = "pinyin-disabled";

const PINYIN_PREF_CN = "pinyin-pref-cn";
const PINYIN_PREF_TW = "pinyin-pref-tw";

const lyricElementSelector = '[data-testid="fullscreen-lyric"]';
const overallParentSelector = 'main';

const settings = {
    char:  CHAR_SIMPLIFIED,
    pinyin: PINYIN_SMALL,
    pinyinPref: PINYIN_PREF_CN
}

let lyricStorage = {};

let overallParentDiv = undefined;

// Detect change in chrome settings storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.clbSingKSettings) {
        updateSettingsAndProcessLyrics(changes.clbSingKSettings.newValue)
    }
});

// Observe document changes till lyric elements can be found and is ready to go
const observer = new MutationObserver(() => {
    if (document.querySelector(lyricElementSelector)) {
        loadSettings();
        observer.disconnect()
    }
})
observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true })

// Observer for main element to detect changes in child elements to indicate change in song
const childListObserver = new MutationObserver((mutationList) => {
    for (let mutation of mutationList) {
        if (mutation.type === 'childList') {
            childListObserver.disconnect();
            processLyrics();
            break;
        }
    }
})

function loadSettings() {
    chrome.storage.sync.get('clbSingKSettings', (loadedSettings) => {
        updateSettingsAndProcessLyrics(loadedSettings["clbSingKSettings"]);
    });
}

function updateSettingsAndProcessLyrics(settingsObj) {
    if (!settingsObj) settingsObj = {};
    settings.char = settingsObj["char"] ? settingsObj["char"] :  CHAR_SIMPLIFIED;
    settings.pinyin = settingsObj["pinyin"] ? settingsObj["pinyin"] : PINYIN_SMALL;
    settings.pinyinPref = settingsObj["pinyinPref"] ? settingsObj["pinyinPref"] : PINYIN_PREF_CN;

    processLyrics();
}

function getOverallParentDiv() {
    if (overallParentDiv) return;
    overallParentDiv = document.querySelector(overallParentSelector);
}

function processLyrics() {
    getOverallParentDiv();

    const lyricElements = Array.from(document.querySelectorAll(lyricElementSelector))

    // Reset the lyric storage if there is a change in the number of lyric elements (most likely change in song)
    if (lyricElements.length !== Object.keys(lyricStorage).length) {
        lyricStorage = {};
    }

    for (let lyricElement of lyricElements) {
        // Use data attribute instead of creating custom tags to track the elements
        // https://stackoverflow.com/questions/32638521/can-i-use-a-custom-attribute-on-a-div
        const lyricTag = lyricElement.dataset.lyricTag ? lyricElement.dataset.lyricTag : crypto.randomUUID();
        lyricElement.dataset.lyricTag = lyricTag;

        const lyricTextDiv = lyricElement.childNodes[0];
        const originalLyricText = lyricTextDiv.innerText;

        const lyricData = lyricStorage[lyricTag] !== undefined ? lyricStorage[lyricTag] : convertTraditionalLyric(originalLyricText);

        if (!lyricStorage[lyricTag]) {
            lyricStorage[lyricTag] = lyricData;
        }

        if(lyricData.skipped){
            continue;
        }

        let innerHTMLforLyric = "";

        if (settings.pinyin !== PINYIN_DISABLED) {
            innerHTMLforLyric = settings.pinyinPref === PINYIN_PREF_TW ? getLyricPinyin(lyricData.originalText) : getLyricPinyin(lyricData.simplifiedText);

            if (settings.pinyin === PINYIN_SMALL) {
                innerHTMLforLyric = `<span style="font-size:1.4rem;line-height:0.5rem">${innerHTMLforLyric}</span>`
            }
            innerHTMLforLyric += "<br/>"
        }

        if (settings.char ===  CHAR_SIMPLIFIED) {
            innerHTMLforLyric += lyricData.simplifiedText;
        } else {
            innerHTMLforLyric += lyricData.originalText;
        }

        lyricTextDiv.innerHTML = innerHTMLforLyric;

    }

    if (overallParentDiv) {
        childListObserver.observe(overallParentDiv, { attributes: false, childList: true, characterData: false, subtree: true })
    }
}

function convertTraditionalLyric(originalText) {
    if (!containsChineseCharacters(originalText)) {
        return { originalText, simplifiedText: "", skipped: true }
    }

    let simplifiedText = "";
    for (let char of originalText) {
        simplifiedText += tradToSimp[char] ? tradToSimp[char] : char;
    }

    return { originalText, simplifiedText, skipped: false }
}

function containsChineseCharacters(str) {
    const chineseCharRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/;
    return chineseCharRegex.test(str);
}

function getLyricPinyin(lyricText) {
    let pinyinText = "";

    for (let char of lyricText) {
        if (!pinyin[char]) {
            pinyinText += char.toUpperCase();
        } else {
            let possiblePinyins = pinyin[char].split(" ");
            pinyinText += (settings.pinyinPref === PINYIN_PREF_TW && possiblePinyins.length > 1) ? ` ${possiblePinyins[1]} ` : ` ${possiblePinyins[0]} `;
        }
    }

    return pinyinText;
}