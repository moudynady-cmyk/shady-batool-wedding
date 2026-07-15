import "../styles/background.css";
import background from "../assets/images/background.jpg";

export default function Background() {

  return (

    <div className="site-background">

      <img
        src={background}
        alt=""
        className="background-image"
      />

      <div className="background-overlay" />

      <div className="background-vignette" />

    </div>

  );

}