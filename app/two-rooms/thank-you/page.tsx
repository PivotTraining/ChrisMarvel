import '../../globals.css'
import '../two-rooms.css'

export default function TwoRoomsThankYouPage() {
  return (
    <main className="tr-page" style={{minHeight:'100vh',padding:'80px 24px'}}>
      <div style={{maxWidth:980,margin:'0 auto'}}>
        <section style={{textAlign:'center',background:'#fff',padding:'56px 42px',border:'1px solid #ded9d1',boxShadow:'0 24px 60px rgba(0,0,0,.08)'}}>
          <div className="tr-eyebrow">Purchase complete</div>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(3rem,8vw,5.8rem)',lineHeight:.9,textTransform:'uppercase',letterSpacing:'-3px',margin:'0 0 26px'}}>You&apos;re in<br />the second room.</h1>
          <p style={{fontFamily:"Georgia,'Times New Roman',serif",fontStyle:'italic',fontSize:'1.35rem',lineHeight:1.5,color:'#3f4e52',marginBottom:20}}>Your copy of <strong>The Two Rooms: Volume One — On Camera</strong> is ready.</p>
          <p style={{fontSize:'1.02rem',lineHeight:1.75,color:'#444',maxWidth:650,margin:'0 auto 30px'}}>Your payment was processed securely through Stripe. Use the button below to access your digital field manual. Save the PDF to your device so you can return to it before filming sessions.</p>
          <a className="tr-btn tr-btn-rust" href="/two-rooms/download">Download The Two Rooms PDF</a>
          <p style={{fontSize:'.8rem',color:'#777',marginTop:16}}>Digital purchase for personal use. Questions about access? <a href="mailto:Jazmine@pivottraining.us" style={{textDecoration:'underline'}}>Jazmine@pivottraining.us</a></p>
        </section>

        <section style={{marginTop:32,background:'#111d35',color:'#fff',padding:'54px 46px',borderTop:'8px solid #b34a32'}}>
          <div style={{fontFamily:'var(--font-heading)',fontSize:'.72rem',fontWeight:800,letterSpacing:'3px',textTransform:'uppercase',color:'#d6b79a',marginBottom:18}}>Your next room</div>
          <div style={{display:'grid',gridTemplateColumns:'1.15fr .85fr',gap:42,alignItems:'center'}}>
            <div>
              <h2 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2.4rem,5vw,4.4rem)',lineHeight:1,textTransform:'uppercase',letterSpacing:'-2px',margin:'0 0 20px'}}>The Two Rooms Lab</h2>
              <p style={{fontFamily:"Georgia,'Times New Roman',serif",fontStyle:'italic',fontSize:'1.25rem',lineHeight:1.5,color:'#eadfd1',marginBottom:20}}>The book gives you the system. The Lab gives you the reps.</p>
              <p style={{lineHeight:1.75,color:'rgba(255,255,255,.78)',marginBottom:22}}>For readers who want guided implementation: camera calibration, take diagnostics, structured filming reps, content extraction, and direct feedback designed to turn the principles in the book into visible camera competence.</p>
              <ul style={{lineHeight:1.9,color:'rgba(255,255,255,.82)',paddingLeft:20,margin:0}}>
                <li>Guided camera-rep sessions</li>
                <li>Five-Point Diagnostic feedback</li>
                <li>Opening, pace, eye-line, and energy calibration</li>
                <li>Content extraction from your existing expertise</li>
                <li>Reel and buyer-facing camera review</li>
              </ul>
            </div>
            <div style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.16)',padding:'32px'}}>
              <div style={{fontFamily:'var(--font-heading)',fontSize:'.7rem',fontWeight:800,letterSpacing:'2px',textTransform:'uppercase',color:'#d6b79a',marginBottom:12}}>Ascension tier</div>
              <h3 style={{fontFamily:'var(--font-heading)',fontSize:'1.65rem',lineHeight:1.15,textTransform:'uppercase',margin:'0 0 16px'}}>Go from reading to reps.</h3>
              <p style={{lineHeight:1.65,color:'rgba(255,255,255,.74)',marginBottom:24}}>Priority access is open while the full Lab offer and pricing are finalized.</p>
              <a className="tr-btn tr-btn-rust" style={{display:'block',textAlign:'center'}} href="mailto:Jazmine@pivottraining.us?subject=The%20Two%20Rooms%20Lab%20Priority%20Access">Get Priority Access</a>
            </div>
          </div>
        </section>

        <div style={{textAlign:'center',marginTop:28}}>
          <a href="/two-rooms" style={{marginRight:20,textDecoration:'underline'}}>Back to The Two Rooms</a>
          <a href="/" style={{textDecoration:'underline'}}>Visit ChrisMarvelSpeaks.com</a>
        </div>
      </div>
    </main>
  )
}
