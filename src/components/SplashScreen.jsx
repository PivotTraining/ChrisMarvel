import { useState, useEffect } from 'react'

export default function SplashScreen({ onFinish }) {
  const [phase, setPhase] = useState(0) // 0=logo, 1=text, 2=tagline, 3=exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)   // show text
    const t2 = setTimeout(() => setPhase(2), 900)   // show tagline
    const t3 = setTimeout(() => setPhase(3), 1800)  // begin exit
    const t4 = setTimeout(() => onFinish(), 2400)    // unmount
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
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
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        opacity: phase >= 3 ? 0 : 1,
        transform: phase >= 3 ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Radial glow behind logo */}
      <div
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.5)',
        }}
      />

      {/* Basketball icon */}
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '28px',
          background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(255, 107, 53, 0.5)',
          transition: 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 0 ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-20deg)',
          marginBottom: '24px',
        }}
      >
        <span style={{ fontSize: '48px', lineHeight: 1 }}>🏀</span>
      </div>

      {/* CourtIQ text */}
      <h1
        style={{
          fontSize: '40px',
          fontWeight: 900,
          letterSpacing: '-1px',
          lineHeight: 1.1,
          color: 'var(--color-text)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: '15px',
          color: 'var(--color-text-sec)',
          marginTop: '8px',
          fontWeight: 500,
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        Elevate your game
      </p>

      {/* Accent line */}
      <div
        style={{
          width: phase >= 2 ? '48px' : '0px',
          height: '3px',
          borderRadius: '2px',
          background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-dark))',
          marginTop: '20px',
          transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />
    </div>
  )
}
