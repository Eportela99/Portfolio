import { useState } from 'react'
import './GitTreeDemo.css'

const COL_COLORS = ['#00D4AA', '#5AC8FA', '#BF5AF2', '#F5A623']
const COL_WIDTH = 14
const ROW_HEIGHT = 46
const GRAPH_START = 8

const BRANCHES = [
  { name: 'main', color: '#00D4AA', isHead: true },
  { name: 'feature/stash', color: '#5AC8FA', isHead: false },
  { name: 'hotfix/auth', color: '#BF5AF2', isHead: false },
]

// lineTop: lanes active arriving from above
// lineBottom: lanes active leaving to below
// parentBranch: target col when nodeCol lane closes (branch end)
const COMMITS = [
  {
    short: 'a1b2c3d',
    message: 'Add GitHub tab with PR & issue support',
    author: 'elportela',
    date: 'Mar 1',
    refs: [{ label: 'HEAD \u2192 main', type: 'head' }],
    col: 0,
    lineTop: [],
    lineBottom: [0],
    files: ['GitHubView.swift', 'GitHubService.swift', 'AppViewModel.swift'],
    additions: 847,
    deletions: 12,
  },
  {
    short: 'e5f6a7b',
    message: 'Fix detached HEAD banner detection',
    author: 'elportela',
    date: 'Feb 28',
    refs: [],
    col: 0,
    lineTop: [0],
    lineBottom: [0],
    files: ['GitService.swift', 'BranchSidebar.swift'],
    additions: 34,
    deletions: 18,
  },
  {
    short: 'c9d0e1f',
    message: "Merge branch 'feature/stash'",
    author: 'elportela',
    date: 'Feb 26',
    refs: [],
    col: 0,
    lineTop: [0],
    lineBottom: [0, 1],
    files: [],
    additions: 0,
    deletions: 0,
  },
  {
    short: 'g3h4i5j',
    message: 'Add stash manager with apply & drop',
    author: 'elportela',
    date: 'Feb 25',
    refs: [{ label: 'feature/stash', type: 'branch' }],
    col: 1,
    lineTop: [0, 1],
    lineBottom: [0, 1],
    files: ['StashView.swift', 'AppViewModel.swift', 'GitService.swift'],
    additions: 223,
    deletions: 5,
  },
  {
    short: 'k7l8m9n',
    message: 'Implement color-coded diff viewer',
    author: 'elportela',
    date: 'Feb 24',
    refs: [],
    col: 1,
    lineTop: [0, 1],
    lineBottom: [0],
    parentBranch: 0,
    files: ['DiffView.swift', 'Models.swift'],
    additions: 189,
    deletions: 8,
  },
  {
    short: 'o1p2q3r',
    message: 'Add visual commit graph with Canvas',
    author: 'elportela',
    date: 'Feb 22',
    refs: [],
    col: 0,
    lineTop: [0],
    lineBottom: [0],
    files: ['CommitHistoryView.swift', 'GitService.swift'],
    additions: 312,
    deletions: 44,
  },
  {
    short: 's5t6u7v',
    message: 'Initial project setup',
    author: 'elportela',
    date: 'Feb 20',
    refs: [{ label: 'tag: v1.0.0', type: 'tag' }],
    col: 0,
    lineTop: [0],
    lineBottom: [],
    files: ['GitTreeApp.swift', 'ContentView.swift', 'Models.swift'],
    additions: 520,
    deletions: 0,
  },
]

const CHANGED_FILES = [
  { name: 'ContentView.swift', status: 'M', staged: true },
  { name: 'AppViewModel.swift', status: 'M', staged: true },
  { name: 'NewFeature.swift', status: 'A', staged: false },
  { name: 'README.md', status: 'M', staged: false },
]

function cx(col) {
  return GRAPH_START + col * COL_WIDTH + COL_WIDTH / 2
}

