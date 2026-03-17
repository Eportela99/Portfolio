import { useState, useRef, useCallback } from 'react'
import './BrowserBenchmark.css'

const BENCH_BIN  = '/bench.bin'
const BENCH_PING = '/bench-ping.json'

/* ── Device Info ─────────────────────────────────────── */
function getDeviceInfo() {
  const ua  = navigator.userAgent
  const pf  = navigator.platform || ''

  // Browser — order matters (Edge/OPR before Chrome, Chrome before Safari)
  let browser = 'Unknown'
  if (/Edg\//.test(ua))        browser = 'Edge'
  else if (/OPR\//.test(ua))   browser = 'Opera'
  else if (/Chrome\//.test(ua))browser = 'Chrome'
  else if (/Firefox\//.test(ua))browser = 'Firefox'
  else if (/Safari\//.test(ua)) browser = 'Safari'

  // OS — check platform + UA
  let os = 'Unknown'
  if (/Win/.test(pf) || /Windows NT/.test(ua))       os = 'Windows'
  else if (/iPhone|iPad/.test(ua))                    os = 'iOS'
  else if (/Android/.test(ua))                        os = 'Android'
  else if (/Mac/.test(pf) || /Macintosh/.test(ua))   os = 'macOS'
  else if (/Linux/.test(pf))                          os = 'Linux'

  // screen.width/height are CSS logical pixels per W3C spec — report as-is.
  // Multiplying by DPR double-counts on Windows where some browsers already
  // return physical pixels. Show DPR separately so users can do the math.
  const dpr = window.devicePixelRatio || 1
  const res  = `${screen.width}×${screen.height}`

  // hardwareConcurrency = logical threads (includes hyperthreading / SMT).
  // Label as "Threads" so it's not confused with physical core count.
  const threads = navigator.hardwareConcurrency || 'N/A'

  // GPU via WebGL — works on all major browsers incl. Safari
  let gpu = 'N/A'
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      if (ext) {
        const raw = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || ''
        // Clean up: remove trailing "(0x...)" vendor codes
        gpu = raw.replace(/\s*\(0x[0-9a-fA-F]+\)/g, '').trim() || 'N/A'
      }
    }
  } catch (_) {}

  // Touch support
  const touch = navigator.maxTouchPoints > 0

  return { browser, os, threads, dpr, res, gpu, touch }
}

/* ── Tests ───────────────────────────────────────────── */
function runCPUTest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const duration = 500
        const start = performance.now()
        let ops = 0
        while (performance.now() - start < duration) {
          // Mix of operations that resist JIT short-circuiting
          const x = Math.sqrt(ops + 1) * Math.sin(ops * 0.001)
          const y = Math.log(ops + 2) * Math.cos(ops * 0.001)
          ops += (x + y > 0 ? 1 : 1) // always 1 but prevents dead-code elimination
        }
        // Calibration: ~8M = 100
        const score = Math.min(100, Math.round((ops / 8_000_000) * 100))
        resolve({ ops, score })
      } catch (e) { reject(e) }
    }, 30)
  })
}

function runRenderTest() {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas')
      canvas.width  = 400
      canvas.height = 300
      const ctx = canvas.getContext('2d')
      let frames = 0
      const duration = 1000
      const start = performance.now()

      function draw() {
        try {
          const now = performance.now()
          if (now - start >= duration) {
            const fps   = Math.round((frames / (now - start)) * 1000)
            const score = Math.min(100, Math.round((fps / 60) * 100))
            resolve({ fps, score })
            return
          }
          ctx.clearRect(0, 0, 400, 300)
          for (let i = 0; i < 80; i++) {
            ctx.beginPath()
            ctx.arc(
              Math.random() * 400,
              Math.random() * 300,
              Math.random() * 20 + 5,
              0, Math.PI * 2
            )
            ctx.fillStyle = `hsl(${i * 4}, 70%, 55%)`
            ctx.fill()
          }
          frames++
          requestAnimationFrame(draw)
        } catch (e) { reject(e) }
      }
      requestAnimationFrame(draw)
    } catch (e) { reject(e) }
  })
}

async function runDownloadTest() {
  const t0  = performance.now()
  const res = await fetch(BENCH_BIN + '?t=' + Date.now(), { cache: 'no-store' })
  const buf = await res.arrayBuffer()
  const elapsed = (performance.now() - t0) / 1000
  const mbps    = (buf.byteLength * 8) / (elapsed * 1_000_000)
  const score   = Math.min(100, Math.round((mbps / 100) * 100))
  return { mbps: +mbps.toFixed(1), score }
}

async function runLatencyTest() {
  const times = []
  for (let i = 0; i < 5; i++) {
    const t0 = performance.now()
    await fetch(BENCH_PING + '?t=' + Date.now() + i, { cache: 'no-store' })
    times.push(performance.now() - t0)
  }
  times.sort((a, b) => a - b)
  const avg   = times.slice(0, 4).reduce((s, v) => s + v, 0) / 4
  const ms    = +avg.toFixed(1)
  // <10ms = 100, 200ms = 0
  const score = Math.max(0, Math.min(100, Math.round(((200 - ms) / 190) * 100)))
  return { ms, score }
}

/* ── Constants ───────────────────────────────────────── */
const PHASES = ['cpu', 'render', 'download', 'latency']
const META = {
  cpu:      { label: 'CPU Score',    icon: '🧠', unit: 'ops'  },
  render:   { label: 'Render FPS',   icon: '🎨', unit: 'fps'  },
  download: { label: 'Download',     icon: '⬇️',  unit: 'Mbps' },
  latency:  { label: 'Latency',      icon: '📡', unit: 'ms'   },
}

