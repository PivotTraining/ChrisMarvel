import type { Metadata } from 'next'
import '../../globals.css'
import '../../two-rooms/two-rooms.css'

export const metadata: Metadata = {
  title: 'Camera Field Kit | ON CAMERA',
  description: 'Six practical camera tools for diagnosing a take, calibrating delivery, and filming better.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/on-camera/field-kit' },
}

const checkoutUrl='https://buy.stripe.com/28E3cvgkt8nCaHB8jja3u0B'
const tools=[['01','Camera Emergency','A ten-minute rescue protocol for the days when you need to film now.'],['02','Calibration Scorecard','Score the variables that determine what the viewer actually receives.'],['03','Bad Take Autopsy','Turn “something feels wrong” into a specific failure you can correct.'],['04','Good Take Anatomy','See what changes when the same expertise is calibrated for camera.'],['05','Before You Post','A craft-control check before views and comments enter the equation.'],['06','Operating Hub','A single-page map that tells you which tool to use next.']]

export default function CameraFieldKitPage(){return <main className="tr-page">
<nav className="tr-nav"><div className="tr-wrap tr-nav-inner"><a className="tr-brand" href="/">Chris<img src="/images/chris-marvel-logo.png" alt="" width={28} height={28}/><span>Marvel</span></a><div className="tr-nav-links"><a href="/on-camera">ON CAMERA</a><a href="#inside">Inside</a><a className="tr-nav-cta" href={checkoutUrl}>Get the Kit — $27</a></div></div></nav>
<header className="tr-hero"><div className="tr-wrap tr-hero-grid"><div className="tr-hero-copy"><div className="tr-eyebrow">ON CAMERA · Digital Companion</div><h1 style={{fontSize:'clamp(4.2rem,9vw,8rem)'}}>Camera<br/><span>Field Kit</span></h1><p className="tr-deck">Six operating tools for the moment you need to film.</p><p className="tr-lead">Diagnose a take, calibrate delivery, fix the problem, and film again without rereading the entire manual.</p><div className="tr-actions"><a className="tr-btn tr-btn-rust" href={checkoutUrl}>Get Instant Access — $27</a><a className="tr-btn tr-btn-ghost" href="#inside">See the Six Tools</a></div></div><div className="tr-page-card" style={{minHeight:0,borderTopColor:'#B34A32'}}><div className="tr-page-label">Fast operating layer</div><h3>Diagnose. Calibrate. Film again.</h3><p>Built to sit beside your phone while you work.</p></div></div></header>
<section className="tr-problem" id="inside"><div className="tr-wrap"><div className="tr-section-kicker">Inside</div><h2>The right tool<br/><span>at the right moment.</span></h2><div className="tr-framework-grid" style={{marginTop:50}}>{tools.map(([n,t,c])=><article key={t} className="tr-framework-card"><div className="tr-framework-num">{n}</div><h3>{t}</h3><p>{c}</p></article>)}</div></div></section>
<section className="tr-pages"><div className="tr-wrap tr-for-grid"><div><div className="tr-section-kicker">Need the full system?</div><h2 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2.5rem,5vw,4.4rem)',lineHeight:1,textTransform:'uppercase',letterSpacing:'-2px'}}>ON CAMERA is the complete 105-page manual.</h2><p style={{fontSize:'1.05rem',lineHeight:1.8,color:'#444',marginTop:22}}>The Field Kit is included inside the full manual. If you start here at $27, the post-purchase upgrade lets you add the complete system for $20 more.</p><div className="tr-actions"><a className="tr-btn tr-btn-ghost" href="/on-camera">See ON CAMERA — $47</a></div></div></div></section>
<footer className="tr-footer"><div className="tr-wrap tr-footer-inner"><div>© 2026 Chris Marvel Davis</div><div><a href="/on-camera">ON CAMERA</a></div></div></footer>
</main>}
