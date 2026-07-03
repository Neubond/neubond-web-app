// /emails/components/Footer.tsx
import { Section, Img, Link, Row, Column } from "react-email";

export default function Footer() {
  return (
    <Section
      style={{
        backgroundColor: "#8A65BA",
        color: "#fff",
        width: "100%",
      }}
    >
      <Row>
        <Column
          align="center"
          style={{
            padding: "10px 0px",
          }}
        >
          <Img
            src="https://app.neubond.co.uk/email/Logo_white_Compressed.png"
            alt="Neubond Logo - White"
            width="200px"
          />
        </Column>
      </Row>
      <Row>
        <Column align="center">
          <Link
            href="mailto:info@neubond.co.uk"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <span
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: "10px",
              }}
            >
              <Img
                src="https://app.neubond.co.uk/email/mail_icon.png"
                alt="Mail Icon"
                width="16px"
              />
            </span>
            <span
              style={{
                verticalAlign: "middle",
              }}
            >
              info@neubond.co.uk
            </span>
          </Link>
        </Column>
        <Column valign="middle" align="center">
          <Link
            href="https://neubond.co.uk/"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <span
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: "10px",
              }}
            >
              <Img
                src="https://app.neubond.co.uk/email/globe_icon.png"
                alt="globe Icon"
                width="16px"
                style={{
                  display: "block",
                }}
              />
            </span>
            <span
              style={{
                verticalAlign: "middle",
              }}
            >
              neubond.co.uk
            </span>
          </Link>
        </Column>
      </Row>
    </Section>
  );
}
