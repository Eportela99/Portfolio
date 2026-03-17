import { useState, useRef, useCallback } from 'react'
import './NetworkSpeedTest.css'

const DOWNLOAD_URL = '/bench.bin'           // 1 MB static file
const PING_URL     = '/bench-ping.json'
const UPLOAD_URL   = '/api/upload-test'
const UPLOAD_SIZE  = 1 * 1024 * 1024       // 1 MB

/* ── Tests ───────────────────────────────────────────── */
async function measureDownload() {
  const runs = []
  // 3 runs for accuracy
  for (let i = 0; i < 3; i++) {
    const t0  = performance.now()
    const res = await fetch(DOWNLOAD_URL + '?r=' + i + '&t=' + Date.now(), { cache: 'no-store' })
    const buf = await res.arrayBuffer()
    const ms  = performance.now() - t0
    runs.push((buf.byteLength * 8) / (ms / 1000) / 1_000_000)
  }
  // Average of best 2
  runs.sort((a, b) => b - a)
  const mbps = (runs[0] + runs[1]) / 2
  return +mbps.toFixed(2)
}

async function measureUpload() {
  // Generate 1 MB of random-ish bytes client-side (no static file needed)
  const buf  = new Uint8Array(UPLOAD_SIZE)
  crypto.getRandomValues(buf.slice(0, Math.min(65536, UPLOAD_SIZE))) // seed first 64KB
  const blob = new Blob([buf], { type: 'application/octet-stream' })

  const runs = []
  for (let i = 0; i < 2; i++) {
    const t0 = performance.now()
    await fetch(UPLOAD_URL + '?r=' + i, {
      method: 'POST',
      body:   blob,
      cache:  'no-store',
    })
    const ms = performance.now() - t0
    runs.push((UPLOAD_SIZE * 8) / (ms / 1000) / 1_000_000)
  }
  const mbps = (runs[0] + runs[1]) / 2
  return +mbps.toFixed(2)
}

async function measurePingJitter() {
  const times = []
  for (let i = 0; i < 8; i++) {
    const t0 = performance.now()
    await fetch(PING_URL + '?t=' + Date.now() + i, { cache: 'no-store' })
    times.push(performance.now() - t0)
  }
  times.sort((a, b) => a - b)
  // Drop fastest + slowest outliers
  const trimmed = times.slice(1, 7)
  const avg     = trimmed.reduce((s, v) => s + v, 0) / trimmed.length
  const jitter  = Math.sqrt(
    trimmed.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / trimmed.length
  )
  return { ping: +avg.toFixed(1), jitter: +jitter.toFixed(1) }
}

/* ── Quality helpers ─────────────────────────────────── */
function dlQuality(mbps) {
  if (mbps >= 100) return { label: 'Excellent', color: '#34d399' }
  if (mbps >= 25)  return { label: 'Good',      color: '#34d399' }
  if (mbps >= 5)   return { label: 'OK',         color: '#fbbf24' }
  return              { label: 'Slow',      color: '#f87171' }
}

function ulQuality(mbps) {
  if (mbps >= 50)  return { label: 'Excellent', color: '#34d399' }
  if (mbps >= 10)  return { label: 'Good',      color: '#34d399' }
  if (mbps >= 2)   return { label: 'OK',         color: '#fbbf24' }
  return              { label: 'Slow',      color: '#f87171' }
}

function pingQuality(ms) {
  if (ms < 20)   return { label: 'Excellent', color: '#34d399' }
  if (ms < 60)   return { label: 'Good',      color: '#34d399' }
  if (ms < 150)  return { label: 'Average',   color: '#fbbf24' }
  return           { label: 'High',      color: '#f87171' }
}

function jitterQuality(ms) {
  if (ms < 5)   return { label: 'Stable',    color: '#34d399' }
  if (ms < 15)  return { label: 'Good',      color: '#34d399' }
  if (ms < 40)  return { label: 'Variable',  color: '#fbbf24' }
  return          { label: 'Unstable',  color: '#f87171' }
}