function GraphSVG({ lineTop, lineBottom, nodeCol, isHead, parentBranch }) {
  const allCols = [nodeCol, ...lineTop, ...lineBottom]
  const maxCol = Math.max(...allCols, 0)
  const width = GRAPH_START + (maxCol + 1) * COL_WIDTH + 6
  const cy = ROW_HEIGHT / 2

  const otherThrough = lineTop.filter(c => lineBottom.includes(c) && c !== nodeCol)
  const otherTopOnly = lineTop.filter(c => !lineBottom.includes(c) && c !== nodeCol)
  const otherBottomOnly = lineBottom.filter(c => !lineTop.includes(c) && c !== nodeCol)
  const nodeEnds = lineTop.includes(nodeCol) && !lineBottom.includes(nodeCol)
  const mergeTarget = nodeEnds && parentBranch != null && parentBranch !== nodeCol ? parentBranch : null

  return (
    <svg width={width} height={ROW_HEIGHT} style={{ flexShrink: 0 }}>
      {/* Straight-through other lanes */}
      {otherThrough.map(col => (
        <line key={col}
          x1={cx(col)} y1={0} x2={cx(col)} y2={ROW_HEIGHT}
          stroke={COL_COLORS[col % COL_COLORS.length]}
          strokeWidth={1.5} opacity={0.4}
        />
      ))}
      {/* Other lanes arriving from top only (merging into node) */}
      {otherTopOnly.map(col => (
        <path key={col}
          d={`M ${cx(col)} 0 C ${cx(col)} ${cy * 0.55} ${cx(nodeCol)} ${cy * 0.55} ${cx(nodeCol)} ${cy - 5}`}
          stroke={COL_COLORS[col % COL_COLORS.length]}
          strokeWidth={1.5} fill="none" opacity={0.55}
        />
      ))}
      {/* New lanes opening below (branching from node) */}
      {otherBottomOnly.map(col => (
        <path key={col}
          d={`M ${cx(nodeCol)} ${cy + 5} C ${cx(nodeCol)} ${cy + (ROW_HEIGHT - cy) * 0.55} ${cx(col)} ${cy + (ROW_HEIGHT - cy) * 0.55} ${cx(col)} ${ROW_HEIGHT}`}
          stroke={COL_COLORS[col % COL_COLORS.length]}
          strokeWidth={1.5} fill="none" opacity={0.55}
        />
      ))}
      {/* Node lane: top half */}
      {lineTop.includes(nodeCol) && (
        <line x1={cx(nodeCol)} y1={0} x2={cx(nodeCol)} y2={cy - 5}
          stroke={COL_COLORS[nodeCol % COL_COLORS.length]}
          strokeWidth={1.5} opacity={0.4}
        />
      )}
      {/* Node lane: bottom half (if lane continues) */}
      {lineBottom.includes(nodeCol) && (
        <line x1={cx(nodeCol)} y1={cy + 5} x2={cx(nodeCol)} y2={ROW_HEIGHT}
          stroke={COL_COLORS[nodeCol % COL_COLORS.length]}
          strokeWidth={1.5} opacity={0.4}
        />
      )}
      {/* Branch closing: node col curves down to parent col */}
      {mergeTarget !== null && (
        <path
          d={`M ${cx(nodeCol)} ${cy + 5} C ${cx(nodeCol)} ${cy + 22} ${cx(mergeTarget)} ${cy + 22} ${cx(mergeTarget)} ${ROW_HEIGHT}`}
          stroke={COL_COLORS[nodeCol % COL_COLORS.length]}
          strokeWidth={1.5} fill="none" opacity={0.55}
        />
      )}
      {/* Node circle */}
      <circle cx={cx(nodeCol)} cy={cy} r={4.5}
        fill={COL_COLORS[nodeCol % COL_COLORS.length]}
      />
      {isHead && <circle cx={cx(nodeCol)} cy={cy} r={2.5} fill="white" />}
    </svg>
  )
}

function RefBadge({ refItem }) {
  const styles = {
    head: { bg: 'rgba(0,212,170,0.15)', border: 'rgba(0,212,170,0.4)', color: '#00D4AA', icon: '◎' },
    branch: { bg: 'rgba(90,200,250,0.15)', border: 'rgba(90,200,250,0.35)', color: '#5AC8FA', icon: '\u29d7' },
    tag: { bg: 'rgba(255,214,10,0.15)', border: 'rgba(255,214,10,0.4)', color: '#FFD60A', icon: '\u2318' },
  }
  const s = styles[refItem.type] || styles.branch
  return (
    <span className="gt-ref-badge" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {s.icon} {refItem.label}
    </span>
  )
}

