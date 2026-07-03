// /emails/components/LookingAheadSection.tsx
import { Section } from "react-email";

export default function Section4() {
  return (
    <Section
      style={{
        backgroundColor: "#F7F3FB",
        padding: "10px 24px",
        marginBottom: "64px",
        borderRadius: "6px",
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
        Looking ahead
      </h1>

      <p>
        <strong>Our next milestone is a big one:</strong> finalising the product
        design for medical device certification. We are working hard to finalise
        the product details and are planning to run multiple tests to ensure the
        device complies with medical-grade standards.
      </p>

      <p>
        <strong>Neubond Team</strong>
      </p>
    </Section>
  );
}
