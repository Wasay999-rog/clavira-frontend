export default function Section({ children, style }) {
  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 48px', ...style }} className="section-wrap">
      {children}
    </div>
  );
}
