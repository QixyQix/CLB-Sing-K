import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>我也要唱K</h1>
      <h2>CLB Sing K</h2>
      <p>Chrome extension to covnert traditional chinese lyrics to simplified chinese, and provide pinyin romanization</p>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
