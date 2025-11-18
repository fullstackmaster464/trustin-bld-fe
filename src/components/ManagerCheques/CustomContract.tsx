import { Image,  Form, Upload, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { acceptedFileExtension, beforeUploadFile, getLocalStorage } from "../Common/Constants";
import { deleteSignFile } from "../../services/user";
import BlueEye from "../../assets/img/blue_eye.svg";
import Delete from "../../assets/img/delete.svg";
import PlusUpload from "../../assets/img/PlusUpload.svg";
import Pdf from "../../assets/img/pdfview.svg";
// import Tick from "../../assets/img/circle_orange.svg";
// import Doc_large from "../../assets/img/Doc_large.svg"; 
import { LoadingOutlined } from "@ant-design/icons";
import PdfPreviewModal from "../Models/PdfPreviewModal";
const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
// import PdfPreviewModal from "../Models/PdfPreviewModal";
import PDFPreview from "../Common/PdfPreviewIcon";

const CustomContract = (props: any) => {
  const { 
    setCustomObj, 
    customeEditData,
    setCustomAttach,
    customAttachmentIds,
    setCustomAttachmentIds,
    setCustomAttachUrl,
    setCustomAttachmentUrls,
    chequeDetails
  } = props;
  // const [customField, setCustomField] = useState<any>([]);
  const [Width, setWidth] = useState(document?.body?.clientWidth); 
  // const [custom,setCustom] =useState("")
  const local = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const maxCustomAttachments = parseInt(process.env.MAX_CUSTOM_ATTACHMENTS as string) || 5;
  const [customContractDocumentList, setCustomContractDocumentList] = useState<Array<{ url: string, isLoading: boolean }>>([]);
  const [imageLoader,setImageLoader] = useState(false);
  const [deleteImageIndex, setDeleteImageIndex] = useState(-1);
  // const [uploadedFile, setUploadedFileName] = useState("");
  // const [imagUrl, setImagUrl] = useState<any>(customAttachUrl);
  const [viewFiles, setViewFiles] = useState<any>({}); 
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<any>("");
  
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 30, color: "#013399" }} spin />
  );

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  
// const addContract = () =>{
//   const _formValues = form.getFieldsValue();
//     if (
//       typeof _formValues.custom === "string" &&
//       _formValues.custom.trim() !== ""
//     ) {
//       let _custom = customField;

