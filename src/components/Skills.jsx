import './Skills.css'
import ollamaIcon from '../assets/ollama.png'
import n8nIcon    from '../assets/n8n-color.png'

// Three rows — each scrolls at a different speed and direction
const ROW1 = [
  { name: 'React',      icon: 'devicon-react-original colored' },
  { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
  { name: 'HTML',       icon: 'devicon-html5-plain colored' },
  { name: 'CSS',        icon: 'devicon-css3-plain colored' },
  { name: 'Swift',      icon: 'devicon-swift-plain colored' },
  { name: 'Node.js',    icon: 'devicon-nodejs-plain colored' },
  { name: 'Python',     icon: 'devicon-python-plain colored' },
]

const ROW2 = [
  { name: 'Go',               icon: 'devicon-go-plain colored' },
  { name: 'Java',             icon: 'devicon-java-plain colored' },
  { name: 'PostgreSQL',       icon: 'devicon-postgresql-plain colored' },
  { name: 'SQL Server',       icon: 'devicon-microsoftsqlserver-plain colored' },
  { name: 'Docker',           icon: 'devicon-docker-plain colored' },
  { name: 'Linux',            icon: 'devicon-linux-plain colored' },
  { name: 'Azure',            icon: 'devicon-azure-plain colored' },
  { name: 'Git',              icon: 'devicon-git-plain colored' },
]

const ROW3 = [
  { name: 'Windows Server',   icon:  'devicon-windows8-original colored' },
  { name: 'PowerShell',       icon:  'devicon-powershell-plain colored' },
  { name: 'Active Directory', emoji: '🗂' },
  { name: 'Networking',       emoji: '🌐' },
  { name: 'Blender',          icon:  'devicon-blender-original colored' },
  { name: 'n8n',              img:   n8nIcon },
  { name: 'Ollama',           img:   ollamaIcon },
  { name: 'Nginx',            icon:  'devicon-nginx-original colored' },
]

function SkillBadge({ skill }) {
  return (
    <div className="sk-badge">
      {skill.icon
        ? <i className={`${skill.icon} sk-badge-icon`} />
        : skill.img
          ? <img src={skill.img} alt={skill.name} className="sk-badge-img" />
          : <span className="sk-badge-emoji">{skill.emoji}</span>
      }
      <span className="sk-badge-name">{skill.name}</span>
    </div>
  )
}

function MarqueeRow({ skills, reverse = false, duration = '30s' }) {
  // Duplicate for seamless loop
  const items = [...skills, ...skills]
  return (
    <div className="sk-marquee-row">
      <div
        className={`sk-marquee-track ${reverse ? 'sk-marquee-reverse' : ''}`}
        style={{ animationDuration: duration }}
      >
        {items.map((skill, i) => (
          <SkillBadge key={`${skill.name}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">Tech <span className="neon-text">Stack</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">Technologies I work with</p>
        </div>
      </div>

      {/* Marquee rows — full bleed, outside container */}
      <div className="sk-marquee-wrap fade-in">
        <MarqueeRow skills={ROW1} reverse={false} duration="35s" />
        <MarqueeRow skills={ROW2} reverse={true}  duration="28s" />
        <MarqueeRow skills={ROW3} reverse={false} duration="32s" />
      </div>
    </section>
  )
}
