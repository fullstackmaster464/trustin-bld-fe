import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Tabs,
  Upload,
  message,
  Typography
} from "antd";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/img/leftArrow.svg";
import uploadImg from "../../assets/img/upload.svg";
import UserFull from "../../assets/img/User_Full.svg";
import Payment_Success from "../../assets/img/paymentSuccess.svg";
import Itemdelete from "../../assets/img/ItemDeleteIcon.svg";
import Reject from "../../assets/modals/rejected.gif";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import {
  DisputeManagementDetails,
  DisputeManagementList,
  TransactionDetail,
} from "../Common/RouteConst";
import { InputText } from "../ui-elements/InputsRepo";
import { Option } from "antd/lib/mentions";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import {
  disputeResolved,
  fetchBankDetailsByUserAlias,
  getPaymentDetails,
  submitMilestoneRefundV2,
  submitPartialRefundV2,
  // submitMilestoneRefund
} from "../../services/admin";
import moment from "moment";
import { USER_TYPE_TEXT, DateWithUtcOffset, acceptedFileExtension, beforeUploadFile, moneyFormat, onlyNumberRegex, PLATFORM_CHARGE_TYPE } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
import { AuthTitle } from "../ui-elements/TextRepo";
import { CalculateTransactionFee } from "../Common/InvoiceCalculations";

