/* ---------------------------------------------------------
   Simple footer: LOGO, links, socials, copyright.
   Spacing inline style වලින් දීලා තියෙනවා, ඒ නිසා
   global CSS reset එකකින් layout එක කැඩෙන්නේ නෑ.
--------------------------------------------------------- */
const LINKS = [
  { label: "NEW ARRIVALS", href: "/#new-arrivals" },
  { label: "MEN", href: "/#men" },
  { label: "WOMEN", href: "/#women" },
  { label: "SIZE GUIDE", href: "#" },
  { label: "DELIVERY", href: "#" },
  { label: "EXCHANGES", href: "#" },
];

const SOCIALS = [
  { label: "INSTAGRAM", href: "#" },
  { label: "FACEBOOK", href: "#" },
  { label: "TIKTOK", href: "#" },
];

const GUTTER = "clamp(24px, 4vw, 48px)";

export default function Footer() {
  return (
    <footer className="relative bg-[#0b0b0c] text-white">
      {/* soft separator from the section above */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      <div
        className="flex flex-col items-center text-center"
        style={{
          maxWidth: 1400,
          marginInline: "auto",
          padding: `clamp(64px, 8vw, 96px) ${GUTTER} 40px`,
        }}
      >
        {/* Brand */}
        <a
          href="/"
          className="font-serif text-3xl tracking-[0.3em] md:text-4xl"
        >
          LOGO
        </a>
        <p
          className="text-sm tracking-wide text-white/50"
          style={{ marginTop: 16 }}
        >
          Everyday essentials, designed in Sri Lanka.
        </p>

        {/* Links */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
          style={{ marginTop: 48, maxWidth: 640 }}
        >
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[11px] tracking-[0.25em] text-white/60 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Socials */}
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          style={{ marginTop: 40 }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="rounded-full border border-white/20 text-[10px] tracking-[0.25em] text-white/70 transition-all hover:border-white hover:bg-white hover:text-black"
              style={{ padding: "10px 18px" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="border-t border-white/10 text-center text-[10px] tracking-[0.25em] text-white/40"
        style={{ padding: `24px ${GUTTER}` }}
      >
        © 2026 CLOTHING STORE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}