import {
  Breadcrumb,
  Card,
  Col,
  Image,
  Input,
  Row,
  Select,
  Radio,
  Button,
  Modal,
  Tabs,
  Form,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/img/leftArrow.svg";
import ConfirmationIcon from "../../assets/img/Successpopupicon.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import Editicon from "../../assets/img/EditIcon.svg";
import Itemdelete from "../../assets/img/ItemDeleteIcon.svg";
import { Dashboard, ItemCategoryList } from "../Common/RouteConst";
import Warning from "../../assets/img/warningicon.svg";
import "../../assets/scss/custom.scss";
import {
  createDynamicField,
  deleteItemTypeInputField,
  getAllItemtypesandCategories,
  getAllValidationType,
  getSingleDynamicField,
  getSubFieldsData,
} from "../../services/admin";
import { Option } from "antd/lib/mentions";
import moment from "moment";
import { getLocalStorage, inputType } from "../Common/Constants";
import SubFieldEdit from "./subFieldEdit";
import DefaultLayout from "../Common/DefaultLayout";

const ItemCategoryFieldManagement = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [dynamicFields, setDynamicField] = useState<any>([]);
  const [validationList, setValidationList] = useState([]);
  const [subField, setSubField] = useState({});
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const aliasName = window?.location?.pathname.split("/").pop();
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [tab, setTab] = useState("field_details");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemTypeList, setItemTypeList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [Width, setWidth] = useState(document?.body?.clientWidth)

  const subFieldUpdated = () => {
    setIsEdit(false);
    getFieldDetails();
    setTab("field_details");
  };
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  useEffect(() => {
     dynamicFields.forEach((item:any) => {
        form.setFieldValue(item.name, "");
    });
    }, [dynamicFields, form]);

  useEffect(() => {
    getAllItemtypesandCategories()
      .then((response) => {
        const category: any = [];
        setItemTypeList(response?.data);
        response?.data?.map((item: any) => {
          item?.itemCategories?.map((value:any) =>{
          category.push(value);
          })
        });
        setCategoryList(category);
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later");
      });
    getFieldDetails();
    getAllValidationType()
      .then((res: any) => {
        setValidationList(res?.data);
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later");
      });
      window.addEventListener('resize', ()=>{
        setWidthVal()
      });
      return () => window.removeEventListener('resize', setWidthVal);
  }, [aliasName]);
  const getFieldDetails = () => {
    getSingleDynamicField(aliasName)
      .then((res) => {        
        form.setFieldsValue({
          itemType: res?.data?.itemTypeAlias,
          itemCategory: res?.data?.aliasName,
          status: res?.data?.status == "active" ? "Active" : "Inactive",
          updated: moment(res?.data?.updatedAt ?? '').format("DD-MM-YYYY"),
          created: moment(res?.data?.createdAt ?? '').format("DD-MM-YYYY"),
        });
        setDynamicField(res?.data?.dynamicInputFields);
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later");
      });
  };

  const getSubFields = (aliasName: string) => {
    getSubFieldsData(aliasName).then((res) => {
      setSubField({
        data: res?.data,
        aliasName: aliasName,
      });
      setIsEdit(true);
    });
  };
  const removeItemType: any = (aliasName: string) => {
    deleteItemTypeInputField(aliasName).then(() => {
      subFieldUpdated();
      setIsDeleteModalVisible(false);
    });
  };
  const onFinish = (values: object) => {
    const requestBody = {
      ...values,
      updatedBy: userAlias,
      itemCategoryAlias: aliasName,
    };
    createDynamicField(requestBody)
      .then(() => {
        setIsModalVisible(true);
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later");
      });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setTab("field_details");
    getFieldDetails();
  };
  const handleOk = () => {
    setIsModalVisible(false);
    navigate(ItemCategoryList);
  };

  const goBack = () => {
    navigate(ItemCategoryList);
  };
  const handleTabChange = (key: string) => {
    setTab(key);
  };

  // useEffect(() => {}, []);
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="config_category"
        loading={false}
        TitleText="Field Management"
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
            <b>Field management</b>
            <Breadcrumb separator=">">
              <Breadcrumb.Item
                onClick={() => {
                  navigate(Dashboard);
                }}
                className="cursor"
              >
                Dashboard
              </Breadcrumb.Item>
              <Breadcrumb.Item
                className="cursor"
                onClick={() => {
                  navigate(ItemCategoryList);
                }}
              >
                Item types
              </Breadcrumb.Item>
              <Breadcrumb.Item className="cursor">
                Field management
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      }
      >
              {!isEdit ? (
                <div>
                  <div className="d-flex disputeTabs">
                    <Tabs activeKey={tab} onChange={handleTabChange}>
                      <TabPane
                        tab="Field details"
                        key="field_details"
                      ></TabPane>
                      {UserType !=="SUPPORT_ENGINEER" ? 
                      <TabPane
                        tab="+Add more fields"
                        key="add_more_details"
                      ></TabPane> : null
                      }
                    </Tabs>
                  </div>
                  {tab === "field_details" && (
                    <Card >
                      <div className="p-5">
                        <Form form={form} scrollToFirstError>
                          <Row gutter={24} >
                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                              <p className="field-text-heading">Item category</p>
                              <Form.Item
                                className="inputField w-100"
                                name="itemType"
                                rules={[
                                  {
                                    required: true,
                                    message: "Item category is required!",
                                  },
                                ]}
                              >
                                <Select
                                  className="field-type"
                                  placeholder="Item category"
                                  showSearch
                                  allowClear
                                  optionFilterProp="children"
                                >
                                  {itemTypeList.map((item: any,index:any) => (
                                    <Option value={item.aliasName} key={index}>
                                      {item.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                              <p className="field-text-heading">
                                Item type
                              </p>
                              <Form.Item
                                className="inputField w-100"
                                name="itemCategory"
                                rules={[
                                  {
                                    required: true,
                                    message: "Item type is required!",
                                  },
                                ]}
                              >
                                <Select
                                  className="field-type"
                                  placeholder="Item type"
                                  showSearch
                                  allowClear
                                  optionFilterProp="children"
                                >
                                  {categoryList && categoryList.map((item: any,index:any) => (
                                    <Option key={index} value={item.aliasName}>
                                      {item.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={8} xl={8} >
                              <p className="field-text-heading">Status</p>
                              <Form.Item
                                name="status"
                                className="inputField w-100"
                              >
                                <Input placeholder="Status" disabled></Input>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            {dynamicFields.map((item: any,index:any) => {
                              return (
                                <Col xs={24} sm={24} md={24} lg={8} xl={8} key={index}>
                                  <div className="endtoend" >
                                    <p className="modal_inputField">{item.name}</p>
                                    <span className="endtoend"  >
                                      <Image
                                        src={Editicon}
                                        alt="edit"
                                        preview={false}
                                        className="cursor ml--12"
                                        height={17}
                                        width={17}
                                        onClick={() => {
                                          getSubFields(item?.aliasName);
                                        }}
                                      />
                                      <Image
                                        src={Itemdelete}
                                        alt="delete"
                                        preview={false}
                                        className="cursor"
                                        height={17}
                                        width={15.11}
                                        onClick={() => {
                                          setIsDeleteModalVisible(true);
                                        }}
                                      />
                                    </span>
                                  </div>
                                  <Form.Item
                                    name={item.name}
                                    className="inputField w-100"
                                  >
                                    <Input disabled placeholder={item.placeHolder}></Input>
                                  </Form.Item>
                                </Col>
                              );
                            })}
                            <Col
                              xs={24} sm={24} md={24} lg={8} xl={8}
                              // offset={Width > 991 ? 1 : ""}
                            >
                              <p className="modal_inputField">Created on</p>
                              <Form.Item
                                name="created"
                                className="inputField w-100"
                              >
                                <Input placeholder="Status" disabled></Input>
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                              <p className="modal_inputField">Updated on</p>
                              <Form.Item
                                name="updated"
                                className="inputField w-100"
                              >
                                <Input placeholder="Status" disabled></Input>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </Card>
                  )}
                  {tab === "add_more_details" && (
                    <Card className="p-5">
                      <Form form={form} scrollToFirstError onFinish={onFinish}>
                        <div>
                          <Row gutter={12}>
                            <Col span={Width > 991 ?7 :24}>
                              <p className="field-text-heading">Field name</p>
                              <Form.Item
                                className="inputField w-100 error-input"
                                name="name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Field name is required!",
                                  },
                                ]}
                              >
                                <Input placeholder="Enter field name"></Input>
                              </Form.Item>
                            </Col>
                            <Col span={Width > 991 ?7 :24} offset={Width > 991 ? 1 : ""}>
                              <p className="field-text-heading">Input type</p>
                              <Form.Item
                                className="modal_inputField select"
                                name="inputType"
                                rules={[
                                  {
                                    required: true,
                                    message: "Input type is required!",
                                  },
                                ]}
                              >
                                <Select
                                  className="field-type"
                                  placeholder="Input type"
                                >
                                  {inputType.map((item: any,index:any) => (
                                    <Option value={item.value} key={index}>
                                      {item.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={Width > 991 ? 7 :24} offset={Width > 991 ? 1 : ""}>
                              <p className="field-text-heading">Placeholder</p>
                              <Form.Item
                                className="inputField error-input w-100"
                                name="placeholder"
                                rules={[
                                  {
                                    required: true,
                                    message: "Placeholder is required!",
                                  },
                                ]}
                              >
                                <Input placeholder="Enter placeholder value"></Input>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row gutter={24}>
                            <Col span={Width > 991 ?7 :24}>
                              <p className="field-text-heading">Validations</p>
                              <Form.Item
                                className="modal_inputField select"
                                name="regexAlias"
                                rules={[
                                  {
                                    required: true,
                                    message: "Validation is required!",
                                  },
                                ]}
                              >
                                <Select
                                  className="field-type"
                                  placeholder="Validation"
                                  showSearch
                                  allowClear
                                  optionFilterProp="children"
                                >
                                  {validationList.map((item: any,index:any) => (
                                    <Option value={item.aliasName} key={index}>
                                      {item.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col span={Width > 991 ?7 :24} offset={Width > 991 ? 1 : ""}>
                              <p className="field-text-heading">Is mandatory</p>
                              <Form.Item
                                name="isMandatory"
                                className="bgTransparent"
                                rules={[
                                  {
                                    required: true,
                                    message: "This field is required!",
                                  },
                                ]}
                              >
                                <Radio.Group name="radiogroup">
                                  <Radio value={true} className="custom-radio">
                                    Yes
                                  </Radio>
                                  <Radio value={false} className="custom-radio">
                                    No
                                  </Radio>
                                </Radio.Group>
                              </Form.Item>
                            </Col>
                          </Row>
                          <Row>
                            <div className={Width > 991 ?"d-flex my-4" :"d-flex my-4 w-100 justify-content-center"}>
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
                                  setTab("field_details");
                                  form.resetFields();
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                            <Modal
                              open={isModalVisible}
                              onOk={handleOk}
                              onCancel={handleCancel}
                              closable={false}
                              footer={null}
                              className="modal-box success"
                            >
                              <div className="text-center">
                                <Image
                                  src={ConfirmationIcon}
                                  preview={false}
                                  className="mt-4"
                                ></Image>
                                <p className="titleText mt-5 mb-3">
                                  Your field added successfully!!
                                </p>
                                <Button
                                  className="rounded_blue_outline btn-OK"
                                  onClick={handleOk}
                                >
                                  Ok
                                </Button>
                              </div>
                              <hr className="" />
                            </Modal>
                          </Row>
                        </div>
                      </Form>
                    </Card>
                  )}
                </div>
              ) : (
                <div>
                  <SubFieldEdit
                    validationList={validationList}
                    isEdit={subFieldUpdated}
                    userAlias={userAlias}
                    subField={subField}
                  />
                </div>
              )}
              </DefaultLayout>
            </div>
      {/* Delete  */}
      <Modal
        title={
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
          </div>
        }
        className="modal-box center"
        open={isDeleteModalVisible}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        width={Width < 650 ? 600 : 600}
      >
        <p className="sub-text fw-400 center mx-5">
          Are you sure you want to delete this dynamic field?
        </p>
        <div className="d-flex center gap-3">
          <Button
            className="modal-button my-4"
            htmlType="submit"
            onClick={() => removeItemType(dynamicFields[0]?.aliasName)}
          >
            Delete
          </Button>
          <Button
            className="modal-button-cancel my-4"
            onClick={() => setIsDeleteModalVisible(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ItemCategoryFieldManagement;
