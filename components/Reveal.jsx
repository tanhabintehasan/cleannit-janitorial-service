"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scroll-reveal: adds .in to every .reveal element as it enters the viewport.
// Re-runs on every route change so client-side navigated pages are covered.
export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");
    // Close the mobile menu after every navigation / menu tap.
    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) navToggle.checked = false;
    const els = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
