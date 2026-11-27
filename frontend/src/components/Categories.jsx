import { useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------
   Shop by category: Men / Women තෝරන්න කාඩ් දෙකක්.
   Spacing (padding / margin) inline style වලින් දීලා තියෙනවා,
   ඒ නිසා global CSS reset එකකින් layout එක කැඩෙන්නේ නෑ.

   Images (අවශ්‍ය නම්): public/products/cat-men.jpg
                         public/products/cat-women.jpg
   Image නැති වෙලාවට tone color එකෙන් ලස්සනට පේනවා.

   Card එකක් select කළාම යන්නේ `href` එකට (/men, /women).
   Router එකක් (react-router) පාවිච්චි කරනවා නම්,
   <Categories onSelect={(id) => navigate(`/${id}`)} /> කියලා දෙන්න.
--------------------------------------------------------- */
const CATEGORIES = [
  {
    id: "men",
    href: "/men",
    subtitle: "FOR HIM",
    title: "Polo T-Shirts", // alt / aria text විතරයි, screen එකේ පේන්නේ නෑ
    note: "Clean collars. Classic fits.",
    tone: "#d9d4cb",
    image: "/products/cat-men.jpg",
  },
  {
    id: "women",
    href: "/women",
    subtitle: "FOR HER",
    title: "Crop Tops", // alt / aria text විතරයි, screen එකේ පේන්නේ නෑ
    note: "Light, easy, made to move.",
    tone: "#e8dcd5",
    image: "/products/cat-women.jpg",
  },
];

const GUTTER = "clamp(24px, 4vw, 48px)";
const CARD_PAD = "clamp(24px, 3vw, 40px)";

/* ---------------- Scroll fade-in ---------------- */
function Reveal({ children, delay = 0, className = "", style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- Image (නැත්නම් hide වෙනවා) ---------------- */
function SafeImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* ---------------- Category Card ---------------- */
function CategoryCard({ cat, onSelect }) {
  return (
    <a
      id={cat.id}
      href={cat.href}
      onClick={
        onSelect
          ? (e) => {
              e.preventDefault();
              onSelect(cat.id);
            }
          : undefined
      }
      aria-label={`Shop ${cat.subtitle.toLowerCase()}: ${cat.title}`}
      className="group relative block aspect-[4/5] scroll-mt-24 overflow-hidden rounded-2xl text-white shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10 md:aspect-[5/6]"
      style={{ backgroundColor: cat.tone }}
    >
      <SafeImage
        src={cat.image}
        alt={cat.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
      />

      {/* shade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

      {/* bottom content */}
      <div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6"
        style={{ padding: CARD_PAD }}
      >
        <div>
          <h3 className="text-lg tracking-[0.35em] text-white md:text-xl">
            {cat.subtitle}
          </h3>
          <p
            className="text-sm tracking-wide text-white/70"
            style={{ marginTop: 12 }}
          >
            {cat.note}
          </p>
        </div>

        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/40 text-xl backdrop-blur-sm transition-all duration-300 group-hover:bg-white group-hover:text-black">
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </a>
  );
}

/* ---------------- Section ---------------- */
export default function Categories({ onSelect }) {
  return (
    <section
      id="shop"
      className="relative scroll-mt-20 overflow-hidden bg-[#0b0b0c] text-white"
    >
      {/* soft separator from the section above */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

      {/* background glow */}
      <div className="pointer-events-none absolute left-1/2 top-[45%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[120px]" />

      {/* ---------- Header ---------- */}
      <div
        className="relative text-center"
        style={{ padding: `clamp(80px, 9vw, 112px) ${GUTTER} 0` }}
      >
        <Reveal>
          <p
            className="text-[11px] tracking-[0.5em] text-white/50"
            style={{ marginBottom: 20 }}
          >
            SHOP BY CATEGORY
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-wide md:text-6xl">
            Choose Your Style
          </h2>
          <p
            className="text-sm leading-relaxed tracking-wide text-white/60"
            style={{ margin: "24px auto 0", maxWidth: "28rem" }}
          >
            Two collections, one everyday wardrobe. Pick a side and start
            exploring.
          </p>
        </Reveal>
      </div>

      {/* ---------- Cards ---------- */}
      <div
        className="relative grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6"
        style={{
          maxWidth: 1400,
          marginInline: "auto",
          padding: `56px ${GUTTER} clamp(80px, 9vw, 112px)`,
        }}
      >
        {CATEGORIES.map((cat, i) => (
          <Reveal key={cat.id} delay={i * 150}>
            <CategoryCard cat={cat} onSelect={onSelect} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}