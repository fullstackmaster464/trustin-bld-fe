import { Option } from "antd/lib/mentions";
import { InputText } from "../ui-elements/InputsRepo";
import dayjs from "dayjs";
import {
  Col,
  Modal,
  Row,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message
} from "antd";
import { useEffect, useState } from "react";
import { getStrydeDigiscreening } from "../../services/admin";
import moment from "moment";
import { RISK_ASSESSMENT_FINAL_RISK_SCORE } from "../Common/Constants";

const SearchAgainStrydeKybKycModal = (props: any) => {
  const { headKYBModal, searchKybModal, setSearchKybModal, strydeAlias,
    formCheckKyB, entityType, setDropDownValue,
    digiScreeningPayload, setDigiScreeningPayload, setDigiScreeningResult, setRiskAssessment, setDatasetsOptions, setRiskAssessmentPayload, countryList, brithPlaceList, uboDetails, setUboPayload, setUboResult } = props

  const [customerTypeValue, setCustomerTypeValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCustomerTypeValue(digiScreeningPayload?.customerType);
  }, [digiScreeningPayload, customerTypeValue])

  const getkybData = async (values: any) => {
    setLoading(true);
    const updatedObj: any = { ...values, };
    const reqbody: any = {};
    if (entityType === "COMPANY" && uboDetails?.length > 0) {
      const uboArr = Object.keys(values)
        .filter(key => key.startsWith("ubo"))
        .reduce((acc: any[], key: string) => {
          const indexMatch = key.match(/ubo(\d+)_/);
          if (indexMatch) {
            const index = parseInt(indexMatch[1]);
            const field = key.replace(indexMatch[0], '');
            if (!acc[index]) {
              acc[index] = {};
            }
            acc[index][field] = key === "dob" ? dayjs(values[key]).format("YYYY-MM-DD") : values[key];
            delete updatedObj[key];
          }
          return acc;
        }, []).filter(Boolean);
      reqbody.ubo = uboArr;
      setUboPayload(uboArr);
      if (values.uboThresold !== undefined) {
        reqbody.uboThresold = parseInt(values.uboThresold);
      }
    }

    if (entityType !== undefined) {
      reqbody.entityType = entityType;
      if (entityType === "INDIVIDUAL") {
        reqbody.ubo = [];
      }
    }
    if (values.repDob !== undefined) {
      const repDob = dayjs(values.repDob).format("YYYY-MM-DD");
      reqbody.repDob = repDob == "Invalid date" ? "" : repDob;
    }
    if (values.thresold !== undefined) {
      reqbody.thresold = parseInt(values.thresold);
    }
    if (values.repName !== undefined) {
      reqbody.repName = values.repName;
    }
    if (values.repNationality !== undefined) {
      reqbody.repNationality =  (Array.isArray(values?.repNationality)) ? values?.repNationality?.[0] : values.repNationality;
    }
    if (values.repBirthCountry !== undefined) {
      reqbody.repBirthCountry = values.repBirthCountry;
    }
    if (values.customerIdNumber !== undefined) {
      reqbody.customerIdNumber = values.customerIdNumber;
    }
    if (values.customerIdExpiry !== undefined) {
      reqbody.customerIdExpiry = values.customerIdExpiry;
    }
    if (values.matchCategory !== undefined) {
      reqbody.matchCategory = values.matchCategory;
    }


    await getStrydeDigiscreening(strydeAlias, reqbody)
      .then((response) => {
        setLoading(false);
        if (response?.status === 201) {
          setLoading(false)
          setDigiScreeningPayload(response?.data?.digiScreeningPayload);
          setDigiScreeningResult(response?.data?.digiScreeningResult);
          setRiskAssessmentPayload(response?.data?.riskAssessmentPayload);
          setRiskAssessment(response?.data?.riskAssessment);
          if (entityType === "COMPANY") {
            setUboPayload(response?.data?.uboPayload ?? []);
            setUboResult(response?.data?.uboResult ?? []);
          }

          setCustomerTypeValue('');
          formCheckKyB.resetFields();
          setSearchKybModal(false);
          let riskScore = 0;
          if (response?.data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.LOW_RISK) {
            riskScore = 1;
          } else if (response?.data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.MEDIUM_RISK) {
            riskScore = 2;
          } else if (response?.data?.riskAssessment?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.HIGH_RISK) {
            riskScore = 3;
          }
          setDropDownValue(riskScore)
        }
      })
      .catch((error) => {
        setLoading(false)
        message.error(error?.data?.error?.message ? error?.data?.error?.message : error?.data?.error)
      });



  };



  const handleCancel = () => {    
    setSearchKybModal(false);
    setDatasetsOptions([]);
    setCustomerTypeValue('');
    formCheckKyB.resetFields();
  }

  return (
    <>
      <Modal className="kyc-search-again"
        title={
          <div>
            {headKYBModal} Details
          </div>
        }
        width={800}
        open={searchKybModal}
        footer={false}
        onCancel={() => setSearchKybModal(false)}
        closable={true}
      >
        <Form scrollToFirstError form={formCheckKyB} onFinish={getkybData}>
          <div>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Thresold<span className="red">*</span></p>
                <InputText
                  fieldname="thresold"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: true,
                      message: "Thresold is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter thresold number" type="number" />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Name<span className="red">*</span></p>
                <InputText
                  fieldname="repName"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: true,
                      message: "Name is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter name." />
                </InputText>
              </Col>
            </Row>

            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Date Of Birth</p>
                <InputText
                  fieldname="repDob"
                  className="modal_inputField select  w-100"
                >
                  <DatePicker
                    format={{
                      format: 'DD-MM-YYYY',
                      type: 'mask',
                    }}
                    disabledDate={(current: any) => {
                      return current > moment().subtract(18, "years");
                    }}

                    placeholder="Select date of birth"
                  />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Nationality</p>
                <InputText
                  fieldname="repNationality"
                  className="inputField w-100 error-input"
                >
                  <Select
                    placeholder="Select nationality"
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                      return (
                        // <Option key={index} value={value.riskItem} >{value.riskItem}</Option>
                        <Option key={index} value={value.isoCode} >{value.name}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Place Of Birth</p>
                <Col md={24}>
                  <InputText
                    fieldname="repBirthCountry"
                    className="inputField w-100 error-input"
                  >
                    <Select
                      placeholder="Select birth place"
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    >
                      {brithPlaceList?.length > 0 && brithPlaceList?.map((value: any, index: any) => {
                        return (
                          // <Option key={index} value={value.riskItem} >{value.riskItem}</Option>
                          <Option key={index} value={value.isoCode} >{value.name}</Option>
                        )
                      })}
                    </Select>
                  </InputText>
                </Col>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Customer Id Number</p>
                <InputText
                  fieldname="customerIdNumber"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter customer Id number." />
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Customer Id Expiry</p>
                <InputText
                  fieldname="customerIdExpiry"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter customer Id expiry." />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Match Category</p>
                <InputText
                  fieldname="matchCategory"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter match category." />
                </InputText>
              </Col>
            </Row>
            {entityType === "COMPANY" && uboDetails && uboDetails?.length > 0 && (<>
              {uboDetails?.map((_: any, index: any) => (
                <div key={`ubo_${index}`}>
                  <Row gutter={16} className="mt-3">
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <p className="enter-text-category">Name</p>
                      <InputText
                        fieldname={`ubo${index + 1}_name`}
                        className="inputField w-100 error-input"
                      >
                        <Input placeholder="Enter first name." />
                      </InputText>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <p className="enter-text-category">Date Of Birth</p>
                      <Col md={24}>
                        <InputText
                          fieldname={`ubo${index + 1}_dob`}
                          className="inputField w-100 error-input"
                        >
                          <DatePicker
                            format={{
                              format: 'DD-MM-YYYY',
                              type: 'mask',
                            }}
                            disabledDate={(current: any) => {
                              return current > moment().subtract(18, "years");
                            }}
                            placeholder="Select date of birth"
                          />
                        </InputText>
                      </Col>
                    </Col>
                  </Row>
                  <Row gutter={16} className="mt-3">
                    <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                      <p className="enter-text-category">Nationality</p>
                      <InputText
                        fieldname={`ubo${index + 1}_nationality`}
                        className="inputField w-100 error-input"
                      >
                        <Select
                          placeholder="Select nationality"
                          showSearch
                          allowClear
                          optionFilterProp="children"
                          getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        >
                          {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                            return (
                              <Option key={index} value={value.riskItem} >{value.riskItem}</Option>
                            )
                          })}
                        </Select>
                      </InputText>
                    </Col>
                  </Row>
                </div>
              ))}
              <Row gutter={16} className="mt-3">
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <p className="enter-text-category">UBO Thresold<span className="red">*</span></p>
                  <InputText
                    fieldname="uboThresold"
                    className="inputField w-100 error-input"
                    rules={[
                      {
                        required: true,
                        message: "Thresold is required!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter thresold number" type="number" />
                  </InputText>
                </Col>
              </Row>
            </>)}
          </div>
          <div className="d-flex my-4">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-5"
              loading={loading}
            >
              Search
            </Button>
            <Button
              key="cancel"
              type="primary"
              className="modal-button-cancel mt-5 mx-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal >
    </>
  )
};

export default SearchAgainStrydeKybKycModal;




