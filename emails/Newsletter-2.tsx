import { Body, Container, Head, Html, Preview } from "react-email";

import TopBar from "./components/TopBar";
import Logo from "./components/Logo";
import Hero from "./components/Hero";
import VisionSection from "./components/Section-1";
import WorkingOnSection from "./components/Section-2";
import LookingAheadSection from "./components/Section-4";
import SectionImage from "./components/Section-2-Image";
import SocialBlock from "./components/SocialBlock";
import Disclaimer from "./components/Disclaimer";
import Footer from "./components/Footer";
import WhatIsNextSection from "./components/Section-3";
import Section1 from "./components/Section-1";
import Section2 from "./components/Section-2";
import Section3 from "./components/Section-3";
import Section2Image from "./components/Section-2-Image";
import Section3Image from "./components/Section-3-Image";

export default function Newsletter() {
  return (
    <Html>
      <Head></Head>
      <Preview>
        Discover how Loop I is transforming stroke rehabilitation
      </Preview>
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
        <Container
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: 0,
            backgroundColor: "#fff",
          }}
        >
          <TopBar />
          <Logo width="337px" />
          <Hero />
          <Section1 />
          <Section2Image
            src="https://app.neubond.co.uk/email/Newsletter-2/Sarah+Giovanni_edited.jpg"
            alt="User testing our Neubond device"
          />
          <Section2 />
          <Section3Image
            src="https://app.neubond.co.uk/email/Newsletter-2/RnD_edited.jpg"
            alt="User testing our Neubond device"
          />
          <Section3 />
          <LookingAheadSection />
          <SocialBlock />
          <Footer />
          <Disclaimer />
        </Container>
      </Body>
    </Html>
  );
}
