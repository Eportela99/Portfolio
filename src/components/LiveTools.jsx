import './LiveTools.css'
import BrowserBenchmark from './BrowserBenchmark'

const TOOLS = [
  {
    id: 'benchmark',
    icon: '⚡',
    label: 'Browser Benchmark',
    description: 'CPU, render FPS, download speed & latency — all in your browser',
    component: BrowserBenchmark,
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
