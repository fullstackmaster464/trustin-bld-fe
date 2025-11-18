import {
  Checkbox,
    Col,
    Form,
    Input,
    Row,
    Select,
    message
  } from "antd";
import { useEffect, useState } from "react";
import { fetchKybDetails, getUserData } from "../../../services/admin";
import { DEFAULT_COUNTRY, DEFAULT_COUNTRY_CODE, MobilNumberRegex, getLocalStorage } from "../../Common/Constants";
import { getCitiesList, getUserAddress } from "../../../services/user";
import { NormalText } from "../../ui-elements/TextRepo";
import { getAllCountries } from "../../../services/masterData";
  const AddressDetails = (props:any) => {
  const { Option } = Select;
  const [citiesList, setCitiesList] = useState([]);
  const form = Form.useFormInstance();
  const [countryList, setCountryList] = useState([]);
  const [callingCode,setCallingCode] = useState('');
  const [selectedIsoCode, setSelectedIsoCode] = useState("");
  const phonenumber = props?.callingDetails?.phoneNumber
  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const [editAddress, setEditAddress] = useState<any>(true)
  const userAlias = local ? JSON.parse(local)?.userAlias : "" ;
  const [city,setCity] = useState<any>();
  const [fieldClassNames, setFieldClassNames] = useState({
    address1: '',
    address2: '',
    address3: '',
  });

    useEffect(() => {
      if(!phonenumber){
        getUserData(email)
        .then(res => {
          setCallingCode(res?.data?.countryCallingCode)
            form.setFieldsValue({
                phoneNumber:res?.data?.contactNumber,
            });
        })
        .catch(() => {
          message.error("Oops! Something went wrong. Please try again later!");
        });
      }
      getAllCountries().then((response:any) => {
        setCountryList(response?.data);
      })
    }, []);
    
    const sort = (arrayList:any) => {
      return arrayList.sort(function (a:any,b:any) {
        if(!a.name && a.code === "FLOOR 13 02"){
          a.name = a.code;
        }
        if(!b.name &&b.code === "FLOOR 13 02"){
          b.name = b.code;
        }
        if(a?.name > b?.name) return 1 
        if(a?.name < b?.name) return -1
        return 0;
      })
    }
  
    const onCountryChange = (value:any,option:any) => {
      if(value) {
        setSelectedIsoCode(value);
        if (option?.label) {
          setCitiesList([]);
          const selectedCountryData:any = countryList.find((country:any) => country?.isoCode === value);
          setCallingCode(selectedCountryData?.callingCode)
          form.setFieldsValue({
              phoneNumber:selectedCountryData?.contactNumber,
          });
          form.setFieldValue("cityCode",null);
          getCitiesList(option.label)
          .then((response) => {
            if (response?.status === 200) {
              const sortedCitiesList = sort(response.data.citiesList);
              setCitiesList(sortedCitiesList);
            }
          }).catch(() =>{
            message.error("Oops! Could not get cities list. Please try again later!");
          })
        }
      }
    };
  
    const onCityChange = (value:any,option:any) =>{
      if(value)
      form.setFieldValue("stateCode",option.children);
    }
    
    const onCitySearch = (searchValue: any)=> {
      getCitiesList(selectedIsoCode ? selectedIsoCode :  DEFAULT_COUNTRY, searchValue)
        .then((response) => {
          if (response?.status === 200) {
            const sortedCitiesList = sort(response.data.citiesList);
            setCitiesList(sortedCitiesList);
          } 
        })
    }

    const validatePOBox = (_:any, value:any, callback:any) => {
      if (!value) {
        callback('P.O. box is required!');
      } else if (!/^[0-9]+$/.test(value)) {
        callback('P.O. box should only contain numbers.');
      } else if (value.length < 4) {
        callback('P.O. box should have at least 4 digits.');
      } else if (value.length > 6) {
        callback('P.O. box should have at most 6 digits.');
      } else {
        callback();
      }
    };
  
    const handleInput = (e: any, fieldname: string) => {
      const regex = /^[A-Za-z0-9,\- ]*$/; 
      const currentValue = e.target.value;
      const lastChar = currentValue.slice(-1);
  
      if (!regex.test(lastChar)) {
        e.preventDefault();
        setFieldClassNames((prevClassNames: any) => ({
          ...prevClassNames,
          [fieldname]: 'inputField'
        }));
      } else {
        setFieldClassNames((prevClassNames: any) => ({
          ...prevClassNames,
          [fieldname]: ''
        }));
        e.target.value = currentValue.replace(/[^A-Za-z0-9,\- ]/g, '');
      }
    };
    const validateContactNumber = (_rule: any, value: string) => {
      return new Promise((resolve: any, reject: any) => {
        if (!value) {
          return reject("Mobile number is required!");
        }
    
        const validNumber = value.replace(MobilNumberRegex, '');
        if (callingCode === DEFAULT_COUNTRY_CODE) {
          if (!validNumber.startsWith('5')) {
            return reject("UAE numbers should start with 5");
          }
        }
    
        if (validNumber.length < 7) {
          return reject("Enter valid mobile number!!");
        }
    
        resolve(); 
      });
    };  

    const validateSpecialCharFields = (value: any) => {
      if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
        return Promise.reject(new Error("Only letters, numbers, spaces, and , - ? # / . are allowed"));
      }
      return Promise.resolve();
    };

    useEffect(() => {
      if(props?.contractId) {
        getUserAddress(userAlias).then((response: any) => {
          setSelectedIsoCode(response?.data?.countryCode);
          getCitiesList(response?.data?.countryCode)
            .then((resp: any) => {
              if (resp?.status === 200) {
                const sortedCitiesList = sort(resp?.data?.citiesList);
                setCitiesList(sortedCitiesList);
                setCity(sortedCitiesList.find((city: any) => response?.data?.cityCode === city.code))
              }
              form.setFieldsValue({
                address1: response?.data?.address1,
                address2:  response?.data?.address2,
                address3: response?.data?.address3,
                phoneNumber: response?.data?.phoneNumber,
                countryCode: response?.data?.countryCode,
                cityCode: response?.data?.cityCode,
                postalCode: response?.data?.postalCode ?? "0000"
              })
          })
        })
      } else {
      fetchKybDetails(userAlias)
      .then((response: any) => {
        const data = response?.data?.data?.[0];
        const addressDetails = data?.basic?.[0].typeOfEntity !== "INDIVIDUAL" ? data?.business?.[0] : data?.addressDetails?.[0];
        setSelectedIsoCode(addressDetails?.companyCountry);
        getCitiesList(addressDetails?.companyCountry)
        .then((response) => {
          if (response?.status === 200) {
            const sortedCitiesList = sort(response.data.citiesList);
            setCitiesList(sortedCitiesList);
            setCity(sortedCitiesList.find((city: any) => addressDetails?.companyCity === city.code))
          }
          form.setFieldsValue({
            address1: addressDetails?.companyAddress1,
            address2:  addressDetails?.companyAddress2,
            address3: addressDetails?.companyAddress3,
            phoneNumber: addressDetails?.phoneNumber,
            countryCode: addressDetails?.companyCountry,
            cityCode: addressDetails?.companyCity,
            postalCode: addressDetails?.postalCode ?? "0000"
          })
        }).catch(() =>{
          message.error("Oops! Could not get cities list. Please try again later!");
        })
       
      })
    }
    },[userAlias])
    return (
      <>
        <Row gutter={36} className="mb-3">
          <Col span={24}>
          <Checkbox className="mt-1" onClick={()=> editAddress ? setEditAddress(false) : setEditAddress(true)}>
            <NormalText
              className="formSubText forgetpassword fs-16"
              children="Edit address"
            />
          </Checkbox>
          </Col>
        </Row>
        <Row gutter={36}>
          <Col span={8}>
            <p className="enter-text-category">Building name and flat number</p>
            <Form.Item
              name="address1"
              rules={[
                {
                  required: true,
                  message: "Address1 is required!",
                },
                {
                  whitespace: true,
                  message: "Enter valid item name!",
                },
                {
                  validator: async (_: any, value: any) => {
                    return validateSpecialCharFields(value);
                  }
                },
              ]}
              className={`inputField w-100 error-input ${fieldClassNames.address1}`}
            >
              <Input placeholder="Enter the address" disabled={editAddress} onInput={(e) => handleInput(e, 'address1')}/>
            </Form.Item>
          </Col>
          <Col span={8}>
          <p className="enter-text-category">Street name and nearest landmark</p>
            <Form.Item
              name="address2"
              rules={[
                {
                  required: true,
                  message: "Address2 is required!",
                },
                {
                  whitespace: true,
                  message: "Enter valid address!",
                },
                {
                  validator: async (_: any, value: any) => {
                    return validateSpecialCharFields(value);
                  }
                },
              ]}
              className={`inputField w-100 error-input ${fieldClassNames.address2}`}
            >
              <Input placeholder="Enter the address" disabled={editAddress} onInput={(e) => handleInput(e, 'address2')}/>
            </Form.Item>
          </Col>
          <Col span={8}>
          <p className="enter-text-category">Area name</p>
            <Form.Item
              name="address3"
              rules={[
                {
                  required: true,
                  message: "Address3 is required!",
                },
                {
                  whitespace: true,
                  message: "Enter valid address!",
                },
                {
                  validator: async (_: any, value: any) => {
                    return validateSpecialCharFields(value);
                  }
                },
              ]}
              className={`inputField w-100 error-input ${fieldClassNames.address3}`}
            >
              <Input placeholder="Enter the address" disabled={editAddress} onInput={(e) => handleInput(e, 'address3')}/>
            </Form.Item>
          </Col>
          <Col span={8}>
          <p className="enter-text-category">Phone number</p>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  validator: validateContactNumber,
                },
              ]}
              className="inputField w-100"
            >
              <Input
                placeholder="Enter the phone number"
                maxLength={10}
                prefix={callingCode+" "}
                disabled={editAddress}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
          <p className="enter-text-category">Country</p>
            <Form.Item
              name="countryCode"
              rules={[
                {
                  required: true,
                  message: "Country code is required!",
                },
              ]}
              className="modal_inputField w-100 select"
            >
              <Select
                placeholder="Select country"
                onChange={onCountryChange}
                getPopupContainer={triggerNode => triggerNode.parentNode} disabled={editAddress}
                showSearch
                optionFilterProp="children"
                allowClear
                >
                {
                  countryList.map((item:any, idx: number) =>{ 
                  return item?.currency?.status == 'active'  ? (
                    <Option key={idx.toString()} value={item?.isoCode} label={item?.isoCode}>{item?.name.toUpperCase()}</Option>
                  ) : null
                  // <Option key="countries" value='AE' label='AE'>UNITED ARAB EMIRATES</Option>
                }
              )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
          <p className="enter-text-category">City</p>
            <Form.Item
              name="cityCode"
              rules={[
                {
                  required: true,
                  message: "City code is required!",
                },
              ]}
              className="modal_inputField w-100 select"
            >
              <Select
                showSearch
                allowClear
                placeholder="Search for city"
                optionFilterProp="children"
                onChange={onCityChange}
                onSearch={onCitySearch}
                getPopupContainer={triggerNode => triggerNode.parentNode} disabled={editAddress}
                >
                  { editAddress ? <Option key="cities" value={city?.code} label={city?.code}>{city?.name}</Option> :
                  citiesList.map((city:any) => (
                    <Option key="cities" value={city.code} label={city.code}>{city.name}</Option>
                  ))}
              </Select>            
            </Form.Item>
          </Col>
          <Col span={8}>
          <p className="enter-text-category">P.O.box</p>
            <Form.Item
              name="postalCode"
              rules={[
                {
                  required: true,
                  validator: validatePOBox,
                },
              ]}
              className="inputField w-100 error-input"
            >
              <Input placeholder="Enter the P.O box number " disabled={editAddress} />
            </Form.Item>
          </Col>        
        </Row>
      </>
    );
  };
  
  export default AddressDetails;
  