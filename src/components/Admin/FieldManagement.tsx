import {
  Breadcrumb,
  Card,
  Col,
  DatePicker,
  Image,
  Input,
  Row,
  Select,
  Radio,
  Button,
  Modal,
  Tabs,
} from "antd";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/img/leftArrow.svg";
import ConfirmationIcon from "../../assets/img/ConfirmIcon.svg";
import TabPane from "antd/lib/tabs/TabPane";
import { useEffect, useState } from "react";
import {
  Dashboard,
  DisputeManagementDetails,
  DisputeManagementList,
} from "../Common/RouteConst";
import "../../assets/scss/custom.scss";
import DefaultLayout from "../Common/DefaultLayout";
import { getLocalStorage } from "../Common/Constants";

const FieldManagement = () => {
  const navigate = useNavigate();
  const agreementId = window?.location?.pathname.split("/").pop();
  const [tab, setTab] = useState(
    localStorage.getItem("activeTab") || "field_details"
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
   const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const goBack = () => {
    navigate(DisputeManagementDetails + "/" + agreementId);
  };
  const handleTabChange = (key:any) => {
    setTab(key);
    localStorage.setItem("activeTab", key);
  };
  function setIsAddModalVisible(_arg0: boolean) {
    throw new Error("Function not implemented.");
  }
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get("type");

    setTab(value || localStorage.getItem("activeTab") || "field_details");
  }, []);
  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
      <DefaultLayout
        page="escrow_account"
        loading={false}
        TitleText="Field Management"
        TitleImage={LeftArrow}
        backtoDashboard
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
                      <b>Field Management</b>
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
                            navigate(DisputeManagementList);
                          }}
                        >
                          Item Categories
                        </Breadcrumb.Item>
                        <Breadcrumb.Item className="cursor">
                          Field Management
                        </Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <div className="d-flex disputeTabs">
                <Tabs activeKey={tab} onChange={handleTabChange}>
                  <TabPane tab="Field Details" key="field_details"></TabPane>
                  {UserType !=="SUPPORT_ENGINEER" ?
                  <TabPane
                    tab="+Add More Fields"
                    key="add_more_details"
                  ></TabPane>: null }
                </Tabs>
              </div>
              {tab === "field_details" && (
                <Card className="card-dimension">
                  <div>
                    <Row gutter={12}>
                      <Col span={6}>
                        <p className="field-text-heading">Item Category</p>
                        <Select
                          className="field-type"
                          placeholder="Item category name 1"
                        ></Select>
                      </Col>
                      <Col span={6} offset={2}>
                        <p className="field-text-heading">Item Type</p>
                        <Select
                          className="field-type"
                          placeholder="Item type name 1"
                        ></Select>
                      </Col>
                      <Col span={6} offset={2}>
                        <p className="field-text-heading">Status</p>
                        <Input
                          className="input-field-status"
                          placeholder="Inactive"
                        ></Input>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={8}>
                        <p className="field-text-heading">Created on</p>
                        <DatePicker
                          className="input-field-status"
                          format={{
                            format: 'DD-MM-YYYY',
                            type: 'mask',
                          }}
                        ></DatePicker>
                      </Col>
                      <Col span={8}>
                        <p className="field-text-heading">Updated on</p>
                        <DatePicker
                          className="input-field-status"
                          format={{
                            format: 'DD-MM-YYYY',
                            type: 'mask',
                          }}
                        ></DatePicker>
                      </Col>
                    </Row>
                  </div>
                </Card>
              )}
              {tab === "add_more_details" && (
                <Card className="card-dimension-add">
                  <div>
                    <Row gutter={12}>
                      <Col span={6}>
                        <p className="field-text-heading">Field Name</p>
                        <Input
                          className="input-field-add"
                          placeholder="Enter field name"
                        ></Input>
                      </Col>
                      <Col span={6} offset={2}>
                        <p className="field-text-heading">Input Type</p>
                        <Select
                          className="field-type"
                          placeholder="Item category name 1"
                        ></Select>
                      </Col>
                      <Col span={6} offset={2}>
                        <p className="field-text-heading">Placeholder</p>
                        <Input
                          className="input-field-add"
                          placeholder="Enter placeholder"
                        ></Input>
                      </Col>
                    </Row>
                    <Row gutter={24}>
                      <Col span={8}>
                        <p className="field-text-heading">Validations</p>
                        <DatePicker
                          className="input-field-status"
                          format={{
                            format: 'DD-MM-YYYY',
                            type: 'mask',
                          }}
                        ></DatePicker>
                      </Col>
                      <Col span={8}>
                        <p className="field-text-heading">Is mandatory</p>
                        <Radio.Group name="radiogroup" className="mt-2">
                          <Radio value={true} className="custom-radio">
                            Yes
                          </Radio>
                          <Radio value={false} className="custom-radio">
                            No
                          </Radio>
                        </Radio.Group>
                      </Col>
                    </Row>
                    <Row>
                      <div className="d-flex my-4">
                        <Button
                          className="rounded_btn mx-1 me-3"
                          htmlType="submit"
                          onClick={() => setIsModalVisible(true)}
                        >
                          Save
                        </Button>
                        <Button
                          className="rounded_cancel_btn"
                          onClick={() => setIsAddModalVisible(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                      <Modal
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        closable={false}
                        footer={null}
                        className="confirm-modal d-flex"
                      >
                        <div>
                          <Image
                            src={ConfirmationIcon}
                            preview={false}
                            className="img-confirm"
                          ></Image>
                        </div>
                        <p className="text-confirm">
                          Your field added successfully!!
                        </p>
                        <Button className="confirm-btn" onClick={handleOk}>
                          Ok
                        </Button>

                        <hr className="orange-line" />
                      </Modal>
                    </Row>
                  </div>
                </Card>
              )}
              </DefaultLayout>
            </div>
    </div>
  );
};

export default FieldManagement;
