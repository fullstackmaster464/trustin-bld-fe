import { NormalText } from "../ui-elements/TextRepo";
import { Card, Col, Row,Image } from "antd";
import { useState } from "react";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import { CloudDownloadOutlined } from "@ant-design/icons";
import BlueEye from "../../assets/img/blue_eye.svg";
import Pdf from "../../assets/img/pdfview.svg";
import PDFPreview from "../Common/PdfPreviewIcon";

const CustomContractDetails = (props :any) => {
  const { customFieldList, transactionpreview, customAttachmentUrls} = props;
  let objKeys;
  if (customFieldList) {
    objKeys = Object.keys(customFieldList);
  }
  return (
    <div>
      <div className="stepDetails mt-3 mb-4 text-break text-wrap">Custom contract details</div>
      <Card className="grayCard pt-3">
        <Row  className="d-fle gap-3 flex-wrap">
          {customAttachmentUrls?.length ? 
            customAttachmentUrls.map((attachmentUrl:string , index : number) => 
              (<CustomAttachments 
                key={index}
                customAttachUrl={attachmentUrl} 
                transactionpreview ={transactionpreview}                 
              /> )                   
            ) : null
          }
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
    customAttachUrl,
    transactionpreview
  } = props;
  const [imagUrl, setImagUrl] = useState<any>(customAttachUrl);
  const [viewFile, setViewFile] = useState(false);
  const [viewImgFile, setViewImgFile] = useState(false);
  const handlePDFView =(url:any)=>{
    setImagUrl(url);
    setViewFile(true)
  }
  const downloadFile = (url: string | undefined) =>{
    const link = document.createElement("a");
    link.href =url ? url : customAttachUrl;
    link.setAttribute("download", "file");
    document.body.appendChild(link);
    link.click();
  }
  return <> 
    <Col style={{marginBottom: '10px'}}>

      {!customAttachUrl ? null : customAttachUrl.includes(".pdf") ? (
        <div className="signature-image m admin-panel-pdf-preview pdf-preview-adjust" onClick={() => { handlePDFView(customAttachUrl)}}>
          <PDFPreview
            url={customAttachUrl || ''} 
            onPreviewClick={() => handlePDFView(customAttachUrl)}                            
          />
        </div>
        ) : (
        <Image
          preview={true}
          className="signature-image preview-card-width"
          src={customAttachUrl}
        ></Image>
        )              
      }

      { transactionpreview !== "true" &&
        <>
          {!customAttachUrl ? null : customAttachUrl.includes(".pdf")   ?
            <span className="d-flex endtoend signature-view my-1 mx-3">
              <div className="blue_text cursor" onClick={() => { handlePDFView(customAttachUrl) }}>
                <Image
                  preview={false}
                  src={Pdf} alt="view"
                /> <span className="px-1" >View</span>
              </div>
              <CloudDownloadOutlined className="downloadText" onClick={() => downloadFile(customAttachUrl)} />
            </span>
            :
            <div className="d-flex endtoend signature-view my-1">
              <div className="blue_text cursor d-flex mx-3" onClick={() => { setViewImgFile(true) }}>
                <Image
                  preview={false}
                  src={BlueEye} alt="view"
                /> 
                <span className="p-1 signature-overflowtext">view</span>
              </div>
              <Image
                className="img_preview"
                preview={{
                  visible: viewImgFile,
                  src: customAttachUrl,
                  onVisibleChange: (value) => {
                    setViewImgFile(value);
                  },
                  }}
              />
              <CloudDownloadOutlined className="downloadText" onClick={() => downloadFile(customAttachUrl)} />
            </div>
          }
        </>
      }             
    </Col>
    {customAttachUrl.includes(".pdf") ? 
        <PdfPreviewModal
        isverifyVisible={viewFile}
        setverifyVisible={setViewFile}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      /> : null}
  </>
}
export default CustomContractDetails;
