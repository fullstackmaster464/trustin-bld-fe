import { Col, Form, Input, message, Row, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Option } from "antd/lib/mentions";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import { MINIMUM_INVOICE_AMOUNT } from "../Common/Constants";
import infoIcon from "../../assets/img/informIcon.svg"

interface PayoutAccountProps {
  minimumValue : any;
  category : any;
  itemType: any;
  currency : string;
  formValues: any;
  setFormValues : any;
  payoutAccount?: any;
  setPayoutAccount: any;
  form: any;
  isDraft: any;
  setOpenAddBankAccountModal: (open: boolean) => void;
  bankAccountList?: any;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function MCBankAccount({
  minimumValue,
  category,
  itemType,
  currency,
  formValues,
  setFormValues,
  payoutAccount,
  setPayoutAccount,
  form,
  setOpenAddBankAccountModal,
  bankAccountList,
  isDraft
}: PayoutAccountProps) {
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [errorMsg, setErrorMsg] = useState(false);

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  const handleKeyDown = (e:any) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  const onPayoutAccountChange = (value: string) => {
    const account = bankAccountList?.find(
      (item: any) => item.aliasName === value
    );
    setPayoutAccount(account);
  };

   useEffect(() => {
    if (errorMsg == true)
      message.error("Oops! Something went wrong. Please try again laterww!");
  }, [errorMsg]);
              

  useEffect(() => {
    if (!payoutAccount) return;
    console.log("payoutAccount",payoutAccount);
    
    form.setFieldsValue({
      payoutAccountAlias: payoutAccount.aliasName ?? "--",
      bankName: payoutAccount.name ?? "--",
      IbanNumber: payoutAccount.number ?? "--",
      Institutiontype: payoutAccount.institutionType ?? "--",
      institutionName: payoutAccount.institutionName ?? "--",
      routingCode: payoutAccount.routingCode ?? "--",
      routingScheme: payoutAccount.routingScheme ?? "--",
    });
}, [payoutAccount]);

 const handleInvoiceAmount = (e: any) => {
    let value = e?.target?.value.trim();
    if (value.includes(".")) {
      const parts = value.split(".");
      if (parts[1]?.length > 1) {
        value = `${parts[0]}.${parts[1].substring(0, 1)}`;
      }
    }
    const formValue = { ...formValues };
    formValue["invoiceAmount"] = value;
    form.setFieldsValue({
      invoiceAmount: value,
    });
  };

  const handleChange:any = (e: any) => {
    formValues["changeInvoiceAmount"] = e?.target?.value;
    
    setErrorMsg(false);
    
    const name =
      e?.target?.name === "" &&
      (e?.target?.id === "buyerPercent" || e?.target?.id === "sellerPercent")
        ? e?.target?.id
        : e?.target?.name;
    const value = e?.target?.value;
    if (e?.target?.id === "buyerPercent" || e?.target?.id === "sellerPercent") {
      form.setFieldsValue({
        otherPercent: 100 - parseFloat(e.target.value || 0),
      });
      const otherName =
        name === "buyerPercent" ? "sellerPercent" : "buyerPercent";
      setFormValues((prevState:any) => ({
        ...prevState,
        [otherName]: 100 - parseFloat(e.target.value || 0),
      }));
    }
    setFormValues((prevState:any) => ({
      ...prevState,
      [name]: value,
      invoiceAmount: e?.target?.value,
      currency: currency,
    }));
  };

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
              name="payoutAccountAlias"
              className="inputField error-msg mb-4"
              rules={[
                {
                  required: !isDraft,
                  message: "Payout Account is required!",
                },
              ]}
               initialValue={undefined} 
            >
              <Select
                placeholder="Select Payout Account"
                className="w-100 h-100 pt-0"
                onChange={onPayoutAccountChange}
                optionFilterProp="children"
                allowClear
              >
                {bankAccountList?.length > 0 &&
                  bankAccountList?.map((value: any, index: any) => (
                    <Option key={index} value={value.aliasName}>
                      <Tooltip
                        title={`${value.number} - (${value.institutionName})`}
                        placement="bottom"
                        overlayClassName="custom-tooltip signupTooltip"
                      >
                        {value.number} - ({value.institutionName})
                      </Tooltip>
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Row>

      {payoutAccount != null ? (
        <Row gutter={36} className="mt-4">
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Name
            </p>
            <Form.Item name="bankName" className="inputField w-100" initialValue={payoutAccount?.name ?? "--"}>
              <Input name="bankName" readOnly />
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
                form.getFieldValue("IbanNumber") !== "--"
                  ? form.getFieldValue("IbanNumber")
                  : ""
              }
              placement="topRight"
              overlayClassName="custom-tooltip"
            >
              <Form.Item name="IbanNumber" className="inputField w-100" initialValue={payoutAccount?.number ?? "--"}>
                <Input readOnly />
              </Form.Item>
            </Tooltip>
          </Col> 
          <Col span={Width < 992 ? 24 : 8} className={"px-lg-3 px-3"}>
            <p
              className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
              style={{ display: "flex", alignItems: "center" }}
            >
              Institution Type
            </p>
            <Form.Item
              name="Institutiontype"
              className="inputField w-100"
               initialValue={payoutAccount?.institutionType ?? "--"}
            >
              <Input name="Institutiontype" readOnly />
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
                form.getFieldValue("institutionName") !== "--"
                  ? form.getFieldValue("institutionName")
                  : ""
              }
              placement="topRight"
              overlayClassName="custom-tooltip"
            >
              <Form.Item
                name="institutionName"
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
              name="routingCode"
              className="inputField w-100"
               initialValue={payoutAccount?.routingCode ?? "--"}
            >
              <Input name="routingCode" readOnly />
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
              name="routingScheme"
              className="inputField w-100"
                initialValue={payoutAccount?.routingScheme ?? "--"}
            >
              <Input name="routingScheme" readOnly />
            </Form.Item>
          </Col>


        <Col span={Width > 991 ? 8 : 24}>
          <p 
            className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            Agreement amount
             
            <Tooltip
              title={
                <span className="response-tooltip">
                  Enter the total monetary value agreed upon for the transaction.
                </span>
              }
              overlayClassName='custom-tooltip info-icon'
              placement={Width > 475 ? "right" : "top"}
            >
              <img src={infoIcon} className="ms-1" />
            </Tooltip>
          </p> 
          <Form.Item
            name="invoiceAmount"
            className="inputField w-100"
            rules={[
              {
                validator(_, value) {
                  
                  if (isDraft) {
                    return Promise.resolve();
                  } else if (parseFloat(value) <= 0) {
                    return Promise.reject(`Amount must be non negative.`);
                  } else if ( !value || parseFloat(value) === 0) {
                    return Promise.reject(`Amount must be greater than ${minimumValue != null ? minimumValue : MINIMUM_INVOICE_AMOUNT}`);
                  } else if (parseFloat(value) <= (minimumValue !== null ? minimumValue : MINIMUM_INVOICE_AMOUNT)) {
                    return Promise.reject(`Amount must be greater than ${minimumValue != null ? minimumValue : MINIMUM_INVOICE_AMOUNT}`);
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input
              name="invoiceAmount"
              placeholder="Enter agreement amount"
              type={"number"}
              maxLength={45}
              disabled={!category || !itemType}
              suffix={<span className= "custom-suffix">{currency}</span>}
              onKeyPress={(e) => {
                handleInvoiceAmount(e);
              }}
              onKeyDown={handleKeyDown} 
              onChange={handleChange}
              // onInput={() => {
              //   setdidsubmit(1);
              // }}
            />
          </Form.Item>
        </Col>
        </Row>
      ) : null}
    </>
  );
}
