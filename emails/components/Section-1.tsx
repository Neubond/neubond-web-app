// /emails/components/VisionSection.tsx
import { Section } from "react-email";

export default function Section1() {
  return (
    <Section
      style={{
        backgroundColor: " #FFFFFF",
        padding: "24px",
        margin: "64px 0",
        border: "4px solid #8A65BA",
        borderRadius: "6px",
      }}
    >
      <h1 style={{ color: " #8A65BA", marginTop: 0 }}>
        Stroke Awareness Month
      </h1>
      <p>
        <strong>
          May marks Stroke Awareness Month across the UK, led by the Stroke
          Association's&nbsp;
          <span style={{ color: " #8A65BA" }}>Make May Purple</span>
          &nbsp;campaign. It is a vital month to raise funds and spread the word
          around stroke prevention and recovery. The purple in our own branding
          feels especially meaningful this month as the UK comes together to
          support the cause.
        </strong>
      </p>
      <p>
        <strong>Get involved - </strong>
        One simple way to get involved is the &nbsp;
        <a href="https://www.stroke.org.uk/get-involved/fundraise/facebook-challenge">
          31 Minutes in May
        </a>
        &nbsp; challenge, encouraging people to stay active for 31 minutes each
        day and highlight the importance of rehabilitation. Strokes can happen
        suddenly, often without pain, which is why recognising the signs quickly
        is so important.
      </p>
      <p>
        <strong>F.A.S.T - </strong>
        Take a moment this month to recap the &nbsp;
        <a href="https://www.stroke.org.uk/stroke/symptoms">F.A.S.T. signs</a>
        &nbsp; (Face, Arms, Speech, Time) and share them with someone close to
        you. Greater awareness helps people act quickly and supports better
        recovery for those affected by stroke.
      </p>
    </Section>
  );
}
