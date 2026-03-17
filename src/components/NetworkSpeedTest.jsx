import { useState, useRef, useCallback } from 'react'
import './NetworkSpeedTest.css'

const DOWNLOAD_URL = '/bench-5m.bin'   // 5 MB per stream
const PING_URL     = '/bench-ping.json'
const UPLOAD_URL   = '/api/upload-test'

const DL_PARALLEL  = 4   // simultaneous download streams
const UL_PARALLEL  = 4   // simultaneous upload streams
const UL_CHUNK     = 1 * 1024 * 1024  // 1 MB per upload stream

/* ── Tests ───────────────────────────────────────────── */

/**
 * Download: DL_PARALLEL concurrent fetches of DOWNLOAD_URL, each 5 MB.
 * Measures wall-clock time from start to when all finish.
 * Total bytes transferred / elapsed = actual throughput.
 */
// Unique token per test run so Safari can't serve from cache
const token = () => Math.random().toString(36).slice(2) + Date.now()

// Sanity-check a measured Mbps — returns null if result looks like a cache hit
function sanitize(mbps, totalBytes) {
  if (!isFinite(mbps) || mbps <= 0) return null
  // If Safari served from cache, the transfer completes in < 20ms for 5MB+.
  // That equates to > ~2000 Mbps which is unreachable on consumer hardware.
  if (mbps > 2000) return null
  return +mbps.toFixed(2)
}

async function measureDownload() {
  // Warm-up: open a connection first so we don't measure TCP handshake
  await fetch('/bench-ping.json?w=' + token(), { cache: 'no-store' })

  const t0 = performance.now()
  const sizes = await Promise.all(
    Array.from({ length: DL_PARALLEL }, () =>
      fetch(DOWNLOAD_URL + '?' + token(), { cache: 'no-store' })
        .then(r => r.arrayBuffer())
        .then(buf => buf.byteLength)
    )
  )
  const elapsed    = (performance.now() - t0) / 1000
  const totalBytes = sizes.reduce((s, b) => s + b, 0)
  const mbps       = (totalBytes * 8) / elapsed / 1_000_000
  return sanitize(mbps, totalBytes)
}

async function measureUpload() {
  await fetch('/bench-ping.json?w=' + token(), { cache: 'no-store' })

  // crypto.getRandomValues is limited to 65536 bytes per call — fill in chunks
  const buf = new Uint8Array(UL_CHUNK)
  for (let i = 0; i < buf.length; i += 65536) {
    crypto.getRandomValues(buf.subarray(i, i + 65536))
  }
  const blob = new Blob([buf], { type: 'application/octet-stream' })

  const t0 = performance.now()
  await Promise.all(
    Array.from({ length: UL_PARALLEL }, () =>
      fetch(UPLOAD_URL + '?' + token(), {
        method: 'POST',
        body:   blob.slice(0),   // force a fresh read each time
        cache:  'no-store',
      })
    )
  )
  const elapsed    = (performance.now() - t0) / 1000
  const totalBytes = UL_PARALLEL * UL_CHUNK
  const mbps       = (totalBytes * 8) / elapsed / 1_000_000
  return sanitize(mbps, totalBytes)
}

/**
 * Ping + Jitter: 10 sequential tiny requests.
 * Drop fastest + slowest, average the rest.
 * Jitter = standard deviation of trimmed set.
 */
