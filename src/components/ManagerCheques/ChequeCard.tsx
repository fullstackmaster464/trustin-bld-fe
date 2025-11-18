import {
    Button,
    Card,
    Col,
    Image,
    Modal,
    Row,
    Input,
    Form,
    Popover,
    Tooltip,
    message,
    UploadProps,
    Upload,
    Spin,
} from "antd";
import Doc_large from "../../assets/img/Doc_large.svg";
import UserHalf from "../../assets/img/userHalf.svg";
import Cheque from "../../assets/img/Cheque.svg";
import CommentImg from "../../assets/img/Comment.svg";
import Itemdelete from "../../assets/img/ItemDeleteIcon.svg";
import Edit from "../../assets/img/EditIcon.svg";
import Tick from "../../assets/img/circle_orange.svg";
import Pdf from "../../assets/img/pdfview.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import PlusUpload from "../../assets/img/PlusUpload.svg";
import Delete from "../../assets/img/delete.svg";
import { useEffect, useState } from "react";
import { acceptedFileExtension, beforeUploadFile, getLocalStorage, moneyFormat } from "../Common/Constants";
import TextArea from "antd/es/input/TextArea";
import rejects from "../../assets/modals/rejected.gif"; 
import { NormalText } from "../ui-elements/TextRepo";
import { deleteSignFile } from "../../services/user";
import Dragger from "antd/es/upload/Dragger"; 
import PdfPreviewModal from "../Models/PdfPreviewModal";


