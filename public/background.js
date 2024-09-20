const lyricElementSelector = '[data-testid="fullscreen-lyric"]';

const observer = new MutationObserver(() => {
    if (document.querySelector(lyricElementSelector)) {
        console.log('Lyric elements found')
        init();
        observer.disconnect()
    }
})
observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true })

function init() {
    const lyricElements = Array.from(document.querySelectorAll(lyricElementSelector))
    for (let lyricElement of lyricElements) {

        let lyricTextDiv = lyricElement.childNodes[0];

        let lyricText = lyricTextDiv.innerText;

        let simplifiedText = "";
        let pinyinText = "";

        for (let char of lyricText) {
            simplifiedText += tradToSimp[char] ? tradToSimp[char] : char;
            pinyinText += pinyin[char] ? `${pinyin[char]} ` : " ";
        }

        lyricTextDiv.innerHTML = pinyinText.trim() !== "" ? `<span style="font-size:1.4rem;line-height:0.5rem">${pinyinText}</span><br/>${simplifiedText}` :  simplifiedText;


        console.log(lyricText);
        console.log(simplifiedText);
        console.log(pinyinText);
        console.log("---");
    }
}