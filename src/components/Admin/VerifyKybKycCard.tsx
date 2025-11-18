import { useState } from "react";
import { Card, Row, Col, Button, Space, Typography, Divider, Image, message } from "antd";
import "../../assets/scss/custom.scss";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import dayjs from "dayjs";
import SendData from '../../assets/img/send_data.svg';
import ReceivedData from '../../assets/img/recived_data.svg';
import { saveKyc } from "../../services/admin";
import { COMMON_DATA_SETS_ARR, CORPORATES_DATA_SETS_ARR, getLocalStorage, INDIVIDUALS_DATA_SETS_ARR } from "../Common/Constants";
const { Text } = Typography;

const VerifyKybKycCard = (props: any) => {
  const { setSearchKybModal, kybInfo, digiScreeningPayload, userAlias, formCheckKyB, riskAssessment, riskAssessmentFormPayload, riskAssessmentPayload, setDatasetsOptions, 
    representativeDetails,
    shareHoldingCompanyDigiScreeningPayload,
    shareHoldingCompanyDigiScreeningResponse } = props
  const [loading, setLoading] = useState(false);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  
  const saveKybData = async () => {
    setLoading(true);
    const reqbody = {
      userAlias,
      digiScreeningPayload: digiScreeningPayload,
      riskAssessment: riskAssessment,
      riskAssessmentFormPayload: riskAssessmentFormPayload,
      riskAssessmentPayload: riskAssessmentPayload,
    
      ...kybInfo
    }
    if (representativeDetails && representativeDetails?.isCorporateShareholder === true) {
      reqbody.type = 'with_company';
      reqbody.shareHoldingCompanyDigiScreeningPayload =shareHoldingCompanyDigiScreeningPayload;
      reqbody.shareHoldingCompanyDigiScreeningResponse =shareHoldingCompanyDigiScreeningResponse;
    }
    saveKyc(reqbody)
      .then((response) => {
        if (response?.data?.kycDetails?.status === 201 || response?.data?.kycDetails?.status === 200) {
          setLoading(false);
          message.success("DIGI screeing details updated successfully.")
        }
      }).catch((error) => {
        setLoading(false)
        message.error(error?.data?.error)
      });
  };
  const setDataForSearchAgainModal = () => {
    const datasets = digiScreeningPayload?.CustomerType === "I" ? [...COMMON_DATA_SETS_ARR, ...INDIVIDUALS_DATA_SETS_ARR] : [...COMMON_DATA_SETS_ARR, ...CORPORATES_DATA_SETS_ARR];
    setDatasetsOptions(datasets)
    digiScreeningPayload?.shareholders?.forEach((shareholder: any, index: any) => {
        formCheckKyB.setFieldsValue({
          [`shareholder${index + 1}_DOB`]: dayjs(shareholder.DOB),
          [`shareholder${index + 1}_Gender`]: shareholder.Gender,
          [`shareholder${index + 1}_LastName`]: shareholder.LastName,
          [`shareholder${index + 1}_FirstName`]: shareholder.FirstName,
          [`shareholder${index + 1}_MiddleName`]: shareholder.MiddleName,
          [`shareholder${index + 1}_Nationality`]: shareholder.Nationality,
        });    
    });
    formCheckKyB.setFieldsValue({
      Threshold: parseInt(digiScreeningPayload?.Threshold),
      CustomerType: digiScreeningPayload?.CustomerType,
      LastName: digiScreeningPayload?.LastName,
      FirstName: digiScreeningPayload?.FirstName,
      MiddleName: digiScreeningPayload?.MiddleName,
      Datasets: digiScreeningPayload?.Datasets,
      Nationality: digiScreeningPayload?.Nationality,
      PlaceOfBirth: digiScreeningPayload?.PlaceOfBirth,
      CustomerIdNumber: digiScreeningPayload?.CustomerIdNumber,
      CustomerIdExpiry: digiScreeningPayload?.CustomerIdExpiry,
      Gender: digiScreeningPayload?.Gender,
      MatchCategory: digiScreeningPayload?.MatchCategory,
      CompanyCode: digiScreeningPayload?.CompanyCode,
      dob: digiScreeningPayload?.DOB ? dayjs(digiScreeningPayload?.DOB) : ""
    });
    if (representativeDetails && representativeDetails?.isCorporateShareholder === true) {
      formCheckKyB.setFieldsValue({
        companyThreshold: parseInt(shareHoldingCompanyDigiScreeningPayload?.Threshold),
        CompanyName: shareHoldingCompanyDigiScreeningPayload?.LastName,
        companyDatasets: shareHoldingCompanyDigiScreeningPayload?.Datasets,
        companyDob: shareHoldingCompanyDigiScreeningPayload?.DOB ? dayjs(shareHoldingCompanyDigiScreeningPayload?.DOB) : ""
      });
    }
    setSearchKybModal(true);
  };

  const renderDetails = (data: any) => (
    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start justify-content-between">
      {Object?.entries(data)?.map(([key, value]: any) => (
        <Col xs={24} sm={12} md={12} lg={4} key={key}>
          <Space direction="vertical">
            <Text type="secondary"><b>{key ?? "---"}</b></Text>
            <Text><b>{key === "highestScoringResult" ? "--" : value !== null && typeof value === 'object' ? JSON.stringify(value) : value ?? "---"}</b></Text>
          </Space>
        </Col>
      ))}
    </Row>
  );

  const generateColumn = (label:string, value:any) =>(
    <Col xs={24} sm={12} md={12} lg={4}>
    <Space direction="vertical">
      <Text type="secondary"> <b>{label}</b></Text>
      <Text> <b>{value ?? "---"}</b> </Text>
    </Space>
  </Col>
  );

  return (
    <>
      <Col className="mt-4 screening-header-title">
        <div className="titleText">DIGI screening details</div>
        <SecondaryOutLineButton
          children="Search again"
          className="px-3 search-btn"
          onClick={() => { setDataForSearchAgainModal() }}
        />
      </Col>
      <Card className="my-3 details-card">
        <div className="subText_medium border-left mb-4 sub-title-align">
          <b>Send data</b>
          <Image src={SendData} alt="sendData" preview={false} />
        </div>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start gap-5">
          {generateColumn("Threshold", digiScreeningPayload?.Threshold)}
          {generateColumn("Customer type", digiScreeningPayload?.CustomerType && digiScreeningPayload?.CustomerType == "I" ? "Individual" : digiScreeningPayload?.CustomerType == "C" ? "Company" : "")}
          {generateColumn("First name", digiScreeningPayload?.FirstName)}
          {generateColumn("Middle name", digiScreeningPayload?.MiddleName)}
          {generateColumn("Last name", digiScreeningPayload?.LastName)}

          {digiScreeningPayload?.CustomerType === "I" &&
            generateColumn("Gender", digiScreeningPayload?.Gender)
          }
          {generateColumn(digiScreeningPayload?.CustomerType === "I" ? "DOB" : "Establishment date", dayjs(digiScreeningPayload?.DOB).format("DD-MM-YYYY"))}
          {generateColumn("Nationality", digiScreeningPayload?.Nationality)}
          {digiScreeningPayload?.CustomerType === "I" &&
            generateColumn("Place of birth", digiScreeningPayload?.PlaceOfBirth)
          }
          {generateColumn("Customer id", digiScreeningPayload?.CustomerId)}
          {generateColumn("Id expiry", digiScreeningPayload?.CustomerIdExpiry)}
          {generateColumn("Match category", digiScreeningPayload?.MatchCategory)}
          {generateColumn("Company code", digiScreeningPayload?.CompanyCode)}
          {generateColumn("Datasets", digiScreeningPayload?.Datasets?.length > 0 ? digiScreeningPayload?.Datasets.toString() : "---")}
          {digiScreeningPayload?.CustomerType && digiScreeningPayload?.CustomerType == "C" && (
            generateColumn("Company Name", digiScreeningPayload?.CompanyName)
          )}
          {digiScreeningPayload?.CustomerType && digiScreeningPayload?.CustomerType == "I" && (
            generateColumn("Customer id type", digiScreeningPayload?.CustomerIdType)
          )}
        </Row>
        <Divider plain></Divider>
        <div className="subText_medium border-left mb-4 sub-title-align">
          <b>Received data</b>
          <Image src={ReceivedData} alt="receivedData" preview={false} />
        </div>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start justify-content-between">
          {generateColumn("Is matched", kybInfo?.isMatched)}
          {generateColumn("Match score", kybInfo?.matchScore)}
          {generateColumn("Case id", kybInfo?.caseId)}
          {generateColumn("Customer id", kybInfo?.customerId)}
          {generateColumn("Id", kybInfo?.highestScoringResult?.id)}
        </Row>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start justify-content-between">
          {generateColumn("Primary name", kybInfo?.highestScoringResult?.primaryName)}
          {generateColumn("Matched name", kybInfo?.highestScoringResult?.matchedName)}
          {generateColumn("Nationality", kybInfo?.highestScoringResult?.nationality)}
          {generateColumn(digiScreeningPayload?.CustomerType === "I" ? "DOB" : "Establishment date", digiScreeningPayload?.highestScoringResult?.dob ? dayjs(digiScreeningPayload?.highestScoringResult?.dob).format("DD-MM-YYYY") : "---")}
          {generateColumn("Data sets", kybInfo?.highestScoringResult?.datasets?.toString())}
        </Row>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start justify-content-between">
          {generateColumn("isPEP", kybInfo?.highestScoringResult?.isPEP && kybInfo.highestScoringResult.isPEP === true ? "True" : "False")}
          {generateColumn("", "")}
          {generateColumn("", "")}
          {generateColumn("", "")}
        </Row>
        {(digiScreeningPayload?.digiScreeningType === "with_share_holder" || kybInfo?.digiScreeningType === "with_share_holder") && (digiScreeningPayload?.CustomerType == "C") && (
          <>
            {kybInfo?.shareholders?.map((elem: any, i: any) => {
              return (
                <div key={i}>
                  {renderDetails(elem)}
                </div>
              );
            })}
            {representativeDetails?.isCorporateShareholder === true && shareHoldingCompanyDigiScreeningResponse &&
              typeof shareHoldingCompanyDigiScreeningResponse === 'object' &&
              Object.keys(shareHoldingCompanyDigiScreeningResponse)?.length > 0 && (
                renderDetails(shareHoldingCompanyDigiScreeningResponse)
              )}
          </>
        )}
        <Divider plain></Divider>
        <Row className={userType === "SUPPORT_ENGINEER"?"d-none": "verify-btn-row"}>
          <Button
            className="rounded rounded-verify-btn"
            onClick={saveKybData}
            loading={loading}
          >
            Verify
          </Button>
        </Row>
      </Card>
    </>
  );
};
export default VerifyKybKycCard;