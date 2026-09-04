export default function Template({ children }: { children: React.ReactNode }) {
  return <>
    <style>{`.nav-links a[href="/book"][role="menuitem"]{font-size:0}.nav-links a[href="/book"][role="menuitem"]::after{content:"Books";font-size:.9rem}`}</style>
    {children}
  </>
}
