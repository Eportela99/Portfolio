import { useEffect, useState } from 'react'
import './CodeAvatar.css'

const sequence = [
  { type: 'cmd',        text: 'whoami' },
  { type: 'out-name',   text: 'enrique.portela' },
  { type: 'cmd',        text: 'cat role.txt' },
  { type: 'out',        text: 'Full Stack Developer' },
  { type: 'cmd',        text: 'ls skills/' },
  { type: 'out',        text: 'React  Node.js  Python' },
  { type: 'out',        text: 'Docker  Azure  Linux' },
  { type: 'cmd',        text: './status.sh' },
  { type: 'out-status', text: '● Open to work' },
]

export default function CodeAvatar() {
  const [visibleLines, setVisibleLines] = useState([])
  const [typing, setTyping] = useState('')

  useEffect(() => {
    const timeouts = []
    const t = (fn, delay) => timeouts.push(setTimeout(fn, delay))

    function run() {
      setVisibleLines([])
      setTyping('')
      let delay = 600

      for (const item of sequence) {
        if (item.type === 'cmd') {
          for (let i = 1; i <= item.text.length; i++) {
            const s = item.text.slice(0, i)
            t(() => setTyping(s), delay + i * 65)
          }
          delay += item.text.length * 65 + 350
          const snap = item
          t(() => {
            setVisibleLines(prev => [...prev, snap])
            setTyping('')
          }, delay)
          delay += 150
        } else {
          const snap = item
          t(() => setVisibleLines(prev => [...prev, snap]), delay + 250)
          delay += 380
        }
      }

      t(run, delay + 2800)
    }

    run()
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div className="ca-wrapper">
      <div className="code-avatar">
        <div className="ca-header">
          <div className="ca-dots">
            <span className="ca-dot" style={{ background: '#ff5f57' }} />
            <span className="ca-dot" style={{ background: '#febc2e' }} />
            <span className="ca-dot" style={{ background: '#28c840' }} />
          </div>
          <span className="ca-title">enrique@portfolio: ~</span>
        </div>

        <div className="ca-body">
          {visibleLines.map((line, i) => (
            <div key={i} className={`ca-line ca-${line.type}`}>
              {line.type === 'cmd' && <span className="ca-prompt">❯</span>}
              <span className="ca-text">{line.text}</span>
            </div>
          ))}
          <div className="ca-line ca-cmd">
            <span className="ca-prompt">❯</span>
            <span className="ca-text">{typing}</span>
            <span className="ca-cursor" />
          </div>
        </div>

        <div className="ca-scanlines" />
      </div>
    </div>
  )
}
