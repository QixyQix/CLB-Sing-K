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
    for(let lyricElement of lyricElements){
        let lyricTextDiv = lyricElement.childNodes[0]
        let lyricText = lyricTextDiv.innerText
        let simplifiedText = ""
        for(let char of lyricText){
            simplifiedText += tradToSimp[char] ? tradToSimp[char] : char
        }
        console.log(lyricTextDiv.innerText)
        lyricTextDiv.innerText = simplifiedText;
        console.log(lyricTextDiv.innerText)
        console.log("---")
    }
}