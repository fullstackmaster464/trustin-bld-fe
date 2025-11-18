import PropTypes from "prop-types";
import { Form } from "antd";

export const InputText = (props: any) => {
  const {
    label,
    fieldname,
    onChange,
    className,
    children,
    rules
  } = props;
  return (
    <>
      <Form.Item
        {...props}
        name={fieldname ? fieldname : ""}
        label={label}
        onChange={onChange ? onChange : null}
        className={` ${className}`}
        rules={rules}
      >{children}</Form.Item>
    </>
  );
};
InputText.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
  fieldname: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  emptyMessage: PropTypes.string,
  isRequired: PropTypes.bool,
  children:PropTypes.any,
  rules:PropTypes.any
};
