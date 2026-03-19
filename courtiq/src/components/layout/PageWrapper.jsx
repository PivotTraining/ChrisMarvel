export default function PageWrapper({ children, className = '' }) {
  return (
    <main
      className={`min-h-screen px-4 pt-4 pb-24 mt-14 max-w-lg mx-auto ${className}`}
    >
      {children}
    </main>
  );
}
