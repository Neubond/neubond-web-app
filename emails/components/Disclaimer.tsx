// /emails/components/Disclaimer.tsx
import { Section } from "react-email";

export default function Disclaimer() {
  return (
    <Section
      style={{
        backgroundColor: "#ededed",
        color: "#000",
        padding: "0px 24px",
        fontSize: "13px",
      }}
    >
      <p>
        You are receiving this email because you interacted with Neubond via our
        website, completed an expression of interest survey, attended a trade
        show, or opted in to receive updates about Neubond.{" "}
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>
      </p>
    </Section>
  );
}
