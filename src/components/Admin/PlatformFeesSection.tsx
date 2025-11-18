import { Col, Row, Space, Typography, Image } from 'antd';
import { USER_STATUS_TEXT } from '../Common/Constants';
import Editicon from "../../assets/img/EditIcon.svg";
const { Text } = Typography;


interface PlatformFeesSectionProps {
  platformFees: any;
  onTitleClick: (feesData: any) => void;
}

export const PlatformFeesSection: React.FC<PlatformFeesSectionProps> = ({ platformFees, onTitleClick }) => {
  let title = 'User platform fees';

  if (platformFees?.transactionType === 'ESCROW') {
    title = 'User platform fees for Escrow';
  } else if (platformFees?.transactionType === 'MC') {
    title = 'User platform fees for Manager Cheque';
  }

  return (
    <div>
      <div
        className="subText_medium border-left mt-4"
      >
        <div className='d-flex'>
        <b>{title}</b>
        <span className="cursor ml-5 mt-0">
          <Image
            src={Editicon}
            alt="edit"
            preview={false}
            height={17}
            width={17}
            onClick={() => {
              onTitleClick(platformFees)
            }}
          />
        </span>
      </div>
      </div>
      <Row className="my-2 row-gap-2" gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary"><b>PlatformCharge Type:</b></Text>
            <Text><b>{platformFees?.platformChargeType || 'N/A'}</b></Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary"><b>Platform Fees:</b></Text>
            <Text><b>{platformFees?.platformFees || 'N/A'}</b></Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary"><b>Transaction Type:</b></Text>
            <Text><b>{platformFees?.transactionType || 'N/A'}</b></Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary"><b>Status:</b></Text>
            <Text><b className={platformFees?.status === "active" ? "status" : ""}>
              <span className={USER_STATUS_TEXT[platformFees?.status].toLowerCase()}>
                {USER_STATUS_TEXT[platformFees?.status]}
              </span>
            </b></Text>
          </Space>
        </Col>
      </Row>
    </div>
  );
};
