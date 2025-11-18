import { Breadcrumb, Card, Col, Form, Input, Row ,Image, Select, Button, Upload, message, Spin, Modal} from "antd"
import DefaultLayout from "../Common/DefaultLayout";
import {useNavigate } from "react-router-dom";
import { Dashboard, SupportHelpList } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import UploadFile from "../../assets/img/UploadFile.svg";
import { useEffect, useState } from "react";
import { getLocalStorage } from "./Constants";
import { deleteSignFile } from "../../services/user";
import { LoadingOutlined } from "@ant-design/icons";
import Tick from "../../assets/img/circle_orange.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import Delete from "../../assets/img/delete.svg";
import SuccessIcon from "../../assets/img/Successpopupicon.svg";
import { UpdateSupport, getSupportById, getTypeOfIssueList} from "../../services/admin";


const EditSupport = () => {
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
    const [loading, setLoading] = useState(false);
    const local = getLocalStorage("auth");
    const Token = local ? JSON.parse(local)?.token : "";
    const url = window?.location?.pathname.split("/");
    const id = url[url.length - 2]; // Get the second-to-last segment
    const photoid = url[url.length - 1];
    const [typeOfIssueList,setTypeOfIssueList] = useState([]);

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
          fetchTypeofissueList();
            fetchSupport();
          window.addEventListener('resize', ()=>{
              setWidthVal()
            });
        }, [])
    
        const uploadButton4 = (
          <div>
            {photo && uploadedFile && imageLoader === false? (
             
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
        const fetchSupport = () =>{
          setLoading(true)
          const queryid=parseInt(photoid)
            getSupportById(id,queryid).then((res:any)=>{
                form.setFieldsValue({
                    title:res?.data?.response?.[0]?.title,
                    typeOfIssue: res?.data?.response?.[0]?.typeOfIssue,
                    photoId:res?.data?.response?.[0]?.photoId
                })
                setDescription(res?.data?.response?.[0]?.description)
                setPhotoId(res?.data?.documentSign?.id)
                setPhoto(res?.data?.documentSign?.url)
                setUploadedFileName(res?.data?.documentSign?.inputfileid)
                setLoading(false)
            })
        }

          const onFinish = (values: object) => {
            const requestBody = {
              ...values,
              description:description,
              userAlias: userAlias,
              photoId:photoId,
              id:id
            };
            UpdateSupport(requestBody)
              .then(() => {
                setSuccess(true)
              })
              .catch(() => {
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
              const response = info?.file?.response;
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
          
  const fetchTypeofissueList = () => {
    const current = 1;
    const page = 10
    getTypeOfIssueList(current - 1 || 0,
      page || 10).then((res: any) => {
        setTypeOfIssueList(res?.data?.data)
      }).catch(() => {
        message.error("Could not fetch details. Please try again later");
      });
  }
    return (
      <div className="scrollbar-container">
        <div className="fullHeight">
          <DefaultLayout
            page="Edit support and help"
            loading={loading}
            TitleText="Edit support and help"
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
                  <b> Edit support and help</b>
                  <Breadcrumb separator=">">
                    <Breadcrumb.Item
                      onClick={() => {
                        navigate(Dashboard);
                      }}
                    >
                      Dashboard
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                      onClick={() => {
                        navigate(SupportHelpList);
                      }}
                    >
                      Support list
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Edit support and help</Breadcrumb.Item>
                  </Breadcrumb>
                </div>
              </div>
            }
          >
            <Card>
              <div className="p-5">
                <Form form={form} scrollToFirstError onFinish={onFinish}>
                  <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <p className="seller-text-category">Title</p>
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
                      <p className="seller-text-category">Type of issue</p>
                      <Form.Item
                        className="inputField w-100 error-input"
                        name="typeOfIssue"
                        rules={[
                          {
                            required: true,
                            message: "Type Of issue is required!",
                          },
                        ]}
                      >
                        <Select className="field-type" placeholder="Select issue" allowClear showSearch optionFilterProp="children">
                          {typeOfIssueList.map((item: any,index:number) => (
                                    <Option key={index} value={item.aliasName}>
                                      {item.name}
                                    </Option>
                                  ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <p className="seller-text-category">Description</p>
                      <TextArea
                        rows={5}
                        placeholder="Enter description"
                        className="modalTextArea mt-2 pt-2 "
                        value={description}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={6} xl={6}>
  
                      <div className="d-flex">
                        <div>
                        <p
                          className={
                            Width < 992
                              ? "seller-text-category mt-3"
                              : "seller-text-category"
                          }
                        >
                          Upload photo
                        </p>
                        <Form.Item
                          name={name}
                          className={
                            Width < 992 ? "uploadInput my-5" : "uploadInput mt-5"
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
                                        "Photo is required!"
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
                  <Row>
                    <div
                      className={
                        Width > 991
                          ? "d-flex my-4"
                          : "d-flex my-5 w-100 justify-content-center"
                      }
                    >
                      <Button
                        className="modal-button mx-1 me-3"
                        htmlType="submit"
                        key="submit"
                      >
                        Save
                      </Button>
                      <Button
                        className="modal-button-cancel"
                        onClick={() => {
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
              Your request updated successfully
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
  )
}

export default EditSupport
