import { useState } from 'react'
import './App.css'

function App() {
  return (
    <>
      <h1>我也要唱K</h1>
      <h2>CLB Sing K</h2>
      <p>Chrome extension to convert traditional chinese lyrics to simplified chinese, and provide pīnyīn, for Spotify's web player</p>

      <hr/>
      <h3>Settings</h3>
      <div>
        <div>
          <label for="char-setting">Chinese Character</label>
          <select name="char-setting" id="char-setting" required="required" aria-required="true">
            <option value="char-simplified" selected="true" id="char-setting-0">Simplified (简体)</option>
            <option value="char-traditional" id="char-setting-1">Traditional (繁體)</option>
          </select>
        </div>
        <div>
          <label for="pinyin-setting">Pinyin</label>
          <select name="pinyin-setting" id="pinyin-setting" required="required" aria-required="true">
            <option value="pinyin-small" selected="true" id="pinyin-setting-0">Small Size</option>
            <option value="pinyin-reg" id="pinyin-setting-1">Regular Size</option>
            <option value="pinyin-disabled" id="pinyin-setting-2">Disabled</option>
          </select>
        </div>
        <div>
          <label for="pinyin-pref-setting">Pinyin Preference</label>
          <select name="pinyin-pref-setting" id="pinyin-pref-setting" required="required" aria-required="true">
            <option value="pinyin-pref-cn" selected="true" id="pinyin-pref-setting-0">zh-Hans (CN)</option>
            <option value="pinyin-pref-tw" id="pinyin-pref-setting-1">zh-Hant (TW)</option>
          </select>
        </div>
      </div>

      <hr/>

      <p>Made with ❤️ by <a href='https://github.com/QixyQix' target='_blank'>Qi Xiang</a></p>

    </>
  )
}

export default App
