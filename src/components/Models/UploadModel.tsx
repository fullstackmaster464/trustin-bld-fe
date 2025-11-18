import {useState} from 'react'
import { useParams } from 'react-router';
import { Modal, Spin, Upload, message,Image, Button} from "antd";
import { MainTitle, SmallText } from '../ui-elements/TextRepo';
import { LoadingOutlined } from "@ant-design/icons";
import { emailAfterUploadDoc, updatetransactionId } from '../../services/transaction';
import {acceptedFileExtension, beforeUploadFile, getLocalStorage} from '../Common/Constants'
import uploadimg from '../../assets/img/upload.svg'
import { Document, Page } from 'react-pdf';
import { deleteSignFile } from '../../services/user';
const { Dragger } = Upload;
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const UploadModel = (props : any) => {
    const state = JSON.parse(getLocalStorage("auth")!)
    const { isModalVisible, setisModalVisible, transactionId, getPaymentDetails, docForEmail }=props
    const { contractId } = useParams();
    const distributeGrid = [{ lg: 8, md: 24, xs: 24 }, { className: 'p-lg-5 p-md-4 p-3' }];
    const [loader, setLoader] = useState(false);
    const [btnloader, setBtnLoader] = useState(false);
    const [Info,setInfo] = useState<any>();
    const [uploadError,setUploadError] = useState<any>("")
    const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    message.config({
        duration:5,
    })
    const submitUpload = () =>{
        if(uploadError){
            return false
        }
        else{
        setBtnLoader(true)
        message.success(`${Info.file.name} file uploaded successfully.`);
        updateTransaction()
        localStorage.setItem('fileUpload', "true");
        emailAfterAddDoc(contractId, docForEmail);
        setInfo(undefined)
        }
    }

    const handleCancel = async() => {
        setisModalVisible(false);
        setBtnLoader(false);
        setUploadError("");
        await deleteDoc(Info?.file?.response?.id);
        setInfo(undefined)
      
    }

    const data = {
        name: 'file',
        headers: {
            authorization: `Bearer ${state.token}`
        },
        action: BASE_URL + '/api/v1/uploads/addDocument/' + transactionId,
        beforeUpload: (file: any) => {
        setLoader(true); const checkBeforeUpload = beforeUploadFile(file, "")
        if(checkBeforeUpload == true){
        setLoader(true);
        setUploadError("");
        }
        else{
          setLoader(false);
          setUploadError(checkBeforeUpload);
          return false;
        }
        },
        onChange(info:any) {
            const { status } = info.file;
            if (status !== 'uploading') {
                setLoader(false)
            }
            if (status === 'done') {
                setInfo(info);
                setLoader(false)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
                setLoader(false)
            }
        },
        onDrop(_e:any) {
        }
    };
    const updateTransaction = async () => {
        try {
            const obj = {
                'txnid': transactionId
            }
            const response = await updatetransactionId(obj);
            if (response) {
                setisModalVisible(false);
                getPaymentDetails();
                setBtnLoader(false);
            }
        } catch (err) {
            setisModalVisible(false);
        }
    }

    const emailAfterAddDoc = async (contractId:any, docForEmail:any) => {
        try {
         await emailAfterUploadDoc(contractId, docForEmail);
        } catch (err) {
            setisModalVisible(false);
        }
    }

    const deleteDoc = async (id: any) => {
        setLoader(true)
        deleteSignFile({ fileID: id }).then(() => {
            setLoader(false)
            setInfo("")
        }).catch((err: any) => {
            if (err)
                setLoader(false)
        })
    }

  return (
    <div>
      <Modal className='modal-box' destroyOnClose={true} open={isModalVisible} footer={false} onCancel={() => setisModalVisible(false)} width={380}>
              <div  {...distributeGrid} >
                  <MainTitle children='Upload Attachment ' className='fs-6' />
                  <Dragger {...data} className="mb-4" maxCount={1} accept={acceptedFileExtension}>
                      {!loader && (Info === undefined ||  typeof Info == 'string') ? <>
                          <Image src={uploadimg} preview={false} alt="upload-doc" style={{ width: '40px' }} />
                          <SmallText children='Browse Files from your device Acceptable formats - pdf, jpg, jpeg, png ( file upto 5mb )' className='px-5 py-3' />
                      </>
                          : loader ? <Spin indicator={Loader} className="ml-20" /> :
                              Info?.file?.response?.url.includes(".pdf") ? <Document
                                  file={Info?.file?.response?.url}
                                  externalLinkRel="_blank"
                              >
                                  <Page pageNumber={1} />
                              </Document>
                                  :
                                  <Image src={Info?.file?.response?.url} preview={false} alt="upload-doc" height={200} />
                      }
                  </Dragger>
                  <div className='errMsg mt-1'>{uploadError ? uploadError : ""}</div>
              </div>
            <div className="ant-modal-footer modalFooter center mt-4">
            <Button
              key="cancel"
              className="modal-button-cancel"
              style={{width: "140px"}}
              onClick={()=>handleCancel()}
              loading={btnloader}
            >
              Cancel
            </Button>
            <Button loading={btnloader}  htmlType="submit" type="primary" 
            className={Info === undefined ? "modal-button disabled" : "modal-button"}
             onClick={()=>submitUpload()}
             disabled={Info === undefined || uploadError}
             >
              Submit
            </Button>
		</div>
        </Modal>
    </div>
  )
}

export default UploadModel
