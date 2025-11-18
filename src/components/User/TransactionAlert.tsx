import React from 'react';
import CopyIcon from "../../assets/img/copy_icon.svg";
import { Row, Col } from 'antd';


interface TransactionAlertProps {
  icon: string;
  alertType: string
  status: string;
  message: string;
  transactionRef: string;
  copySuccess: string;
  handleCopy: (text: string) => void;
}

const TransactionAlert: React.FC<TransactionAlertProps> = ({
  icon,
  alertType,
  status,
  message,
  transactionRef,
  copySuccess,
  handleCopy,
}) => {
  return (
    <Row gutter={16}>
      <Col md={14} xs={24} className="mb-2">
        <div className={`alert alert-${alertType} d-flex justify-content-between align-items-center flex-wrap`} role="alert">
          <div className="d-flex align-items-center section-equal vertical-divider-right">
            <img src={icon} className="alert-icon" alt="Icon" />
            <div className="mx-3">
              <p className="m-0">{message}</p>
            </div>
          </div>
          <div className="text-center section-equal vertical-divider-right pe-2 ps-2 d-flex flex-column">
            <p className="m-0 transaction-status">Transaction status</p>
            <p className="m-0">{status}</p>
          </div>
          <div className="d-flex align-items-center section-equal justify-content-end transaction-reference">
            <div>
              <p className="m-0 transaction-status">Transaction Reference No</p>
              <p className="m-0 text-center">{transactionRef}</p>
              {copySuccess && <p className="text-success m-0">{copySuccess}</p>}
            </div>
            <img
              src={CopyIcon}
              className="ms-3 copy-icon"
              onClick={() => handleCopy(transactionRef)}
              alt="Copy Icon"
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default TransactionAlert;
