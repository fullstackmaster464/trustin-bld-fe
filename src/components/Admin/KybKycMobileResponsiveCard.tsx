import  { useCallback, useState } from 'react';
import { Card, Row, Col, Checkbox, Image } from 'antd';
import moment from 'moment';
import View from "../../assets/img/view.svg";
import Download from "../../assets/img/download.svg";
import tickicon from "../../assets/img/tick_icon.svg";
import timeicon from "../../assets/img/time_icon.svg";
import { AdminKYBDetail, AdminKYCDetail } from '../Common/RouteConst';
import { useLocation, useNavigate } from 'react-router-dom';
import { ENTITY_TYPE } from '../Common/Constants';

const KybKycMobileResponsiveCard = (props: any) => {
  const { KybList, download, setSelected, selectedUserAlias, setSelectedUserAlias,selectAll, setSelectAll, type } = props;
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const showRepName =location.pathname === "/stryde-kyb-management-list" || location.pathname === "/stryde-kyc-management-list";

  const onCheckboxChange = (userAlias: string, rowData: any) => {
    const updatedSelectedUserAlias = [...selectedUserAlias];
    const updatedSelectedRows = [...selectedRows];

    const isSelected = updatedSelectedUserAlias.includes(userAlias);

    if (isSelected) {
      const index = updatedSelectedUserAlias.indexOf(userAlias);
      if (index !== -1) {
        updatedSelectedUserAlias.splice(index, 1);
      }
      const rowIndex = updatedSelectedRows.findIndex((row) => row.userAlias === userAlias);
      if (rowIndex !== -1) {
        updatedSelectedRows.splice(rowIndex, 1);
      }
    } else {
      updatedSelectedUserAlias.push(userAlias);
      updatedSelectedRows.push(rowData);
    }
    updatedSelectedUserAlias?.length > 0 ? setSelected(true) : setSelected(false)
    setSelectedUserAlias(updatedSelectedUserAlias);
    setSelectedRows(updatedSelectedRows);
    setSelectAll(updatedSelectedUserAlias.length === KybList.length);
   
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedUserAlias([]);
      setSelectedRows([]);
      setSelected(false)
    } else {
      const allUserAliases = KybList.map((item: any) => item.userAlias);
      setSelectedUserAlias(allUserAliases);
      setSelectedRows([...KybList]);
      setSelected(true)
    }
    setSelectAll(!selectAll);
  };

  const handleNavigate = useCallback((item:any, navigate:any) => {
    const destination = item?.typeOfEntity === "COMPANY" ? AdminKYBDetail : AdminKYCDetail;
    navigate(`${destination}/${item?.userAlias}`);
  }, []);

  return (
    <>
      <div className="select-all-box">
      {!["strydeKyc", "strydeKyb"].includes(type) && (
        <Checkbox checked={selectAll} onChange={toggleSelectAll}>Select all </Checkbox>
      )}
      </div>
      {KybList.map((item: any, index: any) => (        
        <Card key={index} className="noBorder kyc-table-list-card-wrap mobile-kyc-listing-card mb-4">
          <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }}>
            <Col xs={2} sm={2}>
              <div>
                {!["strydeKyc", "strydeKyb"].includes(type) && (
                  <Checkbox
                    checked={selectedUserAlias.includes(item.userAlias)}
                    onChange={() => onCheckboxChange(item.userAlias, item)}
                  />
                )}
              </div>
            </Col>
            <Col xs={22} sm={22}>
              <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4">
                <Col xs={14} sm={14} md={12} lg={8}>
                  <div className="data-group-items">
                    <div className="label-name">Name</div>
                    <div className="name-value-text"><span className='hyperLink' onClick={() => {handleNavigate(item, navigate)}}>{showRepName ? item?.repName : item?.name || "--"}</span></div>
                  </div>
                </Col>
                <Col xs={10} sm={10} md={12} lg={8}>
                  <div className="data-group-items">
                    <div className="label-name">Date</div>
                    <div className="name-value-text">{moment(new Date(item?.createAt)).format("DD-MM-YYYY")}</div>
                  </div>
                </Col>
              </Row>

              <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4">
                <Col xs={14} sm={14} md={12} lg={8}>
                  <div className="data-group-items">
                    <div className="label-name">Email address</div>
                    <div className="name-value-text card-email-text">{item?.email}</div>
                  </div>
                </Col>
                <Col xs={10} sm={10} md={12} lg={8}>
                  <div className="data-group-items">
                    <div className="label-name">Entity Type</div>
                    <div className="name-value-text">{ENTITY_TYPE[item?.typeOfEntity]}</div>
                  </div>
                </Col>
              </Row>
              <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4">
                <Col xs={10} sm={10} md={12} lg={8}>
                  <div className="data-group-items">
                    <div className="label-name">Status</div>
                   {(item?.status === "VERIFIED" || 
                      item?.kybStatus === "VERIFIED" || 
                      item?.verificationStatus === "VERIFIED") ? (
                        <div className="active capitalize name-value-text view-text-row d-flex align-items-center">
                          <Image src={tickicon} preview={false} />
                          <div className="name-value-text mx-2 pt-2">
                            {item?.kybStatus || item?.status || item?.verificationStatus || "--"}
                          </div>
                        </div>) : (
                        <div className="pending capitalize d-flex align-items-center">
                          <Image src={timeicon} preview={false} />
                          <div className="name-value-text mx-2 pt-2">
                            {item?.kybStatus || item?.status || item?.verificationStatus || "--"}
                          </div>
                        </div>
                    )}
                  </div>
                </Col>
              </Row>
              <Row gutter={{ xs: 25, sm: 25, md: 25, lg: 25 }} className="mb-4">
                <Col xs={20} sm={20} >
                  <div className="data-group-items">
                    <div className="label-name">Action</div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="name-value-text view-text-row">View
                        <Image src={View} preview={false}
                          className="px-2"
                            onClick={() => {handleNavigate(item, navigate)}}
                        />
                      </div>
                      {!["strydeKyc", "strydeKyb"].includes(type) && (
                        <div className="name-value-text"> Download
                          <Image
                            src={Download}
                            alt="dowload"
                            className="px-2"
                            height={20}
                            width={35}
                            preview={false}
                            onClick={() => { download(item?.userAlias) }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      ))}
    </>
  );
};

export default KybKycMobileResponsiveCard;
