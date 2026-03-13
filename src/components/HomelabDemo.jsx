import { useState, useEffect } from 'react'
import './HomelabDemo.css'

// ── Container data ─────────────────────────────────────────────
const CONTAINERS = [
  {
    id: 'pihole', name: 'Pi-Hole', color: '#e53935', bg: '#2a0608', symbol: 'π',
    desc: 'Network-wide ad & tracker blocker. Acts as a local DNS sinkhole that silently drops ads and telemetry across every device on the network — no client-side software needed.',
  },
  {
    id: 'nextcloud', name: 'Nextcloud', color: '#0082c9', bg: '#001829', symbol: '☁',
    desc: 'Self-hosted cloud storage and collaboration suite. Provides file sync, sharing, calendar, and contacts — essentially a private Google Drive running entirely on local hardware.',
  },
  {
    id: 'nginx', name: 'NGINX', color: '#43a047', bg: '#001400', symbol: 'N',
    desc: 'Reverse proxy and web server routing all external and internal traffic to the correct service. Handles SSL termination so every service gets HTTPS automatically.',
  },
  {
    id: 'jellyfin', name: 'Jellyfin', color: '#aa5cc3', bg: '#1a0028', symbol: '▶',
    desc: 'Free open-source media server. Streams movies, TV shows, and music to any device on the network or remotely via browser or native apps — no subscription, no tracking.',
  },
  {
    id: 'tailscale', name: 'Tailscale', color: '#246bfd', bg: '#000c2a', symbol: 'T',
    desc: 'Zero-config WireGuard VPN mesh. Securely connects all devices and servers with end-to-end encryption — access the entire homelab remotely as if you were on the local network.',
  },
  {
    id: 'casaos', name: 'CasaOS', color: '#29b6f6', bg: '#001422', symbol: '⌂',
    desc: 'Lightweight home cloud OS dashboard. Provides a clean web UI to manage all Docker containers, monitor system resources, and install new apps with one click.',
  },
  {
    id: 'grafana', name: 'Grafana', color: '#f46800', bg: '#2a0e00', symbol: 'G',
    desc: 'Observability and analytics platform. Pulls metrics from Prometheus and logs from Loki to build real-time dashboards for every service and system in the homelab.',
  },
  {
    id: 'uptime', name: 'Uptime Kuma', color: '#5cdd8b', bg: '#001a0d', symbol: '↑',
    desc: 'Self-hosted uptime monitoring tool. Continuously checks every service and sends instant alerts via Telegram or email if anything goes down or becomes unreachable.',
  },
  {
    id: 'prometheus', name: 'Prometheus', color: '#e6522c', bg: '#2a0800', symbol: 'P',
    desc: 'Time-series metrics engine. Scrapes performance data — CPU, memory, network, container stats — from all services every few seconds and stores it for Grafana to query.',
  },
  {
    id: 'loki', name: 'Loki', color: '#f9a825', bg: '#2a1a00', symbol: 'L',
    desc: 'Log aggregation system by Grafana Labs. Collects and indexes logs from every container and service, making them searchable and viewable directly inside Grafana dashboards.',
  },
]

// ── Icon SVGs ──────────────────────────────────────────────────
const WDSIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="36" height="22" rx="3" fill="#1565c0" stroke="#42a5f5" strokeWidth="1.5"/>
    <rect x="10" y="14" width="28" height="14" rx="1.5" fill="#0d47a1"/>
    <circle cx="24" cy="21" r="4" fill="#42a5f5" opacity="0.9"/>
    <path d="M18 37 h12 M24 32 v5" stroke="#42a5f5" strokeWidth="2" strokeLinecap="round"/>
    <path d="M24 21 m-8 0 a8 8 0 0 1 16 0" stroke="#90caf9" strokeWidth="1.2" fill="none" strokeDasharray="2 2"/>
    <path d="M24 21 m-13 0 a13 13 0 0 1 26 0" stroke="#42a5f5" strokeWidth="1" fill="none" strokeDasharray="2 3" opacity="0.5"/>
  </svg>
)

const RDPIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="40" height="26" rx="3" fill="#0d47a1" stroke="#42a5f5" strokeWidth="1.5"/>
    <rect x="8" y="12" width="32" height="18" rx="1.5" fill="#1a237e"/>
    <rect x="16" y="34" width="16" height="3" rx="1" fill="#42a5f5" opacity="0.6"/>
    <rect x="12" y="37" width="24" height="2" rx="1" fill="#42a5f5" opacity="0.4"/>
    <path d="M19 21 l6-4 v8 z" fill="#42a5f5"/>
    <rect x="26" y="18" width="6" height="6" rx="1" fill="none" stroke="#42a5f5" strokeWidth="1.5"/>
    <path d="M27 19.5 h4 M27 21 h3 M27 22.5 h4" stroke="#42a5f5" strokeWidth="0.8" opacity="0.7"/>
  </svg>
)

const HyperVIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="8" width="36" height="10" rx="2.5" fill="#4a148c" stroke="#ce93d8" strokeWidth="1.5"/>
    <rect x="6" y="21" width="36" height="10" rx="2.5" fill="#6a1b9a" stroke="#ce93d8" strokeWidth="1.5"/>
    <rect x="14" y="11" width="8" height="4" rx="1" fill="#ce93d8" opacity="0.6"/>
    <rect x="14" y="24" width="8" height="4" rx="1" fill="#ce93d8" opacity="0.6"/>
    <circle cx="38" cy="13" r="2" fill="#69f0ae"/>
    <circle cx="38" cy="26" r="2" fill="#69f0ae"/>
    <path d="M24 31 v5 M18 36 h12" stroke="#ce93d8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// ── Win-style window wrapper ───────────────────────────────────
function WinWindow({ title, icon, onClose, children }) {
  return (
    <div className="hl-window">
      <div className="hl-win-titlebar">
        <span className="hl-win-icon">{icon}</span>
        <span className="hl-win-title">{title}</span>
        <div className="hl-win-controls">
          <span className="hl-win-btn hl-win-min">─</span>
          <span className="hl-win-btn hl-win-max">⬜</span>
          <span className="hl-win-btn hl-win-close" onClick={onClose}>✕</span>
        </div>
      </div>
      <div className="hl-win-body">{children}</div>
    </div>
  )
}

// ── Desktop icon ───────────────────────────────────────────────
function DesktopIcon({ svg, label, onClick, active }) {
  return (
    <div className={`hl-desk-icon${active ? ' hl-active' : ''}`} onClick={onClick}>
      <div className="hl-desk-icon-img">{svg}</div>
      <span className="hl-desk-icon-label">{label}</span>
    </div>
  )
}

// ── WDS window ─────────────────────────────────────────────────
function WDSWindow({ onClose }) {
  const images = [
    'Windows Server 2016 (Trial)',
    'Windows Server 2019 (Trial)',
    'Windows Server 2022 (Trial)',
    'Windows Server 2025 (Trial)',
    'Windows 10 Enterprise (Trial)',
    'Windows 11 Enterprise (Trial)',
    'Macrium Reflect — Network Backup Images',
  ]
  return (
    <WinWindow title="Windows Deployment Services" icon="🖥" onClose={onClose}>
      <p className="hl-win-desc">
        <strong>WDS</strong> is a Windows Server role that enables PXE-boot network installations.
        Machines on the network can boot directly into a deployment environment and receive a full
        OS install or a Macrium Reflect backup image — no USB drive needed.
      </p>
      <div className="hl-section-label">📦 Hosted Images</div>
      <ul className="hl-list">
        {images.map(img => (
          <li key={img}>
            <span className={`hl-img-dot${img.includes('Macrium') ? ' hl-dot-green' : ''}`} />
            {img}
          </li>
        ))}
      </ul>
    </WinWindow>
  )
}

