// /emails/components/Hero.tsx
import { Section, Img } from "react-email";

export default function Hero() {
  return (
    <Section>
      <Img
        src="https://app.neubond.co.uk/email/Newsletter-2/Team_edited.jpg"
        width="100%"
        alt="Welcome to Neubond Hero"
        style={{
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
        }}
      />
      <div
        style={{
          padding: "20px 40px",
          color: "#fff",
          backgroundColor: "#8A65BA",
          borderBottomLeftRadius: "6px",
          borderBottomRightRadius: "6px",
        }}
      >
        <h2
          style={{
            marginTop: "0px",
          }}
        >
          Welcome to the latest edition of the Neubond Newsletter.
        </h2>

        <p>
          It's been a busy few months, from R&D milestones to new faces on the
          team, we have a lot to share this edition, including how you can get
          involved in Stroke Awareness Month this May.
        </p>
        <p>
          Our readership is growing with every edition, so if you're joining us
          for the first time, we're especially glad to have you here. We hope
          you find everything inside useful, and we look forward to making you a
          part of the Neubond journey.
        </p>
      </div>
    </Section>
  );
}
