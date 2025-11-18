import { Modal, Form, Select, Button, Input } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {  getManagementUserList, } from '../../services/admin';


interface i_formValues{
  enrollBy: string,
  comment?: string
}
const ModalCreateEscrowAccount = ({
  open,
  onCancel,
  onSubmit,
  frmEscrow,
  loading,
  validCurrencyList
}: any) => {
  const [loder, setLoader] = useState(false);
  const [userList, setUserList] = useState([]);
  const [formValues, setFormValues] = useState<i_formValues>({} as i_formValues);

  const getManagementUsers = () => {
    setLoader(true);
    getManagementUserList().then((result) => {
      setLoader(false);
      if (result?.status === 200) {
        setUserList(result?.data);
      }
    }).catch(() => {
      setLoader(false);
    });
  }
  const options = useMemo(() => {
    if (userList && userList?.length > 0) {
      return userList.map((user:any) => (
        <Select.Option key={user.userAlias} value={user.name}>
          {user.name}
        </Select.Option>
      ));
    }
  }, [userList]);

  useEffect(() => {
    getManagementUsers();
  }, []);

  const handleFinish = (values: any) => {
    onSubmit(values);
    frmEscrow.resetFields();
  };  

  const handleChange = (fieldName: any, value: any) => {
    setFormValues({ ...formValues, [fieldName]: value });
  }

  return (
    <Modal
      open={open}
      footer={null}
      className="classification-modal"
      title={
        <span className="change-client-classification ml-4">
          Create Instant Escrow Account
          <hr className="lightgrayHr" />
        </span>
      }
      centered
      onCancel={onCancel}
    >
      <div className="stepDetails fw-400 mx-3 py-2">
        Select officer
      </div>
      <Form
        form={frmEscrow}
        scrollToFirstError
        layout="vertical"
        name="form_in_modal"
        className="py-2"
        onFinish={handleFinish}
      >
        <Form.Item
          className="mb-4"
          name="enrollBy"
          rules={[
            {
              required: true,
              message: 'Select enroll!',
            },
          ]}
        >
          <Select
            className="selct-frmEscrow-field"
            placeholder="Officer"
            showSearch
            allowClear
            optionFilterProp="children"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) =>handleChange("enrollBy",value)}
          >
            {options}
          </Select>
        </Form.Item>
        <Form.Item
          className="mb-4"
          name="comment"
        >
          <Input
            type="text"
            placeholder="Enter the comment"
            maxLength={50}
            onChange={(e) => handleChange('comment', e.target.value)}
            value={formValues.comment}
            style={{background:'unset'}}
          />
        </Form.Item>
        <Form.Item
          className="mb-4"
          name="currency"
          rules={[
            {
              required: true,
              message: 'Select currency!',
            },
          ]}
        >
          <Select
            className="selct-frmEscrow-field"
            placeholder="Currency"
            showSearch
            allowClear
            optionFilterProp="children"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
            onChange={(value) => handleChange("currency", value)}
          >
            {validCurrencyList && validCurrencyList.map((currency: string, index: number)=> {
              return (
              <Select.Option key={index} value={currency}>{currency}</Select.Option>
            )})}
            {validCurrencyList && validCurrencyList?.length > 1 &&
              <Select.Option value="BOTH">Both</Select.Option>
            }
          </Select>
        </Form.Item>
        <div className="">
          <Button
            type="primary"
            htmlType="submit"
            className="modal-button mt-5"
            loading={loading || loder}
          >
            Submit
          </Button>
          <Button
            type="default"
            className="modal-button-cancel mt-5 mx-2"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateEscrowAccount;
