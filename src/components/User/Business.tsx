import Success from "../../assets/img/success.svg";
import User from "../../assets/img/User.svg";
import Clock from "../../assets/img/Clock.svg";
import OrangeEye from "../../assets/img/OrangeEye.svg";
import { Col, Image, Row } from "antd";

const Business = () => {
  return (
    <div>
      <div className="subText_small my-4">Business Registration Proof</div>
      <Row className="my-4">
        <Col span={3} className="success">
          <Image src={Success} alt="company" preview={false} className="px-1" />
          Verified
        </Col>
        <Col span={5} className="subText_xs">
          <Image src={User} alt="company" preview={false} className="px-2" />
          Neha Approver
        </Col>
        <Col span={6} className="subText_xs">
          <Image src={Clock} alt="company" preview={false} className="px-2" />
          31 July 2023 11:38AM
        </Col>
        <Col span={5} className="subText_xs">
          Reason: Valid
        </Col>
        <Col span={4} className="subText_xs">
          <Image
            src={OrangeEye}
            alt="company"
            preview={false}
            className="px-2"
          />
        </Col>
      </Row>
      <Row className="my-4">
        <Col span={3} className="success">
          <Image src={Success} alt="company" preview={false} className="px-1" />
          Verified
        </Col>
        <Col span={5} className="subText_xs">
          <Image src={User} alt="company" preview={false} className="px-2" />
          Neha Approver
        </Col>
        <Col span={6} className="subText_xs">
          <Image src={Clock} alt="company" preview={false} className="px-2" />
          31 July 2023 11:38AM
        </Col>
        <Col span={5} className="subText_xs">
          Reason: Valid
        </Col>
        <Col span={4} className="subText_xs">
          <Image
            src={OrangeEye}
            alt="company"
            preview={false}
            className="px-2"
          />
        </Col>
      </Row>
      <hr className="grayHr" />
      <div className="subText_small my-4">Operating Address Proof</div>
      <Row className="my-4">
        <Col span={3} className="success">
          <Image src={Success} alt="company" preview={false} className="px-1" />
          Verified
        </Col>
        <Col span={5} className="subText_xs">
          <Image src={User} alt="company" preview={false} className="px-2" />
          Neha Approver
        </Col>
        <Col span={6} className="subText_xs">
          <Image src={Clock} alt="company" preview={false} className="px-2" />
          31 July 2023 11:38AM
        </Col>
        <Col span={5} className="subText_xs">
          Reason: Valid
        </Col>
        <Col span={4} className="subText_xs">
          <Image
            src={OrangeEye}
            alt="company"
            preview={false}
            className="px-2"
          />
        </Col>
      </Row>
      <Row className="my-4">
        <Col span={3} className="success">
          <Image src={Success} alt="company" preview={false} className="px-1" />
          Verified
        </Col>
        <Col span={5} className="subText_xs">
          <Image src={User} alt="company" preview={false} className="px-2" />
          Neha Approver
        </Col>
        <Col span={6} className="subText_xs">
          <Image src={Clock} alt="company" preview={false} className="px-2" />
          31 July 2023 11:38AM
        </Col>
        <Col span={5} className="subText_xs">
          Reason: Valid
        </Col>
        <Col span={4} className="subText_xs">
          <Image
            src={OrangeEye}
            alt="company"
            preview={false}
            className="px-2"
          />
        </Col>
      </Row>
    </div>
  );
};
export default Business;
