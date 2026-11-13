// Animated 3-step visual strip describing the balcony work: sanitize → net → protect.
// Icons animate on hover to demonstrate each stage of the job.
export default function NetWorkVisual() {
  return (
    <div className="netviz">
      <div className="netviz-step">
        <span className="netviz-num">Step 1</span>
        <svg className="netviz-icon netviz-spray" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M14 20h12v18a4 4 0 01-4 4h-4a4 4 0 01-4-4z" />
          <path d="M16 20v-6h8v6 M20 14V8h8" />
          <line x1="32" y1="12" x2="38" y2="8" />
          <line x1="34" y1="16" x2="41" y2="14" />
          <line x1="34" y1="20" x2="40" y2="22" />
        </svg>
        <b>Sanitize &amp; Clean</b>
        <p>Droppings misted, removed and the whole balcony disinfected — safely, no runoff.</p>
      </div>
      <div className="netviz-step">
        <span className="netviz-num">Step 2</span>
        <svg className="netviz-icon netviz-net" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M8 8h32v32H8z" />
          <path d="M8 18h32 M8 29h32 M18 8v32 M29 8v32" />
          <circle cx="18" cy="18" r="1.4" />
          <circle cx="29" cy="18" r="1.4" />
          <circle cx="18" cy="29" r="1.4" />
          <circle cx="29" cy="29" r="1.4" />
        </svg>
        <b>Netting Installed</b>
        <p>UV-stabilized netting anchored and tensioned edge-to-edge — discreet and humane.</p>
      </div>
      <div className="netviz-step">
        <span className="netviz-num">Step 3</span>
        <svg className="netviz-icon netviz-shield" viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 6l14 5v11c0 10-6 16-14 20-8-4-14-10-14-20V11z" />
          <path d="M17 24l5 5 9-10" />
        </svg>
        <b>Permanently Protected</b>
        <p>Pigeons can't land or nest — your balcony stays clean for 7–10 years.</p>
      </div>
    </div>
  );
}
