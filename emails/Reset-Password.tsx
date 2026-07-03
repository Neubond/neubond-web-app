import {
  Body,
  Container,
  Html,
  Img,
  Button,
  Preview,
} from "react-email";

import Footer from "./components/Footer";
import Logo from "./components/Logo";

export default function ResetPassword() {
  return (
    <Html>
      <Body
        style={{
          margin: 0,
          padding: 0,
          fontFamily:
            "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
          lineHeight: "1.5",
          fontSize: "17px",
        }}
      >
        <Preview>Reset your password and get back into your account</Preview>
        <Container
          align="center"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: 10,
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <Logo width="500px" />
          <Img
            src="https://app.neubond.co.uk/email/Lock-Image_Compressed.jpg"
            width="140px"
            alt="Lock Image"
            style={{
              margin: "0 auto",
            }}
          />

          <h1 style={{ fontSize: "40px", textAlign: "center" }}>
            Password Reset
          </h1>
          <h4 style={{ padding: 10 }}>
            After you click the button, you'll be asked to complete the
            following steps:
          </h4>
          <ol style={{ display: "inline-block" }}>
            <li>Enter a new Password</li>
            <li>Confirm your new passowrd</li>
            <li>Click Submit</li>
          </ol>

          <Button
            href=""
            style={{
              display: "block",
              margin: "50px auto",
              width: "80%",
              padding: 12,
              fontWeight: 600,
              fontSize: 28,
              borderRadius: 6,
              textAlign: "center",
              backgroundColor: "#8A65BA",
              color: "rgb(255,255,255)",
            }}
          >
            RESET YOUR PASSWORD
          </Button>
          <h3 style={{ textAlign: "center" }}>
            This link is valid for one use only. Expires in 2 hours.
          </h3>
          <p style={{ textAlign: "center" }}>
            If you didn’t request a password reset, you can safely ignore this
            email, your account will remain unchanged.
          </p>
          <Footer />
        </Container>
      </Body>
    </Html>
  );
}
