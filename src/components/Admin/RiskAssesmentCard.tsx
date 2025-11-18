import { Card, Row, Col, Space, Typography } from "antd";
import "../../assets/scss/custom.scss";
const { Text } = Typography;

const RiskAssesmentCard = ({ riskAssessment }: any) => {

  return (
    <>
      <Col className="mt-4 screening-header-title">
        <div className="titleText">Risk assessment</div>
      </Col>

      <Card className="mb-4 mt-3 p-3">
        <Row gutter={{ xs:25, sm: 25, md: 25, lg: 25 }} className="mb-4 d-flex align-items-start justify-content-between">
          <Col xs={24} sm={12} md={12} lg={4}>
            <Space direction="vertical">
              <Text type="secondary"> <b>Total parameter</b></Text>
              <Text> <b>{riskAssessment?.totalParameter ?? "---"}</b> </Text>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={12} lg={4}>
            <Space direction="vertical">
              <Text type="secondary"> <b>Total score</b></Text>
              <Text> <b>{riskAssessment?.totalScore ?? "---"}</b> </Text>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={12} lg={4}>
            <Space direction="vertical">
              <Text type="secondary"> <b>Final risk score</b></Text>
              <Text> <b>{riskAssessment?.finalRiskScore ?? "---"}</b> </Text>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={12} lg={4}>
            <Space direction="vertical">
              <Text type="secondary"> <b>Risk as per score</b></Text>
              <Text> <b>{riskAssessment?.riskAsPerScore ?? "---"}</b> </Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default RiskAssesmentCard;
