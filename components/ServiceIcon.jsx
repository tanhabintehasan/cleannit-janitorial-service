// Inline SVG icons for the multi-step quote form service picker.
const icons = {
  "commercial-cleaning": <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></>,
  "janitorial-services": <><path d="M4 20h16M6 20V10a6 6 0 0 1 12 0v10"/><path d="M12 4v3"/></>,
  "power-washing": <><path d="M4 17l7-7 3 3-7 7H4v-3z"/><path d="M14 6l4 4M16 3l5 5M18 10l2 2"/></>,
  "window-cleaning": <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M4 12h16"/></>,
  "balcony-cleaning": <><path d="M3 21h18M5 21V8h14v13M5 12h14M9 8V5m6 3V5"/></>,
  "post-construction-cleaning": <><path d="M3 21h18M6 21V10l6-5 6 5v11"/><path d="M10 21v-4h4v4"/></>,
  "bird-netting": <><path d="M4 6c4 4 12 4 16 0M4 12c4 4 12 4 16 0M4 18c4 4 12 4 16 0M8 4v16m8-16v16"/></>,
  "office-cleaning": <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></>,
  "house-cleaning": <><path d="M3 11l9-8 9 8M5 9v11h14V9"/><path d="M10 20v-5h4v5"/></>,
  "move-out-cleaning": <><path d="M9 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M3 21h18M13 12h2m-8 4-3-3 3-3"/></>,
  "carpet-cleaning": <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M3 13h18M3 17h18"/></>,
  "painting-services": <><rect x="3" y="4" width="12" height="5" rx="1"/><path d="M15 6h3a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-7v3"/><path d="M10 15h4v6h-4z"/></>,
  default: <><path d="M12 2l1.8 5.6 5.2 1.6-5.2 1.6L12 16.4l-1.8-5.6L5 9.2 10.2 7.6 12 2z"/></>,
};

export default function ServiceIcon({ slug, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[slug] || icons.default}
    </svg>
  );
}
