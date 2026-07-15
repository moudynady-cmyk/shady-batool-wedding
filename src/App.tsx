import { useEffect, useLayoutEffect, useRef, useState } from "react";

import OpeningInvitation from "./components/OpeningInvitation";
import IntroVideo from "./components/IntroVideo";
import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Story from "./components/Story";
import Timeline from "./components/Timeline";
import WeddingDetails from "./components/WeddingDetails";
import RSVP from "./components/RSVP";
import Contact from "./components/Contact";
import Gallery from "./components/Gallery";
import Footer from "./components/Footer";
import GuestExport from "./components/GuestExport";

import weddingSong from "./assets/audio/wedding-song.mp3";

type Stage = "cover" | "video" | "website";

const resetPageScroll = () => {
  const scroller = document.getElementById("root");
  const previousBehavior = scroller?.style.scrollBehavior ?? "";

  if (scroller) {
    scroller.style.scrollBehavior = "auto";
    scroller.scrollTop = 0;
    scroller.scrollLeft = 0;
  }

  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo(0, 0);

  if (scroller) {
    scroller.style.scrollBehavior = previousBehavior;
  }
};

export default function App() {
  const [stage, setStage] = useState<Stage>("cover");
  const audioRef = useRef<HTMLAudioElement>(null);

  /*
    Prevent the browser/preview iframe from restoring a previous deep scroll
    position after a refresh. The website is not mounted during the cover and
    intro video, so an old scroll position can otherwise be applied the moment
    the long page appears.
  */
  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    resetPageScroll();

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    const isIntro = stage !== "website";

    document.documentElement.classList.toggle("intro-scroll-lock", isIntro);
    document.body.classList.toggle("intro-scroll-lock", isIntro);

    if (!isIntro) {
      resetPageScroll();

      const frame = window.requestAnimationFrame(resetPageScroll);
      const timer = window.setTimeout(resetPageScroll, 80);

      return () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
      };
    }

    return undefined;
  }, [stage]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("intro-scroll-lock");
      document.body.classList.remove("intro-scroll-lock");
    };
  }, []);

  const handleStart = async () => {
    try {
      await audioRef.current?.play();
    } catch (err) {
      console.log(err);
    }

    setStage("video");
  };

  const handleVideoFinished = () => {
    setStage("website");
  };

  return (
    <>
      <Background />

      <audio ref={audioRef} src={weddingSong} loop preload="auto" />

      <GuestExport />

      {stage === "cover" && <OpeningInvitation onStart={handleStart} />}

      {stage === "video" && <IntroVideo onFinished={handleVideoFinished} />}

      {stage === "website" && (
        <>
          <Navbar />
          <Hero />
          <Story />
          <Timeline />
          <WeddingDetails />
          <RSVP />
          <Contact />
          <Gallery />
          <Footer />
        </>
      )}
    </>
  );
}