const ChequeCard = (props: any): any => {
    const { formValues, invoiceCalculations, setPreparedCheques, preparedCheques , setGlobalRemainingAmount, globalRemainingAmount } = props;
 

    const [showAddChequeModal, setShowAddChequeModal] = useState(false); 
    const [selectedDetails, setSelectedDetails] = useState<any>();
    const [deletechequeModel,setDeletechequeModel] = useState(false);
    const [selectedCheque,setSelectedCheque] = useState<number>(-1);
    const [uploadedChequeFile, setUploadedChequeFile] = useState<any>(null);
    const [form] = Form.useForm();


    const [currentChequeDetail, setCurrentChequeDetail] = useState<any>({})
    const [viewChequeDetail, setViewChequeDetail] = useState(false)
    const [chequeDocumentIsLoading, setChequeDocumentIsLoading] = useState(true)
    const [imagUrl, setImagUrl] = useState<any>("");  
    const [isverifyVisible, setverifyVisible] = useState<boolean>(false); 
    const [disableBtn, setDisableBtn] = useState<boolean>(false); 
    const [loader, setLoader] = useState(false);
    const local = getLocalStorage("auth");
    const Token = local ? JSON.parse(local)?.token : "";
    const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL


    useEffect(() => {
        const textContainer:any = document.getElementById("textContainer");
        const readMoreButton:any = document.getElementById("readMoreButton");

        if (textContainer && readMoreButton && textContainer.textContent.length > 180) {
        const truncatedText = textContainer.textContent.slice(0, 180);
        textContainer.innerHTML = truncatedText;
        readMoreButton.style.display = "inline";
        }
    },[]);
 


    useEffect(() => {
        const amount = parseFloat(invoiceCalculations?.sellerAmount) || 0;
        setGlobalRemainingAmount(amount);
            if(preparedCheques.length){
                const preparedAmount = preparedCheques.reduce((sum:number, cheque:any) => sum + Number(cheque.amount), 0);
                const remainingAmount = amount - preparedAmount;
                setGlobalRemainingAmount(remainingAmount);
            } 
    }, [invoiceCalculations]);

                        // chequeAlias :  chequeId,
                        // chequeNumber : cheque?.chequeNumber,
                        // buyerRequested : true,
                        // referenceNumber : cheque?.referenceNumber,
                        // beneficiaryName : cheque?.beneficiaryName,
                        // amount : cheque?.amount,
                        // document : cheque?.cheque?.id,
                        // comment : cheque?.comment

    const EditChequeItem = (cheque : any , i: number) => {
        setSelectedDetails(i);
        setShowAddChequeModal(true);
        form.setFieldsValue({
            amount: cheque.amount,
            comment: cheque.comment,
            beneficiaryName: cheque.beneficiaryName,
            referenceNumber: cheque.referenceNumber,
            chequeNumber: cheque.chequeNumber,
            buyerRequested : true
        });
        setUploadedChequeFile(cheque.cheque);
        
    }


    const uploadProps: UploadProps = {
        name: "file",
        headers: { authorization: `Bearer ${Token}` },
        action: `${REACT_APP_SERVER_URL}/api/v1/contracts/uploadSignature`,
        accept: acceptedFileExtension,
        beforeUpload: (file) => {
          const validationResult = beforeUploadFile(file, "");
          if (validationResult === true) {
            setDisableBtn(true);
            setLoader(true);
            return true;
          }
          message.error(validationResult);
          return Upload.LIST_IGNORE;
        },
        onChange: (info) => {
          const { status, response } = info.file;
          if (status === 'done') {
            setUploadedChequeFile(response);
            setDisableBtn(false);
            setLoader(false);
          } else if (status === 'error') {
            setLoader(false);
            setDisableBtn(false);
            message.error(`${info.file.name} file upload failed.`);
          }
        }
      }
    
    
    
      const deleteDocument = (fileID: number) => {
        setLoader(true)
        setDisableBtn(true);
        deleteSignFile({ fileID })
          .then(() => {
            setUploadedChequeFile(null)
          })
          .catch(() => message.error('Error deleting file'))
          .finally(() => {
            setDisableBtn(false)
            setLoader(false)
          })
      }

    const preRemoveChequeItem = (i :number ) => {
        setDeletechequeModel(true);
        setSelectedCheque(i);
    }

    const removeChequeItem = () => {
        const filteredData =  preparedCheques.filter((_:any, index: number) => index !== selectedCheque);
        const amount = parseFloat(invoiceCalculations?.sellerAmount) || 0;
        setPreparedCheques(filteredData);
        if(filteredData.length){
            const preparedAmount = filteredData.map((a:any)=> Number(a.amount)).reduce((a:number,b:number)=> a+b);
            setGlobalRemainingAmount(amount - preparedAmount);
        } else {
            setGlobalRemainingAmount(amount);
        }
        setDeletechequeModel(false);
        setSelectedCheque(-1);
    }

    const onSaveCheque = async (value: any) => {
        if(formValues?.transactionType === "RECEIVE"){
            if(!uploadedChequeFile){
                message.warning("Please upload cheque document.");
                return;
            }
        }

        const amount = Number(value.amount);
        let totalAmount = 0;
        const sellerAmount = parseFloat(invoiceCalculations?.sellerAmount) || 0;
        if(selectedDetails == null){
            const subPreparedCheque : any[] = [...preparedCheques];
            subPreparedCheque.push({
                amount: amount,
                comment: value.comment,
                beneficiaryName: value.beneficiaryName,
                referenceNumber: value.referenceNumber,
                chequeNumber: value.chequeNumber,
                cheque: uploadedChequeFile,
                buyerRequested : true
            });
            totalAmount = subPreparedCheque.reduce((acc :any, cheque :any) => acc + cheque.amount, 0);
            if((sellerAmount- totalAmount) < 0){
                message.warning("Incorrect remaining amount");
                return;
            }
            setPreparedCheques(subPreparedCheque);
            setGlobalRemainingAmount((prev:number) => Math.round((prev - amount) * 100) / 100);
        } else {
            const originalAmount = preparedCheques[selectedDetails].amount;
            const subPreparedCheque : any[] = [...preparedCheques];
            subPreparedCheque[selectedDetails] = {
                ...subPreparedCheque[selectedDetails],
                amount: amount,
                comment: value.comment,
                beneficiaryName: value.beneficiaryName,
                referenceNumber: value.referenceNumber,
                chequeNumber: value.chequeNumber,
                cheque: uploadedChequeFile,
            };
            totalAmount = subPreparedCheque.reduce((acc :any, cheque :any) => acc + cheque.amount, 0);
            if((sellerAmount- totalAmount) < 0){
                message.warning("Incorrect remaining amount");
                return;
            }
            setPreparedCheques(subPreparedCheque);
            setGlobalRemainingAmount((prev:number) => Math.round((prev + originalAmount - amount) * 100) / 100);
            setSelectedDetails(null);
        }
        setShowAddChequeModal(false); 
        setUploadedChequeFile(null);
        form.resetFields();
    }

    const CustomTooltip = ({
        text = "",
        maxLength = 75,
        overlayClassName = "",
      }) => {
        const truncatedText =
          text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
      
        return (
          <Tooltip title={text} overlayClassName={overlayClassName}>
            <span className="Status">{truncatedText}</span>
          </Tooltip>
        );
      };

    return (
        <>
            <div className="mt-4">
                <>
                    <div className="stepDetails mt-3 d-flex justify-content-between align-items-center flex-wrap gap-3">
                      <div className="stepDetails titleText mb-2 mt-3 ">
                        <span className="stepDetails mb-2 mt-3">Cheques details</span>
                        <span className="stepDetails_medium_sub titleText"> (Optional)</span>
                      </div>
                    </div>
                    <div className="cheque-grid">
                   
                        {
                         preparedCheques.length ?
                         preparedCheques.map((cheque: any, index: any) => (
                            <Card key={cheque.id} className="afterApproveCard cheque-card min-height-300" title={
                                <div className="end-to-end">
                                    <span>Cheque {index+1} </span>
                                    <div className="cheque-card-action-div">
                                    <Image
                                            src={Edit}
                                            alt="edit"
                                            preview={false}
                                            className="cheque-card-action-item"
                                            onClick={() => EditChequeItem(cheque,index)}
                                        />
                                        <Image
                                            src={Itemdelete}
                                            alt="delete"
                                            preview={false}
                                            className="cheque-card-action-item"
                                            onClick={() => preRemoveChequeItem(index)}
                                        />
                                    </div>
                                </div>
                            }>
                                <div className="cheque-details">
                                    <div className="detail-row">
                                        <Popover
                                            content="Beneficiary Name"
                                            placement="topLeft"
                                            overlayClassName="info-popover">
                                            <Image
                                                src={UserHalf}
                                                alt="user"
                                                preview={false}
                                                className="px-1 min-width-25"
                                            />
                                        </Popover>
                                        <span className="stepDetails_sub mb-2 mx-1 mt-1">{cheque.beneficiaryName}</span>
                                    </div>

                                    <div className="detail-row">
                                        <Popover
                                            content="Cheque Amount"
                                            placement="topLeft"
                                            overlayClassName="info-popover"
                                        >
                                            <Image
                                                src={Cheque}
                                                alt="cheque"
                                                preview={false}
                                                className="px-1 min-width-25"
                                            />
                                        </Popover>
                                        <span className="stepDetails_sub mb-2 mx-1 mt-1">{moneyFormat(formValues?.currency, cheque.amount)}</span>
                                    </div>

                                    <div className="detail-row">
                                    <Image
                                        src={CommentImg}
                                        alt="company"
                                        preview={false}
                                        className="px-1 min-width-25"
                                    />
                                    <div className="stepDetails_sub mx-1">
                                        <span id="textContainer" className="ellipsis-text"> 
                                        <CustomTooltip
                                            text={cheque.comment ?? "--"}
                                            maxLength={75}
                                            overlayClassName="custom-tooltip custom-tooltip-inner"
                                        />
                                        </span>
                                        <span id="readMoreButton" style={{ display: "none" }}>
                                        {" "}
                                        <Popover
                                            placement="top"
                                            className="commentPopover cursor"
                                            content={cheque.comment ?? "--"}
                                            trigger="click"
                                        >
                                            ... Read more
                                        </Popover>
                                        </span>
                                    </div>
                                    </div>
                                </div>
                            </Card>
                        )) : null }

                    
                            <div className="add-cheque-content" onClick={() => setShowAddChequeModal(true)}>
                            <Image
                                    src={Doc_large}
                                    alt="No cheques"
                                    preview={false}
                                    style={{ width: 64, height: 64, opacity: 0.5 }}
                                />
                                 <div className="add-cheques-text">
                                 Add Cheque
                                </div>
                            </div>
                     
                    </div>
                </>

            </div>
            { formValues?.currency && globalRemainingAmount ?
            <div className="d-flex justify-content-between align-items-center mt-4 mb-2 flex-wrap gap-3">
                <div className="remaining-amount">
                    <span className="stepDetails_medium_sub">Remaining amount: </span>
                    <span className={`${globalRemainingAmount >= 0 ? 'subText_small fw-400' : 'text-danger'}`}>
                        {moneyFormat(
                            formValues?.currency,
                            globalRemainingAmount.toFixed(2)
                        )}
                    </span>
                </div>
            </div> : '' 
            }
            



            {/* Add Cheque Modal */}
            <Modal
                title={
                    <span className="change-client-classification">
                        {!selectedDetails ?  "New" : "Edit" } Cheque
                        <hr className="lightgrayHr" />
                    </span>
                }
                open={showAddChequeModal}
                onCancel={() => {
                    setShowAddChequeModal(false);
                    form.resetFields();
                }}
                footer={false}
                width={formValues?.transactionType == "RECEIVE" ? 800 : 500}
                centered
                className="modal-box"
            >
                <Form
                    form={form}
                    onFinish={(values) => {
                        onSaveCheque(values);
                    }}
                >
                     <Row gutter={16} className="mt-3">
                         <Col xs={24} sm={formValues?.transactionType == "RECEIVE" ? 12 : 24}>
                            <p className="add-cheque-category">Beneficiary Name <span className="red">*</span></p>
                            <Form.Item
                                name="beneficiaryName"
                                className="inputField w-100 error-input"
                                rules={[{ required: true, message: 'Please enter beneficiary name' }]}>
                                <Input placeholder="Enter beneficiary name" />
                            </Form.Item>
                        </Col>

                         <Col xs={24} sm={formValues?.transactionType == "RECEIVE" ? 12 : 24}>
                            <p className="add-cheque-category">Amount <span className="red">*</span></p>
                            <Form.Item
                                name="amount"
                                className="inputField w-100 error-input"
                                rules={[
                                    { required: true, message: 'Please enter amount' },
                                    {
                                        validator: (_, value) => {
                                            if (value && value <= 0) {
                                                return Promise.reject('Amount must be greater than 0');
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    suffix={
                                        <span className="custom-suffix">
                                            {formValues?.currency}
                                        </span>
                                    }
                                />
                            </Form.Item>
                        </Col>

                    { formValues?.transactionType == "RECEIVE" ? 
                               <>
                                <Col xs={24} sm={12}>
                                    <p className="add-cheque-category">Reference Number <span className="red">*</span></p>
                                    <Form.Item
                                    name="referenceNumber"
                                    className="inputField w-100 error-input"
                                      rules={[
                                        { required: true, message: 'Please enter Reference Number ' },
                                    ]}>
                                    <Input placeholder="Enter reference number" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <p className="add-cheque-category">Cheque Number</p>
                                    <Form.Item
                                    name="chequeNumber"
                                    className="inputField w-100 error-input">
                                    <Input placeholder="Enter cheque number" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <p className="add-cheque-category">Upload cheque document <span className="red">*</span></p>
                                    <div className="mangercheque-doc-block">
                                    <div className="d-flex moa-doc-list flex-column" style={{ "width": "158px" }}>
                                        {uploadedChequeFile ? (
                                        <ul className="moa-doc-list-ul mb-0 ">
                                            <li className="moa-document-image-block subText_xs">
                                            <div>
                                                <div className="endtoend mt-3">
                                                <Image
                                                    src={Tick}
                                                    alt="circle"
                                                    className="tick_upload"
                                                    preview={false}
                                                />
                                                </div>
                                                <div style={{ marginTop: -12 }}>
                                                <Image src={Doc_large} alt="document" preview={false} />
                                                <div className="mt-3 subText_xs overflowText_twoLines w-upload">
                                                    {uploadedChequeFile.inputfileid || "Document"}
                                                </div>
                                                </div>
                                            </div>
                                            </li>
                                            <div className="d-flex moa-doc-list document-actions">
                                            <div 
                                                className="blue_text cursor" 
                                                onClick={() => {
                                                if(uploadedChequeFile.url.includes('.pdf')){
                                                    setImagUrl(uploadedChequeFile?.url);
                                                    setverifyVisible(true)
                                                }else{
                                                    setCurrentChequeDetail(uploadedChequeFile);
                                                    setViewChequeDetail(true);  
                                                }
                                                }}
                                            >
                                                <Image 
                                                preview={false} 
                                                src={uploadedChequeFile.url.includes('.pdf') ? Pdf : BlueEye} 
                                                alt="view" 
                                                />
                                                <span className="px-1">View</span>
                                            </div>
                                            <div 
                                                className="delete-action cursor" 
                                                onClick={() => {
                                                if (!loader) {
                                                    deleteDocument(uploadedChequeFile.id)
                                                }
                                                }}
                                            >
                                                <Image
                                                src={Delete}
                                                alt="Delete"
                                                preview={false}
                                                className="cursor"
                                                />
                                            </div>
                                            </div>
                                        </ul>
                                        ) : (
                                        <Dragger
                                            {...uploadProps}
                                            className="moa-document d-block"
                                        >
                                            <div >
                                            <Image src={PlusUpload} alt="passport" preview={false} />
                                            <div>
                                                Cheque
                                            </div>
                                            </div>
                                        </Dragger>
                                        )}
                                    </div>
                                    </div>
                                </Col>
                                </>
                                : null

                        }

                         <Col xs={24} sm={formValues?.transactionType == "RECEIVE" ? 12 : 24}>
                            <p className="add-cheque-category">Comment </p>
                            <Form.Item
                                name="comment"
                                className="inputField w-100 error-input commentError"
                                rules={[
                                    {
                                        min: 20,
                                        message: "Please enter minimum 20 characters"
                                    },
                                    {
                                        max: 500,
                                        message: "Comment cannot exceed 500 characters"
                                    }
                                ]}
                            >
                                <TextArea rows={3} placeholder="Enter comment" />
                            </Form.Item>
                        </Col>


                        <Col span={24}>
                            <div className="d-flex justify-content-end mt-4">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="modal-button"
                                    disabled={disableBtn}
                                    loading={disableBtn}
                                >
                                    Add Cheque
                                </Button>
                                <Button
                                    key="cancel"
                                    className="modal-button-cancel mx-2"
                                    onClick={() => {
                                        setShowAddChequeModal(false);
                                        form.resetFields();
                                        setSelectedDetails(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Modal>



                {/* delete confirmation modal */}
                <Modal
                    title={<p className="large-title">Delete prepared cheque </p>}
                    width={500}
                    centered
                    open={deletechequeModel}
                    footer={false}
                    closable={false}
                    className="modal-box text-center"
                    onCancel={() => setDeletechequeModel(false)}>
                    <div>
                    <Image src={rejects} alt="" width={"100px"} height={"100px"} preview={false}/>
                        <div className="modal-content-margin">
                        <NormalText 
                            className="mb-5">
                            {`Do you want to delete prepared cheque ?`} 
                        </NormalText>
                            </div>
                            <div className="ant-modal-footer modalFooter center">
                                <Button onClick={() => { removeChequeItem() }} type="primary" className="modal-button">
                                Yes 
                                </Button>
                            <Button
                                key="cancel"
                                className="modal-button-cancel"
                                onClick={() => {
                                    setDeletechequeModel(false);
                                }}
                                >
                                No
                                </Button>
                            </div>
                    </div>
                    </Modal>

    <Modal
        open={viewChequeDetail}
        footer={false}
        className="modal-box"
        title={
            <span className="change-client-classification">
            Cheque preview
            <hr className="lightgrayHr" />
            </span>
        }
        centered
        width={520}
        onCancel={() => {
            setChequeDocumentIsLoading(false)
            setViewChequeDetail(false)
        }}
        >
        <div className="text-center">
        {chequeDocumentIsLoading && <Spin size="small" className="spin-overlay"/>} 
            {(currentChequeDetail.url || "").includes(".pdf") ? (
            <>
            <PdfPreviewModal
                isverifyVisible={isverifyVisible}
                setverifyVisible={setverifyVisible}
                imagUrl={imagUrl}
                setImagUrl={setImagUrl}
            />
            </>
            ) : (
            <Image
                src={currentChequeDetail.url}
                preview={true}
                alt="preview"
                className="max-h-460 my-3"
                onLoad={() => setChequeDocumentIsLoading(false)} 
            />
            )}
        </div>
        {/* <Button type="primary" className="docudownloadBtn" onClick={() =>{downloadFile()}}>Download</Button> */}
        </Modal>


        </>);
}

export default ChequeCard;