import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import instagramIcon from "../assets/images/designer-social/instagram.png";
import gmailIcon from "../assets/images/designer-social/gmail.png";
import whatsappIcon from "../assets/images/designer-social/whatsapp.png";
import linkedinIcon from "../assets/images/designer-social/linkedin.png";
import "../styles/footer.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const DESIGNER_CHANNELS = [
  {
    name: "WhatsApp",
    href: "https://wa.me/96551083713?text=Hello%20Moudy%2C%20I%20would%20like%20to%20ask%20about%20your%20website%20design%20services.",
    icon: whatsappIcon,
  },
  {
    name: "Gmail",
    href: "mailto:moudynady@gmail.com",
    icon: gmailIcon,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/moudyvisualad?igsh=MW8xbXZvOHI2ZHV0dw%3D%3D&utm_source=qr",
    icon: instagramIcon,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/moudy-nady-mba-03b592166",
    icon: linkedinIcon,
  },
] as const;

function Monogram() {
  return (
    <svg className="footer__monogram" viewBox="0 0 180 116" aria-hidden="true">
      <path className="footer__monogram-oval" d="M90 9c43 0 78 22 78 49s-35 49-78 49S12 85 12 58 47 9 90 9Z" />
      <path className="footer__monogram-sprig" d="M24 75c17-5 26-17 31-34M31 67l-11-5M38 60l-12-9M46 51l-8-12M156 75c-17-5-26-17-31-34M149 67l11-5M142 60l12-9M134 51l8-12" />
      <text x="51" y="73">S</text>
      <path className="footer__monogram-heart" d="M90 71c-8-7-17-13-17-22 0-6 4-10 10-10 4 0 7 2 9 6 2-4 5-6 9-6 6 0 10 4 10 10 0 9-9 15-21 22Z" />
      <text x="105" y="73">B</text>
    </svg>
  );
}

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const scroller = document.getElementById("root");

    if (!footer || !scroller) return undefined;

    const setFooterEndState = (active: boolean) => {
      document.documentElement.classList.toggle("footer-end-active", active);
      document.body.classList.toggle("footer-end-active", active);
    };

    const updateFooterEndState = () => {
      const distanceToEnd =
        scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;
      const activationDistance = Math.max(28, footer.offsetHeight * 0.22);

      setFooterEndState(distanceToEnd <= activationDistance);
    };

    const observer = new ResizeObserver(updateFooterEndState);
    observer.observe(scroller);
    observer.observe(footer);

    scroller.addEventListener("scroll", updateFooterEndState, { passive: true });
    window.addEventListener("resize", updateFooterEndState, { passive: true });

    const frame = window.requestAnimationFrame(updateFooterEndState);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      scroller.removeEventListener("scroll", updateFooterEndState);
      window.removeEventListener("resize", updateFooterEndState);
      setFooterEndState(false);
    };
  }, []);

  return (
    <motion.footer
      ref={footerRef}
      className="footer"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      <div className="footer__ambient" aria-hidden="true">
        <span className="footer__glow footer__glow--one" />
        <span className="footer__glow footer__glow--two" />
        <span className="footer__grain" />
        <i className="footer__spark footer__spark--one" />
        <i className="footer__spark footer__spark--two" />
        <i className="footer__spark footer__spark--three" />
      </div>

      <div className="footer__frame" aria-hidden="true" />

      <motion.div
        className="footer__content"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.72, delay: 0.06, ease: EASE }}
      >
        <Monogram />

        <h3>
          <span>Shady</span>
          <b aria-hidden="true">♥</b>
          <span>Batool</span>
        </h3>

        <p>Thank you for celebrating our special day with us.</p>

        <span className="footer__divider" aria-hidden="true">
          <i />
          <b>✦</b>
          <i />
        </span>

        <small>© 2026 All Rights Reserved.</small>

        <div className="footer__signature">
          <small className="credit">
            <span>Designed &amp; Developed by</span>
            <strong>Moudy Nady</strong>
          </small>

          <div className="footer__socials" aria-label="Contact designer Moudy Nady">
            {DESIGNER_CHANNELS.map((channel) => (
              <a
                key={channel.name}
                className="footer__social-link"
                href={channel.href}
                target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={channel.href.startsWith("mailto:") ? undefined : "noreferrer"}
                aria-label={`Contact Moudy Nady on ${channel.name}`}
                title={channel.name}
              >
                <img src={channel.icon} alt="" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
}
