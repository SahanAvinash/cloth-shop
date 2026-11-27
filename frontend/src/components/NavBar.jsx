import { useEffect, useState } from "react";

const LEFT_LINKS = [
  { label: "HOME", href: "/" },
  { label: "MEN", href: "/#men" },
  { label: "WOMEN", href: "/#women" },
];

const RIGHT_LINKS = [
  { label: "NEW ARRIVALS", href: "/#new-arrivals" },
  { label: "CART", href: "/cart" },
  { label: "PROFILE", href: "/profile" },
];

const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

export default function Navbar() {
  const [heroDone, setHeroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrolled = heroDone;

  useEffect(() => {
    const onHeroDone = (e) => {
      setHeroDone(e.detail);
    };

    window.addEventListener("hero-done", onHeroDone);

    return () => {
      window.removeEventListener("hero-done", onHeroDone);
    };
  }, []);

  const linkClass =
    "text-xs tracking-[0.2em] hover:opacity-60 transition-opacity duration-300";

  const navPadding = {
    paddingLeft: "clamp(24px, 6vw, 120px)",
    paddingRight: "clamp(24px, 6vw, 120px)",
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          scrolled
            ? "bg-white backdrop-blur-md text-black border-b border-black/5"
            : "bg-transparent text-white border-b border-transparent"
        }`}
      >
        <nav
          className="h-20 grid grid-cols-3 items-center"
          style={navPadding}
        >
          <div className="flex items-center justify-self-start">
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex flex-col items-center justify-center gap-[6px] w-10 h-10 -ml-2"
              aria-label="Open menu"
            >
              <span className="w-6 h-[1.5px] bg-current" />
              <span className="w-4 h-[1.5px] bg-current" />
            </button>

            <div className="hidden md:flex items-center gap-8">
              {LEFT_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className={linkClass}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <a
            href="/"
            className={`justify-self-center font-serif text-2xl md:text-3xl tracking-[0.25em] transition-all duration-700 ${
              scrolled
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-3 pointer-events-none"
            }`}
          >
            LOGO
          </a>

          <div className="hidden md:flex items-center gap-8 justify-self-end">
            {RIGHT_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={linkClass}
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      </header>

      <div
        className={`md:hidden fixed inset-0 z-[60] ${
          menuOpen
            ? "visible"
            : "invisible pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute top-0 left-0 h-full w-[75%] max-w-[300px] bg-black text-white border-r border-white/10 flex flex-col transition-transform duration-300 ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
          style={{ padding: "32px 28px 0" }}
        >
          <div
            className="flex justify-end"
            style={{ marginBottom: 40 }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-light"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <nav
            className="flex flex-col items-center flex-1 gap-8"
            style={{ paddingBottom: 80 }}
          >
            {ALL_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-[0.2em] hover:opacity-50 transition-opacity"
                style={{ padding: "12px 0" }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </aside>
      </div>
    </>
  );
}