// ── RDP window ─────────────────────────────────────────────────
function RDPWindow({ onClose }) {
  return (
    <WinWindow title="Remote Desktop Protocol" icon="🖱" onClose={onClose}>
      <p className="hl-win-desc">
        <strong>RDP</strong> provides full graphical remote access to this Windows Server machine.
        Used for day-to-day administration, testing deployments, and managing Hyper-V VMs
        from any device — locally over the network or remotely via Tailscale VPN.
      </p>
      <div className="hl-rdp-status">
        <span className="hl-status-dot" /> RDP Enabled — Port 3389
      </div>
    </WinWindow>
  )
}

// ── VM definitions ─────────────────────────────────────────────
const VMS = [
  { id: 'docker',       name: 'Docker Lab',           sub: 'Ubuntu Server · Docker & Compose',          status: 'running' },
  { id: 'ad',           name: 'Active Directory Lab',  sub: 'Windows Server 2022 · Domain Controller',   status: 'running' },
  { id: 'win11personal',name: 'Win11 Personal',        sub: 'Windows 11 Pro · Personal Setup',           status: 'saved'   },
  { id: 'win11client',  name: 'Win11 Client',          sub: 'Windows 11 Pro · Clean Enterprise Image',   status: 'off'     },
  { id: 'n8n',          name: 'n8n Lab',               sub: 'Ubuntu Server · Automation Workflows',      status: 'running' },
]

const STATUS_COLORS = { running: '#69f0ae', saved: '#f9a825', off: '#90a4ae' }
const STATUS_LABELS = { running: 'Running', saved: 'Saved', off: 'Off' }

