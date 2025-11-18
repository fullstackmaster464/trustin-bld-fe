import { Document, Page } from 'react-pdf';
import { EyeOutlined } from '@ant-design/icons';

interface PDFPreviewProps {
    url: string;
    onPreviewClick: (url: string) => void; 
}

const PDFPreviewIcon: React.FC<PDFPreviewProps> = ({ url, onPreviewClick }) => {
  return (
    <div
      className="admin-panel-pdf-preview pdf-preview-container"
      onClick={() => onPreviewClick(url)}
    >
        <Document 
            file={url} 
            externalLinkRel="_blank"
            onLoadError={(error) => {
                console.error('Error loading PDF:', error);
            }}
        >
            <Page pageNumber={1} width={175} />
        </Document>
        <div className="hover-overlay">
            <div>
            <div className="center">
                <EyeOutlined style={{ fontSize: '28px', color: '#FFFFFF', fontWeight: '400' }} />
            </div>
            <div>
                <span className="hover-preview-text" style={{ color: '#FFFFFF', fontWeight: '600' }}>
                Preview
                </span>
            </div>
            </div>
        </div>
    </div>
  );
};

export default PDFPreviewIcon;
