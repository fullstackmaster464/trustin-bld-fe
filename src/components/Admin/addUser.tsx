import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  message,
} from "antd";
import Adduser from "../../assets/img/Headers/Add_new_user.svg";
import SuccessIcon from "../../assets/img/Successpopupicon.svg";
import { InputText } from "../ui-elements/InputsRepo";
import { Option } from "antd/lib/mentions";
import { useEffect, useState } from "react";
import { getAllCountries } from "../../services/masterData";
import Country from "../../assets/img/Country.svg";
import PhoneCode from "../Common/PhoneCode";
import Role from "../../assets/img/job_light.svg";
import EmailGray from "../../assets/img/Email_outline.svg";
import UserFull from "../../assets/img/User_Full.svg";
// import specialization from "../../assets/img/spl.svg";
import User from "../../assets/img/addUserimg.svg";
import {
  DEFAULT_COUNTRY_CODE,
  MobilNumberRegex,
  OnlyText,
  emailRegex,
  getLocalStorage,
  setLocalStorage,
} from "../Common/Constants";
import { registerUser } from "../../services/user";
import DefaultLayout from "../Common/DefaultLayout";

const AddUser = ():any => {
  const [countryCodes, setCountryCodes] = useState<any>([]);
  const [error, setError] = useState({ status: false, message: "" });
  const [messagedata, setMessageData] = useState("");
  const [btnLoader, setBtnLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  // const [Specialization, setSpecialization] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [callingCode, setCallingCode] = useState<any>();
  const handleChange = () => {
    setError({ status: false, message: "" });
  };
  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };
  const validateNumber = () => {
    const value = form.getFieldValue("mobile");
    const numbers = value.replace(MobilNumberRegex, "");
    form.setFieldValue("mobile", numbers);
  };
  const twoFunction = (e: any) => {
    handleChange();
    const result: string = e.target.value.replace(OnlyText, "");
    form.setFieldsValue({ name: result });
    setMessageData(result);
  };
  const closemodal = () => {
    setModalVisible(false);
  };
  const onFinish = (values: any) => {
    setBtnLoader(true);
    if (!error?.status) {
      values["adminAlias"] = JSON.parse(getLocalStorage("auth")!)?.userAlias;
      values["clientAlias"] = "TRUST";
      values["userType"] = values?.role;
      values["contactNumber"] = values?.mobile;
      registerUser(values)
        .then((response) => {
          if (response?.data?.statusCode === 201) {
            setBtnLoader(false);
            setModalVisible(values?.name);
            setLocalStorage("userVerificationToken", JSON.stringify(response?.data?.verifyToken));
            setTimeout(() => {
              form.resetFields();
            }, 2000);
            setCallingCode("")
          }
        })
        .catch((error) => {
          setBtnLoader(false);
          message.error(
            error?.data?.message.includes("already")
              ? "This Email is already registered. Please Use another Email."
              : error?.data?.message
          );
        });
    }
  };
  // const getSpecialization = () => {
  //   getAllItem().then((res: any) => {
  //     setSpecialization(res?.data);
  //   });
  // };
  const setWidthVal = () => {
    // setWidth(document.body.clientWidth);
  };
  useEffect(() => {
    setLoading(true);
    getAllCountries()
      .then((response: any) => {
        setLoading(false);
        setCountryCodes(response?.data);  
      })
      .catch(() => {
        setLoading(false);
        message.error("Could not fetch details. Please try again later");
      });
    // getSpecialization();
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);

  }, []);
  const handleCountryChange = (value: any) => {
    form.setFieldsValue({
      countryAlias: value,
    });
    setCallingCode(
      countryCodes.filter((item: any) => item.isoCode === value)[0]?.callingCode
    );
    setError({ status: false, message: "" });
  };
  const handeRoleChange = (value: any) => {
    form.setFieldsValue({
      role: value,
    });
    setError({ status: false, message: "" });
  };
  // const handelSpecializationChange = (value: any) => {
  //   form.setFieldsValue({
  //     specialization: value,
  //   });
  //   setError({ status: false, message: "" });
  // };
  const handleBlur = (e:any) => {
    let newValue = e.target.value;
    if(newValue.startsWith('0')){
        newValue = newValue.substring(1);
       }
    form.setFieldValue("mobile", newValue);
  };
  const validateContactNumber = (_rule: any, value: string) => {
    return new Promise((resolve: any, reject: any) => {
      if (!value) {
        return reject("Mobile number is required!");
      }

      const validNumber = value.replace(MobilNumberRegex, '');
      if (callingCode === DEFAULT_COUNTRY_CODE) {
        if (!validNumber.startsWith('5')) {
          return reject("UAE numbers should start with 5");
        }
      }

      if (validNumber.length < 7) {
        return reject("Enter valid mobile number!!");
      }

      resolve(); 
    });
  };  

  return (
    <div className="fullHeight m-main-body-section scrollbar-container">
      <DefaultLayout
        page="newuser"
        loading={loading}
        TitleText="Add New User"
        TitleImage={Adduser}
        headerPage={
          <div className="d-flex">
            <Image src={Adduser} preview={false} className="mt-2" />
            <div className="ml-5">
              <b> Add new user</b>
              <Breadcrumb separator=">">
                {/* <Breadcrumb.Item
                  onClick={() => {
                    navigate(Dashboard);
                  }}
                  className="cursor"
                >
                  Dashboard
                </Breadcrumb.Item> */}
                <Breadcrumb.Item className="breadcrumb-title-text">Add new user</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
              <Card className="noBorder profile-details-card add-new-user-section">
                <Form onFinish={onFinish} form={form}>
                  <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }}>
                    <Col xs={24} sm={24} md={12} lg={8} xl={8} className="space-arr">
                      <InputText
                        className="country-selection mb-4 add-user-form-field add-user-select"
                        fieldname="role"
                        
                        rules={[
                          {
                            required: true,
                            message: "Role is required!",
                          },
                        ]}
                       
                        children={
                          <div>
                            <span className="global">
                              <Image
                                preview={false}
                                src={Role}
                                alt="role"
                                className="prefix"
                              />
                            </span>
                            <Select
                              className="selct-form-field"
                              placeholder="Role"
                              onChange={handeRoleChange}
                              allowClear
                            >
                              <Option value="TRUSTEE">Approver</Option>
                              <Option value="AUTHORIZER">Authorizer</Option>
                              <Option value="SENIOR_MANAGMENT">
                                Senior managment
                              </Option>
                              <Option value="MAKER">Maker</Option>
                              <Option value="CHECKER">Checker</Option>
                              <Option value="SUPPORT_ENGINEER">Support engineer</Option>
                            </Select>
                          </div>
                        }
                      />
                    </Col>
                    <Col  xs={24} sm={24} md={12} lg={8} xl={8}>
                      <InputText
                        fieldname="name"
                        className="inputField mb-4 add-user-form-field"
                        rules={[
                          {
                            required: true,
                            message: "Name is required!",
                          },
                          {
                            whitespace: true,
                            message: "Enter valid name!",
                          },
                        ]}
                      >
                        <Input
                          type="text"
                          placeholder="Name"
                          prefix={
                            <Image
                              src={UserFull}
                              preview={false}
                              alt="name"
                              className="pe-3"
                            />
                          }
                          onChange={twoFunction}
                          value={messagedata}
                          maxLength={50}
                        />
                      </InputText>
                    </Col>
                    <Col  xs={24} sm={24} md={12} lg={8} xl={8}>
                      <InputText
                        fieldname="email"
                        className="inputField mb-4 add-user-form-field"
                        rules={[
                          {
                            required: true,
                            message: "Email is required!",
                          },
                          {
                            pattern: emailRegex,
                            message: "Enter valid email!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Email"
                          prefix={
                            <Image
                              src={EmailGray}
                              preview={false}
                              alt="name"
                              className="pe-3"
                            />
                          }
                          onChange={handleChange}
                        />
                      </InputText>
                    </Col>
                  </Row>
                  <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }}>
                    <Col  xs={24} sm={24} md={12} lg={8} xl={8} className="space-arr">
                      <InputText
                        className="country-selection mb-4 add-user-form-field add-user-select select-country-pl-38px"
                        
                        fieldname="countryAlias"
                        rules={[
                          {
                            required: true,
                            message: "Country is required!",
                          },
                        ]}
                      >
                        <span className="global">
                          <Image
                            preview={false}
                            src={Country}
                            alt="country"
                            className="prefix"
                          />
                        </span>
                        <Select
                          className="selct-form-field"
                          placeholder="Country"
                          onChange={handleCountryChange}
                          showSearch
                          optionFilterProp="children"
                          allowClear
                        >
                          {countryCodes.map((item: any, index:any) => {
                            return item?.currency?.status == "active" ? (
                              <Option
                                key={index + "countrycode"}
                                value={item?.isoCode}
                              >
                                {item?.name}
                              </Option>
                            ) : null;
                          })}
                        </Select>
                      </InputText>
                    </Col>
                    <Col  xs={24} sm={24} md={12} lg={8} xl={8}>
                      <Form.Item
                        name="mobile"
                        className="inputField add-user-form-field add-user-select"
                        rules={[
                          {
                            validator: validateContactNumber,
                          },
                        ]}
                      >
                        <Input
                          addonBefore={<PhoneCode callingCode={callingCode}/>}
                          className="inputField"
                          placeholder="Mobile number"
                          maxLength={10}
                          onBlur={handleBlur}
                          onKeyPress={(e) => {
                            checkNumberInput(e);
                            handleBlur(e);
                          }}
                          onChange={() => {
                            validateNumber();
                          }}
                        />
                      </Form.Item>
                    </Col>
                    {/* <Col  xs={24} sm={24} md={12} lg={8} xl={8} className="space-arr">
                      <InputText
                        fieldname="specialization"
                        className="country-selection mb-4 add-user-form-field add-user-select"
                        rules={[
                          {
                            required: true,
                            message: "Specialization is required!",
                          },
                        ]}
                      >
                        <span className="global center">
                          <Image
                            src={specialization}
                            preview={false}
                            className="prefix"
                          />
                        </span>
                        <Select
                        className="selct-form-field p-1"
                          placeholder="Specialization"
                          onChange={handelSpecializationChange}
                          mode="multiple"
                          allowClear
                          showSearch
                          optionFilterProp="children"
                        >
                          {Specialization?.map((item: any) => {
                            return (
                              <Option
                                key={item?.aliasName}
                                value={item?.aliasName}
                              >
                                {item?.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </InputText>
                    </Col> */}
                  </Row>
                  <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} >
                    <Col span={24} className="my-2 w-100 d-flex align-items-center">
                      <Button
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        loading={btnLoader}
                        className="modal-button w-auto "
                      >
                        Add New User
                      </Button>
                      <Button
                        className="rounded_cancel_btn mx-3 mt-0"
                        onClick={() => {form.resetFields();setCallingCode("")}}
                      >
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>
                <Row className="rightCorner my-3">
                  <Image src={User} preview={false} width={295} height={295} />
                </Row>
              </Card>
              </DefaultLayout>
      <Modal
        open={modalVisible}
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
            {modalVisible + " "} added successfully
          </div>
          <Button
            className="rounded_blue_outline btn-OK mb-4"
            onClick={closemodal}
          >
            Ok
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddUser;
