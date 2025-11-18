import { Modal, Form, Select, Button, Input } from "antd";
import { useEffect, useState } from "react";
import { getUserPlatformFees } from "../../services/admin";

const PlatformFeesModal = ({ id, userAlias, createdBy, updatedBy, initialValues, onSubmit, onCancel,hideBtnCreatePlatformFee}: any) => {
  const [form] = Form.useForm();
  const [isExisting, setIsExisting] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const fetchPlatformFees = async () => {
      try {
        setIsLoading(true);
        const res = await getUserPlatformFees(userAlias, initialValues.transactionType);
        const existingFees = res?.data;
        if (existingFees) {
          setIsExisting(true);
          form.setFieldsValue({
            id: existingFees.id,
            transactionType: existingFees.transactionType,
            platformChargeType: existingFees.platformChargeType,
            platformFees: existingFees.platformFees,
            status:existingFees.status  
          });
        } else if (initialValues) {
          setIsExisting(false); 
          form.setFieldsValue({
            transactionType: initialValues.transactionType,
            platformChargeType: initialValues.platformChargeType,
            platformFees: initialValues.platformFees,
            status:initialValues.status
          });
        }
        setIsLoading(false);
      } catch (err) {
        if (initialValues) {
          setIsExisting(false); 
          form.setFieldsValue({
            transactionType: initialValues.transactionType,
            platformChargeType: initialValues.platformChargeType,
            platformFees: initialValues.platformFees,
          });
        }
        setIsLoading(false);
        console.error("Error fetching platform fees:", err);
      }
    };

    if (userAlias) {
      fetchPlatformFees();
    }
  }, [userAlias, initialValues, form]);


const handleOk = async () => {
  try {
    const values = await form.validateFields();
    const isUpdate = Boolean(id);
    const payload: any = {
      id: isUpdate ? id : undefined,
      userAlias,
      transactionType: values.transactionType,
      platformChargeType: values.platformChargeType,
      platformFees: values.platformFees,
      status: isUpdate ? values?.status : "active",
      ...(isUpdate ? { updatedBy } : { createdBy }),
    };

    await onSubmit(payload); // ensure it's awaited
    onCancel(); // close the modal after successful submit
  } catch (error) {
    console.error("Error in handleOk:", error);
  }
};

  return (
    <Modal
      title={
        !isLoading && (
          <span className="change-client-classification">
            {isExisting ? "Update" : "Create"} Platform Fees
            <hr className="lightgrayHr" />
          </span>
        )
      }
      open={true}
      footer={false}
      onCancel={onCancel}
      width={450}
      className="classification-modal"
      centered
    >
      {!isLoading && (
      <Form form={form}>
        <div className="stepDetails fw-400">
            Transaction Type
        </div>
        <Form.Item
          name="transactionType"
          rules={[{ required: true, message: "Please select transaction type" }]}
          className="partial-inputField"
        >
          <Select placeholder="Select Transaction Type" allowClear 
          disabled={hideBtnCreatePlatformFee }
          >
            <Select.Option value="ESCROW">Escrow</Select.Option>
            <Select.Option value="MC">Manager Cheque</Select.Option>
          </Select>
        </Form.Item>

        <div className="stepDetails fw-400">
            Type
        </div>
        <Form.Item
          name="platformChargeType"
          rules={[{ required: true, message: "Please select charge type" }]}
          className="partial-inputField"
        >
          <Select placeholder="Select Charge Type" allowClear>
            <Select.Option value="PERCENT">Percentage</Select.Option>
            <Select.Option value="FIXED">Fixed</Select.Option>
          </Select>
        </Form.Item>

        <div className="stepDetails fw-400">
            Charges
        </div>
        <Form.Item
          name="platformFees"
          className="partial-inputField error-input"
          rules={[
            { required: true, message: "Please enter charges" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const chargeType = getFieldValue("platformChargeType");

                if (chargeType === "PERCENT") {
                  if (value < 0 || value > 100) {
                    return Promise.reject("Percentage must be between 0 and 100");
                  }
                }

                if (chargeType === "FIXED") {
                  if (value < 0) {
                    return Promise.reject("Fixed charge must be a positive number");
                  }
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            type="number"
            placeholder="Enter the platform fees"
            style={{ background: "unset" }}
          />
        </Form.Item>
          <div className="stepDetails fw-400">
            Status
        </div>
        <Form.Item
          name="status"
          rules={[{ required: true, message: "Please select status" }]}
          className="partial-inputField"
        >
          <Select placeholder="Select status" allowClear>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="suspended">In-active</Select.Option>
          </Select>
        </Form.Item>
        <div className="d-flex gap-2 pt-3">
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleOk}
            className="modal-button"
          >
            {isExisting ? "Update" : "Save"}
          </Button>
          <Button
            type="default"
            className="modal-button-cancel"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
      )}
      {isLoading && <div className="text-center p-5">Loading...</div>}
    </Modal>
  );
};

export default PlatformFeesModal;
