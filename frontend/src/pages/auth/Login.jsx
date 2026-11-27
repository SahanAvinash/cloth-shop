import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

const LABEL_CLASS = "mb-2.5 block text-[10px] tracking-[0.25em] text-white/60";

const INPUT_CLASS =
  "peer signin-input h-[54px] w-full border border-white/10 bg-white/[0.03] pl-12 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-300 hover:border-white/25 focus:border-white/70 focus:bg-white/[0.06]";

const ICON_CLASS =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors duration-300 peer-focus:text-white";

const TITLE_WORDS = ["Sign", "In"];

const COVER_LINES = [["Define"], ["Your", "Style."]];

const COVER_LETTERS = COVER_LINES.flat().join("");

const delay = (ms) => ({ animationDelay: `${ms}ms` });

const LOGIN_STYLES = `
  .signin-input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #141414 inset;
    -webkit-text-fill-color: #fff;
    caret-color: #fff;
  }

  .login-zoom {
    animation: loginZoom 2.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .login-down {
    animation: loginDown 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .login-spacing-wide {
    animation: loginSpacingWide 1s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .login-fade {
    animation: loginFade 0.8s ease-out both;
  }

  .login-up {
    animation: loginUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .login-letter {
    animation: loginLetter 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .login-spacing {
    animation: loginSpacing 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .login-line-x {
    animation: loginLineX 0.6s cubic-bezier(0.65, 0, 0.35, 1) both;
  }

  .login-line-y {
    animation: loginLineY 0.35s cubic-bezier(0.65, 0, 0.35, 1) both;
  }

  .login-btn-text {
    animation: loginBtnText 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes loginZoom {
    from { opacity: 0; transform: scale(1.12); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes loginDown {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes loginSpacingWide {
    from { opacity: 0; transform: translateY(20px); letter-spacing: 0.4em; }
    to { opacity: 1; transform: translateY(0); letter-spacing: 0.25em; }
  }

  @keyframes loginFade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes loginUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes loginLetter {
    from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes loginSpacing {
    from { opacity: 0; transform: translateY(20px); letter-spacing: 0.08em; }
    to { opacity: 1; transform: translateY(0); letter-spacing: 0; }
  }

  @keyframes loginLineX {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }

  @keyframes loginLineY {
    from { transform: scaleY(0); }
    to { transform: scaleY(1); }
  }

  @keyframes loginBtnText {
    from { transform: translateY(160%); }
    to { transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .login-zoom,
    .login-down,
    .login-spacing-wide,
    .login-fade,
    .login-up,
    .login-letter,
    .login-spacing,
    .login-line-x,
    .login-line-y,
    .login-btn-text {
      animation: none;
    }
  }
`;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "customer") {
        navigate("/account");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white flex">
      <section className="hidden lg:flex relative w-1/2 min-h-screen overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=90"
          alt="Fashion editorial"
          className="login-zoom absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        <div className="login-down absolute top-10 left-12" style={delay(200)}>
          <Link to="/" className="text-2xl font-serif tracking-[0.2em]">
            CLOTH<span className="text-white/50">.</span>
          </Link>
        </div>

        <div className="relative z-10 mt-auto px-14 pb-16">
          <p
            className="login-up text-[10px] tracking-[0.5em] text-white/70 mb-5"
            style={delay(300)}
          >
            THE NEW ERA OF FASHION
          </p>

          <h1
            aria-label={COVER_LINES.flat().join(" ")}
            className="font-serif text-6xl xl:text-7xl leading-tight"
          >
            {COVER_LINES.map((words, lineIndex) => (
              <span
                key={words.join(" ")}
                aria-hidden="true"
                className="flex flex-wrap gap-x-[0.25em]"
              >
                {words.map((word) => (
                  <span key={word} className="inline-block whitespace-nowrap">
                    {word.split("").map((char, charIndex) => (
                      <span
                        key={`${lineIndex}-${word}-${charIndex}`}
                        className="login-letter inline-block"
                        style={delay(
                          450 + (COVER_LETTERS.indexOf(word) + charIndex) * 60,
                        )}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <div
            className="login-line-x w-16 h-px origin-left bg-white/70 my-7"
            style={delay(1350)}
          />

          <p
            className="login-spacing-wide text-xs tracking-[0.25em] text-white/70"
            style={delay(1450)}
          >
            DISCOVER YOUR OWN IDENTITY
          </p>
        </div>
      </section>

      <section className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5 py-20 sm:px-8">
        <div className="login-fade pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06),transparent_60%)]" />

        <Link
          to="/"
          className="login-fade absolute left-5 top-6 flex items-center gap-2 py-2 text-[10px] tracking-[0.2em] text-white/50 transition hover:text-white sm:left-8"
        >
          <ArrowLeft size={14} />
          BACK TO HOME
        </Link>

        <div className="login-fade absolute right-5 top-6 py-1 lg:hidden">
          <Link to="/" className="font-serif text-xl tracking-[0.2em]">
            CLOTH.
          </Link>
        </div>

        <div className="relative w-full max-w-[440px] sm:bg-white/[0.015] sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute inset-0 hidden sm:block">
            <span className="login-line-x absolute left-0 top-0 h-px w-full origin-left bg-white/10" />
            <span className="login-line-x absolute bottom-0 right-0 h-px w-full origin-right bg-white/10" />
            <span
              className="login-line-y absolute right-0 top-0 h-full w-px origin-top bg-white/10"
              style={delay(450)}
            />
            <span
              className="login-line-y absolute bottom-0 left-0 h-full w-px origin-bottom bg-white/10"
              style={delay(450)}
            />
          </div>

          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-4">
              <span
                className="login-line-x h-px w-8 origin-right bg-white/30"
                style={delay(350)}
              />
              <p
                className="login-up pl-[0.4em] text-[10px] tracking-[0.4em] text-white/50"
                style={delay(200)}
              >
                WELCOME BACK
              </p>
              <span
                className="login-line-x h-px w-8 origin-left bg-white/30"
                style={delay(350)}
              />
            </div>

            <h2
              aria-label={TITLE_WORDS.join(" ")}
              className="mb-3 flex justify-center gap-x-3 font-serif text-5xl tracking-wide"
            >
              {TITLE_WORDS.map((word, wordIndex) => (
                <span key={word} aria-hidden="true" className="inline-block">
                  {word.split("").map((char, charIndex) => (
                    <span
                      key={`${word}-${charIndex}`}
                      className="login-letter inline-block"
                      style={delay(350 + (wordIndex * 4 + charIndex) * 70)}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <p
              className="login-spacing text-sm leading-relaxed text-white/45"
              style={delay(750)}
            >
              Access your account and explore the collection.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-up" style={delay(850)}>
              <label htmlFor="email" className={LABEL_CLASS}>
                EMAIL ADDRESS
              </label>

              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                  className={`${INPUT_CLASS} pr-4`}
                />
                <Mail size={17} className={ICON_CLASS} />
              </div>
            </div>

            <div className="login-up mt-5" style={delay(970)}>
              <label htmlFor="password" className={LABEL_CLASS}>
                PASSWORD
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className={`${INPUT_CLASS} pr-12`}
                />
                <Lock size={17} className={ICON_CLASS} />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-5 border border-red-400/30 bg-red-400/10 px-4 py-3 text-xs tracking-wide text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-7 w-full h-[56px] text-white flex items-center justify-center transition-transform duration-200 active:scale-[0.98] disabled:cursor-wait disabled:opacity-50"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100" />
              <span
                className="login-line-x absolute left-0 top-0 h-px w-full origin-left bg-white"
                style={delay(1100)}
              />
              <span
                className="login-line-x absolute bottom-0 right-0 h-px w-full origin-right bg-white"
                style={delay(1100)}
              />
              <span
                className="login-line-y absolute right-0 top-0 h-full w-px origin-top bg-white"
                style={delay(1550)}
              />
              <span
                className="login-line-y absolute bottom-0 left-0 h-full w-px origin-bottom bg-white"
                style={delay(1550)}
              />

              <span className="relative z-10 block overflow-hidden px-2 py-1">
                <span
                  className="login-btn-text flex items-center gap-4 transition-colors duration-500 group-hover:text-black group-focus-visible:text-black"
                  style={delay(1750)}
                >
                  <span className="text-[11px] font-semibold tracking-[0.3em]">
                    {loading ? "SIGNING IN..." : "SIGN IN"}
                  </span>

                  {!loading && (
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-2"
                    />
                  )}
                </span>
              </span>
            </button>
          </form>

          <p
            className="login-up mt-7 border-t border-white/10 pt-6 text-center text-sm text-white/45"
            style={delay(1300)}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white"
            >
              Create one
            </Link>
          </p>
        </div>
      </section>

      <style>{LOGIN_STYLES}</style>
    </main>
  );
}

export default Login;