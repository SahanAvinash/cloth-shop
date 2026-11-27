import { useRef, useEffect, useState } from "react";

const TITLE_WORDS = ["DEFINE", "YOUR", "STYLE"];

const FRAME_COUNT = 243;

const FRAME_PATH = (i) =>
  `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

const VIDEO_SECONDS = 8.1;
const PLAY_SPEED = 1;

const STAGE_ENDS = [0, 0.14, 0.45, 0.66, 1];

const HOLD_MS = 180;
const TOUCH_THRESHOLD = 24;
const LOAD_TIMEOUT = 12000;
const MAX_CONCURRENT_LOADS = 8;

const DPR_LIMIT = 1.75;
const FOCUS_Y = 0.5;

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

const range = (p, from, to) =>
  clamp01((p - from) / (to - from));

const easeOut = (t) =>
  1 - Math.pow(1 - t, 3);

const easeInOut = (t) =>
  t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function FashionHero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  const labelRef = useRef(null);
  const subRef = useRef(null);
  const buttonRef = useRef(null);
  const hintRef = useRef(null);

  const loadBarRef = useRef(null);
  const loadTextRef = useRef(null);

  const [ready, setReady] = useState(false);

  const handleShopClick = () => {
    document.getElementById("shop")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;

    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
    });

    if (!ctx) return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevGutter = html.style.scrollbarGutter;

    html.style.scrollbarGutter = "stable";

    const lockScroll = () => {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    };

    const unlockScroll = () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };

    lockScroll();

    const letters = Array.from(
      section.querySelectorAll("[data-letter]")
    );

    const lines = Array.from(
      section.querySelectorAll("[data-line]")
    );

    const btnLinesX = section.querySelectorAll("[data-btn-x]");
    const btnLinesY = section.querySelectorAll("[data-btn-y]");
    const btnText = section.querySelector("[data-btn-text]");

    const images = new Array(FRAME_COUNT);

    let nextToLoad = 0;
    let activeLoads = 0;
    let processedCount = 0;

    let canvasWidth = 0;
    let canvasHeight = 0;

    let lastDrawnFrame = -1;
    let lastRendered = -1;

    let rafId = null;
    let lastNow = 0;
    let loadTimer = null;

    let cancelled = false;
    let started = false;

    let stage = 0;
    let targetStage = 0;

    let goal = 0;
    let current = 0;

    let moving = false;
    let finished = false;

    let direction = 0;
    let lastInput = 0;

    let touchStartY = 0;
    let touchLastY = 0;

    const holding = (now) =>
      now - lastInput < HOLD_MS;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        DPR_LIMIT
      );

      const w = Math.max(
        1,
        Math.round(rect.width * dpr)
      );

      const h = Math.max(
        1,
        Math.round(rect.height * dpr)
      );

      canvasWidth = w;
      canvasHeight = h;

      if (
        canvas.width !== w ||
        canvas.height !== h
      ) {
        canvas.width = w;
        canvas.height = h;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        lastDrawnFrame = -1;
      }
    };

    const isUsable = (img) =>
      img &&
      img.complete &&
      img.naturalWidth > 0;

    const getAvailableFrame = (requested) => {
      if (isUsable(images[requested])) {
        return requested;
      }

      for (let d = 1; d < FRAME_COUNT; d++) {
        const before = requested - d;
        const after = requested + d;

        if (
          before >= 0 &&
          isUsable(images[before])
        ) {
          return before;
        }

        if (
          after < FRAME_COUNT &&
          isUsable(images[after])
        ) {
          return after;
        }
      }

      return -1;
    };

    const drawFrame = (p) => {
      const requested = Math.min(
        FRAME_COUNT - 1,
        Math.round(p * (FRAME_COUNT - 1))
      );

      const index = getAvailableFrame(requested);

      if (index === -1) return;
      if (index === lastDrawnFrame) return;

      const img = images[index];

      const scale = Math.max(
        canvasWidth / img.naturalWidth,
        canvasHeight / img.naturalHeight
      );

      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;

      const x = (canvasWidth - w) / 2;
      const y = (canvasHeight - h) * FOCUS_Y;

      ctx.fillStyle = "#000";

      ctx.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      ctx.drawImage(img, x, y, w, h);

      lastDrawnFrame = index;
    };

    const renderScene = (p) => {
      canvas.style.transform = `
        scale(${1.07 - 0.07 * easeOut(p)})
      `;

      const labelP = easeOut(
        range(p, 0.01, 0.14)
      );

      if (labelRef.current) {
        labelRef.current.style.opacity = labelP;

        labelRef.current.style.transform = `
          translateY(${(1 - labelP) * 30}px)
        `;
      }

      lines.forEach((line) => {
        line.style.transform = `scaleX(${labelP})`;
      });

      const total = Math.max(letters.length, 1);

      letters.forEach((el, i) => {
        const start = 0.14 + (i / total) * 0.21;

        const e = easeOut(
          range(p, start, start + 0.1)
        );

        el.style.opacity = e;

        el.style.transform = `
          translateY(${(1 - e) * 70}px)
        `;

        el.style.filter = `
          blur(${(1 - e) * 10}px)
        `;
      });

      const subP = easeOut(
        range(p, 0.45, 0.64)
      );

      if (subRef.current) {
        subRef.current.style.opacity = subP;

        subRef.current.style.transform = `
          translateY(${(1 - subP) * 30}px)
        `;

        subRef.current.style.letterSpacing = `
          ${0.18 + (1 - subP) * 0.12}em
        `;
      }

      const btnP = range(p, 0.67, 0.92);

      const xP = easeInOut(range(btnP, 0, 0.45));
      const yP = easeInOut(range(btnP, 0.4, 0.68));
      const textP = easeOut(range(btnP, 0.6, 1));

      btnLinesX.forEach((el) => {
        el.style.transform = `scaleX(${xP})`;
      });

      btnLinesY.forEach((el) => {
        el.style.transform = `scaleY(${yP})`;
      });

      if (btnText) {
        btnText.style.transform = `translateY(${(1 - textP) * 110}%)`;
      }

      if (buttonRef.current) {
        buttonRef.current.style.pointerEvents =
          btnP > 0.95 ? "auto" : "none";
      }

      if (hintRef.current) {
        const isComplete = p >= 1;

        hintRef.current.style.visibility =
          isComplete ? "hidden" : "visible";

        hintRef.current.style.animationPlayState =
          isComplete ? "paused" : "running";
      }
    };

    const announce = (done) => {
      window.dispatchEvent(
        new CustomEvent("hero-done", {
          detail: done,
        })
      );
    };

    const startMove = (dir) => {
      if (moving || finished) return false;

      const next = stage + dir;

      if (next < 0 || next > 4) {
        return false;
      }

      targetStage = next;
      goal = STAGE_ENDS[next];

      moving = true;

      return true;
    };

    const tick = (now) => {
      const dt = Math.min(
        (now - lastNow) / 1000,
        0.05
      );

      lastNow = now;

      if (moving) {
        const step =
          (dt * PLAY_SPEED) / VIDEO_SECONDS;

        if (goal > current) {
          current = Math.min(
            goal,
            current + step
          );
        } else {
          current = Math.max(
            goal,
            current - step
          );
        }

        if (Math.abs(current - goal) < 0.000001) {
          current = goal;

          moving = false;
          stage = targetStage;

          if (stage === 4 && !finished) {
            finished = true;

            unlockScroll();
            announce(true);
          } else if (
            !finished &&
            direction !== 0 &&
            holding(now)
          ) {
            startMove(direction);
          }
        }
      }

      if (current !== lastRendered) {
        drawFrame(current);
        renderScene(current);

        lastRendered = current;
      }

      rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      if (!started) {
        e.preventDefault();
        return;
      }

      if (finished) return;

      e.preventDefault();

      const abs = Math.abs(e.deltaY);

      if (abs < 2) return;

      direction = e.deltaY > 0 ? 1 : -1;

      lastInput = performance.now();

      if (!moving) {
        startMove(direction);
      }
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchLastY = touchStartY;
    };

    const onTouchMove = (e) => {
      if (!started) {
        e.preventDefault();
        return;
      }

      if (finished) return;

      e.preventDefault();

      const y = e.touches[0].clientY;

      const moved = Math.abs(
        y - touchStartY
      );

      const delta = touchLastY - y;

      const dir =
        delta > 0 ? 1 :
        delta < 0 ? -1 :
        direction;

      touchLastY = y;

      if (
        moved > TOUCH_THRESHOLD &&
        dir !== 0
      ) {
        direction = dir;
        lastInput = performance.now();

        if (!moving) {
          startMove(dir);
        }
      }
    };

    const onKey = (e) => {
      if (!started || finished) return;

      const tag = e.target?.tagName;

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        e.target?.isContentEditable
      ) {
        return;
      }

      const down = [
        "ArrowDown",
        "PageDown",
        " ",
      ].includes(e.key);

      const up = [
        "ArrowUp",
        "PageUp",
      ].includes(e.key);

      if (!down && !up) return;

      e.preventDefault();

      direction = down ? 1 : -1;

      lastInput = performance.now();

      if (!moving) {
        startMove(direction);
      }
    };

    const onResize = () => {
      resizeCanvas();

      lastDrawnFrame = -1;
      lastRendered = -1;
    };

    const startExperience = () => {
      if (started || cancelled) return;

      started = true;

      if (loadTimer) {
        clearTimeout(loadTimer);
      }

      resizeCanvas();

      if (window.scrollY > 4) {
        stage = 4;
        targetStage = 4;

        current = 1;
        goal = 1;

        finished = true;

        unlockScroll();
        announce(true);
      } else {
        window.scrollTo(0, 0);
      }

      lastRendered = -1;

      setReady(true);

      lastNow = performance.now();

      rafId = requestAnimationFrame(tick);
    };

    const updateLoading = () => {
      const percent = Math.round(
        (processedCount / FRAME_COUNT) * 100
      );

      if (loadBarRef.current) {
        loadBarRef.current.style.width =
          `${percent}%`;
      }

      if (loadTextRef.current) {
        loadTextRef.current.textContent =
          `${percent}%`;
      }
    };

    const loadFrame = (index) => {
      const img = new Image();

      images[index] = img;

      img.decoding = "async";

      if (index < 8) {
        img.fetchPriority = "high";
      }

      activeLoads++;

      let settled = false;

      const finish = () => {
        if (settled || cancelled) return;

        settled = true;

        activeLoads--;
        processedCount++;

        updateLoading();

        pumpLoads();
      };

      img.onload = () => {
        if (typeof img.decode === "function") {
          img.decode()
            .catch(() => {})
            .finally(finish);
        } else {
          finish();
        }
      };

      img.onerror = finish;
      img.onabort = finish;

      img.src = FRAME_PATH(index);
    };

    function pumpLoads() {
      if (cancelled) return;

      while (
        activeLoads < MAX_CONCURRENT_LOADS &&
        nextToLoad < FRAME_COUNT
      ) {
        loadFrame(nextToLoad++);
      }

      if (
        processedCount === FRAME_COUNT &&
        activeLoads === 0
      ) {
        startExperience();
      }
    }

    resizeCanvas();

    pumpLoads();

    loadTimer = setTimeout(() => {
      startExperience();
    }, LOAD_TIMEOUT);

    window.addEventListener(
      "wheel",
      onWheel,
      { passive: false }
    );

    window.addEventListener(
      "touchstart",
      onTouchStart,
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      onTouchMove,
      { passive: false }
    );

    window.addEventListener(
      "keydown",
      onKey
    );

    window.addEventListener(
      "resize",
      onResize,
      { passive: true }
    );

    return () => {
      cancelled = true;

      if (loadTimer) {
        clearTimeout(loadTimer);
      }

      window.removeEventListener(
        "wheel",
        onWheel
      );

      window.removeEventListener(
        "touchstart",
        onTouchStart
      );

      window.removeEventListener(
        "touchmove",
        onTouchMove
      );

      window.removeEventListener(
        "keydown",
        onKey
      );

      window.removeEventListener(
        "resize",
        onResize
      );

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      html.style.scrollbarGutter = prevGutter;

      images.forEach((img) => {
        if (img) {
          img.onload = null;
          img.onerror = null;
          img.onabort = null;
          img.src = "";
        }
      });
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100svh" }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full will-change-transform"
        style={{ transform: "scale(1.07)" }}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/60" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">

        <div className="mb-6 flex items-center gap-4">
          <span
            data-line
            className="hidden h-px w-12 origin-right bg-white/70 sm:block md:w-20"
            style={{ transform: "scaleX(0)" }}
          />

          <p
            ref={labelRef}
            className="text-[10px] tracking-[0.4em] sm:text-xs md:text-sm md:tracking-[0.5em]"
            style={{
              opacity: 0,
              transform: "translateY(30px)",
            }}
          >
            NEW COLLECTION 2026
          </p>

          <span
            data-line
            className="hidden h-px w-12 origin-left bg-white/70 sm:block md:w-20"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        <h1 className="font-serif text-5xl leading-tight tracking-wide sm:text-6xl md:text-8xl">
          {TITLE_WORDS.map((word) => (
            <span
              key={word}
              className="mx-1 inline-block whitespace-nowrap sm:mx-2 md:mx-4"
            >
              {word.split("").map((char, index) => (
                <span
                  key={`${word}-${index}`}
                  data-letter
                  className="inline-block will-change-transform"
                  style={{
                    opacity: 0,
                    transform: "translateY(70px)",
                    filter: "blur(10px)",
                  }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="mt-8 text-[10px] leading-relaxed tracking-[0.18em] sm:text-xs md:mt-10 md:text-sm"
          style={{
            opacity: 0,
            transform: "translateY(30px)",
            letterSpacing: "0.3em",
          }}
        >
          DISCOVER THE COLLECTION
        </p>

        <button
          ref={buttonRef}
          type="button"
          onClick={handleShopClick}
          className="group relative mt-14 inline-flex h-[54px] min-w-[190px] items-center justify-center px-10 text-[10px] font-medium tracking-[0.28em] text-white transition-transform duration-200 active:scale-[0.97] sm:mt-16 sm:h-[58px] sm:min-w-[210px] sm:text-xs"
          style={{ pointerEvents: "none" }}
        >
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100" />

          <span
            data-btn-x
            className="absolute left-0 top-0 h-px w-full origin-left bg-white"
            style={{ transform: "scaleX(0)" }}
          />

          <span
            data-btn-x
            className="absolute bottom-0 right-0 h-px w-full origin-right bg-white"
            style={{ transform: "scaleX(0)" }}
          />

          <span
            data-btn-y
            className="absolute right-0 top-0 h-full w-px origin-top bg-white"
            style={{ transform: "scaleY(0)" }}
          />

          <span
            data-btn-y
            className="absolute bottom-0 left-0 h-full w-px origin-bottom bg-white"
            style={{ transform: "scaleY(0)" }}
          />

          <span className="relative z-10 block overflow-hidden">
            <span
              data-btn-text
              className="block pl-[0.28em] transition-colors duration-500 group-hover:text-black group-focus-visible:text-black"
              style={{ transform: "translateY(110%)" }}
            >
              SHOP NOW
            </span>
          </span>
        </button>
      </div>

      <div
        ref={hintRef}
        className="pointer-events-none absolute bottom-8 left-0 right-0 text-center text-[10px] tracking-[0.3em] text-white sm:bottom-10 sm:text-xs"
        style={{
          animation: "scrollHintBlink 1.5s ease-in-out infinite",
        }}
      >
        SCROLL TO EXPLORE ↓
      </div>

      <style>
        {`
          @keyframes scrollHintBlink {
            0%, 100% {
              opacity: 1;
              transform: translateY(0);
            }

            50% {
              opacity: 0.25;
              transform: translateY(6px);
            }
          }
        `}
      </style>

      <div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-opacity duration-700"
        style={{
          opacity: ready ? 0 : 1,
          pointerEvents: ready ? "none" : "auto",
        }}
      >
        <p className="mb-6 text-xs tracking-[0.5em]">
          LOADING COLLECTION
        </p>

        <div className="h-px w-48 bg-white/20">
          <div
            ref={loadBarRef}
            className="h-full bg-white transition-all duration-200"
            style={{ width: "0%" }}
          />
        </div>

        <p
          ref={loadTextRef}
          className="mt-4 text-xs tracking-[0.3em] text-white/60"
        >
          0%
        </p>
      </div>
    </section>
  );
}