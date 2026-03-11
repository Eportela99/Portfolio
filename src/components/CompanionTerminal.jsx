import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react'
import './CompanionTerminal.css'

const INTRO = [
  { text: 'EN-01:~ $ ./greet.sh', speed: 55, pause: 500 },
  { text: '', pause: 200 },
  { text: "Hey! I'm EN-01 👋", speed: 50, pause: 350 },
  { text: "Enrique's digital assistant.", speed: 48, pause: 300 },
  { text: '', pause: 150 },
  { text: 'He builds full-stack apps,', speed: 44, pause: 200 },
  { text: 'manages IT infrastructure,', speed: 44, pause: 200 },
  { text: 'and occasionally lets me', speed: 44, pause: 200 },
  { text: 'out of my terminal. 🙂', speed: 48, pause: 450 },
  { text: '', pause: 150 },
  { text: 'Scroll down to see his work ↓', speed: 44, pause: 0 },
]

const CompanionTerminal = forwardRef(function CompanionTerminal({ onClose, onTypingChange }, ref) {
  const [lines,   setLines]   = useState([])
  const [current, setCurrent] = useState('')

  const queueRef     = useRef([...INTRO])
  const timeoutRef   = useRef(null)
  const runningRef   = useRef(false)
  const onTypingRef  = useRef(onTypingChange)
  const bodyRef      = useRef(null)

  useEffect(() => { onTypingRef.current = onTypingChange }, [onTypingChange])

  const processNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      onTypingRef.current(false)
      runningRef.current = false
      return
    }

    runningRef.current = true
    const item = queueRef.current.shift()

    if (!item.text) {
      onTypingRef.current(false)
      setLines(prev => [...prev, ''])
      timeoutRef.current = setTimeout(processNext, item.pause ?? 300)
      return
    }

    let idx = 0
    const typeChar = () => {
      if (idx < item.text.length) {
        onTypingRef.current(true)
        setCurrent(item.text.slice(0, idx + 1))
        idx++
        timeoutRef.current = setTimeout(typeChar, item.speed ?? 50)
      } else {
        onTypingRef.current(false)
        setLines(prev => [...prev, item.text])
        setCurrent('')
        timeoutRef.current = setTimeout(processNext, item.pause ?? 300)
      }
    }
    typeChar()
  }, [])

  // Start on mount
  useEffect(() => {
    timeoutRef.current = setTimeout(processNext, 350)
    return () => clearTimeout(timeoutRef.current)
  }, [processNext])

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines, current])

  useImperativeHandle(ref, () => ({
    appendLines(newLines) {
      newLines.forEach(text => queueRef.current.push({ text, speed: 48, pause: 350 }))
      if (!runningRef.current) {
        timeoutRef.current = setTimeout(processNext, 400)
      }
    },
  }))

  return (
    <div className="companion-terminal">
      <div className="ct-titlebar">
        <span className="ct-dot ct-red"    />
        <span className="ct-dot ct-yellow" />
        <span className="ct-dot ct-green"  />
        <span className="ct-title">EN-01 v1.0</span>
        <button className="ct-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="ct-body" ref={bodyRef}>
        {lines.map((line, i) => (
          <div key={i} className={`ct-line${line.startsWith('EN-01:~ $') ? ' ct-cmd' : ''}`}>
            {line}
          </div>
        ))}
        {current && (
          <div className="ct-line">
            {current}<span className="ct-cursor">▋</span>
          </div>
        )}
        {!current && (
          <span className="ct-cursor ct-idle">▋</span>
        )}
      </div>
    </div>
  )
})

export default CompanionTerminal
