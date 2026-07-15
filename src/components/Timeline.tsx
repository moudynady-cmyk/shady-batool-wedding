import { motion, useReducedMotion } from "framer-motion";
import childhoodImage from "../assets/images/journey/childhood.webp";
import growingImage from "../assets/images/journey/growing.webp";
import careImage from "../assets/images/journey/care.webp";
import noticedImage from "../assets/images/journey/noticed.webp";
import confessionImage from "../assets/images/journey/confession.webp";
import proposalImage from "../assets/images/journey/proposal.webp";
import weddingImage from "../assets/images/journey/wedding.webp";
import "../styles/timeline.css";

type JourneyMoment = {
  number: string;
  eyebrow: string;
  title: string;
  text: string;
  note: string;
  image?: string;
  alt?: string;
  focalPoint?: string;
  portrait?: boolean;
  final?: boolean;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const MOMENTS: JourneyMoment[] = [
  {
    number: "01",
    eyebrow: "Once upon a childhood",
    title: "Where It All Began",
    text: "Before love had a name, they were simply two children sharing games, laughter, and long afternoons that never felt long enough.",
    note: "Two little hearts, one happy beginning.",
    image: childhoodImage,
    alt: "Shady and Batool as children running together while flying a red kite",
    portrait: true,
  },
  {
    number: "02",
    eyebrow: "Growing side by side",
    title: "Love Grew With Them",
    text: "The years changed everything around them, yet the ease between Shady and Batool remained. Friendship quietly became their safest place.",
    note: "Some bonds grow before we notice them.",
    image: growingImage,
    alt: "Shady and Batool growing from childhood into adulthood side by side",
    portrait: true,
  },
  {
    number: "03",
    eyebrow: "Love in the little things",
    title: "He Always Noticed",
    text: "Shady cared in the details: checking that she was okay, remembering what mattered, and even fixing her car before she had to ask.",
    note: "Care was his first love language.",
    image: careImage,
    alt: "Shady repairing Batool's car while she brings him coffee",
    portrait: true,
  },
  {
    number: "04",
    eyebrow: "A feeling found its way",
    title: "She Began to See It",
    text: "Little by little, his kindness reached her heart. The familiar friendship started to feel warmer, deeper, and impossible to overlook.",
    note: "The heart understands before words arrive.",
    image: noticedImage,
    alt: "Batool and Shady sharing a warm sunset moment together",
    focalPoint: "50% 35%",
  },
  {
    number: "05",
    eyebrow: "The truth in his heart",
    title: "He Told Her Everything",
    text: "In one honest moment, Shady finally gave a voice to the love that had been growing for years and asked Batool to begin a new chapter with him.",
    note: "No grand speech. Just a true heart.",
    image: confessionImage,
    alt: "Shady and Batool sitting together by the water at sunset",
    focalPoint: "42% 50%",
  },
  {
    number: "06",
    eyebrow: "The promise",
    title: "She Said Yes",
    text: "Batool chose the love that had always felt like home. One joyful yes turned a lifetime of memories into a promise for forever.",
    note: "The easiest yes to the sweetest forever.",
    image: proposalImage,
    alt: "Shady proposing to Batool beside the water at sunset",
    focalPoint: "50% 52%",
  },
  {
    number: "07",
    eyebrow: "And so we begin",
    title: "Our First Forever",
    text: "At the church doors, surrounded by light, flowers, and everyone they love, Shady and Batool begin their life as one.",
    note: "This is not the end of our story. It is the first page.",
    image: weddingImage,
    alt: "Shady and Batool together on their wedding day outside the church",
    focalPoint: "50% 48%",
    final: true,
  },
];

function Petal({ className }: { className: string }) {
  return (
    <span className={`journey-petal ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 34">
        <path d="M12 33C4 25-1 15 3 7 7-1 18-1 21 7c3 8-2 18-9 26Z" />
      </svg>
    </span>
  );
}

export default function Timeline() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="timeline" className="journey" aria-labelledby="journey-title">
      <div className="journey__ambient" aria-hidden="true">
        <span className="journey__glow journey__glow--one" />
        <span className="journey__glow journey__glow--two" />
        <span className="journey__grain" />
        <Petal className="journey-petal--one" />
        <Petal className="journey-petal--two" />
        <Petal className="journey-petal--three" />
        <Petal className="journey-petal--four" />
      </div>

      <motion.header
        className="journey-heading"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <p className="journey-heading__eyebrow">
          <span /> Chapter Two <span />
        </p>
        <h2 id="journey-title" className="journey-heading__title">
          <span>Our</span> <em>Journey</em>
        </h2>
        <p className="journey-heading__intro">
          Some love stories begin with a hello. Ours began long before we knew
          what love was.
        </p>
      </motion.header>

      <div className="journey-timeline">
        <div className="journey-timeline__track" aria-hidden="true">
          <motion.span
            initial={shouldReduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 2.2, ease: EASE }}
          />
        </div>

        {MOMENTS.map((moment, index) => {
          const isLeft = index % 2 === 0;
          const hasImage = Boolean(moment.image);

          return (
            <motion.article
              key={moment.number}
              className={`journey-step ${isLeft ? "journey-step--left" : "journey-step--right"}${moment.final ? " journey-step--final" : ""}`}
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, x: isLeft ? -42 : 42, y: 24 }
              }
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.86, delay: 0.04, ease: EASE }}
            >
              <div className="journey-step__node" aria-hidden="true">
                <span>{moment.number}</span>
                <i />
              </div>

              <div className={`journey-card ${hasImage ? "journey-card--image" : "journey-card--illustrated"}${moment.portrait ? " journey-card--portrait" : ""}`}>
                <div className="journey-card__visual">
                  {moment.image && (
                    <figure className={`journey-card__media${moment.portrait ? " journey-card__media--portrait" : ""}`}>
                      {moment.portrait && (
                        <img
                          className="journey-card__media-backdrop"
                          src={moment.image}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      <img
                        className="journey-card__media-image"
                        src={moment.image}
                        alt={moment.alt ?? ""}
                        loading="lazy"
                        decoding="async"
                        style={{ objectPosition: moment.focalPoint }}
                      />
                      <span className="journey-card__veil" aria-hidden="true" />
                      <figcaption>
                        <span>Shady</span>
                        <i>♥</i>
                        <span>Batool</span>
                      </figcaption>
                    </figure>
                  )}
                </div>

                <div className="journey-card__copy">
                  <p className="journey-card__eyebrow">{moment.eyebrow}</p>
                  <h3>{moment.title}</h3>
                  <p className="journey-card__text">{moment.text}</p>
                  <div className="journey-card__note">
                    <span aria-hidden="true" />
                    <em>{moment.note}</em>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <motion.footer
        className="journey-ending"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.65 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <div className="journey-ending__line" aria-hidden="true" />
        <div className="journey-ending__seal" aria-hidden="true">
          <span>S</span><b>♥</b><span>B</span>
        </div>
        <p>To be continued, together.</p>
      </motion.footer>
    </section>
  );
}
