import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import churchIllustration from "../assets/images/details/church.webp";
import receptionIllustration from "../assets/images/details/reception.webp";
import "../styles/wedding-details.css";

const EASE = [0.22, 1, 0.36, 1] as const;

type EventDetail = {
  number: string;
  type: "ceremony" | "reception";
  eyebrow: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  address: string[];
  mapUrl: string;
  mapLabel: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
};

const EVENTS: EventDetail[] = [
  {
    number: "01",
    type: "ceremony",
    eyebrow: "The sacred promise",
    title: "Wedding Ceremony",
    description:
      "Join us as we exchange our vows and begin our forever, surrounded by faith, family, and love.",
    date: "Thursday · 27 August 2026",
    time: "6:00 PM",
    venue: "Angel Church",
    address: ["Sheraton", "Heliopolis", "Cairo"],
    mapUrl: "https://maps.app.goo.gl/cVLMmvykDtMTBiSA8?g_st=ic",
    mapLabel: "View Church Location",
    image: churchIllustration,
    imageAlt: "Watercolor illustration of Angel Church decorated with wedding flowers",
    imageLabel: "Our vows",
  },
  {
    number: "02",
    type: "reception",
    eyebrow: "The joyful celebration",
    title: "Wedding Reception",
    description:
      "After the vows, the celebration continues with dinner, music, laughter, and the people we love most.",
    date: "Thursday · 27 August 2026",
    time: "8:00 PM",
    venue: "Sonesta Hotel Cairo",
    address: ["Nasr City", "Cairo"],
    mapUrl: "https://maps.app.goo.gl/C2mMoecbC2YmdNf78?g_st=ic",
    mapLabel: "View Reception Location",
    image: receptionIllustration,
    imageAlt: "Watercolor illustration of an elegant flower-filled wedding reception hall",
    imageLabel: "Our celebration",
  },
];

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3M17 3v3M4.5 9h15M6.5 5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M8 13h3M8 16.5h6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.1" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M14 7l5 5-5 5" />
    </svg>
  );
}

function DetailFact({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="day-event__fact">
      <span className="day-event__fact-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{children}</strong>
      </div>
    </div>
  );
}

export default function WeddingDetails() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="details" className="day-details" aria-labelledby="day-details-title">
      <div className="day-details__ambient" aria-hidden="true">
        <span className="day-details__glow day-details__glow--one" />
        <span className="day-details__glow day-details__glow--two" />
        <span className="day-details__grain" />
        <i className="day-details__petal day-details__petal--one" />
        <i className="day-details__petal day-details__petal--two" />
        <i className="day-details__petal day-details__petal--three" />
      </div>

      <motion.header
        className="day-details__heading"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <p className="day-details__eyebrow">
          <span /> Chapter Three <span />
        </p>
        <h2 id="day-details-title" className="day-details__title">
          <span>Our Day</span> <em>Details</em>
        </h2>
        <p className="day-details__intro">
          Every forever has a date, a place, and a moment where two lives become one.
        </p>

        <div className="day-details__date" aria-label="Thursday, 27 August 2026">
          <span>Thursday</span>
          <strong>27</strong>
          <div>
            <b>August</b>
            <small>2026</small>
          </div>
        </div>
      </motion.header>

      <div className="day-details__events">
        {EVENTS.map((event, index) => (
          <motion.article
            key={event.type}
            className={`day-event day-event--${event.type}`}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, x: index === 0 ? -42 : 42, y: 30 }
            }
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.9, delay: index * 0.1, ease: EASE }}
          >
            <div className="day-event__art">
              <span className="day-event__art-label">
                <i>{event.number}</i>
                {event.imageLabel}
              </span>
              <span className="day-event__arch" aria-hidden="true" />
              <motion.img
                src={event.image}
                alt={event.imageAlt}
                loading="lazy"
                decoding="async"
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.93, y: 18 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 1, delay: 0.18 + index * 0.1, ease: EASE }}
              />
              <span className="day-event__art-floor" aria-hidden="true" />
            </div>

            <div className="day-event__copy">
              <p className="day-event__eyebrow">{event.eyebrow}</p>
              <h3>{event.title}</h3>
              <p className="day-event__description">{event.description}</p>

              <div className="day-event__facts">
                <DetailFact icon={<CalendarIcon />} label="Date">
                  {event.date}
                </DetailFact>
                <DetailFact icon={<ClockIcon />} label="Time">
                  {event.time}
                </DetailFact>
                <DetailFact icon={<PinIcon />} label="Venue">
                  <span>{event.venue}</span>
                  <em>{event.address.join(" · ")}</em>
                </DetailFact>
              </div>

              <a
                className="day-event__map"
                href={event.mapUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${event.mapLabel} — opens in a new tab`}
              >
                <span className="day-event__map-pin">
                  <PinIcon />
                </span>
                <span className="day-event__map-copy">
                  <strong>{event.mapLabel}</strong>
                  <small>Open in Google Maps</small>
                </span>
                <span className="day-event__map-arrow">
                  <ArrowIcon />
                </span>
              </a>
            </div>
          </motion.article>
        ))}

        <div className="day-details__connector" aria-hidden="true">
          <span />
          <b>then</b>
          <span />
        </div>
      </div>

      <motion.footer
        className="day-details__closing"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.65 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <span aria-hidden="true" />
        <p>
          One beautiful day. Two unforgettable moments.
          <strong>A lifetime ahead.</strong>
        </p>
        <span aria-hidden="true" />
      </motion.footer>
    </section>
  );
}
