import "../../auth/auth.scss";

import { AuthTitle, BoldText, NormalText, SmallText } from "../../ui-elements/TextRepo";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Radio,
  Row,
  Tooltip,
  Select,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  SecondaryOutLineButton,
  ViewButton,
} from "../../ui-elements/ButtonRepo";
import moment from "moment";
import { getContractDetails, getPaymentDetails } from "../../../services/admin";
import { USER_TYPE_TEXT, docRegex, getLocalStorage, modifyCresetUserType } from "../../Common/Constants";
import Signature from "../Signature";
import { useNavigate } from "react-router-dom";
import AddContract from "../../../assets/img/addContract.svg";
import { EscrowTermsandCondition, SpecialTermsAndCondition } from "../../Common/RouteConst";
import { CalculateTransactionFee } from "../../Common/InvoiceCalculations";
import infoIcon from "../../../assets/img/informIcon.svg";
import closeicon from "../../../assets/img/closeicon.svg";
import SourceOfFunds from "./SourceOfFunds";
const { Option } = Select;
let maxMilestoneCount = parseInt(process.env.MAX_MILESTONE_COUNT as string);
maxMilestoneCount = !isNaN(maxMilestoneCount) && maxMilestoneCount > 1 ? maxMilestoneCount : 5;

const PaymentRelease = (props: object|any):any => {
  const {
    formValues,
    isMatchAmount,
    form,
    leftAmount,
    setLeftAmount,
    contractId,
    doneSubmit,
    signature,
    setSignature,
    signatureId,
    setSignatureId,
    setLoading,
    signatureReq,
    setRequriedDoc,
    setsignatureReq,
    buyerAmount,
    invoiceCalculations,
    isDraft,
    isDraftedContract,
    setSourceOfFundIds,
    sourceOfFundIds,
    setSourceOfFundUrls,
    sourceOfFundUrls,
  } = props;
  const [didsubmit, setdidsubmit] = useState<any>("DEFAULT");
  const [showConfirmationPopup, setshowConfirmationPopup] = useState(false);
  const [documents, setDocuments] = useState<any>([]);
  const [showMilestone, setShowMilestone] = useState<any>(false);
  const [Width, setWidth] = useState(window?.screen?.width);
  const [editMilestoneStatus, setEditMilestoneStatus] = useState<any>();
  const [contractDetail, setContractDetail] = useState<any>({});
  const [milestoneList, setMilestoneList] = useState<any>([
    { id: 1, name: "", releaseDate: "", amount: "", document: [] },
    { id: 2, name: "", releaseDate: "", amount: "", document: [] },
  ]);
  const [size] = useState<any>("default");
  const [location, setlocation] = useState("");
  const navigate = useNavigate();
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const userType = local ? JSON.parse(local)?.userType : "";
  const [isAgreementFull, setIsAgreementFull] = useState(true); 

  const onCheckboxChange = (e: any) => {
    const checked = e.target.checked;
    setIsAgreementFull(checked);
    form.setFieldsValue({ isAgreementFull: checked });
  };

  useEffect(() => {
    // if (contractDetail?.isAgreementFull !== undefined) {
      const value = contractDetail?.isAgreementFull ?? true;
      setIsAgreementFull(value);
      form.setFieldsValue({ isAgreementFull: value });
    // }
  }, [contractDetail]);

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  React.useEffect(() => {
    const unblock: any = (data: any) => {
      setlocation(window?.location.pathname);
      if (
        window?.location.pathname !== "/create-escrow-transaction" &&
        data === 1
      ) {
        // setshowConfirmationPopup(true);
        return false;
      }
    };
    return () => {
      unblock(didsubmit);
      setdidsubmit(0);
    };
  }, [didsubmit]);

  useEffect(() => {
    if (doneSubmit === true) {
      setdidsubmit(0);
    }
  }, [doneSubmit]);

  const handleApproveCancel = () => {
    setshowConfirmationPopup(false);
    return false;
  };

  const handleApprove = () => {
    setshowConfirmationPopup(false);
    navigate(`${location}`);
  };
  useEffect(() => {
    resetMilestoneValues()
  },[formValues.invoiceAmount])

  useEffect(() => {
    if (contractId !== undefined) {
      getContractDetails(contractId, userAlias, isDraftedContract == "true" ? "draft" : "")
        .then((response: any) => {
          setContractDetail(response?.data);
          if (
            ["0","1","12"].includes(response?.data?.contractStatus)
          ) {
            getPaymentDetails(contractId, isDraftedContract == "true" ? "draft" : "")
              .then((resp: any) => {  
                
                if (resp?.data?.sourceOfFunds?.length > 0) {
                  setSourceOfFundIds(resp.data.sourceOfFunds.map((f: any) => f?.id));
                  setSourceOfFundUrls(resp.data.sourceOfFunds.map((f: any) => f?.url)); 
                } else {
                  setSourceOfFundIds([]);
                  setSourceOfFundUrls([]);
                }
                setLeftAmount(resp?.data?.buyerTotalAmount ?? resp?.data?.invoiceAmount);
                setEditMilestoneStatus(resp?.data?.isMilestone);
                if (resp?.data?.isMilestone === true) {
                  setShowMilestone(true);
                  form.setFieldsValue({
                    isMilestone: true,
                    milestoneCount: resp?.data?.milestoneList?.length,
                  });
                  const obj = [];
                  let sumOfBuyerAmountMilestone = 0;
                  let sumOfMilestonePercent = 0;
                  for (let i = 0; i < resp?.data?.milestoneList?.length; i++) {
                    obj.push({
                      id: i + 1,
                      name: "",
                      releaseDate: "",
                      amount: "",
                      document: [],
                    });
                    const calculations = CalculateTransactionFee({
                      invoiceAmount:resp?.data?.invoiceAmount,              
                      transactionAmount: resp?.data?.milestoneList[i].transactionAmount, 
                      plateformFees: resp?.data?.platformCharge, 
                      platformChargeType: resp?.data?.platformChargeType, 
                      vatCharges: resp?.data?.vatCharges, 
                      buyerPercent: resp?.data?.buyerPercent, 
                      sellerPercent: resp?.data?.sellerPercent, 
                      hasAdvisor: resp?.data?.escrowAdvisorAlias && ![resp?.data?.buyerAlias, resp?.data?.sellerAlias].includes(resp?.data?.escrowAdvisorAlias),
                      escrowCommission: resp?.data?.escrowAdvisorCommission,
                      buyerCommissionPercent: resp?.data?.buyerCommissionPercent,
                      sellerCommissionPercent: resp?.data?.sellerCommissionPercent ,
                      minimumPlatformCharge: resp?.data?.minimumPlatformCharge,
                      entityType: resp?.data?.itemCategoryEntityType
                    }) 
                    
                    
                    form.setFieldsValue({
                      [`milestone_${i}`]: {
                        name: resp?.data?.milestoneList[i].name,
                      },
                    });
                    form.setFieldsValue({
                      [`milestone_${i}`]: {
                        amountPercent:calculations?.milestonePercent,
                      },
                    });
                    sumOfMilestonePercent += Number(calculations?.milestonePercent);
                    sumOfBuyerAmountMilestone += Number(calculations?.buyerAmount);
                    if(i !== 0 && i === resp?.data?.milestoneList.length-1) {
                      const totalBuyerAmount = resp?.data?.buyerTotalAmount ?? 0;
                      if(Number(totalBuyerAmount) < sumOfBuyerAmountMilestone) {
                        const diff = (sumOfBuyerAmountMilestone - Number(totalBuyerAmount)).toFixed(2);
                        if(Number(diff) <= 0.01) {
                          calculations.buyerAmount = (Number(calculations?.buyerAmount) - Number(diff)).toFixed(2);
                        } else {
                          calculations.buyerAmount = (Number(totalBuyerAmount)- (sumOfBuyerAmountMilestone - Number(calculations?.buyerAmount))).toFixed(2);
                        }
                        setLeftAmount(0);
                      } else if(Number(totalBuyerAmount) > sumOfBuyerAmountMilestone) {
                        const diff = (Number(totalBuyerAmount) - sumOfBuyerAmountMilestone).toFixed(2);
                        setLeftAmount(0);
                        if(Number(diff) <= 0.01) {
                          calculations.buyerAmount = (Number(calculations?.buyerAmount) + Number(diff)).toFixed(2);
                        } else if(sumOfMilestonePercent === 100) {
                          calculations.buyerAmount = (Number(totalBuyerAmount)- (sumOfBuyerAmountMilestone - Number(calculations?.buyerAmount))).toFixed(2);
                        } else {
                          setLeftAmount(diff);
                        }
                      } else {
                        setLeftAmount(0);
                      }
                    }
                    form.setFieldsValue({
                      [`milestone_${i}`]: {
                        amount: resp?.data?.milestoneList[i].totalTransactionAmount //calculations?.buyerAmount,
                      },
                    });
                    form.setFieldsValue({
                      [`milestone_${i}`]: {
                        releaseDate: moment(
                          resp?.data?.milestoneList[i].releasedDate
                        ),
                      },
                    });
                    form.setFieldsValue({
                      [`milestone_${i}`]: {
                        document: resp?.data?.milestoneList[i]?.documentList?.map((item: any) => item?.name),
                      },
                    });
                  }
                  setMilestoneList(obj);
                  form.setFieldsValue({ depositeFullFund: resp?.data?.depositeFullFund });
                } else if (resp?.data?.isMilestone === false) {
                  const obj2: any = [];
                  if (isDraftedContract == "true") {
                    resp.data.milestoneList = [resp?.data?.milestoneList];
                  }
                  resp?.data?.milestoneList.forEach((milestone: any) => {
                    milestone?.documentList?.forEach((doc: any) => {
                      obj2.push(doc?.name);
                    });
                    // setDocuments(obj2);
                    // setRequriedDoc(obj2)
                    // setEditDoc(true);
                  });
                  
                  if(obj2.length){
                    setDocuments(obj2);
                    setRequriedDoc(obj2)
                  }else{
                    if(resp?.data?.documentList && resp?.data?.documentList.length){
                      const docs = resp?.data?.documentList.map((a:any)=>a.name).filter(Boolean);
                      setDocuments(docs);
                      setRequriedDoc(docs);
                    }
                  }
                  
                  setShowMilestone(false);
                  form.setFieldsValue({ isMilestone: false });
                  form.setFieldValue("isAgreementFull",resp?.data?.isAgreementFull)
                }
              })
              .catch(() => {
                message.error(
                  "Could not fetch details. Please try again later!"
                );
              });
            if (response?.data?.contractStartedBy === "SELLER") {
              form.setFieldsValue({
                contractStartedBy: "SELLER",
                buyerCountry: response?.data?.buyerDetails?.countryAlias,
              });
            }
          }
        })
        .catch(() => {
          message.error("Could not fetch details. Please try again later!");
        });
    }
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);
  const resetMilestoneValues = async() => {
    const getInvoiceAmount = form.getFieldValue('invoiceAmount')
    if(getInvoiceAmount && formValues.invoiceAmount && Number(formValues.invoiceAmount ?? 0) !== getInvoiceAmount) {
      for (let i = 0; i < milestoneList.length; i++) {
        const fieldValues = form.getFieldsValue([`milestone_${i}`]);
        const milestoneKey = Object.keys(fieldValues)[0];
        
        // Check if milestoneKey exists and fieldValues[milestoneKey] is defined
        if (milestoneKey && fieldValues[milestoneKey] && !isDraft) {
          fieldValues[milestoneKey].amount = null;
          fieldValues[milestoneKey].amountPercent = null;
        }
      }
    }
  }
  const docChecker = (inputValue: string) => {
    // var myString = e.target.value.trim();
    // var withoutSpace = myString.replace(/ /g, "");
    if (inputValue && inputValue.trim().length > 0){
      setdidsubmit(1);
    }
  };
  const addDocument = () => {
    setdidsubmit(1);
    const _formValues = form.getFieldsValue();
    if (
      typeof _formValues.addDoc_ === "string" &&
      _formValues.addDoc_.trim() !== ""
    ) {
      let _docs = documents;

      for (const key in _formValues) {
        if (key.split("_")[0] === "addDoc") {
          if (_docs.includes(_formValues[key]) == false) {
            setDocuments([
              ...documents,
              _formValues[key].toString().replace(/\s+/g, " ").trim(),
            ]);
            _docs = [
              ...documents,
              _formValues[key].toString().replace(/\s+/g, " ").trim(),
            ];
          }
        }
      }
      for (let i = 0; i < _docs.length; i++) {
        form.setFieldsValue({ [`Doc_${i}`]: _docs[i] });
      }
      form.setFieldsValue({ addDoc_: null });
      setRequriedDoc(_docs);
    }
  };

  const removeDocument = (indexToRemove: number) => {
    const _docs = documents;
    setdidsubmit(1);
    _docs.splice(indexToRemove, 1);
    setDocuments([..._docs]);
    let i = 0;
    for (i = 0; i < _docs.length; i++) {
      form.setFieldsValue({ [`Doc_${i}`]: _docs[i] });
    }
    form.setFieldsValue({ addDoc_: null });
    setRequriedDoc(_docs);
  };

  const handleMilestoneChange = (count: number) => {
    const _milestones = [];
    setdidsubmit(1);
    setMilestoneList([]);
    for (let i = 1; i <= count; i++) {
      _milestones.push({
        id: i,
        name: "",
        releaseDate: "",
        amount: "",
        document: [],
      });
    }
    setMilestoneList(_milestones);
  };

  const children = [];
  for (let i = 1; i < 36; i++) {
    children.push(<Option key={i.toString()}>{i.toString()}</Option>);
  }
  // const openTnC = () => {
  //   setVisible(true);
  // };

  // const changeAmountValue = (e: any) => {
  //   const percent = e.target.value;
  //   const index = e.target.id.split("_")[1];
  //   form.setFieldsValue({
  //     [`milestone_${index}`]: {
  //       amount: ((buyerAmount * percent) / 100).toFixed(2),
  //     },
  //   });
  //   let enteredAmount = 0;
  //   for (let i = 0; i < milestoneList.length; i++) {
  //     const milestoneKey = Object.keys(
  //       form.getFieldsValue([`milestone_${i}`])
  //     )[0];
  //     const amount = form.getFieldsValue([`milestone_${i}`])[milestoneKey].amount;
  //     if (amount) {
  //       enteredAmount += Number(amount);
  //     }
  //   }
  //   let amountOverPercent = Number(((buyerAmount * percent) / 100).toFixed(2));
  //   const difference = (buyerAmount - enteredAmount).toFixed(2)
  //   if(Number(difference) === 0.01 ) {
  //     amountOverPercent += 0.01
  //     enteredAmount += 0.01
  //   } else if(Number(difference) === -0.01 ) {
  //     enteredAmount -= 0.01
  //     amountOverPercent -= 0.01
  //   }
  //   if( Number(difference) === 0.01 || Number(difference) === -0.01){
  //     form.setFieldsValue({
  //       [`milestone_${index}`]: {
  //         amount: (amountOverPercent).toFixed(2),
  //       },
  //     });
  //   }
  //    const value: any = (buyerAmount - enteredAmount).toFixed(2);
  //   setLeftAmount(value > 0.01 ? value : 0);
  // };

  const changePercentValue = (e: any) => {
    const enteredAmount = e.target.value;
    const index = e.target.id.split("_")[1];
    form.setFieldsValue({
      [`milestone_${index}`]: {
        amountPercent: ((enteredAmount / invoiceCalculations.totalAmount) * 100).toFixed(2),
      },
    });
    let remainingAmount = 0;
    for (let i = 0; i < milestoneList.length; i++) {
      const milestoneKey = Object.keys(
        form.getFieldsValue([`milestone_${i}`])
      )[0];
      const amount = form.getFieldsValue([`milestone_${i}`])[milestoneKey].amount;
      if (amount) {
        remainingAmount += Number(amount);
      }
    }
     const value: any = (buyerAmount - remainingAmount).toFixed(2);
    setLeftAmount(value > 0.01 ? value : 0);
  }

  const handleMilestone = (value: any) => {
    setdidsubmit(1);
    if (value) {
      setShowMilestone(true);
      if (editMilestoneStatus === true) {
        setDocuments([]);
      }
    } else {
      setShowMilestone(false);
    }
  };
  // const openTnC = (e: any) => {
  //   setClicked(true);
  //   setVisible(e?.target?.checked);
  // };
  const {contractStartedBy} = form.getFieldsValue(['contractStartedBy'])
  const milestoneArr = new Array(maxMilestoneCount - 1).fill(null);
  return (
    <>
      <div className="m-0">
        <div className="stepDetails_medium_light fw-400 mb-2 mt-3 ">
          For payment to be released, {modifyCresetUserType(userAlias,'seller')} has to provide the following
          document as proof for TrustIn&apos;s verification.
        </div>
        { userType != USER_TYPE_TEXT.ESCROW_ADVISOR && ( <>
        <div className="stepDetails_medium_light fw-400 mb-2 mt-3 ">
          Do you want to release the payment in parts i.e. basis defined
          payment milestones?
        </div>
        {editMilestoneStatus === true ? (
          <Form.Item name="isMilestone" initialValue={true} className="radioInput m-0">
            <Radio.Group className="m-0">
              <Radio value={true} onChange={() => handleMilestone(true)}>
                Yes
              </Radio>
              <Radio value={false} onChange={() => handleMilestone(false)}>
                No
              </Radio>
            </Radio.Group>
          </Form.Item>
        ) : (
          <>
            {editMilestoneStatus === false ? (
              <Form.Item name="isMilestone" className="radioInput m-0">
                <Radio.Group className="m-0" defaultValue={false}>
                  <Radio value={true} onChange={() => handleMilestone(true)}>
                    Yes
                  </Radio>
                  <Radio value={false} onChange={() => handleMilestone(false)}>
                    No
                  </Radio>
                </Radio.Group>
              </Form.Item>
            ) : (
              <Form.Item name="isMilestone" initialValue={showMilestone} className="radioInput m-0">
                <Radio.Group className="m-0">
                  <Radio value={true} onChange={() => handleMilestone(true)}>
                    Yes
                  </Radio>
                  <Radio value={false} onChange={() => handleMilestone(false)}>
                    No
                  </Radio>
                </Radio.Group>
              </Form.Item>
            )}
          </>
        )}
        </>)  }
        
        {!showMilestone && (
          <>
            <div className="subText_small mt-3">Required documents (Maximum 300 words only)</div>

            <Row gutter={16} className="py-3">
              <Col span={Width > 992 ? 16 : 20} className="d-flex align-items-center">
                <Form.Item
                  name={`addDoc_`}
                  rules={[
                    {
                      pattern: docRegex,
                      message: "Invalid document name",
                    },
                    {
                      validator(_, _value) {
                        if (documents?.length === 0 && !isDraft) {
                          return Promise.reject("Please add atleast one document!")
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                  className="inputField w-100 customContract error-input"
                >
                  <Input
                    placeholder="Name of document to be included as completion proof"
                    maxLength={300}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (inputValue.length >= 300) {
                        message.error("Maximum characters limit reached (300).");
                        return;
                      }
                      docChecker(inputValue);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={Width > 992 ? 8 : 4} className="d-flex align-items-center">
                <Image
                  src={AddContract}
                  className={Width > 550 ? "cursor px-3" : "cursor px-0"}
                  alt="add"
                  preview={false}
                  onClick={() => {
                    addDocument();
                  }}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              {documents.map((tag: any, index: number) => (
                <div key={index} className="reqDoc d-flex mx-2 mb-3 description-inputfield">
                  <div className="product-details-word-wrap">{tag}</div>
                  <div
                    className="px-3 cursor"
                    onClick={() => {
                      removeDocument(index);
                    }}
                  >
                    <img src={closeicon} alt="close_icon"/>
                  </div>
                </div>
              ))}
            </Row>
          </>
        )}
      </div>
      {showMilestone && (<>
        <Row>
        <Col>
            <Form.Item
              name="depositeFullFund"
              valuePropName="checked"
              className="inputField w-100 radioInput m-0"
            > 
              <div style={{ display: 'flex', alignItems: 'center', width: 'auto' }}>
                <Checkbox className="m-0">
                  <Tooltip
                    title={
                      <span className="" style={{width: "100%", whiteSpace: "normal", wordWrap: "break-word"}}>
                        Check this box if you require to get the entire agreed amount into the escrow account upfront. Note that while the full amount is deposited at once, disbursements to the seller will still occur according to the defined payment milestones.
                      </span>
                    }
                    overlayClassName="custom-tooltip info-icon"
                    overlayStyle={{maxWidth: "50%"}}
                    placement={Width > 475 ? "right" : "top"}
                  >
                    <SmallText
                      className="formSubText forgetpassword fw-bold"
                      style={{ textAlign: "start", marginLeft: '8px',}}
                      children= { <>
                        Deposit full fund 
                        <img src={infoIcon} className="ms-1" />
                      </> }
                    />
                  </Tooltip>
                </Checkbox>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={24} xs={24}>
            <Form.Item
              labelCol={{ span: 24 }}
              label="Select milestone count"
              name="milestoneCount"
              className="mb-4"
            >
              <Select
                placeholder="Milestones count"
                onChange={handleMilestoneChange}
                defaultValue={2}
              >
                {
                  milestoneArr.map((_:any, index:number) => {
                    const value = index + 2;

                    return <Option key={value} value={value}>{value} </Option>
                  })
                }
              </Select>
            </Form.Item>
          </Col>
            <Col span={24} >
          {milestoneList.map((milestone: any, index: number) => (
            <Card key={index} className="border-0 hide-divider">
              <Row gutter={Width < 992 ?[8,8]:[0,0]}>
                <Col span={Width > 992 ? 2 : Width < 550 ? 12: 8 }>
                 <p className="mb-0">S no.</p>
                 <Form.Item
                    name={[`milestone_${index}`, "id"]}
                    initialValue={milestone.id}
                    className="milestoneInput "
                  >
                    <Input disabled />
                 </Form.Item>
                </Col>
                <Col span={Width > 992 ? 6 : Width < 550 ? 12: 8 } className={Width > 992 ? "mx-2" : "mx-0"}>
                <p className="mb-0">Name</p>
                <Form.Item
                  className="milestone-inputField error-input"
                    name={[`milestone_${index}`, "name"]}
                    rules={[
                      {
                        required: !isDraft,
                        message: "Milestone name is required!",
                      },
                      {
                        whitespace: true,
                        message: "Invalid document!",
                        },
                        ]}
                >
                  <Input
                    placeholder="Milestone name"
                      maxLength={30}
                      onKeyPress={() => {
                        setdidsubmit(1);
                      }}
                    />
                </Form.Item>
                </Col>
                {/* <Col span={Width > 992 ? 2 :  Width < 550 ? 12: 8 } className={Width > 992 ? "ml-1" : "ml-0"}>
                  <p className="mb-0">Breakage</p>
                  <Form.Item
                            name={[`milestone_${index}`, "amountPercent"]}
                            rules={[
                              {
                                validator: (_,value) => {
                                  
                                  if (isDraft) return Promise.resolve(); 

                                  if (!value) {
                                    return Promise.reject(new Error("Amount percent is required!"));
                                  }

                                  let enteredPercent = 0;
                                  if(parseFloat(value) === 0) {
                                    return Promise.reject(new Error("Percentage must be greater than 0"));
                                  }
                                  for (
                                    let i = 0;
                                    i < milestoneList.length;
                                    i++
                                  ) {                                    
                                    const milestoneKey = Object.keys(
                                      form.getFieldsValue([`milestone_${i}`])
                                    )[0];
                                    const amountPercent = form.getFieldsValue([
                                      `milestone_${i}`,
                                    ])[milestoneKey].amountPercent;
                                    if (amountPercent) {
                                      enteredPercent += parseFloat(
                                        form.getFieldsValue([`milestone_${i}`])[
                                          milestoneKey
                                        ].amountPercent
                                      );
                                      const error = form.getFieldsError([[`milestone_${i}`,'amountPercent']])
                                      if(error?.length > 0  && error?.[0]?.errors?.length > 0) {
                                        form.setFields([
                                          {
                                            name: [`milestone_${i}`,'amountPercent'],
                                            errors: [], // Clear errors
                                          },
                                        ]);
                                      }
                                    }
                                  }
                                  return enteredPercent == 100
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        new Error(enteredPercent > 100 ? "Sum exceeds 100%" : "Sum less than 100%")
                                      );
                                },
                              },
                            ]}
                            className="milestoneInput error-input"
                          >
                            {formValues.invoiceAmount ? (
                              <Input
                                placeholder="Ex: 30"
                                onChange={changeAmountValue}
                                type={"number"}
                                suffix={"%"}
                                onInput={(e: any) => {
                                  setdidsubmit(1);
                                  e.target.value = Math.max(0, e.target.value)
                                    .toString()
                                    .slice(0, 3);
                                }}
                              />
                            ) : (
                              <Input placeholder="Ex: 30" disabled />
                            )}
                          </Form.Item>
                </Col> */}
                <Col span={Width > 992 ? 3 : Width < 550 ? 12: 8 } className={Width > 992 ? "mx-2" : "mx-0"}>
                <p className="mb-0">Amount</p>
                <Form.Item
                            name={[`milestone_${index}`, "amount"]}
                            rules={[
                              {
                                required: !isDraft,
                                message: "Milestone amount is required!",
                              },
                              {
                                validator: (_) => {
                                  if (isDraft) {
                                    return Promise.resolve();
                                  }
                                  let enteredAmount = 0;
                                  for (let i = 0; i < milestoneList.length; i++) {
                                    const milestoneKey = Object.keys(form.getFieldsValue([`milestone_${i}`]))[0];
                                    const amount = form.getFieldsValue([`milestone_${i}`])[milestoneKey]?.amount;
                                 
                                    if (amount) {
                                      enteredAmount += parseFloat(
                                        form.getFieldsValue([`milestone_${i}`])[
                                          milestoneKey
                                        ].amount
                                      );

                                      const error = form.getFieldsError([[`milestone_${i}`,'amount']])
                                      if(error?.length > 0  && error?.[0]?.errors?.length > 0) {
                                        form.setFields([
                                          {
                                            name: [`milestone_${i}`,'amount'],
                                            errors: [], // Clear errors
                                          },
                                        ]);
                                      }
                                    }
                                  }
                                  return Number((enteredAmount).toFixed(2)) <= parseFloat(invoiceCalculations.totalAmount) ? Promise.resolve()
                                    : Promise.reject(
                                      new Error(`Sum exceeds ${invoiceCalculations.totalAmount}`)
                                      );
                                },
                              },
                            ]}
                            className="milestoneInput error-input"
                          >
                            { formValues.invoiceAmount ? (
                              <Input
                                placeholder="Amount"
                                type={"number"}
                                onChange={changePercentValue}
                              /> 
                            ) : (
                              <Input placeholder="Ex: 1000" disabled />
                            )}
                          </Form.Item>
                </Col>
                <Col span={Width > 992 ? 4 : Width < 550 ? 12: 8 } className="">
                <p className="mb-0">Date</p>
                <Form.Item
                            name={[`milestone_${index}`, "releaseDate"]}
                            rules={[
                              {
                                required: !isDraft,
                                message: "Release date is required!",
                              },
                            ]}
                            className="milestone-inputField"
                          >
                            <DatePicker
                              format={{
                                format: 'DD-MM-YYYY',
                                type: 'mask',
                              }}
                              placeholder="Date"
                              disabledDate={(current:any) => {
                                return current < moment().add(-1, "days");
                              }}
                              onChange={() => setdidsubmit(1)}
                            />
                          </Form.Item>
                </Col>
                <Col span={Width > 992 ? 5 :  Width < 550 ? 12: 8 } className={Width > 992 ? "mx-1" : "mx-0"}>
                <p className="mb-0">Required docs</p>
                <Form.Item
                            name={[`milestone_${index}`, "document"]}
                            rules={[
                              {
                                required: !isDraft,
                                message: "Release doc is required!",
                              },
                              {
                                validator: (_, value) => {
                                  const totalLength = value ? value.reduce((acc: number, tag: string) => acc + (tag?.length || 0), 0) : 0;
                                  if (totalLength > 300) {
                                    return Promise.reject(new Error("Maximum characters limit reached (300)"));
                                  }
                                  return Promise.resolve();
                                },
                              },
                            ]}
                            className="milestone-inputField mt-1"
                          >
                            <Select
                              mode="tags"
                              size={size}
                              placeholder={"\u00A0\u00A0Required docs"}
                              showSearch={false}
                              style={{ width: "100%", overflowY: "scroll", scrollbarWidth: "thin", cursor: "text"}}
                              className="pb-2 multi_require"
                              maxTagCount={16}
                              dropdownStyle={{ display: "none" }}
                              onChange={() => {
                                setdidsubmit(1);
                              }}
                            ></Select>
                          </Form.Item>
                </Col>
              </Row>
              <Divider className="divider mt-0 mb-3" />
            </Card>
          ))}
          </Col>
        </Row>
        </>
      )}
      <>
        <Row>
          <Col span="12">
            <BoldText children="" className="text-danger" />
          </Col>
          <Col span="12">
            <BoldText children="" className="text-danger" />
          </Col>
          <Col span="12">
            <BoldText
              children="Total payable amount "
              className="total-amount"
            />
          </Col>
          {formValues.invoiceAmount && (
            <Col span="12">
              <BoldText
                children={`${formValues?.currency || "AED" } ${buyerAmount}`}
                className="text-end"
              />
            </Col>
          )}
          <Col span="12">
            <SmallText
              children={isMatchAmount}
              className="text-danger text-start"
            />
          </Col>
          {formValues?.invoiceAmount && showMilestone && leftAmount != 0 && (
            <Col span="12">
              <NormalText
                children={`${leftAmount} amount remaining`}
                className="text-start text-end"
              />
            </Col>
          )}
        </Row>
      </>
      { formValues?.userType == USER_TYPE_TEXT.BUYER ? (
        <>
        <hr className="lightgrayHr" />
        <SourceOfFunds
          setSourceOfFundIds={setSourceOfFundIds}
          sourceOfFundIds={sourceOfFundIds}
          setSourceOfFundUrls={setSourceOfFundUrls}
          sourceOfFundUrls={sourceOfFundUrls}
          setLoading={setLoading}
          isDraft={isDraft}
          form={form}
        />
        <Row>
          <ul className="stepDetails_medium_sub mt-4">
            <li>
              This is required to comply with financial regulations. Please upload Bank Account Statements showing the source of funds for this transaction.
            </li>
          </ul>
        </Row>
        </>
      ) : null}
      { formValues?.userType !== USER_TYPE_TEXT.ESCROW_ADVISOR ? (
        <>
        <hr className="lightgrayHr" />
        <Signature
          signature={signature}
          signatureId={signatureId}
          setSignature={setSignature}
          setSignatureId={setSignatureId}
          setLoading={setLoading}
          name="fromSign"
          signatureReq={signatureReq}
          setsignatureReq={setsignatureReq}
          contractExist={false}
          isDraft={isDraft}
        />
        <Row>
          <ul className="stepDetails_medium_sub mt-4">
            <li>
              TrustIn will check the documents against the agreement and
              payment will be released to the {modifyCresetUserType(userAlias,'seller')}.
            </li>
            <li>
              We will notify both the parties by email on every action and steps.
              Involved parties can track the live status on the platform as well.
            </li>
          </ul>
        </Row>
        </>
      ) : null}
      <Form.Item
        name="isAgreementFull"
        valuePropName="checked"
        className={Width > 425 ? "inputField w-100 radioInput" : "inputField w-100 radioInput mt-4"}>
        {
          contractStartedBy === USER_TYPE_TEXT.BUYER &&
          <div className="checkbox-contain">
          <Checkbox style={{flexShrink: 0}}  checked={isAgreementFull} onChange={onCheckboxChange} />
              <SmallText
                className="formSubText forgetpassword"
                  children={
                    <>
                      I, hereby authorize Trustin Limited to release the payment to the seller at the time of fulfilment of the escrow conditions.
                    </>
                  }
                  style={{ marginLeft: "8px", textAlign: "start", flex: 1 }}
              />
          </div>
        }
      </Form.Item>
     
      <hr className={Width > 425 ? "lightgrayHr mb-4" : "lightgrayHr mb-4 mt-5"} />

      <Form.Item
        name="agreement"
        valuePropName="checked"
        className="inputField w-100 radioInput"
        rules={[
          {
            validator: (_, value) =>
              !isDraft
                ? value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Please read and agree!"))
                : Promise.resolve(),
          },
        ]}
      >
        <Checkbox
          className="mt-1"
        >
          <SmallText
            className="formSubText forgetpassword agreeEscrow"
              children={
                <>
                  I agree to your{" "}
                  <ViewButton
                    className="mb-0 escrowTerms"
                    children="Escrow Terms & Conditions"
                    onClick={()=>{
                      let tncLink = EscrowTermsandCondition;
                      const specialUsers = process.env.SPECIAL_USER_ALIASES ? process.env.SPECIAL_USER_ALIASES.split(','): [];
                      if (SpecialTermsAndCondition 
                        && specialUsers.includes(userAlias)
                      ) {
                        tncLink = SpecialTermsAndCondition;
                      }
                      window.open(tncLink,'_blank')
                    }}
                  />
                </>
              }
              style={{ textAlign: "start" }}
          />
        </Checkbox>
      </Form.Item>
      <br />          
      <Modal
        className="text-center modal-box"
        open={showConfirmationPopup}
        closable={false}
        footer={false}
        width={340}
        onCancel={() => handleApproveCancel()}
      >
        <AuthTitle children="Leave page?" className="" />
        <NormalText
          children="Changes you made may not be saved!"
          className="mb-4"
        />
        <div className="ant-modal-footer modalFooter">
          <SecondaryOutLineButton
            key="cancel"
            className="cancel"
            onClick={() => {
              handleApproveCancel();
            }}
          >
            Cancel
          </SecondaryOutLineButton>
          <Button
            onClick={() => {
              handleApprove();
            }}
            type="primary"
            className="reject_btn"
            style={{ height: "40px" }}
          >
            Yes
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PaymentRelease;
