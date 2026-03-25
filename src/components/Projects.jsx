import './Projects.css'

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
)

const projects = [
  {
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
    github: 'https://github.com/Eportela99/WinToolkit_v2.0',
  },
  {
    title: 'GitTree',
    subtitle: 'Visual Git & GitHub Manager for macOS',
    description:
      'A native macOS app built with SwiftUI that brings your entire git workflow into one dark-themed interface. Visualize branch history with a real-time commit graph, manage branches, stage files, and interact with GitHub — all without touching a terminal.',
    highlights: [
      'Visual commit graph with colored branch lanes and merge curves',
      'Full branch CRUD: create, checkout, rename, delete, merge, push',
      'Staging area with per-file stage/unstage/discard and inline diff viewer',
      'GitHub integration: repos, pull requests, issues via gh CLI',
      'Detached HEAD workflow: create branch, move pointer, or return',
      'Stash manager, admin privilege escalation, PKG installer',
    ],
    tags: ['SwiftUI', 'macOS', 'MVVM', 'gh CLI', 'Canvas API'],
    github: 'https://github.com/Eportela99/GitTree',
  },
  {
    title: 'IT-DockTools',
    subtitle: 'Self-Hosted IT Toolbox — 50+ Tools',
    description:
      'A fully self-hosted IT toolbox built with Go and React, shipping over 50 working tools across networking, cryptography, file processing, developer utilities, and system monitoring. Deployed via Docker Compose with Nginx reverse proxy and real-time WebSocket streaming for tools like port scanner, ping, and traceroute.',
    highlights: [
      'Networking suite: port scanner, DNS lookup, traceroute, SSL checker, WHOIS, IP geolocation',
      'Crypto & security: AES-256-GCM encryption, bcrypt, JWT decoder, SSH key generator',
      'Real-time WebSocket streaming for port scan, ping, traceroute, and webhook tester',
      'File tools: image converter/resizer, PDF merger, EXIF viewer, CSV↔JSON, ZIP archive',
      'Developer tools: JSON/XML/YAML formatter, regex tester, diff viewer, color converter',
      'Docker Info & System Stats: live CPU, RAM, disk charts via socket',
    ],
    tags: ['Go', 'React', 'TypeScript', 'Docker', 'WebSockets', 'Nginx'],
    github: 'https://github.com/Eportela99/IT-DockTools',
  },
]

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">Featured <span className="neon-text">Projects</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">A selection of things I&apos;ve built</p>
        </div>

        {projects.map((proj) => (
          <div key={proj.title} className="featured-project glass-card fade-in">
            <div className="featured-info">
              <div className="featured-label">Featured Project</div>
              <h3 className="featured-title">{proj.title}</h3>
              <p className="featured-subtitle">{proj.subtitle}</p>
              <p className="featured-description">{proj.description}</p>

              <ul className="featured-highlights">
                {proj.highlights.map((h) => (
                  <li key={h}>
                    <span className="highlight-dot" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="featured-footer">
                <div className="project-tags">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
                <a href={proj.github} className="project-link featured-gh" aria-label="GitHub" target="_blank" rel="noreferrer">
                  <GitHubIcon />
                  <span>View on GitHub</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
