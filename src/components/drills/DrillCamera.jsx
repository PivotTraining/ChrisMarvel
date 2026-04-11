// DrillCamera — real-time pose tracking with TF.js MoveNet.
//
// Uses `getUserMedia` to grab the front/back camera, MoveNet SinglePose Lightning
// to extract 17 keypoints per frame, and drill-specific analyzers to count reps
// and grade form. Designed to be lightweight: lazy-loads TF.js on first open,
// runs in a single rAF loop, and shuts everything down cleanly on close.
//
// Supported drill kinds today:
//   • shooting-form  — tracks elbow alignment + release angle
//   • mikan          — counts layup reps (wrist crossing basket threshold)
//   • pound          — counts dribble taps (wrist vertical oscillation)
//   • conditioning   — counts jumps / squats via hip height oscillation
//
// The analyzer is picked from drill.cameraMode. If none is set we default to
// a generic "movement" analyzer that just reports that pose is tracked.

import { useEffect, useRef, useState, useCallback } from 'react'
import { X, Camera, CheckCircle, Zap, RefreshCw } from 'lucide-react'
import { useHaptics } from '../../hooks/useHaptics'

// ─── Keypoint indices for MoveNet / COCO 17-keypoint skeleton ──────────────
const KP = {
  NOSE: 0, L_EYE: 1, R_EYE: 2, L_EAR: 3, R_EAR: 4,
  L_SHOULDER: 5, R_SHOULDER: 6, L_ELBOW: 7, R_ELBOW: 8,
  L_WRIST: 9, R_WRIST: 10,
  L_HIP: 11, R_HIP: 12, L_KNEE: 13, R_KNEE: 14,
  L_ANKLE: 15, R_ANKLE: 16,
}

// Minimum confidence for a keypoint to count
const KP_THRESHOLD = 0.35

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

function angleBetween(a, b, c) {
  // angle at vertex b (degrees) formed by b→a and b→c
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const magA = Math.sqrt(ab.x * ab.x + ab.y * ab.y)
  const magC = Math.sqrt(cb.x * cb.x + cb.y * cb.y)
  if (!magA || !magC) return 0
  const cos = Math.max(-1, Math.min(1, dot / (magA * magC)))
  return (Math.acos(cos) * 180) / Math.PI
}

// ─── Per-drill analyzers ────────────────────────────────────────────────────
function makeAnalyzer(kind) {
  switch (kind) {
    case 'shooting-form': return new ShootingFormAnalyzer()
    case 'mikan':         return new MikanAnalyzer()
    case 'pound':         return new PoundAnalyzer()
    case 'conditioning':  return new ConditioningAnalyzer()
    default:              return new GenericAnalyzer()
  }
}

class BaseAnalyzer {
  constructor() {
    this.reps = 0
    this.lastFeedback = 'Warming up…'
    this.quality = null  // 0–100
  }
  update(/* keypoints */) {}
  summary() {
    return { reps: this.reps, feedback: this.lastFeedback, quality: this.quality }
  }
}

// Counts distinct shot attempts by looking for extension-retraction cycles
// in the shooting arm. Also grades elbow tuck (elbow-shoulder-hip angle).
class ShootingFormAnalyzer extends BaseAnalyzer {
  constructor() {
    super()
    this.phase = 'down'     // 'down' | 'up'
    this.elbowAngles = []
    this.tuckScores = []
  }
  update(kp) {
    const shoulder = kp[KP.R_SHOULDER]
    const elbow = kp[KP.R_ELBOW]
    const wrist = kp[KP.R_WRIST]
    const hip = kp[KP.R_HIP]
    if (!shoulder || !elbow || !wrist || !hip) return
    if (shoulder.score < KP_THRESHOLD || elbow.score < KP_THRESHOLD || wrist.score < KP_THRESHOLD) return

    // Release phase when wrist is above head
    const wristHigh = wrist.y < shoulder.y - 20
    if (wristHigh && this.phase === 'down') {
      this.phase = 'up'
      const elbowAngle = angleBetween(shoulder, elbow, wrist)
      this.elbowAngles.push(elbowAngle)
      // Tuck: angle between hip→shoulder and shoulder→elbow.
      // Tight tuck ≈ 180° (arm straight up the body line).
      const tuck = angleBetween(hip, shoulder, elbow)
      this.tuckScores.push(tuck)
      this.reps++
      // Coaching cue
      if (tuck > 165) this.lastFeedback = 'Nice tuck — elbow in line'
      else if (tuck > 140) this.lastFeedback = 'Elbow drifting out slightly'
      else this.lastFeedback = 'Tuck that elbow — it\'s flaring'
    } else if (!wristHigh && this.phase === 'up') {
      this.phase = 'down'
    }
    if (this.tuckScores.length) {
      const avg = this.tuckScores.reduce((a, b) => a + b, 0) / this.tuckScores.length
      // Map 140°→0, 180°→100
      this.quality = Math.max(0, Math.min(100, Math.round(((avg - 140) / 40) * 100)))
    }
  }
}

