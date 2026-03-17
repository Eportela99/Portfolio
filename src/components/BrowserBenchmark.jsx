import { useState, useRef, useCallback } from 'react'
import './BrowserBenchmark.css'

const BENCH_BIN = '/bench.bin'
const BENCH_PING = '/bench-ping.json'

function getDeviceInfo() {
  const ua = navigator.userAgent
  let browser = 'Unknown'
  if (/Edg\//.test(ua)) browser = 'Edge'
  else if (/OPR\//.test(ua)) browser = 'Opera'
  else if (/Chrome\//.test(ua)) browser = 'Chrome'
  else if (/Firefox\//.test(ua)) browser = 'Firefox'
  else if (/Safari\//.test(ua)) browser = 'Safari'

  let os = 'Unknown'
  if (/Windows/.test(ua)) os = 'Windows'
  else if (/Mac OS X/.test(ua)) os = 'macOS'
  else if (/Android/.test(ua)) os = 'Android'
  else if (/iPhone|iPad/.test(ua)) os = 'iOS'
  else if (/Linux/.test(ua)) os = 'Linux'

  const cores = navigator.hardwareConcurrency || 'N/A'
  const dpr = window.devicePixelRatio || 1
  const res = `${screen.width}×${screen.height}`

  let gpu = 'N/A'
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info')
      if (ext) {
        const full = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || ''
        // Strip verbose vendor prefixes
        gpu = full.replace(/\s*\(.*\)/, '').trim() || 'N/A'
      }
    }
  } catch (_) {}

  return { browser, os, cores, dpr, res, gpu }
}

function runCPUTest() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const duration = 500
      const start = performance.now()
      let ops = 0
      while (performance.now() - start < duration) {
        Math.sqrt(Math.sin(ops) * Math.cos(ops))
        ops++
      }
      // Calibrate: ~10M ops/s = score 100
      const score = Math.min(100, Math.round((ops / 10_000_000) * 100))
      resolve({ ops, score })
    }, 50)
  })
}

function runRenderTest() {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    let frames = 0
    const duration = 1000
    const start = performance.now()

    function draw() {
      const now = performance.now()
      if (now - start >= duration) {
        const fps = Math.round((frames / (now - start)) * 1000)
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
          0,
          Math.PI * 2
        )
        ctx.fillStyle = `hsl(${i * 4}, 70%, 55%)`
        ctx.fill()
      }
      frames++
      requestAnimationFrame(draw)
    }
    requestAnimationFrame(draw)
  })
}

async function runDownloadTest() {
  const start = performance.now()
  const res = await fetch(BENCH_BIN, { cache: 'no-store' })
  const blob = await res.blob()
  const elapsed = (performance.now() - start) / 1000
  const mbps = (blob.size * 8) / (elapsed * 1_000_000)
  // 100 Mbps = score 100
  const score = Math.min(100, Math.round((mbps / 100) * 100))
  return { mbps: +mbps.toFixed(1), score }
}

async function runLatencyTest() {
  const times = []
  for (let i = 0; i < 5; i++) {
    const t0 = performance.now()
    await fetch(BENCH_PING + '?t=' + Date.now(), { cache: 'no-store' })
    times.push(performance.now() - t0)
  }
  times.sort((a, b) => a - b)
  const avg = times.slice(0, 4).reduce((s, v) => s + v, 0) / 4
  const ms = +avg.toFixed(1)
  // <10ms = 100, >200ms = 0
  const score = Math.max(0, Math.min(100, Math.round(((200 - ms) / 190) * 100)))
  return { ms, score }
}

const PHASES = ['cpu', 'render', 'download', 'latency']
const PHASE_LABELS = {
  cpu: 'CPU Score',
  render: 'Render FPS',
  download: 'Download',
  latency: 'Latency',
}