const ResolveDispute = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileName, setFileName] = useState<any>({});
  const [file, setFile] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState<any>([]);
  const [buyerBankDetails, setBuyerBankDetails] = useState<any>([]);
  const [sellerBankDetails, setSellerBankDetails] = useState<any>([]);
  const [refundSuccess, setRefundSuccess]= useState<any>(false);
  const [refundFailure, setRefundFailure]= useState<any>(false);
  const [resolvedDispute, setResolvedDispute] = useState<any>(false);
  const [failureMessage, setFailureMessage] = useState<any>("");
  const [activeMilestone, setActiveMilestone] = useState<any>();
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const id: any = window?.location?.pathname.split("/").pop();
  const [invoiceCal, setInvoiceCal] = useState<any>([]);
  const [tab, setTab] = useState("");
  const [paymentSuccess] = useState(true);
  const [date, setDate] = useState("");
  const [uploadError,setUploadError] = useState<any>("")
  const [charges, setCharges] = useState<any>({
    platformFees: "",
    vatCharges: "",
    buyerTransactionFee: "",
    sellerTransactionFee: "",
    buyerTotalFee: ""
  });
  const { Title,Paragraph } = Typography;
  const changeAmountValue = (e: any) => {
    const percent = e.target.value.replace(/[^0-9.]/gi, "");
    form.setFieldsValue({ amountPercent: percent });
    const invoice = activeMilestone?.transactionAmount;
    const index: any = (invoice * percent) / 100;
    const buyerAmount = parseFloat(index).toFixed(2);
    const buyerAmountWithFee: any = Number(buyerAmount) + Number(charges.buyerTotalFee)
    form.setFieldsValue({
      amount: buyerAmount,
      amountWithFee: buyerAmountWithFee.toFixed(2),
    });
    const sellerAmount: any = invoice - index;
    form.setFieldsValue({
      sellerAmount: parseFloat(sellerAmount).toFixed(2),
      sellerAmountwithFee: parseFloat(sellerAmount).toFixed(2),
    });
  };

  const changeDate:any = (_date: object, dateString: string) => {
    setDate(dateString);
  };

  const changePercentValue = (e: any) => {
    const percent: any = e.target.value.replace(/[^0-9.]/gi, "");
    form.setFieldsValue({ amount: percent });
    const invoice: any = activeMilestone?.transactionAmount;
    const percentValue: any = ((percent / invoice) * 100).toFixed(2);

    form.setFieldsValue({
      amountPercent: percentValue,
    });

    const index: any = (invoice * percentValue) / 100;
    const sellerAmount: any = invoice - index;
    form.setFieldsValue({
      sellerAmount: parseFloat(sellerAmount).toFixed(2),
      sellerAmountwithFee: parseFloat(sellerAmount).toFixed(2),
    });

    let buyerAmountWithFee = (
      index + Number(charges.buyerTransactionFee)
    ).toFixed(2);
    if(paymentDetails?.contractStartedBy === USER_TYPE_TEXT?.ESCROW_ADVISOR) {
      buyerAmountWithFee = Number(buyerAmountWithFee) + (Number(paymentDetails?.buyerCommissionPercent) > 0 && paymentDetails?.escrowAdvisorCommission !== null ? ((Number(paymentDetails?.escrowAdvisorCommission) * Number(paymentDetails?.buyerCommissionPercent)) / 100) : 0)
    }
    form.setFieldsValue({
      amountWithFee: Number(buyerAmountWithFee).toFixed(2),
    });
  };

  // const changeBuyerFee = (e: any) => {
  //   const percent: any = e.target.value.replace(/[^0-9.]/gi, "");
  //   form.setFieldsValue({ amount: percent });
  //   let invoice: any = paymentDetails?.invoiceAmount;
  //   let percentValue: any =((percent / invoice) * 100).toFixed(2);

  //   form.setFieldsValue({
  //     amountPercent: percentValue,
  //   });

  //   let index: any = (invoice * percentValue) / 100;
  //   let sellerAmount: any = invoice - index;
  //   form.setFieldsValue({
  //     sellerAmount: parseFloat(sellerAmount).toFixed(2),
  //     sellerAmountwithFee: parseFloat(sellerAmount).toFixed(2),
  //   });

  //   let buyerAmount = (
  //     index - Number(charges.buyerTransactionFee)
  //   ).toFixed(2);
  //   form.setFieldsValue({
  //     amount: buyerAmount,
  //   });
  // };
  const onTabChange = async(tabValue: string) => {
    setLoading(true);
    let details: any = false;
    if (tabValue == "releasepayment") {
      details = await getBankDetails(paymentDetails?.sellerAlias, "");
    } else if (tabValue == "generaterefund") {
      details = await getBankDetails(paymentDetails?.buyerAlias, "");
    } else if (tabValue == "partialrefund") {
      details = await getBankDetails(paymentDetails?.sellerAlias, "seller");
      if(details === true)
      details = await getBankDetails(paymentDetails?.buyerAlias, "buyer");
    }
    setLoading(false)
    if(details === true || tabValue === "resolvedispute"){
    setTab(tabValue);
    setUploadError("")
    // form.resetFields();
    }
  };
  const goBack = () => {
    navigate(DisputeManagementDetails + "/" + id);
  };
  const handeRoleChange = (value: any, role: string) => {
    form.setFieldsValue({
      [role]: value,
    });
  };
  const getBankDetails = async (userAlias: string, tabvalue: string) => {
    let gotDetails: any = false;
    await fetchBankDetailsByUserAlias(userAlias)
      .then((response) => {
        if (response?.status === 201 || response?.status === 200) {
          if(response?.data?.bankDetails?.length > 0) {
          if (!tabvalue) {
            setBankDetails(response?.data?.bankDetails);
            form.setFieldsValue({
              name: response?.data?.bankDetails?.[0]?.name,
            });
          }
          if (tabvalue == "buyer") {
            setBuyerBankDetails(response?.data?.bankDetails);
          }
          if (tabvalue == "seller") {
            setSellerBankDetails(response?.data?.bankDetails);
          }
          gotDetails = true
        } else {
          gotDetails = false;
          message.error("Could not fetch user bank details. Please try again later!");
        }
        }
      })
      .catch((err) => {
        if (err)
        gotDetails = false;
          message.error("Could not fetch details. Please try again later!");
      });
      return gotDetails;
  };

  const resolveDispute = (values: any) => {
    setLoading(true);
    const formData:any = new FormData();
    formData.append("contractId", id);
    formData.append("resolveReason", values?.resolveReason);
    formData.append("file", file[tab]);
    formData.append("scheduledDate", DateWithUtcOffset(date));


    disputeResolved(formData)
      .then(() => {
        setLoading(false);
        setResolvedDispute(true);
        setTimeout(()=> {
          navigate(TransactionDetail + "/" + id);
        },3000)
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Something went wrong. Please try again later!");
      });
  };

  const generateRefund = (values: any) => {
    setLoading(true);
    const formData: any = new FormData();
    formData.append("contractId", id);
    formData.append("transactionId", activeMilestone?.aliasName);
    formData.append("refundReason", values?.generatereason);
    formData.append("file", file[tab]);
    formData.append("refundPercentage", tab === "generaterefund" ? 100 : 0);
    formData.append(
      "buyerAmount",
      values.buyerBank ? activeMilestone?.transactionAmount : 0
    );
    formData.append(
      "sellerAmount",
      values.sellerBank ? activeMilestone?.transactionAmount : 0
    );
    formData.append("scheduledDate", DateWithUtcOffset(date));
    formData.append("isMilestone", paymentDetails?.isMilestone);
    formData.append("totalInvoiceAmount", activeMilestone?.transactionAmount);
    formData.append("buyerBankAlias", values?.buyerBank);
    formData.append("sellerBankAlias", values?.sellerBank);
    formData.append("currency", paymentDetails?.currency);
    if(paymentDetails?.isMilestone) {
      submitMilestoneRefundV2(formData)
        .then((response: any) => {
          setLoading(false);
          if (response?.status === 201 || response?.status === 200) {
            setRefundSuccess(true);
            setTimeout(()=>{
              goBack();
            },3000);
          }
        })
        .catch((error: any) => {
          setLoading(false);
          setFailureMessage(error?.data?.error)
          setRefundFailure(true);
        });
    } else {
      submitPartialRefundV2(formData)
        .then(() => {
          setLoading(false);
          setRefundSuccess(true);
          setTimeout(() => {
            navigate(DisputeManagementDetails + "/" + id);
          },3000);
        })
        .catch((error: any) => {
          setLoading(false);
          setFailureMessage(error?.data?.error)
          setRefundFailure(true);
        });
    }
  };

  const partialRefund = (values: any) => {
    setLoading(true);
    const formData:any = new FormData();
    formData.append("contractId", id);
    formData.append("transactionId", activeMilestone?.aliasName);
    formData.append("refundReason", values.refundReason);
    formData.append("refundPercentage", values.amountPercent);
    formData.append("buyerAmount", values.amount);
    formData.append("sellerAmount", values.sellerAmount);
    formData.append("scheduledDate", DateWithUtcOffset(date) );
    formData.append("isMilestone", paymentDetails?.isMilestone);
    formData.append("totalInvoiceAmount", activeMilestone?.transactionAmount);
    formData.append("file", file[tab]);
    formData.append("buyerBankAlias", values.selectedBuyerBank);
    formData.append("sellerBankAlias", values.selectedSellerBank);
    formData.append("currency", paymentDetails?.currency);

    if(paymentDetails?.isMilestone) {
      submitMilestoneRefundV2(formData)
        .then((response) => {
          setLoading(false);
          if (response?.status === 201 || response?.status === 200) {
            setRefundSuccess(true);
            setTimeout(()=>{
              goBack();
            },3000);
          }
        })
        .catch((error: any) => {
          setLoading(false);
          // setFailureMessage(error?.data?.error)
          console.log(error)
          setFailureMessage('Oops! something went wrong please try again later.')
          setRefundFailure(true);
        });
    } else {
      submitPartialRefundV2(formData)
        .then((response) => {
          setLoading(false);
          if (response?.status === 201 || response?.status === 200) {
            setRefundSuccess(true);
            setTimeout(()=>{
              goBack();
            },3000);
          }
        })
        .catch(() => {
          setLoading(false);
          setFailureMessage('Oops! something went wrong please try again later.')
          setRefundFailure(true);
        });
    }
  };
  const changeHandler = (file: any,tab:any) => {
    setFileName({...fileName,[tab]:file?.name});
    setFile({...file,[tab]:file});
    form.setFieldValue(`file_${tab}`, file);
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get("type");
    setTab(value ? value : ""); 
    setLoading(true);   
    getPaymentDetails(id).then((response: any) => {
      const data = response?.data;
      setPaymentDetails(data);
      setActiveMilestone(data?.milestoneList.filter((milestone: any) => milestone.isActive)?.[0])
      fetchBankDetails(value,data);
      setLoading(false)
    });
  }, []);

  const fetchBankDetails = async(value: any, data: any) => {
    let details : any = false;
    if (value == "releasepayment") {
      details = await getBankDetails(data?.sellerAlias, "");
    } else if (value == "generaterefund") {
      details = await getBankDetails(data?.buyerAlias, "");
    } else if (value == "partialrefund") {
      details = await getBankDetails(data?.sellerAlias, "seller");
      if(details === true)
      details = await getBankDetails(data?.buyerAlias, "buyer");
    }
  }

  const milestone: any = [];
  const getTransactionDetails = async(transactionAmount: any, trxnAlias: any) => {
    const data: any = await CalculateTransactionFee({
      invoiceAmount: paymentDetails?.invoiceAmount,
      transactionAmount: transactionAmount,
      plateformFees: paymentDetails?.platformCharge,
      vatCharges: paymentDetails?.vatCharges,
      platformChargeType: paymentDetails?.platformChargeType !== null ? paymentDetails?.platformChargeType : PLATFORM_CHARGE_TYPE.PERCENT,
      buyerPercent: paymentDetails?.buyerPercent,
      sellerPercent: paymentDetails?.sellerPercent,
      hasAdvisor: paymentDetails?.escrowAdvisorAlias && ![paymentDetails?.buyerAlias,paymentDetails?.sellerAlias].includes(paymentDetails?.escrowAdvisorAlias),
      escrowCommission: paymentDetails?.escrowAdvisorCommission,
      buyerCommissionPercent: paymentDetails?.buyerCommissionPercent,
      sellerCommissionPercent: paymentDetails?.sellerCommissionPercent,
      minimumPlatformCharge: paymentDetails?.minimumPlatformCharge,
      entityType: paymentDetails?.itemCategoryEntityType
    })
    if(paymentDetails?.aliasName == trxnAlias) {
      setInvoiceCal(data)
    } else{
      milestone[trxnAlias] = data   
      if(trxnAlias === activeMilestone?.aliasName) {
      setCharges({
        platformFees: data.platformFee,
        vatCharges: data.vatFee,
        buyerTransactionFee: data.buyerTransactionFee,
        sellerTransactionFee: data.sellerTransactionFee,
        buyerTotalFee: data?.buyerTotalFee
      });
    }
    }
  }
  useEffect(()=> {
    if(paymentDetails?.aliasName) {
      getTransactionDetails(paymentDetails?.invoiceAmount, paymentDetails?.aliasName);
      paymentDetails.milestoneList?.map((item: any) => {
        if(item.isActive === true) {
        getTransactionDetails(item?.transactionAmount, item?.aliasName);
        }
      })      
    }
  }, [paymentDetails]);

  const tabLabels: Record<"resolvedispute" | "generaterefund" | "partialrefund" | "releasepayment", string> = {
    resolvedispute: "Resolve dispute",
    generaterefund: "Generate refund",
    partialrefund: "Partial refund",
    releasepayment: "Release payment",
  };

  
  const DESCRIPTION_CMT_MAX = 300;
  const validateCommentField = (value: any) => {
    if (!value || value.trim() === '') {
      return Promise.resolve();
    }

    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }

    if (value.length < 20) {
      return Promise.reject(new Error("Please enter minimum 20 characters"));
    }

    return Promise.resolve();
  };

  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="dispute_management"
        loading={loading}
        TitleText={paymentDetails?.agreementId}
        TitleImage={LeftArrow}
        backtoDashboard={true}
        headerPage={
          <div className="d-flex">
                    <Image
                      src={LeftArrow}
                      preview={false}
                      onClick={() => {
                        goBack();
                      }}
                      className="mt-2 cursor"
                    />
                    <div className="ml-5">
                      <b>{paymentDetails?.agreementId}</b>
                      <Breadcrumb separator=">">
                        <Breadcrumb.Item
                          className="cursor"
                          onClick={() => {
                            navigate(DisputeManagementList);
                          }}
                        >
                          Dispute management
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                          className="cursor"
                          onClick={() => {
                            navigate(DisputeManagementDetails + "/" + id);
                          }}
                        >
                          Agreement Details
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{tabLabels[tab as keyof typeof tabLabels] || ""}</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >              
              {tab ? (
                <div className="d-flex dashboardTabs pt-3 resolve-dispute-tabs-row">
                  <Tabs
                    defaultActiveKey={tab}
                    className="d-none-res tableTab"
                    onChange={onTabChange}
                  >
                    <TabPane
                      tab="Resolve dispute"
                      key="resolvedispute"
                    ></TabPane>
                    <TabPane
                      tab="Generate refund"
                      key="generaterefund"
                    ></TabPane>
                    <TabPane tab="Partial refund" key="partialrefund"></TabPane>
                    <TabPane
                      tab="Release payment"
                      key="releasepayment"
                    ></TabPane>
                  </Tabs>
                </div>
              ) : (
                ""
              )}
              {tab === "resolvedispute" ? (
                <Card className="noBorder px-4 ">
                  <div className="stepDetails mb-4 mt-3">
                    Reason for resolving the dispute
                  </div>
                  <hr className="lightgrayHr" />
                  <Form
                    form={form}
                    scrollToFirstError
                    onFinish={(values: object) => {
                      resolveDispute(values);
                    }}
                  >
                    <div className="subText_small fw-400">Enter reason</div>
                    <InputText
                      fieldname="resolveReason"
                      className="inputField w-100 mt-3 error-input"
                      rules={[
                        {
                          required: true,
                          message: "Reason is required!",
                        },
                        {
                          validator: async (_: any, value: string | any[]) => {
                            await validateCommentField(value);
                            if (!value || value.length <= DESCRIPTION_CMT_MAX) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${DESCRIPTION_CMT_MAX}`));
                          },
                        },
                      ]}
                    >
                      <Input placeholder="Write your reason here" />
                    </InputText>
                    <div className="subText_small fw-400 mb-3">Upload</div>
                    <div className="d-flex">
                    <InputText
                      fieldname="file_resolvedispute"
                      rules={[
                        {
                          required: true,
                          message: "Please upload the proof",
                        },
                      ]}
                      className="resolveDisputeUpload checklist"
                    >
                      <Upload maxCount={1}  accept={acceptedFileExtension} 
                      beforeUpload={(file: any) => {
                        const checkBeforeUpload = beforeUploadFile(file, "");
                        if(checkBeforeUpload === true){
                          setUploadError("")
                          changeHandler(file,"resolvedispute");
                        } else{
                          setUploadError(checkBeforeUpload);
                          return Upload.LIST_IGNORE;
                        }
                      }}
                      onChange={(info: any) => {
                        if (info.fileList.length > 0) {
                          setUploadError(""); 
                          form.setFieldsValue({ file_resolvedispute: info.fileList[0] });
                        }
                      }}>
                        <Button className="dashed-button w-100">
                          <span className="upload-btn">
                            <span className={fileName?.["resolvedispute"] ? "overflowText me-3" : "text-overflow me-3"}>
                              {fileName?.["resolvedispute"] ? fileName?.["resolvedispute"] : "Upload proof of action/resolution 5(MB)"}
                            </span>
                            <span>
                              <Image
                                src={uploadImg}
                                alt="upload"
                                preview={false}
                              />
                            </span>
                          </span>
                        </Button>
                      </Upload>
                      {uploadError && (
                        <span className="ant-form-item-explain-error mb-2">{uploadError}</span>
                      )}
                    </InputText>
                    {fileName?.["resolvedispute"] && ( 
                    <Image
                      src={Itemdelete}
                      alt="delete"
                      preview={false}
                      className="cursor mx-2 mt-4"
                      height={17}
                      width={15.11}
                      onClick={() => {
                        setFileName(null)
                        setFile(null)
                        form.setFieldsValue({ file_resolvedispute: null }); 
                      setUploadError("");
                      }}
                    />)}
                   </div>
                    <div className="">
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        className="modal-button my-5"
                        loading={loading}
                      >
                        Submit
                      </Button>
                      <Button
                        type="primary"
                        className="modal-button-cancel my-5 mx-2"
                        loading={loading}
                        onClick={() => {
                          goBack();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card>
              ) : tab === "generaterefund" ? (
                <Card className="noBorder px-4 ">
                  <div className="stepDetails mb-4 mt-3">Generate refund</div>
                  <hr className="lightgrayHr" />
                  <Form form={form} scrollToFirstError onFinish={generateRefund}>
                    <div className="subText_small fw-400">
                      Enter reason/description
                    </div>
                    <InputText
                      fieldname="generatereason"
                      className="inputField w-100 mt-3 error-input"
                      rules={[
                        {
                          required: true,
                          message: "Reason is required!",
                        },
                        {
                          validator: async (_: any, value: string | any[]) => {
                            await validateCommentField(value);
                            if (!value || value.length <= DESCRIPTION_CMT_MAX) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${DESCRIPTION_CMT_MAX}`));
                          },
                        },
                      ]}
                    >
                      <Input placeholder="Write your reason/description here" />
                    </InputText>
                    <div className="subText_small fw-400 mb-3">Upload</div>
                    <div className="d-flex">
                    <InputText
                      fieldname="file_generaterefund"
                      rules={[
                        {
                          required: true,
                          message: "Please upload the proof",
                        },
                      ]}
                      className="resolveDisputeUpload checklist"
                    >
                      <Upload maxCount={1} accept={acceptedFileExtension}
                        beforeUpload={(file: any) => {
                          const checkBeforeUpload = beforeUploadFile(file, "");
                          if(checkBeforeUpload === true){
                            setUploadError("")
                            changeHandler(file,"generaterefund");
                          } 
                          else{
                            setUploadError(checkBeforeUpload);
                            return Upload.LIST_IGNORE;
                          }
                        }}
                        onChange={(info: any) => {
                          if (info.fileList.length > 0) {
                            setUploadError("");
                            form.setFieldsValue({ file_generaterefund: info.fileList[0] });
                          }
                        }}
                      >
                        <Button className="dashed-button w-100">
                          <span className="upload-btn">
                            <span className={fileName?.["generaterefund"] ? "overflowText me-3" : "text-overflow me-3"}>
                              {fileName?.["generaterefund"] ? fileName?.["generaterefund"] : "Upload proof of action/resolution 5(MB)"}
                            </span>
                            <span>
                              <Image
                                src={uploadImg}
                                alt="upload"
                                preview={false}
                              />
                            </span>
                          </span>
                        </Button>
                      </Upload>
                      {uploadError && (
                      <span className="ant-form-item-explain-error mb-2">{uploadError}</span>
                    )}
                    </InputText>
                    {fileName?.["generaterefund"] && ( 
                    <Image
                      src={Itemdelete}
                      alt="delete"
                      preview={false}
                      className="cursor ms-3 mt-4"
                      height={17}
                      width={15.11}
                      onClick={() => {
                        setFileName("")
                        setFile("")
                        form.setFieldsValue({ file_generaterefund: null }); 
                        // form.validateFields();
                        setUploadError(""); 
                      }}
                    />
                  )}
                    </div>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mt-4 release-payment-block">
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="subText_small mb-2 mt-2">
                          Buyer name
                        </div>
                        <InputText
                          fieldname="name"
                          className="inputField mb-4 error-input"
                          rules={[
                            {
                              required: true,
                              message: "Name is required!",
                            },
                            {
                              whitespace: true,
                              message: "Enter valid name!",
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            placeholder="Enter name here"
                            disabled
                          />
                        </InputText>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8} className="space-arr">
                        <div className="subText_small mb-2 mt-2">
                          Buyer bank
                        </div>
                        <InputText
                          className=" mb-4 "
                          fieldname="buyerBank"
                          rules={[
                            {
                              required: true,
                              message: "Please select bank",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select buyer bank"
                            onChange={(value: string) => {
                              handeRoleChange(value, "buyerBank");
                            }}
                            showSearch
                            allowClear
                            optionFilterProp="children"
                          >
                            {bankDetails.map((item: any, index: any) => {
                              return (
                                <Option key={index} value={item?.aliasName}>
                                  {item?.institutionName}
                                </Option>
                              );
                            })}
                          </Select>
                        </InputText>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="subText_small mb-2 mt-2">
                          Select date
                        </div>
                        <InputText
                          fieldname="scheduledDate"
                          className="inputField mb-4"
                          rules={[
                            {
                              required: true,
                              message: "Date is required!",
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder="Select date"
                          format={{
                            format: 'DD-MM-YYYY',
                            type: 'mask',
                          }}
                            onChange={changeDate}
                            disabledDate={(current:any) =>
                              current.isBefore(moment().subtract(1, "day"))
                            }
                          />
                        </InputText>
                      </Col>
                    </Row>

                    <div className="">
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        className="modal-button my-5"
                        loading={loading}
                      >
                        Submit
                      </Button>
                      <Button
                        type="primary"
                        className="modal-button-cancel my-5 mx-2"
                        loading={loading}
                        onClick={() => {
                          goBack();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card>
              ) : tab === "partialrefund" ? (
                <Card className="noBorder px-4 ">
                  <div className="stepDetails mb-4 mt-3">Partial refund</div>
                  <hr className="lightgrayHr" />
                  <Form form={form} scrollToFirstError onFinish={partialRefund}>
                    <div className="subText_small fw-400">Enter reason</div>
                    <InputText
                      fieldname="refundReason"
                      className="inputField w-100 mt-3 error-input"
                      rules={[
                        {
                          required: true,
                          message: "Reason is required!",
                        },
                        {
                          validator: async (_: any, value: string | any[]) => {
                            await validateCommentField(value);
                            if (!value || value.length <= DESCRIPTION_CMT_MAX) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error(`Maximum characters allowed: ${DESCRIPTION_CMT_MAX}`));
                          },
                        },
                      ]}
                    >
                      <Input placeholder="Write your reason here" />
                    </InputText>
                    <div className="subText_small fw-400 mb-3">Upload</div>
                    <div className="d-flex">
                    <InputText
                      fieldname="file_partialrefund"
                      rules={[
                        {
                          required: true,
                          message: "Please upload the proof",
                        },
                      ]}
                      className="resolveDisputeUpload checklist"
                    >
                      <Upload maxCount={1}  accept={acceptedFileExtension} 
                        beforeUpload={(file: any) => {
                          const checkBeforeUpload = beforeUploadFile(file, "");
                          if(checkBeforeUpload === true){
                            setUploadError("")
                          changeHandler(file,"partialrefund");
                          }
                          else{
                            setUploadError(checkBeforeUpload);
                            return Upload.LIST_IGNORE;
                          }
                        }}
                        onChange={(info: any) => {
                          if (info.fileList.length > 0) {
                            setUploadError(""); 
                            form.setFieldsValue({ file_partialrefund: info.fileList[0] });
                          }
                        }}
                        >
                        <Button className="dashed-button w-100">
                          <span className="upload-btn">
                            <span className={fileName?.["partialrefund"] ? "overflowText me-3" : "text-overflow me-3"}>
                              {fileName?.["partialrefund"] ? fileName?.["partialrefund"] : "Upload proof of action/resolution 5(MB)"}
                            </span>
                            <span>
                              <Image
                                src={uploadImg}
                                alt="upload"
                                preview={false}
                              />
                            </span>
                          </span>
                        </Button>
                      </Upload>
                      {uploadError && (
                        <span className="ant-form-item-explain-error mb-2">{uploadError}</span>
                      )}
                    </InputText>
                    {fileName?.["partialrefund"] && ( 
                    <Image
                      src={Itemdelete}
                      alt="delete"
                      preview={false}
                      className="cursor mx-2 mt-4"
                      height={17}
                      width={15.11}
                      onClick={() => {
                        setFileName("")
                        setFile("")
                        form.setFieldsValue({  file_partialrefund: null }); 
                      // form.validateFields();
                      setUploadError(""); 
                      }}
                    />)}
                    </div>
                  <>
                    <Title level={4} className="stepDetails mt-4 py-2">Payment details</Title>
                    <Card className="grayCard resolveDispute p-4">
                      <Row>
                        <Col span={18}>
                        <Paragraph className="stepDetails_medium_sub">
                          Agreement amount
                        </Paragraph>
                        </Col>
                        <Col span={6}>
                        <Paragraph className="subText_small fw-400 text-right">
                          {moneyFormat(
                            paymentDetails?.currency,
                            paymentDetails?.invoiceAmount
                          )}
                        </Paragraph>
                        </Col>
                        <Col span={18}>
                        <Paragraph className="stepDetails_medium_sub">
                          Total TrustIn fees (
                          {invoiceCal?.platformPercent}) +{" "}
                          {paymentDetails?.vatCharges ?? process.env.COUNTRY_VAT}% VAT
                        </Paragraph>
                        </Col>
                        <Col span={6}>
                        <Paragraph className="subText_small fw-400 text-right">
                          {moneyFormat(
                            paymentDetails?.currency,
                            invoiceCal?.platformFee
                          )}{" "}
                          +{" "}
                          {moneyFormat(
                            paymentDetails?.currency,
                            invoiceCal?.vatFee
                          )}
                        </Paragraph>
                      </Col>
                      {paymentDetails?.contractStartedBy === USER_TYPE_TEXT?.ESCROW_ADVISOR && ( <>
                      <Col span={18}>
                        <div className="stepDetails_medium_sub">
                        Transaction fees for escrow advisor 
                        </div>
                      </Col>
                      <Col span={6}>
                        <Paragraph className="subText_small fw-400 text-right">
                          {moneyFormat(
                            paymentDetails?.currency,
                            (Number(paymentDetails?.escrowAdvisorCommission || 0)).toFixed(2)
                          )}
                        </Paragraph>
                      </Col>
                      <Col span={18}>
                        <div className="stepDetails_medium_sub">
                        Escrow advisor fees to be paid by buyer ({Number(paymentDetails?.buyerCommissionPercent || 0)}%) 
                        </div>
                      </Col>
                      <Col span={6}>
                        <Paragraph className="subText_small fw-400 text-right">
                          {moneyFormat(
                            paymentDetails?.currency,
                            invoiceCal?.buyerAdvisorFee
                          )}
                        </Paragraph>
                      </Col>
                      <Col span={18}>
                        <div className="stepDetails_medium_sub">
                        Escrow advisor fees to be paid by seller ({Number(paymentDetails?.sellerCommissionPercent || 0)}%)
                        </div>
                      </Col>
                      <Col span={6}>
                        <Paragraph className="subText_small fw-400 text-right">
                          {moneyFormat(
                            paymentDetails?.currency,
                            invoiceCal?.sellerAdvisorFee
                          )}
                        </Paragraph>
                      </Col>
                      </>
                      )}
                      <Col span={18}>
                        <div className="stepDetails_medium_sub">
                          Trustin platform fee to be paid by buyer ({paymentDetails?.buyerPercent}%)
                        </div>
                      </Col>
                      <Col span={6}>
                        <Paragraph className="subText_small fw-400 text-right">
                          {moneyFormat(
                            paymentDetails?.currency,
                            invoiceCal?.buyerTransactionFee
                          )}
                        </Paragraph>
                      </Col>
                      <Col span={18}>
                        <Paragraph className="stepDetails_medium_sub">
                        Trustin platform fee to be paid by seller ({paymentDetails?.sellerPercent}%)
                        </Paragraph>
                      </Col>
                      <Col span={6}>
                        <Paragraph className="subText_small fw-400 text-right">
                          {moneyFormat(
                            paymentDetails?.currency,
                            invoiceCal?.sellerTransactionFee
                          )}
                        </Paragraph>
                      </Col>
                      </Row>
                    </Card>
                  </>
                    <div className="d-flex mt-5">
                      <Image src={UserFull} preview={false} alt="user" />
                      <div>
                        <span className="stepDetails_medium fw-400 mx-2">
                          {buyerBankDetails[0]?.name}
                        </span>
                        <span className="stepDetails_medium_light fw-400">
                          (buyer)
                        </span>
                      </div>{" "}
                    </div>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mt-4 buyer-form-contol">
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="subText_small mb-2 mt-2">
                          Buyer percentage
                        </div>
                        <InputText
                          fieldname="amountPercent"
                          className="inputField mb-4 error-input"
                          rules={[
                            {
                              required: true,
                              message: "Percentage is required!",
                            },
                            {
                              pattern: onlyNumberRegex,
                              message: "Enter valid percent!",
                            },
                            {
                              validator(_:any, value: string) {
                                if (parseFloat(value) === 0) {
                                  return Promise.reject("Enter valid percent!");
                                } else if (parseFloat(value) > 100) {
                                  return Promise.reject("Percent exceeds 100%");
                                } else {
                                  return Promise.resolve();
                                }
                              },
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            placeholder="Enter percentage here"
                            maxLength={6}
                            onChange={(e) => changeAmountValue(e)}
                            onInput={(e:any) => {
                              if (e.target.value.length > 6)
                                e.target.value = e.target.value.slice(
                                  0,
                                  e.target.maxLength
                                );
                            }}
                          />
                        </InputText>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="subText_small mb-2 mt-2">
                          Buyer amount
                        </div>
                        <InputText
                          fieldname="amount"
                          className="inputField mb-4 error-input"
                          rules={[
                            {
                              required: true,
                              message: "Amount is required!",
                            },
                            {
                              validator(_:any, value: string) {
                                if (parseFloat(value) === 0) {
                                  return Promise.reject(
                                    "Amount must be greater than 0"
                                  );
                                } else if (
                                  parseFloat(value) >
                                  paymentDetails?.invoiceAmount
                                ) {
                                  return Promise.reject(
                                    "Amount must be greater than agreement amount"
                                  );
                                } else {
                                  return Promise.resolve();
                                }
                              },
                            },
                          ]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter amount here"
                            maxLength={10}
                            onChange={(e) => changePercentValue(e)}
                            onInput={(e:any) => {
                              if (e.target.value.length > 10)
                                e.target.value = e.target.value.slice(
                                  0,
                                  e.target.maxLength
                                );
                            }}
                          />
                        </InputText>
                      </Col>

                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="subText_small mb-2 mt-2">
                          Buyer amount with fee
                        </div>
                        <InputText
                          fieldname="amountWithFee"
                          className="inputField mb-4 error-input"
                          rules={[
                            {
                              required: true,
                              message: "Amount is required!",
                            }
                          ]}
                        >
                          <Input
                            type="number"
                            placeholder="Enter amount with transaction fee"
                            maxLength={10}
                            // onChange={(e) => changeBuyerFee(e)}
                            // onInput={(e:any) => {
                            //   if (e.target.value.length > 10)
                            //     e.target.value = e.target.value.slice(
                            //       0,
                            //       e.target.maxLength
                            //     );
                            // }}
                            disabled
                          />
                        </InputText>
                      </Col>
                    </Row>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="buyer-form-contol">
                      <Col xs={24} sm={24} md={8} lg={8} className="space-arr">
                        <div className="subText_small mb-2 mt-2">
                          Buyer bank
                        </div>
                        <InputText
                          className=" mb-4 "
                          fieldname="selectedBuyerBank"
                          rules={[
                            {
                              required: true,
                              message: "Please select bank",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select buyer bank"
                            onChange={(value: string) => {
                              handeRoleChange(value, "selectedBuyerBank");
                            }}
                            showSearch
                            allowClear
                            optionFilterProp="children"
                          >
                            {buyerBankDetails.map((item: any, index: any) => {
                              return (
                                <Option key={index} value={item?.aliasName}>
                                  {item?.institutionName}
                                </Option>
                              );
                            })}
                          </Select>
                        </InputText>
                      </Col>
                    </Row>

                    <div className="d-flex mt-5">
                      <Image src={UserFull} preview={false} alt="user" />
                      <div>
                        <span className="stepDetails_medium fw-400 mx-2">
                          {sellerBankDetails[0]?.name}
                        </span>
                        <span className="stepDetails_medium_light fw-400">
                          (seller)
                        </span>
                      </div>{" "}
                    </div>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mt-4 buyer-form-contol">
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="subText_small mb-2 mt-2">
                          Seller amount
                        </div>
                        <InputText
                          fieldname="sellerAmount"
                          className="inputField mb-4 error-input"
                          rules={[
                            {
                              required: true,
                              message: "Amount is required!",
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            placeholder="Enter amount here"
                            disabled
                          />
                        </InputText>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="subText_small mb-2 mt-2">
                          Seller amount with fee
                        </div>
                        <InputText
                          fieldname="sellerAmountwithFee"
                          className="inputField mb-4 error-input"
                          rules={[
                            {
                              required: true,
                              message: "Transaction fee is required!",
                            },
                          ]}
                        >
                          <Input
                            type="text"
                            placeholder="Enter amount with transaction fee"
                            disabled
                          />
                        </InputText>
                      </Col>

                      <Col xs={24} sm={24} md={8} lg={8} className="space-arr">
                        <div className="subText_small mb-2 mt-2">
                          Seller bank
                        </div>
                        <InputText
                          className=" mb-4 "
                          fieldname="selectedSellerBank"
                          rules={[
                            {
                              required: true,
                              message: "Please select bank",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Select seller bank"
                            onChange={(value: string) => {
                              handeRoleChange(value, "selectedSellerBank");
                            }}
                            showSearch
                            allowClear
                            optionFilterProp="children"
                          >
                            {sellerBankDetails.map((item: any, index: any) => {
                              return (
                                <Option key={index} value={item?.aliasName}>
                                  {item?.institutionName}
                                </Option>
                              );
                            })}
                          </Select>
                        </InputText>
                      </Col>
                    </Row>
                    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="buyer-form-contol release-payment-block">
                      <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="subText_small mb-2 mt-2">
                          Select date
                        </div>
                        <InputText
                          fieldname="scheduledDate"
                          className="inputField mb-4"
                          rules={[
                            {
                              required: true,
                              message: "Date is required!",
                            },
                          ]}
                        >
                          <DatePicker
                            placeholder="Select date"
                            format={{
                              format: 'DD-MM-YYYY',
                              type: 'mask',
                            }}
                            onChange={changeDate}
                            disabledDate={(current:any) =>
                              current.isBefore(moment().subtract(1, "day"))
                            }
                          />
                        </InputText>
                      </Col>
                    </Row>

                    <div className="">
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        className="modal-button my-5"
                        loading={loading}
                      >
                        Submit
                      </Button>
                      <Button
                        type="primary"
                        className="modal-button-cancel my-5 mx-2"
                        loading={loading}
                        onClick={() => {
                          goBack();
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </Card>
              ) : tab === "releasepayment" ? (
                <Card className="noBorder px-4 ">
                  <div className="stepDetails mb-4 mt-3">Release payment</div>
                  <hr className="lightgrayHr" />
                  {paymentSuccess ? (
                    <Form form={form} scrollToFirstError onFinish={generateRefund}>
                      <div className="subText_small fw-400">
                        Enter reason/description
                      </div>
                      <InputText
                        fieldname="generatereason"
                        className="inputField w-100 mt-3 error-input"
                        rules={[
                          {
                            required: true,
                            message: "Reason is required!",
                          },
                          {
                            validator: async (_: any, value: string | any[]) => {
                              await validateCommentField(value);
                              if (!value || value.length <= DESCRIPTION_CMT_MAX) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error(`Maximum characters allowed: ${DESCRIPTION_CMT_MAX}`));
                            },
                          },
                        ]}
                      >
                        <Input placeholder="Write your reason/description here" />
                      </InputText>
                      <div className="subText_small fw-400 mb-3">Upload</div>
                      <div className="d-flex">
                      <InputText
                        fieldname="file_releasepayment"
                        rules={[
                          {
                            required: true,
                            message: "Please upload the proof",
                          },
                        ]}
                        className="resolveDisputeUpload checklist"
                      >
                        <Upload maxCount={1}  accept={acceptedFileExtension} 
                            beforeUpload={(file: any) => {
                              const checkBeforeUpload = beforeUploadFile(file, "");
                              if(checkBeforeUpload === true){
                                setUploadError("")
                                changeHandler(file,"releasepayment");
                                return false;
                              } else {
                                setUploadError(checkBeforeUpload);
                                return Upload.LIST_IGNORE;
                              }
                            }}
                            onChange={(info: any) => {
                              if (info.fileList.length > 0) {
                                setUploadError(""); 
                                form.setFieldsValue({ file_releasepayment: info.fileList[0] });
                              }
                            }}>
                          <Button className="dashed-button w-100">
                            <span className="upload-btn">
                              <span className={fileName?.["releasepayment"] ? "overflowText me-3" : "text-overflow me-3"}>
                                {fileName?.["releasepayment"] ? fileName?.["releasepayment"] : "Upload proof of action/resolution 5(MB)"}
                              </span>
                              <span>
                                <Image
                                  src={uploadImg}
                                  alt="upload"
                                  preview={false}
                                />
                              </span>
                            </span>
                          </Button>
                        </Upload>
                          {uploadError && (
                              <span className="ant-form-item-explain-error mb-2">{uploadError}</span>
                            )}
                      </InputText>
                      {fileName?.["releasepayment"] && ( 
                      <Image
                      src={Itemdelete}
                      alt="delete"
                      preview={false}
                      className="cursor mx-2 mt-4"
                      height={17}
                      width={15.11}
                      onClick={() => {
                        setFileName("")
                        setFile("")
                        form.setFieldsValue({ file_releasepayment: null }); 
                        // form.validateFields(); 
                        setUploadError(""); 
                      }}
                    />)}
                    </div>
                      <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mt-4 release-payment-block">
                        <Col xs={24} sm={24} md={8} lg={8}>
                          <div className="subText_small mb-2 mt-2">
                            Seller name
                          </div>
                          <InputText
                            fieldname="name"
                            className="inputField mb-4 error-input"
                            rules={[
                              {
                                required: true,
                                message: "Name is required!",
                              },
                              {
                                whitespace: true,
                                message: "Enter valid name!",
                              },
                            ]}
                          >
                            <Input
                              type="text"
                              placeholder="Enter name here"
                              disabled
                            />
                          </InputText>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} className="space-arr">
                          <div className="subText_small mb-2 mt-2">
                            Seller bank
                          </div>
                          <InputText
                            className=" mb-4 "
                            fieldname="sellerBank"
                            rules={[
                              {
                                required: true,
                                message: "Please select bank",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select seller bank"
                              onChange={(value: string) => {
                                handeRoleChange(value, "sellerBank");
                              }}
                              showSearch
                              allowClear
                              optionFilterProp="children"
                            >
                              {bankDetails.map((item: any, index: any) => {
                                return (
                                  <Option key={index} value={item?.aliasName}>
                                    {item?.institutionName}
                                  </Option>
                                );
                              })}
                            </Select>
                          </InputText>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8}>
                          <div className="subText_small mb-2 mt-2">
                            Select date
                          </div>
                          <InputText
                            fieldname="scheduledDate"
                            className="inputField mb-4 w-100"
                            rules={[
                              {
                                required: true,
                                message: "Date is required!",
                              },
                            ]}
                          >
                            <DatePicker
                              placeholder="Select date"
                                format={{
                                  format: 'DD-MM-YYYY',
                                  type: 'mask',
                                }}
                              onChange={changeDate}
                              disabledDate={(current:any) =>
                                current.isBefore(moment().subtract(1, "day"))
                              }
                            />
                          </InputText>
                        </Col>
                      </Row>
                      <div className="">
                        <Button
                          key="submit"
                          type="primary"
                          htmlType="submit"
                          className="modal-button my-5"
                          loading={loading}
                        >
                          Submit
                        </Button>
                        <Button
                          type="primary"
                          className="modal-button-cancel my-5 mx-2"
                          loading={loading}
                          onClick={() => {
                            goBack();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div className="text-center mt-5">
                      {" "}
                      <Image
                        src={Payment_Success}
                        alt="success"
                        preview={false}
                      />
                      <div className="welcome mt-5">
                        <b>Payment has been released successfully!</b>
                      </div>
                      <SecondaryOutLineButton
                        children="Back to Dispute"
                        className="mt-3 mb-5 w-auto"
                      />
                    </div>
                  )}
                </Card>
              ) : (
                ""
              )}
              </DefaultLayout>
            </div>
            <Modal
              open={refundSuccess}
              onCancel={() => setRefundSuccess(!refundSuccess)}
              footer={false}
              className="modal-box text-center"
              width={410}
            >
              <div className="text-center p-3">
                <div className="mb-4">
                  <Image src={Payment_Success} alt="" height={"80px"} preview={false} />
                </div>
                <AuthTitle
                  children="Refund has generated successfully!"
                  className="mt-4"
                />
              </div>
            </Modal>
            <Modal
              open={refundFailure}
              onCancel={() => setRefundFailure(!refundFailure)}
              footer={false}
              className="modal-box text-center"
              width={410}
            >
              <div className="text-center p-3">
                <div className="mb-4">
                  <Image src={Reject} alt="" height={"80px"} preview={false} />
                </div>
                {failureMessage !== '' ? <AuthTitle
                  children={failureMessage}
                  className="mt-4"
                /> : <AuthTitle
                children="There is a issue in processing the refund. Please try again later."
                className="mt-4"/> }
              </div>
            </Modal>
            <Modal
              open={resolvedDispute}
              onCancel={() => setResolvedDispute(!resolvedDispute)}
              footer={false}
              className="modal-box text-center"
              width={410}
            >
              <div className="text-center p-3">
                <div className="mb-4">
                  <Image src={Payment_Success} alt="" height={"80px"} preview={false} />
                </div>
                <AuthTitle
                  children="Dispute resolved successfully!"
                  className="mt-4"
                />
              </div>
            </Modal>
    </div>
  );
};

export default ResolveDispute;