/* ── Gauge arc ───────────────────────────────────────── */
function SpeedGauge({ value, max, color, label, unit }) {
  const pct    = Math.min(1, (value ?? 0) / max)
  const radius = 46
  const circ   = Math.PI * radius          // half circle
  const dash   = pct * circ

  return (
    <div className="nst-gauge">
      <svg viewBox="0 0 110 60" className="nst-gauge-svg">
        {/* Track */}
        <path
          d={`M 7 55 A ${radius} ${radius} 0 0 1 103 55`}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={`M 7 55 A ${radius} ${radius} 0 0 1 103 55`}
          fill="none"
          stroke={color || '#374151'}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.4s' }}
        />
      </svg>
      <div className="nst-gauge-center">
        <span className="nst-gauge-val">{value ?? '—'}</span>
        {value != null && <span className="nst-gauge-unit">{unit}</span>}
      </div>
      <div className="nst-gauge-label">{label}</div>
    </div>
  )
}

/* ── Stat pill ───────────────────────────────────────── */
function StatPill({ icon, label, value, unit, quality }) {
  return (
    <div className="nst-stat">
      <span className="nst-stat-icon">{icon}</span>
      <div className="nst-stat-body">
        <span className="nst-stat-label">{label}</span>
        <span className="nst-stat-val">
          {value != null ? <>{value}<span className="nst-stat-unit"> {unit}</span></> : '—'}
        </span>
      </div>
      {quality && (
        <span className="nst-stat-badge" style={{ color: quality.color, borderColor: quality.color }}>
          {quality.label}
        </span>
      )}
    </div>
  )
}

/* ── Phases ─────────────────────────────────────────── */
const PHASES = ['ping', 'download', 'upload']
const PHASE_LABEL = { ping: 'Testing latency', download: 'Measuring download', upload: 'Measuring upload' }

/* ── Main Component ─────────────────────────────────── */
export default function NetworkSpeedTest() {
  const [status,  setStatus]  = useState('idle')
  const [phase,   setPhase]   = useState(null)
  const [res,     setRes]     = useState(null)
  const runRef = useRef(false)

  const runTest = useCallback(async () => {
    if (runRef.current) return
    runRef.current = true
    setStatus('running')
    setRes(null)

    const safe = async (fn) => { try { return await fn() } catch { return null } }

    setPhase('ping')
    const pingData = await safe(measurePingJitter)

    setPhase('download')
    const dlMbps = await safe(measureDownload)

    setPhase('upload')
    const ulMbps = await safe(measureUpload)

    setRes({
      ping:     pingData?.ping   ?? null,
      jitter:   pingData?.jitter ?? null,
      download: dlMbps,
      upload:   ulMbps,
    })
    setStatus('done')
    setPhase(null)
    runRef.current = false
  }, [])

  const dl = res?.download
  const ul = res?.upload
  const ping   = res?.ping
  const jitter = res?.jitter

  return (
    <div className="nst-wrap">

      {/* ── Gauges ── */}
      <div className="nst-gauges">
        <SpeedGauge
          value={dl}
          max={500}
          color={dl ? dlQuality(dl).color : undefined}
          label="Download"
          unit="Mbps"
        />
        <SpeedGauge
          value={ul}
          max={200}
          color={ul ? ulQuality(ul).color : undefined}
          label="Upload"
          unit="Mbps"
        />
      </div>

      {/* ── Stats row ── */}
      <div className="nst-stats">
        <StatPill
          icon="📡"
          label="Ping"
          value={ping}
          unit="ms"
          quality={ping != null ? pingQuality(ping) : null}
        />
        <StatPill
          icon="📶"
          label="Jitter"
          value={jitter}
          unit="ms"
          quality={jitter != null ? jitterQuality(jitter) : null}
        />
        {dl != null && (
          <StatPill
            icon="⬇️"
            label="Download"
            value={dl}
            unit="Mbps"
            quality={dlQuality(dl)}
          />
        )}
        {ul != null && (
          <StatPill
            icon="⬆️"
            label="Upload"
            value={ul}
            unit="Mbps"
            quality={ulQuality(ul)}
          />
        )}
      </div>

      {/* ── Button ── */}
      <div className="nst-btn-wrap">
        <button
          className={`bb-btn ${status === 'running' ? 'bb-btn--running' : ''}`}
          onClick={runTest}
          disabled={status === 'running'}
        >
          {status === 'running' ? (
            <><span className="bb-btn-spinner" /> {PHASE_LABEL[phase] ?? '…'}</>
          ) : status === 'done' ? 'Test Again' : 'Start Speed Test'}
        </button>
        {status === 'idle' && (
          <p className="bb-disclaimer">Tests run to your Vercel edge server · ~10 seconds</p>
        )}
      </div>

    </div>
  )
}
