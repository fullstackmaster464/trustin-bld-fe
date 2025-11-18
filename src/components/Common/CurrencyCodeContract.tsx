import { Select } from "antd"; 
import 'flag-icons/css/flag-icons.min.css';
import { VALID_CURRENCY } from "./Constants";
import { useEffect, useState } from "react";

const CurrencyCodeContract = (props: object | any): any => {
  
  const { onCurrencyChange, formValues } = props;
 
  const { Option } = Select; 
  const [currency, setCurrency ] = useState<string>();
  const [currencyList, setCurrencyList ] = useState<string[] >();

  const ENABLE_USD_CURRENCY = process.env.ENABLE_USD_CURRENCY;

  useEffect(()=>{  
    const enabledCurrency = [...VALID_CURRENCY];
  
    if (ENABLE_USD_CURRENCY === 'false') {
      const index = enabledCurrency.indexOf("USD");
      if (index !== -1) {
        enabledCurrency.splice(index, 1);  // Remove "USD" from the array
      }
    }
    setCurrencyList(enabledCurrency); 
  },[])
  
  useEffect(()=>{ 
    const formCurrency =  formValues?.currency || VALID_CURRENCY[0];
    setCurrency(formCurrency);
  },[formValues])
 
  return (
    <> 
    <Select 
              key={"currency"}
              value={currency}
              popupClassName="lowerz"
              placeholder={"AED"}
              onChange={onCurrencyChange}
              optionFilterProp="children" 
              dropdownStyle={{ width: '80px' }}
            >

              {currencyList?.map((code: any) => {
                return (
                  <Option key={code} value={code}>
                    {code}
                  </Option>
                );
              })}
            </Select> 
    </>
  );
}

export default CurrencyCodeContract
