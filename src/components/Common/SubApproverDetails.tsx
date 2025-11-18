import { Button, Card, Image, message, Modal, Popover, Spin, Tooltip, Upload, UploadProps } from "antd";
import Success from "../../assets/img/tick_icon.svg";
import Reject from "../../assets/img/reject.svg";
import UserHalf from "../../assets/img/userHalf.svg";
import Calendar from "../../assets/img/Calendar.svg";
import ClockLight from "../../assets/img/clock_light.svg";
import CommentImg from "../../assets/img/Comment.svg";
import BlueEye from "../../assets/img/blueEye.svg";
import Edit from "../../assets/img/edit_orange.svg";
import { useEffect, useState } from "react";
import moment from "moment";
import { Document, Page } from "react-pdf"; 
import { acceptedFileExtension, beforeUploadFile, getLocalStorage } from "./Constants"; 
import { updateCheque, updateSupplier } from "../../services/cheque";
import { deleteSignFile } from "../../services/user";


const SubApproverDetails = (props: any) => {
  const { modalTitle, approverDetails, uploadedFile, tab, proStatus,contractDetail , getChequeDetail, isCustomChequeDocument = false } = props;
  const [viewModal, setViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [loadingCard, setLoadingCard] = useState(false);

  
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;

  useEffect(() => {
    const textContainer:any = document.getElementById("textContainer");
    const readMoreButton:any = document.getElementById("readMoreButton");

    if (textContainer.textContent.length > 180) {
      const truncatedText = textContainer.textContent.slice(0, 180);
      textContainer.innerHTML = truncatedText;
      readMoreButton.style.display = "inline";
    }  
 
  }, []);

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = uploadedFile;
    link.setAttribute("download", modalTitle+"_file");
    document.body.appendChild(link);
    link.click();
  };

  const CustomTooltip = ({
    text = "",
    maxLength = 75,
    overlayClassName = "",
  }) => { 
    
    const truncatedText =
      text && text.length > maxLength ? text.slice(0, maxLength) + "..." : (text || "");
  
    return (
      <Tooltip title={text} overlayClassName={overlayClassName}>
        <span className="Status">{truncatedText}</span>
      </Tooltip>
    );
  };

  const DetailsList = (data: any) => {
    let img = '';
    let statusClass = '';
    let status = '';
    if (proStatus === 'VERIFIED') {
      img = Success;
      status = 'Approved';
      statusClass = 'active';
    } else if (proStatus === 'EXPIRED') {
      status = 'Expired'
      img = Reject;
      statusClass = 'pending';
    } else if (proStatus === 'PENDING') {
      status = 'PENDING'
      img = Reject;
      statusClass = 'pending';
    } else {
      status = 'Rejected';
      img = Reject;
      statusClass = 'pending';
    }
    return (
      loadingCard ? <div className="loading-container"><Spin /></div>  : 
      <div className="ps-3 pt-3">
        <div className="d-flex status">
          <Image
            src={img}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className={`subText_small mb-2 mx-1 active ${statusClass}`}>{status} </div>
        </div>

        <div className="d-flex">
          <Image
            src={UserHalf}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className="stepDetails_sub mb-2 mx-1 mt-1">{data?.name ? data?.name : 'N/A'}</div>
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
              {data?.updatedAt ? moment(data?.updatedAt).format("DD-MM-YYYY") : 'N/A'}
            </div>
          </div>
          <div className="d-flex mx-3 date-items">
            <Image
              src={ClockLight}
              alt="company"
              preview={false}
              className="px-1 min-width-25"
            />
            <div className="stepDetails_sub mb-2">
              {data?.updatedAt ? moment(data?.updatedAt).format("hh:mm A") : 'N/A'}
            </div>
          </div>
        </div>
        <div className="d-flex pe-3">
          <Image
            src={CommentImg}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className="stepDetails_sub mx-1">
            <span id="textContainer" className="ellipsis-text"> 
            {
            data.reason ?  
            <CustomTooltip
                text={data?.reason}
                maxLength={75}
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
                content={data.reason ? data.reason : 'N/A'}
                trigger="click"
              >
                ... Read more
              </Popover>
            </span>
          </div>
        </div>
      </div>
    )
  };

  const AuthorizerDetailsList = (data: any) => {
    let img = '';
    let statusClass = '';
    let status = '';
    if (proStatus === 'VERIFIED') {
      img = Success;
      status = 'Verified';
      statusClass = 'active';
    } else if (proStatus === 'EXPIRED') {
      status = 'Expired'
      img = Reject;
      statusClass = 'pending';
    } else if (proStatus === 'PENDING') {
      status = 'PENDING'
      img = Reject;
      statusClass = 'pending';
    } else {
      status = 'Rejected';
      img = Reject;
      statusClass = 'pending';
    }
    return (
      loadingCard ?  <div className="loading-container"><Spin /></div> : 
      <div className="ps-3 pt-3">
        <div className="d-flex status">
          <Image
            src={img}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className={`subText_small mb-2 mx-1 ${statusClass}`}>{status}</div>
        </div>

        <div className="d-flex">
          <Image
            src={UserHalf}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className="stepDetails_sub mb-2 mx-1 mt-1">
            {data?.name}
          </div>
        </div>
        <div className="d-flex">
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
          <div className="d-flex mx-3">
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
        </div>
        <div className="d-flex">
          <Image
            src={CommentImg}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className="stepDetails_sub mx-1">
            <span id="textContainer" className="ellipsis-text"> 
              <CustomTooltip
                text={data?.reason}
                maxLength={75}
                overlayClassName="custom-tooltip custom-tooltip-inner"
              />
            </span>
            <span id="readMoreButton" style={{ display: "none" }}>
              {" "}
              <Popover
                placement="top"
                className="commentPopover cursor"
                content={data.reason}
                trigger="click"
              >
                ... Read more
              </Popover>
            </span>
          </div>
        </div>
      </div>
    )
  };

  const ApproverDetailsList = (data: any) => {
    let img = '';
    let statusClass = '';
    let status = '';
    if (proStatus) {
      img = Success;
      status = 'Verified';
      statusClass = 'active';
    } else {
      status = 'Rejected';
      img = Reject;
      statusClass = 'pending';
    }
    
    return (
      loadingCard ?  <div className="loading-container"><Spin /></div> : 
      <div className="ps-3 pt-3">
        <div className="d-flex status">
          <Image
            src={img}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className={`subText_small mb-2 mx-1 ${statusClass}`}>{status}</div>
        </div>

        <div className="d-flex">
          <Image
            src={UserHalf}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className="stepDetails_sub mb-2 mx-1 mt-1">
            {data?.approverName}
          </div>
        </div>
        <div className="d-flex">
          <div className="d-flex">
            <Image
              src={Calendar}
              alt="company"
              preview={false}
              className="px-1 min-width-25"
            />
            <div className="stepDetails_sub mb-2 mx-1">
              {moment(data?.approververifyUpdatedDate).format("DD-MM-YYYY")}
            </div>
          </div>
          <div className="d-flex mx-3">
            <Image
              src={ClockLight}
              alt="company"
              preview={false}
              className="px-1 min-width-25"
            />
            <div className="stepDetails_sub mb-2">
              {moment(data?.approververifyUpdatedDate).format("hh:mm A")}
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
            <span id="textContainer" className="ellipsis-text"> 
               <CustomTooltip
                text={data?.approverReason}
                maxLength={75}
                overlayClassName="custom-tooltip custom-tooltip-inner"
              />
              </span>
            <span id="readMoreButton" style={{ display: "none" }}>
              {" "}
              <Popover
                placement="top"
                className="commentPopover cursor"
                content={data.approverReason}
                trigger="click"
              >
                ... Read more
              </Popover>
            </span>
          </div>
        </div>
      </div> 
    )
  };

  const onDocumentLoadError = () => {
      setIsLoading(false);
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsLoading(false);
  }
  const changePage = (offset: any) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }
  const previousPage = () => {
    changePage(-1);
  }
  const nextPage = () => {
    changePage(1);
  }




  const local = getLocalStorage("auth");
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const Token = local ? JSON.parse(local)?.token : "";  



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
 
    // onChange: async (info : any) => {
    //   const { status, response } = info.file;


    //   if(!status || !response) return;
    //   setLoadingCard(true);
    //   let document : any = []; 
    //   let mainKeyname = '',ind;
    //   contractDetail.documents.forEach((docs: any,i: number) => {
    //     const keyName = `representativeShareholderId_${i+1}`;
    //     if(docs[keyName] == approverDetails.id){
    //       mainKeyname = keyName;
    //       ind = i;
    //     }
    //   });
    //   document = contractDetail.documents;


    //   document.splice(ind,1,{[mainKeyname] : response.id});


    //   // TODO

    // },

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
      
      if (isCustomChequeDocument) {
        const newCustomAttachmentIds = contractDetail.customAttachments.map((item: any) => {
          if (item.id === approverDetails.id) {
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

        updateCheque(contractDetail.aliasName,payLoad)
         .then(() => {
            deleteSignFile({ fileID: approverDetails.id }).catch()
            getChequeDetail()
          })
          .catch(() => {
            message.error("Failed to update document");
          })
          .finally(() => {
            setLoadingCard(false);
          });
        return;
      }
      
      let document : any = [], foundDoc : any; 
      let mainKeyname = '',ind;

      contractDetail?.sellerDetails.documents.forEach((docs: any,i: number) => {
        const keyName = `documentid_${i}`;
        if(docs[keyName] == approverDetails.id){
          mainKeyname = keyName;
          ind = i;
          foundDoc = docs;
        }
      });
      document = contractDetail?.sellerDetails.documents;
      
      document.splice(ind,1,{ ...foundDoc, [mainKeyname] : response.data.id });
      const payLoad = { documents : document };
      const sellerAlias = contractDetail?.sellerAlias;
 
        
      updateSupplier(sellerAlias, payLoad)
        .then(()=>{
          deleteSignFile({ fileID: approverDetails.id }).catch()
          getChequeDetail()
        }).catch(() => {
          message.error("Failed to update document");
        })
        .finally(() => {
          setLoadingCard(false);
        });
    },
  };

  return (
    <div>
      <Card
        className="afterApproveCard min-height-300"
        title={
          <div className="end-to-end">
            <Tooltip
                title={modalTitle && modalTitle.length > 20 ? modalTitle : null}
                placement="top"
                overlayClassName="leads-custom-tooltip"
              >
                <div className="ellipsis-container">
                  <span className="ant-card-meta-title">{modalTitle}</span>
                </div>
              </Tooltip>
            {(!proStatus || proStatus == 'REJECTED') && (userAlias == contractDetail?.buyerAlias ) ?
             <Upload  {...propss} accept={acceptedFileExtension} className="ant-image">
             <Image
                src={Edit}
                id="image-upload"
                alt="company"  
                preview={false}
                className="px-0 cursor min-width-25 w-10"
                onClick={() => { 
                }}
              />
              </Upload > :  <Image
              src={BlueEye}
              alt="company"
              preview={false}
              className="px-1 cursor min-width-25"
              onClick={() => {
                setViewModal(true)
              }}
            /> }
          </div>
        }
      >
        {tab == "approver" ? ApproverDetailsList(approverDetails) :
        tab == "authorizer" ?  AuthorizerDetailsList(approverDetails) :
           DetailsList(approverDetails)}
      </Card>
      <Modal
        open={viewModal}
        footer={false}
        className="modal-box"
        title={
          <span className="change-client-classification">
            {modalTitle} preview
            <hr className="lightgrayHr" />
          </span>
        }
        centered
        width={520}
        onCancel={() => setViewModal(false)}
      >
        <div className="text-center">
        {isLoading && <Spin size="small" className="spin-overlay"/>} 
          {uploadedFile.includes(".pdf") ? (
            <>
              <Document file={uploadedFile} onError={onDocumentLoadError} onLoadSuccess={onDocumentLoadSuccess} externalLinkRel="_blank" >
                <Page pageNumber={pageNumber} />
              </Document>
              {numPages && numPages > 1 && (
                <div className='d-flex justify-content-center mt-3 py-2'>
                  <Button children="Previous" onClick={previousPage} className="modal-button w-45 me-3" disabled={pageNumber <= 1} />
                  <Button children="Next" disabled={pageNumber >= numPages} onClick={nextPage} className="modal-button w-45" />
                </div>
              )}
            </>
          ) : (
            <Image
              src={uploadedFile}
              preview={false}
              alt="preview"
              className="max-h-460 my-3"
              onLoad={() => setIsLoading(false)} 
            />
          )}
        </div>
        <Button type="primary" className="docudownloadBtn" onClick={() =>{downloadFile()}}>Download</Button>
      </Modal>
    </div>
  )
}

export default SubApproverDetails;
