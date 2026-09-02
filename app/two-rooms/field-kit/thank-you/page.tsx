import '../../../globals.css'
import '../../two-rooms.css'

const upgradeCheckout = 'https://buy.stripe.com/7sY00j3xHdHW2b5dDDa3u0D'

export default function FieldKitThankYouPage() {
  return (
    <main className="tr-page" style={{minHeight:'100vh',padding:'80px 24px'}}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <section style={{textAlign:'center',background:'#fff',padding:'56px 42px',border:'1px solid #ded9d1',boxShadow:'0 24px 60px rgba(0,0,0,.08)'}}>
          <div className="tr-eyebrow">Purchase complete</div>
          <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(3rem,8vw,5.6rem)',lineHeight:.9,textTransform:'uppercase',letterSpacing:'-3px',margin:'0 0 26px'}}>Your Field Kit<br/>is yours.</h1>
          <p style={{fontFamily:"Georgia,'Times New Roman',serif",fontStyle:'italic',fontSize:'1.3rem',lineHeight:1.5,color:'#3f4e52',marginBottom:20}}>You purchased <strong>The Two Rooms Field Kit.</strong></p>
          <p style={{fontSize:'1.02rem',lineHeight:1.75,color:'#444',maxWidth:650,margin:'0 auto 30px'}}>Your payment was processed securely through Stripe. Your permanent digital-delivery button will be connected once fulfillment storage is live.</p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <a className="tr-btn tr-btn-rust" href="mailto:Jazmine@pivottraining.us?subject=Field%20Kit%20Download%20Access">Need Download Access?</a>
          </div>
        </section>

        <section style={{marginTop:30,background:'#111d35',color:'#fff',padding:'48px 44px',borderTop:'8px solid #b34a32'}}>
          <div style={{fontFamily:'var(--font-heading)',fontSize:'.72rem',fontWeight:800,letterSpacing:'3px',textTransform:'uppercase',color:'#d6b79a',marginBottom:16}}>One-time upgrade</div>
          <h2 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2.2rem,5vw,4rem)',lineHeight:1,textTransform:'uppercase',letterSpacing:'-2px',margin:'0 0 18px'}}>Unlock the full 105-page system for $20 more.</h2>
          <p style={{lineHeight:1.75,color:'rgba(255,255,255,.78)',maxWidth:700,marginBottom:22}}>You already paid $27 for the operating tools. Add the complete <strong>The Two Rooms: Volume One — On Camera</strong> manual for the difference instead of paying another $47.</p>
          <ul style={{lineHeight:1.85,color:'rgba(255,255,255,.82)',paddingLeft:20,marginBottom:26}}>
            <li>22 complete chapters</li>
            <li>The Eighteen-Inch Room, 115 Setting, Five Wells, First Fifty and more</li>
            <li>Full drills, diagnostics, calibration tables and filming ladder</li>
            <li>Your Field Kit pages are already integrated inside</li>
          </ul>
          <a className="tr-btn tr-btn-rust" href={upgradeCheckout}>Upgrade to the Full System — $20</a>
          <div style={{fontSize:'.8rem',color:'rgba(255,255,255,.55)',marginTop:14}}>Field Kit + upgrade = the same $47 total as buying the full manual directly.</div>
        </section>
      </div>
    </main>
  )
}
