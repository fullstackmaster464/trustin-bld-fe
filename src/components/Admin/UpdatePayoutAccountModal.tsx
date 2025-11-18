import { Modal, Form, Input, Button, Select,  } from "antd";
import { useState, useEffect } from "react";
import { Option } from "antd/lib/mentions";
import { Popover } from "antd/lib";
import { AuthTitle } from "../ui-elements/TextRepo";

interface UpdatePayoutAccountModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (accountData: any) => void;
  payoutAccount?: any;
  bankAccountList?: any;
  loading: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function UpdatePayoutAccountModal({
  visible,
  onCancel,
  onUpdate,
  payoutAccount,
  bankAccountList,
  loading,
}: UpdatePayoutAccountModalProps) {
  const [form] = Form.useForm();
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [Width, setWidth] = useState(document?.body?.clientWidth);

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });

    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  useEffect(() => {
    if (payoutAccount && !selectedAccount) {
      setSelectedAccount(payoutAccount);
      form.setFieldsValue({
        payout_account: bankAccountList.length > 0 ? payoutAccount?.bankAlias : `${payoutAccount?.number} - (${payoutAccount?.institutionName})`,
        payoutAccountName: payoutAccount?.name,
        payoutAccountNumber: payoutAccount?.number,
        payoutAccountCurrency: payoutAccount?.currency ?? payoutAccount?.accountCurrency ?? "",
        payoutAccountInstitutionType: payoutAccount?.institutionType,
        payoutAccountCountry: payoutAccount?.country,
        payoutAccountCity: payoutAccount?.city,
        payoutAccountInstitutionName: payoutAccount?.institutionName,
        payoutAccountRoutingCode: payoutAccount?.routingCode,
        payoutAccountRoutingScheme: payoutAccount?.routingScheme,
      });
    }
  }, [payoutAccount, form]);

  const onPayoutAccountChange = (value: string) => {
    const account = bankAccountList?.find(
      (item: any) => item.aliasName === value
    );
    setSelectedAccount(account);
    console.log('selectedAccount', account)

    form.setFieldsValue({
      payoutAccountName: account?.name ?? "--",
      payoutAccountNumber: account?.number ?? "--",
      payoutAccountCurrency: account?.accountCurrency ?? "--",
      payoutAccountInstitutionType: account?.institutionType ?? "--",
      payoutAccountCountry: account?.country ?? "--",
      payoutAccountCity: account?.city ?? "--",
      payoutAccountInstitutionName: account?.institutionName ?? "--",
      payoutAccountRoutingCode: account?.routingCode ?? "--",
      payoutAccountRoutingScheme: account?.routingScheme ?? "--",
    });
  };

  const handleUpdate = () => {
    if (selectedAccount?.aliasName === payoutAccount?.aliasName) {
      onCancel();
      return;
    }
    
    form.validateFields().then(() => {
      onUpdate(selectedAccount);
      onCancel();
    });
  };

  return (
    <Modal
      className="modal-box"
      centered
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={false}
      closable={true}
      style={{
        marginTop: "4rem",
        marginBottom: "4rem"
      }}
    >
      <AuthTitle
        children="Update Payout Account"
        className="modals mt-4 pb-1"
      />

      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <div className="endtoend bank" style={{ gap: "1rem" }}>
          <Form.Item
            name="payout_account"
            className="inputField w-100 error-msg mb-0"
            label="Select Payout Account"
            rules={[
              {
                required: true,
                message: "Payout Account is required!",
              },
            ]}
          >
            <Select
              placeholder="Select Payout Account"
              onChange={onPayoutAccountChange}
              className="w-75 h-100 pt-1"
              optionFilterProp="children"
            >
              {bankAccountList?.length > 0 &&
                bankAccountList?.map((value: any, index: any) => (
                  <Option key={index} value={value.aliasName}>
                    <Popover
                      content={`${value.number} - (${value.institutionName})`}
                      placement="leftTop"
                    >
                      {value.number} - ({value.institutionName})
                    </Popover>
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </div>

        {selectedAccount && bankAccountList.length > 0 && (
          <>
            <div className="endtoend bank" style={{ gap: "1rem" }}>
              <div style={{ width: '100%' }}>
                <Form.Item className="inputField w-100" name="payoutAccountName" label="Name">
                  <Input readOnly />
                </Form.Item>
              </div>
              <div style={{ width: '100%' }}>
                <Form.Item className="inputField w-100" name="payoutAccountNumber" label="Number">
                  <Input readOnly />
                </Form.Item>
              </div>
            </div>

            <div className="endtoend bank" style={{ gap: "1rem" }}>
              <div style={{ width: '100%' }}>
                <Form.Item className="inputField w-100" name="payoutAccountCurrency" label="Currency">
                  <Input readOnly />
                </Form.Item>
              </div>
              <div style={{ width: '100%' }}>
                <Form.Item className="inputField w-100" name="payoutAccountInstitutionType" label="Institution Type">
                  <Input readOnly />
                </Form.Item>
              </div>
            </div>

            <div className="endtoend bank" style={{ gap: "1rem" }}>
              <div style={{ width: '100%' }}>
                <Form.Item className="inputField w-100" name="payoutAccountCountry" label="Country">
                  <Input readOnly />
                </Form.Item>
              </div>
              <div style={{ width: '100%' }}>
                <Form.Item className="inputField w-100" name="payoutAccountCity" label="City">
                  <Input readOnly />
                </Form.Item>
              </div>
            </div>

            <div className="endtoend bank" style={{ gap: "1rem" }}>
              <Form.Item className="inputField w-100" name="payoutAccountInstitutionName" label="Bank Name">
                <Input readOnly />
              </Form.Item>
            </div>

            <div className="endtoend bank" style={{ gap: "1rem" }}>
              <div style={{ width: '100%' }}>
                <Form.Item className="inputField w-100" name="payoutAccountRoutingCode" label="Routing Code">
                  <Input readOnly />
                </Form.Item>
              </div>
              <div style={{ width: '100%' }}>
                <Form.Item className="inputField w-100" name="payoutAccountRoutingScheme" label="Routing Scheme">
                  <Input readOnly />
                </Form.Item>
              </div>
            </div>


            <div
              className={
                Width > 470
                  ? "d-flex gap-3 mt-2"
                  : "d-flex gap-3 mt-2 justify-content-center align-items-center"
              }
            >
              <Button
                key="submit"
                type="primary"
                htmlType="submit"
                className="modal-button w-auto"
                loading={loading}
              >
                Submit
              </Button>
              <Button
                key="cancel"
                type="primary"
                onClick={onCancel}
                className="modal-button-cancel w-auto"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </Form>
    </Modal>
  );
}
