import { motion, useReducedMotion } from "framer-motion";
import storyMain from "../assets/images/story/story-main.webp";
import storyHello from "../assets/images/story/story-hello.webp";
import storyPromise from "../assets/images/story/story-promise.webp";
import "../styles/story.css";

const STORY_STEPS = [
  { number: "01", label: "A simple hello" },
  { number: "02", label: "Best friends" },
  { number: "03", label: "Forever" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function HeartMark() {
  return (
    <svg viewBox="0 0 54 46" aria-hidden="true">
      <path d="M27 41.5S5.5 29 5.5 14.8C5.5 8.6 9.7 4.5 15.4 4.5c5 0 8.4 2.8 11.6 7.2 3.2-4.4 6.6-7.2 11.6-7.2 5.7 0 9.9 4.1 9.9 10.3C48.5 29 27 41.5 27 41.5Z" />
      <path d="M13.8 15.6c.4-3.1 2.5-5 5.5-5" />
    </svg>
  );
}

function BotanicalSprig() {
  return (
    <svg viewBox="0 0 170 240" aria-hidden="true">
      <path d="M144 18C91 61 64 123 52 221" />
      <path d="M117 45c-20-5-36 2-47 20 22 1 38-5 47-20ZM91 82c-21-1-36 9-44 28 23-4 37-13 44-28ZM72 123c-21 4-34 17-37 37 21-8 33-20 37-37ZM59 166c-17 8-26 21-26 38 18-9 27-22 26-38Z" />
      <path d="M120 46c6 20 1 37-15 50-4-22 1-38 15-50ZM94 86c10 18 8 36-5 51-8-21-6-37 5-51ZM74 128c13 16 14 34 4 51-11-19-12-36-4-51Z" />
      <circle cx="144" cy="18" r="3.3" />
    </svg>
  );
}

export default function Story() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0, distance = 24) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.24 },
    transition: { duration: 0.85, delay, ease: EASE },
  });

  return (
    <section className="story" id="story" aria-labelledby="story-title">
      <div className="story__ambient" aria-hidden="true">
        <span className="story__glow story__glow--one" />
        <span className="story__glow story__glow--two" />
        <span className="story__grain" />
        <i className="story__spark story__spark--one" />
        <i className="story__spark story__spark--two" />
        <i className="story__spark story__spark--three" />
      </div>

      <div className="story__botanical story__botanical--left" aria-hidden="true">
        <BotanicalSprig />
      </div>
      <div className="story__botanical story__botanical--right" aria-hidden="true">
        <BotanicalSprig />
      </div>

      <div className="story__shell">
        <motion.header className="story-heading" {...reveal(0.04, 18)}>
          <p className="story-heading__eyebrow">
            <span />
            Chapter One
            <span />
          </p>

          <h2 id="story-title" className="story-heading__title">
            <span>Our</span>
            <em>Love</em>
            <span>Story</span>
          </h2>

          <div className="story-heading__ornament" aria-hidden="true">
            <i />
            <b>
              <HeartMark />
            </b>
            <i />
          </div>
        </motion.header>

        <div className="story-visual" aria-label="Moments from our love story">
          <div className="story-visual__halo" aria-hidden="true" />
          <div className="story-visual__orbit story-visual__orbit--one" aria-hidden="true" />
          <div className="story-visual__orbit story-visual__orbit--two" aria-hidden="true" />

          <motion.figure
            className="story-photo story-photo--main"
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, scale: 0.92, clipPath: "inset(12% 8% 16% 8% round 46% 46% 32px 32px)" }
            }
            whileInView={{
              opacity: 1,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 46% 46% 32px 32px)",
            }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.05, delay: 0.08, ease: EASE }}
          >
            <div className="story-photo__inner">
              <img
                src={storyMain}
                alt="Shady and Batool sharing a quiet moment together"
                loading="lazy"
                decoding="async"
              />
              <span className="story-photo__wash" aria-hidden="true" />
            </div>

            <figcaption className="story-photo__caption">
              <strong>Shady &amp; Batool</strong>
              <span>Our favorite chapter</span>
            </figcaption>
          </motion.figure>

          <motion.figure
            className="story-memory story-memory--hello"
            initial={shouldReduceMotion ? false : { opacity: 0, x: -36, y: 22, rotate: -10 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: -5 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.82, delay: 0.42, ease: EASE }}
          >
            <div className="story-memory__float story-memory__float--one">
              <img
                src={storyHello}
                alt="The beginning of Shady and Batool's story"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span>01</span>
                The hello
              </figcaption>
            </div>
          </motion.figure>

          <motion.figure
            className="story-memory story-memory--promise"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 34, y: 26, rotate: 10 }}
            whileInView={{ opacity: 1, x: 0, y: 0, rotate: 4.5 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.82, delay: 0.56, ease: EASE }}
          >
            <div className="story-memory__float story-memory__float--two">
              <img
                src={storyPromise}
                alt="The proposal that began Shady and Batool's forever"
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span>03</span>
                The promise
              </figcaption>
            </div>
          </motion.figure>

          <motion.div className="story-seal" {...reveal(0.66, 12)} aria-hidden="true">
            <span>S</span>
            <b>♥</b>
            <span>B</span>
          </motion.div>
        </div>

        <motion.div className="story-copy" {...reveal(0.2, 28)}>
          <p className="story-copy__lead">
            Every beautiful love story begins with a simple hello.
          </p>

          <div className="story-copy__body">
            <p>
              Somewhere between the first conversation and all the laughter that
              followed, two strangers became best friends.
            </p>
            <p>
              Then friendship became home, and home became a promise to choose
              one another—every single day.
            </p>
          </div>

          <div className="story-path" role="list" aria-label="Our story in three chapters">
            {STORY_STEPS.map((step, index) => (
              <motion.div
                className="story-path__step"
                role="listitem"
                key={step.number}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.58, delay: 0.48 + index * 0.12, ease: EASE }}
              >
                <span className="story-path__dot" aria-hidden="true">
                  <i />
                </span>
                <small>{step.number}</small>
                <strong>{step.label}</strong>
              </motion.div>
            ))}
          </div>

          <p className="story-copy__closing">
            Now we&apos;re counting the days
            <span>until forever begins.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
