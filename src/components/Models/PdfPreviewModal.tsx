import { Button, Modal, Spin } from 'antd';
import  { useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
interface PdfPreviewModalProps {
       isverifyVisible: boolean;
       setverifyVisible: any;
       imagUrl: string;
       setImagUrl: (url: string) => void;
    }
const PdfPreviewModal = ({isverifyVisible,setverifyVisible,imagUrl,setImagUrl}: PdfPreviewModalProps) => {
    const [numPages, setNumPages] = useState<any>(null);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [loading, setLoading] = useState<boolean>(true);
   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {    
    setNumPages(numPages);
    setLoading(false)
}

const onDocumentLoadError = (error: any) => {
    error && setLoading(false); 
};

useEffect(() => {
    setLoading(true);
}, [isverifyVisible]);

const handleCancel = () => {
    setverifyVisible((prevState:any)=>{!prevState});
    setImagUrl("")
};

useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
},[])
const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
}

const previousPage = () => {
    setLoading(true)
    changePage(-1);
}

const scale = window.devicePixelRatio > 1 ? 1 : 1.2;

const nextPage = () => {
    setLoading(true)
    changePage(1);
}

  return (
    <div>
        <Modal
            className='modal-box'
            width={500}
            destroyOnClose={true}
            onCancel={() => handleCancel()}
            open={isverifyVisible}
            footer={false}
        >
            {loading == true && <Spin size="small" className="center" />} 
            <Document 
                file={imagUrl} 
                onLoadSuccess={onDocumentLoadSuccess} 
                externalLinkRel="_blank" 
                onLoadError={onDocumentLoadError}
                loading=""
            >
                <Page pageNumber={pageNumber} scale={scale} onRenderSuccess={()=>setLoading(false)} />
            </Document>
            {Number(numPages) > 1 && <div className='d-flex justify-content-center mt-3'>
                <Button children="Previous"  onClick={previousPage} className="modal-button w-45 me-3" disabled={Number(pageNumber) <= 1} />
                <Button children="Next" disabled={Number(pageNumber) >= Number(numPages)} onClick={nextPage} className="modal-button w-45" />   
            </div>}
        </Modal>
    </div>
  )
}

export default PdfPreviewModal