// ── AD Domain Chart ─────────────────────────────────────────────
function ADDomainChart() {
  return (
    <div className="hl-ad-chart">
      {/* Forest root */}
      <div className="hl-ad-forest">
        <span className="hl-ad-forest-label">🌲 Forest: corp.homelab.local</span>
      </div>
      <div className="hl-ad-connector hl-ad-connector-v" />
      {/* Domain row */}
      <div className="hl-ad-domain-row">
        <div className="hl-ad-node hl-ad-node-domain">
          <span className="hl-ad-node-icon">🏛</span>
          <span className="hl-ad-node-label">corp.homelab.local</span>
          <span className="hl-ad-node-sub">Domain</span>
        </div>
      </div>
      <div className="hl-ad-connector hl-ad-connector-v" />
      {/* DCs row */}
      <div className="hl-ad-dc-row">
        <div className="hl-ad-branch">
          <div className="hl-ad-connector hl-ad-connector-h" />
          <div className="hl-ad-node hl-ad-node-dc">
            <span className="hl-ad-node-icon">🖥</span>
            <span className="hl-ad-node-label">DC01</span>
            <span className="hl-ad-node-sub">PDC · DNS · DHCP</span>
            <span className="hl-ad-node-status">● Running</span>
          </div>
        </div>
        <div className="hl-ad-branch">
          <div className="hl-ad-connector hl-ad-connector-h" />
          <div className="hl-ad-node hl-ad-node-dc">
            <span className="hl-ad-node-icon">🖥</span>
            <span className="hl-ad-node-label">DC02</span>
            <span className="hl-ad-node-sub">BDC · Replication</span>
            <span className="hl-ad-node-status">● Running</span>
          </div>
        </div>
      </div>
      <div className="hl-ad-connector hl-ad-connector-v" />
      {/* OUs row */}
      <div className="hl-ad-ou-row">
        {['IT Admins', 'Workstations', 'Servers', 'GPOs'].map(ou => (
          <div key={ou} className="hl-ad-node hl-ad-node-ou">
            <span className="hl-ad-node-icon">📁</span>
            <span className="hl-ad-node-label">{ou}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Hyper-V window ─────────────────────────────────────────────
function HyperVWindow({ onClose }) {
  const [selectedVM, setSelectedVM]   = useState(null)
  const [activeContainer, setActive]  = useState(null)

  const selected = CONTAINERS.find(c => c.id === activeContainer)
  const vm = VMS.find(v => v.id === selectedVM)

  const goBack = () => { setSelectedVM(null); setActive(null) }

  return (
    <WinWindow title="Hyper-V Manager" icon="⚙" onClose={onClose}>
      {!selectedVM && (
        <>
          <p className="hl-win-desc">
            <strong>Hyper-V</strong> is Windows&apos; built-in Type-1 hypervisor running directly
            on the server hardware. It hosts isolated virtual machines for testing and self-hosted services.
          </p>
          <div className="hl-section-label">💻 Virtual Machines</div>
          <div className="hl-vm-list">
            {VMS.map(v => (
              <div key={v.id} className="hl-vm-card" onClick={() => setSelectedVM(v.id)}>
                <div className="hl-vm-status" style={{ color: STATUS_COLORS[v.status] }}>
                  <span className="hl-status-dot" style={{ background: STATUS_COLORS[v.status], boxShadow: `0 0 6px ${STATUS_COLORS[v.status]}` }} />
                  {STATUS_LABELS[v.status]}
                </div>
                <div className="hl-vm-name">{v.name}</div>
                <div className="hl-vm-sub">{v.sub}</div>
                <div className="hl-vm-arrow">View Details →</div>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedVM === 'docker' && (
        <>
          <button className="hl-back-btn" onClick={goBack}>← Back to VMs</button>
          <div className="hl-section-label">🐳 Docker Lab — Running Containers</div>
          <div className="hl-container-grid">
            {CONTAINERS.map(c => (
              <div
                key={c.id}
                className={`hl-container-icon${activeContainer === c.id ? ' hl-container-active' : ''}`}
                style={{ '--c-color': c.color, '--c-bg': c.bg }}
                onClick={() => setActive(activeContainer === c.id ? null : c.id)}
              >
                <span className="hl-container-symbol">{c.symbol}</span>
                <span className="hl-container-name">{c.name}</span>
              </div>
            ))}
          </div>
          {selected && (
            <div className="hl-container-desc" style={{ borderColor: selected.color }}>
              <span className="hl-container-desc-title" style={{ color: selected.color }}>{selected.name}</span>
              <p>{selected.desc}</p>
            </div>
          )}
        </>
      )}

      {selectedVM === 'ad' && (
        <>
          <button className="hl-back-btn" onClick={goBack}>← Back to VMs</button>
          <p className="hl-win-desc">
            <strong>Active Directory Lab</strong> simulates a real enterprise domain environment.
            Runs two domain controllers in a <strong>corp.homelab.local</strong> forest — used for
            testing GPO deployment, RBAC, DNS, and domain-join workflows against Win11 clients.
          </p>
          <div className="hl-section-label">🏛 Domain Structure</div>
          <ADDomainChart />
        </>
      )}

      {selectedVM === 'win11personal' && (
        <>
          <button className="hl-back-btn" onClick={goBack}>← Back to VMs</button>
          <p className="hl-win-desc">
            <strong>Win11 Personal</strong> is a fully configured Windows 11 Pro VM with all personal
            accounts, applications, and preferences pre-installed. Rather than reinstalling from scratch,
            the entire state is captured as a <strong>Macrium Reflect</strong> backup image and stored
            on the WDS server — restored in minutes bare-metal or as a VM.
          </p>
          <div className="hl-section-label">💾 Backup Strategy</div>
          <ul className="hl-list">
            {[
              'Full image captured with Macrium Reflect',
              'Image stored on WDS server for network restore',
              'Incremental backups on configuration changes',
              'Bootable recovery from PXE or USB fallback',
            ].map(item => (
              <li key={item}><span className="hl-img-dot hl-dot-green" />{item}</li>
            ))}
          </ul>
        </>
      )}

      {selectedVM === 'win11client' && (
        <>
          <button className="hl-back-btn" onClick={goBack}>← Back to VMs</button>
          <p className="hl-win-desc">
            <strong>Win11 Client</strong> is a clean, enterprise-ready Windows 11 Pro image kept fully
            patched with essential programs pre-installed. Acts as the gold master deployment image —
            domain-joined, Macrium-captured, and deployed to physical or virtual client machines via WDS.
          </p>
          <div className="hl-section-label">🚀 Deployment Pipeline</div>
          <ul className="hl-list">
            {[
              'Sysprep-sealed Windows 11 gold master image',
              'Domain-joined to corp.homelab.local on first boot',
              'Essential apps: Office, browser, 7-Zip, VLC, etc.',
              'WDS PXE deploy to bare-metal in under 10 minutes',
            ].map(item => (
              <li key={item}><span className="hl-img-dot" />{item}</li>
            ))}
          </ul>
        </>
      )}

      {selectedVM === 'n8n' && (
        <>
          <button className="hl-back-btn" onClick={goBack}>← Back to VMs</button>
          <p className="hl-win-desc">
            <strong>n8n Lab</strong> is a dedicated VM running n8n — a powerful open-source workflow
            automation platform. Handles heavy, long-running automation jobs isolated from the main
            Docker stack so workflows never impact production services.
          </p>
          <div className="hl-section-label">⚡ Active Workflows</div>
          <ul className="hl-list">
            {[
              'GitHub → Webhook → Slack deployment notifications',
              'Scheduled server health reports via Telegram',
              'File watcher → auto-process & archive pipelines',
              'API polling → database ingestion automations',
            ].map(item => (
              <li key={item}><span className="hl-img-dot" style={{ background: '#f46800' }} />{item}</li>
            ))}
          </ul>
        </>
      )}
    </WinWindow>
  )
}

// ── Main desktop ───────────────────────────────────────────────
export default function HomelabDemo() {
  const [openWindow, setOpenWindow] = useState(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    update()
    const t = setInterval(update, 30000)
    return () => clearInterval(t)
  }, [])

  const close = () => setOpenWindow(null)

  return (
    <div className="hl-desktop">
      {/* Wallpaper glow layers */}
      <div className="hl-glow hl-glow-1" />
      <div className="hl-glow hl-glow-2" />
      <div className="hl-glow hl-glow-3" />

      {/* Windows Server 2025 watermark */}
      <div className="hl-watermark">Windows Server 2025</div>

      {/* Desktop icons */}
      <div className="hl-icons-area">
        <DesktopIcon svg={<WDSIcon />}    label="WDS"     active={openWindow==='wds'}    onClick={() => setOpenWindow(openWindow === 'wds'    ? null : 'wds')}    />
        <DesktopIcon svg={<RDPIcon />}    label="RDP"     active={openWindow==='rdp'}    onClick={() => setOpenWindow(openWindow === 'rdp'    ? null : 'rdp')}    />
        <DesktopIcon svg={<HyperVIcon />} label="Hyper-V" active={openWindow==='hyperv'} onClick={() => setOpenWindow(openWindow === 'hyperv' ? null : 'hyperv')} />
      </div>

      {/* Open window */}
      <div className="hl-window-area">
        {openWindow === 'wds'    && <WDSWindow    onClose={close} />}
        {openWindow === 'rdp'    && <RDPWindow    onClose={close} />}
        {openWindow === 'hyperv' && <HyperVWindow onClose={close} />}
      </div>

      {/* Taskbar */}
      <div className="hl-taskbar">
        <div className="hl-taskbar-start">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <rect x="0" y="0" width="7" height="7" rx="1"/>
            <rect x="9" y="0" width="7" height="7" rx="1"/>
            <rect x="0" y="9" width="7" height="7" rx="1"/>
            <rect x="9" y="9" width="7" height="7" rx="1"/>
          </svg>
        </div>
        <div className="hl-taskbar-apps">
          {openWindow && (
            <div className="hl-taskbar-app active">
              {openWindow === 'wds' ? '🖥 WDS' : openWindow === 'rdp' ? '🖱 RDP' : '⚙ Hyper-V'}
            </div>
          )}
        </div>
        <div className="hl-taskbar-clock">{time}</div>
      </div>
    </div>
  )
}
