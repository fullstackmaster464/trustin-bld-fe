import { Form, Image, message, Spin, Upload } from "antd";
import { getLocalStorage, acceptedFileExtension, beforeUploadSourceOfFundsFile } from "../../Common/Constants";
import UploadFile from "../../../assets/img/UploadFile.svg";
import { useEffect, useState } from "react";
import BlueEye from "../../../assets/img/blue_eye.svg";
import Delete from "../../../assets/img/delete.svg";
import Pdf from "../../../assets/img/pdfview.svg";
import PDFPreview from "../../Common/PdfPreviewIcon";
import PdfPreviewModal from "../../Models/PdfPreviewModal";
import { deleteSignFile } from "../../../services/user";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const SourceOfFunds = (props: any) => {
  const {
    setSourceOfFundIds,
    sourceOfFundIds,
    setSourceOfFundUrls,
    sourceOfFundUrls,
    setLoading,
    form,
    isDraft
  } = props;
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [imageLoader,setImageLoader] = useState(false);
  const [deleteImageIndex, setDeleteImageIndex] = useState(-1);
  const [imageUrls, setImageUrls] = useState<any>({});
  const [viewFiles, setViewFiles] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState<any>("");
  const local = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const maxSourceOfFunds = parseInt(process.env.MAX_SOURCE_OF_FUNDS as string) || 3;

  const handlePDFView =(url:any, index: string|number)=>{
    setImageUrls({...imageUrls,[index]:url});
    setViewFiles({...viewFiles,[index]:url});
  }
  const uploadButton4 = (
    <div>
        <Image src={UploadFile} alt="passport" preview={false} />
        <div className="mt-3 subText_xs uploadoverflow-text">
          Click here to Upload Bank Account Statements (File upto 10MB)
        </div>
    </div>
  );

  const uploadSign = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/contracts/uploadSourceOfFund",

    beforeUpload: (file: any) => {
    
        
      const checkBeforeUpload = beforeUploadSourceOfFundsFile(file)
      console.log("checkBeforeUpload",checkBeforeUpload);
      if(checkBeforeUpload === true){
        setLoading(false);
        setImageLoader(true);
        setErrorMessage("");
        return true;
      }
      else{
        setLoading(false);
        setImageLoader(false);
        setErrorMessage(checkBeforeUpload);
        return false;
      }
    },

    onChange: (info: any) => {
        const { status, response } = info.file;
        console.log("status",status);
        console.log("response",response);
        
        if (status !== "uploading") {
            setLoading(false);
           setImageLoader(false); 
        }
        
        if (status === "done") {
            setLoading(false);
            setImageLoader(false)
            setSourceOfFundUrls([...sourceOfFundUrls,response.url])
            setSourceOfFundIds([...sourceOfFundIds,response.id]);
            setErrorMessage("");
        } else if (status === "error") {
            setLoading(false);
            setImageLoader(false);
            message.error(`${info.file.name} file upload failed.`);
        }
    },

    onerror : (error : any) => {
        console.log("error==>",error);       
    }

    };
    const DeleteDoc = (id:any,index:string|number) =>{
        setLoading(false)
        setImageLoader(true)
        setDeleteImageIndex(index as number);
        deleteSignFile({fileID:id}).then(()=>{
            setLoading(false)
            setImageLoader(false)
            setDeleteImageIndex(-1);
            const tmpSourceOfFundsUrls = [...sourceOfFundUrls];
            tmpSourceOfFundsUrls.splice(index as number,1);
            setSourceOfFundUrls(tmpSourceOfFundsUrls);
            const tmpSourceOfFundsIds = [...sourceOfFundIds];
            tmpSourceOfFundsIds.splice(index as number,1);
            setSourceOfFundIds(tmpSourceOfFundsIds);
            if(tmpSourceOfFundsIds.length === 0) {
                form.setFieldsValue({
                    sourceOfFunds: null
                })
            }
        }).catch((err:any)=>{
            if(err)
                setLoading(false)
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
    <div className="mb-4">
        <div className="subText_small m-4 mx-0">Upload Source of Funds
        </div>
        <div className={Width > 400 ? "d-flex":"d-flex flex-column"}>
            {
                (!sourceOfFundUrls || sourceOfFundUrls.length < maxSourceOfFunds) &&
                <div className={Width > 400 ? "max-w-25S mt-2" :"mx-auto"}>
                <Form.Item
                    name="sourceOfFunds"
                    className={`custom-upload-error custom-upload fund-upload ${Width > 400 ? "pt-1" : "mt-4"}`}
                    rules={
                        [
                            {
                                validator(_: any, value: any) {
                                  if ((!!value) && errorMessage == "") {
                                    return Promise.resolve();
                                  }
                                //   if(errorMessage != ""){
                                //     message.error(errorMessage);
                                //     return Promise.reject(errorMessage);
                                //   }
                                  if (isDraft || sourceOfFundIds.length > 0) {
                                    return Promise.resolve();
                                  }
                                  if (sourceOfFundIds && sourceOfFundIds.length === 0 ) {
                                      return Promise.reject("Please add atleast one document!");
                                  }
                                },
                            },
                        ]
                      }
                >
                    <Upload
                    maxCount={3}
                    accept={acceptedFileExtension}
                    key={sourceOfFundUrls.length}
                    listType="picture-card"
                    className="avatar-uploader mt-5 pt-4"
                    showUploadList={false}
                    {...uploadSign}
                    disabled={imageLoader == true}
                    >
                    {uploadButton4}
                    </Upload>
                </Form.Item>
                </div>
            }
            {sourceOfFundUrls.map((eachSource:any, index: number) => {
                let customContent:any = '';
                if (imageLoader && deleteImageIndex === index) {
                    customContent = <div className={Width > 400 ? "signature text-center mt-5" :"signature mx-auto mt-5"}>
                        <Spin className="mainloader" />
                    </div>
                } else if (eachSource) {
                    customContent = <div className={Width > 400 ? "signature" :"signature mx-auto mt-3"}>
                    {eachSource?.includes(".pdf") ? (
                        <div className="signature-image pdf-viewIcon m admin-panel-pdf-preview" onClick={() => { handlePDFView(eachSource,index)}}>
                        <PDFPreview
                            url={eachSource}
                            onPreviewClick={() => { handlePDFView(eachSource,index)}}
                        />
                        </div>
                    ) : (
                        <Image
                        preview={true}
                        className="signature-image max-w"
                        src={eachSource}
                        ></Image>
                    )}
                    {eachSource?.includes(".pdf") ? (
                        <span className="d-flex endtoend signature-view my-1">
                        <div className="blue_text cursor" onClick={() => { handlePDFView(eachSource,index) }}>
                            <Image
                            preview={false}
                            src={Pdf} alt="view"
                            /> <span className="px-1" >View</span>
                        </div>
                        <Image src={Delete} alt="Delete" preview={false} onClick={()=>{DeleteDoc(sourceOfFundIds[index],index)}} className="cursor" />
                        </span>
                    ) :
                    (<div className="d-flex endtoend signature-view my-1">
                        <div className="blue_text cursor d-flex" onClick={() => { handlePDFView(eachSource,index) }}>
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
                            src: eachSource,
                            onVisibleChange: (value) => {
                            // setViewFile(value);
                            setViewFiles({...viewFiles,[index]:value})
                            },
                        }}
                        />
                        <Image src={Delete} alt="Delete" preview={false} onClick={()=>{DeleteDoc(sourceOfFundIds[index],index)}} className="cursor" />
                    </div>)
                    }
                    </div>
                } else {
                    customContent = ''
                }
                return <>
                { eachSource?.includes(".pdf") && 
                    <PdfPreviewModal
                        isverifyVisible={viewFiles[index]}
                        setverifyVisible={() => setViewFiles({...viewFiles, [index]: false})}
                        imagUrl={imageUrls[index] ?? ''}
                        setImagUrl={(url:string) => setImageUrls({...imageUrls,[index]:url})}
                    />
                }
                { customContent }
                </>
            })}
            { imageLoader && deleteImageIndex === -1 && 
                <div className={Width > 400 ? "signature text-center mt-5" :"signature mx-auto mt-5"}>
                    <Spin className="mainloader" />
                </div> 
            }
        </div>
        {errorMessage && <div className="errMsg">{errorMessage}</div>}
    </div>
  );
}

export default SourceOfFunds;
