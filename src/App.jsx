import { useEffect, useState } from 'react'
import './App.css'
import { SelectInput } from './SelectInput'

function App() {
  const charOptions = [{ title: "Simplified (简体)", value: "char-simplified" }, { title: "Traditional (繁體)", value: "char-traditional" }]
  const pinyinOptions = [{ title: "Small Font", value: "pinyin-small" }, { title: "Regular Font", value: "pinyin-reg" }, { title: "Disabled", value: "pinyin-disabled" }]
  const pinyinPrefOptions = [{ title: "zh-Hans (CN)", value: "pinyin-pref-cn" }, { title: "zh-Hant (TW)", value: "pinyin-pref-tw" }]

  const [charSetting, setCharSetting] = useState("char-simplified")
  const [pinyinSetting, setPinyinSetting] = useState("pinyin-small")
  const [pinyinPrefSetting, setPinyinPrefSetting] = useState("pinyin-pref-cn")

  useEffect(() => {
    console.log("Loading Settings for CLB Sing K")
    chrome.storage.sync.get('clbSingKSettings', (settings) => {
      settings = settings.clbSingKSettings;

      let loadedCharSetting = settings["char"] ? settings["char"] : "char-simplified";
      let loadedPinyinSetting = settings["pinyin"] ? settings["pinyin"] : "pinyin-small";
      let loadedPinyinPrefSetting = settings["pinyinPref"] ? settings["pinyinPref"] : "pinyin-pref-cn"

      setCharSetting(loadedCharSetting)
      setPinyinSetting(loadedPinyinSetting)
      setPinyinPrefSetting(loadedPinyinPrefSetting)
    })
  }, []);

  useEffect(() => {
    const settingObj = { char: charSetting, pinyin: pinyinSetting, pinyinPref: pinyinPrefSetting }
    chrome.storage.sync.set({ clbSingKSettings: settingObj })
  }, [charSetting, pinyinSetting, pinyinPrefSetting]);

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

      <hr />

      <p>Made with ❤️ by <a href='https://github.com/QixyQix' target='_blank'>Qi Xiang</a></p>
    </>
  )
}

export default App