// Counts layup reps by tracking wrist sweeps across body midline near head height.
class MikanAnalyzer extends BaseAnalyzer {
  constructor() {
    super()
    this.lastSide = null   // 'L' | 'R'
    this.cooldown = 0
  }
  update(kp) {
    if (this.cooldown > 0) this.cooldown--
    const lw = kp[KP.L_WRIST], rw = kp[KP.R_WRIST], nose = kp[KP.NOSE]
    if (!lw || !rw || !nose) return
    const active = lw.score > rw.score ? lw : rw
    const side = lw.score > rw.score ? 'L' : 'R'
    // Arm extended high
    if (active.y < nose.y + 20 && this.cooldown === 0 && side !== this.lastSide) {
      this.reps++
      this.lastSide = side
      this.cooldown = 10
      this.lastFeedback = `Rep ${this.reps} · ${side === 'L' ? 'Left' : 'Right'} hand`
      this.quality = Math.min(100, this.reps * 10)
    }
  }
}

// Counts dribble taps via wrist vertical oscillation.
class PoundAnalyzer extends BaseAnalyzer {
  constructor() {
    super()
    this.lastY = null
    this.direction = 0
    this.cooldown = 0
  }
  update(kp) {
    if (this.cooldown > 0) this.cooldown--
    const wrist = kp[KP.R_WRIST]
    if (!wrist || wrist.score < KP_THRESHOLD) return
    if (this.lastY !== null) {
      const dy = wrist.y - this.lastY
      const dir = dy > 2 ? 1 : dy < -2 ? -1 : 0
      if (dir !== 0 && dir !== this.direction) {
        if (dir === -1 && this.cooldown === 0) {
          // Wrist reversing upward = one tap
          this.reps++
          this.cooldown = 5
          this.lastFeedback = `Tap ${this.reps}`
          this.quality = Math.min(100, 40 + this.reps * 2)
        }
        this.direction = dir
      }
    }
    this.lastY = wrist.y
  }
}

// Conditioning — count hip height oscillations (jumps / squats).
class ConditioningAnalyzer extends BaseAnalyzer {
  constructor() {
    super()
    this.hipBaseline = null
    this.phase = 'neutral'
  }
  update(kp) {
    const hip = kp[KP.L_HIP]?.score > kp[KP.R_HIP]?.score ? kp[KP.L_HIP] : kp[KP.R_HIP]
    if (!hip || hip.score < KP_THRESHOLD) return
    if (this.hipBaseline === null) this.hipBaseline = hip.y
    const delta = this.hipBaseline - hip.y
    if (delta > 40 && this.phase !== 'up') {
      this.phase = 'up'
      this.reps++
      this.lastFeedback = `Rep ${this.reps}`
      this.quality = Math.min(100, 50 + this.reps * 2)
    } else if (delta < 10 && this.phase === 'up') {
      this.phase = 'neutral'
    }
  }
}

class GenericAnalyzer extends BaseAnalyzer {
  update(kp) {
    const hasPose = kp.filter(k => k && k.score > KP_THRESHOLD).length
    if (hasPose > 10) {
      this.lastFeedback = 'Pose tracked — freestyle mode'
      this.quality = Math.min(100, 50 + hasPose * 3)
    }
  }
}

