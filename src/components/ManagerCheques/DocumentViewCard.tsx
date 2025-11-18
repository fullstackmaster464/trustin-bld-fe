import React from "react";
import { Image, Spin, Tooltip } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import moment from "moment";

import Pdf from "../../assets/img/pdfview.svg";
import Delete from "../../assets/img/delete.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import PDFPreview from "../Common/PdfPreviewIcon";
const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
interface DocumentViewCardProps {
  fileList: any;
  userExists?: boolean;
  Width: number;
  handlePDFView: (url: string) => void;
  handleImagePreview: (url: string) => void;
  sellerReupload: (file: any) => void;
  removeDocument?: (id: string) => void;
}

const DocumentViewCard: React.FC<DocumentViewCardProps> = ({
  fileList,
  userExists = false,
  Width,
  handlePDFView,
  handleImagePreview,
  sellerReupload,
  removeDocument,
}) => {
  return (
    <>
      {fileList &&
        fileList?.map((singleFile: any, index: number) => {
          const isPDF = singleFile?.url?.includes(".pdf");
          const isLoading = singleFile?.loading;

          return (
            <div key={index}>
              {singleFile?.url && !isLoading && (
                <ul className="sellers-moa-doc-list-ul mb-0">
                  <li key={singleFile?.id}>
                    <div>
                      {(singleFile?.file?.name ||
                        singleFile?.fileName ||
                        typeof singleFile == "object") &&
                      singleFile?.status !== "REJECTED" ? (
                        <div>
                          {isPDF ? (
                            <div
                              className="signature-image sellers-moa-doc-signature-image m admin-panel-pdf-preview pdf-viewIcon"
                              onClick={() => handlePDFView(singleFile?.url)}
                            >
                              <PDFPreview
                                url={singleFile?.url}
                                onPreviewClick={() =>
                                  handlePDFView(singleFile?.url)
                                }
                              />
                            </div>
                          ) : (
                            <Image
                              preview={true}
                              className="signature-image m sellers-moa-doc-signature-image"
                              src={singleFile?.url}
                            />
                          )}
                        </div>
                      ) : null}

                      <div
                        style={{
                          marginTop:
                            typeof singleFile == "object" ||
                            singleFile?.file?.name
                              ? -12
                              : 27,
                        }}
                        onClick={() => {
                          singleFile?.isExpired
                            ? sellerReupload(singleFile)
                            : null;
                        }}
                      >
                        <div className="mt-3 subText_xs overflowText_twoLines w-upload sellers-moa-doc-description">
                          <Tooltip
                            title={
                              singleFile?.document &&
                              singleFile?.document.length > 15
                                ? singleFile?.document
                                : null
                            }
                            overlayClassName="leads-custom-tooltip"
                          >
                            <div className="ellipsis-container">
                              {singleFile?.document}
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </li>
                  <span className="d-flex endtoend pr-1">
                    <span className={Width > 475 ? "pr-1" : ""}>
                      Expiry date{" "}
                    </span>
                    <span className="text-danger mb-2 ml-3rem">
                      {moment(singleFile?.expirydate).format("DD-MM-YYYY")}
                    </span>
                  </span>
                  <span className="d-flex endtoend p-1">
                    <div
                      className="blue_text cursor"
                      onClick={() =>
                        isPDF
                          ? handlePDFView(singleFile.url)
                          : handleImagePreview(singleFile?.url)
                      }
                    >
                      <Image
                        preview={false}
                        src={isPDF ? Pdf : BlueEye}
                        alt="view"
                      />
                      <span className="px-1">View </span>
                    </div>
                    {singleFile?.status !== "VERIFIED" && !userExists && (
                      <Image
                        src={Delete}
                        alt="Delete"
                        preview={false}
                        onClick={() =>
                          removeDocument && removeDocument(singleFile?.id)
                        }
                        className="cursor moa-doc-delete-icon"
                      />
                    )}
                    {singleFile?.isExpired && (
                      <span className="text-danger mb-2 ml-3rem">
                        Expired
                        <span className="text-danger mb-2 ml-3rem ms-2 cursor">
                          <UploadOutlined
                            className="upload-icon"
                            onClick={() => {
                              sellerReupload(singleFile);
                            }}
                          />
                        </span>
                      </span>
                    )}
                  </span>
                </ul>
              )}
              {isLoading && <Spin indicator={Loader} className="ml-20" />}
            </div>
          );
        })}
    </>
  );
};

export default DocumentViewCard;
