import './Projects.css'
import GitTreeDemo from './GitTreeDemo'

const featured = {
  title: 'WinToolkit v2.0',
  subtitle: 'Windows System Administration Toolkit',
  description:
    'A comprehensive Windows system administration toolkit built with PowerShell and WinForms. Features 20 modules covering hardware diagnostics, network tools, user management, system repair, security baselines, fleet management, and compliance monitoring — all inside a single dark-themed unified interface.',
  highlights: [
    'Hardware & software inventory with full CPU, GPU, RAM, and storage details',
    'Network diagnostics: IP scanner, port scanner, traceroute, Wake-on-LAN, RDP',
    'Fleet Manager: remote multi-machine management via WinRM with health snapshots',
    'Security Baseline: 7-point scanner with rollback snapshots and enforcement',
    'Compliance Dashboard: fleet-wide PASS/FAIL reporting exportable to HTML/CSV',
    'PC Repair & Diagnostics: DISM, SFC, disk health, battery reports, network reset',
  ],
  tags: ['PowerShell', 'WinForms', 'Windows 10/11'],
  github: '#',
}

const projects = [
  {
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce solution with real-time inventory management, payment processing via Stripe, and an intuitive admin dashboard.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    github: '#',
    live: '#',
  },
  {
    title: 'AI Task Manager',
    description:
      'Smart productivity app that uses AI to prioritize tasks, generate subtasks, and provide time estimates based on your work patterns.',
    tags: ['Next.js', 'OpenAI', 'Prisma', 'TypeScript'],
    github: '#',
    live: '#',
  },
  {
    title: 'Real-time Chat App',
    description:
      'Scalable messaging platform with end-to-end encryption, file sharing, video calls, and support for thousands of concurrent users.',
    tags: ['React', 'Socket.io', 'Redis', 'Docker'],
    github: '#',
    live: '#',
  },
  {
    title: 'DevOps Dashboard',
    description:
      'Centralized monitoring dashboard for microservices with live metrics, alerting, log aggregation, and deployment pipelines.',
    tags: ['Vue.js', 'Grafana', 'Prometheus', 'K8s'],
    github: '#',
    live: '#',
  },
  {
    title: 'Portfolio Generator',
    description:
      'CLI tool that generates beautiful, customizable developer portfolios from a simple YAML config file and GitHub API data.',
    tags: ['Python', 'GitHub API', 'Jinja2', 'CLI'],
    github: '#',
    live: '#',
  },
  {
    title: 'Crypto Analytics',
    description:
      'Real-time cryptocurrency analytics platform with price alerts, portfolio tracking, technical indicators, and market sentiment.',
    tags: ['React', 'WebSocket', 'Chart.js', 'FastAPI'],
    github: '#',
    live: '#',
  },
]

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const ExternalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const CodeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">Featured <span className="neon-text">Projects</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">A selection of things I&apos;ve built</p>
        </div>

        {/* ── Featured project ── */}
        <div className="featured-project glass-card fade-in">
          <div className="featured-info">
            <div className="featured-label">Featured Project</div>
            <h3 className="featured-title">{featured.title}</h3>
            <p className="featured-subtitle">{featured.subtitle}</p>
            <p className="featured-description">{featured.description}</p>

            <ul className="featured-highlights">
              {featured.highlights.map((h) => (
                <li key={h}>
                  <span className="highlight-dot" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="featured-footer">
              <div className="project-tags">
                {featured.tags.map((tag) => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
              <a href={featured.github} className="project-link featured-gh" aria-label="GitHub">
                <GitHubIcon />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>

          <div className="featured-video-wrap">
            <video
              className="featured-video"
              src="/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>

        {/* ── Featured project: GitTree ── */}
        <div className="featured-project featured-project-rev glass-card fade-in">
          <div className="featured-demo-wrap">
            <GitTreeDemo />
          </div>

          <div className="featured-info">
            <div className="featured-label">Featured Project</div>
            <h3 className="featured-title">GitTree</h3>
            <p className="featured-subtitle">Visual Git &amp; GitHub Manager for macOS</p>
            <p className="featured-description">
              A native macOS app built with SwiftUI that brings your entire git workflow into one
              dark-themed interface. Visualize branch history with a real-time commit graph,
              manage branches, stage files, and interact with GitHub — all without touching a terminal.
            </p>

            <ul className="featured-highlights">
              {[
                'Visual commit graph with colored branch lanes and merge curves',
                'Full branch CRUD: create, checkout, rename, delete, merge, push',
                'Staging area with per-file stage/unstage/discard and inline diff viewer',
                'GitHub integration: repos, pull requests, issues via gh CLI',
                'Detached HEAD workflow: create branch, move pointer, or return',
                'Stash manager, admin privilege escalation, PKG installer',
              ].map(h => (
                <li key={h}>
                  <span className="highlight-dot" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="featured-footer">
              <div className="project-tags">
                {['SwiftUI', 'macOS', 'MVVM', 'gh CLI', 'Canvas API'].map(tag => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Other projects grid ── */}
        <div className="projects-grid">
          {projects.map((project) => (
            <div className="project-card glass-card fade-in" key={project.title}>
              <div className="project-header">
                <div className="project-icon"><CodeIcon /></div>
                <div className="project-links">
                  <a href={project.github} className="project-link" aria-label="GitHub"><GitHubIcon /></a>
                  <a href={project.live} className="project-link" aria-label="Live demo"><ExternalIcon /></a>
                </div>
              </div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
