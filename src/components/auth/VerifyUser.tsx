import { Button, Col, Image, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { Login } from "../Common/RouteConst";
import { useEffect, useState } from "react";
import LeftSideStructure from "./leftStructure/LeftSideStructure";
import verifyUserImage from "../../assets/img/verified.png";

const VerifyUser = () => {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState<boolean>(false);
  const [, setHeight] = useState(document?.body?.clientHeight)
  const [Width, setWidth] = useState(document?.body?.clientWidth)

  const setHeightVal = () => {
    setHeight(document?.body?.clientHeight)
    setWidth(document.body.clientWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", () => {
      setHeightVal();
    });
    return () => window.removeEventListener("resize", setHeightVal);
  }, []);

  const VerifyIdentity = async() => {
    navigate(Login);
  }

  return (
    <div>
      <Row gutter={0} className={Width < 992 ? "t-login login side-div justify-content-center overflowScroll" :'t-login login side-div justify-content-center'}>
        <Col span={12} className="vh-100 side-sec">
          <LeftSideStructure width={Width} page={"userVerify"} />
        </Col>
        <Col span={Width > 991 ? 12 : 24} className={Width > 991 ? "d-table" : 'mx-3'}>
          <div className="min-side-div mb-5">
            <LeftSideStructure width={Width} page={"userVerify"} />
          </div>
          <div className="card bg-white logincard verify-white-box">
            <div>
              <Image
                preview={false}
                src={verifyUserImage}
                className="img-fluid"
                alt="Image"
              />

              <h6>User verified</h6>
              <h3>Welcome aboard!</h3>

              <p>Congratulations!<br />
                Your registration is complete and you are verified.
                Please complete your eKYC/eKYB verification.</p>
            </div>
            <div>
              <Button
                children="Log In"
                className="rounded w-100"
                onClick={() => { VerifyIdentity() }}
                htmlType="submit"
                // loading={loading}
              ></Button>
            </div>
          </div>
        </Col>
      </Row>

    </div>
  );
};

export default VerifyUser;
