const lyricElementSelector = '[data-testid="fullscreen-lyric"]';
let overallParentDiv = undefined;


const observer = new MutationObserver(() => {
    if (document.querySelector(lyricElementSelector)) {
        console.log('Lyric elements found')
        init();
        observer.disconnect()
    }
})
observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true })

const childListObserver = new MutationObserver((mutationList) => {
    for(let mutation of mutationList){
        if (mutation.type === 'childList'){
            childListObserver.disconnect();
            init()
            break;
        }
    }
})

function init() {
    const lyricElements = Array.from(document.querySelectorAll(lyricElementSelector))
    if(!overallParentDiv){
        overallParentDiv = lyricElements[0].parentNode.parentNode.parentNode.parentNode;
        console.log("Parent Node:")
        console.dir(overallParentDiv);
    }
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


        // console.log(lyricText);
        // console.log(simplifiedText);
        // console.log(pinyinText);
        // console.log("---");
    }
    if(overallParentDiv){
        childListObserver.observe(overallParentDiv, { attributes: false, childList: true, characterData: false, subtree: true })
    }
    console.log('Lyrics Initialised')
}