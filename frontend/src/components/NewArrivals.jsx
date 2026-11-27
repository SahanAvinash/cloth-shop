import { useCallback, useEffect, useRef, useState } from "react";

/* ---------------------------------------------------------
   NOTE
   Spacing (padding / margin) ඔක්කොම inline style වලින් දීලා තියෙනවා.
   ඒ නිසා index.css එකේ `* { margin:0; padding:0 }` වගේ reset එකක්
   තිබුණත් layout එක කැඩෙන්නේ නෑ.

   Images දාන්න: public/products/ folder එකට දාලා
   පහළ paths වලට ගැලපෙන නම් දෙන්න. Image නැති වෙලාවට
   "tone" color එකෙන් ලස්සනට පේනවා.
--------------------------------------------------------- */
const MEN = [
  {
    id: 1,
    name: "Classic Piqué Polo",
    category: "men",
    type: "Polo T-Shirt",
    price: 4500,
    tone: "#e4dfd6",
    colors: ["#111111", "#f5f1eb", "#1f3a5f"],
    images: ["/products/men-polo-1.jpg", "/products/men-polo-1-b.jpg"],
    tag: "NEW",
  },
  {
    id: 2,
    name: "Knit Collar Polo",
    category: "men",
    type: "Polo T-Shirt",
    price: 5200,
    tone: "#d9d4cb",
    colors: ["#2b2b2b", "#8a7e6b", "#e9e4da"],
    images: ["/products/men-polo-2.jpg", "/products/men-polo-2-b.jpg"],
    tag: "BEST SELLER",
  },
  {
    id: 3,
    name: "Essential Slim Polo",
    category: "men",
    type: "Polo T-Shirt",
    price: 3900,
    tone: "#cfd3d6",
    colors: ["#ffffff", "#3b4a5a", "#111111"],
    images: ["/products/men-polo-3.jpg", "/products/men-polo-3-b.jpg"],
    tag: "NEW",
  },
  {
    id: 4,
    name: "Resort Stripe Polo",
    category: "men",
    type: "Polo T-Shirt",
    price: 4800,
    tone: "#e9e2d3",
    colors: ["#1f3a5f", "#f5f1eb"],
    images: ["/products/men-polo-4.jpg", "/products/men-polo-4-b.jpg"],
    tag: "LIMITED",
  },
];

const WOMEN = [
  {
    id: 5,
    name: "Ribbed Crop Top",
    category: "women",
    type: "Crop Top",
    price: 3200,
    tone: "#ece0d9",
    colors: ["#f5f1eb", "#111111", "#c9a89a"],
    images: ["/products/women-crop-1.jpg", "/products/women-crop-1-b.jpg"],
    tag: "NEW",
  },
  {
    id: 6,
    name: "Square Neck Crop",
    category: "women",
    type: "Crop Top",
    price: 3500,
    tone: "#e3d8d3",
    colors: ["#ffffff", "#7a5c58", "#111111"],
    images: ["/products/women-crop-2.jpg", "/products/women-crop-2-b.jpg"],
    tag: "BEST SELLER",
  },
  {
    id: 7,
    name: "Tie-Front Crop Top",
    category: "women",
    type: "Crop Top",
    price: 3800,
    tone: "#dfe2d9",
    colors: ["#e9e4da", "#6b7a63"],
    images: ["/products/women-crop-3.jpg", "/products/women-crop-3-b.jpg"],
    tag: "NEW",
  },
  {
    id: 8,
    name: "Cap Sleeve Crop Tee",
    category: "women",
    type: "Crop Top",
    price: 2900,
    tone: "#efe6e1",
    colors: ["#ffffff", "#111111", "#b98f86"],
    images: ["/products/women-crop-4.jpg", "/products/women-crop-4-b.jpg"],
    tag: "LIMITED",
  },
];

/* Men / Women මිශ්‍ර කරලා (1 men, 1 women, 1 men ...) */
const PRODUCTS = MEN.flatMap((m, i) => [m, WOMEN[i]]).filter(Boolean);

const FEATURES = [
  { title: "PREMIUM COTTON", text: "Soft, breathable fabric made for everyday wear." },
  { title: "ISLAND-WIDE DELIVERY", text: "Fast delivery to every district in Sri Lanka." },
  { title: "EASY EXCHANGES", text: "Wrong size? Swap it within 7 days." },
];

const formatPrice = (n) => `Rs. ${n.toLocaleString("en-US")}`;

/* ---------- Infinite loop setup ----------
   Products 5 වතාවක් පේළියට දානවා. හැමවෙලාවෙම මැද copy එකේ
   ඉඳගෙන ඉන්නවා; scroll නවතින වෙලාවට නොපෙනෙන්න මැද copy එකට
   ආපහු jump කරනවා. ඒ නිසා ඉස්සරහටත් පස්සටත් අවසානයක් නෑ. */
