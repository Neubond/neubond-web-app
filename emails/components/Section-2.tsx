// /emails/components/LookingAheadSection.tsx
import { Section, Img } from "react-email";

export default function Section2() {
  return (
    <Section
      style={{
        backgroundColor: "#F7F3FB",
        padding: "10px 24px",
        marginBottom: "64px",
        borderBottomRightRadius: "6px",
        borderBottomLeftRadius: "6px",
      }}
    >
      <h1
        style={{
          color: " #8A65BA",
          fontSize: "30px",
          fontWeight: 600,
          marginBottom: "20px",
          marginTop: "5px",
        }}
      >
        Team Updates: Welcoming Giovanni & Sarah
      </h1>
      <p>
        <strong>
          We're excited to introduce two new members who are strengthening our
          research and quality work.
        </strong>
      </p>

      <p>
        <strong>Giovanni — Quality Assurance</strong>
      </p>
      <p>
        Giovanni brings structure, rigour, and a quality-first mindset to our
        development process. He's leading our internal QA workflows,
        documentation, and early preparations for medical device compliance. His
        work ensures that everything we build is reliable, testable, and ready
        for certification.
      </p>

      <p>
        <strong>Sarah — Research Physiotherapist</strong>
      </p>

      <p>
        Sarah joins us with clinical experience in neuro-rehabilitation and a
        strong understanding of patient pathways. She's helping us refine our
        exercise library and protocols to ensure our approach reflects
        real-world practice. Her insights are already shaping how we design
        exercises, measure progress, and communicate results to intended users.
      </p>
      <p
        style={{
          color: "#8A65BA",
        }}
      >
        <strong>
          Together, they're helping us move from a promising prototype to a
          clinically robust product.
        </strong>
      </p>
    </Section>
  );
}
