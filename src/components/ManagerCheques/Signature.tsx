import { Form, Image, Spin, Upload,message } from "antd";
import { acceptedSignatureFileExtension, getLocalStorage, beforeUploadSignatureFile } from "../Common/Constants";
import Tick from "../../assets/img/circle_orange.svg";
import UploadFile from "../../assets/img/UploadFile.svg";
import { useEffect, useState } from "react";
import BlueEye from "../../assets/img/blue_eye.svg";
import Delete from "../../assets/img/delete.svg";
import { deleteSignFile } from "../../services/user";
// import { LoadingOutlined } from "@ant-design/icons";
import Pdf from "../../assets/img/pdfview.svg";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import { Document, Page } from "react-pdf";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function Signature(props: any) {
  const {
    signature,
    setLoading,
    setSignature,
    name,
    // signatureReq=true,
    signatureId,
    setSignatureId,
    // setsignatureReq,
    envelopeId,
    isDraft,
    chequeDetails
  } = props;
 
  const [uploadedFile, setUploadedFileName] = useState("");
  const [viewFile, setViewFile] = useState(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [imageLoader,setImageLoader] = useState(false);
  const [uploadError,setUploadError] = useState<any>("")
  const [imagUrl, setImagUrl] = useState<any>(signature);
  const local = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);

  // const antIcon = (
  //   <LoadingOutlined style={{ fontSize: 30, color: "#013399" }} spin />
  // );
  const handlePDFView =(url:any)=>{
    setImagUrl(url);
    setverifyVisible(true)
  }

  useEffect(()=> {
    
    if(chequeDetails && chequeDetails?.fromSignDetails && chequeDetails?.fromSignDetails?.inputfileid){
      setUploadedFileName(chequeDetails?.fromSignDetails?.inputfileid);
    }
  },[chequeDetails])


  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const uploadButton4 = (
    <div>
      {signature && uploadedFile ? (
       
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}
      <div
        style={{
          marginTop: signature && uploadedFile ? -12 : 27,
        }}
      >
        <Image src={UploadFile} alt="passport" preview={false} />
        <div className="mt-3 subText_xs uploadoverflow-text">
          {uploadedFile ? uploadedFile : "Click here to upload (File upto 5MB)"}
        </div>
      </div>
    </div>
  );

  const uploadSign = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/contracts/uploadSignature",

    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadSignatureFile(file)
      if(checkBeforeUpload === true){
      setLoading(true);
      setImageLoader(true);
      setUploadError("");
      }
      else{
        setLoading(false);
        setImageLoader(false);
        setUploadError(checkBeforeUpload);
        return false;
      }
    },

    onChange: (info: any) => {
      const response = info?.file?.response;
      if (response) {
        setLoading(false)
        setImageLoader(false)
        setUploadedFileName(response.inputfileid);
        setSignature(response.url);
        setSignatureId(response?.id)
      }
    },
  };
 const DeleteDoc = (id:any) =>{
  setImageLoader(true)
  deleteSignFile({fileID:id}).then(()=>{
    setImageLoader(false)
    setUploadedFileName("");
        setSignature("");
        setSignatureId("")
        // setsignatureReq(true)
  }).catch((err:any)=>{
    if(err)
  setImageLoader(false)
  })
 }
 const setWidthVal = () =>{
  setWidth(document.body.clientWidth);
}
 useEffect(() => {
  window.addEventListener('resize', ()=>{
    setWidthVal()
  });
  return () => window.removeEventListener('resize', setWidthVal);
 }, [])
  return (
    <div className="mb-5">
      <div className="subText_small mt-4 mb-4">Upload signature</div>
      <div className={Width > 400 ? "d-flex ":"d-flex flex-column"}>
          <div className={Width > 400 ? "max-w-25" :"mx-auto"}>
              <Form.Item
                name={name}
                rules={
                  // signatureReq ?
                   [
                        {
                          validator(_: any, value: any) {
                            if ((!!value || signature || envelopeId) && uploadError == "") {
                              return Promise.resolve();
                            }
                            if(uploadError != ""){
                              message.error(uploadError);
                              return Promise.reject(uploadError);
                              
                            }
                            if (isDraft && !signature) {
                              return Promise.resolve();
                            }
                            if (!signature) {
                                return Promise.reject("Signature is required!");
                            }
                            // return Promise.reject("Signature is required!");
                          },
                        },
                      ]
                    // : []
                }
                className="uploadInput mt-5 custom-signature-error"
                style={{ marginTop: "30px" }} 
              >
                <Upload
                  maxCount={1}
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  {...uploadSign}
                  accept={acceptedSignatureFileExtension}
                  disabled={imageLoader == true || envelopeId}
                >
                  {uploadButton4}
                </Upload>
              </Form.Item>
          </div>
          {imageLoader ? <div className={Width > 400 ? "signature text-center mt-5" :"signature mx-auto mt-5"}>
          <Spin className="mainloader" />
         </div> : signature && !imageLoader ? (
        <div className={Width > 400 ? "signature" :"signature mx-auto mt-5"}>
            <>
          {signature && typeof signature === 'string' && signature.includes(".pdf") ? (
            <div className="signature-image m admin-panel-pdf-preview" onClick={() => { handlePDFView(signature)}}>
            <Document
            file={signature}
             externalLinkRel="_blank"
          >
            <Page pageNumber={1} width={50}  />
          </Document>
          </div>
          ) : (
            <Image
            preview={true}
            className="signature-image m"
            src={signature}
          ></Image>
          )}
                {signature && typeof signature === 'string' && signature.includes(".pdf") ? (
                <span className="d-flex endtoend signature-view my-1">
                  <div className="blue_text cursor" onClick={() => { handlePDFView(signature) }}>
                    <Image
                      preview={false}
                      src={Pdf} alt="view"
                    /> <span className="px-1" >View</span>
                  </div>
                  <Image src={Delete} alt="Delete" preview={false} onClick={()=>{DeleteDoc(signatureId)}} className="cursor" />
                </span>
                ) :
            <div className="d-flex endtoend signature-view my-1">
              <div className="blue_text cursor d-flex " onClick={() => { setViewFile(true) }}>
                <Image
                  preview={false}
                  src={BlueEye} alt="view"
                /> 
                <span className="p-1 signature-overflowtext">{ uploadedFile}</span>
              </div>
              <Image
                className="img_preview"
                preview={{
                  visible: viewFile,
                  src: signature,
                  onVisibleChange: (value) => {
                  setViewFile(value);
                  },
                  }}
              />
              <Image src={Delete} alt="Delete" preview={false}  className="cursor" 
              onClick={()=>{DeleteDoc(signatureId)}}
              />
              </div>
          }
            </>
         
        </div>
         ) :  ""}
      </div>
      <PdfPreviewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
    </div>
  );
}

export default Signature;
