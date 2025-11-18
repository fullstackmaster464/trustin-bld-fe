import { useCallback, useEffect, useState } from 'react'
import {  Button, Form, Image, Input, Modal } from "antd";
import { Document, Page, pdfjs } from 'react-pdf';
import { MainButtonRound} from '../ui-elements/ButtonRepo';
import { UpdateFileStatus, emailAfterRejectDoc, emailAfterVerifyDoc } from '../../services/transaction';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteSignFile } from '../../services/user';
import Warning from "../../assets/img/warningicon.svg";
// import Alerts from '../utilities/Alert';
const { TextArea } = Input;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const VerifyModel = (props:any) :any=> {
   const { isverifyVisible, setverifyVisible, imageData, _getPaymentDetails, docForEmail, stateData, buttonRequired,setDocDeleteSuccess,isVerified,isDeletes} = props
   const [showRejectReason, setShowRejectReason] = useState(false);
   const { contractId } = useParams();
   const [numPages, setNumPages] = useState<any>(null);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [load,setload] = useState(false);
   const navigate = useNavigate();
    const { state } = useLocation();

   const onDocumentLoadSuccess = (numPages:any) => {
        setNumPages(numPages);
    }
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 24 },
    };
    const handleApprove = async () => {
        setload(true)
        const obj = {
            TxnId: imageData.txn_ID,
            imageKey: imageData.key_d,
            imageID: imageData.id,
            status: 'VERIFIED',
            userAlias: stateData.userAlias,
            userType: stateData.userType,
            docName: docForEmail
        };

        const resp = await UpdateFileStatus(obj);


        if (resp.status === 200 || resp.status === 201) {
            setverifyVisible(false);
            _getPaymentDetails();
            setload(false)
        } else{
            setload(false)
        }
        await emailAfterVerifyDoc(contractId, docForEmail, stateData.userType);
    };

    const handleReject = async (reason:any) => {
        const obj = {
            TxnId: imageData.txn_ID,
            imageKey: imageData.key_d,
            imageID: imageData.id,
            status: 'REJECTED',
            userAlias: stateData.userAlias,
            userType: stateData.userType,
            reason: reason,
            docName : docForEmail
        };

        const resp = await UpdateFileStatus(obj);
        setverifyVisible(false);
        setShowRejectReason(false);

        if (resp.status === 200 || resp.status === 201) {
            setverifyVisible(false);
            _getPaymentDetails();
        }
        await emailAfterRejectDoc(contractId, docForEmail, reason, stateData.userType);
    };

    const onFinish = (values:any) => {
        handleReject(values?.rejectReason);
    };

    const handleCancel = () => {
      setverifyVisible(!isverifyVisible);
      setShowRejectReason(false);
      handleCloseModalTriggerButton();
    };

    const updateLocationState = useCallback(
      (newState: Partial<typeof state>) => {
        navigate(".", {
          replace: true,
          state: {
            ...(state || {}),
            ...newState,
          },
        });
      },
      [navigate, state]
    );

    // Modal close handler
    const handleCloseModalTriggerButton = () => {
      updateLocationState({ triggerButton: false });
    };

    useEffect(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;
    })
    const fileName = imageData?.img_Url
    const ext = fileName?.split('.').pop();
    const changePage = (offset:any) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    const previousPage = () => {
        changePage(-1);
    }

    const nextPage = () => {
        changePage(1);
    }
    const DeleteDoc = (id:any) =>{
        setload(true)
       deleteSignFile({fileID:id}).then(()=>{
        setload(false)
        _getPaymentDetails();
        setverifyVisible(false)
        setDocDeleteSuccess(true)
        
       }).catch((err:any)=>{
         if(err)
            setload(false)
          console.log(err)
       })
      }
   return (
    <div>
      <Modal
            className='preview-box center'
            width={500}
            destroyOnClose={true}
            onCancel={() => handleCancel()}
            open={isverifyVisible}
            footer={false}
        >
            {
                ['png','jpg','jpeg'].includes(ext) ?
                <>
                {!isDeletes && (
                  <div>
                    <Image 
                      preview={true} 
                      src={imageData.img_Url} 
                      className="mt-3 modalImg w-100 responsive-image" 
                    />
                  </div>
                )}
                {isDeletes && !isVerified && (
                    <div>
                  <div className="modal-title">
                  <div className="warning-icon center mt-4">
                        <Image
                            src={Warning}
                            alt="Warning"
                            preview={false}
                            height={68}
                            width={75}
                        />
                        </div>

                    <div className="warning-text center bold">Warning!</div>
                    <p className="sub-text fw-400 center mx-5">
                    Are you sure you want to delete this ID Proof?
                    </p>
                    </div>
                                
                  <div className='d-flex justify-content-center gap-3'>
                    <Button
                      className="modal-button my-4"
                      htmlType="button" 
                      onClick={() => { DeleteDoc(imageData.id); }}
                    >
                      Delete
                    </Button>
                    <Button
                      className="outline-button my-4"
                      htmlType="button" 
                      onClick={() => { handleCancel(); }}
                    >
                      Cancel
                    </Button>
                  </div>
                  </div>
                )}
                </>
                    : <>
                        <Document file={imageData.img_Url} onLoadSuccess={onDocumentLoadSuccess} externalLinkRel="_blank" >
                            <Page pageNumber={pageNumber} />
                        </Document>
                        <div className='d-flex justify-content-center mt-3'>
                        {Number(numPages?._pdfInfo?.numPages) > 1 && (
                            <>
                                <Button children="Previous"  onClick={previousPage} className="modal-button w-45 me-3" disabled={Number(pageNumber) <= 1} />
                                <Button children="Next" disabled={Number(pageNumber) >= Number(numPages?._pdfInfo?.numPages)} onClick={nextPage} className="modal-button w-45 me-3" />
                            </>
                        )}
                            {!isVerified ? 
                        <Button className="modal-button"htmlType="submit" onClick={() => { DeleteDoc(imageData.id);}}>Delete</Button> 
                        : ""}
                        </div>                        
                    </>
            }
            <Form onFinish={onFinish} form={form} {...layout} className={`w-100 ${buttonRequired}`} >
                {
                    showRejectReason &&
                    <Form.Item
                        labelCol={{ span: 24 }}
                        name="rejectReason"
                        label="Please enter reason for rejection"
                        className={`inputField w-100 rejectError invoice-input ${buttonRequired}`}
                        rules={[
                            { required: true, message: "Please enter reason for rejection!" }
                        ]}
                    >
                        <TextArea rows={3} className="w-100" placeholder='Type your reason here...' />
                    </Form.Item>
                }
                {
                    showRejectReason ?
                        <div className='text-center mt-5' >
                        <MainButtonRound key="submit" htmlType="submit" children="Submit" /></div> :
                        <div className={`d-flex justify-content-center mt-4  ${buttonRequired}`}>
                            <Button
                                key="submit"
                                type="primary"
                                onClick={() => setShowRejectReason(true)}
                                children="Reject"
                                className='modal-button-cancel  mx-2 me-3'
                            />
                            <Button
                                key="accept"
                                type="primary"
                                onClick={() => handleApprove()}
                                children="Approve"
                                className='modal-button'
                                loading={load}
                            />
                        </div>
                }
            </Form>
        </Modal>
    </div>
  )
}

export default VerifyModel
