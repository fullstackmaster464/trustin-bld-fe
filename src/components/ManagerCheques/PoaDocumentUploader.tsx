import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Modal,
  Image,
  Button,
  message,
  Upload,
  DatePicker,
  Card,
  Input,
  UploadProps,
  Tooltip,
} from "antd";

import {
  UploadOutlined,
} from "@ant-design/icons";

import DocumentViewCard from "./DocumentViewCard";
import PlusUpload from "../../assets/img/PlusUpload.svg";
import Dragger from "antd/es/upload/Dragger";
import PDFPreview from "../Common/PdfPreviewIcon";
import {
  acceptedFileExtension,
  beforeUploadFile,
  DateWithUtcOffset,
  getLocalStorage,
  USER_TYPE_TEXT,
} from "../Common/Constants";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import infoIcon from "../../assets/img/informIcon.svg";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
interface PoaDocumentUploaderProps {
  label: string;
  fileList: any[];
  form: any;
  setFileList: React.Dispatch<React.SetStateAction<any[]>>;
  userExists: boolean;
}

const PoaDocumentUploader: React.FC<PoaDocumentUploaderProps> = ({
  label,
  fileList,
  form,
  setFileList,
  userExists,
}) => {
  const [uploadModal, setUploadModal] = useState(false);
  const [text, setText] = useState("");
  const [expiryDate, setExpiryDate] = useState<any>(null);

  const [documentId, setDocumentId] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const local = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const [uploadedFile, setUploadedFile] = useState<any>();
  const [imagUrl, setImagUrl] = useState<any>("");
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [previewFileUrl, setPreviewFileUrl] = useState<any>(null);

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  const uploadDocumentProps: UploadProps = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/contracts/uploadSignature",
    beforeUpload: async (file: any, fileListToUpload: any) => {
      const totalFiles = fileList?.length + fileListToUpload?.length;
      if (totalFiles > 10) {
        message.error("You can only upload a maximum of 10 files.");
        return false;
      }

      const checkBeforeUpload = beforeUploadFile(file, "Document");
      if (checkBeforeUpload == true) {
        setLoader(true);
        return true;
      } else {
        setLoader(false);
        message.error(checkBeforeUpload);
        return false;
      }
    },

    onChange: async (info: any) => {
      const { status, response } = info.file;
      if (status !== "uploading") {
        setLoader(false);
      }
      if (status === "done") {
        setUploadedFile(response);
        setLoader(false);
      } else if (status === "error") {
        setLoader(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
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

  const onUploadDocument = () => {
    const nameValidation = validateBeneficiaryName(text);
    nameValidation
      .then(() => {
        if (!expiryDate) {
          message.error("Please select date");
          return;
        } else if (!uploadedFile) {
          message.error("Please select file");
          return;
        }

        const expiryDt =
          typeof expiryDate === "string"
            ? expiryDate
            : expiryDate.format("DD-MM-YYYY");
        const updatedList = documentId
          ? fileList.map((doc) =>
            doc.id === documentId
              ? {
                ...uploadedFile,
                document: text,
                expirydate: DateWithUtcOffset(expiryDt),
                isExpired: expiryDate ? dayjs(expiryDate).isBefore(dayjs()) : false,
              }
              : doc
          )
          : [
            ...fileList,
            {
              ...uploadedFile,
              document: text,
              expirydate: DateWithUtcOffset(expiryDt),
              isExpired: expiryDate ? dayjs(expiryDate).isBefore(dayjs()) : false,
            },
          ];

        setFileList(updatedList);
        setUploadModal(false);
        resetUploadFields();
      })
      .catch((err: any) => {
        message.error(err.message || "Validation failed");
      });
  };

  const resetUploadFields = () => {
    // setUploadedFile(null);
    setText("");
    setExpiryDate(null);
    setDocumentId(null);
  };

  const sellerReupload = (doc: any) => {
    setUploadModal(true);
    setText(doc?.document);
    setExpiryDate(null);
    setUploadedFile(null);
    setDocumentId(doc.id);
  };

  const handleImagePreview = (url: string) => {
    setPreviewFileUrl(url);
  };

  const handlePDFView = (url: any) => {
    if (url) {
      setImagUrl(url);
      setverifyVisible(true);
    }
  };

  const handleDateChange = (_date: any, _dateString: string | string[]) => {
    setExpiryDate(_date);
  };
  const onUploadSupplierDoc = () => {
    setUploadModal(true);
    setText("");
    setExpiryDate(null);
    setUploadedFile(null);
  };
  const removeDocument = async (id: string) => {
    const filteredDocumentList =
      fileList && fileList?.filter((elem: any) => elem?.id !== id);
    setFileList(filteredDocumentList);
  };

  return (
    <>
      <Row className="mt-3 mb-2 ml-3">
        <Col span={24} className="d-flex">
          <div className="stepDetails_medium upload_address">{label}</div>
          <Tooltip
            title={
              <span className="response-tooltip">
                Emirates ID or Passport is required
              </span>
            }
            overlayClassName='custom-tooltip'
            placement="top"
          >
            <img src={infoIcon} className="ms-1" />
          </Tooltip>
        </Col>
      </Row>

      <Row className={Width > 424 ? "ms-3" : ""}>
        <div className="doc-block w-100">
          <div className={"d-flex gap-3 flex-wrap moa-doc-list"}>
            <>
              <DocumentViewCard
                fileList={fileList}
                userExists={userExists}
                Width={Width}
                handlePDFView={handlePDFView}
                handleImagePreview={handleImagePreview}
                sellerReupload={sellerReupload}
                removeDocument={removeDocument}
              />

              {fileList?.length < 5 && !userExists ? (
                <div>
                  <div
                    onClick={onUploadSupplierDoc}
                    className="seller-upload-document cursor"
                  >
                    <div className="seller-upload-document_innerfields">
                      <Image src={PlusUpload} alt="passport" preview={false} />
                      <div className="subText_xs overflowText_twoLines w-upload">
                        {fileList?.some(
                          (file: any) => file?.status === "REJECTED"
                        ) ? (
                          <span className="rejectReasonText">Re-upload</span>
                        ) : (
                          "Document"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          </div>
          <Row>
            <ul className="stepDetails_medium_sub mt-4">
              <li>
                Resident: Emirates ID (front & back) <br />
                Non-resident: Passport
              </li>
              {!(
                (label === "Buyer's document" && form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.SELLERPOA) ||
                (label === "Seller's document" && form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.BUYERPOA)
              ) && (
                  <li>Trade license of Broker (if any)</li>
                )}
              {label === "Buyer's document" &&
                form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.BUYERPOA && (
                  <li>Buyer Power of Attorney (POA)</li>
                )}
              {label === "Seller's document" &&
                form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.SELLERPOA && (
                  <li>Seller Power of Attorney (POA)</li>
                )}
            </ul>
          </Row>
        </div>
      </Row>

      {/* Upload Modal */}
      <Modal
        open={uploadModal}
        centered
        title={<span className="font-semibold text-lg">Upload Document</span>}
        footer={null}
        onCancel={() => {
          setUploadModal(false);
          resetUploadFields();
        }}
        destroyOnClose
      >
        <Row gutter={16} className="mt-3">
          <Col span={24} className="mb-4">
            <div className="doc-block w-100 modal-doc-block">
              <div className={"d-flex  moa-doc-list flex-column"}>
                <>
                  <p
                    className="seller-text-category"
                    style={{ marginLeft: "0px" }}
                  >
                    Document name
                  </p>
                  <Input
                    placeholder="Enter document name."
                    value={text}
                    type="text"
                    onChange={(e) => setText(e.target.value)}
                    style={{ background: "#fafafa" }}
                  />
                </>
              </div>
            </div>
          </Col>
          <Col span={24} className="mb-4">
            <div className="doc-block w-100 modal-doc-block">
              <div className={"d-flex  moa-doc-list flex-column"}>
                <>
                  <p
                    className="seller-text-category"
                    style={{ marginLeft: "0px" }}
                  >
                    Expiry date
                  </p>
                  {/* <div className="stepDetails_medium fw-500"> */}
                  <DatePicker
                    value={expiryDate}
                    style={{ width: "100%" }}
                    onChange={(date: any, dateString: string | string[]) => {
                      handleDateChange(date, dateString);
                    }}
                    format={{
                      format: "DD-MM-YYYY",
                      type: "mask",
                    }}
                    placeholder="Select expiry date"
                    disabledDate={(current: any) => {
                      return current && current.valueOf() < Date.now();
                    }}
                  />
                  {/* </div> */}
                </>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <div>
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
                      <Image
                        alt="example"
                        src={uploadedFile?.url}
                        height={175}
                      />
                    )
                  }
                >
                  {uploadedFile.isExpired ? (
                    <Upload {...uploadDocumentProps} accept={acceptedFileExtension}>
                      <UploadOutlined className="cursor" />
                      <span className="rejectReasonText">Re-upload</span>
                    </Upload>
                  ) : null}
                </Card>
              ) : (
                <>
                  <div className="enter-text-category d-flex mb-2 m-0 p-0">Document
                    <Tooltip
                      title={
                        <span className="response-tooltip">
                          Emirates ID or Passport is required
                        </span>
                      }
                      overlayClassName='custom-tooltip'
                      placement="top"
                    >
                      <img src={infoIcon} width={24} height={24} className="ms-1" />
                    </Tooltip>
                  </div>
                  <Dragger
                    {...uploadDocumentProps}
                    accept={acceptedFileExtension}
                    className="moa-document d-block"
                  >
                    <div>
                      <Image src={PlusUpload} alt="passport" preview={false} />
                      <div className="mt-3 subText_xs overflowText_twoLines mx-4">
                        Document
                      </div>
                    </div>
                  </Dragger>
                </>
              )}
            </div>
          </Col>

          <Col span={24}>
            <div className="">
              <Button
                key="button"
                type="primary"
                htmlType="button"
                className="modal-button mt-5"
                loading={loader}
                onClick={() => {
                  onUploadDocument();
                  // updateKyb
                }}
              >
                Submit
              </Button>
              <Button
                key="cancel"
                type="primary"
                className="modal-button-cancel mt-5 mx-2"
                onClick={() => {
                  setUploadModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
      <Image
        className="img_preview"
        preview={{
          visible: !!previewFileUrl,
          src: previewFileUrl,
          onVisibleChange: (value) => {
            setPreviewFileUrl(value);
          },
        }}
      />
      <PdfPreviewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
    </>
  );
};

export default PoaDocumentUploader;
