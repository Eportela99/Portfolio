import './LiveTools.css'
import BrowserBenchmark from './BrowserBenchmark'
import NetworkSpeedTest from './NetworkSpeedTest'

const TOOLS = [
  {
    id: 'benchmark',
    icon: '⚡',
    label: 'Browser Benchmark',
    description: 'CPU score, render FPS, download speed & latency — runs entirely in your browser',
    component: BrowserBenchmark,
  },
  {
    id: 'speedtest',
    icon: '🌐',
    label: 'Network Speed Test',
    description: 'Download & upload speed, ping, and jitter — tested against the edge server',
    component: NetworkSpeedTest,
  },
]

export default function LiveTools() {
  return (
    <section className="live-tools" id="tools">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title">Live <span className="neon-text">Tools</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">Interactive utilities — runs entirely in your browser</p>
        </div>

        {TOOLS.map((tool) => {
          const Component = tool.component
          return (
            <div key={tool.id} className="lt-card glass-card fade-in">
              <div className="lt-card-header">
                <span className="lt-card-icon">{tool.icon}</span>
                <div>
                  <h3 className="lt-card-title">{tool.label}</h3>
                  <p className="lt-card-desc">{tool.description}</p>
                </div>
              </div>
              <div className="lt-card-body">
                <Component />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
