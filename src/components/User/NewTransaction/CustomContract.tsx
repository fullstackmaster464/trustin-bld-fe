import { Col,  Image, Input, Radio, Row, Form, Upload, message, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import AddContract from "../../../assets/img/addContract.svg";
import { acceptedFileExtension, beforeUploadFile, docRegex, getLocalStorage } from "../../Common/Constants";
import { deleteSignFile } from "../../../services/user";
import { LoadingOutlined } from "@ant-design/icons";
import infoIcon from "../../../assets/img/informIcon.svg";
import BlueEye from "../../../assets/img/blue_eye.svg";
import Delete from "../../../assets/img/delete.svg";
import UploadFile from "../../../assets/img/UploadFile.svg";
import Pdf from "../../../assets/img/pdfview.svg";
import PdfPreviewModal from "../../Models/PdfPreviewModal";
import { Document, Page } from "react-pdf";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const CustomContract = (props: any) => {
  const { 
    setCustomObj, 
    customeEditData,
    form,
    setCustomAttach,
    customAttachmentIds,
    setCustomAttachmentIds,
    setCustomAttachUrl,
    customAttachmentUrls, 
    setCustomAttachmentUrls,
    isDraft,
    // isDraftedContract
  } = props;
  const [customField, setCustomField] = useState<any>([]);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [isRequiredCustomContract, setIsRequiredCustomContract] = useState(!!customeEditData || !!customAttachmentUrls?.length);
  const [custom,setCustom] =useState("")
  const local = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const maxCustomAttachments = parseInt(process.env.MAX_CUSTOM_ATTACHMENTS as string) || 5;
  const [imageLoader,setImageLoader] = useState(false);
  const [deleteImageIndex, setDeleteImageIndex] = useState(-1);
  // const [uploadedFile, setUploadedFileName] = useState("");
  // const [imagUrl, setImagUrl] = useState<any>(customAttachUrl);
  const [imageUrls, setImageUrls] = useState<any>({});
  const [viewFiles, setViewFiles] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<any>("");
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 30, color: "#013399" }} spin />
  );

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  const handleRequiredCustomContract = (e: any) => {
    setIsRequiredCustomContract(e.target.value);
    if (e.target.value == false) {
      setCustomField([]);
      setCustomObj([]);
      setErrorMessage("");
    }
  };
