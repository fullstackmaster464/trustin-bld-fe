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
import { useEffect, useMemo, useState } from "react";
import { acceptedFileExtension, beforeUploadFile, getLocalStorage, moneyFormat } from "../Common/Constants";
import TextArea from "antd/es/input/TextArea";
import rejects from "../../assets/modals/rejected.gif"; 
import { NormalText } from "../ui-elements/TextRepo";
import { deleteCheque, insertCheque, updateChequeDetail } from "../../services/cheque";
import { deleteSignFile } from "../../services/user";
import Dragger from "antd/es/upload/Dragger";
import PdfPreviewModal from "../Models/PdfPreviewModal";


const ChequeDetailCard = (props: any): any => {
    const { chequeDetail , getChequeDetail } = props;

    const [showAddChequeModal, setShowAddChequeModal] = useState(false); 
    const [deletechequeModel,setDeletechequeModel] = useState(false);
    const [disableBtn,setDisableBtn] = useState(false);
        
    const [uploadedChequeFile, setUploadedChequeFile] = useState<any>(null);
    const [imagUrl, setImagUrl] = useState<any>("");  
    const [isverifyVisible, setverifyVisible] = useState<boolean>(false); 
    const [currentChequeDetail, setCurrentChequeDetail] = useState<any>({})
    const [viewChequeDetail, setViewChequeDetail] = useState(false)
    const [chequeDocumentIsLoading, setChequeDocumentIsLoading] = useState(true)
    const [loader, setLoader] = useState(false);
    
    const [form] = Form.useForm();

    const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;

    
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

    const remainingAmount = useMemo(() => {
        
            if(chequeDetail.chequeDetails.length){
                const chequeAmounts = chequeDetail.chequeDetails.map((cheque :any) => Number(cheque.amount)).reduce((acc:number, res:number) => acc + res, 0)
                return Number(chequeDetail.sellerAmount) - chequeAmounts;
            }
            return Number(chequeDetail.sellerAmount);
        },[chequeDetail.chequeDetails, chequeDetail.sellerAmount]
    );
 
    // useEffect(() => {
    //     const amount = parseFloat(invoiceCalculations?.sellerAmount) || 0;
    //     setGlobalRemainingAmount(amount);
    //         if(preparedCheques.length){
    //             const preparedAmount = preparedCheques.reduce((sum:number, cheque:any) => sum + Number(cheque.amount), 0);
    //             const remainingAmount = amount - preparedAmount;
    //             setGlobalRemainingAmount(remainingAmount);
    //         } 
    // }, [invoiceCalculations]);

   // BeneficiaryName special character validations
    const validateBeneficiaryName = (value: any) => {
    if (!value || value.trim() === "") {
        return Promise.reject(new Error("Please enter beneficiary name"));
    }
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
        return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    if (value.length < 3) {
        return Promise.reject(new Error("Beneficiary name must be at least 3 characters"));
    }
    if (value.length > 255) {
        return Promise.reject(new Error("Beneficiary name cannot exceed 255 characters"));
    }
    return Promise.resolve();
    };

    // comments special characters validations
    const validatePopupCommentFields = (value: any) => {
    if (!value || value.trim() === '') {
      return Promise.reject(new Error("Please add some comment!"));
    }
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
      return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    if (value.length < 20) {
      return Promise.reject(new Error("Please enter minimum 20 characters"));
    }
     if (value.length > 500) {
    return Promise.reject(new Error("Comment cannot exceed 500 characters"));
    }
    return Promise.resolve();
    };

    const editChequeItem = (cheque : any) => {
        
        
        form.setFieldsValue({
            id: cheque.id,
            amount: cheque.amount,
            comment: cheque.comment,
            beneficiaryName: cheque.beneficiaryName,
            referenceNumber: cheque.referenceNumber,
            chequeNumber: cheque.chequeNumber,
            buyerRequested : true
        });
        setUploadedChequeFile(cheque.document);
        setShowAddChequeModal(true);
    }


    const preRemoveChequeItem = (cheque : any) => {
        setDeletechequeModel(true);
        form.setFieldsValue({ id: cheque.id });
    }

    const removeChequeItem = () => {
        const id  = form.getFieldValue("id");
         
        setDisableBtn(true);
        deleteCheque(id).then((response)=> {
            console.log("response ",response);
            setDeletechequeModel(false);
            getChequeDetail();
            form.resetFields();
        }).catch((error) => {
            console.log('error', error)
            setDeletechequeModel(false);
            setDisableBtn(false);
        })
        .finally(() => {
            setDisableBtn(false);
        })
    }

    
    const onSaveCheque = async (value: any) => {
         
        
        const payLoad = {
            beneficiaryName : value.beneficiaryName,
            amount : Number(value.amount),
            userAlias : userAlias,
            comment : value.comment,
            referenceNumber : value?.referenceNumber,
            chequeNumber : value?.chequeNumber,
            document : uploadedChequeFile ? uploadedChequeFile?.id : null,
            // buyerRequested : true,
        }
        if(value?.id){
            setDisableBtn(true);
            updateChequeDetail(value.id, payLoad).then((response)=> {
                console.log("response ",response);
                getChequeDetail();
            }).catch((error) => {
                const msg = error?.data?.error || "Something went wrong"
                message.warning(msg);
            })
            .finally(() => {
                setShowAddChequeModal(false);
                setDisableBtn(false);
                form.resetFields();
            })
        }else {
            setDisableBtn(true);
            insertCheque(chequeDetail.aliasName, payLoad).then((response)=> {
                console.log("response ",response);
                getChequeDetail();
            }).catch((error) => {
                const msg = error?.data?.error || "Something went wrong"
                message.warning(msg);
                setDisableBtn(false);
                setShowAddChequeModal(false);
            })
            .finally(() => {
                setShowAddChequeModal(false);
                setDisableBtn(false);
                form.resetFields();
            })
        }
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
            setDisableBtn(true);
            deleteSignFile({ fileID })
                .then(() => {
                    setUploadedChequeFile(null)
                })
                .catch(() => message.error('Error deleting file'))
                .finally(() => {
                    setDisableBtn(false)
                })
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
                        <span className="stepDetails mb-2 mt-3">Cheques details  </span>
                        <span className="stepDetails_medium_sub titleText"> (Optional)</span>
                      </div>
                    </div>
                    <div className="cheque-grid">
                   
                        {
                        chequeDetail?.chequeDetails?.length ?
                         chequeDetail?.chequeDetails.map((cheque: any, index: any) => (
                            <Card key={cheque.id} className="afterApproveCard cheque-card min-height-300" title={
                                <div className="end-to-end">
                                    <span>Cheque {index+1} </span>
                                    <div className="cheque-card-action-div">
                                    <Image
                                            src={Edit}
                                            alt="edit"
                                            preview={false}
                                            className="cheque-card-action-item"
                                            onClick={() => editChequeItem(cheque)}
                                        />
                                        <Image
                                            src={Itemdelete}
                                            alt="delete"
                                            preview={false}
                                            className="cheque-card-action-item"
                                            onClick={() => preRemoveChequeItem(cheque)}
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
                                        <span className="stepDetails_sub mb-2 mx-1 mt-1">{moneyFormat(chequeDetail?.currency, cheque.amount)}</span>
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

                        {
                            remainingAmount > 0 ?
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
                            </div> : null
                        }
                           
                    </div>
                </>

            </div>
            { remainingAmount ?
                <div className="d-flex justify-content-between align-items-center mt-4 mb-2 flex-wrap gap-3">
                    <div className="remaining-amount">
                        <span className="stepDetails_medium_sub">Remaining amount: </span>
                        <span className={`${remainingAmount >= 0 ? 'subText_small fw-400' : 'text-danger'}`}>
                            {moneyFormat(chequeDetail?.currency, remainingAmount)}
                        </span>
                    </div>
                </div> : '' 
            }
            



            {/* Add Cheque Modal */}
            <Modal
                title={
                    <span className="change-client-classification">
                        {!form.getFieldValue('id') ?  "New" : "Edit" } Cheque
                        <hr className="lightgrayHr" />
                    </span>
                }
                open={showAddChequeModal}
                onCancel={() => {
                    setShowAddChequeModal(false);
                    form.resetFields();
                }}
                footer={false}
                width={chequeDetail?.transactionType == "RECEIVE" ? 600 : 500}
                centered
                className="classification-modal"
            >
                <Form
                    form={form}
                    onFinish={(values) => {
                        onSaveCheque(values);
                    }}>
                    <Row gutter={16} className="mt-3">
                        <Form.Item name="id" className="d-none"> <Input type="hidden" /> </Form.Item>
                        <Col xs={24} sm={chequeDetail?.transactionType == "RECEIVE" ? 12 : 24}>
                            <p className="add-cheque-category">Beneficiary Name <span className="red">*</span></p>
                            <Form.Item
                                name="beneficiaryName"
                                className="inputField w-100 error-input"
                                // rules={[{ required: true, message: 'Please enter beneficiary name' }]}
                                 rules={[ 
                                   {
                                    validator: async (_, value) => {
                                      await validateBeneficiaryName(value);
                                      },
                                    },
                                ]}
                                >
                                <Input placeholder="Enter beneficiary name" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={chequeDetail?.transactionType == "RECEIVE" ? 12 : 24}>
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
                                            if(!form.getFieldValue('id')){
                                                if (value > remainingAmount) {
                                                    return Promise.reject('Amount is exceeding.');
                                                }
                                            } else {
                                                const id = form.getFieldValue('id')
                                                const othercheques = chequeDetail.chequeDetails.filter((cheque :any)=>cheque.id != id)
                                                
                                                const sellerAmount = Number(chequeDetail?.sellerAmount)
                                                if(othercheques.length){
                                                    const amount = othercheques.map((cheque :any) => Number(cheque.amount)).reduce((acc:number, res:number) => acc + res, 0)
                                                    if (value > (sellerAmount - amount)) {
                                                        return Promise.reject('Amount is exceeding.')
                                                    }
                                                } else {
                                                    if (value > sellerAmount) {
                                                        return Promise.reject('Amount is exceeding.')
                                                    }
                                                }
                                            }
                                            return Promise.resolve();
                                        }
                                    }
                                ]}>
                                <Input
                                    type="number"
                                    placeholder="Enter amount"
                                    suffix={
                                        <span className="custom-suffix">
                                            {chequeDetail?.currency}
                                        </span>
                                    }
                                />
                            </Form.Item>
                        </Col>


                    { chequeDetail?.transactionType == "RECEIVE" ? 
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
                        <Col xs={24} sm={chequeDetail?.transactionType == "RECEIVE" ? 12 : 24}>
                            <p className="add-cheque-category">Comment</p>
                            <Form.Item
                                name="comment"
                                className="inputField w-100 error-input commentError"
                                rules={[
                                    {
                                    validator: async (_, value) => {
                                      await validatePopupCommentFields(value);
                                      },
                                    },
                                ]}>
                                <TextArea rows={3} placeholder="Enter comment" />
                            </Form.Item>
                        </Col>


                        <Col span={24}>
                            <div className="d-flex justify-content-end mt-4">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={disableBtn}
                                    loading={disableBtn}
                                    className="modal-button">
                                    Submit
                                </Button>
                                <Button
                                    key="cancel"
                                    className="modal-button-cancel mx-2"
                                    onClick={() => {
                                        setShowAddChequeModal(false);
                                        form.resetFields();
                                    }}>
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
                                <Button onClick={() => {  removeChequeItem()  }}  disabled={disableBtn} type="primary" className="modal-button">
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

export default ChequeDetailCard;