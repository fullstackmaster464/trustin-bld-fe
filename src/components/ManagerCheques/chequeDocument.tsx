import { Card, Image, Modal, Form, Button, Input, UploadProps, Upload, message } from "antd";
import { useState } from "react";
import PDFPreview from "../Common/PdfPreviewIcon";
import Delete from "../../assets/img/delete.svg";
import PlusUpload from "../../assets/img/PlusUpload.svg"; 
import rejects from "../../assets/modals/rejected.gif"; 
import DisputePdfViewModal from "../Models/DisputePdfViewModal";
import { acceptedFileExtension, beforeUploadFile, getLocalStorage } from "../Common/Constants";
import { updateCheques } from "../../services/cheque";
import { NormalText } from "../ui-elements/TextRepo";
import PDFPreviewIcon from "../Common/PdfPreviewIcon";

const ChequeDocument = (props: any) => {
    
  const {
    documents,
    chequeDetail,
    getChequeDetail
    // chequeAlias,
  } = props;
  const [imageUrl, setImageUrl] = useState<any>(null);
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [uploadModal, setUploadModal] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  
  const [removeModal, setRemoveModal] = useState<boolean>(false);
   

  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const maxCustomAttachments = parseInt(process.env.MAX_CUSTOM_ATTACHMENTS as string) || 5;
  
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const userType = local ? JSON.parse(local)?.userType : "";
  const Token = local ? JSON.parse(local)?.token : ""; 

  const handlePDFView =(url:any)=> {
    setImageUrl(url);
    setverifyVisible(true);
  }
 

  const [form] = Form.useForm();

  const propss: UploadProps = {
    name: 'file',
    multiple: true,
    maxCount:10,
    headers: { authorization: `Bearer ${Token}`, },
    data: {
      type: "documents",
      userAlias: userAlias,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/contracts/uploadSignature",
    beforeUpload: async (file: any, fileListToUpload: any) => {
      const totalFiles = documents?.length + fileListToUpload?.length;
      if (totalFiles > 10) {
        message.error('You can only upload a maximum of 10 files.');
        return false
      }

      const checkBeforeUpload = beforeUploadFile(file,"Document");
      

      if (checkBeforeUpload == true) { 
        setLoading(true);
        return true;
      } else {
        setLoading(false);
        if(typeof checkBeforeUpload == 'string'){
          message.warning(checkBeforeUpload);
        }
        return false
      }
    },

    onChange: async (info) => {
      const { status, response } = info.file;
      
      
      if (status === 'uploading') {
        setLoading(true);
      }
      if (status === 'done') { 
        setUploadedFile(response);
        setLoading(false);
        
      } else if (status === 'error') {
        setLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };
  
  const validateBeneficiaryName = (value: any) => {
    if (!value || value.trim() === "") {
        return Promise.reject(new Error("Please enter document name"));
    }
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
        return Promise.reject(new Error("Document name: Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    if (value.length < 3) {
        return Promise.reject(new Error("Document name must be at least 3 characters"));
    }
    if (value.length > 255) {
        return Promise.reject(new Error("Document name cannot exceed 255 characters"));
    }
    return Promise.resolve();
  };


  const handleUpload = () => {
  const { documentname  } = form.getFieldsValue();
   form
    .validateFields(["documentname"])
    .then(() => {
      if (!uploadedFile?.id) {
        message.error("Please upload a document");
        return;
      }

    const documents = [...(chequeDetail.chequeDocuments || []), {documentname : documentname, document : uploadedFile.id }];
    const payLoad = {
      chequeDocuments : documents.map((doc)=>{ return { document : doc.document , documentname : doc.documentname }})
    }


    updateCheques(chequeDetail.aliasName, payLoad).then((response)=>{
        console.log("response",response);
        setUploadModal(false);
        form.resetFields();
        setUploadedFile(null);
        getChequeDetail();
    })
     .catch((err: any) => {
          console.log("err",err);
          setUploadModal(false)
          message.warning("Something went wrong");
        })
        .finally(() => setLoading(false));
    });
  }
  
  
  const removeProofOfDocument = () => {
    setLoading(true);
    const documents = chequeDetail.chequeDocuments.filter((doc: any) => doc.document !== uploadedFile.id);
    const payLoad = {
      chequeDocuments: documents.map((doc: any) => { return { document: doc.document, documentname: doc.documentname } })
    }

    updateCheques(chequeDetail.aliasName, payLoad).then(() => {
      message.success("Document removed successfully.");
      setRemoveModal(false);
      setUploadedFile(null);
      getChequeDetail();
    }).catch((err: any) => {
      console.log("err", err);
      setRemoveModal(false)
      setUploadedFile(null);
      message.warning("Something went wrong");
    }).finally(() => { setLoading(false) });
  }

  const handleModalCancel =()=>{
    form.resetFields();
    setUploadedFile(null);
    setUploadModal(false)
  } 

  const allowedUser = () => {
   return ( userType === 'AUTHORIZER' || userType === 'TRUSTEE' || 
          (userType === 'USER' && chequeDetail.transactionType == "RECEIVE" && chequeDetail.sellerAlias == userAlias) ||
          (userType === 'USER' && (chequeDetail?.transactionType == "REQUEST" || !chequeDetail?.transactionType) && chequeDetail.buyerAlias == userAlias))
  } 


  return (
    <>
    

     {
        
        <>
         <hr className="lightgrayHr" />
          <div className="stepDetails mt-3 mb-3">
            Proof of documents <span className="stepDetails_medium_sub titleText"> (Optional)</span>
          </div>
            <div className="afterApproveCard escrow-tran-card" style={{ width: "100%" }}>
            <div className="mangercheque-doc-block">
              <div className={"d-flex gap-4 flex-wrap moa-doc-list"}>
                {documents.map((fileData: any, i: number) => (
                  // signature mx-auto mt-5 || signature
                  <div key={i}>
                    <>
                      {fileData.documentDetail.url.includes(".pdf") ? (
                        <div
                          className="signature-image m admin-panel-pdf-preview pdf-viewIcon"
                          onClick={() => {
                            handlePDFView(fileData.documentDetail.url);
                          }}
                        >
                          <PDFPreviewIcon  url={fileData.documentDetail.url}
                        onPreviewClick={(url: string) => {
                          handlePDFView(url);
                        }}/>
                        </div>
                      ) : (
                        <div>
                        <Image
                          preview={true}
                          className="signature-image m"
                          src={fileData.documentDetail.url}
                        ></Image>
                        </div>
                      )}
                    </>
                    <div style={{display : "flex", justifyContent : "space-between"}}>
                      <span className="stepDetails_medium_sub"> {fileData.documentname}</span>
                      <div> { allowedUser() ? 
                        <Image src={Delete} alt="Delete" preview={false}  className="cursor" 
                          onClick={()=>{
                            setUploadedFile(fileData.documentDetail);
                            setRemoveModal(true);
                          }}
                          />
                        : null }
                        </div>
                      </div>
                  </div>
                ))}
       
                {((documents.length < maxCustomAttachments) && allowedUser() )
                   ? 
                    <div
                      onClick={() => {
                        setUploadModal(true);
                      }}
                      className="payee-document-image-block">
                      <div>
                        <Image src={PlusUpload} alt="passport" preview={false} />
                        <div className="mt-3 subText_xs overflowText_twoLines w-upload">
                          Upload document
                        </div>
                      </div>
                    </div> : <></>
                  }
              </div>
            </div>
      </div>
        </>
}
       
    

    

      {/* approve document */}
      <Modal
        open={uploadModal}
        footer={false}
        className="classification-modal "
        title={
          <span className="change-client-classification">
            Proof of documents
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
          onFinish={handleUpload}
        >
          <div className="subText mb-4">Document *</div>
          <Form.Item
            name="documentname"
            className="inputField w-100 error-input "
            // rules={[
            //   { required: true, message: "Please enter document name" }, 
            // ]}
             rules={[{ validator: (_, value) => validateBeneficiaryName(value) }]}
          >
            <Input type="text" placeholder="Enter document name" />
          </Form.Item>

          {uploadedFile?.url ? (
            <Card
              className=" kybcard"
              cover={
                uploadedFile?.url.includes(".pdf") ? (
                  <>
                    <div
                      className="admin-panel-pdf-preview"
                      onClick={() => {
                        handlePDFView(uploadedFile?.url);
                      }}
                    >
                      <PDFPreview
                        url={uploadedFile?.url || ""}
                        onPreviewClick={handlePDFView}
                      />
                    </div>
                  </>
                ) : (
                  <Image alt="example" src={uploadedFile?.url} height={175} />
                )
              }
            ></Card>
          ) : (
            <Upload {...propss} accept={acceptedFileExtension}>
              <div className="payee-document-image-block">
                <div>
                  <Image src={PlusUpload} alt="passport" preview={false} />
                  <div className="mt-3 subText_xs overflowText_twoLines w-upload">
                    Click here to upload
                  </div>
                </div>
              </div>
            </Upload>
          )}

          <div className="">
            <Button
              key="submit"
              type="primary"
              loading={loading}
              htmlType="submit"
              className="modal-button mt-5"
            >
              Submit
            </Button>
            <Button
              key="cancel"
              type="primary"
              loading={loading}
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

      {imageUrl && imageUrl.includes(".pdf") && (
        <DisputePdfViewModal
          isverifyVisible={isverifyVisible}
          setverifyVisible={setverifyVisible}
          imagUrl={imageUrl}
          setImagUrl={setImageUrl}
        />
      )}

      {imageUrl && !imageUrl.includes(".pdf") && (
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
      )}

    <Modal
      title={<p className="large-title">Delete proof of document</p>}
      width={500}
      centered
      open={removeModal}
      footer={false}
      closable={false}
      className="modal-box text-center"
      onCancel={() =>  {
        setRemoveModal(false)
        setUploadedFile(null)
      }}>
      <div>
      <Image src={rejects} alt="" width={"100px"} height={"100px"} preview={false}/>
        <div className="modal-content-margin">
        <NormalText 
            className="mb-5">
             {`Do you want to remove proof of document ?`} 
        </NormalText>
             </div>
              <div className="ant-modal-footer modalFooter center">
                <Button loading={loading} disabled={loading} onClick={() => {
                  removeProofOfDocument()
                  }} type="primary" className="modal-button">
                  Yes 
                </Button>
              <Button loading={loading} disabled={loading}
                  key="cancel"
                  className="modal-button-cancel"
                  onClick={() => {
                    setRemoveModal(false);
                    setUploadedFile(null)
                  }}
                >
                  No
                </Button>
              </div>
      </div>
    </Modal>
    </>
  );
}
export default ChequeDocument;
