import './Skills.css'
import ollamaIcon from '../assets/ollama.png'
import n8nIcon    from '../assets/n8n-color.png'

const CATEGORIES = [
  {
    title:  'Frontend',
    icon:   '🖥',
    accent: '#00d4ff',
    skills: [
      { name: 'React',      icon: 'devicon-react-original colored',      sub: 'Hooks · Vite · Router' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored',    sub: 'Generics · Types' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain colored',    sub: 'ES2024 · Async · DOM' },
      { name: 'HTML',       icon: 'devicon-html5-plain colored',         sub: 'Semantic · A11y' },
      { name: 'CSS',        icon: 'devicon-css3-plain colored',          sub: 'Flexbox · Grid · Animations' },
      { name: 'Swift',      icon: 'devicon-swift-plain colored',         sub: 'SwiftUI · MVVM · iOS' },
    ],
  },
  {
    title:  'Backend',
    icon:   '⚙️',
    accent: '#7c3aed',
    skills: [
      { name: 'Node.js',    icon: 'devicon-nodejs-plain colored',        sub: 'Express · REST · npm' },
      { name: 'Python',     icon: 'devicon-python-plain colored',        sub: 'Scripts · Automation' },
      { name: 'Go',         icon: 'devicon-go-plain colored',            sub: 'Gin · REST · WebSockets' },
      { name: 'Java',       icon: 'devicon-java-plain colored',          sub: 'OOP · Spring' },
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored',    sub: 'CRUD · Migrations' },
    ],
  },
  {
    title:  'Infrastructure',
    icon:   '🏗',
    accent: '#3b82f6',
    skills: [
      { name: 'Docker',     icon: 'devicon-docker-plain colored',        sub: 'Compose · Images' },
      { name: 'Linux',      icon: 'devicon-linux-plain colored',         sub: 'Bash · Ubuntu · Admin' },
      { name: 'Azure',      icon: 'devicon-azure-plain colored',         sub: 'VMs · Active Directory' },
      { name: 'Git',        icon: 'devicon-git-plain colored',           sub: 'GitHub · CI/CD' },
    ],
  },
  {
    title:  'Tools & AI',
    icon:   '🛠',
    accent: '#10b981',
    skills: [
      { name: 'Blender',    icon: 'devicon-blender-original colored',    sub: '3D · Modeling' },
      { name: 'n8n',        img:  n8nIcon,                               sub: 'Automation · Workflows' },
      { name: 'Ollama',     img:  ollamaIcon,                            sub: 'Local AI · LLMs' },
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
          {CATEGORIES.map((cat, ci) => (
            <div
              key={cat.title}
              className="sk-card fade-in"
              style={{ '--cat-accent': cat.accent }}
            >
              {/* Card header */}
              <div className="sk-card-header">
                <span className="sk-cat-icon">{cat.icon}</span>
                <span className="sk-cat-title">{cat.title}</span>
                <span className="sk-cat-count">{cat.skills.length}</span>
              </div>

              {/* Skill items */}
              <div className="sk-card-body">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="sk-item">
                    {skill.icon
                      ? <i className={`${skill.icon} sk-item-icon`} />
                      : <img src={skill.img} alt={skill.name} className="sk-item-img" />
                    }
                    <div className="sk-item-info">
                      <span className="sk-item-name">{skill.name}</span>
                      <span className="sk-item-sub">{skill.sub}</span>
                    </div>
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
