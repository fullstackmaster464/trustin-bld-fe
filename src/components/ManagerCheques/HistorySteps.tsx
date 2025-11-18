import { Collapse, Image, Popover, Steps, Tooltip } from "antd";
import orangeTick from "../../assets/img/orange_tick.svg";
import greenTick from "../../assets/img/green_tick.svg";
import User from "../../assets/img/userHalf.svg";
import Comment from "../../assets/img/Comment.svg";
import Calendar from "../../assets/img/Calendar.svg";
import ClockLight from "../../assets/img/clock_light.svg";
import { useEffect, useState } from "react";
import moment from "moment";
import { NormalBoldText } from "../ui-elements/TextRepo"; 
import Suitcase from "../../assets/img/sellerJob.svg"; 
import { AuthUserTypes, CHEQUE_USER_TYPE_TEXT } from "../Common/Constants";

const HistorySteps = (props: any) => {
  
  const { chequeDetail, paymentDetails, chequeHistory, taxDetails, sellerVerificationHistory, isSellerVerified } = props;
  
  const [currentStep, setcurrentStep] = useState(0);
  const [list, setList] = useState<any>([]);  
  const [Width, setWidth] = useState(document?.body?.clientWidth); 
  const setWidthVal = () => {
    setWidth(document?.body?.clientWidth);
  };
  
  
  useEffect(() => {
    const textContainer = document.getElementById("textContainer");
    const readMoreButton = document.getElementById("readMoreButton");

    if (textContainer && readMoreButton && textContainer.textContent && textContainer.textContent.length > 180) {
      const truncatedText = textContainer.textContent.slice(0, 180);
      textContainer.innerHTML = truncatedText;
      readMoreButton.style.display = "inline";
    }  

    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []); 
  
  const InActive = (special = false) => {
    return <div className={special ? "inactivecircle-small" : "inactivecircle"} ></div>;
  };
  const Active = (special = false) => {
    setcurrentStep(currentStep + 1);
    return <Image src={special ? greenTick : orangeTick} preview={false} width={special ? '70%' : '100%'}/>;
  };
   

  const { Panel } = Collapse;
  
  const getDocumentDescriptionArr = (chequeHistory: any, type: string) => {
    const descriptionArr: any = [];
    let roles: {
      key: string;
      role: string;
    }[] | any
    if (type === "DOCUMENT") {
      roles = [
        { key: 'APPROVER_VERIFIED', role: 'TRUSTEE' },
        { key: 'AUTH_VERIFIED', role: 'AUTHORIZER' },
      ];
    } else if (type === "SELLER") {
      roles = [ 
        { key: 'TRUSTEE_APPROVED', role: 'TRUSTEE' },
        { key: 'AUTHORIZER_APPROVED', role: 'AUTHORIZER' },
      ];
    }

    roles.forEach(({ key, role }: any) => {
      const historyItem = chequeHistory?.[key];  
      if (historyItem && Object.keys(historyItem).length > 0) {
        descriptionArr.push({...historyItem });
      } else {
        descriptionArr.push({ role, isPending: true });
      }
    });
    return descriptionArr.length ? descriptionArr : [];
  }

  useEffect(() => {
    const statusList = [];
    let step = {
      title: "",
      icon: {},
      description: {},
    };  

      if (chequeDetail?.chequeStatus !== 0) {
        const initialStep = chequeHistory["PENDING"] ? chequeHistory["PENDING"] : chequeHistory["DRAFT"];
        
        step = {
          title: "Transaction initiated",
          icon: Active(),
          description: description(initialStep),
        };
        statusList.push(step);
      }
      if (chequeDetail?.chequeStatus == "-1") {
        step = {
          title: "Tansaction rejected",
          icon: Active(),
          description:
            chequeHistory &&
            chequeHistory["reject"] &&
            description(chequeHistory["reject"]),
        };
        statusList.push(step);
      } else {
        if(chequeDetail?.transactionType === 'RECEIVE'){
 
           
            if (chequeDetail?.chequeStatus !== 0) {
                if(chequeDetail?.isPaymentInitialized && chequeHistory["FUND_ADDED"]){
                  chequeHistory["FUND_ADDED"] = {
                    ...chequeHistory["FUND_ADDED"],
                    "currency": chequeDetail?.currency,
                    "amount": chequeDetail?.buyerAmount,
                    "role" : "SELLER"
                  }
                }
                step = {
                  title: "Fund added",
                  icon: chequeDetail?.isPaymentInitialized ? Active() : InActive(),
                  description: chequeDetail?.isPaymentInitialized ? description(chequeHistory["FUND_ADDED"]) : "",
                };
                statusList.push(step);
              }

              if (chequeDetail?.chequeStatus !== 0) {
                if(chequeDetail?.buyerDetails?.userType === AuthUserTypes.USER){
                  const obj = {
                    name : "Trustin",
                    userrole : "Authorizer",
                    updatedAt :  chequeDetail?.buyerDetails?.updatedAt
                  }
                  step = {
                    title: "Buyer verified",
                    icon: isSellerVerified ? Active() : InActive(),
                    description: isSellerVerified ? description(obj) : "",
                  };
                  statusList.push(step);
                } else {  //for screening users
                    let crtDescription: any = false;
                  const descriptionArr = getDocumentDescriptionArr(sellerVerificationHistory,"SELLER");
                  if (descriptionArr && descriptionArr?.length) {
                    crtDescription = nestedDescription(descriptionArr,'Buyer Verified');
                  }
                  step = {
                    title: "",
                    icon: isSellerVerified ? Active() : InActive(),
                    description: crtDescription,
                  };
                  statusList.push(step);
                }
              }
              
            if (chequeDetail?.chequeStatus !== 0) {
              let crtDescription: any = false;
              const descriptionArr = getDocumentDescriptionArr(chequeHistory,"DOCUMENT");
              if (descriptionArr && descriptionArr?.length) {
                crtDescription = nestedDescription(descriptionArr,'Transaction approved');
              }
              step = {
                title: "",
                icon: chequeDetail?.isAuthorizerVerified ? Active() : InActive(),
                description: crtDescription,
              };
              statusList.push(step);
             }
             if (chequeDetail?.chequeStatus !== 0) {
              step = {
                title: "Transaction completed",
                icon: chequeDetail.chequeStatus === '5' ? Active() : InActive(),
                description: chequeDetail.chequeStatus === '5' ? description(chequeHistory["COMPLETED"]) : "",
              };
              statusList.push(step);
            }

          }else{ 
           
           
             let isPreviousDone = false;
                    
          if(chequeDetail?.sellerDetails?.userType != 'USER'){
            isPreviousDone = isSellerVerified
          }else if(chequeDetail?.sellerDetails?.userType == 'USER'){
            isPreviousDone =  chequeDetail?.counterAccepted
          }
          isPreviousDone = !!isPreviousDone;

          if(isPreviousDone) {
            if(chequeDetail.sourceOfFunds && chequeDetail?.sourceOfFunds?.length > 0 &&
              chequeDetail.sourceoffundstatus !== "APPROVED") {
                isPreviousDone = false;
            }
          }
          
          if (chequeDetail?.chequeStatus !== 0 && (chequeDetail?.sellerDetails?.userType == 'USER' || chequeDetail?.sellerDetails?.userType == 'GUEST')) {
            step = {
              title: "Transaction accepted",
              icon: chequeDetail?.counterAccepted ? Active() : InActive(),
              description: chequeDetail?.counterAccepted ? description(chequeHistory["ACCEPT"]) : "",
            };
            statusList.push(step);
          } else {
             let crtDescription: any = false;
            const descriptionArr = getDocumentDescriptionArr(sellerVerificationHistory,"SELLER");
            if (descriptionArr && descriptionArr?.length) {
              crtDescription = nestedDescription(descriptionArr,'Seller Verified');
            }
            step = {
              title: "",
              icon: isSellerVerified ? Active() : InActive(),
              description: crtDescription,
            };
            statusList.push(step);
          }

          // ["APPROVED","REJECTED"].includes(chequeDetail.sourceoffundstatus)
          if (chequeDetail?.chequeStatus !== 0 && chequeDetail?.sourceOfFunds?.length > 0) {
            step = {
              title: "Source of funds",
              icon: ["APPROVED","REJECTED"].includes(chequeDetail.sourceoffundstatus) ? Active() : InActive(),
              description: ["APPROVED","REJECTED"].includes(chequeDetail.sourceoffundstatus) ? description(chequeHistory["SOURCE_OF_FUNDS"]) : "",
            };
            statusList.push(step);
          }

          if (chequeDetail?.chequeStatus !== 0) {
            if(chequeDetail?.isPaymentInitialized  && chequeHistory["FUND_ADDED"]){
              const isSoFExistOrVerified = (chequeDetail.sourceOfFunds && chequeDetail?.sourceOfFunds?.length > 0 && chequeDetail.sourceoffundstatus === "APPROVED")  
                || !chequeDetail.sourceOfFunds;

                
              chequeHistory["FUND_ADDED"] = {
                ...chequeHistory["FUND_ADDED"],
                "currency": chequeDetail?.currency,
                "amount": chequeDetail?.buyerAmount,
                "status" : chequeDetail?.isPaymentInitializing ? "(In progress)" : "",
                "pending" : isPreviousDone
              }
              step = {
                  title: "Fund added",
                  icon: chequeDetail?.isPaymentInitialized && isPreviousDone && isSoFExistOrVerified ? Active() : InActive(),
                  description: chequeDetail?.isPaymentInitialized ? description(chequeHistory["FUND_ADDED"]) : "",
              };
              statusList.push(step);
            } else if(chequeDetail?.isPaymentInitializing && chequeHistory["FUND_ADDING"]){
              const isSoFExistOrVerified = (chequeDetail.sourceOfFunds && chequeDetail?.sourceOfFunds?.length > 0 && chequeDetail.sourceoffundstatus === "APPROVED")  
                || !chequeDetail.sourceOfFunds;
              chequeHistory["FUND_ADDING"] = {
                ...chequeHistory["FUND_ADDING"],
                "currency": chequeDetail?.currency,
                "amount": chequeDetail?.buyerAmount,
                "status" : chequeDetail?.isPaymentInitializing ? "(In progress)" : "",
                "pending" : isPreviousDone
              }
              step = {
                title: "Fund added",
                icon: chequeDetail?.isPaymentInitializing && isPreviousDone && isSoFExistOrVerified ? Active() : InActive(),
                description: chequeDetail?.isPaymentInitializing ? description(chequeHistory["FUND_ADDING"]) : "",
              };
              statusList.push(step);
            } else {
              step = {
                title: "Fund added",
                icon: InActive(),
                description: "",
              };
              statusList.push(step);
            }
          }
          if (chequeDetail?.chequeStatus !== 0) {
            let crtDescription: any = false;
            const descriptionArr = getDocumentDescriptionArr(chequeHistory,"DOCUMENT");
            if (descriptionArr && descriptionArr?.length) {
              crtDescription = nestedDescription(descriptionArr,'Transaction approved');
            }
            step = {
              title: "",
              icon: chequeDetail?.isAuthorizerVerified ? Active() : InActive(),
              description: crtDescription,
            };
            statusList.push(step);
          }
          if (chequeDetail?.chequeStatus !== 0) {
            step = {
              title: "Issued manager cheque",
              icon: chequeDetail?.chequeStatus == "5" ? Active() : InActive(),
              description: chequeDetail?.chequeStatus == "5" ? description(chequeHistory["COMPLETED"]) : "",
            };
            statusList.push(step);
          }
          
          if (chequeDetail.chequeStatus === '5') {
            step = {
              title: "Transaction completed",
              icon: chequeDetail.chequeStatus === '5' ? Active() : InActive(),
              description: description(chequeHistory["COMPLETED"]),
            };
            statusList.push(step);
          }
          }
      }
  setList(statusList); 
  }, [chequeDetail, paymentDetails, chequeHistory, taxDetails]);
  
  const nestedDescription = (dataArr: any, title?: string) => {
    if (dataArr.length === 0) {
      return '';
    }
    const itemList = [];
    for (let i = 0; i < dataArr.length; i++) {
      const step = {
        title: '',
        icon: dataArr[i].isPending ? InActive(true) : Active(true),
        description: description(dataArr[i])
      }
      itemList.push(step);
    }

    return <Collapse defaultActiveKey={0} ghost expandIconPosition="end" collapsible="header" className="escrow-transaction-doc-approver-collepse-menu">
      <Panel header={<div className="d-flex">
        <NormalBoldText
          children={title ? title: `Document approved`}
          className={"mb-0 with-milestones"}
        />
      </div>} key={0} showArrow={true} collapsible='header'>
        <Steps
          items={itemList}
          current={0}
          direction={Width >= 992 || props?.screen === 'disputDetails' || props?.screen === 'transactionDetails' ? "vertical" : "horizontal"}
        />
      </Panel>
    </Collapse>
  }
  
  const CustomTooltip = ({
    text = "",
    maxLength = 75,
    overlayClassName = "",
  }) => {
    const truncatedText =
      text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  
    return (
      <Tooltip title={text} overlayClassName={overlayClassName}>
        <span className="Status">{truncatedText}</span>
      </Tooltip>
    );
  };

  const description = (data: any) => {
    const updaterName = data?.name;
    let updaterRole = data?.role;
    const isPending = data?.isPending;
    const pending = data?.pending;
 
     
    if (data?.userrole === 'USER') {
      updaterRole = CHEQUE_USER_TYPE_TEXT[data?.role];
    }else{ 
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
    }      
  
    return (
      <div className="mt-1">
        <div className="d-flex">
 
          { isPending ? (<div>
            <div className="stepDetails_sub px-2">{updaterRole} approval
          </div>
          {updaterRole === 'Authorizer' ? (
                <div className="d-flex flex-column">
                  <div className={`${
                  updaterName?.length * 7 > 150 ? 'overflowText' : ''
                }`}>
                {/* {chequeDetail?.buyerDetails?.entityType === "COMPANY" &&
                chequeDetail?.sellerDetails?.entityType === "COMPANY" ? (
                  <>
                    <span className="ms-2">Company:</span>
                    <Tooltip
                      title={updaterName?.length * 7 > 150 ? updaterName : null}
                      overlayClassName="custom-tooltip"
                    >
                      <span className="ms-2">{`[${updaterName}]`}</span>
                    </Tooltip>
                  </>
                ) : null} */}
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
                <div className={pending === false ? "mb-2" : "green-status mb-2"}>
                {data?.currency + " " + parseFloat(data?.amount).toLocaleString() + " " + (data?.status || "")}
                </div>
            </div>
          }
          {data?.comment &&
            <div className="d-flex">
              <Image
                src={Comment}
                alt="company"
                preview={false}
                className="px-1 min-width-25"
              />
              <div className="stepDetails_sub_comments mx-1">
                <span id="textContainer"> 
                    {
                data?.comment ?  
                <CustomTooltip
                    text={data?.comment}
                    maxLength={50}
                    overlayClassName="custom-tooltip custom-tooltip-inner"
                  />
                : 'N/A'
                }
                </span>
                <span id="readMoreButton" style={{ display: "none" }}>
                  {" "}
                  <Popover
                    placement="top"
                    className="commentPopover cursor"
                    content={data?.comment ? data?.comment : 'N/A'}
                    trigger="click">
                    ... Read more
                  </Popover>
                </span>
              </div>
            </div>
          }
      </div>
    );
  };

  return (
    <div>
      <Steps items={list} current={currentStep} direction={Width > 991 || props?.screen === 'disputDetails' || props?.screen === 'transactionDetails' ? "vertical" : "horizontal"} />
    </div>
  );
};
export default HistorySteps;
