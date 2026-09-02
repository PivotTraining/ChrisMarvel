import type { Metadata } from 'next'
import '../../globals.css'
import '../two-rooms.css'

export const metadata: Metadata = {
  title: 'Camera Script Vault | The Two Rooms',
  description: 'Ready-to-use camera structures for openings, authority, stories, teaching, opinions, closers, and recording sheets.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/two-rooms/script-vault' },
}

const checkout='https://buy.stripe.com/cNi28r7NX8nC7vpczza3u0C'

export default function ScriptVaultPage(){
  return <main className="tr-page">
    <nav className="tr-nav"><div className="tr-wrap tr-nav-inner"><a className="tr-brand" href="/">Chris<img src="/images/chris-marvel-logo.png" alt="" width={28} height={28}/><span>Marvel</span></a><a className="tr-nav-cta" href={checkout}>Get the Vault — $17</a></div></nav>
    <header className="tr-hero"><div className="tr-wrap tr-hero-grid">
      <div><div className="tr-eyebrow">The Two Rooms · Camera Script Vault</div><h1 style={{fontSize:'clamp(4rem,9vw,8rem)'}}>Say it<br/><span>cleaner.</span></h1><p className="tr-deck">Structures that remove the blank-page problem without making you sound scripted.</p><p className="tr-lead">Built for experts who know what they mean but lose time trying to figure out how to start, structure, and end a camera piece.</p><div className="tr-actions"><a className="tr-btn tr-btn-rust" href={checkout}>Get Instant Access — $17</a></div></div>
      <div className="tr-page-card" style={{minHeight:0,borderTopColor:'#B34A32'}}><div className="tr-page-label">Inside the Vault</div><h3>90+ usable structures</h3><ul><li>25 openers</li><li>15 authority-building structures</li><li>10 story frameworks</li><li>10 educational scripts</li><li>10 opinion/correction scripts</li><li>20 closers</li><li>Fill-in recording sheets</li></ul></div>
    </div></header>
    <section className="tr-system"><div className="tr-wrap"><div className="tr-section-kicker light">The rule</div><h2>Borrow the structure. Keep your point of view.</h2><p className="tr-system-intro">The Vault is not a teleprompter pack. It is a friction-removal tool for getting from expertise to a clean first take faster.</p></div></section>
    <footer className="tr-footer"><div className="tr-wrap tr-footer-inner"><div>© 2026 Chris Marvel Davis</div><div><a href="/two-rooms">The Two Rooms</a></div></div></footer>
  </main>
}
