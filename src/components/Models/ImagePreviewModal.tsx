import { useState, useEffect } from "react";
import { Card, Modal, Image, Spin, Button } from "antd";
import "../../assets/scss/custom.scss";

const ImagePreviewModal = ({
  imagePreviewModal,
  setImagePreviewModal,
  imagUrl,
  setImagUrl,
  showDownload = false,
}: any):any => {
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setImageLoaded(false);
  }, [imagePreviewModal]);

  const handleCancel = () => {
    setImagUrl("");
    setImageLoaded(false);
    setLoading(true);
    setImagePreviewModal(false);
  };

  const handleImageLoad = () => {
    setLoading(false);
    setImageLoaded(true);
  };

  const downloadFile = () => {
    const link = document.createElement("a");
    const fileName = new Date();
    link.href = imagUrl;
    link.setAttribute("download", fileName + "_file");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Modal
      open={imagePreviewModal}
      footer={false}
      width={500}
      onCancel={handleCancel}
      className="custome-modal"
      title={<span className="modal-title-text">Preview</span>}
      centered
    >
      <Card>
        {loading && <Spin size="small" className="spin-overlay" />}
        {imageLoaded && (
          <div className="modal-card-img">
            <Image preview={false} src={imagUrl} className="modalImg"></Image>
          </div>
        )}
        {!imageLoaded && (
          <div className="modal-card-img">
            <Image
              src={imagUrl}
              style={{ display: "none" }}
              onLoad={handleImageLoad}
              onError={handleImageLoad}
            ></Image>
          </div>
        )}
      </Card>

      {showDownload && (
        <Button
          type="primary"
          className="docudownloadBtn my-3"
          onClick={downloadFile}
        >
          Download
        </Button>
      )}
    </Modal>
  );
};

export default ImagePreviewModal;
