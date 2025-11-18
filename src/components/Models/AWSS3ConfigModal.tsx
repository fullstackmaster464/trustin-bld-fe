import React from 'react';
import { Modal, Button, Form, Row, Col, Input, Image } from 'antd';
import UserFull from "../../assets/img/User_Full.svg";
import { InputText } from '../ui-elements/InputsRepo';

interface AWSS3ConfigModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<any>;
}

const AWSS3ConfigModal: React.FC<AWSS3ConfigModalProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleFormSubmit = async (values: any) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={<p className="large-title">Add AWS S3 Configuration</p>}
      className="modal-box"
      open={visible}
      footer={null}
      closable={false}
      onCancel={onCancel}
    >
      <hr className="break-line" />
      <Form form={form} onFinish={handleFormSubmit}>
        <Row gutter={16} className="mt-3">
          <Col span={24}>
            <p className="enter-text">Contract id</p>
            <InputText
              fieldname="trustinContractId"
              className="inputField mb-4"
              rules={[
                {
                  required: true,
                  message: "Contract id is required!",
                },
                {
                  whitespace: false,
                  message: "Enter valid contract id!",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="Contract id"
                prefix={
                  <Image
                    src={UserFull}
                    preview={false}
                    alt="name"
                    className="pe-3"
                  />
                }
                maxLength={50}
                onChange={() => { }}
              />
            </InputText>
          </Col>
        </Row>
        <Row gutter={16} className="mt-3">
          <Col span={24}>
            <p className="enter-text-category">User id</p>
            <InputText
              fieldname="strydeUserId"
              className="inputField mb-4 add-user-form-field"
              rules={[
                {
                  required: true,
                  message: "User is required!",
                },
                {
                  whitespace: false,
                  message: "Enter valid User id!",
                },
              ]}
            >
              <Input
                type="text"
                placeholder="User id"
                prefix={
                  <Image
                    src={UserFull}
                    preview={false}
                    alt="name"
                    className="pe-3"
                  />
                }
                onChange={() => { }}
                // value={}
                maxLength={50}
              />
            </InputText>
          </Col>
        </Row>

        <div className={'d-flex w-100 mt-5 mb-3 justify-content-center'}>
          <Button
            className="modal-button"
            htmlType="submit"
          >
            Submit
          </Button>
          <Button
            className="modal-button-cancel ml-3"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AWSS3ConfigModal;