// ─── Main component ────────────────────────────────────────────────────────
export default function DrillCamera({ drill, onClose, onComplete }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const detectorRef = useRef(null)
  const analyzerRef = useRef(null)
  const rafRef = useRef(0)
  const streamRef = useRef(null)
  const [status, setStatus] = useState('init')  // init | loading | ready | error | done
  const [errorMsg, setErrorMsg] = useState('')
  const [reps, setReps] = useState(0)
  const [feedback, setFeedback] = useState('Warming up…')
  const [quality, setQuality] = useState(null)
  const [facing, setFacing] = useState('user')
  const { impact, notification } = useHaptics()

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (detectorRef.current?.dispose) {
      try { detectorRef.current.dispose() } catch { /* noop */ }
    }
    detectorRef.current = null
    analyzerRef.current = null
  }, [])

  useEffect(() => {
    if (!drill) return
    let disposed = false

    async function setupCamera() {
      setStatus('loading')
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        })
        if (disposed) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (err) {
        setStatus('error')
        setErrorMsg(err?.message || 'Camera access denied. Enable camera permission in Settings.')
        return
      }

      // Lazy-load TF.js
      try {
        const [tf, poseDetection] = await Promise.all([
          import('@tensorflow/tfjs-core'),
          import('@tensorflow-models/pose-detection'),
        ])
        await import('@tensorflow/tfjs-backend-webgl')
        await tf.setBackend('webgl')
        await tf.ready()
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING },
        )
        if (disposed) return
        detectorRef.current = detector
        analyzerRef.current = makeAnalyzer(drill.cameraMode || 'generic')
        setStatus('ready')
        loop()
      } catch (err) {
        setStatus('error')
        setErrorMsg('Pose engine failed to load: ' + (err?.message || 'unknown error'))
      }
    }

    async function loop() {
      if (disposed) return
      const video = videoRef.current
      const detector = detectorRef.current
      const analyzer = analyzerRef.current
      const canvas = canvasRef.current
      if (!video || !detector || !analyzer || !canvas || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop)
        return
      }
      try {
        const poses = await detector.estimatePoses(video, { maxPoses: 1, flipHorizontal: false })
        if (poses && poses[0]) {
          const kp = poses[0].keypoints
          const prevReps = analyzer.reps
          analyzer.update(kp)
          const sum = analyzer.summary()
          if (sum.reps !== prevReps) {
            setReps(sum.reps)
            impact('light')
          }
          setFeedback(sum.feedback)
          setQuality(sum.quality)
          drawPose(canvas, video, kp)
        }
      } catch { /* frame skipped */ }
      rafRef.current = requestAnimationFrame(loop)
    }

    setupCamera()
    return () => {
      disposed = true
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drill, facing])

  function handleFinish() {
    notification('success')
    setStatus('done')
    const summary = analyzerRef.current?.summary() || { reps, feedback, quality }
    cleanup()
    onComplete?.({ reps: summary.reps, quality: summary.quality, feedback: summary.feedback })
  }

  function handleFlip() {
    impact('light')
    setFacing(f => f === 'user' ? 'environment' : 'user')
  }

  if (!drill) return null

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: '#000', display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Video + canvas overlay */}
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover',
            transform: facing === 'user' ? 'scaleX(-1)' : 'none',
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            pointerEvents: 'none',
            transform: facing === 'user' ? 'scaleX(-1)' : 'none',
          }}
        />

        {/* Top HUD */}
        <div
          style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          }}
        >
          <button
            onClick={() => { cleanup(); onClose?.() }}
            aria-label="Close"
            style={{
              width: '38px', height: '38px', borderRadius: '50%', border: 'none',
              background: 'rgba(0,0,0,0.55)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
          <div
            style={{
              padding: '8px 14px', borderRadius: '999px',
              background: 'rgba(0,0,0,0.55)',
              color: '#fff', fontSize: '12px', fontWeight: 800,
            }}
          >
            {drill.name}
          </div>
          <button
            onClick={handleFlip}
            aria-label="Flip camera"
            style={{
              width: '38px', height: '38px', borderRadius: '50%', border: 'none',
              background: 'rgba(0,0,0,0.55)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Status overlay */}
        {status !== 'ready' && (
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)', color: '#fff', textAlign: 'center',
              padding: '24px',
            }}
          >
            {status === 'loading' && (
              <>
                <div
                  style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    border: '4px solid rgba(255,255,255,0.15)',
                    borderTopColor: 'var(--color-accent)',
                    animation: 'spin 0.8s linear infinite', marginBottom: '16px',
                  }}
                />
                <p style={{ fontSize: '14px', fontWeight: 700 }}>Loading pose engine…</p>
                <p style={{ fontSize: '12px', opacity: 0.7, marginTop: '6px' }}>
                  First load downloads ~4 MB — future opens are instant.
                </p>
              </>
            )}
            {status === 'error' && (
              <>
                <Camera size={40} style={{ color: '#EF4444', marginBottom: '12px' }} />
                <p style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                  Camera unavailable
                </p>
                <p style={{ fontSize: '12px', opacity: 0.8, maxWidth: '320px' }}>
                  {errorMsg}
                </p>
                <button
                  onClick={() => { cleanup(); onClose?.() }}
                  style={{
                    marginTop: '20px', padding: '12px 24px', borderRadius: '12px',
                    border: 'none', background: 'var(--color-accent)', color: '#fff',
                    fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                  }}
                >
                  Back
                </button>
              </>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
      </div>

      {/* Bottom HUD — reps + feedback + CTA */}
      <div
        style={{
          padding: '18px 18px calc(18px + env(safe-area-inset-bottom))',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 40%)',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '72px', textAlign: 'center',
              padding: '10px 0', borderRadius: '14px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--color-accent)', lineHeight: 1 }}>
              {reps}
            </div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginTop: '4px' }}>
              REPS
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
              {feedback}
            </div>
            {quality !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div
                  style={{
                    flex: 1, height: '6px', borderRadius: '3px',
                    background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${quality}%`, height: '100%',
                      background: quality >= 70 ? '#22C55E' : quality >= 40 ? '#F59E0B' : '#EF4444',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 800 }}>
                  {quality}%
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleFinish}
          disabled={status !== 'ready'}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px',
            border: 'none', cursor: status === 'ready' ? 'pointer' : 'default',
            background: status === 'ready'
              ? 'linear-gradient(135deg, #22C55E, #16A34A)'
              : 'rgba(255,255,255,0.08)',
            color: '#fff', fontSize: '14px', fontWeight: 900,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            opacity: status === 'ready' ? 1 : 0.5,
          }}
        >
          <CheckCircle size={18} /> Finish & Log {reps > 0 ? `· ${reps} reps` : ''}
        </button>
      </div>
    </div>
  )
}

// ─── Skeleton drawing ──────────────────────────────────────────────────────
const SKELETON_EDGES = [
  [KP.L_SHOULDER, KP.R_SHOULDER],
  [KP.L_SHOULDER, KP.L_ELBOW], [KP.L_ELBOW, KP.L_WRIST],
  [KP.R_SHOULDER, KP.R_ELBOW], [KP.R_ELBOW, KP.R_WRIST],
  [KP.L_SHOULDER, KP.L_HIP], [KP.R_SHOULDER, KP.R_HIP],
  [KP.L_HIP, KP.R_HIP],
  [KP.L_HIP, KP.L_KNEE], [KP.L_KNEE, KP.L_ANKLE],
  [KP.R_HIP, KP.R_KNEE], [KP.R_KNEE, KP.R_ANKLE],
]

function drawPose(canvas, video, kp) {
  const ctx = canvas.getContext('2d')
  const vw = video.videoWidth, vh = video.videoHeight
  if (!vw || !vh) return
  if (canvas.width !== vw) canvas.width = vw
  if (canvas.height !== vh) canvas.height = vh
  ctx.clearRect(0, 0, vw, vh)
  ctx.strokeStyle = '#FF6B35'
  ctx.lineWidth = 3
  ctx.fillStyle = '#FFD700'
  // Edges
  for (const [a, b] of SKELETON_EDGES) {
    const pa = kp[a], pb = kp[b]
    if (!pa || !pb) continue
    if (pa.score < KP_THRESHOLD || pb.score < KP_THRESHOLD) continue
    ctx.beginPath()
    ctx.moveTo(pa.x, pa.y)
    ctx.lineTo(pb.x, pb.y)
    ctx.stroke()
  }
  // Joints
  for (const p of kp) {
    if (!p || p.score < KP_THRESHOLD) continue
    ctx.beginPath()
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}
