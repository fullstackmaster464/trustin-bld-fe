
import { Card, Col, Row,Image, Button, Modal, Form, message, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import PdfPreviewModal from "../../Models/PdfPreviewModal";
import PDFPreview from "../../Common/PdfPreviewIcon";
import approved from "../../../assets/img/Successpopupicon.svg";
import Success from "../../../assets/img/tick_icon.svg";
import Reject from "../../../assets/img/reject.svg";
import UserHalf from "../../../assets/img/userHalf.svg";
import Calendar from "../../../assets/img/Calendar.svg";
import ClockLight from "../../../assets/img/clock_light.svg";
import CommentImg from "../../../assets/img/Comment.svg";
// import { CloudDownloadOutlined } from "@ant-design/icons";
import BlueEye from "../../../assets/img/blue_eye.svg";
// import Pdf from "../../../assets/img/pdfview.svg";
import TextArea from "antd/es/input/TextArea";
import download from "../../../assets/img/Download.svg";
import moment from "moment";
import { approveSourceOfFundDocument, getContractSoFDetails } from "../../../services/transaction";
import { getLocalStorage } from "../../Common/Constants";
import { Document, Page } from "react-pdf";
import { AuthTitle } from "../../ui-elements/TextRepo";
import Meta from "antd/es/card/Meta";
import ImagePreviewModal from "../../Models/ImagePreviewModal";

const SourceOfFundDetails = (props: any) => {
  const { contractAlias, contractType, getPaymentDetails } = props;
  const [ sourceOfFundsList, setSourceOfFundsList ] = useState<any>();
  const [ imagUrl, setImagUrl ] = useState<any>();
  const [ viewFile, setViewFile ] = useState(false);
  const [ viewImgFile, setViewImgFile ] = useState(false);
  const [ Width, setWidth ] = useState(document?.body?.clientWidth);
  const [ openApproveModal, setOpenApproveModal ] = useState<boolean>(false);
  const [ fileToApprove, setFileToApprove ] = useState<any>();
  const [ openMessageModal, setOpenMessageModal ] = useState<boolean>(false);
  const [ modalMessage, setModalMessage ] = useState<string>("");
  const [ modalMessageIcon, setModalMessageIcon ] = useState<string>("");
  const [ action, setAction ] = useState<string>("");
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const [form] = Form.useForm();

  const fetchSoFDetails = () => {
    getContractSoFDetails(contractAlias, contractType)
    .then((response: any) => {
      const contract = response.data;
      if(contract?.sourceOfFundsList?.length > 0) {
        setSourceOfFundsList(contract.sourceOfFundsList);
      }
    }) .catch(() => {
      message.error("Error fetching the Source of fund documents.")
    })
  }
  useEffect(() => {
    if(contractAlias && contractType) {
      fetchSoFDetails();
    }
  }, [contractAlias, contractType])
  const handlePDFView =(url:any)=>{
    setImagUrl(url);
    setViewFile(true)
  }

  const handleImagePreview = (url: any) => {
    setImagUrl(url);
    setTimeout(() => {
      setViewImgFile(true);
    }, 500);
  }

  const downloadFile = (url: string) =>{
    const link = document.createElement("a");
    link.href =url;
    link.setAttribute("download", "file");
    document.body.appendChild(link);
    link.click();
  }

  const handleVerify =  (fileDetails: any) => {
    setFileToApprove(fileDetails);
    setOpenApproveModal(true);
  }

  const onFinish =   (value: any) => {
    console.log("source of funds", value);
  
    const requestBody = {
        approvedBy: userAlias,
        comment: value?.reasonComment,
        status: action,
        fileId: fileToApprove.id,
        contractAlias: contractAlias
    }
    approveSourceOfFundDocument(requestBody)
    .then((response: any) => {
      setOpenApproveModal(false);
      if([200, 201].includes(response?.data?.statusCode)) {
          setModalMessage(response?.data?.message);
          setModalMessageIcon(action === "APPROVED" ? approved : Reject );
          setOpenMessageModal(true);
          getPaymentDetails();
          fetchSoFDetails();
      } else {
          setModalMessage(response?.data?.message);
          setModalMessageIcon(Reject);
          setOpenMessageModal(true);
      }
      form.setFieldsValue({
        reasonComment: "",
      });
    }).catch((err: any) => {
      console.log("approver source of funds error", err)
      message.error("Couldn't update the status of file. Please try again later!");
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


 const validatePopupCommentFields = (value: string, maxCommentLength: number) => {
  if (!value || value.trim() === "") {
    return Promise.reject(new Error("Please enter reason !"));
  }
  const allowedChars = /^[a-zA-Z0-9\s,\/#?\-\.]*$/;
  if (!allowedChars.test(value)) {
    return Promise.reject(
      new Error("Only letters, numbers, spaces, and , - ? # / . are allowed")
    );
  }
  if (value.trim().length < 20) {
    return Promise.reject(new Error("Please enter minimum 20 characters"));
  }
  if (value.trim().length > maxCommentLength) {
    return Promise.reject(
      new Error(`Maximum characters allowed: ${maxCommentLength}`)
    );
  }

  return Promise.resolve();
 };



   const handleDownload = (url: string, isPDF: any) => {
     if (!url) {
       message.error("Unable to download: Document URL is missing");
       return;
     }
     const popup: Window | null = window.open("", "_blank")
     if (popup) {
       if (isPDF) {
         const sanitizedUrl = new URL(url).toString();
         const iframeHTML = `
         <iframe src="${sanitizedUrl}" style="width: 100%; height: 100%; border: none;"></iframe>
         `;
         const fallbackHTML = `
           <p style="margin-top: 10px;font-size: 25px">
             Your browser does not support viewing PDFs. 
             <a href="${url}" download="document.pdf" style="color: blue; text-decoration: underline;">Click here to download</a>.
           </p>
         `;
         const canEmbedPDF = document.createElement("iframe").src !== "";
         popup.document.write(canEmbedPDF ? iframeHTML : fallbackHTML);
       } else {
         const imgHTML = `<img src="${url}" alt="Preview" style="max-width: 100%; max-height: 400px;" />`;
         popup.document.write(imgHTML);
       }
     }
     
     const link = document.createElement("a");
     link.href = url;
   
     if (isPDF) {
       link.download = "document.pdf";
     } else {
       link.download = "image.jpg";
     }
   
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
   };

  return (
    <div>
      <Card className={`grayCard pt-3`}>
        
        <Row gutter={{ md: 36, sm: 16, xs: 16 }} className="mb-2 m-0">
            {sourceOfFundsList?.length ? sourceOfFundsList.map((fileItem:any, index: number) => 
                ( <>
                    {!["VERIFIED","REJECTED"].includes(fileItem?.status) ? <>
                        <Col className={index > 1 && ["VERIFIED","REJECTED"].includes(sourceOfFundsList[index-1].status) ? "pt-3" : "pt-1"} style={{marginBottom: '10px'}}>
                            {!fileItem?.url ? null : <>
                                {/* {fileItem?.url.includes(".pdf") ? ( <>
                                    <div className="signature-image max-h pdf-viewIcon admin-panel-pdf-preview">
                                        <PDFPreview
                                            url={fileItem?.url}
                                            onPreviewClick={() => handlePDFView(fileItem?.url)}
                                        />
                                    </div>
                                    <span className="d-flex endtoend signature-view my-1">
                                        <div className="blue_text cursor" onClick={() => { handlePDFView(fileItem?.url) }}>
                                            <Image
                                                preview={false}
                                                src={Pdf} alt="view"
                                            /> <span className="p-1 signature-overflowtext">View</span>
                                        </div>
                                        <CloudDownloadOutlined className="downloadText" onClick={() => downloadFile(fileItem?.url)} />
                                    </span>
                                    </>
                                    ) : ( <>
                                        <div >
                                            <Image
                                                preview={true}
                                                className="signature-image max-h"
                                                src={fileItem?.url}
                                            />
                                        </div>
                                        <div className="d-flex endtoend signature-view my-1">
                                            <div className="blue_text cursor" onClick={() => { setViewImgFile(true) }}>
                                                <Image
                                                  preview={false}
                                                  src={BlueEye} alt="view"
                                                /> 
                                                <span className="p-1 signature-overflowtext">View</span>
                                            </div>
                                            <Image
                                                className="img_preview"
                                                preview={{
                                                visible: viewImgFile,
                                                src: fileItem?.url,
                                                onVisibleChange: (value) => {
                                                    setViewImgFile(value);
                                                },
                                                }}
                                            />
                                            <CloudDownloadOutlined className="downloadText" onClick={() => downloadFile(fileItem?.url)} />
                                        </div>             
                                    </>
                                )} */}

                                <Card
                                  className="kybcard sourceOfFund-Cheque-verifyCard"
                                  cover={
                                    fileItem.url.includes(
                                      ".pdf"
                                    ) ? (
                                      <>
                                        <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(fileItem.url) }}>
                                          <PDFPreview
                                            url={fileItem.url || ''}
                                            onPreviewClick={() => handlePDFView(fileItem.url)}
                                          />
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={fileItem?.url}
                                        height={175}
                                      />
                                    )
                                  }
                                >
                                  

                                  
                                  <div className="d-flex justify-content-between">
                                    <Meta title={fileItem.document ?? `Document ${index + 1}`}/>
                                    <div className="d-flex mx-2">
                                    <div className="mx-2">
                                        <Image
                                          alt="example"
                                          preview={false}
                                          src={BlueEye}
                                          className="cursor"
                                          onClick={() => {
                                            if (fileItem?.url.includes(".pdf")) {
                                              handlePDFView(fileItem?.url)
                                            } else {
                                              handleImagePreview(fileItem?.url);
                                            }
                                          }}
                                        />
                                    </div>

                                      <div>
                                        <Tooltip
                                          title={'Download'}
                                          overlayClassName='custom-tooltip'
                                          placement="left"
                                        >
                                          <div className="ml-2" onClick={() => fileItem?.url && handleDownload(fileItem?.url,fileItem?.url.includes(".pdf"))} >
                                            <Image height="auto" width={20} className="cursor" src={download} alt="" preview={false}></Image>
                                          </div>
                                        </Tooltip>
                                      </div>
                                    </div>

                                  </div>
                                </Card>
                                {!["VERIFIED","REJECTED"].includes(fileItem?.status) && 
                                    <Row className="center_res mx-0 mt-4">
                                        <div className={`d-flex mb-4 gap-3 ${Width > 400 && "flex-column justify-content-center align-items-center"}`}>
                                            <Button
                                                className={`rounded ${index > 0 && sourceOfFundsList[index-1].status === "REJECTED" && "disabled"} mt-0`}
                                                htmlType="submit"
                                                onClick={() => {
                                                    handleVerify(fileItem);
                                                }}
                                            >
                                                Verify
                                            </Button>
                                        </div>
                                    </Row>
                                }
                            </> }
                        </Col>
                    </> : <>
                    <Col className="p-0 mb-3 px-2">
                        <SourceOfFundFileDetails
                            fileDetails={fileItem}
                            title={`Bank Statement ${index + 1}`}
                            downloadFile={downloadFile}
                            width={Width}
                        />
                        </Col>
                    </>}

                </>)                   
            ) : null
          }
          </Row>
      </Card>

      <Modal
        open={openApproveModal}
        onCancel={() => {
          setOpenApproveModal(false);
        }}
        footer={false}
        title={
          <span
            className= "change-client-classification"
          >
            Source of Funds
            <hr className="lightgrayHr mb-3" />
          </span>
        }
        centered
        width={520}
        className="modal-box"
      >
        <Form scrollToFirstError onFinish={onFinish} form={form}>
          <p className="enter-text mb-4">Enter comment below</p>
          <Form.Item
            name="reasonComment"
           rules={[
              {
                validator: (_, value) => validatePopupCommentFields(value, 500),
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
              <Button className="rounded mt-0" htmlType="submit" onClick={() => setAction("APPROVED")}>
                Approve
              </Button>
              <Button className="rounded_cancel_btn mx-3 mt-0" htmlType="submit" onClick={() => setAction("REJECTED")}>
                Reject
              </Button>
            </div>
          </Row>
        </Form>
      </Modal>

      <Modal
        className="text-center modal-box"
        centered
        open={openMessageModal}
        width={410}
        footer={null}
        onCancel={()=> {setOpenMessageModal(false)}}
      >
        <Image
          className="mb-1"
          src={modalMessageIcon}
          preview={false}
          style={{ height: "56px", width: "56px", borderRadius: "50%" }}
        />
        <AuthTitle
          children={modalMessage}
          className="mt-2"
        />
      </Modal>

      {viewFile && imagUrl ? 
        <PdfPreviewModal
        isverifyVisible={viewFile}
        setverifyVisible={setViewFile}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      /> : null}

     {/** Image Preview Modal */}
      {viewImgFile && imagUrl ?
        <ImagePreviewModal
          imagePreviewModal={viewImgFile}
          setImagePreviewModal={setViewImgFile}
          imagUrl={imagUrl}
          setImagUrl={setImagUrl}
          showDownload={true}
        />
        : null}
    </div>
  );
};

const SourceOfFundFileDetails = (props: any) => {
    const {
        fileDetails,
        title,
        downloadFile,
        // width
    } = props;
    const [viewModal, setViewModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [numPages, setNumPages] = useState<any>(null);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const scale = 1.5;
    
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
    };  

    const changePage = (offset: any) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    const previousPage = () => {
        changePage(-1);
    }

    const nextPage = () => {
        changePage(1);
    }

    const DetailsList = (data: any) => {
        let img = '';
        let statusClass = '';
        let status = '';
        if (data?.status === 'VERIFIED') {
            img = Success;
            status = 'Verified';
        }  else {
          status = 'Rejected';
          img = Reject;
          statusClass = 'pending';
        }
        return (
          <div className="ps-3 pt-3">
            <div className="d-flex status">
              <Image
                src={img}
                alt="company"
                preview={false}
                className="px-1 min-width-25"
              />
              <div className={`subText_small mb-2 mx-1 active ${statusClass}`}>{status}</div>
            </div>
    
            <div className="d-flex">
              <Image
                src={UserHalf}
                alt="company"
                preview={false}
                className="px-1 min-width-25"
              />
              <div className="stepDetails_sub mb-2 mx-1 mt-1">{data?.name}</div>
            </div>
            <div className="d-flex date-row">
              <div className="d-flex">
                <Image
                  src={Calendar}
                  alt="company"
                  preview={false}
                  className="px-1 min-width-25"
                />
                <div className="stepDetails_sub mb-2 mx-1">
                  {moment(data?.verifiedat).format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="d-flex mx-3 date-items">
                <Image
                  src={ClockLight}
                  alt="company"
                  preview={false}
                  className="px-1 min-width-25"
                />
                <div className="stepDetails_sub mb-2 ms-1">
                  {moment(data?.verifiedat).format("hh:mm A")}
                </div>
              </div>
            </div>
            <div className="d-flex">
              <Image
                src={CommentImg}
                alt="company"
                preview={false}
                className="px-1 min-width-25"
              />
              <div className="stepDetails_sub mx-1">            
                <Tooltip
                  title={data?.comment && data.comment.length * 7 > 400 ? data?.comment : ""}
                  overlayClassName="leads-custom-tooltip"
                  placement="bottom"
                >
                  <span id="textContainer" className={`${data?.comment && data.comment.length * 7 > 400 ? "overflowText-comment" : ""}`}>
                    {data.comment || "N/A"}
                  </span>
                </Tooltip>
              </div>
            </div>
          </div>
        );
      };

    return (
        <div>
          <Card
            className={`afterApproveCard min-h-300 sourceOfFund-Cheque-card`}
            title={
              <div className="endtoend">
                <span>{title}</span>
                <Image
                  src={BlueEye}
                  alt="company"
                  preview={false}
                  className="px-1 cursor min-width-25"
                  onClick={() => {
                    setViewModal(true);
                  }}
                />
              </div>
            }
          >
              {DetailsList(fileDetails)}
          </Card>
          <Modal
            open={viewModal}
            footer={false}
            className="modal-box "
            title={
              <span className="change-client-classification">
                {title} preview
                <hr className="lightgrayHr" />
              </span>
            }
            centered
            width={520}
            onCancel={() => setViewModal(false)}
          >
            <div className="text-center">
              {isLoading && <Spin size="small" className="spin-overlay" />}
              {fileDetails?.url.includes(".pdf") ? (    
                <>
                  <Document file={fileDetails?.url} onLoadSuccess={onDocumentLoadSuccess} externalLinkRel="_blank" 
                  onLoadError={() => {setIsLoading(false)}}>
                    <Page pageNumber={pageNumber}  scale={scale}
                      renderAnnotationLayer={false}
                      renderTextLayer={true}/>
                  </Document>
                  {numPages > 1 && (
                  <div className='d-flex justify-content-center mt-3 py-2'>
                    <Button children="Previous" onClick={previousPage} className="modal-button w-45 me-3" disabled={pageNumber <= 1} />
                    <Button children="Next" disabled={pageNumber >= numPages} onClick={nextPage} className="modal-button w-45" />
                  </div>
                  )}
                </>
              ) : (
                <Image
                  src={fileDetails.url}
                  preview={false}
                  alt="preview"
                  className="max-h-460 my-3"
                  onLoad={() => setIsLoading(false)}
                />
              )}
            </div>
            <Button type="primary" className="docudownloadBtn" onClick={() => { downloadFile(fileDetails.url) }}>Download</Button>
          </Modal>  
        </div>
      );
}
export default SourceOfFundDetails;
