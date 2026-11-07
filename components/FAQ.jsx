// FAQs rendered as semantic <details> so answers exist as plain text in the
// HTML (extractable by search engines and LLMs — not JS-only).
export default function FAQ({ faqs }) {
  if (!faqs?.length) return null;
  return (
    <div>
      {faqs.map((f, i) => (
        <details className="faq-item" key={i}>
          <summary>{f.q}</summary>
          <div className="faq-a"><p style={{ margin: 0 }}>{f.a}</p></div>
        </details>
      ))}
    </div>
  );
}
