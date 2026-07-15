import { motion, useReducedMotion } from "framer-motion";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import "../styles/gallery.css";

import img1 from "../assets/images/gallery/1.webp";
import img2 from "../assets/images/gallery/2.webp";
import img3 from "../assets/images/gallery/3.webp";
import img4 from "../assets/images/gallery/4.webp";
import img5 from "../assets/images/gallery/5.webp";
import img6 from "../assets/images/gallery/6.webp";

const EASE = [0.22, 1, 0.36, 1] as const;

const IMAGES = [
  { src: img1, layout: "hero", position: "center" },
  { src: img2, layout: "wide", position: "center 44%" },
  { src: img3, layout: "wide", position: "center 46%" },
  { src: img4, layout: "third", position: "center" },
  { src: img5, layout: "third", position: "center 44%" },
  { src: img6, layout: "third", position: "center 45%" },
] as const;

function HeartIcon() {
  return (
    <svg viewBox="0 0 48 42" aria-hidden="true">
      <path d="M24 39C18 33.4 5 24.4 5 13.6 5 7.7 9.4 3.5 14.8 3.5c4.2 0 7.2 2.5 9.2 5.5 2-3 5-5.5 9.2-5.5C38.6 3.5 43 7.7 43 13.6 43 24.4 30 33.4 24 39Z" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.5 4H4v4.5M15.5 4H20v4.5M8.5 20H4v-4.5M15.5 20H20v-4.5" />
    </svg>
  );
}

export default function Gallery() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="gallery" className="gallery" aria-labelledby="gallery-title">
      <div className="gallery__ambient" aria-hidden="true">
        <span className="gallery__wash gallery__wash--one" />
        <span className="gallery__wash gallery__wash--two" />
        <span className="gallery__grain" />
      </div>

      <motion.header
        className="gallery__heading"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <span className="gallery__line" aria-hidden="true" />
        <h2 id="gallery-title">Our Memories</h2>
        <span className="gallery__heart" aria-hidden="true">
          <HeartIcon />
        </span>
        <span className="gallery__line gallery__line--reverse" aria-hidden="true" />
      </motion.header>

      <PhotoProvider>
        <div className="gallery-grid">
          {IMAGES.map((image, index) => (
            <PhotoView key={image.src} src={image.src}>
              <motion.figure
                className={`gallery-item gallery-item--${image.layout}`}
                role="button"
                tabIndex={0}
                aria-label={`Open memory ${index + 1}`}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, y: 34, scale: 0.975 }
                }
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{ duration: 0.82, delay: (index % 3) * 0.08, ease: EASE }}
              >
                <span className="gallery-item__paper" aria-hidden="true" />
                <img
                  src={image.src}
                  alt={`Shady and Batool memory ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: image.position }}
                />
                <span className="gallery-item__veil" aria-hidden="true" />
                <span className="gallery-item__expand" aria-hidden="true">
                  <ExpandIcon />
                </span>
              </motion.figure>
            </PhotoView>
          ))}
        </div>
      </PhotoProvider>
    </section>
  );
}
