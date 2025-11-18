/* eslint-disable @typescript-eslint/ban-types */
import { useState } from "react";
import { Card, Row, Col,  Select, Button, Input, Form } from "antd";
import "../../assets/scss/custom.scss";
import { Option } from "antd/lib/mentions";
import { InputText } from "../ui-elements/InputsRepo";
import {  FilterType, KYC_KYB_FILTER_STATUS_ARR, TRANSACTIONS_FILTER_STATUS_ARR, contractStatusMapFilter } from "../Common/Constants";
// import moment from "moment";
// import dayjs from "dayjs";

interface FilterOption {
  id: string;
  value: string;
}

export interface FilterOptions  {
  startDate?:string|Date,
  endDate?:string|Date,
  customStatus?:string,
  emailAddress?:string
}


interface FilterCardProps {
  setLoading: (loading: boolean) => void;
  handleApplyFilter: (filterOptions: FilterOptions) => void;
  fetchEscrowTransactionList?:Function|any;
  fetchKybList?:Function|any;
  fetchUsersList?:Function|any;
  fetchcontractList?:Function|any;
  fetchSellerVerificationList?:Function|any;
  filterType: any;
  setSearchedKey:any;
  type?:any;
  setCurrent?:any;
  setPage?:any;
}
const FilterCard = (props:FilterCardProps):any => {
  // const [startDate, setStartDate] = useState<any>("");
  // const [endDate, setEndDate] = useState<any>("");
  const [customStatus, setCustomStatus] = useState<string>("All");
  const [emailAddress, setEmailAddress] = useState<string>("");
  // const handleStartDateChange = (_date: any, dateString:string | string[]) => {
  //   setStartDate(dateString);
  // };
  const [form] = Form.useForm();
  // const handleEndDateChange = (_date: any,dateString:string | string[]) => {
  //   setEndDate(dateString);
  // };
  const handleCustomStatusChange = (value: string) => {
    setCustomStatus(value);
  };
  const handleEmailAddressChange = (e: any) => {
    setEmailAddress(e?.target?.value);
  };
  const handleApplyButtonClick = () => {
    const filterOptions = {
      // startDate:DateWithUtcOffset(startDate),
      // endDate:DateWithUtcOffset(endDate),
      customStatus,
      emailAddress,
    };
    props?.setLoading(true);
    props?.handleApplyFilter(filterOptions);
  };
  const handleResetAllClick = () => {
    // setStartDate("");
    // setEndDate("");
    setCustomStatus("All");
    setEmailAddress("");
    props?.setLoading(true);  
    props?.setSearchedKey(""); 
    props?.setCurrent(1); 
    props?.setPage(10); 
    if (props?.filterType === FilterType.ESCROW_TRANSACTION && props?.fetchEscrowTransactionList !== undefined) {
      props?.fetchEscrowTransactionList(1, 10, "all");
    }else if(props?.filterType === FilterType.CONTRACT_LIST &&  props?.fetchcontractList !== undefined){
      props?.fetchcontractList(1, 10, "all");
    }else if(props?.filterType === FilterType.KYC &&  props?.fetchKybList !== undefined && !props?.fetchSellerVerificationList){
      props?.fetchKybList(1, 10, "all", {}, "INDIVIDUAL");
    }else if(props?.filterType === FilterType.KYB &&  props?.fetchKybList !== undefined){
      props?.fetchKybList(1, 10, "all", {}, "COMPANY");
    }else if(props?.filterType === FilterType.STATUS &&  props?.fetchUsersList !== undefined){
      props?.fetchUsersList(1, 10, "all", {});
    }else if(props?.filterType === FilterType.KYC &&  props?.fetchSellerVerificationList !== undefined){
      props?.fetchSellerVerificationList(1, 10, "all");
      props?.setPage(10); 
    }
    form.resetFields();
  };
  // const hasFilterValue =
  //   startDate ||
  //   endDate ||
  //   customStatus !== "All" ||
  //   emailAddress.trim() !== "";

    const renderOptions = (options: FilterOption[]) => {
      return options.map((item:any, index:any) => (
        <Option key={index} value={item.id}>
          {item.value}
        </Option>
      ));
    };

  return (
    <div className="filter-container mb-4 mt-3">
      <Card className="grayCard p-3 filter-card">
        <div className="bold-text pb-2">Filters</div>
        <Form form={form} onFinish={handleApplyButtonClick}>
          <Row gutter={[16, 16]}>
          {/* <Col xs={24} sm={12} md={8} lg={6}>
            <InputText
              fieldname="date_start"
              className="filterInputField"
              rules={[
                {
                  required:(endDate || customStatus !== '') ,
                  message: "Date is required!",
                },
                {
                  validator: (_:any, value:any) => {
                    const start = dayjs(value, 'DD-MM-YYYY');
                    const end = dayjs(endDate, 'DD-MM-YYYY');
                    if (!endDate || !value || start.isBefore(end, 'day') || start.isSame(end, 'day')) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('Start date must be smaller than end date');
                    }
                  }
                }
              ]}
            >
              <DatePicker
                placeholder="Select start date"
                value={startDate}
                onChange={(date: any, dateString:string | string[]) => handleStartDateChange(date,dateString)}
                format={{
                  format: 'DD-MM-YYYY',
                  type: 'mask',
                }}
                disabledDate={(current:any) => {
                  const customDate = moment().format("YYYY-MM-DD");
                  return current && current > moment(customDate, "YYYY-MM-DD");
                }} 
              />
            </InputText>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <InputText
              fieldname="date_end"
              className="filterInputField"
              rules={[
                {
                  required: (startDate || customStatus !== '') ,
                  message: "Date is required!",
                },
                {
                  validator: (_:any, value:any) => {
                    const start = dayjs(startDate, 'DD-MM-YYYY');
                    const end = dayjs(value, 'DD-MM-YYYY');                   
                    if (!startDate || !value || start.isBefore(end, 'day') || start.isSame(end, 'day')) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('End date must be greater than start date');
                    }
                  }
                }
              ]}
            >
              <DatePicker
                placeholder="Select end date"
                value={endDate}
                onChange={(date: any, dateString:string | string[]) => handleEndDateChange(date,dateString)}
                format={{
                  format: 'DD-MM-YYYY',
                  type: 'mask',
                }}
                style={{'width': '100%'}}
                disabledDate={(current:any) => {
                  const customDate = moment().format("YYYY-MM-DD");
                  return current && current > moment(customDate, "YYYY-MM-DD");
                }} 

              />
            </InputText>
          </Col> */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Select Status"
              value={props?.filterType === FilterType.STATUS ? undefined : customStatus}
              onChange={handleCustomStatusChange}
              className="filterInputField w-100"
            >
                {props?.filterType === FilterType.STATUS ? (
                  <>
                    <Option value="active">Active</Option>
                    <Option value="suspended">Inactive</Option>
                  </>
                ) : (
                  <Option value="All">All</Option>
                )}
                {(props?.filterType === FilterType.ESCROW_TRANSACTION) &&
                  renderOptions(TRANSACTIONS_FILTER_STATUS_ARR)
                }
                {props?.filterType === FilterType.CONTRACT_LIST &&
                  renderOptions(contractStatusMapFilter)
                }
                {(props?.filterType === FilterType.KYC || props?.filterType === FilterType.KYB) &&
                  renderOptions(KYC_KYB_FILTER_STATUS_ARR)
                }
            </Select>
          </Col>
            {!["strydeKyc", "strydeKyb"].includes(props?.type) && (
              <Col xs={24} sm={12} md={8} lg={6}>
                <InputText
                  fieldname="email"
                  className="filterInputField"
                  // rules={[
                  //   {
                  //     required: props?.filterType === FilterType.CONTRACT_LIST,
                  //     message: "Email address is required!",
                  //   },
                  //   {
                  //     pattern: emailRegex,
                  //     message: "Enter valid email!",
                  //   },
                  // ]}
                >
                  <Input
                    className="filterInputField"
                    value={emailAddress}
                    onChange={handleEmailAddressChange}
                    placeholder="Email address"
                  />
                </InputText>
              </Col>
            )}
          <Col xs={24} sm={24} md={6} lg={6} xl={4} >
          <div className="d-flex">
            <div className="text-right">
              <Button
                className="rounded min-width-17 px-4 mt-0"
                // onClick={handleApplyButtonClick}
                htmlType="submit"
              >
                Apply
              </Button>
            </div>
          {/* {hasFilterValue && ( */}
              <div className="text-right ms-2">
                <Button type="default" className="white-no-border-button pt-0" onClick={handleResetAllClick}>
                  Reset All
                </Button>
              </div>
          {/* )} */}
          </div>
          </Col>
        </Row>
        </Form>
      </Card>
    </div>
  );
};
export default FilterCard;
