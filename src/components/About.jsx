import './About.css'

const stats = [
  { value: '3+', label: 'Years Experience' },
  { value: '20+', label: 'Projects Built' },
  { value: '10+', label: 'Happy Clients' },
  { value: '5+', label: 'Technologies' },
]

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
              I&apos;m a full stack developer with a passion for creating beautiful, functional, and
              user-centered digital experiences. With a strong foundation in modern web technologies,
              I bring ideas to life through clean and efficient code.
            </p>
            <p>
              When I&apos;m not coding, you can find me exploring new technologies, contributing to
              open-source projects, or experimenting with the latest design trends.
            </p>
            <div className="about-tags">
              <span className="tag">React</span>
              <span className="tag">Node.js</span>
              <span className="tag">TypeScript</span>
              <span className="tag">Python</span>
              <span className="tag">AWS</span>
              <span className="tag">Docker</span>
            </div>
          </div>

          <div className="about-stats fade-in">
            {stats.map((stat) => (
              <div className="stat-card glass-card" key={stat.label}>
                <span className="stat-value neon-text">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
