import { Col, Form, Input, Row, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Option } from "antd/lib/mentions";
import { SecondaryOutLineButton } from "../../ui-elements/ButtonRepo";

interface PayoutAccountProps {
  payoutAccount?: any;
  setPayoutAccount: any;
  form: any;
  setOpenAddBankAccountModal: (open: boolean) => void;
  bankAccountList?: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PayoutAccount({
  payoutAccount,
  setPayoutAccount,
  form,
  setOpenAddBankAccountModal,
  bankAccountList,
}: PayoutAccountProps) {
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

  const onPayoutAccountChange = (value: string) => {
    const account = bankAccountList?.find(
      (item: any) => item.aliasName === value
    );
    setPayoutAccount(account);
  };

  useEffect(() => {
  if (!payoutAccount) return;
  form.setFieldsValue({
    payout_account: payoutAccount.aliasName ?? "--",
    payoutAccountName: payoutAccount.name ?? "--",
    payoutAccountNumber: payoutAccount.number ?? "--",
    payoutAccountCurrency: payoutAccount.accountCurrency ?? "--",
    payoutAccountInstitutionType: payoutAccount.institutionType ?? "--",
    payoutAccountCountry: payoutAccount.country ?? "--",
    payoutAccountCity: payoutAccount.city ?? "--",
    payoutAccountInstitutionName: payoutAccount.institutionName ?? "--",
    payoutAccountRoutingCode: payoutAccount.routingCode ?? "--",
    payoutAccountRoutingScheme: payoutAccount.routingScheme ?? "--",
  });
}, [payoutAccount]);

  return (
    <>
      <Row gutter={[10, 10]} justify="space-between" align="middle">
        <Col className="mb-4">
          <div style={{ fontSize: "20px", fontWeight: "bold"}}>Payout Account</div>
        </Col>
        <Row justify="space-between" align="middle" gutter={[16, 8]}>
          <Col className="mb-4">
            {bankAccountList?.length < 3 && (
              <SecondaryOutLineButton
                children="Add More Bank Account"
                className="w-auto"
                onClick={() => {
                  setOpenAddBankAccountModal(true);
                }}
              />
            )}
          </Col>
          
          <Col>
            <Form.Item
                name="payout_account"
                className="inputField error-msg mb-4"
                rules={[
                  {
                    required: true,
                    message: "Payout Account is required!",
                  },
                ]}
                initialValue={undefined}
              >
                <Tooltip
                  title={
                    payoutAccount
                      ? `${payoutAccount.number} - (${payoutAccount.institutionName})`
                      : ""
                  }
                  placement="top"
                  overlayClassName="custom-tooltip signupTooltip"
                >
                  <Select
                    placeholder="Select Payout Account"
                    className="w-100 h-100 pt-0"
                    // onChange={onPayoutAccountChange}
                     onChange={(value) => {
                    if (value) {
                    onPayoutAccountChange(value);
                    } else {
                    setPayoutAccount(null);
                    }
                    }}
                   optionFilterProp="children"
                    allowClear
                    value={payoutAccount?.aliasName}
                  >
                    {bankAccountList?.length > 0 &&
                      bankAccountList?.map((value: any, index: any) => (
                        <Option key={index} value={value.aliasName}>
                          {value.number} - ({value.institutionName})
                        </Option>
                      ))}
                  </Select>
                </Tooltip>
              </Form.Item>
          </Col>
        </Row>
      </Row>

      {payoutAccount != null ? (
        <Row gutter={36} className="mt-2">
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Name
            </p>
            <Form.Item name="payoutAccountName" className="inputField w-100" initialValue={payoutAccount?.name ?? "--"}>
              <Input name="payoutAccountName" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Number
            </p>
            <Tooltip
              title={
                form.getFieldValue("payoutAccountNumber") !== "--"
                  ? form.getFieldValue("payoutAccountNumber")
                  : ""
              }
              placement="topRight"
              overlayClassName="custom-tooltip"
            >
              <Form.Item name="payoutAccountNumber" className="inputField w-100" initialValue={payoutAccount?.number ?? "--"}>
                <Input readOnly />
              </Form.Item>
            </Tooltip>
          </Col>
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Currency
            </p>
            <Form.Item
              name="payoutAccountCurrency"
              className="inputField w-100"
               initialValue={payoutAccount?.accountCurrency ?? "--"}
            >
              <Input name="payoutAccountCurrency" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Institution Type
            </p>
            <Form.Item
              name="payoutAccountInstitutionType"
              className="inputField w-100"
               initialValue={payoutAccount?.institutionType ?? "--"}
            >
              <Input name="payoutAccountInstitutionType" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Country
            </p>
            <Form.Item name="payoutAccountCountry" className="inputField w-100"  initialValue={payoutAccount?.country ?? "--"}>
              <Input name="payoutAccountCountry" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              City
            </p>
            <Form.Item name="payoutAccountCity" className="inputField w-100"  initialValue={payoutAccount?.city ?? "--"}>
              <Input name="payoutAccountCity" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Bank Name
            </p>
            <Tooltip
              title={
                form.getFieldValue("payoutAccountInstitutionName") !== "--"
                  ? form.getFieldValue("payoutAccountInstitutionName")
                  : ""
              }
              placement="topRight"
              overlayClassName="custom-tooltip"
            >
              <Form.Item
                name="payoutAccountInstitutionName"
                className="inputField w-100"
                initialValue={payoutAccount?.institutionName ?? "--"}
              >
                <Input readOnly />
              </Form.Item>
            </Tooltip>
          </Col>
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Routing Code
            </p>
            <Form.Item
              name="payoutAccountRoutingCode"
              className="inputField w-100"
               initialValue={payoutAccount?.routingCode ?? "--"}
            >
              <Input name="payoutAccountRoutingCode" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Routing Scheme
            </p>
            <Form.Item
              name="payoutAccountRoutingScheme"
              className="inputField w-100"
                initialValue={payoutAccount?.routingScheme ?? "--"}
            >
              <Input name="payoutAccountRoutingScheme" readOnly />
            </Form.Item>
          </Col>
        </Row>
      ) : null}
    </>
  );
}
