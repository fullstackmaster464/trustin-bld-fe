/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NormalText } from "../ui-elements/TextRepo";
import { Card, Col, Row,Image, Tabs, Modal, Form, Button, message, Upload, UploadProps, Spin } from "antd";
import { useState } from "react";
import BlueEye from "../../assets/img/blue_eye.svg";
import Edit from "../../assets/img/edit.svg";
import TabPane from "antd/lib/tabs/TabPane"; 
import { acceptedFileExtension, beforeUploadFile, getLocalStorage, MANAGER_CHEQUE } from "../Common/Constants";
import PDFPreview from "../Common/PdfPreviewIcon";
import Meta from "antd/es/card/Meta";
import { PrimaryOutLineButton, SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import SubApproverDetails from "../Common/SubApproverDetails";
import { chequeVerification, updateCheque, updateFile } from "../../services/cheque";
import DisputePdfViewModal from "../Models/DisputePdfViewModal";
import { deleteSignFile } from "../../services/user";
import { CommentModalForm } from "./CommentModalForm";

const CustomChequeDetails = (props: any) => {
  const { customFieldList, transactionpreview, customAttachmentUrls , getChequeDetail , id , chequeDetail} = props;
  
  let objKeys;
  if (customFieldList) {
    objKeys = Object.keys(customFieldList);
  }


  return (
    <div>
      <Card className="grayCard pt-3">
        <Row> 
            <CustomAttachments 
                id={id}
                customAttachUrl={customAttachmentUrls} 
                transactionpreview ={transactionpreview}     
                getChequeDetail={getChequeDetail}
                chequeDetail={chequeDetail} 
              /> 
        </Row>
        <Row gutter={{ md: 36, sm: 16, xs: 16 }} >
          <Col md={24} xs={24}>
          <ul>
            {objKeys?.map((item:any,index: any) => {
              return (
                <li key={index}>
                  <NormalText className="subText_small textalign my-3">{customFieldList[item]}</NormalText>
                </li>
              );
            })}
            </ul>
          </Col>
        </Row> 
      </Card>
    </div>
  );
};
const CustomAttachments = (props:any) => {
  const {
    id,
    customAttachUrl, 
    getChequeDetail,
    chequeDetail
  } = props;
  const [imagUrl, setImagUrl] = useState<any>(customAttachUrl);
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const handlePDFView =(url:any)=>{
    setImagUrl(url);
    setverifyVisible(true);
  }

  
  const [CommentModal, setCommentModal] = useState(false);
  const [CommentModalReject, SetCommentModalReject] = useState(false); 
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [modalTitle, setModalTitle] = useState(""); 
  const [comment, setComment] = useState("");  
  const [file, setFile] = useState<string>("");
  const [ btnDisable, setBtnDisable ] = useState<boolean>(false);
  const [viewModal, setViewModal] = useState(false);
  const [fileData, setFileData] = useState<any>();

  const [form] = Form.useForm();
  const [formApproveDoc] = Form.useForm();
  const [formRejectDoc] = Form.useForm();
  const [formApproveContract] = Form.useForm();
  const [formRejectTxn] = Form.useForm();
 

  const userData = JSON.parse(getLocalStorage("auth")!);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const name = JSON.parse(getLocalStorage("auth")!)?.name;

  const [loadingCard, setLoadingCard] = useState(false);

  const local = getLocalStorage("auth");
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const Token = local ? JSON.parse(local)?.token : "";  
  
  const handleReject = async () => {
      let obj;
      if(userType == 'TRUSTEE'){
        obj = {
          approverReason: comment,
          isCompliance : false,
          approverVerifyRole : userType,
          approverVerifiedBy : userAlias,
          approverName : name
        };
      } else {
        obj = {
          reason: comment,
          name : name,
          verified : "REJECTED",
          verifyRole : userType,
          verifiedBy : userAlias
        };
      }
     
      updateFile(file,id, obj).then(()=> {
        // console.log("data",data);

        handleModalCancel();
        getChequeDetail();
      }).catch((error) => {
          console.error("Error updating file:", error);
          message.error("Failed to update document");
          handleModalCancel();
      });
       
    };

    
    const displayEditBtn  = () => {
      if(!chequeDetail) return false;
      if(chequeDetail.contractStartedBy == 'BUYER' && userAlias == chequeDetail.buyerAlias) {
        return true;
      } else if(chequeDetail.contractStartedBy == 'SELLER' && userAlias == chequeDetail.sellerAlias) {
        return true;
      }
      return false;
    }
  
    const propss: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount:1,
        headers: { authorization: `Bearer ${Token}`, },
        data: {
          userAlias: userAlias,
        },
        action: REACT_APP_SERVER_URL + "/api/v1/seller-verification/uploadDocument",
        beforeUpload: async (file: any, fileListToUpload: any) => {
          const totalFiles = fileListToUpload?.length;
          if (totalFiles > 10) {
            message.error('You can only upload a maximum of 10 files.');
            return false;
          }
          const checkBeforeUpload = beforeUploadFile(file,"Document");
          if (checkBeforeUpload == true) {
            setLoadingCard(true);
            return true;
          }
          else {
            setLoadingCard(false);
            message.warning(checkBeforeUpload);
            return false;
          }
        }, 
    
        onChange: async (info : any) => {
          const { status, response } = info.file;
      
          
          if(!status || !response) {
            setLoadingCard(false)
            return;
          }
    
          if(!response?.data?.id){
            message.warning("Something went wrong");
            return;
          }
          setLoadingCard(true);
          
            const newCustomAttachmentIds = chequeDetail?.customAttachments?.map((item: any) => {
              if (item.id === fileData?.id) {
                return response.data.id;
              }
              return item.id;
            });
          
            const payLoad = {
              customAttachments: newCustomAttachmentIds ,
              isApproverVerified : false,
              approverName : null,
              approverRole : null,
              approverUpdateDate : null,
    
              isAuthorizerVerified : false,
              authorizerName : null,
              authorizerRole : null,
              authorizerUpdateDate : null,
            }
                         
            updateCheque(chequeDetail.aliasName,payLoad)
             .then(() => {
                deleteSignFile({ fileID: fileData.id }).catch()
                getChequeDetail()
              })
              .catch(() => {
                message.error("Failed to update document");
              })
              .finally(() => {
                setLoadingCard(false);
              });
            return;
        },
      };

   const handleApprove = async () => {
      
      let obj;
      if(userType == 'TRUSTEE'){
        obj = { 
          approverReason : comment,
          isCompliance : true,
          approverVerifyRole : userType,
          approverVerifiedBy : userAlias,
          approverName : name
        };
      } else {
        obj = {
          reason: comment,
          name : name,
          verified : "VERIFIED",
          verifyRole : userType,
          verifiedBy : userAlias,
        };
      }
       
       updateFile(file, id, obj).then(()=>{
        // console.log("data",data);
        handleModalCancel();
        getChequeDetail();
      })
       
    };

    const downloadFile = (fileUrl: string, fileName = "downloaded_file") => {
      try {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Failed to download file:', error);
        message.error('Failed to download file. Please try again.');
      }
    };
    

  const onApprove = (values: any)=> { 

    const body = {
      name : userData?.name,
      userType : userData?.userType,
      userAlias : userData?.userAlias,
      comment: values.comment,
    };
 
    setBtnDisable(true);
    chequeVerification(id,body).then((data : any)=>{
      console.log("data",data);
      message.success("Verified successfully.");
      getChequeDetail();
    }).finally(() => setBtnDisable(false))
    setApproveModal(false);
  }

  const onReject = (values: any)=> {
     
    const body = {
      name : userData?.name,
      userType : userData?.userType,
      userAlias : userData?.userAlias,
      comment: values.comment,
      chequeStatus: "-1",
    };
 
    setBtnDisable(true);
    chequeVerification(id,body).then((data : any)=>{
      console.log("data",data);
      message.success("Rejected successfully.");
      getChequeDetail();
    }).finally(() => {
      setBtnDisable(false);
      setRejectModal(false);
    }
  )
    
  }
  
    const handleModalCancel = () => { 
      setCommentModal(false);  
      SetCommentModalReject(false);
      setApproveModal(false);
      setRejectModal(false);
      form.resetFields();
      formApproveDoc.resetFields();
      formRejectDoc.resetFields();
      formApproveContract.resetFields();
      formRejectTxn.resetFields();
      setComment("");
    };
    
  return <>  
      <div className="afterApproveCard escrow-tran-card" style={{width : "100%"}}>
          <Tabs className="d-none-res tableTab"  defaultActiveKey={userType}>
              <TabPane tab={`Approver`} key="TRUSTEE">
                  <div className="mangercheque-doc-block">
                    <div className={ "d-flex gap-5 flex-wrap moa-doc-list"} >
                        {customAttachUrl.map((fileData: any, i : number) => (
                          !fileData.approverReason ? 
                          <div key={i} className="documentcard-width" style={{ width : "100%" }}>
                            {loadingCard ? <div className="loading-container"><Spin /></div> : null}
                          <Card
                            className=" kybcard"
                            cover={
                              fileData.url.includes(
                                ".pdf"
                              ) ? (
                                <>
                                  <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(fileData.url) }}>
                                    <PDFPreview
                                      url={fileData.url || ''}
                                      onPreviewClick={handlePDFView}
                                    />
                                  </div>
                                </>
                              ) : (
                                <Image
                                  alt="example"
                                  src={fileData?.url}
                                  height={175}
                                />
                              )
                            }
                          >
                            <div className="d-flex justify-content-between">
                              <Meta title={fileData.document ?? `Document ${i+1}`}/>
                              <div className="d-flex mx-2">
                              {displayEditBtn() ? 
                                <span className="mx-2">
                                  <Upload  {...propss} accept={acceptedFileExtension} className="ant-image">
                                  <Image
                                    src={Edit}
                                    id="image-upload"
                                    alt="example"
                                    preview={false}
                                    className="px-0 cursor"
                                    onClick={() => {
                                      setFileData(fileData);
                                    }}
                                  />
                                  </Upload>
                                  </span> : null }
                                  <Image
                                    alt="example"
                                    preview={false}
                                    src={BlueEye}
                                    className="cursor"
                                    onClick={() => {
                                      if (fileData?.url.includes(".pdf")) {
                                        handlePDFView(fileData?.url)
                                      } else {
                                        setImagUrl(fileData?.url);
                                        setViewModal(true);
                                      }
                                    }}
                                  />
                              </div>
                            </div>
                          </Card>
                          {userType == 'TRUSTEE' && chequeDetail?.isPaymentInitialized ? 
                          <div className="d-flex align-items-center" style={{justifyContent : "center"}}>
                           <div className="button-container">
                           <SecondaryOutLineButton
                              children="Approve"
                              className="mt-4 mx-2"
                              onClick={() => {
                                setModalTitle("Approve document");
                                setFile(fileData.id)
                                setCommentModal(true);  
                              }}
                            />
                            <PrimaryOutLineButton
                              children="Reject"
                              className="mt-4 reject-btn managercheque-reject-btn"
                              onClick={() => {
                                setModalTitle("document");
                                SetCommentModalReject(true);
                                setFile(fileData.id)
                              }}
                            />
                           </div>
                           
                          </div> : '' }
                        </div> :
                          <div key={i} style={{margin : '10px'}} className="documentcard-width"> 
                          <SubApproverDetails
                          modalTitle={`Document ${i+1}`}
                          isCustomChequeDocument={true}
                          approverDetails={fileData}
                          contractDetail={chequeDetail}
                          getChequeDetail={getChequeDetail}
                          proStatus={fileData.approverReason && fileData?.isCompliance ? "VERIFIED" : null }
                          uploadedFile={fileData?.url}
                          tab="approver" 
                        /></div>
                        ))}

                    </div>
                 </div>

                    <div>
                    { userData?.userType == 'TRUSTEE' && chequeDetail?.isPaymentInitialized && !chequeDetail?.isApproverVerified ? <>
                      <div className="d-flex justify-content-end gap-3">
                        <Button
                          key="submitta"
                          type="primary"
                          htmlType="submit"
                          disabled={btnDisable}
                          className="modal-button mt-4"
                          onClick={() => {
                            if(userData?.userType == 'TRUSTEE') { //
                              const isAllVerified = !chequeDetail?.customAttachments.map((a : any)=>a.isCompliance).includes(null) && !chequeDetail?.customAttachments.map((a : any)=>a.isCompliance).includes(false);
                              if(!isAllVerified){
                                message.warning("Please verify documents");
                                return;  
                              }
                            }
                            setApproveModal(true);
                          }}>
                          Approve
                        </Button>
                        <Button
                          key="submit"
                          type="primary"
                          className="modal-button-cancel mt-4"
                          disabled={btnDisable}
                          onClick={() => {
                            setRejectModal(true);
                          }}>
                          Reject
                        </Button>
                      </div>
                    </>
                     : null}
                    </div>

                    </TabPane>
                    <TabPane tab={`Authorizer`} key="AUTHORIZER">
                            <div className="mangercheque-doc-block">
                            <div className={ "d-flex gap-5 flex-wrap moa-doc-list"} >
                                {customAttachUrl.map((fileData: any , i : number) => (
                                  !fileData.verifiedBy ? 
                                  <div key={i} className="documentcard-width" style={{ width : "100%" }}>
                                  <Card
                                    className=" kybcard"
                                    cover={
                                      fileData.url.includes(".pdf") ? ( 
                                        <>
                                          <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(fileData.url) }}>
                                            <PDFPreview
                                              url={fileData.url || ''}
                                              onPreviewClick={handlePDFView}
                                            />
                                          </div>
                                        </>
                                      ) : (
                                        <Image
                                          alt="example"
                                          src={fileData?.url}
                                          height={175}
                                        />
                                      )
                                    }
                                  >
                                    <div className="d-flex justify-content-between">
                                      <Meta title={fileData.document ?? `Document ${i+1}`}/>
                                      <div className="d-flex mx-2">
                                        { displayEditBtn() ? 
                                          <span className="mx-2" >
                                            <Upload  {...propss} accept={acceptedFileExtension} className="ant-image">
                                            <Image
                                              src={Edit}
                                              id="image-upload"
                                              alt="example"
                                              preview={false}
                                              className="px-0 cursor"
                                              onClick={() => {
                                                setFileData(fileData);
                                              }}
                                            />
                                            </Upload>
                                            </span> : null }
                                                <Image
                                                  alt="example"
                                                  preview={false}
                                                  src={BlueEye}
                                                  className="cursor"
                                                  onClick={() => {
                                                    if (fileData?.url.includes(".pdf")) {
                                                      handlePDFView(fileData?.url)
                                                    } else {
                                                      setImagUrl(fileData?.url);
                                                      setViewModal(true);
                                                    }
                                                  }}
                                                />
                                              </div>
                                    </div>
                                  </Card>
                                  {userType == 'AUTHORIZER' && chequeDetail?.isPaymentInitialized ? 
                                  <div className="d-flex align-items-center" style={{justifyContent : "center"}}>
                                    <div className="button-container">
                                    <SecondaryOutLineButton
                                      children="Approve"
                                      className="mt-4 mx-2"
                                      onClick={() => {
                                        setModalTitle("Approve document");
                                        setFile(fileData.id)
                                        setCommentModal(true); 
                                      }}
                                    />
                                    <PrimaryOutLineButton
                                      children="Reject"
                                      className="mt-4"
                                      onClick={() => {
                                        setModalTitle("document");
                                        SetCommentModalReject(true);
                                        setFile(fileData.id)
                                      }}
                                    />
                                    </div>
                                  </div> :
                                  ""
                                  }

                                </div> :
                                  <div key={i} style={{margin : '10px'}} className="documentcard-width"> 
                                  <SubApproverDetails
                                  modalTitle={`Document ${i + 1}`}
                                  isCustomChequeDocument={true}
                                  contractDetail={chequeDetail}
                                  approverDetails={fileData}
                                  getChequeDetail={getChequeDetail}
                                  proStatus={fileData.verified }
                                  uploadedFile={fileData?.url}
                                  tab="authorizer" 
                                /></div>
                                ))}
                              </div>

                              <div style={{ display : "flex", justifyContent : "end" }} >
                              {  userData?.userType == 'AUTHORIZER' && chequeDetail?.isPaymentInitialized && !chequeDetail?.isAuthorizerVerified ? 
                              <>
                              <div className="">
                                  <Button
                                    key="submitta"
                                    type="primary"
                                    htmlType="submit"
                                    disabled={btnDisable}
                                    className="modal-button mt-5"
                                    onClick={() => {
                                      if(userData?.userType == 'AUTHORIZER') {
                                        const isAllVerified = !chequeDetail?.customAttachments.map((a : any)=>a.verified).includes(null) && !chequeDetail?.customAttachments.map((a : any)=>a.verified).includes("REJECTED");
                                        if(!isAllVerified) {
                                          message.warning("Please verify documents");
                                          return;  
                                        }
                                        if(!chequeDetail?.isApproverVerified) {
                                          message.warning("Not yet approved from approver");
                                          return;
                                        }
                                      }
                                      setApproveModal(true);
                                    }}>
                                    Approve
                                  </Button>
                                  <Button
                                    key="submit"
                                    type="primary"
                                    className="modal-button-cancel mt-5 mx-2"
                                    disabled={btnDisable}
                                    onClick={() => {
                                      setRejectModal(true);
                                    }}>
                                    Reject
                                  </Button>
                                </div>
                              </>
                                : null }
                                </div>
                            </div>
                      </TabPane>
          </Tabs>
          </div> 

    {/* Approve Document */}
    <CommentModalForm
      open={CommentModal}
      title={modalTitle}
      comment={comment}
      form={formApproveDoc}
      onCommentChange={setComment}
      onSubmit={handleApprove}
      onCancel={handleModalCancel}
      maxCommentLength={MANAGER_CHEQUE.DOCUMENT_COMMENT_MAX_LENGTH}
    />

    {/* Reject Document */}
    <CommentModalForm
      open={CommentModalReject}
      title={`Reject ${modalTitle}`}
      comment={comment}
      isErrorTitle
      form={formRejectDoc}
      onCommentChange={setComment}
      onSubmit={handleReject}
      onCancel={handleModalCancel}
      maxCommentLength={MANAGER_CHEQUE.DOCUMENT_COMMENT_MAX_LENGTH}
    />

    {/* Approve Contract */}
    <CommentModalForm
      open={approveModal}
      title="Approve contract"
      comment={comment}
      form={formApproveContract}
      onCommentChange={setComment}
      onSubmit={onApprove}
      onCancel={handleModalCancel}
      maxCommentLength={MANAGER_CHEQUE.FINAL_COMMENT_MAX_LENGTH}
    />
    {/* Reject Transaction */}
    <CommentModalForm
      open={rejectModal}
      title="Reject transaction"
      comment={comment}
      form={formRejectTxn}
      onCommentChange={setComment}
      onSubmit={onReject}
      onCancel={handleModalCancel}
      maxCommentLength={MANAGER_CHEQUE.FINAL_COMMENT_MAX_LENGTH}
    />
    
      <Modal
        open={viewModal}
        footer={false}
        className="modal-box "
        title={
          <span className="change-client-classification">
            Preview
            <hr className="lightgrayHr" />
          </span>
        }
        centered
        width={520}
        onCancel={() => setViewModal(false)}
      >
        <div className="text-center">
            <Image
              src={imagUrl}
              preview={false}
              alt="preview"
              className="max-h-460 my-3"
            />
        </div>
        <Button
          type="primary"
          className="docudownloadBtn"
          onClick={() => downloadFile(imagUrl, "preview_image.jpg")}
        >
          Download
        </Button>
      </Modal>

      {imagUrl.includes(".pdf") && 
            <DisputePdfViewModal
            isverifyVisible={isverifyVisible}
            setverifyVisible={setverifyVisible}
            imagUrl={imagUrl}
            setImagUrl={setImagUrl}
          />} 
     
  </>
}
export default CustomChequeDetails;
