import React from "react";
import { Form, Radio, Tooltip } from "antd";
import infoIcon from "../../assets/img/informIcon.svg";

interface OnboardPartySectionProps {
  width: number;
  userExists: boolean;
  // form: any;
  fieldName: string;
  onChange: (value: "YES" | "NO") => void;
}

const OnboardPartySection: React.FC<OnboardPartySectionProps> = ({
  width,
  userExists,
  // form,
  fieldName,
  onChange,
}) => {
  return (
    <>
      <div>
        <span className="stepDetails fw-400 mb-2 mt-3 textOverflow">
          Do you want to onboard this party?
        </span>
        <Tooltip
          title={
            <span className="response-tooltip">
              Choose whether the counter party is onboarded or not.
            </span>
          }
          overlayClassName="custom-tooltip info-icon"
          placement={width > 475 ? "right" : "top"}
        >
          <img src={infoIcon} alt="info" className="ms-1" />
        </Tooltip>
      </div>

      <Form.Item
        className="mb-3 radioInput"
        name={fieldName}
        initialValue="NO"
        rules={[{ required: true, message: "Please select an option" }]}
      >
        <Radio.Group
          disabled={userExists}
          onChange={(event) => onChange(event.target.value)}
        >
          <Radio value="YES">Yes</Radio>
          <Radio value="NO">No</Radio>
        </Radio.Group>
      </Form.Item>
    </>
  );
};

export default OnboardPartySection;
