import '../../../globals.css'
import '../../two-rooms.css'

export default function FieldKitThankYouPage() {
  return (
    <main className="tr-page" style={{minHeight:'100vh',padding:'80px 24px'}}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <section style={{textAlign:'center',background:'#fff',padding:'56px 42px',border:'1px solid #ded9d1',boxShadow:'0 24px 60px rgba(0,0,0,.08)'}}>
          <div className="tr-eyebrow">Purchase complete</div>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(3rem,8vw,5.6rem)',lineHeight:.9,textTransform:'uppercase',letterSpacing:'-3px',margin:'0 0 26px'}}>Your Field Kit<br/>is yours.</h1>
          <p style={{fontFamily:"Georgia,'Times New Roman',serif",fontStyle:'italic',fontSize:'1.3rem',lineHeight:1.5,color:'#3f4e52',marginBottom:20}}>You purchased <strong>The Two Rooms Field Kit.</strong></p>
          <p style={{fontSize:'1.02rem',lineHeight:1.75,color:'#444',maxWidth:650,margin:'0 auto 30px'}}>Your payment was processed securely through Stripe. Your permanent digital-delivery button will appear here as soon as the Field Kit file is connected to the site&apos;s fulfillment storage.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <a className="tr-btn tr-btn-rust" href="mailto:Jazmine@pivottraining.us?subject=Field%20Kit%20Download%20Access">Need Download Access?</a>
            <a className="tr-btn tr-btn-ghost" href="/two-rooms">Explore the Full Manual</a>
          </div>
          <p style={{fontSize:'.82rem',color:'#777',marginTop:24}}>Questions? <a href="mailto:Jazmine@pivottraining.us" style={{textDecoration:'underline'}}>Jazmine@pivottraining.us</a></p>
        </section>

        <section style={{marginTop:30,background:'#111d35',color:'#fff',padding:'48px 44px',borderTop:'8px solid #b34a32'}}>
          <div style={{fontFamily:'var(--font-heading)',fontSize:'.72rem',fontWeight:800,letterSpacing:'3px',textTransform:'uppercase',color:'#d6b79a',marginBottom:16}}>Go deeper</div>
          <h2 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2.2rem,5vw,4rem)',lineHeight:1,textTransform:'uppercase',letterSpacing:'-2px',margin:'0 0 18px'}}>The full system is 105 pages.</h2>
          <p style={{lineHeight:1.75,color:'rgba(255,255,255,.78)',maxWidth:700,marginBottom:24}}>The Field Kit gives you six operating tools. <strong>The Two Rooms: Volume One — On Camera</strong> gives you the complete framework behind them: 22 chapters, camera calibration, content systems, drills, failure patterns, and the full Field Kit integrated into the manual.</p>
          <a className="tr-btn tr-btn-rust" href="/two-rooms">See The Two Rooms — $47</a>
        </section>
      </div>
    </main>
  )
}
