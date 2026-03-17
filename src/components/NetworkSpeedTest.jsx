import { useState, useRef, useCallback } from 'react'
import './NetworkSpeedTest.css'

const DOWNLOAD_URL = '/bench-5m.bin'
const PING_URL     = '/bench-ping.json'
const UPLOAD_URL   = '/api/upload-test'
const UL_SIZE      = 512 * 1024   // 512 KB per upload stream
const UL_STREAMS   = 3
const DL_STREAMS   = 3

const uid = () => Math.random().toString(36).slice(2)

/* ── Stream a fetch response and count bytes without buffering all in memory ── */
async function streamBytes(url) {
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error('HTTP ' + res.status)

  // Use ReadableStream (all modern browsers) to avoid a 5 MB ArrayBuffer spike
  if (res.body?.getReader) {
    const reader = res.body.getReader()
    let bytes = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value?.byteLength ?? 0
    }
    return bytes
  }
  // Fallback (old Safari): ArrayBuffer is fine for a single stream
  return (await res.arrayBuffer()).byteLength
}

/* ── Tests ── */
async function measurePingJitter() {
  const times = []
  for (let i = 0; i < 8; i++) {
    const t0 = performance.now()
    await fetch(`${PING_URL}?${uid()}`, { cache: 'no-store' })
    times.push(performance.now() - t0)
  }
  times.sort((a, b) => a - b)
  const trimmed = times.slice(1, 7)   // drop min + max
  const avg    = trimmed.reduce((s, v) => s + v, 0) / trimmed.length
  const jitter = Math.sqrt(trimmed.reduce((s, v) => s + (v - avg) ** 2, 0) / trimmed.length)
  return { ping: +avg.toFixed(1), jitter: +jitter.toFixed(1) }
}

async function measureDownload() {
  // Single warm-up to open connection
  await fetch(`${PING_URL}?w=${uid()}`, { cache: 'no-store' })

  const t0 = performance.now()
  const byteCounts = await Promise.all(
    Array.from({ length: DL_STREAMS }, () => streamBytes(`${DOWNLOAD_URL}?${uid()}`))
  )
  const elapsed    = (performance.now() - t0) / 1000
  const totalBytes = byteCounts.reduce((s, b) => s + b, 0)
  const mbps       = (totalBytes * 8) / elapsed / 1_000_000

  if (!isFinite(mbps) || mbps <= 0 || mbps > 2000) return null
  return +mbps.toFixed(2)
}

async function measureUpload() {
  await fetch(`${PING_URL}?w=${uid()}`, { cache: 'no-store' })

  // Build upload payload in 65536-byte chunks (browser crypto limit)
  const buf = new Uint8Array(UL_SIZE)
  for (let i = 0; i < buf.length; i += 65536) {
    crypto.getRandomValues(buf.subarray(i, Math.min(i + 65536, buf.length)))
  }

  const t0 = performance.now()
  await Promise.all(
    Array.from({ length: UL_STREAMS }, () =>
      fetch(`${UPLOAD_URL}?${uid()}`, {
        method: 'POST',
        body:   new Blob([buf]),
        cache:  'no-store',
      })
    )
  )
  const elapsed    = (performance.now() - t0) / 1000
  const totalBytes = UL_STREAMS * UL_SIZE
  const mbps       = (totalBytes * 8) / elapsed / 1_000_000

  if (!isFinite(mbps) || mbps <= 0 || mbps > 2000) return null
  return +mbps.toFixed(2)
}

/* ── Quality labels ── */
const quality = {
  dl:     (v) => v >= 100 ? ['Excellent','#34d399'] : v >= 25 ? ['Good','#34d399'] : v >= 5 ? ['OK','#fbbf24'] : ['Slow','#f87171'],
  ul:     (v) => v >= 50  ? ['Excellent','#34d399'] : v >= 10 ? ['Good','#34d399'] : v >= 2 ? ['OK','#fbbf24'] : ['Slow','#f87171'],
  ping:   (v) => v < 20   ? ['Excellent','#34d399'] : v < 60  ? ['Good','#34d399'] : v < 150 ? ['Average','#fbbf24'] : ['High','#f87171'],
  jitter: (v) => v < 5    ? ['Stable',  '#34d399'] : v < 15  ? ['Good','#34d399'] : v < 40  ? ['Variable','#fbbf24'] : ['Unstable','#f87171'],
}

