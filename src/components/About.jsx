import { useEffect, useState } from 'react'
import './About.css'

const SEQUENCE = [
  { type: 'cmd',   text: 'cat profile.txt' },
  { type: 'kv',    key: 'experience', val: '5+ years in IT & Software Development' },
  { type: 'kv',    key: 'education',  val: 'B.Sc. Computer Science' },
  { type: 'blank' },
  { type: 'cmd',   text: 'ls certifications/' },
  { type: 'cert',  text: 'CompTIA A+ Certified' },
  { type: 'cert',  text: 'Windows Fundamentals Certified' },
  { type: 'cert',  text: 'Adobe Photoshop CS6 Certified' },
  { type: 'cert',  text: 'Adobe Illustrator CS6 Certified' },
]

function AboutTerminal() {
  const [lines, setLines] = useState([])
  const [typing, setTyping] = useState('')

  useEffect(() => {
    const timeouts = []
    const t = (fn, delay) => timeouts.push(setTimeout(fn, delay))

    function run() {
      let delay = 500

      for (const item of SEQUENCE) {
        if (item.type === 'cmd') {
          for (let i = 1; i <= item.text.length; i++) {
            const s = item.text.slice(0, i)
            t(() => setTyping(s), delay + i * 90)
          }
          delay += item.text.length * 90 + 500
          const snap = item
          t(() => { setLines(prev => [...prev, snap]); setTyping('') }, delay)
          delay += 200
        } else {
          const snap = item
          t(() => setLines(prev => [...prev, snap]), delay + 400)
          delay += 550
        }
      }

      // hide cursor at the end
      t(() => setTyping(null), delay + 600)
    }

    run()
    return () => timeouts.forEach(clearTimeout)
  }, [])

  return (
    <div className="ab-terminal">
      <div className="ab-term-bar">
        <div className="ab-term-dots">
          <span className="ab-dot" style={{ background: '#ff5f57' }} />
          <span className="ab-dot" style={{ background: '#febc2e' }} />
          <span className="ab-dot" style={{ background: '#28c840' }} />
        </div>
        <span className="ab-term-title">enrique@portfolio: ~</span>
      </div>

      <div className="ab-term-body">
        {lines.map((line, i) => {
          if (line.type === 'blank') return <div key={i} className="ab-blank" />

          if (line.type === 'cmd') return (
            <div key={i} className="ab-line">
              <span className="ab-prompt">❯</span>
              <span className="ab-cmd-text">{line.text}</span>
            </div>
          )

          if (line.type === 'kv') return (
            <div key={i} className="ab-line ab-indent">
              <span className="ab-key">{line.key}:</span>
              <span className="ab-val">{line.val}</span>
            </div>
          )

          if (line.type === 'cert') return (
            <div key={i} className="ab-line ab-indent">
              <span className="ab-check">✓</span>
              <span className="ab-cert-text">{line.text}</span>
            </div>
          )

          return null
        })}

        {/* Active typing line — hidden once animation completes */}
        {typing !== null && (
          <div className="ab-line">
            <span className="ab-prompt">❯</span>
            <span className="ab-cmd-text">{typing}</span>
            <span className="ab-cursor" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">About <span className="neon-text">Me</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">A little about who I am and what I do</p>
        </div>

        <div className="about-grid">
          <div className="about-text fade-in">
            <h3 className="about-heading">
              Passionate developer building the future, one line at a time.
            </h3>
            <p>
              I&apos;m a full stack developer and IT professional with a passion for creating beautiful,
              functional, and user-centered digital experiences. With a strong foundation in modern
              web technologies and hands-on IT support, I bring ideas to life through clean and
              efficient code.
            </p>
            <p>
              When I&apos;m not coding, you can find me exploring new technologies, tinkering with
              homelab projects, or experimenting with the latest design trends.
            </p>
          </div>

          <div className="about-terminal-wrap fade-in">
            <AboutTerminal />
          </div>
        </div>
      </div>
    </section>
  )
}
