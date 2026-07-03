import { Section, Row, Column } from "react-email";

export default function TopBar() {
  return (
    <Section
      style={{
        backgroundColor: "#8A65BA",
        color: "#fff",
        padding: "3px 5px",
      }}
    >
      <Row>
        <Column align="left">
          <strong>Neubond Newsletter</strong>
        </Column>
        <Column align="right">
          <strong>May 1st, 2026</strong>
        </Column>
      </Row>
    </Section>
  );
}
