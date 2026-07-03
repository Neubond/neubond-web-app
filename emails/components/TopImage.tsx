import { Img } from "react-email";

export default function TopImage() {
  return (
    <Img
      src="https://app.neubond.co.uk/email/Marketing-Test-User_cropped_v2_compressed.jpg"
      alt="User testing our neubond device"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        borderRadius: "8px",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
      }}
    />
  );
}
