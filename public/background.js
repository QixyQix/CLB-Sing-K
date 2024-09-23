const lyricElementSelector = '[data-testid="fullscreen-lyric"]';
const overallParentSelector = 'main';

const settings = {
    char: "char-simplified",
    pinyin: "pinyin-small",
    pinyinPref: "pinyin-pref-cn"
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
    settings.char = settingsObj["char"] ? settingsObj["char"] : "char-simplified";
    settings.pinyin = settingsObj["pinyin"] ? settingsObj["pinyin"] : "pinyin-small";
    settings.pinyinPref = settingsObj["pinyinPref"] ? settingsObj["pinyinPref"] : "pinyin-pref-cn";

    console.log("Settings updated");
    console.dir(settings);
    processLyrics();
}

function getOverallParentDiv() {
    if (overallParentDiv) return;
    overallParentDiv = document.querySelector(overallParentSelector);
    console.log("Parent Node:")
    console.dir(overallParentDiv);
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

        let innerHTMLforLyric = "";

        if (settings.pinyin !== "pinyin-disabled") {
            innerHTMLforLyric = lyricData.pinyinText;

            if (settings.pinyin === "pinyin-small") {
                innerHTMLforLyric = `<span style="font-size:1.4rem;line-height:0.5rem">${innerHTMLforLyric}</span>`
            }
            innerHTMLforLyric += "<br/>"
        }

        if (settings.char === "char-simplified") {
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
    let simplifiedText = "";
    let pinyinText = "";

    for (let char of originalText) {
        simplifiedText += tradToSimp[char] ? tradToSimp[char] : char;
        pinyinText += pinyin[char] ? ` ${pinyin[char]} ` : char.toUpperCase();
    }

    return { originalText, simplifiedText, pinyinText }

}