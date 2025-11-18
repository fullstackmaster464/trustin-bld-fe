import "../auth/auth.scss";

import { AuthTitle, SmallText } from "../ui-elements/TextRepo";
import { Image } from "antd";

import { Link,useLocation } from "react-router-dom";
import linksent from "../../assets/img/link_sent.svg";
import trustin from "../../assets/img/trustin_trade.svg";
import { Login } from "../Common/RouteConst";
import { grayDark, grayMedium } from "../Common/ColorConstants";

const LinkSent = () => {
  const location=useLocation()
  return (
    <div className="bg-gray">
    <div className="link-sent vertical-center p-5">
      <div className="images-container">
        <Image
          src={trustin}
          alt="Logo"
          className="logo-image"
          preview={false}
          style={{ paddingTop: "24px" }}
        />
        <div>
          <Image
            src={linksent}
            alt="Link Sent"
            className="link-sent-image"
            preview={false}
            style={{ marginTop: "32px" }}
          />
        </div>
      </div>
      <AuthTitle
        children="Link sent"
        className="custom-text mt-5"
        style={{
          fontSize: "32px",
          fontWeight: "700px",
        }}
      />
      <SmallText
        className="main-text"
        style={{
          fontSize: "24px",
          fontWeight: "400px",
          color: grayMedium,
        }}
      >
        Link has been shared on
        <span style={{ color: grayDark }}> {location.state}.</span>
        <br />
        <div className="">
          To activate your account, please click on the activate button.
        </div>
      </SmallText>
      <Link to={Login} className="button-style bold">
        Go to Login page
      </Link>
      <SmallText
        className="copyright-text"
        children={`©copyrights ${new Date().getFullYear()}. All rights reserved`}
        style={{
          fontSize: "16px",
          marginTop: "120px",
          color: grayMedium,
        }}
      ></SmallText>
    </div>
    </div>
  );
};

export default LinkSent;
