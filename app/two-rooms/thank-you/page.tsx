import '../../globals.css'
import '../two-rooms.css'

export default function TwoRoomsThankYouPage() {
  return (
    <main className="tr-page" style={{minHeight:'100vh',display:'grid',placeItems:'center',padding:'80px 24px'}}>
      <section style={{maxWidth:760,textAlign:'center',background:'#fff',padding:'56px 42px',border:'1px solid #ded9d1',boxShadow:'0 24px 60px rgba(0,0,0,.08)'}}>
        <div className="tr-eyebrow">Order received</div>
        <h1 style={{fontFamily:'var(--font-heading)',fontSize:'clamp(3rem,8vw,5.8rem)',lineHeight:.9,textTransform:'uppercase',letterSpacing:'-3px',margin:'0 0 26px'}}>You&apos;re in<br />the second room.</h1>
        <p style={{fontFamily:"Georgia,'Times New Roman',serif",fontStyle:'italic',fontSize:'1.35rem',lineHeight:1.5,color:'#3f4e52',marginBottom:24}}>Thank you for purchasing <strong>The Two Rooms: Volume One — On Camera.</strong></p>
        <p style={{fontSize:'1.02rem',lineHeight:1.75,color:'#444',maxWidth:610,margin:'0 auto 32px'}}>Your payment was processed securely through Stripe. Your order details and shipping information have been received. Keep an eye on the email address used at checkout for your receipt and any fulfillment updates.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <a className="tr-btn tr-btn-rust" href="/two-rooms">Back to The Two Rooms</a>
          <a className="tr-btn tr-btn-ghost" href="/">Visit ChrisMarvelSpeaks.com</a>
        </div>
        <p style={{fontSize:'.84rem',color:'#777',marginTop:30}}>Questions about your order? <a href="mailto:Jazmine@pivottraining.us" style={{textDecoration:'underline'}}>Jazmine@pivottraining.us</a></p>
      </section>
    </main>
  )
}
