
import { useEffect, useState } from "react";

const LEFT_LINKS = [
  { label: "HOME", href: "/" },
  { label: "MEN", href: "/#men" },
  { label: "WOMEN", href: "/#women" },
];

const RIGHT_LINKS = [
  { label: "NEW ARRIVALS", href: "/#new-arrivals" },
  { label: "CART", href: "/cart" },
];

export default function Navbar() {
  const [heroDone, setHeroDone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );

  const scrolled = heroDone;

  // HERO ANIMATION EVENT
  useEffect(() => {
    const onHeroDone = (e) => {
      setHeroDone(e.detail);
    };

    window.addEventListener("hero-done", onHeroDone);

    return () => {
      window.removeEventListener("hero-done", onHeroDone);
    };
  }, []);

  // AUTH STATUS
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setProfileOpen(false);
    };

    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("auth-changed", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("auth-changed", checkLoginStatus);
    };
  }, []);

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setProfileOpen(false);
    setMenuOpen(false);

    window.dispatchEvent(new Event("auth-changed"));

    window.location.href = "/login";
  };

  const linkClass =
    "text-xs tracking-[0.2em] hover:opacity-60 transition-opacity duration-300";

  const navPadding = {
    paddingLeft: "clamp(24px, 6vw, 120px)",
    paddingRight: "clamp(24px, 6vw, 120px)",
  };

  const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

  // DROPDOWN THEME
  const dropdownTheme = scrolled
    ? "bg-white/95 text-black border-black/10"
    : "bg-black/95 text-white border-white/15";

  const dividerTheme = scrolled
    ? "bg-black/10"
    : "bg-white/15";

  return (
    <>
      {/* MAIN NAVBAR */}
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
          {/* LEFT NAVIGATION */}
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

          {/* LOGO */}
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

          {/* RIGHT NAVIGATION */}
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

            {/* PROFILE / LOGIN */}
            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`${linkClass} flex items-center gap-2`}
                  aria-expanded={profileOpen}
                >
                  PROFILE

                  <svg
                    className={`transition-transform duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {/* DESKTOP DROPDOWN */}
                <div
                  className={`absolute right-0 top-full pt-5 w-48 transition-all duration-300 origin-top-right ${
                    profileOpen
                      ? "opacity-100 translate-y-0 visible"
                      : "opacity-0 -translate-y-2 invisible pointer-events-none"
                  }`}
                >
                  <div
                    className={`border shadow-xl backdrop-blur-xl overflow-hidden ${dropdownTheme}`}
                  >
                    <div className="px-5 pt-5 pb-3">
                      <p className="text-[9px] tracking-[0.3em] opacity-40 mb-1">
                        MY ACCOUNT
                      </p>

                      <p className="text-xs tracking-[0.15em]">
                        Welcome Back
                      </p>
                    </div>

                    <div className={`h-px mx-5 ${dividerTheme}`} />

                    <a
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center justify-between px-5 py-4 text-[10px] tracking-[0.2em] hover:pl-7 hover:bg-black/5 transition-all duration-300"
                    >
                      <span>PROFILE</span>
                      <span className="opacity-40">↗</span>
                    </a>

                    <div className={`h-px mx-5 ${dividerTheme}`} />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between px-5 py-4 text-[10px] tracking-[0.2em] text-red-500 hover:pl-7 hover:bg-black/5 transition-all duration-300"
                    >
                      <span>LOGOUT</span>
                      <span className="opacity-60">↗</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <a href="/login" className={linkClass}>
                LOGIN
              </a>
            )}
          </div>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden fixed inset-0 z-[60] ${
          menuOpen
            ? "visible"
            : "invisible pointer-events-none"
        }`}
      >
        {/* BACKDROP */}
        <div
          onClick={() => {
            setMenuOpen(false);
            setProfileOpen(false);
          }}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* SIDEBAR */}
        <aside
          className={`absolute top-0 left-0 h-full w-[75%] max-w-[300px] bg-black text-white border-r border-white/10 flex flex-col transition-transform duration-300 ${
            menuOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
          style={{ padding: "32px 28px 0" }}
        >
          {/* CLOSE BUTTON */}
          <div
            className="flex justify-end"
            style={{ marginBottom: 40 }}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                setProfileOpen(false);
              }}
              className="text-3xl font-light"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          {/* MOBILE LINKS */}
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

            {/* MOBILE PROFILE */}
            {isLoggedIn ? (
              <div className="flex flex-col items-center gap-5 profile-dropdown">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="text-sm tracking-[0.2em] flex items-center gap-2"
                  aria-expanded={profileOpen}
                >
                  PROFILE

                  <svg
                    className={`transition-transform duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                <div
                  className={`flex flex-col items-center gap-5 overflow-hidden transition-all duration-300 ${
                    profileOpen
                      ? "max-h-32 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <a
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs tracking-[0.2em] text-white/70 hover:text-white transition-colors"
                  >
                    PROFILE
                  </a>

                  <button
                    onClick={handleLogout}
                    className="text-xs tracking-[0.2em] text-red-400 hover:text-red-300 transition-colors"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            ) : (
              <a
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-[0.2em] hover:opacity-50 transition-opacity"
                style={{ padding: "12px 0" }}
              >
                LOGIN
              </a>
            )}
          </nav>
        </aside>
      </div>
    </>
  );
}
