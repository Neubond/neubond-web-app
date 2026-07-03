// /emails/components/LookingAheadSection.tsx
import { Section } from "react-email";

export default function Section3() {
  return (
    <Section
      style={{
        backgroundColor: "#F7F3FB",
        padding: "10px 24px",
        marginBottom: "64px",
        borderBottomLeftRadius: "6px",
        borderBottomRightRadius: "6px",
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
        Product Updates & R&D Sneak Peek
      </h1>
      <p>
        <strong>
          Since our last newsletter in February, we've made exciting progress
          across hardware, firmware, and the app. Here's a quick snapshot:
        </strong>
      </p>
      <ul>
        <li style={{ marginBottom: "10px" }}>
          <strong>Device R&D:</strong> We've refined the device form factor,
          improved signal stability, and completed some rounds of usability
          testing. The latest prototype includes updated casing components and
          improved user experience on wearing the device.
        </li>
        <li style={{ marginBottom: "10px" }}>
          <strong>Signal Processing & Calibration:</strong> Our device
          calibration flow is now more tailored to individuals, reducing setup
          time and improving accuracy for different muscle groups. We're
          currently validating this with clinicians and users to ensure it works
          smoothly in real sessions.
        </li>
        <li style={{ marginBottom: "10px" }}>
          <strong>App User Interface:</strong> We are updating the app interface
          to refine clarity and user motivation, with cleaner progress visuals,
          simpler exercise flows, and more intuitive information for effective
          exercise.
        </li>
      </ul>
    </Section>
  );
}
