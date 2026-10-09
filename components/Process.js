import Reveal from "./Reveal";
import SplitText from "./SplitText";
import { CurlyArrow, Doodle } from "./Doodles";

const steps = [
  {
    title: "Discover",
    icon: "target",
    body: "Research, audits and positioning. We map the market and find the angle nobody else is using."
  },
  {
    title: "Design",
    icon: "pencil",
    body: "Strategy into systems: brand, funnels, creative and channel architecture that fit together."
  },
  {
    title: "Deploy",
    icon: "rocket",
    body: "Launch campaigns and automation with sharp creative and tight, honest tracking."
  },
  {
    title: "Scale",
    icon: "bolt",
    body: "Optimise against real metrics and compound what works, month after month."
  }
];

export default function Process({ title = "A clear path from idea to momentum." }) {
  return (
    <section className="ix-section ix-process">
      <div className="container">
        <Reveal className="ix-head is-center">
          <span className="ix-label">How we work</span>
          <h2 className="ix-h2">
            <SplitText text={title} />
          </h2>
        </Reveal>
        <div className="ix-process-grid">
          <svg className="ix-process-line" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M10 40 C 160 0, 260 60, 380 30 S 620 0, 740 34 S 900 50, 990 20" />
          </svg>
          {steps.map((step, index) => (
            <Reveal key={step.title} delay={index * 110} variant="pop" className="ix-step-wrap">
              <article className={`ix-step is-${index}`} data-tilt>
                <span className="ix-step-num">{String(index + 1).padStart(2, "0")}</span>
                <Doodle name={step.icon} size={52} className="ix-step-icon" />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <CurlyArrow className="ix-process-arrow" size={120} />
      </div>
    </section>
  );
}