/* ── SVG half-circle gauge ── */
function Gauge({ value, max, color, label, unit }) {
  const pct  = Math.min(1, (value ?? 0) / max)
  const R    = 46
  const arc  = Math.PI * R
  const dash = pct * arc

  return (
    <div className="nst-gauge">
      <svg viewBox="0 0 110 62" className="nst-gauge-svg">
        <path d={`M7,55 A${R},${R} 0 0,1 103,55`}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="9" strokeLinecap="round" />
        <path d={`M7,55 A${R},${R} 0 0,1 103,55`}
          fill="none"
          stroke={color ?? '#374151'}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${arc}`}
          style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1), stroke 0.4s' }}
        />
      </svg>
      <div className="nst-gauge-center">
        {value != null
          ? <><span className="nst-gauge-val">{value}</span><span className="nst-gauge-unit">{unit}</span></>
          : <span className="nst-gauge-idle">—</span>}
      </div>
      <div className="nst-gauge-label">{label}</div>
    </div>
  )
}

/* ── Stat pill ── */
function Pill({ icon, label, value, unit, q }) {
  const [qlabel, qcolor] = q && value != null ? q(value) : []
  return (
    <div className="nst-stat">
      <span className="nst-stat-icon">{icon}</span>
      <div className="nst-stat-body">
        <span className="nst-stat-label">{label}</span>
        <span className="nst-stat-val">
          {value != null ? <>{value}<span className="nst-stat-unit"> {unit}</span></> : '—'}
        </span>
      </div>
      {qlabel && <span className="nst-stat-badge" style={{ color: qcolor, borderColor: qcolor }}>{qlabel}</span>}
    </div>
  )
}

/* ── Main ── */
export default function NetworkSpeedTest() {
  const [status, setStatus] = useState('idle')
  const [phase,  setPhase]  = useState(null)
  const [res,    setRes]    = useState(null)
  const [error,  setError]  = useState(null)
  const busy = useRef(false)

  const runTest = useCallback(async () => {
    if (busy.current) return
    busy.current = true
    setStatus('running')
    setRes(null)
    setError(null)

    try {
      const safe = async (fn) => { try { return await fn() } catch (e) { console.warn(e); return null } }

      setPhase('ping')
      const pingData = await safe(measurePingJitter)

      setPhase('download')
      const dl = await safe(measureDownload)

      setPhase('upload')
      const ul = await safe(measureUpload)

      setRes({ ping: pingData?.ping ?? null, jitter: pingData?.jitter ?? null, dl, ul })
      setStatus('done')
    } catch (e) {
      console.error(e)
      setError('Test failed — check your connection and try again.')
      setStatus('idle')
    } finally {
      setPhase(null)
      busy.current = false
    }
  }, [])

  const phaseLabel = {
    ping:     'Measuring latency…',
    download: 'Measuring download…',
    upload:   'Measuring upload…',
  }

  return (
    <div className="nst-wrap">

      <div className="nst-gauges">
        <Gauge value={res?.dl} max={500} color={res?.dl != null ? quality.dl(res.dl)[1] : undefined} label="Download" unit="Mbps" />
        <Gauge value={res?.ul} max={200} color={res?.ul != null ? quality.ul(res.ul)[1] : undefined} label="Upload"   unit="Mbps" />
      </div>

      <div className="nst-stats">
        <Pill icon="📡" label="Ping"     value={res?.ping}   unit="ms"   q={quality.ping}   />
        <Pill icon="📶" label="Jitter"   value={res?.jitter} unit="ms"   q={quality.jitter} />
        <Pill icon="⬇️" label="Download" value={res?.dl}     unit="Mbps" q={quality.dl}     />
        <Pill icon="⬆️" label="Upload"   value={res?.ul}     unit="Mbps" q={quality.ul}     />
      </div>

      {status === 'running' && (
        <p className="nst-note">
          <span className="bb-btn-spinner" style={{ width: 10, height: 10 }} />
          {phaseLabel[phase] ?? '…'}
        </p>
      )}

      {error && <p className="nst-error">{error}</p>}

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
        {status === 'idle' && !error && (
          <p className="bb-disclaimer">{DL_STREAMS} parallel streams · {(DL_STREAMS * 5).toFixed(0)} MB download · ~15s</p>
        )}
      </div>

    </div>
  )
}
