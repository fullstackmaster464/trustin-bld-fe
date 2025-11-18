import { useEffect, useState } from "react";
import { getAllCountries, getCitiesList } from "../../services/user";
import { Col, message, Row, Space, Typography } from "antd";

const AddressDetails = (props: any) => {
  const { AddressData, type } = props;
  const [countryCodes, setCountryCodes] = useState<any>([]);
  const [SelectedCountry, setSelectedCountry] = useState<any>();
  const [SelectedCity, setSelectedCity] = useState<any>();
  const { Text } = Typography;

  const getCountryList = () => {
    getAllCountries()
      .then((response: any) => {
        setCountryCodes(response?.data);
      })
      .catch(() => {
        message.error("Could not fetch country. Please try again later");
      });
  };

  useEffect(() => {
    getCountryList();
  }, [AddressData]);

  useEffect(() => {
    let countryCode = [...countryCodes];
    const selectedCountry = countryCode.find((item: any) => {
      if (item?.isoCode === AddressData?.companyCountry) {
        return item;
      }
    });
    setSelectedCountry(selectedCountry?.name);
    getCityName(AddressData?.companyCountry);
  }, [countryCodes]);

  const getCityName = (countryCode: any) => {
    getCitiesList(countryCode).then((response) => {
      if (response?.status === 200) {
        const selectedCountry = response.data.citiesList.find((item: any) => {
          if (item?.code === AddressData?.companyCity) {
            return item;
          }
        });
        setSelectedCity(selectedCountry?.name);
      }
    });
  };

  return (
    <div>
      {/* <Row className="mt-3 row"> */}
      <Row className="my-4" gutter={[24, 24]}>
        {type == "kyb" && (
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <Space direction="vertical">
              <Text type="secondary">
                {" "}
                <b>Name of company as per trade license</b>
              </Text>
              <Text>
                {" "}
                <b>{AddressData?.businessName ?? "---"}</b>{" "}
              </Text>
            </Space>
          </Col>
        ) }
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary">
              {" "}
              <b>Building name and flat number or villa number</b>
            </Text>
            <Text>
              {" "}
              <b>{AddressData?.companyAddress1 ?? "---"}</b>{" "}
            </Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary">
              {" "}
              <b>Street name and nearest landmark</b>
            </Text>
            <Text>
              {" "}
              <b>{AddressData?.companyAddress2 ?? "---"}</b>{" "}
            </Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary">
              {" "}
              <b>Area name</b>
            </Text>
            <Text>
              {" "}
              <b>{AddressData?.companyAddress3 ?? "---"}</b>{" "}
            </Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary">
              {" "}
              <b>Mobile number</b>
            </Text>
            <Text>
              {" "}
              <b>{AddressData?.phoneNumber ?? "---"}</b>{" "}
            </Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary">
              {" "}
              <b>Country</b>
            </Text>
            <Text>
              {" "}
              <b>{SelectedCountry ?? "---"}</b>{" "}
            </Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary">
              {" "}
              <b>City</b>
            </Text>
            <Text>
              {" "}
              <b>{SelectedCity ?? "---"}</b>{" "}
            </Text>
          </Space>
        </Col>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <Space direction="vertical">
            <Text type="secondary">
              {" "}
              <b>PO Box</b>
            </Text>
            <Text>
              {" "}
              <b>{AddressData?.postalCode ?? "---"}</b>{" "}
            </Text>
          </Space>
        </Col>
      </Row>
      {/* </Row> */}
    </div>
  );
};

export default AddressDetails;
