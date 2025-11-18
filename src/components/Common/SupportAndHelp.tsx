import { Breadcrumb, Card, Col, Form, Input, Row ,Image, Select, Button, Upload, message, Spin, Modal} from "antd"
import DefaultLayout from "../Common/DefaultLayout";
import { useNavigate } from "react-router-dom";
import {SupportHelpList } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import UploadFile from "../../assets/img/UploadFile.svg";
import { useEffect, useState } from "react";
import { getLocalStorage, KYC_KYB_COMMENT_TEXT_LIMIT } from "./Constants";
import { createSupport, deleteSignFile } from "../../services/user";
import { LoadingOutlined } from "@ant-design/icons";
import Tick from "../../assets/img/circle_orange.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import Delete from "../../assets/img/delete.svg";
import SuccessIcon from "../../assets/img/Successpopupicon.svg";
import { getTypeOfIssueList } from "../../services/admin";
const SupportAndHelp = ():any => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [Width, setWidth] = useState(document?.body?.clientWidth)
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const [photo, setPhoto] = useState("");
  const [Success, setSuccess] = useState(false);
  const [photoReq, setPhotoReq] = useState(true);
  const [photoId, setPhotoId] = useState<string>("");
  const [uploadedFile, setUploadedFileName] = useState("");
  const [viewFile, setViewFile] = useState(false);
  const [imageLoader,setImageLoader] = useState(false);
  const [description,setDescription] = useState("");
  const [typeOfIssueList,setTypeOfIssueList] = useState([]);
  const [loading, setLoading] = useState(false);
  const local = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 30, color: "#013399" }} spin />
  );
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
    const { Option } = Select;
    const { TextArea } = Input;
    const setWidthVal = () =>{
        setWidth(document.body.clientWidth);
      }
    const goBack = () => {
        navigate(SupportHelpList);
      };
      useEffect(() => {
        window.addEventListener('resize', ()=>{
            setWidthVal()
          });
          fetchTypeofissueList();
      }, [])

      const fetchTypeofissueList = () =>{
        const current = 1;
        const page =10
        getTypeOfIssueList(current - 1 || 0,
          page || 10).then((res:any)=>{
            setTypeOfIssueList(res?.data?.data)
          }) .catch(() => {
            message.error("Could not fetch details. Please try again later");
          });
      }
      
      const uploadButton4 = (
        <div>
          {photo && uploadedFile && imageLoader === false ? (
           
            <div className="endtoend mt-3">
              <div></div>
              <Image
                src={Tick}
                alt="circle"
                className="tick_upload"
                preview={false}
              />
            </div>
          ) : null}
          <div
            style={{
              marginTop: photo && uploadedFile ? -12 : 27,
            }}
          >
            
            {imageLoader ? 
            <div >
            <Spin indicator={antIcon} />
             </div> 
            :<>
            <Image src={UploadFile} alt="passport" preview={false} />
            <div className="mt-3 subText_xs overflowText_twoLines w-upload">
              {uploadedFile ? uploadedFile : "Click here to upload"}
            </div>
            </>}
            
          </div>
        </div>
      );
      const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        
      };
        const onFinish = (values: object) => {
          if (loading) return;
            setLoading(true);
          const requestBody = {
            ...values,
            description:description,
            userAlias: userAlias,
            photoId:photoId
          };
          createSupport(requestBody)
            .then(() => {
               setLoading(false);
              setSuccess(true)
            })
            .catch(() => {
              setLoading(false);
              message.error("Oops! Something went wrong. Please try again later");
            });
        };
        const uploadSign = {
          name: "file",
          headers: {
            authorization: `Bearer ${Token}`,
          },
          action: REACT_APP_SERVER_URL + "/api/v1/contracts/uploadSignature",
      
          beforeUpload: (file: any) => {
            const isPNG =
              file.type === "image/png" ||
              file.type === "image/jpeg" ||
              file.type === "image/jpg";
            if (!isPNG) {
              message.error(`${file.name} is not acceptable file`);
            }
            return isPNG || Upload.LIST_IGNORE;
          },
      
          onChange: (info: any) => {
            const { response } = info?.file || {};
            setImageLoader(true)
            if (response) {
              setImageLoader(false)
              setUploadedFileName(response.inputfileid);
              setPhoto(response.url);
              setPhotoId(response.id)
            }
          },
        };
        const DeleteDoc = (id:any) =>{
          setImageLoader(true)
          deleteSignFile({fileID:id}).then(()=>{
            setImageLoader(false)
            setUploadedFileName("");
                setPhoto("");
                setPhotoId("")
                setPhotoReq(true)
          }).catch((err:any)=>{
            if(err)
          setImageLoader(false)
          })
         }
         const closemodal = () => {
          setSuccess(false);
          navigate(SupportHelpList);
        };

  const validatePopupCommentFields = (value: string) => {
  if (!value || value.trim() === "") {
    return Promise.reject(new Error("Please enter description !"));
  }
  const allowedChars = /^[a-zA-Z0-9\s,\/#?\-\.]*$/;
  if (!allowedChars.test(value)) {
    return Promise.reject(
      new Error("Only letters, numbers, spaces, and , - ? # / . are allowed")
    );
  }
  if (value.trim().length < 20) {
    return Promise.reject(new Error("Please enter minimum 20 characters"));
  }
  if (value.trim().length > KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT) {
    return Promise.reject(
      new Error(`Maximum characters allowed: ${KYC_KYB_COMMENT_TEXT_LIMIT.DOCUMENT_COMMENT}`)
    );
  }

  return Promise.resolve();
 };

 
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
        <DefaultLayout
          page="For support and help"
          TitleText="For support and help"
          TitleImage={LeftArrow}
          backtoDashboard={true}
          headerPage={
            <div className="d-flex">
              <Image
                src={LeftArrow}
                preview={false}
                onClick={() => {
                  goBack();
                }}
                className="mt-2 cursor"
              />
              <div className="ml-5">
                <b> For support and help</b>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item
                  className="cursor"
                    onClick={() => {
                      navigate(SupportHelpList);
                    }}
                  >
                    Support list
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>For support and help</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          }
        >
          <Card>
            <div  className={
                      Width > 425
                        ? "p-5"
                        : "p-3"
                    }>
              <Form form={form} scrollToFirstError onFinish={onFinish}>
                <Row gutter={24}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <p className="support-list-label">Title</p>
                    <Form.Item
                      className="inputField w-100 error-input"
                      name="title"
                      rules={[
                        {
                          required: true,
                          message: "Title is required!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter title"></Input>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <p className="support-list-label">Type of issue</p>
                    <Form.Item
                      className="inputField w-100 error-input"
                      name="typeOfIssue"
                      rules={[
                        {
                          required: true,
                          message: "Type of issue is required!",
                        },
                      ]}
                    >
                      <Select className="field-type" placeholder="Select issue" allowClear showSearch optionFilterProp="children">
                      {typeOfIssueList.map((item: any) => (
                                    <Option key={item.aliasName} value={item.aliasName}>
                                      {item.name}
                                    </Option>
                                  ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12} 
                  className={Width < 992 ? "mb-2" : "mb-0"}>
                    <p className="support-list-label pb-4">Description</p>
                  <Form.Item
                    name="description"
                    rules={[
                      {
                        validator: (_, value) => validatePopupCommentFields(value),
                      },
                    ]}
                    className="comment_inputFields"
                        >
                  <TextArea
                    rows={5}
                    placeholder="Enter description"
                    className="modalTextArea mt-4 pt-2"
                    value={description}
                      onChange={handleInputChange}
                  />
                </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <div
                     className={
                          Width < 992
                            ? "d-flex support-upload mt-3"
                            : "d-flex support-upload"
                        }
                    >
                      <div>
                      <p
                        className={
                          Width < 992
                            ? "support-list-label mt-5"
                            : "support-list-label"
                        }
                      >
                        Upload photo
                      </p>
                      <Form.Item
                        name={name}
                        className={
                          Width < 992 ? "uploadInput mb-5 mt-4 upload-err-mes" : "uploadInput mt-5 upload-err-mes"
                        }
                        rules={
                          photoReq
                            ? [
                                {
                                  validator(_: any, value: any) {
                                    if (!!value || photo) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      "Document is required!"
                                    );
                                  },
                                },
                              ]
                            : []
                        }
                      >
                        <Upload
                          maxCount={1}
                          listType="picture-card"
                          className="avatar-uploader mt-5"
                          showUploadList={false}
                          {...uploadSign}
                          disabled={imageLoader == true}
                        >
                          {uploadButton4}
                        </Upload>
                        {photo ? (
                         <div className="d-flex endtoend signature-view my-1">
                         <div className="blue_text cursor d-flex " onClick={() => { setViewFile(true) }}>
                           <Image
                             preview={false}
                             src={BlueEye} alt="view"
                           /> 
                           <span className="p-1 signature-overflowtext">{ uploadedFile}</span>
                         </div>
                         <Image
                           className="img_preview"
                           preview={{
                             visible: viewFile,
                             src: photo,
                             onVisibleChange: (value) => {
                             setViewFile(value);
                             },
                             }}
                         />
                         <Image src={Delete} alt="Delete" preview={false}  className="cursor" 
                         onClick={()=>{DeleteDoc(photoId)}}
                         />
                         </div>):null}
                      </Form.Item>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className={Width > 991 ? "mt-5" : "mt-4"
                    }>
                  <div
                    className={
                      Width > 991
                        ? "d-flex my-4 support-btns"
                        : "d-flex my-5 w-100 justify-content-center support-btns"
                    }
                  >
                    <Button
                      className="modal-button mx-1 me-3"
                      htmlType="submit"
                      key="submit"
                      loading={loading}
                      disabled={loading}
                    >
                      Save
                    </Button>
                    <Button
                      className="modal-button-cancel mx-1 me-3 support-cancel-btn"
                      onClick={() => {
                        form.resetFields();
                        setDescription("")
                        navigate(SupportHelpList);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </Row>
              </Form>
            </div>
          </Card>
        </DefaultLayout>
        <Modal
        open={Success}
        footer={false}
        closable={false}
        className="modal-box success"
        centered
        width={500}
        onCancel={closemodal}
      >
        <div className="text-center">
          <Image
            src={SuccessIcon}
            alt="success"
            preview={false}
            className="mt-5"
          />

          <div className="titleText mt-5 mb-3">
            Your request has been sent successfully
          </div>
          <Button
            className="rounded_blue_outline btn-OK mb-4"
            onClick={() => {
              navigate(SupportHelpList);
            }}
          >
            Ok
          </Button>
        </div>
      </Modal>
      </div>
    </div>
  );
}

export default SupportAndHelp
