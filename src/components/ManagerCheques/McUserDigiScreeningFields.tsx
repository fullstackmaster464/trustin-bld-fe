import React from "react";
import { Col, Form, Select, DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";

const { Option } = Select;

interface McUserDigiScreeningFieldsProps {
  entityType: "INDIVIDUAL" | "COMPANY" | string;
  width: number;
  prefix: "partyPoa" | "counterPoa" | "counterBroker";
  userExists?: boolean;
  professionTypeList?: any[];
  residenceStatusList?: any[];
  incoporationCountryList?: any[];
  businessNatureList?: any[];
  selectedDate?: any;
  handleDateChange?: (date: dayjs.Dayjs | null, dateString: string | string[]) => void;
}

const McUserDigiScreeningFields: React.FC<McUserDigiScreeningFieldsProps> = ({
  entityType,
  width,
  userExists,
  prefix,
  professionTypeList = [],
  residenceStatusList = [],
  incoporationCountryList = [],
  businessNatureList = [],
  selectedDate,
  handleDateChange,
}) => {
  const isDesktop = width > 992;
  const span = isDesktop ? 8 : 24;
  const field = (name: string) => `${prefix}${name}`;
  
  if (entityType === "INDIVIDUAL" && residenceStatusList?.length > 0 && professionTypeList?.length > 0) {
    return (
      <>
        {/* Profession */}
        <Col span={span} className="pe-4">
          <p className="seller-text-category">
            Profession <span className="red">*</span>
          </p>
          <Form.Item
            name={field("Profession")}
            rules={[{ required: true, message: "Profession is required!" }]}
            className="modal_inputField w-100 select"
          >
            <Select
              placeholder="Select profession"
              style={{ minWidth: "370px" }}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              disabled={userExists}
            >
              {professionTypeList.map((value, index) => (
                <Option key={index} value={value.id}>
                  {value.riskItem}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Residence */}
        <Col span={span} className="pe-4">
          <p className="seller-text-category">
            Residence <span className="red">*</span>
          </p>
          <Form.Item
            name={field("ResidenceStatus")}
            rules={[{ required: true, message: "Residence is required!" }]}
            className="modal_inputField w-100 select"
          >
            <Select
              allowClear
              placeholder="Residence"
              showSearch
              optionFilterProp="children"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              disabled={userExists}
            >
              {residenceStatusList.map((value, index) => (
                <Option key={index} value={value.id}>
                  {value.riskItem}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </>
    );
  }

  if (entityType === "COMPANY" && incoporationCountryList?.length > 0 && businessNatureList?.length > 0) {
    return (
      <>
        {/* Country of incorporation */}
        <Col span={span} className="pe-4">
          <p className="seller-text-category">
            Country of incorporation <span className="red">*</span>
          </p>
          <Form.Item
            name={field("CountryofIncorporation")}
            rules={[
              {
                required: true,
                message: "Country of incorporation is required!",
              },
            ]}
            className="modal_inputField w-100 select"
          >
            <Select
              placeholder="Select country of incorporation"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              disabled={userExists}
            >
              {incoporationCountryList.map((value, index) => (
                <Option key={index} value={value.id}>
                  {value.riskItem}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Nature of business */}
        <Col span={span} className="pe-4">
          <p className="seller-text-category">
            Nature of business <span className="red">*</span>
          </p>
          <Form.Item
            name={field("NatureofBusiness")}
            rules={[
              { required: true, message: "Nature of business is required!" },
            ]}
            className="modal_inputField w-100 select"
          >
            <Select
              allowClear
              placeholder="Nature of business"
              showSearch
              optionFilterProp="children"
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              disabled={userExists}
            >
              {businessNatureList.map((value, index) => (
                <Option key={index} value={value.id}>
                  {value.riskItem}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Establishment date */}
        <Col span={span} className="pe-4">
          <p className="seller-text-category">
            Establishment date <span className="red">*</span>
          </p>
          <Form.Item
            name={field("Dob")}
            rules={[
              { required: true, message: "Establishment date is required!" },
            ]}
            className="modal_inputField w-100 select"
          >
            <DatePicker
              placeholder="Select Establishment date"
              value={selectedDate}
              format={{
                format: "DD-MM-YYYY",
                type: "mask",
              }}
              onChange={handleDateChange}
              disabled={userExists}
              disabledDate={(current: any) => {
                const customDate = moment().format("YYYY-MM-DD");
                return current && current > moment(customDate, "YYYY-MM-DD");
              }}
              className="w-100 d-flex"
            />
          </Form.Item>
        </Col>
      </>
    );
  }

  return null;
};

export default McUserDigiScreeningFields;
