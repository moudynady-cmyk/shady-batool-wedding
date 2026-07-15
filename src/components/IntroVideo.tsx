import introVideo from "../assets/video/intro-new.mp4";

import "../styles/introVideo.css";

type Props = {

    onFinished: () => void;

};

export default function IntroVideo({ onFinished }: Props) {

    return (

        <div className="intro-video">

            <video

                autoPlay

                playsInline

                muted

                onEnded={onFinished}

            >

                <source

                    src={introVideo}

                    type="video/mp4"

                />

            </video>

        </div>

    );

}