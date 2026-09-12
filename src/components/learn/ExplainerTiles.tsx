import {
  BadgeCheck,
  HandHeart,
  HeartHandshake,
  LineChart,
  PawPrint,
} from "lucide-react";
import "./Learn.css";

/**
 * The five explainer concepts from plan section 8, using the project's
 * existing lucide line-icon set rather than emoji pseudo-icons.
 */
const tiles = [
  {
    Icon: HeartHandshake,
    title: "Adopt and verify",
    body: "Adopt from a shelter and ask that shelter to confirm the adoption.",
  },
  {
    Icon: BadgeCheck,
    title: "Certified Shelter Pet Passport",
    body: "Your pet receives a lasting, private record of identity and history.",
  },
  {
    Icon: PawPrint,
    title: "Unlock savings over a lifetime",
    body: "Use participating offers throughout your pet's life, on each provider's terms.",
  },
  {
    Icon: HandHeart,
    title: "Shop with impact",
    body: "Choose businesses that put part of their margin behind shelter pets.",
  },
  {
    Icon: LineChart,
    title: "Follow the difference",
    body: "See committed support and, once reporting exists, what has actually moved.",
  },
];

export function ExplainerTiles({ heading }: { heading?: string }) {
  return (
    <section className="learnTilesSection" aria-labelledby="learn-tiles-title">
      <div className="learnWrap">
        <h2 id="learn-tiles-title" className="learnTilesTitle">
          {heading ?? "How ShelterPawtners works"}
        </h2>
        <ol className="learnTiles">
          {tiles.map(({ Icon, title, body }, index) => (
            <li className="learnTile" key={title}>
              <span className="learnTileIcon" aria-hidden="true">
                <Icon />
              </span>
              <span className="learnTileStep">Step {index + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
