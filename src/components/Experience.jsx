import './Experience.css'
import tecnicaLogo from '../assets/tecnica.jpeg'
import ephoneLogo  from '../assets/ephone.png'

const JOBS = [
  {
    company:  'Tecnica Systems',
    logo:     tecnicaLogo,
    roles:    ['IT Field Technician', 'Helpdesk Specialist', 'Project Manager'],
    period:   '2022 – Present',
    current:  true,
    bullets: [
      'Deploy, configure, and service POS systems across local supermarket chains, ensuring minimal downtime and seamless operations.',
      'Prepare and provision servers and workstations for client environments, handling OS setup, software deployment, and hardware configuration.',
      'Administer and maintain client databases, performing routine optimizations and ensuring data integrity.',
      'Diagnose and resolve hardware failures — repairing or replacing components including drives, PSUs, and peripherals as needed.',
      'Troubleshoot LAN/WAN connectivity issues and configure network equipment to restore and improve client infrastructure.',
      'Manage Group Policy Objects (GPOs) across Windows domains to enforce security baselines and standardize desktop environments.',
    ],
  },
  {
    company:  'ePhone Solutions',
    logo:     ephoneLogo,
    roles:    ['IT Technician'],
    period:   '2020 – 2022',
    current:  false,
    bullets: [
      'Diagnosed and repaired a wide range of smartphones, tablets, and computers — including screen replacements, battery swaps, and motherboard-level repairs.',
      'Delivered hands-on technical support and clear communication to customers, guiding them through repair options and device recommendations.',
      'Managed inventory and facilitated the sales of accessories and replacement parts, contributing to consistent store revenue.',
    ],
  },
]

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title exp-title" data-text="Work Experience">Work <span className="neon-text">Experience</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">Where I&apos;ve put my skills to work</p>
        </div>

        <div className="exp-timeline">
          {/* Glowing center line */}
          <div className="exp-line" />

          {JOBS.map((job, i) => (
            <div key={job.company} className={`exp-entry fade-in ${i % 2 === 0 ? 'exp-right' : 'exp-left'}`}>
              {/* Dot on the timeline */}
              <div className="exp-dot">
                {job.current && <div className="exp-dot-ping" />}
              </div>

              <div className="exp-card">
                {/* Card header */}
                <div className="exp-card-head">
                  <div className="exp-logo-wrap">
                    <img src={job.logo} alt={job.company} />
                  </div>
                  <div className="exp-meta">
                    <div className="exp-company-row">
                      <span className="exp-company">{job.company}</span>
                      {job.current && <span className="exp-current-badge">Current</span>}
                    </div>
                    <div className="exp-roles">
                      {job.roles.map(r => (
                        <span key={r} className="exp-role-chip">{r}</span>
                      ))}
                    </div>
                    <span className="exp-period">{job.period}</span>
                  </div>
                </div>

                {/* Bullets */}
                <ul className="exp-bullets">
                  {job.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
