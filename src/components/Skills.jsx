import { useEffect, useRef, useState } from 'react'
import './Skills.css'
import ollamaIcon from '../assets/ollama.png'
import n8nIcon    from '../assets/n8n-color.png'

const CATEGORIES = [
  {
    title:  'Frontend',
    tag:    'UI',
    accent: '#00d4ff',
    skills: [
      { name: 'React',      icon: 'devicon-react-original colored' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
      { name: 'HTML',       icon: 'devicon-html5-plain colored' },
      { name: 'CSS',        icon: 'devicon-css3-plain colored' },
      { name: 'Swift',      icon: 'devicon-swift-plain colored' },
    ],
  },
  {
    title:  'Backend',
    tag:    'SRV',
    accent: '#a78bfa',
    skills: [
      { name: 'Node.js',    icon: 'devicon-nodejs-plain colored' },
      { name: 'Python',     icon: 'devicon-python-plain colored' },
      { name: 'Go',         icon: 'devicon-go-plain colored' },
      { name: 'Java',       icon: 'devicon-java-plain colored' },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
      { name: 'SQL Server', icon: 'devicon-microsoftsqlserver-plain colored' },
    ],
  },
  {
    title:  'Infrastructure',
    tag:    'OPS',
    accent: '#60a5fa',
    skills: [
      { name: 'Docker',  icon: 'devicon-docker-plain colored' },
      { name: 'Linux',   icon: 'devicon-linux-plain colored' },
      { name: 'Azure',   icon: 'devicon-azure-plain colored' },
      { name: 'Git',     icon: 'devicon-git-plain colored' },
      { name: 'Windows', icon: 'devicon-windows8-original colored' },
    ],
  },
  {
    title:  'Tools & AI',
    tag:    'EXT',
    accent: '#34d399',
    skills: [
      { name: 'Blender', icon: 'devicon-blender-original colored' },
      { name: 'n8n',     img:  n8nIcon },
      { name: 'Ollama',  img:  ollamaIcon },
    ],
  },
]

export default function Skills() {
  const gridRef = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    if (gridRef.current) observer.observe(gridRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title sk-title" data-text="Tech Stack">
            Tech <span className="neon-text">Stack</span>
          </h2>
          <div className="section-divider" />
          <p className="section-subtitle">Technologies I work with</p>
        </div>

        <div ref={gridRef} className={`sk-grid ${revealed ? 'sk-grid--revealed' : ''}`}>
          {CATEGORIES.map((cat, idx) => (
            <div
              key={cat.title}
              className="sk-panel"
              style={{ '--accent': cat.accent, '--idx': idx }}
            >
              {/* Corner accents */}
              <div className="sk-corner sk-corner--tl" />
              <div className="sk-corner sk-corner--br" />

              {/* Header */}
              <div className="sk-panel-header">
                <span className="sk-panel-tag">{cat.tag}</span>
                <span className="sk-panel-title">{cat.title}</span>
                <span className="sk-panel-count">{cat.skills.length}</span>
              </div>

              {/* Circuit divider */}
              <div className="sk-circuit-line">
                <span className="sk-circuit-dot" />
              </div>

              {/* Skill items */}
              <div className="sk-items">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="sk-item">
                    <div className="sk-item-icon">
                      {skill.icon
                        ? <i className={skill.icon} />
                        : <img src={skill.img} alt={skill.name} />
                      }
                    </div>
                    <span className="sk-item-name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
