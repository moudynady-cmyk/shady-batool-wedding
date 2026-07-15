import "../styles/opening.css";

import introImage from "../assets/images/intro_photo.png";

interface Props {
  onStart: () => void;
}

export default function OpeningInvitation({ onStart }: Props) {

  return (

    <div className="opening">

      <div className="opening-cover">

        <img
          src={introImage}
          className="cover-image"
          alt="Wedding Invitation"
        />

        <button
          className="seal-button"
          onClick={onStart}
        />

      </div>

    </div>

  );

}