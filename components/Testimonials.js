import Reveal from "./Reveal";
import { Sparkle } from "./Doodles";

const testimonials = [
  {
    quote:
      "Imagicity rebuilt our entire growth engine in eight weeks. Demo requests doubled and our CAC dropped by a third.",
    name: "Ananya Rao",
    role: "Founder, Wavelane",
    tone: "red"
  },
  {
    quote:
      "The most strategic creative team we've worked with. They think like operators, not just designers.",
    name: "Karan Mehta",
    role: "CMO, Nova Health",
    tone: "ink"
  },
  {
    quote:
      "From positioning to paid media, everything finally works as one system. Our pipeline has never been healthier.",
    name: "Sara Iqbal",
    role: "VP Growth, Orbito Labs",
    tone: "yellow"
  }
];

const initials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

export default function Testimonials() {
  return (
    <section className="ix-section ix-quotes">
      <div className="container ix-quotes-grid">
        <Reveal className="ix-quotes-head">
          <span className="ix-script is-red">Kind words</span>
          <h2 className="ix-h2">From amazing clients</h2>
          <Sparkle size={48} color="#111" className="ix-quotes-spark" />
        </Reveal>
        {testimonials.map((item, index) => (
          <Reveal key={item.name} delay={index * 110} className="ix-quote-wrap">
            <figure className="ix-quote">
              <span className="ix-quote-mark" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <span className={`ix-quote-avatar tone-${item.tone}`} aria-hidden="true">
                  {initials(item.name)}
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
