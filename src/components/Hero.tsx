import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import couple from "../assets/images/couple.png";
import "../styles/hero.css";

const WEDDING_DATE = new Date("2026-08-27T19:00:00").getTime();

const AMBIENT_PARTICLES = Array.from({ length: 12 }, (_, index) => index);

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeLeft = (): TimeLeft => {
  const distance = Math.max(WEDDING_DATE - Date.now(), 0);

  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    ),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
};

const padNumber = (value: number) => String(value).padStart(2, "0");

function Monogram() {
  return (
    <svg
      className="hero-monogram"
      viewBox="0 0 140 122"
      role="img"
      aria-label="Shady and Batool monogram"
    >
      <rect
        className="hero-monogram__frame"
        x="30"
        y="4"
        width="80"
        height="92"
        rx="40"
      />

      <text
        className="hero-monogram__letter hero-monogram__letter--s"
        x="49"
        y="66"
      >
        S
      </text>
      <text
        className="hero-monogram__letter hero-monogram__letter--b"
        x="67"
        y="82"
      >
        B
      </text>

      <g className="hero-monogram__branch hero-monogram__branch--left">
        <path d="M58 88C51 94 45 102 43 113" />
        <path d="M51 97l-8-2M48 102l-9 1M46 107l-7 4" />
        <ellipse cx="42" cy="94" rx="2.2" ry="4" transform="rotate(-48 42 94)" />
        <ellipse cx="38" cy="102" rx="2.2" ry="4" transform="rotate(-68 38 102)" />
        <ellipse cx="38" cy="111" rx="2.2" ry="4" transform="rotate(-90 38 111)" />
      </g>

      <g className="hero-monogram__branch hero-monogram__branch--right">
        <path d="M82 88C89 94 95 102 97 113" />
        <path d="M89 97l8-2M92 102l9 1M94 107l7 4" />
        <ellipse cx="98" cy="94" rx="2.2" ry="4" transform="rotate(48 98 94)" />
        <ellipse cx="102" cy="102" rx="2.2" ry="4" transform="rotate(68 102 102)" />
        <ellipse cx="102" cy="111" rx="2.2" ry="4" transform="rotate(90 102 111)" />
      </g>

      <path
        className="hero-monogram__heart"
        d="M70 118s-7-4.5-7-9.6c0-2.8 2-4.7 4.5-4.7 1.4 0 2.2.7 2.5 1.3.4-.6 1.2-1.3 2.6-1.3 2.5 0 4.4 1.9 4.4 4.7 0 5.1-7 9.6-7 9.6Z"
      />
    </svg>
  );
}

function TitleFlourish() {
  return (
    <svg className="hero-title-flourish" viewBox="0 0 118 22" aria-hidden="true">
      <path d="M4 16c20-9 38-11 55-7 12 3 22 3 32-1" />
      <path d="M42 10c-5-7-11-8-17-5 5 0 9 2 12 6" />
      <path d="M87 8c5-6 11-7 17-4-5 0-9 2-12 6" />
      <path d="M18 12c5 0 9 2 12 6M99 7c4 2 7 5 9 9" />
    </svg>
  );
}

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    const updateCountdown = () => setTimeLeft(getTimeLeft());
    updateCountdown();

    const timer = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdownItems = useMemo(
    () => [
      { value: timeLeft.days, label: "Days" },
      { value: timeLeft.hours, label: "Hours" },
      { value: timeLeft.minutes, label: "Minutes" },
      { value: timeLeft.seconds, label: "Seconds" },
    ],
    [timeLeft],
  );

  const reveal = (delay = 0, distance = 18) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero-ambient" aria-hidden="true">
        <span className="hero-ambient__glow hero-ambient__glow--one" />
        <span className="hero-ambient__glow hero-ambient__glow--two" />
        <div className="hero-ambient__particles">
          {AMBIENT_PARTICLES.map((particle) => (
            <i key={particle} />
          ))}
        </div>
      </div>

      <motion.div className="hero-content" {...reveal(0.05, 22)}>
        <motion.div className="hero-monogram-wrap" {...reveal(0.12, 12)}>
          <div className="hero-monogram-float">
            <Monogram />
          </div>
        </motion.div>

        <motion.h1 id="hero-title" className="hero-title" {...reveal(0.22, 22)}>
          <span className="hero-title__name hero-title__name--first">Shady</span>
          <span className="hero-title__ampersand">
            <TitleFlourish />
            <span aria-hidden="true">&amp;</span>
          </span>
          <span className="hero-title__name hero-title__name--second">Batool</span>
        </motion.h1>

        <motion.p className="hero-date" {...reveal(0.38, 14)}>
          <time dateTime="2026-08-27">Thursday • 27 August 2026</time>
        </motion.p>

        <motion.div className="hero-ornament" {...reveal(0.48, 8)} aria-hidden="true">
          <span />
          <b>♥</b>
          <span />
        </motion.div>

        <motion.p className="hero-quote" {...reveal(0.56, 12)}>
          Every <em>Love</em> Story is Beautiful,
          <br />
          Ours is My <em>Favorite</em>.
        </motion.p>

        <motion.div
          className="countdown"
          aria-label="Countdown to the wedding"
          aria-live="polite"
          {...reveal(0.68, 16)}
        >
          {countdownItems.map(({ value, label }) => (
            <div className="countdown-item" key={label}>
              <span className="countdown-value-window">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.strong
                    key={`${label}-${value}`}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: -8, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {padNumber(value)}
                  </motion.strong>
                </AnimatePresence>
              </span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div className="hero-couple-anchor" aria-hidden="true">
        <motion.div
          className="hero-couple-motion"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 44, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.05, delay: 0.52, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <img
            src={couple}
            alt=""
            className="hero-couple"
            draggable={false}
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </div>

      <motion.a
        className="scroll-cue"
        href="#story"
        aria-label="Scroll to explore the invitation"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.7 }}
      >
        <span className="scroll-cue__chevrons" aria-hidden="true">
          <i />
          <i />
        </span>
        <span className="scroll-cue__text">Scroll to explore</span>
      </motion.a>
    </section>
  );
}
