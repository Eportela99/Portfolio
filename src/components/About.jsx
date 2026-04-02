import { useEffect, useRef, useState } from 'react'
import './About.css'
import CertCarousel from './CertCarousel'

export default function About() {
  const termRef = useRef(null)
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBooted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (termRef.current) observer.observe(termRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title about-title" data-text="About Me">
            About <span className="neon-text">Me</span>
          </h2>
          <div className="section-divider" />
          <p className="section-subtitle">A little about who I am and what I do</p>
        </div>

        <div
          ref={termRef}
          className={`about-terminal ${booted ? 'about-terminal--on' : ''}`}
        >
          {/* Title bar */}
          <div className="about-term-bar">
            <span className="about-term-dot about-term-dot--red" />
            <span className="about-term-dot about-term-dot--yellow" />
            <span className="about-term-dot about-term-dot--green" />
            <span className="about-term-title">enrique@portfolio: ~/about</span>
          </div>

          {/* Terminal body */}
          <div className="about-term-body">
            <div className="about-term-line about-term-line--1">
              <span className="about-term-prompt">$</span>
              <span className="about-term-cmd">cat about.txt</span>
            </div>
            <div className="about-term-line about-term-line--2">
              <p className="about-term-heading">
                Passionate developer building the future, one line at a time.
              </p>
            </div>
            <div className="about-term-line about-term-line--3">
              <p>
                I&apos;m a full stack developer and IT professional with a passion for creating beautiful,
                functional, and user-centered digital experiences. With a strong foundation in modern
                web technologies and hands-on IT support, I bring ideas to life through clean and
                efficient code.
              </p>
            </div>
            <div className="about-term-line about-term-line--4">
              <p>
                When I&apos;m not coding, you can find me exploring new technologies, tinkering with
                homelab projects, or experimenting with the latest design trends.
              </p>
            </div>
            <div className="about-term-line about-term-line--5">
              <span className="about-term-prompt">$</span>
              <span className="about-term-cursor">_</span>
            </div>
          </div>

          {/* CRT scan-line overlay */}
          <div className="about-term-scanlines" />
        </div>

        <div className="about-bottom fade-in">
          <div className="about-education">
            <span className="about-edu-label">Education</span>
            <span className="about-edu-degree">Bachelor of Science in Computer Science</span>
          </div>
          <p className="cc-section-label">Certifications</p>
          <CertCarousel />
        </div>
      </div>
    </section>
  )
}
