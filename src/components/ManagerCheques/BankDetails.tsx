import { Card, Col, Form, Input, message, Row, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { fetchBankDetailsByUserAlias } from "../../services/user";
import { getLocalStorage, MINIMUM_INVOICE_AMOUNT } from "../Common/Constants";
import infoIcon from "../../assets/img/informIcon.svg"

const BankDetails = (props: object | any): any => {
  const {
    formValues,
    setFormValues,
    setSelectedBank,
    selectedBank,
    chequeDetail,
    category,
    itemType,
    minimumValue,
    currency,
    form,
    isDraft

  } = props;

  const [Width, setWidth] = useState(document?.body?.clientWidth);

  const [bankData, setBankData] = useState([]);
  const [errorMsg, setErrorMsg] = useState(false);

  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
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
    setBankData([]);

    fetchBankDetailsByUserAlias({ id: userAlias }).then((response: any) => {
      if (response?.data?.bankDetails && response?.data?.bankDetails.length) {
        setBankData(response.data.bankDetails);
      }
    });
  }, []);

useEffect(() => {
  if(bankData.length && chequeDetail?.bankAlias){
    onBankChanges(chequeDetail?.bankAlias)
  } 
  }, [chequeDetail?.bankAlias,bankData.length])
   


  useEffect(() => {
    if (errorMsg == true)
      message.error("Oops! Something went wrong. Please try again laterww!");
  }, [errorMsg]);


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

  const handleKeyDown = (e:any) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };


  const onBankChanges = (value:any) => {
    const data : any = bankData.find((a: any) => a.id === value);
    setSelectedBank(data);
    form.setFieldsValue({
        bankName: data?.name,
        IbanNumber: data?.number,
        Institutiontype: data?.institutionType,
        institutionName: data?.institutionName,
        routingCode: data?.routingCode,
        routingScheme: data?.routingScheme,
    });
  }

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
      currency: "AED",
    }));
  };

  return (
    <>
      
      
        <Card className="noBorder mt-6">
          <Row gutter={36} className="endtoend bank">

            <Col span={Width > 991 ? 24 : 24}>
              <Row gutter={36}>

                <Col span={Width > 991 ? 8 : 24}>
            <div className="subText_small fw-400 mb-2 mt-3">
              Bank Details
            </div>
            <Form.Item
              name="bankAlias"
              className="inputField w-100 error-input"
              rules={[
                {
                  required: !isDraft,
                  message: "Bank is required!",
                }]
              }>
              <Select
                placeholder="Select bank"
                showSearch
                onChange={(value) => {
                  onBankChanges(value);
                }}
                allowClear
              >
                {bankData.map((bank: any) => (
                  <Select.Option key={bank.id} value={bank.id}>
                    {bank?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={Width > 991 ? 8 : 24}>
            <div className="subText_small fw-400 mb-2 mt-3">
              Name (Account name) 
            </div>
            <Form.Item
              name="bankName"
              className="inputField w-100 error-input"
              initialValue={selectedBank?.name}
            >
              <Input placeholder="Name as per bank" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width > 991 ? 8 : 24}>
            <div className="subText_small fw-400 mb-2 mt-3">
              IBAN number
            </div>
            <Form.Item
              name="IbanNumber"
              className="inputField w-100 error-input"
              initialValue={selectedBank?.number}
            >
              <Input placeholder="IBAN Number" readOnly />
            </Form.Item>
          </Col>

          <Col span={Width > 991 ? 8 : 24}>
            <div className="subText_small fw-400 mb-2 mt-3">
              Institution type
            </div>
            <Form.Item
              name="Institutiontype"
              className="inputField w-100 error-input"
              initialValue={selectedBank?.institutionType}
            >
              <Input placeholder="Institution type" readOnly />
            </Form.Item>
          </Col>
       
          <Col span={Width > 991 ? 8 : 24}>
            <div className="subText_small fw-400 mb-2 mt-3">
              Institution Name
            </div>
            <Form.Item
              name="institutionName"
              className="inputField w-100 error-input"
              initialValue={selectedBank?.institutionName}
            >
              <Input placeholder="Institution Name" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width > 991 ? 8 : 24}>
            <div className="subText_small fw-400 mb-2 mt-3">
              Routing code
            </div>
            <Form.Item
              name="routingCode"
              className="inputField w-100 error-input"
              initialValue={selectedBank?.routingCode}
            >
              <Input placeholder="Routing code" readOnly />
            </Form.Item>
          </Col>
          <Col span={Width > 991 ? 8 : 24}>
            <div className="subText_small fw-400 mb-2 mt-3">
              Routing Scheme
            </div>
            <Form.Item
              name="routingScheme"
              className="inputField w-100 error-input"
              initialValue={selectedBank?.routingScheme}
            >
              <Input placeholder="Routing scheme" readOnly />
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
              disabled={!selectedBank ||!category || !itemType}
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
            </Col>
          </Row>
        </Card>
      
    </>
  );
};

export default BankDetails;
