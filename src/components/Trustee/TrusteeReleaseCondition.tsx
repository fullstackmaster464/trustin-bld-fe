import { AuthTitle } from "../ui-elements/TextRepo";
import {
  Button,
   Collapse,
  //  Divider,
   Form,
   Image,
   Modal,
   notification,
   Row
} from "antd";
import React, { useEffect, useState } from "react";
import  DashboardImg from "../../assets/img/dashboard.svg";
import  reject from "../../assets/img/reject.svg";
import Doc from "../../assets/img/grayDoc.svg"
import { ordinalSuffixOf, toTitleCase, getLocalStorage } from "../Common/Constants";
import { useNavigate } from "react-router-dom";

import PendingStateComponent from "./PendingStateComponent";
import VerifyModal from '../Models/VerifyModel';
import { updatePlatformStatus } from "../../services/trustee";
import { TrusteeTransaction } from "../Common/RouteConst";
import TextArea from "antd/es/input/TextArea";

const { Panel } = Collapse;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const TrusteeReleaseCondition = (props: any): any => {
  const {paymentData, _fetchPaymentConditions , title, getPaymentDetails, releasePayment} = props
  const [approvedModal, setApprovedModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [onholdModal, setOnholdModal] = useState(false);
  const [isverifyVisible, setverifyVisible] = useState(false);
  const [imageData, setimageData] = useState({});
  const [docForEmail, setDocForEmail] = useState('');
  // const [showApproveReject, setShowApproveReject] = useState(false);
  const [buttonRequired, setButtonRequired] = useState('')
  const [loading, setLoading] = useState(false);
  // const [modalHeader, setModalHeader] = useState("");
  const [contractRejectModal, setIsContractRejectModal] = useState<boolean>(false);
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const userData = JSON.parse(getLocalStorage("auth")!);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const openNotification = (msg = "") => {
    notification.info({
      message: "Error",
      description: msg ? msg : "Please sign document",
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    });
  };
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [isVerified,setIsVerified]= useState<boolean>(true)
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, [])

  // useEffect(() => {
    // let verifiedDoc = [];
    // let verifiedDocCount = 0;
    // let totalDocCount = 0;
    // const activeMilestone = paymentData?.milestoneList?.filter((item: any) => item?.isActive === true);
    // activeMilestone?.[0]?.documentList?.map((outerItem: any) => {
      // totalDocCount++;
      // verifiedDoc = paymentData?.filelist?.filter((innerItem: any) =>
      //   (outerItem.aliasName === innerItem.inputfileid && innerItem.verified === "VERIFIED" && ['TRUSTEE','AUTHORIZER','SENIOR_MANAGEMENT'].includes(innerItem.verifyRole)))?.[0];
      // if (verifiedDoc) {
      //   verifiedDocCount++;
      // }
    // });
    // if (verifiedDocCount === totalDocCount && verifiedDocCount !== 0 && totalDocCount !== 0 && activeMilestone?.[0]?.trusteeApproveStatus !== '1') {
    //   setShowApproveReject(true);
    // }
    // if (paymentData?.contractStatus === "1" || paymentData?.contractStatus === "-1") {
    //   setShowApproveReject(false);
    // }
  // }, [paymentData]);

  const handleVerify = (txnID: any, imgUrl: any, key: any, imageId: any, docName: any) => {
    setLoading(true);
    const obj = {
      id: imageId,
      txn_ID: txnID,
      img_Url: imgUrl,
      key_d: key
    };
    setimageData(obj);
    setverifyVisible(true);
    setDocForEmail(docName)
    setButtonRequired('');
    setLoading(false);
  };

  const changePlatformStatus = (status: string, reason: string) => {
    setLoading(true);
    updatePlatformStatus({
      userAlias: userAlias,
      platformStatus: status,
      contractAlias: paymentData?.aliasName,
      transactionAlias: paymentData?.milestoneList?.filter((item: any) => item?.isActive === true)?.[0].aliasName,
      isMilestone: paymentData?.isMilestone,
      rejectedReason: reason ?? ""
    })
      .then(() => {
        setLoading(false)
        if (status === "1") {
          setApprovedModal(true);
        } else if (status === "2") {
          setRejectModal(true);
        } else if (status === "4") {
          setOnholdModal(true)
        }
        setTimeout(() => {
          if(paymentData?.isMilestone) {
            const milestone =paymentData?.milestoneList?.filter((item: any) => item?.trusteeApproveStatus === null)
            if(milestone.length > 0) {
              navigate(TrusteeTransaction, {
                state:{
                  tab:"Ongoing"
                }
              })
          
            } else {
              navigate(TrusteeTransaction, {
                state: {
                  tab: "Approved"
                }
              })

            }
          } else {
            navigate(TrusteeTransaction, {
              state: {
                tab: "Approved"
              }
            })

          }
        }, 3000);
      })
      .catch((error: any) => {
        setLoading(false)
        console.log("Error: ", error);
        openNotification(`UNABLE TO ${status === '1'? "APPROVE" : "REJECT" } CONTRACT`)
      })
  };

  // const handleRejectModal = () => {
  //   setModalHeader("Reject contract");
  //   setIsContractRejectModal(true);
  // }

  const rejectContract =(values: any) => {
    const reason = values?.rejectReason ?? ""
    changePlatformStatus('2', reason);
  }
  return (
    <>
      <div className="paymentrelease-trustee mt-3">{title}</div>
      {/* In case of milestone */}
      {paymentData?.isMilestone ?
        <Collapse defaultActiveKey={paymentData?.milestoneList?.map((item: any) => item.isActive).indexOf(true)} expandIconPosition={"right"} ghost 
        className="mt-4">
          {paymentData?.milestoneList?.map((data: any, index: number) => {
            return (
              <Panel
                header={`${ordinalSuffixOf(index + 1)} milestone - ${data.name}`}
                key={index}
                className="border-bottom payment-condition"
              >
                {data?.documentList?.map((data2: { name: any; aliasName: any; }, index: React.Key | null | undefined) => {
                  return (
                    <div className={Width > 1200 ? "d-inline-flex w-100 mb-2 mt-3":"d-flex-cloumn mb-2 mt-3"}
                      key={index}>
                      <span className={`d-flex align-items-center w-auto`}>
                          <Image src={Doc} alt="Document" preview={false} className="text-muted fs-20x file-img"/>
                          <div className="mx-3" style={{maxWidth:"870px", minWidth:"100px"}}>
                              <div className="stepDetails_medium_sub">
                                  {toTitleCase(data2?.name)}
                              </div>
                          </div>
                      </span>
                      {
                        paymentData?.filelist.filter((val: { inputfileid: any; }) => val.inputfileid == data2.aliasName).length > 0 ?
                          paymentData?.filelist.map((val: { inputfileid: any; verified: any}) => {
                            if (val.inputfileid === data2.aliasName) {
                              if (userType === 'TRUSTEE' && val.verified) {
                                return (
                                  <>
                                    <PendingStateComponent
                                      handleVerify={handleVerify}
                                      val={val}
                                      data2={data2}
                                      setButtonRequired={setButtonRequired}
                                      loading={loading}
                                    />                                  
                                  </>
                                );
                              } else {
                                return null;
                              }
                            }
                          })
                          :
                          <>
                            {/* This will not be a case when trustee is logged In */}
                          </>
                      }
                    </div>
                  );
                })}
                {/* {
                  showApproveReject && data.transactionStatus === "ACTIVE" && <div className=''>
                    <Divider />
                    <Form>
                      <div className="d-inline-flex justify-content-center w-100">
                        <Button className="modal-button mx-2" onClick={() => changePlatformStatus('1','')} loading={loading}>Approve</Button>
                        <Button className=" modal-button-cancel mx-2" onClick={() => handleRejectModal()} loading={loading}>Reject</Button>
                      </div>
                    </Form>
                  </div>
                } */}
                { paymentData?.isAgreementFull && !data?.releaseStatus && (
                  <div className="center mt-4">
                    {(!paymentData?.disputeDetails?.isGenerated &&
                      paymentData?.filelist?.length > 0 &&
                      data?.trusteeApproveStatus === "1" &&
                      data?.approveStatus === "1" &&
                      parseInt(paymentData?.contractStatus) < 7) && (
                        <Button
                          type="primary"
                          className="mx-2 modal-button initiate-payment"
                          onClick={() => releasePayment()}
                          loading={loading}
                        >
                          Initiate Payment
                        </Button>
                      )
                    }
                  </div>
                )}
              </Panel>
            );
          })}
        </Collapse> :
        // In case of no milestone
        <>
            {paymentData?.milestoneList?.map((data: { documentList: any[]; }) => {
              return (
                data?.documentList?.map((data2: { name: any; aliasName: any; }, index: React.Key | null | undefined) => {
                  return (
                    <div
                      className={Width > 1200 ?"d-inline-flex  w-100 position-relative mb-2 mt-3 verified-button resverified-btn" : "d-flex flex-row  w-100 verified-button position-relative mb-2 mt-1 resverified-btn"}
                      key={index}
                    >
                      <span className={Width  > 1200 ? "d-inline-flex align-items-center resdoc_img" :"d-inline-flex align-items-center"}>
                          <Image src={Doc} alt="Document" preview={false} className="text-muted fs-20x file-img"/>
                          <div className="mx-3" style={{maxWidth:"870px", minWidth:"100px"}}>
                              <div className="stepDetails_medium_sub docName-wrap">
                                  {toTitleCase(data2?.name)}
                              </div>
                          </div>
                      </span>
                      { !paymentData?.isDispute &&
                        paymentData?.filelist.filter((val: { inputfileid: any; }) => val.inputfileid == data2.aliasName).length > 0 ?
                          paymentData?.filelist.map((val: { inputfileid: any;verified: any }) => {
                            if (val.inputfileid === data2.aliasName) {
                              if (userType === 'TRUSTEE' && val.verified) {

                                return (
                                  <>
                                    <PendingStateComponent
                                      handleVerify={handleVerify}
                                      val={val}
                                      data2={data2}
                                      setButtonRequired={setButtonRequired}
                                      loading={loading}
                                      setLoading={setLoading}
                                      // buttonRequired={buttonRequired}
                                    />
                                   
                                  </>
                                );
                              } else {
                                return null;
                              }
                            }
                          }) : null
                      }
                    </div>
                  );
                })
              );
            })}
        </>
      }
      {/* {
        showApproveReject && !paymentData?.isMilestone && <div className=''>
          <hr className="lightgrayHr" />
          <Form>
            <div className="d-inline-flex justify-content-center w-100 res-approve-btns">
              <Button className="rounded mt-0 mb-1" onClick={() => changePlatformStatus('1', '')}>Approve</Button>
              <Button className="rounded_cancel_btn mx-2 mt-0 mb-1 reject-res-btn" onClick={() => handleRejectModal()}>Reject</Button>
            </div>
          </Form>
        </div>
      } */}
      { !paymentData?.isMilestone && paymentData?.isAgreementFull && !paymentData?.milestoneList?.[0]?.releaseStatus && (
        <div className="center mt-4">
          {(!paymentData?.disputeDetails?.isGenerated &&
            paymentData?.filelist?.length > 0 &&
            paymentData?.milestoneList?.[0]?.trusteeApproveStatus === "1" &&
            paymentData?.milestoneList?.[0]?.approveStatus === "1" &&
            parseInt(paymentData?.contractStatus) < 7) && (
              <Button
                type="primary"
                className="mx-2 modal-button initiate-payment"
                onClick={() => releasePayment()}
                loading={loading}
              >
                Initiate Payment
              </Button>
            )
          }
        </div>
      )}

      <VerifyModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imageData={imageData}
        _fetchPaymentConditions={_fetchPaymentConditions}
        docForEmail={docForEmail}
        idOfContract=''
        stateData={userData}
        buttonRequired={buttonRequired}
         _getPaymentDetails={getPaymentDetails}
         isVerified={isVerified}
         setIsVerified={setIsVerified}
      />

      <Modal
        className="text-center modals"
        centered
        visible={approvedModal}
        width={410}
        footer={null}
      >
        <Image className="mb-1" src={DashboardImg} preview={false} style={{ height: '56px', width: '56px', borderRadius: '50%' }} />
        <AuthTitle children='TrustIn escrow transaction approved!' className="mt-2" />
      </Modal>

      <Modal
        className="text-center modals"
        centered
        visible={rejectModal}
        width={410}
        footer={null}
      >
        <Image className="mb-1" src={reject} preview={false} style={{ height: '56px', width: '56px', borderRadius: '50%', opacity: '0.5' }} />
        <AuthTitle children={<>TrustIn <br /> escrow transaction rejected!</>} className="mt-2" />
      </Modal>
      <Modal
        className="text-center modals"
        centered
        visible={onholdModal}
        width={410}
        footer={null}
      >
        <Image className="mb-1" src={reject} preview={false} style={{ height: '56px', width: '56px', borderRadius: '50%', opacity: '0.5' }} />
        <AuthTitle children={<>TrustIn <br /> escrow transaction on hold!</>} className="mt-2" />
      </Modal>
      <Modal
        open={contractRejectModal}
        onCancel={() => {
          setIsContractRejectModal(false);
        }}
        footer={false}
        title={
          <span
            className={"change-client-classification errMsg"}
          >
            {/* {modalHeader} */}
            <hr className="lightgrayHr mb-3" />
          </span>
        }
        centered
        width={520}
        className="modal-box"
      >
        <Form scrollToFirstError onFinish={rejectContract} form={form}>
          <p className="enter-text mb-4">Enter comment below</p>
          <Form.Item
            name="rejectReason"
            rules={[
              {
                required: true,
                message: "Please enter reason !",
              },
              {
                whitespace: true,
                message: "Invalid reason!",
              },
            ]}
            className="modal_inputField"
          >
            <TextArea
              rows={4}
              placeholder="Write your reason here"
              className="modalTextArea mt-4 pt-2"
            />
          </Form.Item>
          <Row className="center_res">
            <div className="d-flex mt-5 mb-3">
              <Button className="rounded mt-0" htmlType="submit">
                Submit
              </Button>
              <Button
                className="rounded_cancel_btn mx-3 mt-0"
                onClick={() => {
                  setIsContractRejectModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default TrusteeReleaseCondition;