async function measurePingJitter() {
  const times = []
  for (let i = 0; i < 10; i++) {
    const t0 = performance.now()
    await fetch(PING_URL + '?t=' + Date.now() + i, { cache: 'no-store' })
    times.push(performance.now() - t0)
  }
  times.sort((a, b) => a - b)
  const trimmed = times.slice(1, 9)  // drop min + max
  const avg     = trimmed.reduce((s, v) => s + v, 0) / trimmed.length
  const jitter  = Math.sqrt(
    trimmed.reduce((s, v) => s + (v - avg) ** 2, 0) / trimmed.length
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

/* ── SVG Gauge ───────────────────────────────────────── */
function SpeedGauge({ value, max, color, label, unit }) {
  const pct  = Math.min(1, (value ?? 0) / max)
  const R    = 46
  const arc  = Math.PI * R   // half-circle circumference
  const dash = pct * arc

  return (
    <div className="nst-gauge">
      <svg viewBox="0 0 110 62" className="nst-gauge-svg">
        <path d={`M7,55 A${R},${R} 0 0,1 103,55`}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" strokeLinecap="round" />
        <path d={`M7,55 A${R},${R} 0 0,1 103,55`}
          fill="none"
          stroke={color || '#374151'}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${arc}`}
          style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.4s' }}
        />
      </svg>
      <div className="nst-gauge-center">
        {value != null
          ? <>
              <span className="nst-gauge-val">{value}</span>
              <span className="nst-gauge-unit">{unit}</span>
            </>
          : <span className="nst-gauge-idle">—</span>
        }
      </div>
      <div className="nst-gauge-label">{label}</div>
    </div>
  )
}

/* ── Stat Pill ───────────────────────────────────────── */
function StatPill({ icon, label, value, unit, quality }) {
  return (
    <div className="nst-stat">
      <span className="nst-stat-icon">{icon}</span>
      <div className="nst-stat-body">
        <span className="nst-stat-label">{label}</span>
        <span className="nst-stat-val">
          {value != null
            ? <>{value}<span className="nst-stat-unit"> {unit}</span></>
            : '—'}
        </span>
      </div>
      {quality && value != null && (
        <span className="nst-stat-badge" style={{ color: quality.color, borderColor: quality.color }}>
          {quality.label}
        </span>
      )}
    </div>
  )
}

/* ── Animated meter bar during test ─────────────────── */
function LiveBar({ active, color }) {
  return (
    <div className="nst-live-bar">
      <div className={`nst-live-fill ${active ? 'nst-live-fill--active' : ''}`}
        style={{ '--bar-color': color }} />
    </div>
  )
}

/* ── Phases ─────────────────────────────────────────── */
const PHASES  = ['ping', 'download', 'upload']
const P_LABEL = {
  ping:     'Measuring latency & jitter',
  download: `Testing download (${DL_PARALLEL} parallel streams)`,
  upload:   `Testing upload (${UL_PARALLEL} parallel streams)`,
}

/* ── Component ───────────────────────────────────────── */
export default function NetworkSpeedTest() {
  const [status, setStatus] = useState('idle')
  const [phase,  setPhase]  = useState(null)
  const [res,    setRes]    = useState(null)
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
        {phase === 'download' && status === 'running' && (
          <LiveBar active color="#00d4ff" />
        )}
        <SpeedGauge
          value={ul}
          max={200}
          color={ul ? ulQuality(ul).color : undefined}
          label="Upload"
          unit="Mbps"
        />
        {phase === 'upload' && status === 'running' && (
          <LiveBar active color="#a78bfa" />
        )}
      </div>

      {/* ── Stats ── */}
      <div className="nst-stats">
        <StatPill icon="📡" label="Ping"     value={res?.ping}   unit="ms"   quality={res?.ping   != null ? pingQuality(res.ping)     : null} />
        <StatPill icon="📶" label="Jitter"   value={res?.jitter} unit="ms"   quality={res?.jitter != null ? jitterQuality(res.jitter) : null} />
        <StatPill icon="⬇️" label="Download" value={dl}           unit="Mbps" quality={dl          != null ? dlQuality(dl)             : null} />
        <StatPill icon="⬆️" label="Upload"   value={ul}           unit="Mbps" quality={ul          != null ? ulQuality(ul)             : null} />
      </div>

      {/* ── Note ── */}
      {status !== 'idle' && (
        <p className="nst-note">
          {status === 'running'
            ? <>
                <span className="bb-btn-spinner" style={{ width: 10, height: 10, marginRight: 6 }} />
                {P_LABEL[phase] ?? '…'}
              </>
            : `Tested via ${DL_PARALLEL} parallel streams · ${DL_PARALLEL * 5} MB downloaded · ${UL_PARALLEL} MB uploaded`
          }
        </p>
      )}

      {/* ── Button ── */}
      <div className="nst-btn-wrap">
        <button
          className={`bb-btn ${status === 'running' ? 'bb-btn--running' : ''}`}
          onClick={runTest}
          disabled={status === 'running'}
        >
          {status === 'running'
            ? <><span className="bb-btn-spinner" /> Testing…</>
            : status === 'done' ? 'Test Again' : 'Start Speed Test'}
        </button>
        {status === 'idle' && (
          <p className="bb-disclaimer">
            {DL_PARALLEL} parallel streams · {DL_PARALLEL * 5} MB download · {UL_PARALLEL} MB upload · ~15s
          </p>
        )}
      </div>

    </div>
  )
}
