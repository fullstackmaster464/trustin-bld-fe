import {
  AutoComplete,
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Spin,
  Tooltip,
  message,
} from "antd";
// import * as ibantools from "ibantools";
import { useEffect, useRef, useState } from "react";
import { getLocalStorage } from "../Common/Constants";
import { InputText } from "../ui-elements/InputsRepo";
import {
  addUserBankDetails,
  getCitiesList,
  getCountriesList,
  getCurrencyList,
  getReferenceDataListV2,
} from "../../services/user";
import { Option } from "antd/lib/mentions";
import SuccessIcon from "../../assets/img/Successpopupicon.svg";
import BankAccountType from "./bankAccountType";
import { ibanValidator } from "../Common/IbanValidator";
import { useDebounce } from "../ManagerCheques/hook";
import { AuthTitle } from "../ui-elements/TextRepo";
import { InfoCircleOutlined } from "@ant-design/icons";

export interface AddBankAccountModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function AddBankAccountModal({
  open,
  setOpen,
  onSuccess,
}: AddBankAccountModalProps) {
  const UserAlias = JSON.parse(getLocalStorage("auth")!);
  const [countryCode, setCountryCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [cityList, setCityList] = useState<any>([]);
  const [currencyList, setCurrencyList] = useState<Array<{name: string; isoCode: string}>>([])
  const [referenceData, setReferenceData] = useState<any>([]);
  const [routingCode, setRoutingCode] = useState("");
  const [city, setCity] = useState("");
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [routingScheme, setRoutingScheme] = useState("");
  const [newCountryList, setNewCountryList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState<any>(false);
  const [accountType, setAccountType] = useState<string>("ACCOUNT_NUMBER");
  const [isBankManuallyEntered, setIsBankManuallyEntered] = useState(false);
  const [bankNameInput, setBankNameInput] = useState<string>("");
  const initialBankListRef = useRef<any>();

  // const [isBankNameFocused, setBankNameFocused] = useState(false);
  // const [isBankRoutingCodeFocused, setIsBankRoutingCodeFocused] =
  //   useState(false);
  // const [isBankRoutingSchemeFocused, setIsBankRoutingSchemeFocused] =
  //   useState(false);

  const [form] = Form.useForm();

  type IbanErrorState = {
    message: string;
    status: boolean;
  };
  const [ibanError, setIbanError] = useState<IbanErrorState>({
    message: "",
    status: false,
  });

  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };

  const bankSearchDebounced = useDebounce((searchText: string) => {
    if (!countryCode || !cityCode) return;
    setLoading(true);

    getReferenceDataListV2({
      countryCode,
      cityCode,
      search: searchText   // <-- Add search field in API request
    })
      .then((res) => {
        setReferenceData(res?.data?.institutionsList ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, 500);

  const citySearchDebounced = useDebounce((searchValue: string) => {
    getCitiesList(countryCode, searchValue)
      .then((response) => {
        setLoading(false);
        if (response?.status === 200) {
          const sortedCitiesList = sort(response?.data?.citiesList ?? []);
          setCityList(sortedCitiesList);
        }
      })
      .catch(() => setLoading(false));
  }, 500);

  useEffect(() => {
    getCountriesList().then(async (response) => {
      const sortedCountryList = await sort(response?.data?.countriesList ?? []);
      setNewCountryList(sortedCountryList);
    });
    getCurrencyList()
      .then((response) => {
        setCurrencyList(response.data)
      })

    window.addEventListener("resize", () => {
      setWidthVal();
    });

    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  const onFinish = (values: any) => {
    if (loading) return;
    setLoading(true);
    const requestBody = {
      type: accountType,
      routingCode: routingCode,
      routingScheme: routingScheme,
      isPrimary: true,
      userAlias: UserAlias?.userAlias,
      name: values.name,
      number: values.number,
      currency: values.currency,
      institutionName: values.institutionName.split(":")[0],
      institutionType: values.institutionType,
      country: values.country,
      countryCode: values.country,
      city: city,
      cityCode: values.city,
      isDetailsManualInput: isBankManuallyEntered,
    };
    if (ibanError?.status == false) {
      addUserBankDetails(requestBody)
        .then((response) => {
          if (response?.status === 201 || response?.status === 200) {
            setIsModalVisible(true);
          }
          setOpen(false);
          onSuccess();
          form.resetFields();
          setBankNameInput("");
          setRoutingCode("");
          setRoutingScheme("");
          setCityCode("");
          setCountryCode("");
          setLoading(false);
        })
        .catch((e) => {
          const errorMsg =
            e?.data?.error ||
            "Oops! Something went wrong. Please try again later!";
          message.error(errorMsg);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const sort = (arrayList: any) => {
    return arrayList.sort(function (a: any, b: any) {
      if (!a.name && a.code === "FLOOR 13 02") {
        a.name = a.code;
      }
      if (!b.name && b.code === "FLOOR 13 02") {
        b.name = b.code;
      }
      if (a?.name > b?.name) return 1;
      if (a?.name < b?.name) return -1;
      return 0;
    });
  };

  const onCountryChange = (e: string) => {
    setReferenceData([]);
    setCityList([]);
    setLoading(true);
    setCountryCode(e);
    setCityCode("");
    getCitiesList(e)
      .then((response) => {
        setCityList(response.data.citiesList);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Could not fetch list. Please try again later!");
      });
  };

  const onCityChange = (cityCode: string) => {
    setReferenceData([]);
    setLoading(true);
    setCityCode(cityCode);
    setCity(cityList.find((city: any) => city.code === cityCode)?.name ?? "");
    if (cityCode) {
      getReferenceDataListV2({
        countryCode,
        cityCode
      })
        .then((response) => {
          setReferenceData(response?.data?.institutionsList);
          initialBankListRef.current = response?.data?.institutionsList;
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Could not fetch list. Please try again later!");
        });
    }
  };

  const onCityClear = () => {
    setReferenceData([]);
    setLoading(true);
    setCityCode("");
    if (countryCode) {
      getCitiesList(countryCode)
        .then((response) => {
          setCityList(response.data.citiesList);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Could not fetch list. Please try again later!");
        });
    }
  };

  const onCitySearch = (searchValue: any) => {
    setLoading(true);
    citySearchDebounced(searchValue);
  };

  const handleNameChange = (value: string, option: any) => {
    // setBankNameFocused(false);
    setIsBankManuallyEntered(!option?.value);
    setRoutingCode(option?.code ?? "");
    setRoutingScheme(option?.scheme ?? "");
    form.setFieldValue("institutionName", value);
    setBankNameInput(value);
    form.setFieldValue("routingCode", option?.code);
    form.setFieldValue("routingScheme", option?.scheme);
  };

  const onBankSearch = (searchText: string) => {
    if (!searchText) {
      setReferenceData(initialBankListRef.current || []);
      return;
    }
    bankSearchDebounced(searchText);
  };

  const validateBicSwiftCode = (_: any, value: string) => {
    if (!value) return Promise.resolve();

    const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

    if (!bicRegex.test(value.toUpperCase())) {
      return Promise.reject("Invalid BIC/SWIFT code format!");
    }
    return Promise.resolve();
  };

  const handleClearBankName = () => {
    if (!isBankManuallyEntered) {
      setRoutingCode("");
      setRoutingScheme("");
      form.setFieldValue("routingCode", undefined);
      form.setFieldValue("routingScheme", undefined);
    }
    setReferenceData(initialBankListRef.current);
    setIsBankManuallyEntered(false);
    form.setFieldValue("institutionName", undefined);
    setBankNameInput("");
  };

  const handleClearCity = () => {
    form.setFieldValue("city", undefined);
  };

  const manualBankNameTooltip = (
    <div style={{ maxWidth: 280 }}>
      <p>
        <strong>Manual Bank Name Entry</strong>
      </p>
      <ul style={{ paddingLeft: 20, marginTop: 4 }}>
        <li>Ensure the bank name is spelled correctly</li>
        <li>Incorrect names may cause payment failures</li>
        <li>Prefer selecting from the dropdown if available</li>
      </ul>
    </div>
  );

  const manualRoutingCodeTooltip = (
    <div style={{ maxWidth: 280 }}>
      <p>
        <strong>Manual Routing Code Entry</strong>
      </p>
      <ul style={{ paddingLeft: 20, marginTop: 4 }}>
        <li>Enter a valid BIC/SWIFT code</li>
        <li>Invalid codes will result in failed transfers</li>
        <li>Prefer auto fill from the bank dropdown if available</li>
      </ul>
    </div>
  );

  const manualRoutingSchemeTooltip = (
    <div style={{ maxWidth: 280 }}>
      <p>
        <strong>Manual Routing Scheme Entry</strong>
      </p>
      <ul style={{ paddingLeft: 20, marginTop: 4 }}>
        <li>Select the correct scheme (BIC, SWIFT)</li>
        <li>Check if the bank supports the selected scheme</li>
        <li>Wrong scheme may delay or block the transfer</li>
        <li>Prefer auto fill from the bank dropdown if available</li>
      </ul>
    </div>
  );

  return (
    <>
      <Modal
        className="modal-box"
        centered
        destroyOnClose={true}
        onCancel={() => setOpen(false)}
        open={open}
        width={700}
        style={{
          marginTop: "4rem",
          marginBottom  : "4rem"
        }}
        footer={false}
        closable={false}
      >
        <AuthTitle
          children="Please Add Bank Account"
          className="modals mt-4 pb-1"
        />

        <Form
          className="px-4 py-3"
          form={form}
          scrollToFirstError
          onFinish={onFinish}
        >
          <Row className="endtoend bank">
            <div className="stepDetails_medium_sub mb-2 mt-3">
              Name (as per bank account)
            </div>
            <Form.Item
              name="name"
              className="inputField w-100 error-msg error-input mb-0"
              rules={[
                {
                  required: true,
                  message: "Name is required!",
                },
                {
                  whitespace: true,
                  message: "Enter valid name!",
                },
              ]}
            >
              <Input placeholder="Enter name here" />
            </Form.Item>
          </Row>
          <Row className="endtoend bank">
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <div className="stepDetails_medium_sub mb-2 mt-3 d-flex">
                Number
              </div>
              <InputText
                fieldname="number"
                className="inputField w-100 error-msg error-input mb-0"
                rules={[
                  {
                    required: true,
                    message:
                      accountType === "IBAN"
                        ? "IBAN no is required!"
                        : "Acc. no is required!",
                  },
                  {
                    whitespace: true,
                    message:
                      accountType === "IBAN"
                        ? "Enter valid IBAN number!"
                        : "Enter valid account number!",
                  },
                  {
                    pattern: /^[a-zA-Z0-9]*$/,
                    message: "Special characters are not allowed!",
                  },
                  {
                    max: 34,
                    message: "Number cannot exceed 34 characters!",
                  },
                  {
                    validator: ibanValidator(accountType, setIbanError),
                  },
                ]}
              >
                <Input
                  addonBefore={
                    <BankAccountType
                      form={form}
                      setAccountType={setAccountType}
                      accountType={accountType}
                    />
                  }
                  placeholder={`${
                    accountType === "IBAN"
                      ? "Enter IBAN"
                      : "Enter account number"
                  }`}
                  maxLength={34}
                  // onInput={() => {
                  //   setIbanError({
                  //     message: "",
                  //     status: false,
                  //   });
                  // }}
                  // onBlur={(e: any)=> accountType === "IBAN" ? ValidateIBANValue(e) : ""}
                />
              </InputText>
              {/* {ibanError?.status && (
                  <div style={{ color: "#ff5555"}}>
                    {ibanError?.message}
                  </div>
                )} */}
            </Col>
            <Col xs={24} sm={24} md={24} lg={7} xl={7}>
              <div className="stepDetails_medium_sub mb-2 mt-3 d-flex">
                Institution type
              </div>
              <Form.Item
                name="institutionType"
                className="modal_inputField error-msg select mb-0 "
                rules={[
                  {
                    required: true,
                    message: "Institution is required!",
                  },
                ]}
              >
                <Select
                  placeholder="Select institution type"
                  style={{
                    textAlign: "justify",
                  }}
                >
                  <Option value="BANK">BANK</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row className="endtoend bank">
            <div className="stepDetails_medium_sub mb-2 mt-3 d-flex">
              Currency
            </div>
            <Form.Item
              name="currency"
              className="inputField w-100 error-msg mb-0"
              rules={[
                {
                  required: true,
                  message: "Currency is required!",
                },
              ]}
            >
              <Select
                placeholder="Select currency"
                className="w-75 h-100 pt-1"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {currencyList?.length > 0 &&
                  currencyList?.map((value, index:any) => {
                      return (
                        <Option key={index} value={value.isoCode}>
                          {value.name} ({value.isoCode})
                        </Option>
                      );
                  })}
              </Select>
            </Form.Item>
          </Row>
          <Row className="endtoend bank">
            <div className="stepDetails_medium_sub mb-2 mt-3 d-flex">
              Country name
            </div>
            <Form.Item
              name="country"
              className="inputField w-100 error-msg mb-0"
              rules={[
                {
                  required: true,
                  message: "Country is required!",
                },
              ]}
            >
              <Select
                placeholder="Select country"
                onChange={(value: string) => {
                  onCountryChange(value);
                  handleClearBankName();
                  handleClearCity();
                }}
                className="w-75 h-100 pt-1"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {newCountryList?.length > 0 &&
                  newCountryList?.map((value: any, index: any) => {
                    return (
                      <Option key={index} value={value.code}>
                        {value.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Row>
          <Row className="endtoend bank">
            <div className="stepDetails_medium_sub mb-2 mt-3 d-flex">
              City name
            </div>
            <Form.Item
              name="city"
              className="inputField w-100 error-msg mb-0"
              rules={[
                {
                  required: true,
                  message: "City is required!",
                },
              ]}
            >
              <Select
                placeholder="Select city"
                onChange={(value: string) => {
                  onCityChange(value);
                  handleClearBankName();
                }}
                className="w-75 h-100 pt-1"
                disabled={countryCode ? false : true}
                allowClear
                onClear={onCityClear}
                showSearch
                onSearch={onCitySearch}
                optionFilterProp="children"
                notFoundContent={
                  loading ? (
                    <Spin
                      size="small"
                      className="d-flex justify-content-center align-items-center pt-4 pb-4"
                    />
                  ) : (
                    "No cities available"
                  )
                }
              >
                {cityList?.length > 0 &&
                  cityList?.map((value: any) => {
                    return (
                      <Option key={value.code} value={value.code}>
                        {value.name}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Row>
          <Row className="endtoend bank">
            <div className="stepDetails_medium_sub mb-2 mt-3 d-flex">
              Bank name
            </div>
            <Form.Item
              name="institutionName"
              className="inputField w-100 error-msg mb-0"
              rules={[
                {
                  required: true,
                  message: "Bank is required!",
                },
              ]}
            >
              <AutoComplete
                placeholder="Select bank"
                onChange={handleNameChange}
                allowClear
                onClear={handleClearBankName}
                onSearch={onBankSearch}
                // onFocus={() => setBankNameFocused(true)}
                // onBlur={() => setBankNameFocused(false)}
                disabled={!cityCode}
                value={bankNameInput}
                notFoundContent={loading ? <Spin size="small" className="d-flex justify-content-center align-items-center pt-4 pb-4"/> : "No Banks available"}
                options={
                  !loading && referenceData?.length > 0
                    ? referenceData.map((value: any) => ({
                        key: `${value.name} (${value.routingCodes[0].code})`,
                        value: value.name,
                        code: value.routingCodes[0].code,
                        scheme: value.routingCodes[0].scheme,
                        label: (
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span>{value.name}</span>
                            <span
                              style={{ fontSize: "10.5px", marginLeft: "4px" }}
                            >
                              ({value.routingCodes[0].code})
                            </span>
                          </div>
                        ),
                      }))
                    : []
                }
              />
              <Tooltip
                title={manualBankNameTooltip}
                // open={isBankNameFocused}
                overlayClassName="custom-tooltip signupTooltip"
                 placement="bottom"
              >
                <span className="pwd_info" style={{ marginLeft: 5 }}>
                  <InfoCircleOutlined />
                </span>
              </Tooltip>
            </Form.Item>
          </Row>
          <Row className="endtoend">
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <div className="stepDetails_medium_sub mb-2 mt-3 d-flex">
                Routing code
              </div>
              <Form.Item
                name="routingCode"
                className="inputField w-100 error-msg error-input mb-0"
                rules={[
                  {
                    required: true,
                    message: "Routing code is required!",
                  },
                  {
                    whitespace: true,
                    message: "Enter valid code!",
                  },
                  {
                    validator: validateBicSwiftCode
                  }
                ]}
              >
                <Input
                  placeholder="Enter routing code here"
                  // onFocus={() => setIsBankRoutingCodeFocused(true)}
                  // onBlur={() => setIsBankRoutingCodeFocused(false)}
                  value={routingCode}
                  onChange={(e) => {
                    setRoutingCode(e.target.value);
                    form.setFieldValue("routingCode", e.target.value);
                    setIsBankManuallyEntered(true);
                  }}
                />
                <Tooltip
                  title={manualRoutingCodeTooltip}
                  // open={isBankRoutingCodeFocused}
                  overlayClassName="custom-tooltip signupTooltip"
                  placement="topRight"
                >
                  <span className="pwd_info" style={{ marginLeft: 5 }}>
                    <InfoCircleOutlined />
                  </span>
                </Tooltip>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={24} lg={11} xl={11}>
              <div className="stepDetails_medium_sub mb-2 mt-3 d-flex">
                Routing scheme
              </div>
              <Form.Item
                name="routingScheme"
                className="inputField w-100 error-msg error-input mb-0"
                rules={[
                  {
                    required: true,
                    message: "Routing scheme is required!",
                  },
                  {
                    whitespace: true,
                    message: "Enter valid scheme!",
                  },
                  {
                    validator: (_: any, value: string) => {
                      if (!value) return Promise.resolve();
                      const allowedSchemes = ["BIC", "SWIFT"];
                      if (!allowedSchemes.includes(value.toUpperCase())) {
                        return Promise.reject("Routing scheme must be BIC or SWIFT!");
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input
                  placeholder="Enter routing scheme here"
                  value={routingScheme}
                  // onFocus={() => setIsBankRoutingSchemeFocused(true)}
                  // onBlur={() => setIsBankRoutingSchemeFocused(false)}
                  onChange={(e) => {
                    setRoutingScheme(e.target.value);
                    form.setFieldValue("routingScheme", e.target.value);
                    setIsBankManuallyEntered(true);
                  }}
                />
                <Tooltip
                  title={manualRoutingSchemeTooltip}
                  // open={isBankRoutingSchemeFocused}
                  overlayClassName="custom-tooltip signupTooltip"
                  placement="topRight"
                >
                  <span className="pwd_info" style={{ marginLeft: 5 }}>
                    <InfoCircleOutlined />
                  </span>
                </Tooltip>
              </Form.Item>
            </Col>
          </Row>
          <Row
            className={
              Width > 470
                ? "d-flex gap-3 mt-5"
                : "d-flex gap-3 mt-5 justify-content-center align-items-center"
            }
          >
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button w-auto"
              loading={loading}
            >
              + Add Bank Account
            </Button>
            <Button
              key="cancel"
              type="primary"
              onClick={() => setOpen(false)}
              className="modal-button-cancel w-auto addbank-cancel-btn"
            >
              Cancel
            </Button>
          </Row>
        </Form>
      </Modal>

      <Modal
        open={isModalVisible}
        footer={false}
        closable={false}
        className="modal-box success"
        centered
        width={Width > 767 ? 500 : 400}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <div className="text-center">
          <Image
            src={SuccessIcon}
            alt="success"
            preview={false}
            className="mt-5"
          />

          <div className="titleText mt-5 mb-3">
            Bank details added successfully
          </div>
          <Button
            className="rounded_blue_outline btn-OK mb-4"
            onClick={() => {
              setOpen(false);
              setIsModalVisible(false);
            }}
          >
            Ok
          </Button>
        </div>
      </Modal>
    </>
  );
}
