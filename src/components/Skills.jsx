import './Skills.css'
import ollamaIcon from '../assets/ollama.png'
import n8nIcon from '../assets/n8n-color.png'

const skills = [
  { name: 'Linux',      icon: 'devicon-linux-plain colored' },
  { name: 'Azure',      icon: 'devicon-azure-plain colored' },
  { name: 'React',      icon: 'devicon-react-original colored' },
  { name: 'CSS',        icon: 'devicon-css3-plain colored' },
  { name: 'HTML',       icon: 'devicon-html5-plain colored' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
  { name: 'Node.js',    icon: 'devicon-nodejs-plain colored' },
  { name: 'Python',     icon: 'devicon-python-plain colored' },
  { name: 'Java',       icon: 'devicon-java-plain colored' },
  { name: 'Swift',      icon: 'devicon-swift-plain colored' },
  { name: 'n8n',        img: n8nIcon },
  { name: 'Docker',     icon: 'devicon-docker-plain colored' },
  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
  { name: 'Blender',    icon: 'devicon-blender-original colored' },
  { name: 'Git',        icon: 'devicon-git-plain colored' },
  { name: 'Ollama',     img: ollamaIcon },
]

const proficiencies = [
  { label: 'Frontend Development', value: 90 },
  { label: 'Backend Development', value: 80 },
  { label: 'Database Design', value: 75 },
  { label: 'DevOps / Cloud', value: 65 },
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

        <div className="skills-layout">
          <div className="skills-grid fade-in">
            {skills.map((skill) => (
              <div className="skill-badge glass-card" key={skill.name}>
                {skill.icon
                  ? <i className={`${skill.icon} skill-icon`} />
                  : <img src={skill.img} alt={skill.name} className="skill-img-icon" />
                }
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>

          <div className="skills-bars fade-in">
            <h3 className="bars-heading">Proficiency</h3>
            {proficiencies.map((item) => (
              <div className="skill-bar-item" key={item.label}>
                <div className="bar-header">
                  <span className="bar-label">{item.label}</span>
                  <span className="bar-value">{item.value}%</span>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ '--bar-width': `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
