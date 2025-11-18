import { Button, Collapse, Image, message, Steps, Tooltip, notification, Upload ,Input } from "antd";
import orangeTick from "../../assets/img/orange_tick.svg";
import greenTick from "../../assets/img/green_tick.svg";
import User from "../../assets/img/userHalf.svg";
import Calendar from "../../assets/img/Calendar.svg";
import ClockLight from "../../assets/img/clock_light.svg";
import AddContract from "../../assets/img/addContract.svg";
import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { NormalBoldText, NormalText } from "../ui-elements/TextRepo";
import { USER_TYPE_TEXT, acceptedDocsFileTypes, getLocalStorage, modifyCresetUserType, ordinalSuffixOf } from "../Common/Constants";
import Suitcase from "../../assets/img/sellerJob.svg";
import { getTransactionLinkList } from "../../services/admin";

import { updatePlatformStatus } from "../../services/trustee";
// import { CalculateTransactionFee } from "../Common/InvoiceCalculations";

const { TextArea } = Input;

const EscrowTransationHistorySteps = (props: any) => {
  const { contractDetail, paymentDetails, contractHistory, taxDetails,getContractStages,_fetchPaymentConditions,checked} = props;
  const authData = JSON.parse(getLocalStorage("auth")!);
  const userType = authData?.userType;
  const userAlias = authData?.userAlias;
  const [currentStep, setcurrentStep] = useState(0);
  const [list, setList] = useState<any>([]);
  const [milestonecurrentStep, setmilestonecurrentStep] = useState(0);
  const [milestonelist, setmilestoneList] = useState<any>([]);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [milestoneAddedFundAmount, setMilestoneAddedFundAmount] = useState<any>({});
  const [photoId, setPhotoId] = useState<string>("");
  
  const commentRef = useRef<any>(null);
  const [key, setKey] = useState(0);

  const [loading, setLoadding] = useState<any>(false);
  const local = getLocalStorage("auth");
  
  const Token = local ? JSON.parse(local)?.token : "";
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const setWidthVal = () => {
    setWidth(document?.body?.clientWidth);
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      getContractStages()
      _fetchPaymentConditions()
    },5000) // changed 5(5000)sec to 1(60000)min
    return () => clearInterval(intervalId)
  },[])
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  const openNotification = (msg = "") => {
    notification.info({
      message: "Error",
      description: msg ? msg : "Try again later!",
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    });
  };
  
  const InActive = (special = false) => {
    return <div className={special ? "inactivecircle-small" : "inactivecircle"} ></div>;
  };
  const Active = (special = false) => {
    setcurrentStep(currentStep + 1);
    return <Image src={special ? greenTick : orangeTick} preview={false} width={special ? '70%' : '100%'}/>;
  };
  const MilestoneInActive = () => {
    return <div className="inactivecircle"></div>;
  };
  const MilestoneActive = () => {
    setmilestonecurrentStep(milestonecurrentStep + 1);
    return <Image src={orangeTick} preview={false} />;
  };
  const { Panel } = Collapse;

  const getVaTransactionList = async (milestoneAlias: string) => {
    if(!milestoneAlias){
      return;
    }
    try{
      const response = await getTransactionLinkList(milestoneAlias);
      const transactionLinks = response?.data?.VATransactionLinkList ?? [];
      const totalAmount = transactionLinks && transactionLinks?.length > 0 ? transactionLinks.reduce((sum: any, element: any) => sum + Number(element?.Amount || 0), 0) : 0;
      const transaction: any = {};
      transaction[milestoneAlias] = totalAmount
      setMilestoneAddedFundAmount((prevState: any) => ({
        ...prevState,
        [milestoneAlias]: totalAmount,
      }))
    }catch(error: any) {
      const errorMessage = error?.data?.message || error?.data?.[0]?.message || error?.error || "Internal server error";
      openNotification(errorMessage);
    }
  }
  useEffect(() => {
    const fetchAllTransactions = async () => {
      if (paymentDetails?.milestoneList?.length > 0) {
        await Promise.all(
          paymentDetails.milestoneList.map(async (milestone: any) => {
            if (milestone?.aliasName) {
              await getVaTransactionList(milestone.aliasName);
            }
          })
        );
      }
    };
  
    fetchAllTransactions();
  },[paymentDetails])
  

  useEffect(() => {
    const statusList = [];
    let step = {
      title: "",
      icon: {},
      description: {},
    };
    const tempdata: any = [];
    let fileList: any = 0;
    let msList: any = [];
    const isMilestone = paymentDetails?.isMilestone;
    const contractStatus = parseInt(contractDetail?.contractStatus);
    const isContractStartedByAdvisor = contractDetail?.contractStartedBy === USER_TYPE_TEXT?.ESCROW_ADVISOR;
    const hasAdvisor = contractDetail?.escrowAdvisorAlias && ![contractDetail?.buyerAlias, contractDetail?.sellerAlias].includes(contractDetail?.escrowAdvisorAlias) && userAlias == contractDetail?.escrowAdvisorAlias
    if(isMilestone){
      paymentDetails?.milestoneList.forEach((milestone: any)=>{
        fileList += (milestone?.documentStatus === "UPLOADED" || milestone?.documentStatus === "VERIFIED") && milestone?.documentStatus !== null ? milestone?.documentList.length : 0;
        if(taxDetails?.plateformFees) {
          if(milestone?.buyerTransactionAmount === null && milestone?.totalTransactionAmount === null) {
            // getTransactionDetails(paymentDetails,milestone)
          }
        }
      })
      if (contractStatus == -1) {
        //transaction rejected
        step = {
          title: "Escrow transaction rejected",
          icon: Active(),
          description:
            contractHistory &&
            contractHistory["reject"] &&
            description(contractHistory["reject"]),
        };
        statusList.push(step);
      } else {
        if (contractStatus !== 0) {
          //transaction initiated
          step = {
            title: "Escrow transaction initiated",
            icon: Active(),
            description: description(contractHistory["SEND"]),
          };
          statusList.push(step);
        }
        if (
          (!paymentDetails?.isDispute || contractStatus >= 2) 
          && !isContractStartedByAdvisor
        ) {
          //transaction acccepted
          step = {
            title: "Escrow transaction accepted",
            icon:
            contractStatus < 2 || contractStatus === 6
                ? InActive()
                : Active(),
            description: contractStatus >= 2 &&
              contractHistory &&
              contractHistory["ACCEPT"] &&
              description(contractHistory["ACCEPT"]),
          };
          statusList.push(step);
        }
        if( paymentDetails.sourceOfFunds || ( paymentDetails?.sourceOfFunds?.length > 0 &&
          ["APPROVED","REJECTED"].includes(paymentDetails.sourceOfFundStatus))
        ) {
          if(contractHistory["SOURCE_OF_FUNDS"]){
            contractHistory["SOURCE_OF_FUNDS"] = {
              ...contractHistory["SOURCE_OF_FUNDS"],
              "status": paymentDetails.sourceOfFundStatus
            }
          }
          step = {
            title: "Source of funds",
            icon:
            ["APPROVED","REJECTED"].includes(paymentDetails.sourceOfFundStatus)
                ? Active()
                : InActive(),
            description:
            ["APPROVED","REJECTED"].includes(paymentDetails.sourceOfFundStatus) &&
              contractHistory &&
              contractHistory["SOURCE_OF_FUNDS"] &&
              description(contractHistory["SOURCE_OF_FUNDS"]),
          };
          statusList.push(step);
        }
        // milestone list
        if( paymentDetails?.milestoneList?.length > 0 && contractHistory && Object.keys(contractHistory).length > 0) {
          paymentDetails?.milestoneList?.map(async (_item: any, index: any) => {
            if(!paymentDetails?.isDispute || ['COMPLETED','INPROGRESS'].includes(_item?.paymentStatus) || contractHistory[_item.aliasName ]?.["ADD_FUND"]?.transactionAlias === _item.aliasName) {
              //transaction fund added
              if( contractHistory[_item.aliasName ]?.["ADD_FUND"]) {
                contractHistory[_item.aliasName ]["ADD_FUND"] = {
                  ...contractHistory[_item.aliasName ]["ADD_FUND"],
                  "currency": paymentDetails?.currency,
                  "amount": milestoneAddedFundAmount?.[_item?.aliasName] ?? 0,
                  "status": _item?.paymentStatus === "INPROGRESS" ? "(In progress)" : "" 
                }
              }
              step = {
                title: "Fund added",
                icon: ['COMPLETED','INPROGRESS'].includes(_item?.paymentStatus) && contractHistory[_item.aliasName ]?.["ADD_FUND"]?.transactionAlias === _item.aliasName 
                    ? MilestoneActive()
                    : MilestoneInActive(),
                description: ['COMPLETED','INPROGRESS'].includes(_item?.paymentStatus) && contractHistory[_item.aliasName ]?.["ADD_FUND"] && contractHistory[_item.aliasName ]?.["ADD_FUND"]?.transactionAlias === _item.aliasName &&
                  description(contractHistory[_item.aliasName ]?.["ADD_FUND"]),
              }
              msList.push(step);
            }
            if(!paymentDetails?.isDispute || _item?.isTransactionVerified) {
              //transaction verified
              step= {
                title: "Transaction Verified",
                icon:
                _item?.isTransactionVerified  ? MilestoneActive()
                : MilestoneInActive(),
                description:
                _item?.isTransactionVerified &&
                  contractHistory && contractHistory[_item.aliasName ]["VERIFIED"]?.transactionAlias === _item.aliasName && 
                  contractHistory[_item.aliasName ]["VERIFIED"] &&
                  description(contractHistory["VERIFIED"]),
              }
              if (!hasAdvisor) {
                msList.push(step);
              }
            }
            if(!paymentDetails?.isDispute || (paymentDetails?.filelist?.length / fileList == 1 &&
              contractHistory[_item.aliasName ]?.["DOCUMENT_UPLOADED"]?.transactionAlias === _item.aliasName)) {
                //document uploaded
                step = {
                  title: "Document Uploaded",
                  icon:
                  paymentDetails?.filelist?.length / fileList == 1 && contractHistory[_item.aliasName ]?.["DOCUMENT_UPLOADED"]?.transactionAlias === _item.aliasName
                      ? MilestoneActive()
                      : MilestoneInActive(),
                  description: paymentDetails?.filelist?.length / fileList == 1 &&
                    contractHistory && contractHistory[_item.aliasName ]?.["DOCUMENT_UPLOADED"]?.transactionAlias === _item.aliasName && 
                    contractHistory[_item.aliasName ]?.["DOCUMENT_UPLOADED"] &&
                    description(contractHistory[_item.aliasName ]?.["DOCUMENT_UPLOADED"]),
                }
                if (!hasAdvisor) {
                  msList.push(step);
                }
            }
            if (!paymentDetails?.isDispute || (paymentDetails?.filelist?.length > 0 && contractHistory[_item.aliasName ]?.["DOCUMENT_VERIFIED"]?.transactionAlias === _item.aliasName)) {
              if (paymentDetails?.filelist) {
                const verified = paymentDetails?.filelist?.length > 0 && paymentDetails?.filelist?.[0]?.verified;
                const key = verified === "REJECTED" ? 'DOCUMENT_REJECTED' : 'DOCUMENT_VERIFIED' 
                //document verified
                step= {
                  title: "Document Verified",
                  icon: ['VERIFIED','REJECTED'].includes(verified)
                    && contractHistory[_item.aliasName ]?.[key]?.transactionAlias === _item.aliasName
                      ? MilestoneActive()
                      : MilestoneInActive(),
                  description: ['VERIFIED','REJECTED'].includes(verified) &&
                    contractHistory && contractHistory[_item.aliasName]?.[key]?.transactionAlias === _item.aliasName &&
                    contractHistory[_item.aliasName]?.[key] &&
                    description(contractHistory[_item.aliasName ]?.[key]),
                }
                if (!hasAdvisor) {
                  msList.push(step);
                }
              }
            }
            if(!paymentDetails?.isDispute 
              || (paymentDetails?.filelist?.length > 0 
                && paymentDetails?.filelist?.[0].verified === "VERIFIED" 
                && (_item?.trusteeApproveStatus === "1" && contractHistory[_item.aliasName ]?.["DOCUMENT_APPROVED"]?.transactionAlias === _item.aliasName 
                  || _item?.approveStatus === "1" && contractHistory[_item.aliasName ]?.["DOCUMENT_APPROVED_ADMIN"]?.transactionAlias === _item.aliasName ))) {
              //document approved
              let crtDescription:any = false;
              const descriptionArr = [];
              const isVerified = paymentDetails?.filelist?.length > 0 && paymentDetails?.filelist?.[0].verified === "VERIFIED";
              const trusteeApproveStatus = _item?.trusteeApproveStatus === "1"
              const approveStatus = _item?.approveStatus === "1"
              const isDocumentApprovedMatch = contractHistory[_item.aliasName ]?.["DOCUMENT_APPROVED"]?.transactionAlias === _item.aliasName;
              const isDocumentApprovedAdminMatch = contractHistory[_item.aliasName ]?.["DOCUMENT_APPROVED_ADMIN"]?.transactionAlias === _item.aliasName;
              if (isVerified 
                && (isDocumentApprovedMatch && trusteeApproveStatus 
                  || isDocumentApprovedAdminMatch && approveStatus)) {
                    if (isDocumentApprovedMatch) {
                      descriptionArr.push(contractHistory[_item.aliasName ]?.["DOCUMENT_APPROVED"]);
                    } else {
                      descriptionArr.push({
                        role: 'TRUSTEE',
                        isPending: true
                      })
                    }
                    if (isDocumentApprovedAdminMatch) {
                      descriptionArr.push(contractHistory[_item.aliasName ]?.["DOCUMENT_APPROVED_ADMIN"])
                    } else {
                      descriptionArr.push({
                        role: 'AUTHORIZER',
                        isPending: true
                      })
                    }
              } else {
                descriptionArr.push({
                  role: 'TRUSTEE',
                  isPending: true
                })
                descriptionArr.push({
                  role: 'AUTHORIZER',
                  isPending: true
                })
              }
              if (descriptionArr.length) {
                crtDescription = nestedDescription(descriptionArr);
              }
              step = {
                title: descriptionArr.length === 0 ? "Document approved" :"",
                icon: isVerified 
                  && trusteeApproveStatus && isDocumentApprovedMatch 
                  && (paymentDetails?.milestoneList?.[index]?.transactionStatus ===
                    "RELEASED" || approveStatus && isDocumentApprovedAdminMatch)
                    ? MilestoneActive()
                    : MilestoneInActive(),
                description: crtDescription,
              }
              if (!hasAdvisor) {
                msList.push(step);
              }
            }
            if (!checked) {
            if(!paymentDetails?.isDispute || (((_item.documentStatus === "VERIFIED" && _item.transactionStatus === "ACTIVE" && paymentDetails?.releaseStatus === "1") || _item.transactionStatus === "RELEASED") &&
              contractHistory[_item.aliasName ]?.["PAYMENT_INITIATED"]?.transactionAlias === _item.aliasName) ) {
              //payment initiated
              step={
                title: "Payment initiated",
                icon:
                ((_item.documentStatus === "VERIFIED" && _item.transactionStatus === "ACTIVE" && paymentDetails?.releaseStatus === "1") || _item.transactionStatus === "RELEASED") &&
                contractHistory[_item.aliasName ]?.["PAYMENT_INITIATED"]?.transactionAlias === _item.aliasName
                    ? MilestoneActive()
                    : MilestoneInActive(),
                description:
                ((_item.documentStatus === "VERIFIED" && _item.transactionStatus === "ACTIVE" && paymentDetails?.releaseStatus === "1") || _item.transactionStatus === "RELEASED") && 
                  contractHistory &&
                  contractHistory[_item.aliasName ]?.["PAYMENT_INITIATED"] && contractHistory[_item.aliasName ]?.["PAYMENT_INITIATED"]?.transactionAlias === _item.aliasName &&
                  description(contractHistory[_item.aliasName ]?.["PAYMENT_INITIATED"]),
              }
              if (!hasAdvisor) {
                msList.push(step);
              }
            }
          }

            if( !paymentDetails?.isDispute || (_item?.transactionStatus ===
              "RELEASED" && contractHistory[_item.aliasName ]?.["PAYMENT_RELEASED"]?.transactionAlias === _item.aliasName )) {
              //payment released
              if(contractHistory[_item.aliasName ]?.["PAYMENT_RELEASED"]) {
                contractHistory[_item.aliasName ]["PAYMENT_RELEASED"] = {
                  ...contractHistory[_item.aliasName ]?.["PAYMENT_RELEASED"],
                  role: "AUTHORIZER"
                }
              }
              step = {
                title: "Payment released",
                icon:
                  _item?.transactionStatus ===
                  "RELEASED" && contractHistory[_item.aliasName ]?.["PAYMENT_RELEASED"]?.transactionAlias === _item.aliasName
                    ? MilestoneActive()
                    : MilestoneInActive(),
                description:
                  paymentDetails?.milestoneList?.[index]?.transactionStatus ===
                    "RELEASED" &&
                  contractHistory &&
                  contractHistory[_item.aliasName ]?.["PAYMENT_RELEASED"] && contractHistory[_item.aliasName ]?.["PAYMENT_RELEASED"]?.transactionAlias === _item.aliasName &&
                  description(contractHistory[_item.aliasName ]?.["PAYMENT_RELEASED"]),
              }
              if (!hasAdvisor) {
                msList.push(step);
              }
            }
            if(!paymentDetails?.isDispute || paymentDetails?.milestoneList?.[index]?.transactionStatus ==="RELEASED") {
              //transaction completed
              step= {
                title: index === paymentDetails?.milestoneList.length -1 ? "Escrow transaction completed" : `${ordinalSuffixOf( index + 1 )} Milestone completed`,
                icon:
                  paymentDetails?.milestoneList?.[index]?.transactionStatus ===
                  "RELEASED"
                    ? MilestoneActive()
                    : MilestoneInActive(),
                description:
                  paymentDetails?.milestoneList?.[index]?.transactionStatus ===
                    "RELEASED" &&
                  contractHistory &&
                  contractHistory[_item.aliasName ]?.["COMPLETE"] &&
                  description(contractHistory[_item.aliasName ]?.["COMPLETE"]),
              }
              msList.push(step);
            }
            if (_item?.paymentStatus ===
              "COMPLETED" && _item?.transactionStatus !== "RELEASED" && (
              paymentDetails?.isDispute ||
              contractStatus >= 7)
            ) {
              //dispute raised
              step = {
                title: "Dispute Raised",
                icon:
                  contractStatus >= 7
                    ? Active()
                    : InActive(),
                description:
                  contractStatus >= 7 &&
                  contractHistory &&
                  contractHistory[_item.aliasName ]?.["DISPUTE_RAISED"] &&
                  description(contractHistory[_item.aliasName ]?.["DISPUTE_RAISED"]),
              };
              msList.push(step);
            }
            if (
              paymentDetails?.isDispute && _item?.transactionStatus !== "RELEASED" &&
              contractStatus === 10
              && _item?.paymentStatus ===
              "COMPLETED"
            ) {
              //partial refund generated
              step = {
                title: "Partial Refund Generated",
                icon:
                  contractStatus === 10
                    ? Active()
                    : InActive(),
                description:
                  contractStatus === 10 &&
                  contractHistory &&
                  contractHistory[_item.aliasName ]?.["PARTIAL_REFUNDED"] &&
                  description(contractHistory[_item.aliasName ]?.["PARTIAL_REFUNDED"]),
              };
              msList.push(step);
            }
            if (
              paymentDetails?.isDispute && _item?.transactionStatus !== "RELEASED" &&
              contractStatus === 9
              && _item?.paymentStatus ===
              "COMPLETED"
            ) {
              //full refund generated
              step = {
                title: "Complete Refund Generated",
                icon:
                  contractStatus === 9
                    ? Active()
                    : InActive(),
                description:
                  contractStatus === 9 &&
                  contractHistory &&
                  contractHistory[_item.aliasName ]?.["COMPLETED_REFUNDED"] &&
                  description(contractHistory[_item.aliasName ]?.["COMPLETED_REFUNDED"]),
              };
              msList.push(step);
            }
            tempdata.push(msList)
            msList = [];  
          })
        }
      }
    } else {
      if (contractStatus !== 0) {
        //transaction initiated
        step = {
          title: "Escrow transaction initiated",
          icon: Active(),
          description: description(contractHistory["SEND"]),
        };
        statusList.push(step);
      }
      if (contractStatus == -1) {
        if(contractHistory["PARTIALLY_ACCEPTED"]){
          contractHistory["PARTIALLY_ACCEPTED"] = {
            ...contractHistory["PARTIALLY_ACCEPTED"],
            "currency": paymentDetails?.currency,
            "role": contractDetail?.buyerDetails?.name === contractHistory["PARTIALLY_ACCEPTED"].name ? "Buyer" : "Seller"
          }
        }
        if(contractHistory["reject"]){
          contractHistory["reject"] = {
            ...contractHistory["reject"],
            "currency": paymentDetails?.currency,
            "role": contractDetail?.buyerDetails?.name === contractHistory["reject"].name ? "Buyer" : "Seller"
          }
        }
        //transaction rejected
        if(isContractStartedByAdvisor){
          let roleText = '';
          if (contractHistory["PARTIALLY_ACCEPTED"]) {
            if (contractHistory["PARTIALLY_ACCEPTED"]?.role?.toLowerCase() === 'buyer') {
              roleText = modifyCresetUserType(paymentDetails?.buyerAlias, contractHistory["PARTIALLY_ACCEPTED"]?.role?.toLowerCase());
            } else if (contractHistory["PARTIALLY_ACCEPTED"]?.role?.toLowerCase() === 'seller') {
              roleText = modifyCresetUserType(paymentDetails?.sellerAlias, contractHistory["PARTIALLY_ACCEPTED"]?.role?.toLowerCase())
            } else {
              roleText = contractHistory["PARTIALLY_ACCEPTED"]?.role?.toLowerCase();
            }
          } else {
            roleText = modifyCresetUserType(paymentDetails?.buyerAlias, contractHistory["PARTIALLY_ACCEPTED"]?.role?.toLowerCase());
          }
          step = {
            title: `Escrow transaction accepted by ${roleText}`,
            icon:
              ((isContractStartedByAdvisor && (contractHistory?.["PARTIALLY_ACCEPTED"] )))?
                Active() :  InActive(),
            description:contractHistory["PARTIALLY_ACCEPTED"] ? description(contractHistory["PARTIALLY_ACCEPTED"]) : ""
          };
          if (contractHistory["reject"]) {
            if (contractHistory["reject"]?.role?.toLowerCase() === 'buyer') {
              roleText = modifyCresetUserType(paymentDetails?.buyerAlias, contractHistory["reject"]?.role?.toLowerCase());
            } else if (contractHistory["reject"]?.role?.toLowerCase() === 'seller') {
              roleText = modifyCresetUserType(paymentDetails?.sellerAlias, contractHistory["reject"]?.role?.toLowerCase())
            } else {
              roleText = contractHistory["reject"]?.role?.toLowerCase();
            }
          } else {
            roleText = modifyCresetUserType(paymentDetails?.buyerAlias, contractHistory["reject"]?.role?.toLowerCase());
          }
          statusList.push(step);
          step = {
            title: `Escrow transaction rejected by ${roleText}`,
            icon: Active(),
            description:
              contractHistory &&
              contractHistory["reject"] &&
              description(contractHistory["reject"]),
          };
          statusList.push(step);
        } else {
          step = {
            title: "Escrow transaction rejected",
            icon: Active(),
            description:
              contractHistory &&
              contractHistory["reject"] &&
              description(contractHistory["reject"]),
          };
          statusList.push(step);
        }
      } else {
        if (
          !paymentDetails?.isDispute 
          || contractStatus >= 2 
          || (isContractStartedByAdvisor && contractStatus == 1)
        ) {
          if(contractHistory["PARTIALLY_ACCEPTED"]){
            contractHistory["PARTIALLY_ACCEPTED"] = {
              ...contractHistory["PARTIALLY_ACCEPTED"],
              "currency": paymentDetails?.currency,
              "role": contractDetail?.buyerDetails?.name === contractHistory["PARTIALLY_ACCEPTED"].name ? "Buyer" : "Seller"
            }
          }
          if(contractHistory["ACCEPT"]){
            contractHistory["ACCEPT"] = {
              ...contractHistory["ACCEPT"],
              "currency": paymentDetails?.currency,
              "role": contractDetail?.buyerDetails?.name === contractHistory["ACCEPT"].name ? "Buyer" : "Seller"
            }
          }
          //transaction accepted
          // separate accepted transaction details for/from escrow advisor
          if (isContractStartedByAdvisor) {
            // Buyer
            let roleText = '';
            if (contractHistory["PARTIALLY_ACCEPTED"]) {
              if (contractHistory["PARTIALLY_ACCEPTED"]?.role?.toLowerCase() === 'buyer') {
                roleText = modifyCresetUserType(paymentDetails?.buyerAlias,"buyer");
              } else {
                roleText = modifyCresetUserType(paymentDetails?.sellerAlias,"seller");
              }
            } else {
              roleText = modifyCresetUserType(paymentDetails?.buyerAlias,"buyer");
            }
            step = {
              title: `Escrow transaction accepted by ${roleText}`,
              icon:
                ((isContractStartedByAdvisor && contractStatus == 1) || contractStatus >= 2) && (contractHistory?.["PARTIALLY_ACCEPTED"] )?
                  Active() :  contractStatus < 2 ||
                  contractStatus === 6 ? InActive() : '',
              description:contractHistory["PARTIALLY_ACCEPTED"] ? description(contractHistory["PARTIALLY_ACCEPTED"]) : ""
            };
            statusList.push(step);
            // Seller
            
            if (contractHistory["ACCEPT"]) {
              if (contractHistory["ACCEPT"]?.role?.toLowerCase() === 'buyer') {
                roleText = modifyCresetUserType(paymentDetails?.buyerAlias,"buyer");
              } else if (contractHistory["ACCEPT"]?.role?.toLowerCase() === 'seller') {
                roleText = modifyCresetUserType(paymentDetails?.sellerAlias,"seller");
              } else {
                roleText = contractHistory["ACCEPT"]?.role?.toLowerCase();
              }
            } else {
              if (contractHistory["PARTIALLY_ACCEPTED"]) {
                if (contractHistory["PARTIALLY_ACCEPTED"]?.role?.toLowerCase() === 'buyer') {
                  roleText = modifyCresetUserType(paymentDetails?.sellerAlias,"seller");
                } else {
                  roleText = modifyCresetUserType(paymentDetails?.buyerAlias,"buyer");
                }
              } else {
                roleText = modifyCresetUserType(paymentDetails?.sellerAlias,"seller");
              }
            }
            step = {
              title: `Escrow transaction accepted by ${roleText}`,
              icon:
                ((isContractStartedByAdvisor && contractStatus == 1) || contractStatus >= 2) && (contractHistory?.["ACCEPT"])?
                  Active() :  contractStatus < 2 ||
                  contractStatus === 6 ? InActive() : '',
              description:contractHistory["ACCEPT"] ? description(contractHistory["ACCEPT"]) : ""
            };
            statusList.push(step);
          } else {
            step = {
              title: "Escrow transaction accepted",
              icon:
                (contractStatus >= 2) && (contractHistory?.["ACCEPT"] || contractHistory?.["PARTIALLY_ACCEPTED"] )?
                  Active() :  contractStatus < 2 ||
                  contractStatus === 6 ? InActive() : '',
              description:
                (contractStatus >= 2 || (isContractStartedByAdvisor && contractStatus == 1)) &&
                contractHistory && contractHistory?.["PARTIALLY_ACCEPTED"] ?
                description(contractHistory["PARTIALLY_ACCEPTED"]) : contractHistory?.["ACCEPT"] ? description(contractHistory["ACCEPT"]) : '',
            }
            statusList.push(step);
          }
        }
        if ( paymentDetails.sourceOfFunds || ( paymentDetails?.sourceOfFunds?.length > 0 &&
          ["APPROVED","REJECTED"].includes(paymentDetails.sourceOfFundStatus))
        ) {
          if(contractHistory["SOURCE_OF_FUNDS"]){
            contractHistory["SOURCE_OF_FUNDS"] = {
              ...contractHistory["SOURCE_OF_FUNDS"],
              "status": paymentDetails.sourceOfFundStatus
            }
          }
          step = {
            title: "Source of funds",
            icon:
            ["APPROVED","REJECTED"].includes(paymentDetails.sourceOfFundStatus)
                ? Active()
                : InActive(),
            description:
            ["APPROVED","REJECTED"].includes(paymentDetails.sourceOfFundStatus) &&
              contractHistory &&
              contractHistory["SOURCE_OF_FUNDS"] &&
              description(contractHistory["SOURCE_OF_FUNDS"]),
          };
          statusList.push(step);
        }
        if (
          !paymentDetails?.isDispute ||
          ['COMPLETED','INPROGRESS'].includes(paymentDetails.milestoneList?.[0]?.paymentStatus)
        ) {
          if(contractHistory["ADD_FUND"]){
            contractHistory["ADD_FUND"] = {
              ...contractHistory["ADD_FUND"],
              "currency": paymentDetails?.currency,
              "amount": milestoneAddedFundAmount?.[paymentDetails.milestoneList?.[0]?.aliasName] ?? 0,
              "status": paymentDetails.milestoneList?.[0]?.paymentStatus === "INPROGRESS" ? "(In progress)" : ""
            }
          }
          step = {
            title: "Fund added",
            icon:
              ["COMPLETED","INPROGRESS"].includes(paymentDetails.milestoneList?.[0]?.paymentStatus)
                ? Active()
                : InActive(),
            description:
              ["COMPLETED",'INPROGRESS'].includes(paymentDetails.milestoneList?.[0]?.paymentStatus) &&
              contractHistory &&
              contractHistory["ADD_FUND"] &&
              description(contractHistory["ADD_FUND"]),
          };
          statusList.push(step);
        }
        if ( paymentDetails?.isContractVerify &&
          !paymentDetails?.isDispute ||
          paymentDetails?.filelist?.length > 0 ||
          contractStatus < 7
        ) {
          //transaction verified
          step = {
            title: "Contract verified",
            icon:
            paymentDetails?.isContractVerify ? Active() : InActive(),
            description:
              paymentDetails?.isContractVerify  &&
              contractHistory &&
              contractHistory["VERIFIED"] &&
              description(contractHistory["VERIFIED"]),
          };
          if (!hasAdvisor) {
            statusList.push(step);
          }
        }
        if (
          !paymentDetails?.isDispute ||
          paymentDetails?.filelist?.length > 0 ||
          contractStatus < 7
        ) {
          //document uploaded
          step = {
            title: "Document uploaded",
            icon:
              paymentDetails?.filelist?.length /
                paymentDetails?.milestoneList?.[0]?.documentList?.length ==
              1
                ? Active()
                : InActive(),
            description:
              paymentDetails?.filelist?.length > 0 &&
              contractHistory &&
              contractHistory["DOCUMENT_UPLOADED"] &&
              description(contractHistory["DOCUMENT_UPLOADED"]),
          };
          if (!hasAdvisor) {
            statusList.push(step);
          }
        }
        if (
          (!paymentDetails?.isDispute ||
          (paymentDetails?.filelist?.length > 0 &&
            paymentDetails?.filelist?.[0]?.verified === "VERIFIED")) && paymentDetails?.filelist?.[0]?.verified !== "REJECTED"
        ) {
          //document verified
          step = {
            title: "Document verified",
            icon:
              paymentDetails?.filelist?.filter(
                (item: any) => item?.verified === "VERIFIED"
              )?.length /
                paymentDetails?.milestoneList?.[0]?.documentList?.length ==
              1
                ? Active()
                : InActive(),
            description:
              paymentDetails?.filelist?.length > 0 &&
              paymentDetails?.filelist?.[0]?.verified === "VERIFIED" &&
              description(contractHistory["DOCUMENT_VERIFIED"]),
          };
          if (!hasAdvisor) {
            statusList.push(step);
          }
        }
        if (
          !paymentDetails?.isDispute ||
          (paymentDetails?.filelist?.length > 0 &&
            paymentDetails?.filelist?.[0]?.verified === "VERIFIED" &&
            (paymentDetails?.milestoneList?.[0]?.trusteeApproveStatus === "1" || 
            paymentDetails?.milestoneList?.[0]?.approveStatus === "1"))
        ) {
          //document approved

          let crtDescription:any = false;
          const descriptionArr = [];
          if (paymentDetails?.filelist?.length > 0 
            && paymentDetails?.filelist?.[0]?.verified === "VERIFIED" 
            && contractHistory
            && (contractHistory["DOCUMENT_APPROVED"] && paymentDetails?.milestoneList?.[0]?.trusteeApproveStatus === "1" 
              || contractHistory["DOCUMENT_APPROVED_ADMIN"] && paymentDetails?.milestoneList?.[0]?.approveStatus === "1" )
           ) {
            if (contractHistory["DOCUMENT_APPROVED"]) {
              descriptionArr.push(contractHistory["DOCUMENT_APPROVED"]);
            } else {
              descriptionArr.push({
                role: 'TRUSTEE',
                isPending: true
              })
            }
            if (contractHistory['DOCUMENT_APPROVED_ADMIN']) {
              descriptionArr.push(contractHistory["DOCUMENT_APPROVED_ADMIN"]);
            } else {
              if (paymentDetails?.releaseStatus !== "1") {
                descriptionArr.push({
                  role: 'AUTHORIZER',
                  isPending: true
                })
              }
            }
          } else {
            descriptionArr.push({
              role: 'TRUSTEE',
              isPending: true
            })
            if (paymentDetails?.releaseStatus !== '1') {
              descriptionArr.push({
                role: 'AUTHORIZER',
                isPending: true
              })
            }
          }
          if (descriptionArr.length) {
            crtDescription = nestedDescription(descriptionArr);
          }

          step = {
            title: descriptionArr.length === 0 ? "Document approved" :"",
            icon:
            paymentDetails?.filelist?.[0]?.verified === "VERIFIED" 
            && paymentDetails?.milestoneList?.[0]?.trusteeApproveStatus === "1" 
            && (paymentDetails?.releaseStatus === "1" || paymentDetails?.milestoneList?.[0]?.approveStatus === "1") 
                ? Active()
                : InActive(),
            description: crtDescription,
          };
          if (!hasAdvisor) {
            statusList.push(step);
          }
        }
        // if (
        //   !paymentDetails?.isDispute ||
        //   (paymentDetails?.filelist?.length > 0 &&
        //     paymentDetails?.filelist?.[0]?.verified === "VERIFIED" &&
        //     paymentDetails?.milestoneList?.[0]?.approveStatus === "1")
        // ) {
        //   //transaction approved admin
        //   let crtDescription:any = false;
        //   if (paymentDetails?.filelist?.length > 0 
        //     && paymentDetails?.filelist?.[0]?.verified === "VERIFIED" 
        //     && paymentDetails?.milestoneList?.[0]?.approveStatus === "1" 
        //     && contractHistory 
        //     && contractHistory["DOCUMENT_APPROVED_ADMIN"]) {
        //       crtDescription = description(contractHistory["DOCUMENT_APPROVED_ADMIN"])
        //   }
        //   step = {
        //     title: "Escrow transaction approved",
        //     icon:
        //     paymentDetails?.filelist?.[0]?.verified === "VERIFIED" &&
        //     paymentDetails?.milestoneList?.[0]?.approveStatus === "1"
        //         ? Active()
        //         : InActive(),
        //     description: crtDescription,
        //   };
        //   if (!(paymentDetails?.releaseStatus === "1" 
        //     && paymentDetails?.milestoneList?.[0]?.approveStatus !== "1")) {
        //       //hiding older entries
        //       statusList.push(step);
        //   }
        // }
        if (!contractDetail?.isAgreementFull &&  (!paymentDetails?.isDispute || paymentDetails?.releaseStatus === "1" || contractStatus < 7) ) {
          //payment initiated
          step = {
            title: "Payment initiated",
            icon: paymentDetails?.releaseStatus === "1" ? Active() : InActive(),
            description:
              paymentDetails?.releaseStatus === "1" &&
              contractHistory &&
              contractHistory["PAYMENT_INITIATED"] &&
              description(contractHistory["PAYMENT_INITIATED"]),
          };
          if (!hasAdvisor) {
            statusList.push(step);
          }
        }
        if (
          !paymentDetails?.isDispute ||
          paymentDetails?.milestoneList?.[0]?.transactionStatus ===
            "RELEASED" ||
            contractStatus < 7
        ) {
          if(contractHistory["PAYMENT_RELEASED"]) {
            contractHistory["PAYMENT_RELEASED"] = {
              ...contractHistory["PAYMENT_RELEASED"],
              role: "AUTHORIZER"
            }
          }
          //payment released
          step = {
            title: "Payment released",
            icon:
              paymentDetails?.milestoneList?.[0]?.transactionStatus ===
              "RELEASED"
                ? Active()
                : InActive(),
            description:
              paymentDetails?.milestoneList?.[0]?.transactionStatus ===
                "RELEASED" &&
              contractHistory &&
              contractHistory["PAYMENT_RELEASED"] &&
              description(contractHistory["PAYMENT_RELEASED"]),
          };
          if (!hasAdvisor) {
            statusList.push(step);
          }
        }
        if (
          !paymentDetails?.isDispute ||
          paymentDetails?.milestoneList?.[0]?.transactionStatus ===
            "RELEASED" ||
            contractStatus < 7
        ) {
          //transaction completed
          step = {
            title: "Escrow transaction completed",
            icon:
              paymentDetails?.milestoneList?.[0]?.transactionStatus ===
              "RELEASED"
                ? Active()
                : InActive(),
            description:
              paymentDetails?.milestoneList?.[0]?.transactionStatus ===
                "RELEASED" &&
              contractHistory &&
              contractHistory["COMPLETE"] &&
              description(contractHistory["COMPLETE"]),
          };
          statusList.push(step);
        }
        if (
          paymentDetails?.isDispute ||
          contractStatus >= 7
        ) {
          //dispute raised
          step = {
            title: "Dispute raised",
            icon:
              contractStatus >= 7
                ? Active()
                : InActive(),
            description:
              contractStatus >= 7 &&
              contractHistory &&
              contractHistory["DISPUTE_RAISED"] &&
              description(contractHistory["DISPUTE_RAISED"]),
          };
          statusList.push(step);
        }
        if (
          paymentDetails?.isDispute &&
          contractStatus === 10
        ) {
          //partial refund generated
          step = {
            title: "Partial refund generated",
            icon: Active(),
            description: contractHistory &&
              contractHistory["PARTIAL_REFUNDED"] &&
              description(contractHistory["PARTIAL_REFUNDED"]),
          };
          statusList.push(step);
        }
        if (
          paymentDetails?.isDispute &&
          contractStatus === 9
        ) {
          //completed refund generated
          step = {
            title: "Complete refund generated",
            icon:Active(),
            description: contractHistory &&
              contractHistory["COMPLETED_REFUNDED"] &&
              description(contractHistory["COMPLETED_REFUNDED"]),
          };
          statusList.push(step);
        }
      }
    }
    setList(statusList);
    setmilestoneList(tempdata);
  }, [contractDetail, paymentDetails, contractHistory, taxDetails, milestoneAddedFundAmount]);

  const nestedDescription = (dataArr: any) => {
    if (!dataArr || dataArr.length === 0) {
      return '';
    }
    const uploadSign = {
      name: "file",
      headers: {
        authorization: `Bearer ${Token}`,
      },
      action: REACT_APP_SERVER_URL + "/api/v1/contracts/uploadSignature",
      
      beforeUpload: (file: any) => {
        const isAccepted = acceptedDocsFileTypes.includes(file.type);
        if (!isAccepted) {
          message.error(`File type ${file.type} is not allowed, Please upload only images or documents.`);
          return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5; 
        if (!isLt5M) {
          message.error('File must be smaller than 5MB!');
          return Upload.LIST_IGNORE;
        }
        return true;
      },
     
      onChange: (info: any) => {
        
        const { response, status } = info?.file || {};
        const isUploading = status === "uploading";
        setLoadding(isUploading);
         
        if (response) {
          if (response && response.id) {
            setPhotoId(response.id);
            message.success(`${response?.inputfileid} file uploaded successfully`)
          }
        }
      },
    };

  
   

    const docAndComment = ()=> {
      
      if(!photoId || photoId === ""){
        message.warning("Please upload doc");
        return;
      }
      const commentValue = commentRef.current?.resizableTextArea?.textArea?.value;
      if (!commentValue || !commentValue.trim()) {
        message.warning("Comment cannot be empty!");
        return;
      }
      if (commentValue.length > 140) {
        message.warning("Comment cannot exceed 140 characters!");
        return;
      }
      const payLoad = {
        userAlias: userAlias,
        platformStatus: '1',
        contractAlias: paymentDetails?.aliasName,
        transactionAlias: paymentDetails?.milestoneList?.filter((item: any) => item?.isActive === true)?.[0].aliasName,
        isMilestone: paymentDetails?.isMilestone,
        approveDoc: photoId,
        approveComment: commentValue
      };
      
      setLoadding(true);
      updatePlatformStatus(payLoad)
      .then((res:any)=>{
        setLoadding(false);
        if(res.data.statusCode === 200){
         setPhotoId("")
         setKey((prevKey) => prevKey + 1);
         commentRef.current.resizableTextArea.textArea.value = null;
         message.success("added successfully");
        }
      }).catch((error)=>{
        console.log("error",error)
        setLoadding(false);
         message.error("Operation failed.");
      })
    }
    const itemList = [];
    for (let i = 0; i < dataArr.length; i++) {
      const step = {
        title: '',
        icon: dataArr[i].isPending ? InActive(true) : Active(true),
        description: (
          <div>
            {description(dataArr[i])}
            {(dataArr[1]?.isPending && !dataArr[0].isPending) && (dataArr[i].role === 'TRUSTEE') && userType === "TRUSTEE" && (
              <div className="upload-comment-section mt-3">
                <Upload
                  multiple={false}
                  {...uploadSign}
                >
                  <Button type="primary" className="float-end blue-status modal-button"   disabled={dataArr[i].isPending} loading={loading}>Upload Doc</Button>
                </Upload>
                <div className="d-flex gap-1">
                  <TextArea
                    key={key}
                    ref={commentRef}
                    placeholder="Enter your comment here"
                    rows={1}
                    disabled={dataArr[i].isPending}
                    className="checklisttextarea w-100 mt-2"
                  />
                  <Image
                    src={AddContract}
                    className= {dataArr[i].isPending ? "disabled-text" : "cursor"} 
                    alt="add"
                    preview={false}
                    onClick={docAndComment}
                  />
                </div>
              </div>
            )}
          </div>
        ),
      };
      itemList.push(step);
    }
   
    return (
      <Collapse
        defaultActiveKey={0}
        ghost
        expandIconPosition="end"
        collapsible="header"
        className="escrow-transaction-doc-approver-collepse-menu"
      >
        <Panel
          header={
            <div className="d-flex">
              <NormalBoldText
                children={`Document approved`}
                className={'mb-0 with-milestones'}
              />
            </div>
          }
          key={0}
          showArrow={true}
          collapsible="header"
        >
          <Steps
            items={itemList}
            current={0}
            direction={
              Width >= 992 || props?.screen === 'disputDetails' || props?.screen === 'transactionDetails'
                ? 'vertical'
                : 'horizontal'
            }
          />
        </Panel>
      </Collapse>
    );
  };  

  const description = (data: any) => {   
    let updaterName = data?.name;
    let updaterRole = data?.role;
    const isPending = data?.isPending;
    const buyerAlias = contractDetail?.buyerAlias;
    const sellerAlias = contractDetail?.sellerAlias;
    const isUpdaterAdmin = ['ADMIN','SENIOR_MANAGEMENT', 'AUTHORIZER', 'TRUSTEE'].includes(updaterRole)
    if (isUpdaterAdmin) {
      if (data?.role === 'TRUSTEE') {
        updaterRole = 'Approver';
      } else if (data?.role === 'AUTHORIZER') {
        updaterRole = 'Authorizer';
      } else if (data?.role === 'SENIOR_MANAGEMENT') {
        updaterRole = 'Senior Manager';
      } else if (data?.role === 'ADMIN') {
        updaterRole = 'Admin';
      } else {
        updaterRole = '';
      }
      if (userType === 'USER') {
        updaterName = 'Trustin';
      }
      else if (data?.role === 'AUTHORIZER') {
        updaterName = 'Trustin';
      }
      
    } else {
      if (userAlias !== data?.updatedBy) {
        if (data?.updatedBy === buyerAlias) {
          updaterRole = modifyCresetUserType(buyerAlias,'Buyer');
        } else if (data?.updatedBy === sellerAlias) {
          updaterRole = modifyCresetUserType(sellerAlias,'Seller');
        } else {
          updaterRole = '';
        }
      } else {
        updaterRole = '';
      }
    }
    return (
      <div className="mt-1">
        <div className="d-flex">

          {/* { isPending ? <div className="stepDetails_sub px-2">{updaterRole} approval</div>  */}
          { isPending ? (<div>
            <div className="stepDetails_sub px-2">{updaterRole} approval
          </div>
          {updaterRole === 'Authorizer' ? (
                <div className="d-flex flex-column">
                  
                  <div
                className={`${
                  updaterName?.length * 7 > 150 ? 'overflowText' : ''
                }`}
              >
                {contractDetail?.buyerDetails?.entityType === "COMPANY" &&
                contractDetail?.sellerDetails?.entityType === "COMPANY" ? (
                  <>
                    <span className="ms-2">Company:</span>
                    <Tooltip
                      title={updaterName?.length * 7 > 150 ? updaterName : null}
                      overlayClassName="custom-tooltip"
                    >
                      <span className="ms-2">{`[${updaterName}]`}</span>
                    </Tooltip>
                  </>
                ) : null}
              </div>
                </div>
              ) : null}

          </div>):(
            <>
              <Image src={User} alt="user" preview={false} className="px-1 min-width-25" />
              <div className="stepDetails_sub px-2">{updaterName} {updaterRole ?"("+ updaterRole + ")": ""}</div>
            </> 
          )}
        </div>
        {data?.updatedAt && <div className="d-flex stages-width mt-2">
          <div className="d-flex">
            <Image
              src={Calendar}
              alt="company"
              preview={false}
              className="px-1 min-width-25"
            />
            <div className="stepDetails_sub mb-2 mx-1">
              {moment(data?.updatedAt).format("DD-MM-YYYY")}
            </div>
          </div>
          <div className="d-flex">
            <Image
              src={ClockLight}
              alt="company"
              preview={false}
              className="px-1 min-width-25"
            />
            <div className="stepDetails_sub mb-2">
              {moment(data?.updatedAt).format("hh:mm A")}
            </div>
          </div>
        </div>}
        { data?.amount && 
            <div className="d-flex">
              <Image
                src={Suitcase}
                alt="company"
                preview={false}
                className="px-1 min-width-25"
              />
              <div className="green-status mb-2">
                {data?.currency + " " + parseFloat(data?.amount).toLocaleString() + " " + data?.status}
              </div>
            </div>
          }
      </div>
    );
  };
  return (
    <div>
      <Steps items={list} current={currentStep} direction={Width > 991 || props?.screen === 'disputDetails' || props?.screen === 'transactionDetails' ? "vertical" : "horizontal"} />
      {paymentDetails?.isMilestone && (
        <>
          {paymentDetails?.milestoneList?.map((_item: any, index: any) => {
            const isReleased = paymentDetails?.milestoneList?.[index]?.transactionStatus ==="RELEASED"
            return (
              <div key={index} className="d-flex">
                {isReleased && <Image src={orangeTick} preview={false} className="mt-2 orangeTick-completed"/>}
                <Collapse
                  defaultActiveKey={
                    paymentDetails?.milestoneList
                      ?.map((item: any) => item.isActive)
                      .indexOf(true) + 1
                  }
                  ghost
                  expandIconPosition="start"
                >                 
                  <Panel
                    header = {
                      <div className="d-flex">                    
                        <NormalText
                          children={`Milestone ${index + 1}`}
                          className={isReleased ? "mb-0 with-milestones mx-2" :"mb-0 with-milestones" }
                        />     
                        {isReleased && <span className="text-success">Completed</span>}                 
                      </div>
                    }
                    key={index + 1}
                    className="p-0"
                  >
                    <Steps
                      items={milestonelist[index]}
                      current={milestonecurrentStep}
                      direction={Width >= 992 || props?.screen === 'disputDetails' || props?.screen === 'transactionDetails' ? "vertical" : "horizontal"}
                    />
                  </Panel>
                </Collapse>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
export default EscrowTransationHistorySteps;
