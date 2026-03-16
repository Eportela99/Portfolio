import './About.css'
import CertCarousel from './CertCarousel'

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

          <div className="about-carousel-wrap fade-in">
            <p className="cc-section-label">Certifications</p>
            <CertCarousel />
          </div>
        </div>
      </div>
    </section>
  )
}