const N = PRODUCTS.length;
const COPIES = 5;
const MID = Math.floor(COPIES / 2);
const LOOP = Array.from({ length: COPIES }, () => PRODUCTS).flat();

/* ඉරි දෙපැත්තේ gutter එක (responsive) */
const GUTTER = "clamp(24px, 4vw, 48px)";

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

/* ---------------- Product Card ---------------- */
function ProductCard({ product, onAdd, isActive }) {
  const [color, setColor] = useState(product.colors[0]);
  const [first, second] = product.images;

  return (
    <article className="group select-none">
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
        style={{ backgroundColor: product.tone }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-center font-serif text-lg tracking-[0.2em] text-black/20">
          {product.type.toUpperCase()}
        </span>

        <SafeImage
          src={first}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <SafeImage
          src={second}
          alt={`${product.name} alternate`}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* soft bottom shade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

        <span
          className="absolute left-3 top-3 rounded-full bg-white/80 text-[10px] tracking-[0.2em] text-black backdrop-blur-md"
          style={{ padding: "5px 12px" }}
        >
          {product.tag}
        </span>

        {/* QUICK ADD: මැද (active) card එකට විතරයි පේන්නේ */}
        <button
          onClick={() => onAdd(product)}
          tabIndex={isActive ? 0 : -1}
          aria-hidden={!isActive}
          className={`absolute inset-x-3 bottom-3 translate-y-4 rounded-full bg-white text-[11px] tracking-[0.25em] text-black opacity-0 transition-all duration-300 hover:bg-neutral-200 ${
            isActive
              ? "group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
              : "pointer-events-none"
          }`}
          style={{ padding: "14px 0" }}
        >
          QUICK ADD
        </button>
      </div>

      {/* name + price */}
      <div
        className="flex items-start justify-between gap-3"
        style={{ marginTop: 20 }}
      >
        <div>
          <h3 className="text-sm tracking-[0.12em] text-white">{product.name}</h3>
          <p
            className="text-[11px] tracking-[0.2em] text-white/50"
            style={{ marginTop: 6 }}
          >
            {product.type.toUpperCase()}
          </p>
        </div>
        <p className="whitespace-nowrap text-sm tracking-wide text-white">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* color swatches */}
      <div className="flex items-center gap-2" style={{ marginTop: 14 }}>
        {product.colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            aria-label={`Color ${c}`}
            className={`h-4 w-4 rounded-full border transition-all ${
              color === c
                ? "scale-110 border-white ring-1 ring-white ring-offset-2 ring-offset-[#0b0b0c]"
                : "border-white/30"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </article>
  );
}

/* ---------------- Main Section ---------------- */
export default function NewArrivals() {
  const [toast, setToast] = useState("");
  const [active, setActive] = useState(N * MID + Math.floor(N / 2) - 1);

  const scroller = useRef(null);
  const cardRefs = useRef([]);
  const activeRef = useRef(N * MID);
  const toastTimer = useRef(null);
  const idleTimer = useRef(null);
  const raf = useRef(0);
  const drag = useRef({ down: false, moved: false, startX: 0, startLeft: 0 });

  const handleAdd = (product) => {
    setToast(`${product.name} added to bag`);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  };

  /* card එකක් scroller එකේ මැදට ගේන්න ඕන scrollLeft අගය */
  const centerLeft = (card) => {
    const el = scroller.current;
    return card.offsetLeft - el.clientWidth / 2 + card.offsetWidth / 2;
  };

  /* 3D effect: මැද card එක ඉස්සරහට, දෙපැත්තේ ඒවා blur + පිටිපස්සට */
  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;

    /* 1) layout කියවීම් ඔක්කොම මුලින් (thrash නැති වෙන්න) */
    const measured = cardRefs.current.map((card) => {
      if (!card) return null;
      const r = card.getBoundingClientRect();
      return { d: (r.left + r.width / 2 - mid) / r.width };
    });

    /* 2) ඊට පස්සේ styles ලියනවා */
    let nearest = activeRef.current;
    let nearestDist = Infinity;

    measured.forEach((m, i) => {
      if (!m) return;
      const { d } = m;
      const a = Math.min(Math.abs(d), 2);

      if (Math.abs(d) < nearestDist) {
        nearestDist = Math.abs(d);
        nearest = i;
      }

      const scale = 1.04 - Math.min(a, 1.6) * 0.16;
      const rotate = -Math.max(-1.6, Math.min(1.6, d)) * 24;
      const z = 60 - Math.min(a, 2) * 120;
      const blur = Math.min(Math.max(0, a - 0.3) * 5, 8);
      const opacity = 1 - Math.min(a, 1.6) * 0.28;

      const card = cardRefs.current[i];
      card.style.transform = `translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`;
      card.style.filter = blur > 0.1 ? `blur(${blur}px)` : "none";
      card.style.opacity = String(opacity);
      card.style.zIndex = String(100 - Math.round(a * 10));
    });

    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  }, []);

  /* scroll නවතින වෙලාවට මැද copy එකට නොපෙනෙන්න jump */
  const recenterLoop = useCallback(() => {
    const el = scroller.current;
    const first = cardRefs.current[0];
    const second = cardRefs.current[N];
    if (!el || !first || !second) return;

    const idx = activeRef.current;
    const target = N * MID + (idx % N);
    const sets = (target - idx) / N;
    if (sets === 0) return;

    const setWidth = second.offsetLeft - first.offsetLeft;
    el.scrollLeft += sets * setWidth;
    activeRef.current = target;
    setActive(target);
    update();
  }, [update]);

  /* CSS scroll-snap වෙනුවට අපේම snap: scroll නවතින වෙලාවට ළඟම card එක මැදට */
  const snapNearest = () => {
    const el = scroller.current;
    const card = cardRefs.current[activeRef.current];
    if (!el || !card || drag.current.down) return;
    const target = centerLeft(card);
    if (Math.abs(el.scrollLeft - target) > 1.5) {
      el.scrollTo({ left: target, behavior: "smooth" });
    }
  };

  const settle = () => {
    recenterLoop();
    snapNearest();
  };

  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(update);

    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(settle, 140);
  };

  const goTo = (i) => {
    const el = scroller.current;
    const idx = Math.max(0, Math.min(LOOP.length - 1, i));
    const card = cardRefs.current[idx];
    if (!el || !card) return;
    el.scrollTo({ left: centerLeft(card), behavior: "smooth" });
  };

  /* Mount: මැද copy එකේ මැද card එකට යනවා */
  useEffect(() => {
    const el = scroller.current;
    const start = N * MID + Math.floor(N / 2) - 1;
    const card = cardRefs.current[start];
    if (el && card) {
      el.scrollLeft = centerLeft(card);
      activeRef.current = start;
    }
    update();

    const onResize = () => {
      const c = cardRefs.current[activeRef.current];
      if (el && c) el.scrollLeft = centerLeft(c);
      update();
    };

    /* Mouse drag: දෙපැත්තටම (ඉස්සරහට / පස්සට) අදින්න පුළුවන් */
    const d = drag.current;

    const onDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (e.target.closest("button")) return; // QUICK ADD / swatches වලට බාධා නොවෙන්න
      d.down = true;
      d.moved = false;
      d.startX = e.clientX;
      d.startLeft = el.scrollLeft;
    };

    const onMove = (e) => {
      if (!d.down) return;
      const dx = e.clientX - d.startX;
      if (!d.moved && Math.abs(dx) > 6) {
        d.moved = true;
        el.style.scrollSnapType = "none"; // අදින අතරේ snap නැහැ
        el.style.cursor = "grabbing";
      }
      if (d.moved) el.scrollLeft = d.startLeft - dx;
    };

    const onUp = () => {
      if (!d.down) return;
      d.down = false;
      if (d.moved) {
        el.style.scrollSnapType = "";
        el.style.cursor = "";
        goTo(activeRef.current); // ළඟම card එකට smooth snap
        setTimeout(() => {
          d.moved = false;
        }, 0);
      }
    };

    /* Trackpad / mouse horizontal swipe: එක swipe එකකට card එකක්,
       දෙපැත්තටම (ඉස්සරහට + පස්සට) එකම විදියට වැඩ කරනවා.
       Vertical scroll එක සාමාන්‍ය විදියටම page එක scroll කරනවා. */
    let lastEvent = 0;
    let lastStep = 0;
    let lastAbs = 0;

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();

      const now = performance.now();
      const abs = Math.abs(e.deltaX);
      const newGesture = now - lastEvent > 120;
      const accelerating = abs > lastAbs + 4;
      lastEvent = now;
      lastAbs = abs;

      if (abs < 6) return;
      if (
        now - lastStep > 250 &&
        (newGesture || (accelerating && now - lastStep > 300))
      ) {
        lastStep = now;
        goTo(activeRef.current + (e.deltaX > 0 ? 1 : -1));
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf.current);
      clearTimeout(idleTimer.current);
      clearTimeout(toastTimer.current);
    };
  }, [update]);

  /* arrow buttons දෙකටම පොදු style (card image එකේ මැද උසට) */
  const arrowStyle = {
    top: "calc(64px + var(--card-w) * 2 / 3)",
    transform: "translateY(-50%)",
  };
  const arrowClass =
    "absolute z-[200] flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/40 text-lg text-white backdrop-blur-md transition-colors duration-300 hover:bg-white hover:text-black";

  return (
    <section
      id="new-arrivals"
      className="relative scroll-mt-20 overflow-hidden bg-[#0b0b0c] text-white"
    >
      {/* background glow */}
      <div className="pointer-events-none absolute left-1/2 top-[40%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.07] blur-[120px]" />

      {/* ---------- Header ---------- */}
      <div
        className="relative text-center"
        style={{
          padding: `clamp(104px, 11vw, 140px) ${GUTTER} 0`,
        }}
      >
        <Reveal>
          <p
            className="text-[11px] tracking-[0.5em] text-white/50"
            style={{ marginBottom: 20 }}
          >
            JUST LANDED
          </p>
          <h2 className="font-serif text-4xl leading-tight tracking-wide md:text-6xl">
            New Arrivals
          </h2>
          <p
            className="text-sm leading-relaxed tracking-wide text-white/60"
            style={{ margin: "24px auto 0", maxWidth: "28rem" }}
          >
            Polished polos for him. Effortless crop tops for her. Fresh pieces,
            made to move with you.
          </p>
        </Reveal>
      </div>

      {/* ---------- 3D carousel ---------- */}
      <div
        className="relative [--card-w:66vw] sm:[--card-w:40vw] md:[--card-w:30vw] lg:[--card-w:min(24vw,340px)]"
        style={{ paddingBottom: 24 }}
      >
        {/* Prev / Next: cards වල දෙපැත්තේ */}
        <button
          onClick={() => goTo(activeRef.current - 1)}
          aria-label="Previous"
          className={arrowClass}
          style={{ ...arrowStyle, left: "clamp(12px, 3vw, 40px)" }}
        >
          ←
        </button>
        <button
          onClick={() => goTo(activeRef.current + 1)}
          aria-label="Next"
          className={arrowClass}
          style={{ ...arrowStyle, right: "clamp(12px, 3vw, 40px)" }}
        >
          →
        </button>

        <div
          ref={scroller}
          onScroll={onScroll}
          onDragStart={(e) => e.preventDefault()}
          className="relative flex cursor-grab gap-4 overflow-x-auto md:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            perspective: "1400px",
            overscrollBehaviorX: "contain",
            /* card එක හරියටම මැදට ගන්න */
            paddingInline: "calc(50% - var(--card-w) / 2)",
            /* උඩ / යට ඉඩ: scale + 3D නිසා card info කැපෙන්නේ නැති වෙන්න */
            paddingTop: 64,
            paddingBottom: 80,
          }}
        >
          {LOOP.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              ref={(node) => (cardRefs.current[i] = node)}
              onClickCapture={(e) => {
                if (drag.current.moved) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                if (i !== activeRef.current) {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(i);
                }
              }}
              className="shrink-0 will-change-transform"
              style={{ width: "var(--card-w)", transformStyle: "preserve-3d" }}
            >
              <ProductCard
                product={p}
                onAdd={handleAdd}
                isActive={i === active}
              />
            </div>
          ))}
        </div>

        <Reveal className="text-center" style={{ marginTop: 8 }}>
          <button
            className="rounded-full border border-white/40 text-[11px] tracking-[0.3em] transition-all duration-300 hover:bg-white hover:text-black"
            style={{ padding: "16px 48px" }}
          >
            VIEW ALL PRODUCTS
          </button>
        </Reveal>
      </div>

      {/* ---------- Features strip ---------- */}
      <div
        className="relative border-t border-white/10"
        style={{ marginTop: 72 }}
      >
        <div
          className="grid grid-cols-1 gap-10 text-center md:grid-cols-3"
          style={{
            maxWidth: 1400,
            marginInline: "auto",
            padding: `64px ${GUTTER}`,
          }}
        >
          {FEATURES.map((f) => (
            <Reveal key={f.title}>
              <h4
                className="text-[11px] tracking-[0.35em]"
                style={{ marginBottom: 12 }}
              >
                {f.title}
              </h4>
              <p className="text-sm text-white/50">{f.text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ---------- Toast ---------- */}
      <div
        className={`pointer-events-none fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 whitespace-nowrap rounded-full bg-white text-[11px] tracking-[0.2em] text-black transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
        style={{ padding: "12px 24px" }}
      >
        {toast.toUpperCase()}
      </div>
    </section>
  );
}