//       for (const key in _formValues) {
//         if (key === "custom") {
//           if (_custom.includes(_formValues[key]) == false) {
//             setCustomField([
//               ...customField,
//               _formValues[key].toString().replace(/\s+/g, " ").trim(),
//             ]);
//             setCustomObj([
//               ...customField,
//               _formValues[key].toString().replace(/\s+/g, " ").trim(),
//             ]);
//             _custom = [
//               ...customField,
//               _formValues[key].toString().replace(/\s+/g, " ").trim(),
//             ];
//           }
//         }
//       }
//       form.setFieldsValue({ custom: null });
//       // setCustom("");  
//     }
// }
  useEffect(() => {     
    if (customeEditData && Object.values(customeEditData).length > 0) { 
      setCustomObj(Object.values(customeEditData)); 
    }
   
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, [customeEditData,customAttachmentIds]);

  useEffect(() => {     
    if(chequeDetails && chequeDetails.customAttachments){ 
      const ids = chequeDetails.customAttachments.map((a : any)=>a.id);
      const urls = chequeDetails.customAttachments.map((a : any)=>a.url);
      setCustomAttachmentUrls(urls);
      
      setCustomAttachmentIds(ids);
      setCustomContractDocumentList(chequeDetails.customAttachments)
    }
  }, [chequeDetails]);


  // const removeDocument = (indexToRemove: number) => {
  //   const _custom = customField;
  //   _custom.splice(indexToRemove, 1);
  //   setCustomField([..._custom]);
  //   setCustomObj([..._custom])
  // };
  //upload
  const customUploads = (
    <div >
      <div
        className="upload-text"
      >        
        {imageLoader && deleteImageIndex === -1? //not to show loaded on button when image is deleted 
        <div >
        <Spin indicator={antIcon} />
         </div> 
        :<>
          <div >
             <Image src={PlusUpload} alt="passport" preview={false} />
             <div>
              Document
            </div>
          </div>
        </>}        
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
      const validationResult = beforeUploadFile(file, "");
      if (validationResult === true) { 
        setImageLoader(true);
        return true;
      } else {
        setImageLoader(false); 
        message.error(validationResult);
        return Upload.LIST_IGNORE || false;
      }
      
    },

    onChange: (info: any) => {
      const response = info?.file?.response;
      setImageLoader(true)
      if (response) {
        setImageLoader(false)
        // setUploadedFileName(response.inputfileid);
        setCustomAttachUrl(response.url);
        setCustomAttachmentUrls((prev: Array<string>) => [...prev, response.url]);
        setCustomContractDocumentList((prev) => [...prev, { url: response.url, isLoading: false }]);
        setCustomAttach(response.id);
        setCustomAttachmentIds((prev: any[]) => [...prev, response.id]);
      }
    },
  };
  const DeleteDoc = (id:any,index: number) =>{
    setImageLoader(true)
    setDeleteImageIndex(index);
    setCustomContractDocumentList((prev) => {
      prev[index] = { url: prev[index].url, isLoading: true };
      return [...prev];
    });
    deleteSignFile({fileID:id}).then(()=>{
      setImageLoader(false)
      setDeleteImageIndex(-1);
      // setUploadedFileName("");
      setCustomAttachUrl("");
      setCustomAttach("");

      const customAttachmentIdsVar = [...customAttachmentIds];
      const customContractDocumentListVar = [...customContractDocumentList];

      customAttachmentIdsVar.splice(index,1);
      customContractDocumentListVar.splice(index,1); 
     
      const urls = customContractDocumentListVar.map(a=>a.url);
      setCustomAttachmentUrls(urls);
      setCustomContractDocumentList(customContractDocumentListVar);
      const tmpCutomAttachmentIds = [...customAttachmentIds];
      tmpCutomAttachmentIds.splice(index,1);
      setCustomAttachmentIds(tmpCutomAttachmentIds);
    }).catch((err:any)=>{
      if(err)
      setImageLoader(false)
    })
   }
 
  const handleDocumentPreview =(url:any, index: number, isPDF = false)=>{
    if (isPDF) {
      setverifyVisible(true)
      setPdfUrl(url)
    } else {
      setViewFiles({...viewFiles,[index]:url})
    }
  }
  return (
    <> 
  
        <div>
            <div className={Width > 400 ? "mt-4 mb-4 mx-3":"mt-4 mb-4"}>
              {/* <div className="subText_small m-4 mx-0">Attach contract documents </div> */}
              <div className={Width > 400 ? "d-flex flex-wrap gap-3":"d-flex flex-column"}>
                {/* {customAttachmentUrls.map((customAttachmentUrl:any, index: string|number) => {
                  let customContent:any = '';
                  if (imageLoader && deleteImageIndex === index) {
                    customContent = <div className={Width > 400 ? "signature text-center mt-5" :"signature mx-auto mt-5"} key={index}>
                      <Spin className="mainloader" />
                    </div>
                  } else if (customAttachmentUrl) {
                    customContent = <div className={Width > 400 ? "signature m-0" :"signature mx-auto mt-3"} key={index}>
                        {customAttachmentUrl.includes(".pdf") ? (
                          <div className="signature-image m admin-panel-pdf-preview" onClick={() => { handlePDFView(customAttachmentUrl,index)}}>
                            <PDFPreview
                              url={customAttachmentUrl || ''} 
                              onPreviewClick={() => handlePDFView(customAttachmentUrl,index)}                            
                            />
                          </div>
                        ) : (
                          <Image
                            preview={true}
                            className="signature-image m "
                            src={customAttachmentUrl}
                          ></Image>
                        )}
                        {customAttachmentUrl.includes(".pdf") ? (
                          <div className="d-flex endtoend p-1">
                            <div className="blue_text cursor" onClick={() => { handlePDFView(customAttachmentUrl,index) }}>
                              <Image
                                preview={false}
                                src={Pdf} alt="view"
                              /> <span className="px-1" >View</span>
                            </div>
                            <Image src={Delete} alt="Delete" preview={false} onClick={()=>{DeleteDoc(customAttachmentIds[index],index)}} className="cursor" />
                          </div>
                        ) :
                        (<div className="d-flex endtoend p-1">
                          <div className="blue_text cursor" onClick={() => { handlePDFView(customAttachmentUrl,index) }}>
                            <Image
                              preview={false}
                              src={BlueEye} alt="view"
                            /> 
                            <span className="px-1">View</span>
                          </div>
                          <Image
                            className="img_preview"
                            preview={{
                              visible: !!viewFiles[index],
                              src: customAttachmentUrl,
                              onVisibleChange: (value) => {
                                // setViewFile(value);
                                setViewFiles({...viewFiles,[index]:value})
                              },
                            }}
                          />
                          <Image src={Delete} alt="Delete" preview={false} onClick={()=>{DeleteDoc(customAttachmentIds[index],index)}} className="cursor" />
                        </div>)
                        }
                      </div>
                  } else {
                    customContent = ''
                  }
                  return <>
                    {customContent}
                    {customAttachmentUrl.includes(".pdf") && 
                      <PdfPreviewModal
                      isverifyVisible={viewFiles[index]}
                      setverifyVisible={() => setViewFiles({...viewFiles, [index]: false})}
                      imagUrl={imageUrls[index] ?? ''}
                      setImagUrl={(url:string) => setImageUrls({...imageUrls,[index]:url})}
                    />}
                  </>
                })} */}
                {customContractDocumentList.map((doc, index: number) => {
                  const url = doc.url;
                  const isPDF = url.includes('.pdf');
                  const isLoading = doc.isLoading;

                  return (
                    <div key={index}>
                      {url && (
                        <ul className="moa-doc-list-ul mb-0">
                          <div >
                            {isLoading ? (
                              <Spin indicator={Loader} className="ml-20" />
                            ) : (
                              <div>
                                  {isPDF !== undefined && isPDF ? (
                                    <div
                                      className="signature-image m admin-panel-pdf-preview pdf-viewIcon"
                                      onClick={() => url && index !== undefined && handleDocumentPreview(url, index, isPDF)}
                                    >
                                      <PDFPreview url={url} onPreviewClick={() => url && index !== undefined && handleDocumentPreview(url, index, isPDF)} />
                                    </div>
                                  ) : (
                                    <Image preview={true} className="signature-image m" src={url} />
                                  )}
                                </div>
                              )}
                            </div>
                          
                          <span className="d-flex endtoend p-1">
                            <div className="blue_text cursor" onClick={() => { handleDocumentPreview(url, index, isPDF) }}>
                              <Image preview={false} src={isPDF ? Pdf : BlueEye} alt="view" />
                              <span className="px-1">View</span>
                            </div>
                            <Image
                              src={Delete}
                              alt="Delete"
                              preview={false}
                              onClick={() => DeleteDoc(customAttachmentIds[index],index)}
                              className="cursor moa-doc-delete-icon"
                            />
                          </span>
                        </ul>
                      )}
                      <Image
                        className="img_preview"
                        preview={{
                          visible: !!viewFiles[index],
                          src: url,
                          onVisibleChange: (value) => {
                            setViewFiles({...viewFiles,[index]:value})
                          },
                        }}
                      />
                    </div>
                  );
                })}
                
                {
                  (customContractDocumentList.length < maxCustomAttachments) &&
                      <Form.Item
                        name="customContract"
                        className={"custom-upload cheque-custom-contract-image  "}
                      >
                        <Upload
                          maxCount={1}
                          accept={acceptedFileExtension}
                          listType="picture-card"
                          className="d-flex gap-3 flex-wrap moa-doc-list"
                          showUploadList={false}
                          {...uploadSign}
                          disabled={imageLoader == true}
                        >
                        {customUploads}
                        </Upload>
                      </Form.Item>
                }
                {/* {customAttachUrl.includes(".pdf") && 
                  <PdfPreviewModal
                  isverifyVisible={viewFile}
                  setverifyVisible={setViewFile}
                  imagUrl={imagUrl}
                  setImagUrl={setImagUrl}
                />} */}
            </div>
          </div>
          
           {/* <div className="subText_small mt-5 pt-3">Enter customised details to be part of the contract</div>
            <Row gutter={16} className="py-3">
              <Col span={Width > 992 ?16 : 20} className="d-flex align-items-center">
                <Form.Item
                  name={`custom`}
                  rules={[ 
                    {
                      pattern: docRegex,
                      message: "Invalid custom",
                    },
                    {
                      validator(_, _value) {
                        if (customField?.length === 0 && (!customAttachmentUrls || customAttachmentUrls?.length == 0)) {
                          return Promise.reject(setErrorMessage("Please upload document or add customised details"))
                        } else if(customField?.length > 10){
                          return Promise.reject("Only 10 custom contracts are accepted")
                        }
                        else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                  className="inputField w-100 customContract error-input"                  
                >
                  <Input
                    placeholder="Enter custom here"
                    onInput={(e:any)=>{setCustom(e?.target?.value);
                    }}
                    value={custom}
                  />
                </Form.Item>
              </Col>
              <Col span={Width > 992 ? 8 : 4} className="d-flex  align-items-center">
                <Image
                  src={AddContract}
                  className={Width > 550 ? "cursor px-3":"cursor px-0"}
                  alt="add"
                  preview={false}
                  onClick={() => {
                    addContract();
                  }}
                />
              </Col>
            </Row>

            <Row className="mt-4">
              {customField.length > 0 && customField.map((tag:any, index:any) => (
                <div key={index} className="reqDoc d-flex mx-2 mb-2">
                  <div>{tag}</div>
                  <div
                    className="px-3 cursor"
                    onClick={() => {
                      removeDocument(index);
                    }}
                  >
                    X
                  </div>
                </div>
              ))}
            </Row>
            {errorMessage && <div className="errMsg">{errorMessage}</div>} */}
        </div> 
        <PdfPreviewModal
          isverifyVisible={isverifyVisible}
          setverifyVisible={setverifyVisible}
          imagUrl={pdfUrl}
          setImagUrl={setPdfUrl}
        />
    </>
  );
};

export default CustomContract;
