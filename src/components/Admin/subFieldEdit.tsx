import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  message,
} from "antd";
import { inputType } from "../Common/Constants";
import { Option } from "antd/lib/mentions";
import ConfirmationIcon from "../../assets/img/Successpopupicon.svg";
import { updateDynamicField } from "../../services/admin";
import { useEffect, useState } from "react";

const SubFieldEdit = (props:any) => {
    const {validationList, isEdit, userAlias, subField} = props
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth)
  const handleCancel = () => {
    setIsModalVisible(false);
    
  };
  const handleOk = () => {
    setIsModalVisible(false);
    form.resetFields();
    isEdit()
  };
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  useEffect(()=>{
    form.setFieldsValue({
        name: subField?.data.name,
        isMandatory: subField?.data.isMandatory,
        placeholder: subField?.data.placeholder,
        inputType:subField?.data?.inputFieldType,
        regexAlias:subField?.data?.regexAlias,
      })
      window.addEventListener('resize', ()=>{
        setWidthVal()
      });
      return () => window.removeEventListener('resize', setWidthVal);
  },[])
  const onFinish = (values: object) => {
    let requestBody = {
      ...values,
      updatedBy: userAlias,
      aliasName: subField?.aliasName,
    };
    updateDynamicField(requestBody)
      .then(() => {
        setIsModalVisible(true);
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
  };
  return (
    <div>
      <Card className="p-5">
        <Form form={form} scrollToFirstError onFinish={onFinish}>
          <div>
            <Row gutter={12}>
              <Col span={Width > 991 ?7 :24}>
                <p className="field-text-heading">Field name</p>
                <Form.Item
                  className="inputField w-100 error-input"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Field name is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter field name"></Input>
                </Form.Item>
              </Col>
              <Col span={Width > 991 ?7 :24} offset={Width > 991 ? 1 : ""}>
                <p className="field-text-heading">Input type</p>
                <Form.Item
                  className="modal_inputField select"
                  name="inputType"
                  rules={[
                    {
                      required: true,
                      message: "Input type is required!",
                    },
                  ]}
                >
                  <Select className="field-type" placeholder="Input type">
                    {inputType.map((item:any) => (
                      <Option value={item.value}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={Width > 991 ?7 :24} offset={Width > 991 ? 1 : ""}>
                <p className="field-text-heading">Placeholder</p>
                <Form.Item
                  className="inputField error-input w-100"
                  name="placeholder"
                  rules={[
                    {
                      required: true,
                      message: "Placeholder is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter placeholder value"></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={Width > 991 ?7 :24}>
                <p className="field-text-heading">Validations</p>
                <Form.Item
                  className="modal_inputField select"
                  name="regexAlias"
                >
                  <Select className="field-type" placeholder="Validation">
                    {validationList.map((item:any) => (
                      <Option value={item.aliasName}>{item.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={Width > 991 ?7 :24} offset={Width > 991 ? 1 : ""}>
                <p className="field-text-heading">Is mandatory</p>
                <Form.Item
                  name="isMandatory"
                  className="bgTransparent"
                  rules={[
                    {
                      required: true,
                      message: "This field is required!",
                    },
                  ]}
                >
                  <Radio.Group name="radiogroup">
                    <Radio value={true} className="custom-radio">
                      Yes
                    </Radio>
                    <Radio value={false} className="custom-radio">
                      No
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <div className={Width > 991 ?"d-flex my-4" :"d-flex my-4 w-100 justify-content-center"}>
                <Button
                  className="modal-button mx-1 me-3"
                  htmlType="submit"
                  key="submit"
                >
                  Save
                </Button>
                <Button
                  className="modal-button-cancel"
                  onClick={() => {
                    form.resetFields();
                    isEdit()
                  }}
                >
                  Cancel
                </Button>
              </div>
              <Modal
                open={isModalVisible}
                onCancel={handleCancel}
                closable={false}
                footer={null}
                className="modal-box success"
              >
                <div className="text-center">
                  <Image
                    src={ConfirmationIcon}
                    preview={false}
                    className="mt-4"
                  ></Image>
                  <p className="titleText mt-5 mb-3">
                    Your field updated successfully!!
                  </p>
                  <Button
                    className="rounded_blue_outline btn-OK"
                    onClick={handleOk}
                  >
                    Ok
                  </Button>
                </div>
                <hr className="" />
              </Modal>
            </Row>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SubFieldEdit;
