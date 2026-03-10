import './Skills.css'
import ollamaIcon from '../assets/ollama.png'
import n8nIcon from '../assets/n8n-color.png'

const INNER_SKILLS = [
  { name: 'React',      icon: 'devicon-react-original colored',   sub: 'Hooks · Vite · Router' },
  { name: 'TypeScript', icon: 'devicon-typescript-plain colored', sub: 'Generics · Types' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain colored', sub: 'ES2024 · Async · DOM' },
  { name: 'Node.js',    icon: 'devicon-nodejs-plain colored',     sub: 'Express · REST · npm' },
  { name: 'Python',     icon: 'devicon-python-plain colored',     sub: 'Scripts · Automation' },
  { name: 'Go',         icon: 'devicon-go-plain colored',         sub: 'Gin · REST · WebSockets' },
  { name: 'Docker',     icon: 'devicon-docker-plain colored',     sub: 'Compose · Images' },
  { name: 'Linux',      icon: 'devicon-linux-plain colored',      sub: 'Bash · Ubuntu' },
]

const OUTER_SKILLS = [
  { name: 'Azure',      icon: 'devicon-azure-plain colored',      sub: 'VMs · Active Directory' },
  { name: 'Swift',      icon: 'devicon-swift-plain colored',      sub: 'SwiftUI · MVVM · iOS' },
  { name: 'Java',       icon: 'devicon-java-plain colored',       sub: 'OOP · Spring' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored', sub: 'CRUD · Migrations' },
  { name: 'Git',        icon: 'devicon-git-plain colored',        sub: 'GitHub · CI/CD' },
  { name: 'HTML',       icon: 'devicon-html5-plain colored',      sub: 'Semantic · A11y' },
  { name: 'CSS',        icon: 'devicon-css3-plain colored',       sub: 'Flexbox · Grid' },
  { name: 'Blender',    icon: 'devicon-blender-original colored', sub: '3D · Modeling' },
  { name: 'n8n',        img: n8nIcon,                             sub: 'Automation · Workflows' },
  { name: 'Ollama',     img: ollamaIcon,                          sub: 'Local AI · LLMs' },
]

// Inner ring: evenly spaced, starting from top
// Outer ring: offset by half a step so outer badges fill the gaps between inner ones
function buildRing(skills, radius, angleOffset = 0) {
  return skills.map((skill, i) => {
    const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2 + angleOffset
    return {
      ...skill,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  })
}

const innerItems = buildRing(INNER_SKILLS, 195)
const outerItems = buildRing(OUTER_SKILLS, 330, Math.PI / OUTER_SKILLS.length)

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">Tech <span className="neon-text">Stack</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">Technologies I work with</p>
        </div>

        {/* Mobile grid */}
        <div className="sk-mobile-grid fade-in">
          {[...INNER_SKILLS, ...OUTER_SKILLS].map(skill => (
            <div key={skill.name} className="sk-badge-card">
              {skill.icon
                ? <i className={`${skill.icon} sk-badge-icon`} />
                : <img src={skill.img} alt={skill.name} className="sk-badge-img" />
              }
              <div className="sk-badge-info">
                <span className="sk-badge-name">{skill.name}</span>
                <span className="sk-badge-sub">{skill.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop scene */}
        <div className="sk-scene fade-in">

          {/* Center circle */}
          <div className="sk-center">
            <div className="sk-center-pulse" />
            <span className="sk-center-code">&lt;/&gt;</span>
          </div>

          {/* Inner ring badges */}
          {innerItems.map((skill, i) => (
            <div
              key={skill.name}
              className="sk-anchor"
              style={{ left: `calc(50% + ${skill.x}px)`, top: `calc(50% + ${skill.y}px)` }}
            >
              <div className="sk-badge-card" style={{ animationDelay: `${i * 0.42}s` }}>
                {skill.icon
                  ? <i className={`${skill.icon} sk-badge-icon`} />
                  : <img src={skill.img} alt={skill.name} className="sk-badge-img" />
                }
                <div className="sk-badge-info">
                  <span className="sk-badge-name">{skill.name}</span>
                  <span className="sk-badge-sub">{skill.sub}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Outer ring badges */}
          {outerItems.map((skill, i) => (
            <div
              key={skill.name}
              className="sk-anchor"
              style={{ left: `calc(50% + ${skill.x}px)`, top: `calc(50% + ${skill.y}px)` }}
            >
              <div className="sk-badge-card" style={{ animationDelay: `${(i + 3) * 0.38}s` }}>
                {skill.icon
                  ? <i className={`${skill.icon} sk-badge-icon`} />
                  : <img src={skill.img} alt={skill.name} className="sk-badge-img" />
                }
                <div className="sk-badge-info">
                  <span className="sk-badge-name">{skill.name}</span>
                  <span className="sk-badge-sub">{skill.sub}</span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
