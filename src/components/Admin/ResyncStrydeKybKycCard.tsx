import { useState } from "react";
import { Card, Row, Col, Button, Space, Typography, Divider, Image, message } from "antd";
import "../../assets/scss/custom.scss";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import dayjs from "dayjs";
import SendData from '../../assets/img/send_data.svg';
import ReceivedData from '../../assets/img/recived_data.svg';
import { getStrydeDigiscreeningSave, syncStrydeDetails } from "../../services/admin";
import { getLocalStorage } from "../Common/Constants";
const { Text } = Typography;

const ResyncStrydeKybKycCard = (props: any): any => {
  const { setSearchKybModal, digiScreeningPayload, digiScreeningResult, strydeAlias, entityType, formCheckKyB, riskAssessment, riskAssessmentPayload, uboDetails, uboPayload, uboResult, strydeResyncPayload } = props
  const [loading, setLoading] = useState(false);
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const saveStrydeDigiscreeningSave = async () => {
    setLoading(true);
    const reqbody = {
      strydeAlias,
      digiScreeningPayload: digiScreeningPayload,
      digiScreeningResult: digiScreeningResult,
      riskAssessment: riskAssessment,
      riskAssessmentPayload: riskAssessmentPayload,
      uboPayload: uboPayload ?? [],
      uboResult: uboResult ?? [],
    }

    getStrydeDigiscreeningSave(strydeAlias, reqbody)
      .then((response) => {
        if (response?.status === 201 && response?.data?.affected > 0) {
          setLoading(false);
          message.success("DIGI screeing details updated successfully.")
        }
      }).catch((error) => {
        setLoading(false)
        message.error(error?.data?.error)
      });

  };
  const setDataForSearchAgainModal = () => {
    if (entityType === "COMPANY") {
      uboDetails?.forEach((ubo: any, index: any) => {
        formCheckKyB.setFieldsValue({
          [`ubo${index + 1}_dob`]: dayjs(ubo.dob),
          [`ubo${index + 1}_name`]: ubo.name,
          [`ubo${index + 1}_nationality`]: ubo.nationality,
        });
      });
    }

    formCheckKyB.setFieldsValue({
      thresold: parseInt(digiScreeningPayload?.thresold),
      customerType: digiScreeningPayload?.customerType,
      repName: digiScreeningPayload?.lastName,
      repNationality: digiScreeningPayload?.nationality,
      repBirthCountry: digiScreeningPayload?.birthPlace,
      customerIdNumber: digiScreeningPayload?.customerIdNumber,
      customerIdExpiry: digiScreeningPayload?.customerIdExpiry,
      matchCategory: digiScreeningPayload?.matchCategory,
      repDob: digiScreeningPayload?.dob ? dayjs(digiScreeningPayload?.dob) : ""
    });

    setSearchKybModal(true);
  };

  const renderDetails = (data: any) => (
    <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center justify-content-between">
      {Object?.entries(data)?.map(([key, value]: any) => (
        <Col xs={24} sm={12} md={12} lg={4} key={key}>
          <Space direction="vertical">
            <Text type="secondary"><b>{key ?? "---"}</b></Text>
            <Text><b>{value !== null && typeof value === 'object' ? JSON.stringify(value) : value ?? "---"}</b></Text>
          </Space>
        </Col>
      ))}
    </Row>
  );

  const generateColumn = (label: string, value: any) => (
    <Col xs={24} sm={12} md={12} lg={4}>
      <Space direction="vertical">
        <Text type="secondary"> <b>{label}</b></Text>
        <Text> <b>{value ?? "---"}</b> </Text>
      </Space>
    </Col>
  );

  const handleResyncStryde = async () => {
    await syncStrydeDetails(strydeResyncPayload).then(() => {
    }).catch((error: any) => {
      if (error?.data?.statusCode === 409) {
        message.error(error?.data?.error?.message)
      } else {
        message.error("Could not fetch details. Please try again later.")
      }
    });
  };
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
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-center gap-5">
          {generateColumn("Threshold", digiScreeningPayload?.thresold)}
          {generateColumn("Customer type", digiScreeningPayload?.customerType && digiScreeningPayload?.customerType == "I" ? "Individual" : digiScreeningPayload?.customerType == "C" ? "Company" : "")}
          {generateColumn("Name", digiScreeningPayload?.repName)}
          {generateColumn("DOB", dayjs(digiScreeningPayload?.dob).format("DD-MM-YYYY"))}
          {generateColumn("Nationality", digiScreeningPayload && (Array.isArray(digiScreeningPayload?.nationality)) ? digiScreeningPayload?.nationality.toString() : digiScreeningPayload?.nationality ?? "---")}
          {generateColumn("Place of birth", digiScreeningPayload?.repBirthCountry)}
          {generateColumn("Customer id", digiScreeningPayload?.customerId)}
          {generateColumn("Id expiry", digiScreeningPayload?.customerIdExpiry)}
          {generateColumn("Match category", digiScreeningPayload?.matchCategory)}
        </Row>
        <Divider plain></Divider>
        <div className="subText_medium border-left mb-4 sub-title-align">
          <b>Received data</b>
          <Image src={ReceivedData} alt="receivedData" preview={false} />
        </div>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start justify-content-between">
          {generateColumn("Is matched", digiScreeningResult?.isMatched)}
          {generateColumn("Match score", digiScreeningResult?.matchScore)}
          {generateColumn("Case id", digiScreeningResult?.caseId)}
          {generateColumn("Customer id", digiScreeningResult?.customerId)}
          {generateColumn("Id", digiScreeningResult?.highestScoringResult?.id)}
        </Row>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start justify-content-between">
          {generateColumn("Primary name", digiScreeningResult?.highestScoringResult?.primaryName)}
          {generateColumn("Matched name", digiScreeningResult?.highestScoringResult?.matchedName)}
          {generateColumn("Nationality", digiScreeningResult?.highestScoringResult?.nationality ?? "---")}
          {generateColumn(digiScreeningPayload?.customerType === "I" ? "DOB" : "Establishment date", digiScreeningResult?.highestScoringResult?.dob ? dayjs(digiScreeningResult?.highestScoringResult?.dob).format("DD-MM-YYYY") : "---")}
          {generateColumn("Data sets", digiScreeningResult?.highestScoringResult?.datasets?.toString())}
        </Row>
        <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start justify-content-between">
          {generateColumn("isPEP", digiScreeningResult?.highestScoringResult?.isPEP && digiScreeningResult.highestScoringResult.isPEP === true ? "True" : "False")}
          {generateColumn("", "")}
          {generateColumn("", "")}
          {generateColumn("", "")}
        </Row>
        {(entityType === "COMPANY") && (uboDetails?.length > 0) && (
          <>
            {uboDetails?.map(({ name, nationality, dob }: any, i: any) => {
              return (
                <div key={i}>
                  {renderDetails({ name, nationality, dob })}
                </div>
              );
            })}
          </>
        )}
        <Divider plain></Divider>
        <Row className={userType === "SUPPORT_ENGINEER"?"d-none":"verify-btn-row"}>
          <SecondaryOutLineButton
            children="Resync"
            className="px-3 rounded-verify-btn mx-3"
            onClick={() => { handleResyncStryde() }}
          />
          <Button
            className="rounded rounded-verify-btn"
            onClick={saveStrydeDigiscreeningSave}
            loading={loading}
          >
            Verify
          </Button>
        </Row>
      </Card>
    </>
  );
};
export default ResyncStrydeKybKycCard;