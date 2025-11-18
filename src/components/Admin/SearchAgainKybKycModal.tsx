/* eslint-disable no-unsafe-optional-chaining */
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
import { getKyc, getRiskAssessment, saveDigiScreeningHistory } from "../../services/admin";
import { DateWithUtcOffset, RISK_ASSESSMENT_FINAL_RISK_SCORE } from "../Common/Constants";
import moment from "moment";

const SearchAgainKybKycModal = (props: object|any):any => {
  const { headKYBModal, searchKybModal, setSearchKybModal, kybInfo, setKybInfo, digiScreeningPayload, setDigiScreeningPayload, riskDetails, userAlias, formCheckKyB, setRiskAssessment, datasetsOptions, setDatasetsOptions, fatfTypeId, fatfList, riskAssessmentFormPayload, setRiskAssessmentFormPayload, setRiskAssessmentPayload, kybBasic, setDropDownValue, countryList, brithPlaceList, representativeDetails, shareHoldingCompanyDigiScreeningPayload, setShareHoldingCompanyDigiScreeningPayload, setShareHoldingCompanyDigiScreeningResponse } = props
  const [customerTypeValue, setCustomerTypeValue] = useState('');
  const [genderValue, setGenderValue] = useState('');
  const [datasetValue, setDatasetValue] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCustomerTypeValue(digiScreeningPayload?.CustomerType);
    setDatasetValue(digiScreeningPayload?.Datasets);
    setGenderValue(digiScreeningPayload?.Gender);
  }, [digiScreeningPayload, customerTypeValue])

  const getkybData = async(values: any) => {
    setLoading(true);
    let reqbody: any = { };
    const companyReqbody: any = { };

    if (kybBasic?.typeOfEntity === "COMPANY") {
      const updatedObj: any = { ...values, };
      const shareholdersArr = Object.keys(values)
        .filter(key => key.startsWith("shareholder"))
        .reduce((acc: any[], key: string) => {
          const indexMatch = key.match(/shareholder(\d+)_/);
          if (indexMatch) {
            const index = parseInt(indexMatch[1]);
            const field = key.replace(indexMatch[0], '');
            if (!acc[index]) {
              acc[index] = {};
            }
            acc[index][field] = values[key];
            delete updatedObj[key];
          }
          return acc;
        }, []).filter(Boolean);

      reqbody = {
        ...reqbody,
        shareholders: shareholdersArr,
        digiScreeningType: "with_share_holder",
        ShareHolderOptions: {
          Datasets: ["PEP-CURRENT", "SAN", "REL", "DD"],
          Threshold: parseInt(values.Threshold)
        }
      };
    }

    if (values.dob !== undefined) {
      const dob = dayjs(values.dob).format("YYYY-MM-DD");
      reqbody.DOB = dob == "Invalid date" ? "" : dob;
    }
    if (values.Threshold !== undefined) {
      reqbody.Threshold = parseInt(values.Threshold);
    }
    if (values.FirstName !== undefined) {
      reqbody.FirstName = values.FirstName;
    }
    if (values.LastName !== undefined) {
      reqbody.LastName = values.LastName;
    }
    if (values.MiddleName !== undefined) {
      reqbody.MiddleName = values.MiddleName;
    }
    if (digiScreeningPayload?.CustomerType !== undefined && digiScreeningPayload?.CustomerType !== "") {
      reqbody.CustomerType = digiScreeningPayload?.CustomerType
    } else {
      reqbody.CustomerType = kybBasic?.typeOfEntity === "INDIVIDUAL" ? "I" : "C";
    }
    if (values.Nationality !== undefined) {
      reqbody.Nationality=values.Nationality;
    }
    if (values.PlaceOfBirth !== undefined) {
      reqbody.PlaceOfBirth = values.PlaceOfBirth;
    }
    if (values.CustomerIdNumber !== undefined) {
      reqbody.CustomerIdNumber = values.CustomerIdNumber;
    }
    if (values.CustomerIdExpiry !== undefined) {
      reqbody.CustomerIdExpiry = values.CustomerIdExpiry;
    }
    if (values.MatchCategory !== undefined) {
      reqbody.MatchCategory = values.MatchCategory;
    }
    if (values.CompanyCode !== undefined) {
      reqbody.CompanyCode = values.CompanyCode;
    }
    if (genderValue !== undefined) {
      reqbody.Gender = genderValue !== undefined ? genderValue : digiScreeningPayload.Gender;
    }
    if (datasetValue !== undefined || datasetValue?.length > 0 || values?.Datasets?.length > 0) {
      reqbody.Datasets = values?.Datasets?.length > 0 ? values?.Datasets : digiScreeningPayload?.Datasets;
    
    }
    if (userAlias !== undefined) {
      reqbody.userAlias = userAlias;
    }
    if (representativeDetails && representativeDetails?.isCorporateShareholder === true) {
      companyReqbody.CustomerType = "C";
      companyReqbody.copmanyType = "with_company"
      if (values.companyThreshold !== undefined) {
        companyReqbody.Threshold = parseInt(values.companyThreshold);
      }
      if (values.CompanyName !== undefined) {
        companyReqbody.LastName = values.CompanyName;
      }
      if (userAlias !== undefined) {
        companyReqbody.userAlias = userAlias;
      }
      if (values.companyDob !== undefined) {
        // let dob = dayjs(values.companyDob).format("DD-MM-YYYY");
        const dob =DateWithUtcOffset(dayjs(values.companyDob).format("DD-MM-YYYY"));
        companyReqbody.DOB = dob == "Invalid date" ? "" : dob;
      }
      if (datasetValue !== undefined || datasetValue?.length > 0 || values?.companyDatasets?.length > 0) {
        companyReqbody.Datasets = values?.companyDatasets?.length > 0 ? values?.companyDatasets : shareHoldingCompanyDigiScreeningPayload?.Datasets;
      }
      await getKyc(companyReqbody)
      .then((response) => {
        if (response?.data?.status === 201 || response?.data?.status === 200) {
          setShareHoldingCompanyDigiScreeningResponse(response?.data?.data?.data);
          setShareHoldingCompanyDigiScreeningPayload(response?.data?.data?.digiScreeningPayload)
        }
      })
      .catch((error) => {
        setLoading(false)
        message.error(error?.data?.error?.message ? error?.data?.error?.message : error?.data?.error)
      });

    }
  
    await getKyc(reqbody)
      .then((response) => {
        if (response?.data?.status === 201 || response?.data?.status === 200) {
          setLoading(false)
          setKybInfo(response?.data?.data?.data);
          setDigiScreeningPayload(response?.data?.data?.digiScreeningPayload);
          setDatasetsOptions([]);
          setCustomerTypeValue('');
          setGenderValue('');
          setDatasetValue([]);
          formCheckKyB.resetFields();
          setSearchKybModal(false);
        }
      })
      .catch((error) => {
        setLoading(false)
        message.error(error?.data?.error?.message ? error?.data?.error?.message : error?.data?.error)
      });

    if (values.fatf !== undefined) {
      const fatf = values.fatf;
      const riskTypes = [...riskAssessmentFormPayload?.riskTypes];
      const riskItems = [...riskAssessmentFormPayload?.riskItems];
      if (values.fatf) {
        riskTypes.push(fatfTypeId)
        riskItems.push(values.fatf)
      }
      const riskAssessmentFormPayloadObj = {
        riskTypes: riskTypes,
        riskItems: riskItems
      }
      const finalArr: any = [];
      riskDetails?.forEach((riskCategory: any) => {
        riskCategory?.riskTypes?.forEach((riskType: any) => {
          const riskItemList = riskAssessmentFormPayloadObj?.riskItems
            ?.map((riskItemId) => {
              const riskItem = riskType.riskItems.find(
                (ri: any) => ri.id === riskItemId
              );
              return riskItem ? { Id: riskItem.id.toString() } : null;
            })
            ?.filter((item: any) => item !== null);

          if (riskItemList?.length > 0) {
            finalArr.push({
              Id: riskType.id.toString(),
              RiskItemList: riskItemList,
            });
          }
        });
      });

      if (finalArr?.length > 0) {
        const reqObj = {
          reqType: "risk_assessment_admin",
          CustomerId: kybInfo?.customerId,
          CustomerName: kybBasic?.representativeName,
          MainNationality: kybBasic?.country,
          RiskCategory: kybBasic.typeOfEntity === "INDIVIDUAL" ? "I" : "C",
          RiskTypeList: finalArr,
          fatf: fatf
        };

        getRiskAssessment(reqObj)
          .then(async (response) => {
            setRiskAssessmentPayload(reqObj)
            if (response?.data?.statusCode === 201 || response?.data?.statusCode === 200) {
              setLoading(false);
              setRiskAssessment(response?.data?.user);
              if (response?.data?.user?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.LOW_RISK) {
                setDropDownValue(Number(1));
              }else if (response?.data?.user?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.MEDIUM_RISK){
                setDropDownValue(Number(2));
              }else if (response?.data?.user?.finalRiskScore === RISK_ASSESSMENT_FINAL_RISK_SCORE.HIGH_RISK){
                setDropDownValue(Number(3));
              }
            
              setRiskAssessmentFormPayload(riskAssessmentFormPayload)
              setTimeout(async () => {
                await createDigiScreeningHistory(response?.data?.user, riskAssessmentFormPayload, reqObj);
              }, 500);

            }
          })
          .catch((error) => {
            setLoading(false)
            message.error(error?.data?.error?.message ? error?.data?.error?.message : error?.data?.error)

          });
      } else {
        setLoading(false);
        message.error("Risk assessment not found for selected user.");
      }
    }

  };

  const createDigiScreeningHistory = async (riskAssessmentData: any, riskAssessmentFormPayload: any, riskAssessmentPayload: any) => {
    const { fatf, ...newRiskAssessmentPayload } = riskAssessmentPayload;
    const reqbody = {
      userAlias,
      digiScreeningPayload: digiScreeningPayload,
      riskAssessment: riskAssessmentData,
      riskAssessmentFormPayload: riskAssessmentFormPayload,
      riskAssessmentPayload: newRiskAssessmentPayload,
      ...kybInfo
    }
    saveDigiScreeningHistory({ ...reqbody, fatf: fatf })
      .then((response: any) => {
        if (response?.data?.kycDetails?.status === 201 || response?.data?.kycDetails?.status === 200) {
          setLoading(false);
          message.success("DIGI screeing history created successfully.");
        }
      })
      .catch((error: any) => {
        setLoading(false)
        message.error(error?.data?.error);
      });
  };

  const handleCancel = () => {
    setDatasetsOptions([]);
    setCustomerTypeValue('');
    setGenderValue('');
    setDatasetValue([]);
    formCheckKyB.resetFields();
    setSearchKybModal(false);
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
        onCancel={() =>setSearchKybModal(false)}
        closable={true}
      >
        <Form scrollToFirstError form={formCheckKyB} onFinish={getkybData}>
          <div>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Threshold<span className="red">*</span></p>
                <InputText
                  fieldname="Threshold"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: true,
                      message: "Threshold is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Threshold number" type="number" />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">First Name</p>
                <InputText
                  fieldname="FirstName"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter first name." />
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Middle Name</p>
                <InputText
                  fieldname="MiddleName"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter middle name." />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Last Name<span className="red">*</span></p>
                <InputText
                  fieldname="LastName"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: true,
                      message: "Last name is required!",
                    },
                  ]}
                >
                  <Input placeholder="Enter last name." />
                </InputText>
              </Col>
            </Row>
            {customerTypeValue === "I" && (
              <Row gutter={16} className="mt-3">
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <p className="enter-text-category"> Date Of Birth</p>
                  <InputText
                    fieldname="dob"
                    className="modal_inputField select  w-100"
                  >
                    <DatePicker
                format={{
                  format: 'DD-MM-YYYY',
                  type: 'mask',
                }}
                disabledDate={(current:any) => {
                  return current > moment().subtract(18, "years");
                }}                

                placeholder="Select date of birth"
              />
                  </InputText>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <p className="enter-text-category">Gender</p>
                  <InputText
                    fieldname="Gender"
                    className="modal_inputField select  w-100"
                  >
                    <Select
                      placeholder="Select gender"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      onChange={(e) => { setGenderValue(e) }}
                    >
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                    </Select>
                  </InputText>
                </Col>
              </Row>
            )}
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Nationality</p>
                <InputText
                  fieldname="Nationality"
                  className="inputField w-100 error-input"
                >
                  <Select
                    placeholder="Select nationality *"
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
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                {customerTypeValue === "I" && (
                  <>
                  <p className="enter-text-category">Place Of Birth</p>
                    <Col md={24}>
                      <InputText
                        fieldname="PlaceOfBirth"
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
                              <Option key={index} value={value.riskItem} >{value.riskItem}</Option>
                            )
                          })}
                        </Select>
                      </InputText>
                    </Col>
                  </>
                )}
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Customer Id Number</p>
                <InputText
                  fieldname="CustomerIdNumber"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter customer Id number." />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Customer Id Expiry</p>
                <InputText
                  fieldname="CustomerIdExpiry"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter customer Id expiry." />
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Match Category</p>
                <InputText
                  fieldname="MatchCategory"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter match category." />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Company Code</p>
                <InputText
                  fieldname="CompanyCode"
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter company code." />
                </InputText>
              </Col>
            </Row>
            <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Datasets<span className="red">*</span></p>
                <InputText
                  fieldname="Datasets"
                  rules={[{ required: true, message: "Datasets are required!" }]}
                  className="modal_inputField select"
                >
                  <Select
                    placeholder="Select datasets"
                    mode="multiple"
                    options={datasetsOptions?.map((item: any) => ({
                      label: item,
                      value: item,
                    }))}
                    maxTagCount="responsive"
                    className="datasets-custom-menu"
                    allowClear
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    onChange={(e) => { setDatasetValue(e) }}
                  >
                    {
                      datasetsOptions?.map((item: any) => (
                        <Option key={item} value={item}>
                          {item}
                        </Option>
                      ))
                    }
                  </Select>
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Is FATF Monitoring<span className="red">*</span></p>
                <InputText
                  fieldname="fatf"
                  rules={[
                    { required: true, message: "Is the country subject to increased monitoring by FATF?" },
                  ]}
                  className="inputField select"
                >
                  <Select
                    placeholder="Is FATF Monitoring *"
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                  >
                    {fatfList?.length > 0 && fatfList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.id} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </InputText>
              </Col>
            </Row>
            {digiScreeningPayload?.shareholders?.map((_:any, index: any) => (
              <div key={`shareholder_${index}`}>
                <Row gutter={16} className="mt-3">
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <p className="enter-text-category">First Name<span className="red">*</span></p>
                    <InputText
                      fieldname={`shareholder${index + 1}_FirstName`}
                      className="inputField w-100 error-input"
                      rules={[
                        {
                          required: true,
                          message: "First name is required!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter first name." />
                    </InputText>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <p className="enter-text-category">Middle Name</p>
                    <InputText
                      fieldname={`shareholder${index + 1}_MiddleName`}
                      className="inputField w-100 error-input"
                    >
                      <Input placeholder="Enter middle name." />
                    </InputText>
                  </Col>
                </Row>
                <Row gutter={16} className="mt-3">
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <p className="enter-text-category">Last Name<span className="red">*</span></p>
                    <InputText
                      fieldname={`shareholder${index + 1}_LastName`}
                      className="inputField w-100 error-input"
                      rules={[
                        {
                          required: true,
                          message: "Last name is required!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter last name." />
                    </InputText>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <p className="enter-text-category">Gender<span className="red">*</span></p>
                    <InputText
                      fieldname={`shareholder${index + 1}_Gender`}
                      className="modal_inputField select  w-100"
                      rules={[
                        {
                          required: true,
                          message: "Gender is required!",
                        },
                      ]}
                    >
                      <Select
                        placeholder="Select gender"
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        onChange={(e) => { setGenderValue(e) }}
                      >
                        <Select.Option value="Male">Male</Select.Option>
                        <Select.Option value="Female">Female</Select.Option>
                      </Select>
                    </InputText>
                  </Col>
                </Row>
                <Row gutter={16} className="mt-3">
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                <p className="enter-text-category">Nationality</p>
                <InputText
                  fieldname={`shareholder${index + 1}_Nationality`}
                  className="inputField w-100 error-input"
                >
                  <Input placeholder="Enter nationality." />
                </InputText>
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <p className="enter-text-category">Date Of Birth</p>
                    <Col md={24}>
                      <InputText
                        fieldname={`shareholder${index + 1}_DOB`}
                        className="inputField w-100 error-input"
                      >
                       <DatePicker
                format={{
                  format: 'DD-MM-YYYY',
                  type: 'mask',
                }}
                disabledDate={(current:any) => {
                  return current > moment().subtract(18, "years");
                }}                

                placeholder="Select date of birth"
              />
                      </InputText>
                    </Col>
              </Col>
            </Row>
              </div>
            ))}
            {representativeDetails && representativeDetails?.isCorporateShareholder === true && (<>
              <Row gutter={16} className="mt-3">
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <p className="enter-text-category">Threshold<span className="red">*</span></p>
                  <InputText
                    fieldname="companyThreshold"
                    className="inputField w-100 error-input"
                    rules={[
                      {
                        required: true,
                        message: "Threshold is required!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter Threshold number" type="number" />
                  </InputText>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <p className="enter-text-category">Company name<span className="red">*</span></p>
                  <InputText
                    fieldname="CompanyName"
                    className="inputField w-100 error-input"
                    rules={[
                      {
                        required: true,
                        message: "Company name is required!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter match company name." />
                  </InputText>
                </Col>
              </Row>
              <Row gutter={16} className="mt-3">
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <p className="enter-text-category">Date of incorporation</p>
                  <InputText
                    fieldname="companyDob"
                    className="modal_inputField select  w-100"
                  >
                    <DatePicker
                      format={{
                        format: 'DD-MM-YYYY',
                        type: 'mask',
                      }}
                      disabledDate={(current: any) => {
                        return current && current.valueOf() > Date.now()
                      }}
                      placeholder="Select date of incorporation"
                    />
                  </InputText>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <p className="enter-text-category">Datasets<span className="red">*</span></p>
                  <InputText
                    fieldname="companyDatasets"
                    rules={[{ required: true, message: "Datasets are required!" }]}
                    className="modal_inputField select"
                  >
                    <Select
                      placeholder="Select datasets"
                      mode="multiple"
                      options={datasetsOptions?.map((item: any) => ({
                        label: item,
                        value: item,
                      }))}
                      maxTagCount="responsive"
                      className="datasets-custom-menu"
                      allowClear
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      onChange={(e) => { setDatasetValue(e) }}
                    >
                      {
                        datasetsOptions?.map((item: any) => (
                          <Option key={item} value={item}>
                            {item}
                          </Option>
                        ))
                      }
                    </Select>
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
              className="modal-button-cancel mt-5 mx-2 search-model-cancel-btn"
              onClick={() => handleCancel()}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Modal >
    </>
  )
};

export default SearchAgainKybKycModal;




