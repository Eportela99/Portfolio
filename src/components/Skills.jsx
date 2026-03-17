import './Skills.css'
import ollamaIcon from '../assets/ollama.png'
import n8nIcon    from '../assets/n8n-color.png'

const CATEGORIES = [
  {
    title:  'Frontend',
    icon:   '🖥',
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
    icon:   '⚙️',
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
    icon:   '🏗',
    accent: '#60a5fa',
    skills: [
      { name: 'Docker',           icon:  'devicon-docker-plain colored' },
      { name: 'Linux',            icon:  'devicon-linux-plain colored' },
      { name: 'Azure',            icon:  'devicon-azure-plain colored' },
      { name: 'Git',              icon:  'devicon-git-plain colored' },
      { name: 'Windows Server',   icon:  'devicon-windows8-original colored' },
      { name: 'Active Directory', emoji: '🗂' },
      { name: 'PowerShell',       icon:  'devicon-powershell-plain colored' },
      { name: 'Networking',       emoji: '🌐' },
    ],
  },
  {
    title:  'Tools & AI',
    icon:   '🛠',
    accent: '#34d399',
    skills: [
      { name: 'Blender', icon: 'devicon-blender-original colored' },
      { name: 'n8n',     img:  n8nIcon },
      { name: 'Ollama',  img:  ollamaIcon },
    ],
  },
]

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">Tech <span className="neon-text">Stack</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">Technologies I work with</p>
        </div>

        <div className="sk-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="sk-card fade-in"
              style={{ '--accent': cat.accent }}
            >
              {/* Glow orb behind card */}
              <div className="sk-card-orb" />

              {/* Header */}
              <div className="sk-card-header">
                <span className="sk-cat-icon">{cat.icon}</span>
                <span className="sk-cat-title">{cat.title}</span>
                <span className="sk-cat-count">{cat.skills.length}</span>
              </div>

              {/* Divider */}
              <div className="sk-card-divider" />

              {/* Skill chips */}
              <div className="sk-chips">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="sk-chip">
                    {skill.icon
                      ? <i className={`${skill.icon} sk-chip-icon`} />
                      : skill.img
                        ? <img src={skill.img} alt={skill.name} className="sk-chip-img" />
                        : <span className="sk-chip-emoji">{skill.emoji}</span>
                    }
                    <span className="sk-chip-name">{skill.name}</span>
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
