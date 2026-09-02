import '../../../globals.css'
import '../../two-rooms.css'

export default function LabThankYou(){
  return <main className="tr-page" style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'80px 24px'}}>
    <section style={{maxWidth:760,textAlign:'center',background:'#fff',padding:'56px 42px',border:'1px solid #ded9d1'}}>
      <div className="tr-eyebrow">Enrollment complete</div>
      <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(3rem,8vw,5rem)',lineHeight:.9,textTransform:'uppercase',letterSpacing:'-3px',margin:'0 0 24px'}}>Welcome to<br/>The Lab.</h1>
      <p style={{fontSize:'1.02rem',lineHeight:1.75,color:'#444'}}>Your payment was processed securely through Stripe. We have your enrollment. Watch the email address used at checkout for onboarding and next steps.</p>
      <div style={{marginTop:28}}><a className="tr-btn tr-btn-rust" href="mailto:Jazmine@pivottraining.us?subject=Two%20Rooms%20Lab%20Enrollment">Questions About The Lab?</a></div>
    </section>
  </main>
}
