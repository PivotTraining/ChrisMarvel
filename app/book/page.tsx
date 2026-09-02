import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Books by Chris Marvel Davis | ChrisMarvelSpeaks.com',
  description: 'Explore books and practical field manuals by Chris Marvel Davis, including The What If Effect and The Two Rooms: Volume One — On Camera.',
  alternates: { canonical: 'https://chrismarvelspeaks.com/book' },
  openGraph: {
    title: 'Books by Chris Marvel Davis',
    description: 'Books, field manuals, and practical frameworks for performance, possibility, and communication.',
    url: 'https://chrismarvelspeaks.com/book',
    type: 'website',
  },
}

const books = [
  {
    title: 'The What If Effect',
    kicker: 'Book · Performance & Possibility',
    description: 'A framework for breaking through the mental barriers that keep people stuck and transforming fear-based thinking into possibility-driven action.',
    href: '/book/what-if-effect',
    image: '/images/book-cover-v13.png',
    cta: 'Explore The What If Effect',
    accent: '#C9A84C',
  },
  {
    title: 'The Two Rooms: Volume One — On Camera',
    kicker: 'Digital Field Manual · Communication',
    description: 'A 105-page practical system for experienced communicators who can command a room but need to recalibrate their skill for the camera.',
    href: '/two-rooms',
    image: null,
    cta: 'Explore The Two Rooms',
    accent: '#B34A32',
  },
]

export default function BooksPage() {
  return (
    <main style={{minHeight:'100vh',background:'#f5f2eb',color:'#111d35'}}>
      <nav style={{background:'#111d35',padding:'18px 24px'}} aria-label="Books navigation">
        <div style={{maxWidth:1180,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}>
          <a href="/" className="nav-logo" style={{color:'#fff',textDecoration:'none',display:'flex',alignItems:'center',gap:4}}>
            Chris<img src="/images/chris-marvel-logo.png" alt="" width={28} height={28}/><span>Marvel</span>
          </a>
          <a href="/" style={{color:'#fff',textDecoration:'none',fontWeight:700,fontSize:'.9rem'}}>Back to ChrisMarvelSpeaks.com</a>
        </div>
      </nav>

      <header style={{padding:'88px 24px 52px',borderBottom:'1px solid #ddd6c9'}}>
        <div style={{maxWidth:1180,margin:'0 auto'}}>
          <div style={{fontSize:'.74rem',letterSpacing:'3px',fontWeight:800,textTransform:'uppercase',color:'#B34A32',marginBottom:16}}>Books by Chris Marvel Davis</div>
          <h1 style={{fontSize:'clamp(3.8rem,9vw,8rem)',lineHeight:.88,letterSpacing:'-5px',textTransform:'uppercase',margin:'0 0 28px',fontWeight:900}}>Ideas built<br/>to be used.</h1>
          <p style={{maxWidth:760,fontFamily:"Georgia,'Times New Roman',serif",fontSize:'1.3rem',lineHeight:1.65,color:'#3d485a',margin:0}}>Books and field manuals that turn psychology, performance, communication, and possibility into frameworks people can actually apply.</p>
        </div>
      </header>

      <section style={{padding:'64px 24px 96px'}}>
        <div style={{maxWidth:1180,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:32}}>
          {books.map((book) => (
            <article key={book.title} style={{background:'#fff',border:'1px solid #ddd6c9',overflow:'hidden',boxShadow:'0 18px 50px rgba(17,29,53,.08)'}}>
              <div style={{height:420,background:'#111d35',display:'grid',placeItems:'center',padding:34,borderTop:`8px solid ${book.accent}`}}>
                {book.image ? (
                  <img src={book.image} alt={`${book.title} book cover`} style={{maxHeight:'100%',maxWidth:'82%',objectFit:'contain',filter:'drop-shadow(0 18px 30px rgba(0,0,0,.32))'}} />
                ) : (
                  <div style={{width:'72%',aspectRatio:'.72',background:'#F4F0E8',padding:'34px 28px',boxShadow:'20px 22px 0 #244B58,24px 26px 30px rgba(0,0,0,.28)',display:'flex',flexDirection:'column',justifyContent:'space-between',transform:'rotate(1.5deg)'}}>
                    <div style={{fontSize:'.62rem',letterSpacing:'2px',fontWeight:800,textTransform:'uppercase',color:'#555'}}>Volume One · On Camera</div>
                    <div style={{fontSize:'clamp(2.2rem,5vw,4rem)',lineHeight:.84,fontWeight:900,letterSpacing:'-2px',textTransform:'uppercase',color:'#171717'}}>The<br/>Two<br/><span style={{color:'#B34A32'}}>Rooms</span></div>
                    <div style={{height:5,background:'#B34A32'}} />
                    <div style={{fontSize:'.72rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'1px',color:'#171717'}}>Chris Marvel Davis</div>
                  </div>
                )}
              </div>
              <div style={{padding:'34px 34px 38px'}}>
                <div style={{fontSize:'.7rem',letterSpacing:'2px',fontWeight:800,textTransform:'uppercase',color:book.accent,marginBottom:12}}>{book.kicker}</div>
                <h2 style={{fontSize:'2rem',lineHeight:1.05,margin:'0 0 16px',fontWeight:900,textTransform:'uppercase'}}>{book.title}</h2>
                <p style={{lineHeight:1.75,color:'#4a4a4a',margin:'0 0 28px'}}>{book.description}</p>
                <a href={book.href} style={{display:'inline-block',background:'#111d35',color:'#fff',padding:'14px 20px',fontWeight:800,textDecoration:'none',textTransform:'uppercase',fontSize:'.78rem',letterSpacing:'1px'}}>{book.cta}</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer style={{background:'#111d35',color:'rgba(255,255,255,.7)',padding:'28px 24px',fontSize:'.85rem'}}>
        <div style={{maxWidth:1180,margin:'0 auto',display:'flex',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}>
          <div>© 2026 Chris Marvel Davis · Pivot Training &amp; Development</div>
          <div><a href="/" style={{color:'#fff'}}>ChrisMarvelSpeaks.com</a></div>
        </div>
      </footer>
    </main>
  )
}
