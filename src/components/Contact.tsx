import { motion, useReducedMotion } from "framer-motion";
import "../styles/contact.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const CONTACTS = [
  {
    name: "Shady",
    phone: "+965 6655 9290",
    href: "https://wa.me/96566559290",
    variant: "shady",
  },
  {
    name: "Batool",
    phone: "+965 6697 1142",
    href: "https://wa.me/96566971142",
    variant: "batool",
  },
] as const;

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 11.8a8.3 8.3 0 0 1-12.3 7.3L3.6 20.3l1.2-4.4a8.3 8.3 0 1 1 15.6-4.1Z" />
      <path d="M8.3 7.8c.2-.4.4-.4.8-.4h.5c.2 0 .4.1.5.5l.7 1.8c.1.3.1.5-.1.7l-.6.8c-.2.2-.2.4-.1.7.7 1.4 1.8 2.5 3.2 3.2.3.1.5.1.7-.1l.8-1c.2-.3.5-.3.8-.2l1.8.8c.3.1.5.3.5.6 0 .3-.1 1.5-.7 2.1-.5.6-1.4.9-2.3.9-.6 0-1.4-.2-2.4-.6a10.6 10.6 0 0 1-4.1-3.6 8.8 8.8 0 0 1-1.7-4.2c0-.9.3-1.6.7-2Z" />
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

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__ambient" aria-hidden="true">
        <span className="contact__glow contact__glow--one" />
        <span className="contact__glow contact__glow--two" />
        <span className="contact__grain" />
        <i className="contact__petal contact__petal--one" />
        <i className="contact__petal contact__petal--two" />
        <i className="contact__petal contact__petal--three" />
      </div>

      <motion.header
        className="contact__heading"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <h2 id="contact-title">Need Any Help?</h2>
        <p>
          If you have any questions regarding the wedding, feel free to contact us.
        </p>
      </motion.header>

      <div className="contact-grid">
        {CONTACTS.map((contact, index) => (
          <motion.a
            key={contact.name}
            className={`contact-card contact-card--${contact.variant}`}
            href={contact.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open a WhatsApp conversation with ${contact.name}`}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 34, rotate: index === 0 ? -1.5 : 1.5 }
            }
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, delay: index * 0.1, ease: EASE }}
          >
            <span className="contact-card__halo" aria-hidden="true" />
            <span className="contact-card__number" aria-hidden="true">
              0{index + 1}
            </span>

            <span className="contact-card__icon" aria-hidden="true">
              <WhatsAppIcon />
            </span>

            <div className="contact-card__copy">
              <h3>{contact.name}</h3>
              <span>{contact.phone}</span>
            </div>

            <span className="contact-card__arrow" aria-hidden="true">
              <ArrowIcon />
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
