import '../../../globals.css'
import '../../two-rooms.css'

export default function ScriptVaultThankYou(){
  return <main className="tr-page" style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'80px 24px'}}>
    <section style={{maxWidth:760,textAlign:'center',background:'#fff',padding:'56px 42px',border:'1px solid #ded9d1'}}>
      <div className="tr-eyebrow">Purchase complete</div>
      <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(3rem,8vw,5rem)',lineHeight:.9,textTransform:'uppercase',letterSpacing:'-3px',margin:'0 0 24px'}}>Your Script Vault<br/>is ready.</h1>
      <p style={{fontSize:'1.02rem',lineHeight:1.75,color:'#444'}}>Your payment was processed securely through Stripe. Permanent file delivery will be connected to this page once fulfillment storage is live.</p>
      <div style={{marginTop:28}}><a className="tr-btn tr-btn-rust" href="mailto:Jazmine@pivottraining.us?subject=Script%20Vault%20Download%20Access">Need Download Access?</a></div>
    </section>
  </main>
}