export default function BrowserBenchmark() {
  const [status, setStatus] = useState('idle') // idle | running | done
  const [phase, setPhase] = useState(null)
  const [results, setResults] = useState(null)
  const [deviceInfo] = useState(() => getDeviceInfo())
  const runningRef = useRef(false)

  const runBenchmark = useCallback(async () => {
    if (runningRef.current) return
    runningRef.current = true
    setStatus('running')
    setResults(null)

    try {
      setPhase('cpu')
      const cpu = await runCPUTest()

      setPhase('render')
      const render = await runRenderTest()

      setPhase('download')
      const download = await runDownloadTest()

      setPhase('latency')
      const latency = await runLatencyTest()

      const overall = Math.round(
        (cpu.score + render.score + download.score + latency.score) * 2.5
      )

      setResults({ cpu, render, download, latency, overall })
      setStatus('done')
      setPhase(null)
    } catch (err) {
      console.error(err)
      setStatus('idle')
      setPhase(null)
    } finally {
      runningRef.current = false
    }
  }, [])

  const getScoreColor = (score) => {
    if (score >= 80) return '#34d399'
    if (score >= 50) return '#fbbf24'
    return '#f87171'
  }

  const getOverallLabel = (score) => {
    if (score >= 850) return 'Excellent'
    if (score >= 650) return 'Good'
    if (score >= 400) return 'Average'
    return 'Low'
  }

  return (
    <div className="bb-wrap">
      {/* Device Info Panel */}
      <div className="bb-device-panel fade-in">
        <div className="bb-device-title">Device Info</div>
        <div className="bb-device-grid">
          <div className="bb-device-item">
            <span className="bb-device-label">Browser</span>
            <span className="bb-device-val">{deviceInfo.browser}</span>
          </div>
          <div className="bb-device-item">
            <span className="bb-device-label">OS</span>
            <span className="bb-device-val">{deviceInfo.os}</span>
          </div>
          <div className="bb-device-item">
            <span className="bb-device-label">CPU Cores</span>
            <span className="bb-device-val">{deviceInfo.cores}</span>
          </div>
          <div className="bb-device-item">
            <span className="bb-device-label">Resolution</span>
            <span className="bb-device-val">{deviceInfo.res} @{deviceInfo.dpr}x</span>
          </div>
          <div className="bb-device-item bb-device-item--wide">
            <span className="bb-device-label">GPU</span>
            <span className="bb-device-val bb-device-val--gpu">{deviceInfo.gpu}</span>
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="bb-scores">
        {/* Overall */}
        <div className="bb-overall fade-in">
          <div className="bb-overall-ring" style={{
            '--score-color': results ? getScoreColor(results.overall / 10) : '#4b5563',
            '--score-pct': results ? `${(results.overall / 1000) * 100}%` : '0%',
          }}>
            <div className="bb-overall-inner">
              {results ? (
                <>
                  <span className="bb-overall-num">{results.overall}</span>
                  <span className="bb-overall-label">{getOverallLabel(results.overall)}</span>
                </>
              ) : status === 'running' ? (
                <span className="bb-overall-running">...</span>
              ) : (
                <span className="bb-overall-idle">Score</span>
              )}
            </div>
          </div>
          <div className="bb-overall-caption">Overall Score / 1000</div>
        </div>

        {/* Individual metrics */}
        <div className="bb-metrics">
          {PHASES.map((p) => {
            const isActive = phase === p && status === 'running'
            const isDone = results !== null
            const r = results?.[p]

            let value = '—'
            let unit = ''
            if (isDone && r) {
              if (p === 'cpu') { value = r.ops.toLocaleString(); unit = 'ops' }
              if (p === 'render') { value = r.fps; unit = 'fps' }
              if (p === 'download') { value = r.mbps; unit = 'Mbps' }
              if (p === 'latency') { value = r.ms; unit = 'ms' }
            }

            return (
              <div
                key={p}
                className={`bb-metric-card fade-in ${isActive ? 'bb-metric-active' : ''}`}
              >
                <div className="bb-metric-header">
                  <span className="bb-metric-label">{PHASE_LABELS[p]}</span>
                  {isDone && r && (
                    <span
                      className="bb-metric-score"
                      style={{ color: getScoreColor(r.score) }}
                    >
                      {r.score}/100
                    </span>
                  )}
                </div>

                <div className="bb-metric-value">
                  {isActive ? (
                    <span className="bb-metric-spinner" />
                  ) : (
                    <>
                      <span className="bb-metric-num">{value}</span>
                      {unit && <span className="bb-metric-unit">{unit}</span>}
                    </>
                  )}
                </div>

                {isDone && r && (
                  <div className="bb-metric-bar-wrap">
                    <div
                      className="bb-metric-bar"
                      style={{
                        width: `${r.score}%`,
                        background: getScoreColor(r.score),
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Run Button */}
      <div className="bb-btn-wrap">
        <button
          className={`bb-btn ${status === 'running' ? 'bb-btn--running' : ''}`}
          onClick={runBenchmark}
          disabled={status === 'running'}
        >
          {status === 'running' ? (
            <>
              <span className="bb-btn-spinner" />
              Running {phase ? `— ${PHASE_LABELS[phase]}` : ''}…
            </>
          ) : status === 'done' ? (
            'Run Again'
          ) : (
            'Run Benchmark'
          )}
        </button>
        {status === 'idle' && (
          <p className="bb-disclaimer">~3 seconds · no data leaves your device</p>
        )}
      </div>
    </div>
  )
}
