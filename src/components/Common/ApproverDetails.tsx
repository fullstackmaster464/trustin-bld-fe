import { Button, Card, Image, Modal, Spin, Tooltip } from "antd";
import Success from "../../assets/img/tick_icon.svg";
import Reject from "../../assets/img/reject.svg";
import UserHalf from "../../assets/img/userHalf.svg";
import Calendar from "../../assets/img/Calendar.svg";
import ClockLight from "../../assets/img/clock_light.svg";
import CommentImg from "../../assets/img/Comment.svg";
import BlueEye from "../../assets/img/blueEye.svg";
import { useEffect, useState } from "react";
import moment from "moment";
import { Document, Page } from "react-pdf";

interface PorpsTypes {
  modalTitle: any;
  approverDetails: object | any;
  uploadedFile: any;
  tab: string;
}
const ApproverDetails = (props: PorpsTypes): any => {
  const { modalTitle, approverDetails, uploadedFile, tab } = props;
  const [viewModal, setViewModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const scale = 1.5;

  const isDefined = (value: any): boolean => {
    return value !== null && value !== undefined;
  };

  
  useEffect(() => {
    const textContainer: any = document.getElementById("textContainer");
    const readMoreButton: any = document.getElementById("readMoreButton");
    
    if (isDefined(textContainer) && textContainer?.textContent?.length > 180) {
      const truncatedText = textContainer.textContent.slice(0, 180);
      // const remainingText = textContainer.textContent.slice(180);

      textContainer.innerHTML = truncatedText;
      if (isDefined(readMoreButton)) {
        readMoreButton.style.display = "inline";
      }

    }
  },  [approverDetails]);

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = uploadedFile;
    link.setAttribute("download", modalTitle + "_file");
    document.body.appendChild(link);
    link.click();
  };
  const DetailsList = (data: any) => {
    let img = '';
    let statusClass = '';
    let status = '';
    if (data?.status === 'EXPIRED' || data?.verified === 'EXPIRED') {
      status = 'Expired'
      img = Reject;
      statusClass = 'pending';
    } else if (data?.status === 'VERIFIED' || data?.verified === 'VERIFIED') {
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
              {moment(data?.updatedAt).format("DD-MM-YYYY")}
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
            <Tooltip
              title={data?.reason && data.reason.length * 7 > 400 ? data?.reason : ""}
              overlayClassName="leads-custom-tooltip"
              placement="bottom"
            >
              <span id="textContainer" className={`${data?.reason && data.reason.length * 7 > 400 ? "overflowText-comment" : ""}`}>
                {data.reason || "N/A"}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };
  const ApproverDetailsList = (data: any) => {
    let img = '';
    let statusClass = '';
    let status = '';
    if (data?.status === 'EXPIRED' || data?.verified === 'EXPIRED') {
      status = 'Expired'
      img = Reject;
      statusClass = 'pending';
    } else if (data.isCompliance) {
      img = Success;
      status = 'Verified';
      statusClass = 'active';
    } else {
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
        <div className="d-flex date-row">
          <div className="d-flex">
            <Image
              src={Calendar}
              alt="company"
              preview={false}
              className="px-1 min-width-25"
            />
            <div className="stepDetails_sub mb-2 mx-1">
              {moment(data.approverVerifyUpdatedDate ? data.approverVerifyUpdatedDate : data?.approververifyUpdatedDate).format("DD-MM-YYYY")}
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
              {moment(data.approverVerifyUpdatedDate ? data.approverVerifyUpdatedDate : data?.approververifyUpdatedDate).format("hh:mm A")}
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
              title={data.approverReason && data.approverReason?.length * 7 > 400 ? data.approverReason : ""}
              overlayClassName="leads-custom-tooltip"
              placement="bottom"
            >
              <span id="textContainer" className={`${data.approverReason && data.approverReason?.length * 7 > 400 ? "overflowText-comment" : ""}`}>
                {data.approverReason || "N/A"}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  };

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

  return (
    <div>
      <Card
        className=" afterApproveCard min-h-300"
        title={
          <div className="endtoend">
            <span>{modalTitle}</span>
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
        {tab == "approver"
          ? ApproverDetailsList(approverDetails)
          : DetailsList(approverDetails)}
      </Card>
      <Modal
        open={viewModal}
        footer={false}
        className="modal-box "
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
          {isLoading && <Spin size="small" className="spin-overlay" />}
          {uploadedFile.includes(".pdf") ? (
            // <embed
            //   className="w-100 cursor max-h-460 h-460"
            //   src={uploadedFile}
            //   onLoad={() => setIsLoading(false)}
            // />

            <>
              <Document file={uploadedFile} onLoadSuccess={onDocumentLoadSuccess} externalLinkRel="_blank" 
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
              src={uploadedFile}
              preview={false}
              alt="preview"
              className="max-h-460 my-3"
              onLoad={() => setIsLoading(false)}
            />
          )}
        </div>
        <Button type="primary" className="docudownloadBtn" onClick={() => { downloadFile() }}>Download</Button>
      </Modal>
    </div>
  );
};

export default ApproverDetails;