export default function GitTreeDemo() {
  const [selected, setSelected] = useState(COMMITS[0])
  const [hovered, setHovered] = useState(null)
  const [centerTab, setCenterTab] = useState('history')
  const [files, setFiles] = useState(CHANGED_FILES.map(f => ({ ...f })))

  const toggleStage = (name) => {
    setFiles(prev => prev.map(f => f.name === name ? { ...f, staged: !f.staged } : f))
  }

  const staged = files.filter(f => f.staged)
  const unstaged = files.filter(f => !f.staged)

  return (
    <div className="gt-window">
      {/* Title bar */}
      <div className="gt-titlebar">
        <div className="gt-traffic">
          <span className="gt-dot gt-red" />
          <span className="gt-dot gt-yellow" />
          <span className="gt-dot gt-green" />
        </div>
        <span className="gt-win-title">GitTree \u2014 GitTree</span>
        <div className="gt-toolbar-right">
          <span className="gt-tb-btn">Fetch</span>
          <span className="gt-tb-btn">Pull</span>
          <span className="gt-tb-btn gt-tb-accent">Push</span>
        </div>
      </div>

      {/* Main tabs */}
      <div className="gt-main-tabs">
        <button className="gt-main-tab">Home</button>
        <button className="gt-main-tab active">Local</button>
        <button className="gt-main-tab">GitHub</button>
      </div>

      {/* Body */}
      <div className="gt-body">
        {/* Branch sidebar */}
        <div className="gt-sidebar">
          <div className="gt-sidebar-header">BRANCHES</div>
          {BRANCHES.map(b => (
            <div key={b.name} className={`gt-branch-row ${b.isHead ? 'gt-branch-active' : ''}`}>
              <span className="gt-branch-dot" style={{ background: b.color }} />
              <span className="gt-branch-name">{b.name}</span>
              {b.isHead && <span className="gt-branch-cur">\u25cf</span>}
            </div>
          ))}
        </div>

        {/* Center */}
        <div className="gt-center">
          <div className="gt-center-tabs">
            {['history', 'changes', 'stash'].map(t => (
              <button key={t}
                className={`gt-center-tab ${centerTab === t ? 'active' : ''}`}
                onClick={() => setCenterTab(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {centerTab === 'history' && (
            <div className="gt-commits-scroll">
              {COMMITS.map(commit => {
                const isSel = selected?.short === commit.short
                const isHov = hovered === commit.short
                return (
                  <div key={commit.short}
                    className={`gt-commit-row ${isSel ? 'gt-sel' : ''} ${isHov ? 'gt-hov' : ''}`}
                    onClick={() => setSelected(commit)}
                    onMouseEnter={() => setHovered(commit.short)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <GraphSVG
                      lineTop={commit.lineTop}
                      lineBottom={commit.lineBottom}
                      nodeCol={commit.col}
                      isHead={commit.refs.some(r => r.type === 'head')}
                      parentBranch={commit.parentBranch}
                    />
                    <div className="gt-commit-info">
                      {commit.refs.length > 0 && (
                        <div className="gt-commit-refs">
                          {commit.refs.map(r => <RefBadge key={r.label} refItem={r} />)}
                        </div>
                      )}
                      <div className="gt-commit-msg">{commit.message}</div>
                      <div className="gt-commit-meta">
                        <span className="gt-hash">{commit.short}</span>
                        <span className="gt-sep">\u00b7</span>
                        <span>{commit.author}</span>
                        <span className="gt-sep">\u00b7</span>
                        <span>{commit.date}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {centerTab === 'changes' && (
            <div className="gt-changes-scroll">
              <div className="gt-section-label">STAGED \u2014 click to unstage</div>
              {staged.length === 0 && <div className="gt-empty-hint">No staged files</div>}
              {staged.map(f => (
                <div key={f.name} className="gt-file-row gt-staged" onClick={() => toggleStage(f.name)}>
                  <span className={`gt-fstatus gt-s-${f.status.toLowerCase()}`}>{f.status}</span>
                  <span className="gt-fname">{f.name}</span>
                  <span className="gt-faction gt-faction-remove">\u2212</span>
                </div>
              ))}
              <div className="gt-section-label" style={{ marginTop: 8 }}>UNSTAGED \u2014 click to stage</div>
              {unstaged.length === 0 && <div className="gt-empty-hint">Nothing to stage</div>}
              {unstaged.map(f => (
                <div key={f.name} className="gt-file-row gt-unstaged" onClick={() => toggleStage(f.name)}>
                  <span className={`gt-fstatus gt-s-${f.status.toLowerCase()}`}>{f.status}</span>
                  <span className="gt-fname">{f.name}</span>
                  <span className="gt-faction gt-faction-add">+</span>
                </div>
              ))}
            </div>
          )}

          {centerTab === 'stash' && (
            <div className="gt-stash-panel">
              <span className="gt-empty-hint">No stashes in this repository</span>
            </div>
          )}
        </div>

        {/* Right detail */}
        <div className="gt-detail">
          {centerTab === 'history' && selected && (
            <>
              <div className="gt-detail-top">
                <span className="gt-detail-hash">{selected.short}</span>
                <span className="gt-detail-date">{selected.date}</span>
              </div>
              <div className="gt-detail-msg">{selected.message}</div>
              <div className="gt-detail-author">by {selected.author}</div>
              {selected.files.length > 0 ? (
                <>
                  <div className="gt-detail-label">CHANGED FILES</div>
                  {selected.files.map(f => (
                    <div key={f} className="gt-detail-file">
                      <span className="gt-detail-file-dot" />
                      <span>{f}</span>
                    </div>
                  ))}
                  <div className="gt-detail-stats">
                    <span className="gt-add-stat">+{selected.additions}</span>
                    <span className="gt-del-stat">\u2212{selected.deletions}</span>
                  </div>
                </>
              ) : (
                <div className="gt-merge-note">Merge commit</div>
              )}
            </>
          )}

          {centerTab === 'changes' && (
            <div className="gt-diff-view">
              <div className="gt-diff-filename">ContentView.swift</div>
              <div className="gt-diff-line gt-diff-add">+ @State private var showCommit = false</div>
              <div className="gt-diff-line gt-diff-add">+ @State private var message = &quot;&quot;</div>
              <div className="gt-diff-line gt-diff-ctx">  var body: some View {'{'}</div>
              <div className="gt-diff-line gt-diff-del">-   Text(&quot;Hello World&quot;)</div>
              <div className="gt-diff-line gt-diff-add">+   ContentView()</div>
              <div className="gt-diff-line gt-diff-ctx">  {'}'}</div>
            </div>
          )}

          {centerTab === 'stash' && (
            <div className="gt-detail-empty">Select a stash to view details</div>
          )}
        </div>
      </div>
    </div>
  )
}