/* ── Helpers ─────────────────────────────────────────── */
function scoreColor(s) {
  if (s >= 80) return '#34d399'
  if (s >= 50) return '#fbbf24'
  return '#f87171'
}
function overallLabel(s) {
  if (s >= 850) return 'Excellent'
  if (s >= 650) return 'Good'
  if (s >= 400) return 'Average'
  return 'Low'
}

/* ── Component ───────────────────────────────────────── */
export default function BrowserBenchmark() {
  const [status,  setStatus]  = useState('idle')  // idle | running | done
  const [phase,   setPhase]   = useState(null)
  const [results, setResults] = useState(null)
  const [deviceInfo]          = useState(() => getDeviceInfo())
  const runningRef            = useRef(false)

  const runBenchmark = useCallback(async () => {
    if (runningRef.current) return
    runningRef.current = true
    setStatus('running')
    setResults(null)

    // Run each test independently — failures return null for that metric
    const safeRun = async (fn) => { try { return await fn() } catch { return null } }

    setPhase('cpu')
    const cpu = await safeRun(runCPUTest)

    setPhase('render')
    const render = await safeRun(runRenderTest)

    setPhase('download')
    const download = await safeRun(runDownloadTest)

    setPhase('latency')
    const latency = await safeRun(runLatencyTest)

    const scores  = [cpu, render, download, latency].map(r => r?.score ?? 0)
    const overall = Math.round(scores.reduce((s, v) => s + v, 0) * 2.5)

    setResults({ cpu, render, download, latency, overall })
    setStatus('done')
    setPhase(null)
    runningRef.current = false
  }, [])

  return (
    <div className="bb-wrap">

      {/* ── Device Info ── */}
      <div className="bb-device-panel">
        <div className="bb-device-title">Device Info</div>
        <div className="bb-device-grid">
          <InfoItem label="Browser"    value={deviceInfo.browser} />
          <InfoItem label="OS"         value={deviceInfo.os} />
          <InfoItem label="Threads"    value={deviceInfo.threads} />
          <InfoItem label="Resolution" value={`${deviceInfo.res} @${deviceInfo.dpr}×`} />
          <InfoItem label="Touch"      value={deviceInfo.touch ? 'Yes' : 'No'} />
          <InfoItem label="GPU"        value={deviceInfo.gpu} wide />
        </div>
      </div>

      {/* ── Scores ── */}
      <div className="bb-scores">

        {/* Overall ring */}
        <div className="bb-overall">
          <div
            className="bb-overall-ring"
            style={{
              '--ring-color': results ? scoreColor(results.overall / 10) : '#374151',
              '--ring-pct':   results ? `${(results.overall / 1000) * 100}%` : '0%',
            }}
          >
            <div className="bb-overall-inner">
              {results ? (
                <>
                  <span className="bb-overall-num">{results.overall}</span>
                  <span className="bb-overall-label" style={{ color: scoreColor(results.overall / 10) }}>
                    {overallLabel(results.overall)}
                  </span>
                </>
              ) : status === 'running' ? (
                <span className="bb-btn-spinner" style={{ width: 28, height: 28 }} />
              ) : (
                <span className="bb-overall-idle">Score</span>
              )}
            </div>
          </div>
          <p className="bb-overall-caption">/ 1000</p>
        </div>

        {/* Metric cards */}
        <div className="bb-metrics">
          {PHASES.map((p) => {
            const m       = META[p]
            const isActive = phase === p && status === 'running'
            const r        = results?.[p]
            let display = '—'
            if (r) {
              if (p === 'cpu')      display = r.ops.toLocaleString()
              if (p === 'render')   display = r.fps
              if (p === 'download') display = r.mbps
              if (p === 'latency')  display = r.ms
            }
            return (
              <div key={p} className={`bb-metric-card ${isActive ? 'bb-mc-active' : ''}`}>
                <div className="bb-mc-head">
                  <span className="bb-mc-icon">{m.icon}</span>
                  <span className="bb-mc-label">{m.label}</span>
                  {r && (
                    <span className="bb-mc-score" style={{ color: scoreColor(r.score) }}>
                      {r.score}/100
                    </span>
                  )}
                </div>
                <div className="bb-mc-value">
                  {isActive
                    ? <span className="bb-btn-spinner" />
                    : <>
                        <span className="bb-mc-num">{display}</span>
                        {r && <span className="bb-mc-unit">{m.unit}</span>}
                      </>
                  }
                </div>
                <div className="bb-mc-bar-wrap">
                  <div
                    className="bb-mc-bar"
                    style={{
                      width:      r ? `${r.score}%` : '0%',
                      background: r ? scoreColor(r.score) : 'transparent',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Button ── */}
      <div className="bb-btn-wrap">
        <button
          className={`bb-btn ${status === 'running' ? 'bb-btn--running' : ''}`}
          onClick={runBenchmark}
          disabled={status === 'running'}
        >
          {status === 'running' ? (
            <><span className="bb-btn-spinner" /> Running — {META[phase]?.label ?? '…'}</>
          ) : status === 'done' ? 'Run Again' : 'Run Benchmark'}
        </button>
        {status === 'idle' && (
          <p className="bb-disclaimer">~3 seconds · runs entirely in your browser</p>
        )}
      </div>

    </div>
  )
}

function InfoItem({ label, value, wide }) {
  return (
    <div className={`bb-di ${wide ? 'bb-di--wide' : ''}`}>
      <span className="bb-di-label">{label}</span>
      <span className={`bb-di-val ${wide ? 'bb-di-val--sm' : ''}`}>{value}</span>
    </div>
  )
}
