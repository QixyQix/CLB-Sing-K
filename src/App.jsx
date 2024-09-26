import { useEffect, useState, useRef } from 'react'
import './App.css'
import { SelectInput } from './SelectInput'

const CHAR_SIMPLIFIED = "char-simplified";
const CHAR_TRADITIONAL = "char-traditional";

const PINYIN_SMALL = "pinyin-small";
const PINYIN_REG = "pinyin-reg";
const PINYIN_DISABLED = "pinyin-disabled";

const PINYIN_PREF_CN = "pinyin-pref-cn";
const PINYIN_PREF_TW = "pinyin-pref-tw";

function App() {
  const initialMount = useRef(true);

  const charOptions = [{ title: "Simplified (简体)", value: CHAR_SIMPLIFIED }, { title: "Traditional (繁體)", value: CHAR_TRADITIONAL }]
  const pinyinOptions = [{ title: "Small Font", value: PINYIN_SMALL }, { title: "Regular Font", value: PINYIN_REG }, { title: "Disabled", value: PINYIN_DISABLED }]
  const pinyinPrefOptions = [{ title: "zh-Hans (CN)", value: PINYIN_PREF_CN }, { title: "zh-Hant (TW)", value: PINYIN_PREF_TW }]

  const [charSetting, setCharSetting] = useState(CHAR_SIMPLIFIED)
  const [pinyinSetting, setPinyinSetting] = useState(PINYIN_SMALL)
  const [pinyinPrefSetting, setPinyinPrefSetting] = useState(PINYIN_PREF_CN)

  useEffect(() => {
    console.log("Loading Settings for CLB Sing K")
    chrome.storage.sync.get('clbSingKSettings', (settings) => {
      settings = settings.clbSingKSettings;

      let loadedCharSetting = settings["char"] ? settings["char"] : CHAR_SIMPLIFIED;
      let loadedPinyinSetting = settings["pinyin"] ? settings["pinyin"] : PINYIN_SMALL;
      let loadedPinyinPrefSetting = settings["pinyinPref"] ? settings["pinyinPref"] : PINYIN_PREF_CN

      setCharSetting(loadedCharSetting)
      setPinyinSetting(loadedPinyinSetting)
      setPinyinPrefSetting(loadedPinyinPrefSetting)
    })
  }, []);

  useEffect(() => {
    if(initialMount.current){
      initialMount.current = false;
      return;
    }
    const settingObj = { char: charSetting, pinyin: pinyinSetting, pinyinPref: pinyinPrefSetting }
    chrome.storage.sync.set({ clbSingKSettings: settingObj })
  }, [charSetting, pinyinSetting, pinyinPrefSetting]);

  function judgeUser(){
    if(charSetting === CHAR_SIMPLIFIED && pinyinSetting !== PINYIN_DISABLED) return "You probably went to CLB.";
    if(charSetting === CHAR_SIMPLIFIED && pinyinSetting === PINYIN_DISABLED) return "Wow... 高级华文 。";
    if(charSetting === CHAR_TRADITIONAL && pinyinSetting !== PINYIN_DISABLED) return "I see you're a traditionalist.";
    if(charSetting === CHAR_TRADITIONAL && pinyinSetting === PINYIN_DISABLED) return "Why do you even have this extension installed?";
  }

  return (
    <>
      <h1>我也要唱K</h1>
      <h2>CLB Sing K</h2>
      <p>Chrome extension to convert traditional chinese lyrics to simplified chinese, and provide pīnyīn, for Spotify's web player</p>

      <hr />

      <h3>Settings</h3>
      <form className='form-centered'>
        <SelectInput value={charSetting} onChange={setCharSetting} label="Chinese Character" options={charOptions} valueKey="value" displayKey="title" />
        <SelectInput value={pinyinSetting} onChange={setPinyinSetting} label="Pinyin" options={pinyinOptions} valueKey="value" displayKey="title" />
        <SelectInput value={pinyinPrefSetting} onChange={setPinyinPrefSetting} label="Pinyin Preference" options={pinyinPrefOptions} valueKey="value" displayKey="title" />
      </form>

      <p>{judgeUser()}</p>

      <hr />

      <p>Made with ❤️ by Qi Xiang</p>
      <a href='https://github.com/QixyQix/CLB-Sing-K' target='_blank'><i className='githubIcon'/></a>
    </>
  )
}

export default App
