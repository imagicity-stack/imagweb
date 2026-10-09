import Img from "./Img";
import { IMG } from "../lib/media";

const shots = [
  { id: IMG.brainstormColor, caption: "brainstorm o'clock" },
  { id: IMG.designCollab, caption: "pixel pushing" },
  { id: IMG.photographer, caption: "shoot day!" },
  { id: IMG.coffeePink, caption: "coffee = fuel" },
  { id: IMG.celebrate, caption: "launch day" },
  { id: IMG.cameraMan, caption: "behind the lens" },
  { id: IMG.pensNotebooks, caption: "sketch first" },
  { id: IMG.selfie, caption: "team selfie" }
];

// A belt of tilted polaroids drifting sideways. Pure CSS animation; it pauses
// on hover so people can actually look at a shot.
export default function StudioStrip() {
  const belt = (copy) => (
    <div className="ix-strip-row" aria-hidden={copy ? "true" : undefined}>
      {shots.map((shot, index) => (
        <figure className={`ix-strip-shot is-${index % 4}`} key={`${copy}-${shot.id}`}>
          <Img id={shot.id} alt={copy ? "" : shot.caption} width={420} ratio={1.1} sizes="260px" />
          <figcaption>{shot.caption}</figcaption>
        </figure>
      ))}
    </div>
  );

  return (
    <div className="ix-strip">
      <div className="ix-strip-track">
        {belt(0)}
        {belt(1)}
      </div>
    </div>
  );
}
