import { useEffect, useRef } from 'react'
import './Skills.css'
import ollamaIcon from '../assets/ollama.png'
import n8nIcon from '../assets/n8n-color.png'

const INNER_SKILLS = [
  { name: 'React',      icon: 'devicon-react-original colored' },
  { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
  { name: 'Node.js',    icon: 'devicon-nodejs-plain colored' },
  { name: 'Python',     icon: 'devicon-python-plain colored' },
  { name: 'Go',         icon: 'devicon-go-plain colored' },
  { name: 'Docker',     icon: 'devicon-docker-plain colored' },
  { name: 'Linux',      icon: 'devicon-linux-plain colored' },
]

const OUTER_SKILLS = [
  { name: 'Azure',      icon: 'devicon-azure-plain colored' },
  { name: 'Swift',      icon: 'devicon-swift-plain colored' },
  { name: 'Java',       icon: 'devicon-java-plain colored' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
  { name: 'Git',        icon: 'devicon-git-plain colored' },
  { name: 'HTML',       icon: 'devicon-html5-plain colored' },
  { name: 'CSS',        icon: 'devicon-css3-plain colored' },
  { name: 'Blender',    icon: 'devicon-blender-original colored' },
  { name: 'n8n',        img: n8nIcon },
  { name: 'Ollama',     img: ollamaIcon },
]

const INNER_R = 148
const OUTER_R = 235
const INNER_SPD = 0.00016
const OUTER_SPD = 0.00009

export default function Skills() {
  const innerRefs = useRef([])
  const outerRefs = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    let start = null

    const tick = (time) => {
      if (!start) start = time
      const elapsed = time - start

      innerRefs.current.forEach((el, i) => {
        if (!el) return
        const angle = (i / INNER_SKILLS.length) * Math.PI * 2 + elapsed * INNER_SPD
        const x = Math.cos(angle) * INNER_R
        const y = Math.sin(angle) * INNER_R
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
      })

      outerRefs.current.forEach((el, i) => {
        if (!el) return
        const angle = (i / OUTER_SKILLS.length) * Math.PI * 2 - elapsed * OUTER_SPD
        const x = Math.cos(angle) * OUTER_R
        const y = Math.sin(angle) * OUTER_R
        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
      })

      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [])

  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">Tech <span className="neon-text">Stack</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">Technologies I work with</p>
        </div>

        <div className="sk-orbit-scene fade-in">
          <div className="sk-track sk-track-inner" />
          <div className="sk-track sk-track-outer" />

          <div className="sk-center">
            <span className="sk-center-code">&lt;/&gt;</span>
          </div>

          {INNER_SKILLS.map((skill, i) => (
            <div key={skill.name} className="sk-orb-item" ref={el => innerRefs.current[i] = el}>
              {skill.icon
                ? <i className={`${skill.icon} sk-orb-icon`} />
                : <img src={skill.img} alt={skill.name} className="sk-orb-img" />
              }
              <span className="sk-orb-name">{skill.name}</span>
            </div>
          ))}

          {OUTER_SKILLS.map((skill, i) => (
            <div key={skill.name} className="sk-orb-item" ref={el => outerRefs.current[i] = el}>
              {skill.icon
                ? <i className={`${skill.icon} sk-orb-icon`} />
                : <img src={skill.img} alt={skill.name} className="sk-orb-img" />
              }
              <span className="sk-orb-name">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
