import { Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";
import { getAllCountries } from "../../services/masterData";
import 'flag-icons/css/flag-icons.min.css';

const CallingCodeContract = (props: object|any):any => {
    const [countryList, setCountryList] = useState([]);
    const { callingCode,setCallingCode ,isoCode,setIsoCode} = props;
 
    const { Option } = Select;
    const [form] = Form.useForm();
   
    useEffect(() => {
        getAllCountries()
        .then((response) => {
          setCountryList(response.data);
        })
        .catch(() => {
         message.error("couldn't able fetch country details")
        });
        
    }, [])
    
   useEffect(() => {
      form.setFieldValue('countrycode',callingCode)
   }, [callingCode])

    const onCallingChange = (e:any) => {
      setCallingCode(e)
      const selectedCountry:any =countryList.find((country: { callingCode: string }) => country.callingCode === e);
      const Code = selectedCountry?.isoCode || "";
     setIsoCode(Code)
    }

    return (
        <>
        <Form>
        <Form.Item 
          name="countrycode" noStyle className="codesec"
        >
           <Input.Group>
     <span className={`fi fi-${isoCode?.toLowerCase() || ""}` } />
        <Select
                  className="callingcode"
                  popupClassName="lowerz" 
                  placeholder={"+971"}
                  onChange={onCallingChange}
                  disabled
                  showSearch
                  optionFilterProp="children"
                  value={callingCode ? "" : ""}
                  dropdownStyle={{ width: '80px' }}
               >
                    
                  {countryList.map((country:any) => {
                    return (
                      <Option key={country.isoCode} value={country.callingCode }>
                        {country.callingCode}
                      </Option>
                    );
                  })}
                </Select>
                </Input.Group>
      </Form.Item>
      </Form>
     </>
    );
}

export default CallingCodeContract
