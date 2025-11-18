import { Card, Row,Image, Tabs, Modal, Form, Button, message, Tooltip } from "antd";
import { useState } from "react";
import BlueEye from "../../assets/img/blue_eye.svg";
import TabPane from "antd/lib/tabs/TabPane"; 
import { getLocalStorage } from "../Common/Constants";
import PDFPreview from "../Common/PdfPreviewIcon";
import { PrimaryOutLineButton, SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import SubApproverDetails from "../Common/SubApproverDetails";
import TextArea from "antd/es/input/TextArea";
import { chequeVerification, updateSellerFile } from "../../services/cheque";
import DisputePdfViewModal from "../Models/DisputePdfViewModal";

const SellerDocuments = (props: any) => {
   
  const { transactionpreview, customAttachmentUrls , getChequeDetail , id , chequeDetail, isToBeApproved} = props;
    
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
                isToBeApproved={isToBeApproved}
              /> 
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
    chequeDetail,
    isToBeApproved
  } = props;
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const handlePDFView =(url:any)=>{
    setImageUrl(url);
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


  const [form] = Form.useForm(); 

  const userData = JSON.parse(getLocalStorage("auth")!);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const name = JSON.parse(getLocalStorage("auth")!)?.name;
  
 
  const handleReject = async () => {
      let obj;
      if(userType == 'TRUSTEE'){
        obj = {
          approverReason: comment,
          isCompliance : false,
          isRejected : true,
          approverVerifyRole : userType,
          approverVerifiedBy : userAlias,
          approverName : name
        };
      } else {
        obj = {
          reason: comment,
          name : name,
          isRejected : true,
          verified : "REJECTED",
          verifyRole : userType,
          verifiedBy : userAlias
        };
      }
      
     
      updateSellerFile(file, obj).then(()=>{
        
      }).catch((error) => {
          console.error("Error updating seller file:", error);
      });
       
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
       
  
      updateSellerFile(file, obj).then(()=>{
        
        handleModalCancel();
        getChequeDetail();
      })
       
    };



  const onApprove = (values: any)=> {
    if(userData?.userType == 'TRUSTEE') { //
      const isAllVerified = !chequeDetail?.customAttachments.map((a : any)=>a.isCompliance).includes(null) && !chequeDetail?.customAttachments.map((a : any)=>a.isCompliance).includes(false);
      if(!isAllVerified){
        message.warning("Please verify documents");
        return;  
      }
    } else if(userData?.userType == 'AUTHORIZER') {
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

    const body = {
      name : userData?.name,
      userType : userData?.userType,
      userAlias : userData?.userAlias,
      comment: values.comment,
    };
 
    setBtnDisable(true);
    chequeVerification(id,body).then(()=>{
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
    chequeVerification(id,body).then(()=>{
      message.success("Rejected successfully.");
      getChequeDetail();
    }).catch((e)=>{
      console.log("e",e);
      message.error("Something went wrong.");
    }).finally(() => {
      setBtnDisable(false);
      setRejectModal(false);
    }
  )
    
  }
    
    const handleComment = (event: any) => {
      setComment(event.target.value);
    };
    const handleModalCancel = () => { 
      setCommentModal(false);  
      SetCommentModalReject(false);
      setApproveModal(false);
      setRejectModal(false);
      form.resetFields(["comment"])
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
                              <div>
                                <Tooltip
                                    title={
                                      fileData?.document && fileData.document.length > 20
                                        ? fileData.document
                                        : null
                                    }
                                    placement="top"
                                    overlayClassName="leads-custom-tooltip"
                                  >
                                    <div className="managerchque-ellipsis-container">
                                  <span className="ant-card-meta-title">{fileData.document}</span>
                                      </div>
                                    </Tooltip> 
                              </div>
                             
                              <Image
                                alt="example"
                                preview={false}
                                src={BlueEye}
                                className="cursor"
                                onClick={() => {
                                  if (fileData?.url.includes(".pdf")) {
                                    handlePDFView(fileData?.url)
                                  } else {
                                    setImageUrl(fileData?.url);
                                    // setViewModal(true);
                                  }
                                }}
                              />
                            </div>
                          </Card>
                          {userType == 'TRUSTEE' && chequeDetail?.chequeStatus == "2" ? 
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
                              className="mt-4 reject-btn"
                              onClick={() => {
                                setModalTitle("document");
                                SetCommentModalReject(true);
                                setFile(fileData.id)
                              }}
                            />
                           </div>
                          </div> : '' }
                        </div> :
                          <div key={i} style={{margin : '10px'}} className="documentcard-width"> <SubApproverDetails
                          modalTitle={fileData.document}
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

                    <div style={{ display : "flex", justifyContent : "end" }} >
                    { userData?.userType == 'TRUSTEE' && chequeDetail?.chequeStatus == "2" && !chequeDetail?.isApproverVerified && isToBeApproved ? <>
                    
                      <Button
                        style={{ width : "auto"}}
                        type="primary"
                        key="confirm"
                        disabled={btnDisable}
                        className="modal-button mt-5 mx-3"
                        onClick={() => {
                          setApproveModal(true);
                        }}>
                        Approve
                      </Button>

                      <Button
                        style={{ width : "auto"}}
                        type="primary"
                        key="confirm"
                        disabled={btnDisable}
                        className="modal-button-cancel mt-5 mx-2"
                        onClick={() => {
                          setRejectModal(true);
                        }}>
                        Reject
                      </Button>
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
                                      <div>
                                          <Tooltip
                                          title={
                                            fileData?.document && fileData.document.length > 20
                                              ? fileData.document
                                              : null
                                          }
                                          placement="top"
                                          overlayClassName="leads-custom-tooltip"
                                        >
                                          <div className="managerchque-ellipsis-container">
                                            <span className="ant-card-meta-title">{fileData.document}</span>
                                          </div>
                                        </Tooltip> 
                                     </div>
                                      <Image
                                        alt="example"
                                        preview={false}
                                        src={BlueEye}
                                        className="cursor"
                                        onClick={() => {
                                          if (fileData?.url.includes(".pdf")) {
                                            handlePDFView(fileData?.url)
                                          } else {
                                            setImageUrl(fileData?.url);
                                            // setViewModal(true);
                                          }
                                        }}
                                      />
                                    </div>
                                  </Card>
                                  {userType == 'AUTHORIZER' && chequeDetail?.chequeStatus == "2" ? 
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
                                  modalTitle={fileData.document}
                                  contractDetail={chequeDetail}
                                  approverDetails={fileData}
                                  proStatus={fileData.verified }
                                  getChequeDetail={getChequeDetail}
                                  uploadedFile={fileData?.url}
                                  tab="authorizer" 
                                /></div>
                                ))}
                              </div>

                              <div style={{ display : "flex", justifyContent : "end" }} >
                              {  userData?.userType == 'AUTHORIZER' && chequeDetail?.chequeStatus == "2" && !chequeDetail?.isAuthorizerVerified && isToBeApproved ? 
                              <>
                               <Button
                                  style={{ width : "auto"}}
                                  type="primary"
                                  key="confirm"
                                  disabled={btnDisable}
                                  className="modal-button mt-5 mx-3"
                                  onClick={() => {
                                    setApproveModal(true);
                                  }}>
                                  Approve
                                </Button>
          
                                <Button
                                  style={{ width : "auto"}}
                                  type="primary"
                                  key="confirm"
                                  disabled={btnDisable}
                                  className="modal-button-cancel mt-5 mx-2"
                                  onClick={() => {
                                    setRejectModal(true);
                                  }}>
                                  Reject
                                </Button>
                              </>
                                : null }
                                </div>
                            </div>
                      </TabPane>
          </Tabs>
          </div> 

           {/* approve document */}
      <Modal
        open={CommentModal}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification">
            {modalTitle}
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={handleApprove}
        >
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              {
                min:20,
                message:"Please enter minimum 20 characters"
              }
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              placeholder="Please enter your comment"
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit
            </Button>
            <Button
              key="cancel"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
      {/* Reject document */}
      <Modal
        open={CommentModalReject}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification errMsg">
            Reject {modalTitle}
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={handleReject}
        >
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              {
                min:20,
                message:"Please enter minimum 20 characters"
              }
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              placeholder="Please enter your comment"
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit
            </Button>
            <Button
              key="submit"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        open={approveModal}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification">
            Approve contract
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={onApprove}
        >
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              {
                min:20,
                message:"Please enter minimum 20 characters"
              }
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              placeholder="Please enter your comment"
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit
            </Button>
            <Button
              key="submit"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>



      {/* reject modal */}
      
      <Modal
        open={rejectModal}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification">
            Reject transaction
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Form
          form={form}
          scrollToFirstError
          layout="vertical"
          name="form_in_modal"
          className="py-2"
          onFinish={onReject}
        >
          <div className="subText mb-4">Comment *</div>
          <Form.Item
            name="comment"
            rules={[
              {
                required: true,
                message: "Please add some comment!",
              },
              {
                min:20,
                message:"Please enter minimum 20 characters"
              }
            ]}
            className="modal_inputField"
          >
            <TextArea
              className="modalTextArea mt-4 p-3"
              rows={3}
              placeholder="Please enter your comment"
              onChange={(e) => {
                handleComment(e);
              }}
            />
          </Form.Item>
          <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit
            </Button>
            <Button
              key="submit"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={() => {
                handleModalCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal>



      {imageUrl && imageUrl.includes(".pdf") && 
        <DisputePdfViewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imageUrl}
        setImagUrl={setImageUrl}
      />} 


      {imageUrl && !imageUrl.includes(".pdf") && 
        <Image
          className="img_preview"
          preview={{
            visible: !!imageUrl,
            src: imageUrl,
            onVisibleChange: (value) => {
              setImageUrl(value);
            },
          }}
        />   
      }
     
  </>
}
export default SellerDocuments;
