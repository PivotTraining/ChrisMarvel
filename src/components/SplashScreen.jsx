import { useState, useEffect } from 'react'

/*
 * Animated splash: A realistic basketball drops in, bounces with squash/stretch,
 * spins with seam lines visible, leaves a ripple on impact, then the brand
 * text reveals with a swoosh. Lasts ~4 seconds total.
 */

function Basketball({ size = 120, className = '', style = {} }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      style={style}
    >
      {/* Ball body */}
      <defs>
        <radialGradient id="ballGrad" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#FF8844" />
          <stop offset="60%" stopColor="#E85A2A" />
          <stop offset="100%" stopColor="#B8401A" />
        </radialGradient>
        <radialGradient id="shine" cx="35%" cy="30%" r="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="ballShadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#FF6B35" floodOpacity="0.5" />
        </filter>
      </defs>

      <circle cx="60" cy="60" r="56" fill="url(#ballGrad)" filter="url(#ballShadow)" />

      {/* Seam lines */}
      <g stroke="#3A1A08" strokeWidth="2.2" fill="none" opacity="0.6">
        {/* Vertical seam */}
        <path d="M60,4 Q45,30 45,60 Q45,90 60,116" />
        <path d="M60,4 Q75,30 75,60 Q75,90 60,116" />
        {/* Horizontal seam */}
        <path d="M4,60 Q30,45 60,45 Q90,45 116,60" />
        <path d="M4,60 Q30,75 60,75 Q90,75 116,60" />
      </g>

      {/* Pebble texture dots */}
      <g fill="rgba(0,0,0,0.06)">
        <circle cx="35" cy="35" r="1" />
        <circle cx="50" cy="25" r="0.8" />
        <circle cx="70" cy="32" r="1" />
        <circle cx="85" cy="45" r="0.8" />
        <circle cx="30" cy="55" r="0.8" />
        <circle cx="90" cy="65" r="1" />
        <circle cx="45" cy="80" r="0.8" />
        <circle cx="75" cy="85" r="1" />
        <circle cx="55" cy="95" r="0.8" />
        <circle cx="40" cy="50" r="0.7" />
        <circle cx="80" cy="75" r="0.7" />
      </g>

      {/* Shine / highlight */}
      <circle cx="60" cy="60" r="56" fill="url(#shine)" />
    </svg>
  )
}

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState(0)
  // 0 = ball drops in
  // 1 = ball bouncing (3 bounces with spin)
  // 2 = ball settles, ripple, brand reveals
  // 3 = tagline + accent line
  // 4 = exit

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),    // start bounce
      setTimeout(() => setPhase(2), 1800),   // settle + brand
      setTimeout(() => setPhase(3), 2600),   // tagline
      setTimeout(() => setPhase(4), 3800),   // begin exit
      setTimeout(() => onFinish(), 4500),    // unmount
    ]
    return () => timers.forEach(clearTimeout)
  }, [onFinish])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-bg)',
        overflow: 'hidden',
        transition: 'opacity 0.6s ease',
        opacity: phase >= 4 ? 0 : 1,
      }}
    >
      {/* CSS Keyframes */}
      <style>{`
        @keyframes ballDrop {
          0%   { transform: translateY(-200px) rotate(0deg) scaleY(1) scaleX(1); }
          35%  { transform: translateY(0px) rotate(120deg) scaleY(1) scaleX(1); }
          40%  { transform: translateY(0px) rotate(135deg) scaleY(0.75) scaleX(1.2); }
          55%  { transform: translateY(-80px) rotate(240deg) scaleY(1.1) scaleX(0.95); }
          65%  { transform: translateY(0px) rotate(310deg) scaleY(1) scaleX(1); }
          68%  { transform: translateY(0px) rotate(320deg) scaleY(0.82) scaleX(1.15); }
          78%  { transform: translateY(-35px) rotate(360deg) scaleY(1.05) scaleX(0.97); }
          88%  { transform: translateY(0px) rotate(390deg) scaleY(1) scaleX(1); }
          91%  { transform: translateY(0px) rotate(395deg) scaleY(0.9) scaleX(1.08); }
          100% { transform: translateY(0px) rotate(405deg) scaleY(1) scaleX(1); }
        }

        @keyframes ballSettle {
          0%   { transform: translateY(0) rotate(405deg) scale(1); }
          50%  { transform: translateY(-120px) rotate(405deg) scale(0.85); }
          100% { transform: translateY(-120px) rotate(405deg) scale(0.85); }
        }

        @keyframes ripple {
          0%   { transform: scale(0); opacity: 0.6; }
          100% { transform: scale(4); opacity: 0; }
        }

        @keyframes ripple2 {
          0%   { transform: scale(0); opacity: 0.4; }
          100% { transform: scale(3); opacity: 0; }
        }

        @keyframes floorFlash {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes brandIn {
          0%   { opacity: 0; transform: translateY(20px) scale(0.9); letter-spacing: 8px; }
          60%  { opacity: 1; transform: translateY(0) scale(1); letter-spacing: 0px; }
          100% { opacity: 1; transform: translateY(0) scale(1); letter-spacing: -1px; }
        }

        @keyframes taglineIn {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes lineExpand {
          0%   { width: 0; }
          100% { width: 64px; }
        }

        @keyframes fadeExit {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.08); }
        }

        @keyframes particleBurst {
          0%   { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(0); }
        }

        @keyframes courtLine {
          0%   { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }

        .splash-ball-bounce {
          animation: ballDrop 1.5s cubic-bezier(0.33, 0, 0.67, 1) forwards;
        }
        .splash-ball-settle {
          animation: ballSettle 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .splash-ripple {
          animation: ripple 0.8s ease-out forwards;
        }
        .splash-ripple2 {
          animation: ripple2 0.6s 0.1s ease-out forwards;
        }
        .splash-floor-flash {
          animation: floorFlash 0.4s ease-out forwards;
        }
        .splash-brand-in {
          animation: brandIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .splash-tagline-in {
          animation: taglineIn 0.5s ease-out forwards;
        }
        .splash-line-expand {
          animation: lineExpand 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .splash-exit {
          animation: fadeExit 0.6s ease-in forwards;
        }
        .splash-particle {
          animation: particleBurst 0.7s ease-out forwards;
        }
      `}</style>

      {/* Background court lines (subtle) */}
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: phase >= 2 ? 0.06 : 0,
          transition: 'opacity 0.8s ease',
        }}
        viewBox="0 0 400 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="var(--color-accent)" fill="none" strokeWidth="1.5"
          style={{ strokeDasharray: 200, strokeDashoffset: phase >= 2 ? 0 : 200, transition: 'stroke-dashoffset 1.5s ease' }}
        >
          <rect x="50" y="80" width="300" height="440" rx="2" />
          <circle cx="200" cy="300" r="60" />
          <line x1="50" y1="300" x2="350" y2="300" />
          <path d="M 130 80 L 130 180 Q 130 220 200 220 Q 270 220 270 180 L 270 80" />
          <path d="M 130 520 L 130 420 Q 130 380 200 380 Q 270 380 270 420 L 270 520" />
        </g>
      </svg>

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 65%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      />

      {/* Container for ball + effects */}
      <div style={{ position: 'relative', width: '120px', height: '240px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>

        {/* Impact ripples (on first bounce) */}
        {phase >= 1 && phase < 4 && (
          <>
            <div
              className="splash-ripple"
              style={{
                position: 'absolute',
                bottom: '-10px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '2px solid var(--color-accent)',
              }}
            />
            <div
              className="splash-ripple2"
              style={{
                position: 'absolute',
                bottom: '-10px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '1.5px solid var(--color-accent)',
              }}
            />
          </>
        )}

        {/* Floor line flash */}
        {phase >= 1 && phase < 4 && (
          <div
            className="splash-floor-flash"
            style={{
              position: 'absolute',
              bottom: '-2px',
              width: '80px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
              borderRadius: '1px',
            }}
          />
        )}

        {/* Spark particles on bounce */}
        {phase >= 1 && phase < 3 && (
          <>
            {[
              { px: '-30px', py: '-25px', delay: '0s' },
              { px: '35px', py: '-20px', delay: '0.05s' },
              { px: '-20px', py: '-35px', delay: '0.1s' },
              { px: '25px', py: '-30px', delay: '0.08s' },
              { px: '-10px', py: '-40px', delay: '0.03s' },
              { px: '15px', py: '-35px', delay: '0.12s' },
            ].map((p, i) => (
              <div
                key={i}
                className="splash-particle"
                style={{
                  position: 'absolute',
                  bottom: '0px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  '--px': p.px,
                  '--py': p.py,
                  animationDelay: p.delay,
                }}
              />
            ))}
          </>
        )}

        {/* The basketball */}
        <div
          className={phase === 0 ? '' : phase < 2 ? 'splash-ball-bounce' : 'splash-ball-settle'}
          style={{
            ...(phase === 0 ? { transform: 'translateY(-200px)', opacity: 0 } : {}),
            transformOrigin: 'center bottom',
          }}
        >
          <Basketball size={120} />
        </div>
      </div>

      {/* Brand text */}
      <div style={{ textAlign: 'center', marginTop: '24px', minHeight: '80px' }}>
        {phase >= 2 && (
          <h1
            className="splash-brand-in"
            style={{
              fontSize: '48px',
              fontWeight: 900,
              lineHeight: 1.1,
              color: 'var(--color-text)',
            }}
          >
            Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
          </h1>
        )}

        {phase >= 3 && (
          <>
            <p
              className="splash-tagline-in"
              style={{
                fontSize: '16px',
                color: 'var(--color-text-sec)',
                marginTop: '10px',
                fontWeight: 500,
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              Elevate Your Game
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <div
                className="splash-line-expand"
                style={{
                  height: '3px',
                  borderRadius: '2px',
                  background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-dark))',
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
