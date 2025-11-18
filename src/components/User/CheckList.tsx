import {
  Checkbox,
  Col,
  Image,
  Row,
} from "antd";
import Success from "../../assets/img/success.svg";
import OrangeEye from "../../assets/img/OrangeEye.svg";
const CheckList = () => {
  return (
    <div className="scroll">
      <div className="subText_small my-3">Valid Document Verification</div>
      <Row className="my-3">
        <Col span={3} className="success">
          <Image src={Success} alt="company" preview={false} className="px-1" />
          Verified
        </Col>
        <Col span={6} className="subText_xs">
          <Checkbox>
            <div className="subText_xs mx-1">Comments by Approver</div>
          </Checkbox>
        </Col>
        <Col span={6} className="subText_xs">
          <Checkbox>
            <div className="subText_xs mx-1">Comments by Approver</div>
          </Checkbox>
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

      <div className="subText_small my-3">Name & ID Verification</div>
      <Row className="my-3">
        <Col span={3} className="success">
          <Image src={Success} alt="company" preview={false} className="px-1" />
          Verified
        </Col>
        <Col span={6} className="subText_xs">
          <Checkbox>
            <div className="subText_xs mx-1">Comments by Approver</div>
          </Checkbox>
        </Col>
        <Col span={6} className="subText_xs">
          <Checkbox>
            <div className="subText_xs mx-1">Comments by Approver</div>
          </Checkbox>
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

      <div className="subText_small my-3">AML screening</div>
      <Row className="my-3">
        <Col span={3} className="success">
          <Image src={Success} alt="company" preview={false} className="px-1" />
          Verified
        </Col>
        <Col span={6} className="subText_xs">
          <Checkbox>
            <div className="subText_xs mx-1">Comments by Approver</div>
          </Checkbox>
        </Col>
        <Col span={6} className="subText_xs">
          <Checkbox>
            <div className="subText_xs mx-1">Comments by Approver</div>
          </Checkbox>
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

      <div className="subText_small my-3">Adverse Media</div>
      <Row className="my-3">
        <Col span={3} className="success">
          <Image src={Success} alt="company" preview={false} className="px-1" />
          Verified
        </Col>
        <Col span={6} className="subText_xs">
          <Checkbox>
            <div className="subText_xs mx-1">Comments by Approver</div>
          </Checkbox>
        </Col>
        <Col span={6} className="subText_xs">
          <Checkbox>
            <div className="subText_xs mx-1">Comments by Approver</div>
          </Checkbox>
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
export default CheckList;