const addContract = () =>{
  const _formValues = form.getFieldsValue();
    if (
      typeof _formValues.custom === "string" &&
      _formValues.custom.trim() !== ""
    ) {
      let _custom = customField;

      for (const key in _formValues) {
        if (key === "custom") {
          if (_custom.includes(_formValues[key]) == false) {
            setCustomField([
              ...customField,
              _formValues[key].toString().replace(/\s+/g, " ").trim(),
            ]);
            setCustomObj([
              ...customField,
              _formValues[key].toString().replace(/\s+/g, " ").trim(),
            ]);
            _custom = [
              ...customField,
              _formValues[key].toString().replace(/\s+/g, " ").trim(),
            ];
          }
        }
      }
      form.setFieldsValue({ custom: null });
      setCustom(""); 
      setErrorMessage("");
    }
}
  useEffect(() => {    
    let customPresent = false;
    if (customeEditData && Object.values(customeEditData).length > 0) {
      setIsRequiredCustomContract(true);
      setCustomField(Object.values(customeEditData));
      setCustomObj(Object.values(customeEditData));
      customPresent = true;
    }
    if (customAttachmentIds?.length && customAttachmentUrls?.length) {
      setIsRequiredCustomContract(true);
      customPresent = true;
    } 
    if (!customPresent){
      setIsRequiredCustomContract(false);
    }
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, [customeEditData,customAttachmentIds]);
  const removeDocument = (indexToRemove: number) => {
    const _custom = customField;
    _custom.splice(indexToRemove, 1);
    setCustomField([..._custom]);
    setCustomObj([..._custom])
  };
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
        <Image src={UploadFile} alt="passport" preview={false} />
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
        setErrorMessage("");
        setImageLoader(true);
        return true;
      } else {
        setImageLoader(false);
        setErrorMessage(validationResult);
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
        setCustomAttachmentUrls([...customAttachmentUrls,response.url])
        setCustomAttach(response.id);
        setCustomAttachmentIds([...customAttachmentIds,response.id]);
        setErrorMessage("");
      }
    },
  };
  const DeleteDoc = (id:any,index:string|number) =>{
    setImageLoader(true)
    setDeleteImageIndex(index as number);
    deleteSignFile({fileID:id}).then(()=>{
      setImageLoader(false)
      setDeleteImageIndex(-1);
      // setUploadedFileName("");
      setCustomAttachUrl("");
      setCustomAttach("");
      const tmpCustomAttachmentUrls = [...customAttachmentUrls];
      tmpCustomAttachmentUrls.splice(index as number,1);
      setCustomAttachmentUrls(tmpCustomAttachmentUrls);
      const tmpCutomAttachmentIds = [...customAttachmentIds];
      tmpCutomAttachmentIds.splice(index as number,1);
      setCustomAttachmentIds(tmpCutomAttachmentIds);
    }).catch((err:any)=>{
      if(err)
      setImageLoader(false)
    })
   }
  const handlePDFView =(url:any, index: string|number)=>{
    // setImagUrl(url);
    setImageUrls({...imageUrls,[index]:url})
    // setViewFile(true)
    setViewFiles({...viewFiles,[index]:url})
  }
  return (
    <>
      <div className="stepDetails fw-400 mb-2 mt-3 textOverflow">
        Do you want custom contract?
        <Tooltip
          title={
            <span className="response-tooltip">
              Select &apos;Yes&apos; if you require a customized contract specific to this transaction.
            </span>
          }
          overlayClassName='custom-tooltip info-icon'
          placement={Width > 475 ? "right" : "top"}
        >
          <img src={infoIcon} className="ms-1" />
        </Tooltip>
      </div>
      <Radio.Group
        value={isRequiredCustomContract}
        className="my-3"
        onChange={(e: object) => {
          handleRequiredCustomContract(e);
        }}
      >
        <Radio value={true}>Yes</Radio>
        <Radio value={false}>No</Radio>
      </Radio.Group>
      {errorMessage && <div className="errMsg">{errorMessage}</div>}
      {isRequiredCustomContract === true ? (
        // customField.map((item, index) => {
        // return (
        // <Row gutter={36} className="my-2">
        //   <Col span={16}>
        //     <Input
        //       placeholder="Enter custom here"
        //       name={item}
        //       popupClassName="lowerz"
        //       value={item}
        //       onChange={(e) => handleCustomField(e.target.value, index)}
        //       className="inputField w-100 customContract error-input"
        //     />

        //     {inputErrors[index] && (
        //       <div className="errMsg">{inputErrors[index]}</div>
        //     )}
        //   </Col>
        //   <Col span={8} className="d-flex px-4">
        //     {customField.length > 1 ? (
        //       <Image
        //         src={Delete}
        //         className="cursor"
        //         onClick={() => handleRemove(index)}
        //         height={50}
        //         width={50}
        //         preview={false}
        //       />
        //     ) : null}
        //     {customField.length - 1 == index &&
        //     customField.length < 10 ? (
        //       <Image
        //         src={AddContract}
        //         className="cursor px-3"
        //         alt="add"
        //         preview={false}
        //         onClick={() => handleFieldCount()}
        //       />
        //     ) : null}
        //   </Col>
        // </Row>
        <div>
            <div>
              <div className="subText_small m-4 mx-0">Attach custom contract(Optional) </div>
              <div className={Width > 400 ? "d-flex flex-wrap gap-3":"d-flex flex-column"}>
                {customAttachmentUrls.map((customAttachmentUrl:any, index: string|number) => {
                  let customContent:any = '';
                  if (imageLoader && deleteImageIndex === index) {
                    customContent = <div className={Width > 400 ? "signature text-center mt-5" :"signature mx-auto mt-5"}>
                      <Spin className="mainloader" />
                    </div>
                  } else if (customAttachmentUrl) {
                    customContent = <div className={Width > 400 ? "signature m-0" :"signature mx-auto mt-3"}>
                        {customAttachmentUrl.includes(".pdf") ? (
                          <div className="signature-image m admin-panel-pdf-preview" onClick={() => { handlePDFView(customAttachmentUrl,index)}}>
                            <Document
                              file={customAttachmentUrl}
                              externalLinkRel="_blank"
                            >
                              <Page pageNumber={1} width={50}  />
                            </Document>
                          </div>
                        ) : (
                          <Image
                            preview={true}
                            className="signature-image m "
                            src={customAttachmentUrl}
                          ></Image>
                        )}
                        {customAttachmentUrl.includes(".pdf") ? (
                          <span className="d-flex endtoend signature-view my-1">
                            <div className="blue_text cursor" onClick={() => { handlePDFView(customAttachmentUrl,index) }}>
                              <Image
                                preview={false}
                                src={Pdf} alt="view"
                              /> <span className="px-1" >View</span>
                            </div>
                            <Image src={Delete} alt="Delete" preview={false} onClick={()=>{DeleteDoc(customAttachmentIds[index],index)}} className="cursor" />
                          </span>
                        ) :
                        (<div className="d-flex endtoend signature-view my-1">
                          <div className="blue_text cursor d-flex" onClick={() => { handlePDFView(customAttachmentUrl,index) }}>
                            <Image
                              preview={false}
                              src={BlueEye} alt="view"
                            /> 
                            <span className="p-1 signature-overflowtext">View</span>
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
                })}
                
                {
                  (!customAttachmentUrls || customAttachmentUrls.length < maxCustomAttachments) &&
                  <div className={Width > 400 ? "max-w-25 mt-2" :"mx-auto"}>
                    <Form.Item
                      name={name}
                      className={Width > 400 ? "custom-upload pt-1" : "custom-upload mt-4"}
                    >
                      <Upload
                        maxCount={1}
                        accept={acceptedFileExtension}
                        listType="picture-card"
                        className="avatar-uploader mt-5 pt-4"
                        showUploadList={false}
                        {...uploadSign}
                        disabled={imageLoader == true}
                      >
                      {customUploads}
                      </Upload>
                    </Form.Item>
                  </div>
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
         
           <div className="subText_small mt-5 pt-3">Enter customised details to be part of the contract (Maximum 300 words only)</div>
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
                        if (customField?.length === 0 && !isDraft && (!customAttachmentUrls || customAttachmentUrls?.length == 0)) {
                          return Promise.reject(setErrorMessage("Please upload document or add customised details"))
                        } else if(customField?.length > 10){
                          return Promise.reject("Only 10 custom contracts are accepted")
                        } else if (_value?.length >= 300) {
                          return Promise.reject(new Error("Custom input allows 300 characters only"));
                        } else {
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
                    maxLength={300}
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
        </div>
      ) : 
      null}
    </>
  );
};

export default CustomContract;
