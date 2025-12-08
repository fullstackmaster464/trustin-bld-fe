import {
  AutoComplete,
    Breadcrumb,
    Button,
    Card,
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
  import { useNavigate } from "react-router-dom";
  // import * as ibantools from "ibantools";
  import {
    BankList,
  } from "../Common/RouteConst";
  import LeftArrow from "../../assets/img/leftArrow.svg";
  import { useEffect, useRef, useState } from "react";
  import { getUserData } from "../../services/admin";
  import { getLocalStorage } from "../Common/Constants";
  import Secure from "../../assets/img/secure100.svg";
  import SuccessIcon from "../../assets/img/Successpopupicon.svg";
  import { InputText } from "../ui-elements/InputsRepo";
import { editUserBankDetails, getAllCountries, getCitiesList, getCountriesList, getCurrencyList, getReferenceDataListV2, getlocalBankDetails } from "../../services/user";
import { Option } from "antd/lib/mentions";
import DefaultLayout from "../Common/DefaultLayout";
import BankAccountType from "./bankAccountType";
import { ibanValidator } from "../Common/IbanValidator";
import { useDebounce } from "../ManagerCheques/hook";
import { InfoCircleOutlined } from "@ant-design/icons";

const EditBankAccount = () => {
  const navigate = useNavigate();
  const [Width, setWidth] = useState<number>(document?.body?.clientWidth);
  const [form] = Form.useForm();
  const UserAlias = JSON.parse(getLocalStorage("auth")!);
  const id = window?.location?.pathname.split("/").pop();
  const [cityCode, setCityCode] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityList, setCityList] = useState<any>([]);
  const [currencyList, setCurrencyList] = useState<Array<{name: string; isoCode: string}>>([])
  const [referenceData, setReferenceData] = useState([]);
  const [routingCode, setRoutingCode] = useState("");
  const [routingScheme, setRoutingScheme] = useState("");
  const [newCountryList, setNewCountryList] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [bankAlias, setBankAlias] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] =useState<any>(false);
  const [ibanError, setIbanError] = useState<any>({
    message: "",
    status: false
  });
  const [accountType, setAccountType] =useState<string>("ACCOUNT_NUMBER");
  const [isBankManuallyEntered, setIsBankManuallyEntered] = useState(false)
  const [bankNameInput, setBankNameInput] = useState<string>("");
  const initialBankListRef = useRef<any>()

  // const [isBankNameFocused, setBankNameFocused] = useState(false);
  // const [isBankRoutingCodeFocused, setIsBankRoutingCodeFocused] = useState(false);
  // const [isBankRoutingSchemeFocused, setIsBankRoutingSchemeFocused] = useState(false);

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
    }).catch(() => setLoading(false))
  },500)

    const goBack = () => {
      navigate(BankList);
    };
    const setWidthVal = () =>{
      setWidth(document.body.clientWidth);
    }
    useEffect(() => {
      getlocalBankDetails(UserAlias?.userAlias)
      .then((response) => {
        const currentDetail = response?.data?.bankDetails?.filter(
          (details:any) => details.id === Number(id)
        );
        const cityCode = currentDetail[0]?.cityCode
        const countryCode = currentDetail[0]?.countryCode
        getCitiesList(countryCode).then((response) => {
          setCityList(response.data.citiesList);
          form.setFieldsValue({
            city: currentDetail?.[0]?.city
          })
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
        getReferenceDataListV2({ cityCode, countryCode })
        .then((response) => {
          setReferenceData(response?.data?.institutionsList);
          initialBankListRef.current = response?.data?.institutionsList;
        })
        getCurrencyList()
        .then((response) => {
          setCurrencyList(response.data)
          form.setFieldsValue({ currency: currentDetail?.[0]?.accountCurrency });
        })

        form.setFieldsValue({ name: currentDetail?.[0]?.name });
        form.setFieldsValue({ number: currentDetail?.[0]?.number });
        form.setFieldsValue({
          country: currentDetail?.[0]?.country
            ? currentDetail?.[0]?.country
            : "UNITED ARAB EMIRATES",
        });
        setCountryCode(currentDetail?.[0]?.country);
        form.setFieldsValue({
          institutionType: currentDetail?.[0]?.institutionType,
        });
        
        setCityCode(currentDetail?.[0]?.cityCode)
        setCityName(currentDetail?.[0]?.city)
        form.setFieldsValue({
          institutionName: currentDetail?.[0]?.institutionName,
        });
        setBankNameInput(currentDetail?.[0]?.institutionName ?? "");
        form.setFieldsValue({ routingCode: currentDetail?.[0]?.routingCode });
        form.setFieldsValue({
          routingScheme: currentDetail?.[0]?.routingScheme,
        });
        setIsBankManuallyEntered(currentDetail.isDetailsManualInput)
        setRoutingCode(currentDetail?.[0]?.routingCode);
        setRoutingScheme(currentDetail?.[0]?.routingScheme);
        setBankAlias(currentDetail?.[0]?.aliasName);
        const account = currentDetail?.[0]?.type === "IBAN" ? "IBAN" : "ACCOUNT_NUMBER";
        setAccountType(account)
      })
      .catch(() => {
        message.error("Oops! Could not fetch details. Please try again later!");
      });
      getAllCountries()
        .then((response) => {
          getUserData(UserAlias?.email)
            .then((res: any) => {
              const countryName = response?.data.filter(
                (country: any) => country.isoCode === res?.data?.countryAlias
              )[0]?.name;
              form.setFieldsValue({ countryIsoCode: countryName });
            })
        })
  
      getCountriesList()
        .then(async (response) => {
          const sortedCountryList = await sort(response?.data?.countriesList ?? []);
          setNewCountryList(sortedCountryList);
        })

      window.addEventListener('resize', ()=>{
        setWidthVal()
      });
      return () => window.removeEventListener('resize', setWidthVal);
    }, []);

    const onFinish = (values:any) => {
      const requestBody = {
        ...values,
        countryCode,
        city: cityName,
        cityCode: cityCode,
        isPrimary: true,
        type: accountType,
        userAlias: UserAlias.userAlias,
        isDetailsManualInput: isBankManuallyEntered,
        routingCode:routingCode,
        routingScheme:routingScheme,
        id: id,
      };

      // TODO:
      
        if(ibanError?.status == false){
          editUserBankDetails(bankAlias, requestBody)
            .then((response) => {
              if (response?.status === 201 || response?.status === 200) {
                setIsModalVisible(true);
                navigate(BankList);
              }
            })
            .catch(() => {
              message.error(
                "Oops! Something went wrong. Please try again later!"
              );
            });
      }else{
        message.error(accountType === "IBAN" ? "Enter valid IBAN number!" : "Enter valid account number!");
      }
    };
    
    const onCountryChange = (e: string) => {
    setReferenceData([]);
    setCityList([]);
    setLoading(true);
    setCountryCode(e);
    setCityCode("");
    getCitiesList(e).then((response) => {
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
    setCityName(cityList.find((city: any) => city.code === cityCode)?.name ?? "")
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
    setCityName("");
    if(countryCode) {
      getCitiesList(countryCode).then((response) => {
      setCityList(response.data.citiesList);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
      message.error("Oops! Could not fetch list. Please try again later!");
    });
    }
  };

  const onCitySearch = (searchValue: any)=> {
    setLoading(true);
    citySearchDebounced(searchValue)
  }

  const handleNameChange = (value: string, option: any) => {
    // setBankNameFocused(false)
    setIsBankManuallyEntered(!option?.value)
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

  const sort = (arrayList:any) => {
    return arrayList.sort(function (a:any, b:any) {
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

  const handleClearBankName = () => {
    if (!isBankManuallyEntered) {
      setRoutingCode("");
      setRoutingScheme("");
      form.setFieldValue("routingCode", undefined);
      form.setFieldValue("routingScheme", undefined);
    }
    setReferenceData(initialBankListRef.current)
    setIsBankManuallyEntered(false)
    form.setFieldValue("institutionName", undefined);
    setBankNameInput("");
  };

  const handleClearCity = () => {
    form.setFieldValue("city", undefined);
  };

  const manualBankNameTooltip = (
    <div style={{ maxWidth: 280 }}>
      <p><strong>Manual Bank Name Entry</strong></p>
      <ul style={{ paddingLeft: 20, marginTop: 4 }}>
        <li>Ensure the bank name is spelled correctly</li>
        <li>Incorrect names may cause payment failures</li>
        <li>Prefer selecting from the dropdown if available</li>
      </ul>
    </div>
  );

  const manualRoutingCodeTooltip = (
    <div style={{ maxWidth: 280 }}>
      <p><strong>Manual Routing Code Entry</strong></p>
      <ul style={{ paddingLeft: 20, marginTop: 4 }}>
        <li>Enter a valid BIC/SWIFT code</li>
        <li>Invalid codes will result in failed transfers</li>
        <li>Prefer auto fill from the bank dropdown if available</li>
      </ul>
    </div>
  );

  const manualRoutingSchemeTooltip = (
    <div style={{ maxWidth: 280 }}>
      <p><strong>Manual Routing Scheme Entry</strong></p>
      <ul style={{ paddingLeft: 20, marginTop: 4 }}>
        <li>Select the correct scheme (BIC, SWIFT)</li>
        <li>Check if the bank supports the selected scheme</li>
        <li>Wrong scheme may delay or block the transfer</li>
        <li>Prefer auto fill from the bank dropdown if available</li>
      </ul>
    </div>
  );

    // const ValidateIBANValue = (e: any) => {
    //   const iban:any = ibantools.electronicFormatIBAN(e?.target?.value);
    //   const validIban = ibantools.isValidIBAN(iban);
    //     if(!validIban) {
    //     setIbanError({
    //       message: "Enter valid IBAN",
    //       status: true
    //     })
    //   }
    // };

    return (
      <div className="scrollbar-container">
        <DefaultLayout
        page="bank"
        loading={false}
        TitleText="Edit bank account"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        headerPage={
          <div className="d-flex">
                    <Image
                      src={LeftArrow}
                      preview={false}
                      onClick={() => {
                        goBack();
                      }}
                      className="mt-2 cursor"
                    />
                    <div className="ml-5">
                      <b> Edit bank account</b>
                      <Breadcrumb separator=">">
                        {/* <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                          className="cursor"
                        >
                          Dashboard
                        </Breadcrumb.Item> */}
                        <Breadcrumb.Item
                          className="cursor"
                          onClick={() => {
                            navigate(BankList);
                          }}
                        >
                          Bank account
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                          Edit bank account
                        </Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <Card className="noBorder mt-6">
                <div className="titleText px-4 py-3">Bank details</div>
                <hr className="lightgrayHr" />
                <Row>
                  <Col span={Width > 991 ? 15 : 24}>
                    <Form
                      form={form}
                      className="px-4 py-3"
                      scrollToFirstError
                      onFinish={onFinish}
                    >
                      <Row className="endtoend bank">
                        <div className="subText_small fw-400 mb-2 mt-3">
                          Account Name (as per bank account)
                        </div>
                        <InputText
                          fieldname="name"
                          className="inputField w-100 error-input"
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
                          <Input
                            placeholder="Enter name here"
                            autoFocus
                          />
                        </InputText>
                      </Row>
                      <Row className="endtoend bank">
                        <Col span={Width > 991 ? 11 : 24}>
                          <div className="subText_small fw-400 mb-2 mt-3">
                            Number
                          </div>
                          <InputText
                            fieldname="number"
                            className="inputField w-100 error-input"
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
                              message: accountType === "IBAN" 
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
                            addonBefore={<BankAccountType form={form} setAccountType={setAccountType} accountType={accountType}/>} 
                            placeholder={`${accountType === "IBAN" ? "Enter IBAN" : "Enter account number"}`}
                            maxLength={34}
                            />
                          </InputText>
                          </Col>
                           <Col span={Width > 991 ? 11 : 24}>
                            <div className="subText_small fw-400 mb-2 mt-3">
                              Currency
                            </div>
                            <InputText
                            fieldname="currency"
                            className="modal_inputField select"
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
                          </InputText>
                          </Col>
                      </Row>
                      <Row className="endtoend bank">
                        <Col span={Width > 991 ? 11 : 24}>
                          <div className="subText_small fw-400 mb-2 mt-3">
                            Country
                          </div>
                          <InputText
                            fieldname="country"
                            className="modal_inputField select"
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
                                newCountryList?.map((value:any, index:any) => {
                                    return (
                                      <Option key={index} value={value.code}>
                                        {value.name}
                                      </Option>
                                    );
                                })}
                            </Select>
                          </InputText>
                        </Col>
                        <Col span={Width > 991 ? 11 : 24}>
                          <div className="subText_small fw-400 mb-2 mt-3">
                            City
                          </div>
                          <InputText
                            fieldname="city"
                            className="modal_inputField select"
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
                              value={form.getFieldValue('city')}
                              onSearch={onCitySearch}
                              optionFilterProp="children"
                              notFoundContent={loading ? <Spin size="small" className="d-flex justify-content-center align-items-center pt-4 pb-4"/> : "No cities available"}
                            >
                              {cityList?.length > 0 &&
                                cityList?.map((value:any) => {
                                  return (
                                    <Option key={value.code} value={value.code}>
                                      {value.name}
                                    </Option>
                                  );
                                })}
                            </Select>
                          </InputText>
                        </Col>
                      </Row>
                      <Row className="endtoend bank">
                        <Col span={Width > 991 ? 11 : 24}>
                          <div className="subText_small fw-400 mb-2 mt-3">
                            Institution type
                          </div>
                          <InputText
                            fieldname="institutionType"
                            className="modal_inputField select"
                            rules={[
                              {
                                required: true,
                                message: "Institution is required!",
                              },
                            ]}
                          >
                            <Select
                              placeholder="Select institution type"
                            >
                              <Option value="BANK">BANK</Option>
                            </Select>
                          </InputText>
                        </Col>
                        <Col span={Width > 991 ? 11 : 24}>
                          <div className="subText_small fw-400 mb-2 mt-3">
                            Bank name
                          </div>
                          <InputText
                            fieldname="institutionName"
                            className="modal_inputField select"
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
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                          <span>{value.name}</span>
                                          <span style={{ fontSize: '10.5px', marginLeft: '4px' }}>
                                            ({value.routingCodes[0].code})
                                          </span>
                                        </div>
                                      )
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
                          </InputText>
                        </Col>
                      </Row>
                      <Row className="endtoend">
                        <Col span={Width > 991 ? 11 : 24}>
                          <div className="subText_small fw-400 mb-2 mt-3">
                            Routing code
                          </div>
                          <InputText
                            fieldname="routingCode"
                            className="inputField w-100 error-input"
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
                              style={{ width: "90%"}}
                              // onFocus={() => setIsBankRoutingCodeFocused(true)}
                              // onBlur={() => setIsBankRoutingCodeFocused(false)}
                              value={routingCode}
                              onChange={(e)=> {
                                setRoutingCode(e.target.value)
                                form.setFieldValue("routingCode", e.target.value)
                                setIsBankManuallyEntered(true)
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
                          </InputText>
                        </Col>
                        <Col span={Width > 991 ? 11 : 24}>
                          <div className="subText_small fw-400 mb-2 mt-3">
                            Routing scheme
                          </div>
                          <InputText
                            fieldname="routingScheme"
                            className="inputField w-100 error-input"
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
                              onChange={(e)=> {
                                setRoutingScheme(e.target.value)
                                form.setFieldValue("routingScheme", e.target.value)
                                setIsBankManuallyEntered(true)
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
                          </InputText>
                        </Col>
                      </Row>
                      <Row>
                        <Button
                          key="submit"
                          type="primary"
                          htmlType="submit"
                          className="modal-button mt-2 w-auto"
                          loading={loading}
                        >
                          Submit
                        </Button>
                      </Row>
                    </Form>
                  </Col>
                  <Col span={Width >991 ? 9 : 24} className="text-center my-5 ">
                    <Image
                      src={Secure}
                      alt="secure"
                      preview={false}
                      className="mt-3 mx-4"
                    />
                    <div className="mt-4 mx-25 text-center stepDetails_medium_sub">
                      Your legal business name should be same as the bank account
                      name in order for us to release the payment
                    </div>
                  </Col>
                </Row>
              </Card>
              </DefaultLayout>

        <Modal
        open={isModalVisible}
        footer={false}
        closable={false}
        className="modal-box success"
        centered
        width={500}
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
            Bank details edited successfully
          </div>
          <Button
            className="rounded_blue_outline btn-OK mb-4"
            onClick={() => {
              navigate(BankList);
            }}
          >
            Ok
          </Button>
        </div>
      </Modal>

      </div>
    );
  };
  
  export default EditBankAccount;
