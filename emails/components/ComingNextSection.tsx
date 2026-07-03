// /emails/components/ComingNextSection.tsx
import { Section } from "react-email";

export default function ComingNextSection() {
  return (
    <Section className="nb-section">
      <h1 className="nb-section-title">What’s coming next</h1>

      <p className="nb-body">
        Over the next few months, we’ll be refining Loop I’s sensing accuracy,
        improving the feedback system, and preparing for our first round of
        real‑world testing.
      </p>

      <p className="nb-body">
        We’re also working on the companion app experience — making sure it’s
        simple, supportive, and genuinely helpful for people practising their
        exercises at home.
      </p>

      <p className="nb-body">
        As we move forward, we’ll continue sharing updates with you so you can
        follow along with our progress.
      </p>
    </Section>
  );
}
