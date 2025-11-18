import { Form, Image } from "antd";
import Mobile from "../../assets/img/Mobile.svg";
import Down from "../../assets/img/Down.svg";

const prefixSelector = (props: object|any):any => {
  const { callingCode } = props;
  return (
    <>
    <Form.Item name="phonecode" noStyle className="codesec">
      <span className="mobile p-1">
        <Image preview={false} src={Mobile} alt="country" />
        {callingCode ? (
          callingCode
        ) : (
          <span style={{color:"#929292",cursor:"not-allowed"}}>
           {callingCode? callingCode : ''}
            <Image preview={false} src={Down} className="p-0" />
          </span>
        )}
      </span>
    </Form.Item>
  </>
  );
};

export default prefixSelector;
