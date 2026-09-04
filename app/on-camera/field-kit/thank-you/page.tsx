import '../../../globals.css'
import '../../../two-rooms/two-rooms.css'

const upgrade='https://buy.stripe.com/7sY00j3xHdHW2b5dDDa3u0D'

export default function FieldKitThankYou(){return <main className="tr-page" style={{minHeight:'100vh',padding:'80px 24px'}}><div style={{maxWidth:900,margin:'0 auto'}}>
<section style={{textAlign:'center',background:'#fff',padding:'56px 42px',border:'1px solid #ded9d1'}}><div className="tr-eyebrow">Purchase complete</div><h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(3rem,8vw,5.4rem)',lineHeight:.9,textTransform:'uppercase',letterSpacing:'-3px'}}>Your Camera<br/>Field Kit is yours.</h1><p style={{lineHeight:1.75,color:'#444'}}>Your payment was processed securely through Stripe. Permanent file delivery will be connected here once private fulfillment storage is live.</p><a className="tr-btn tr-btn-rust" href="mailto:Jazmine@pivottraining.us?subject=Camera%20Field%20Kit%20Download%20Access">Need Download Access?</a></section>
<section style={{marginTop:30,background:'#111d35',color:'#fff',padding:'48px 44px',borderTop:'8px solid #b34a32'}}><div className="tr-section-kicker light">One-time upgrade</div><h2 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(2.2rem,5vw,4rem)',lineHeight:1,textTransform:'uppercase'}}>Add the complete 105-page ON CAMERA manual for $20.</h2><p style={{lineHeight:1.75,color:'rgba(255,255,255,.78)'}}>You already paid $27 for the operating tools. Add the complete manual for the difference, keeping your total at the same $47 direct price.</p><a className="tr-btn tr-btn-rust" href={upgrade}>Upgrade to ON CAMERA — $20</a></section>
</div></main>}
