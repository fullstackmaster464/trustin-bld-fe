import { Select } from "antd"; 

const BankAccountType = (props: object | any): any => {

  const { form, setAccountType, accountType } = props;

  const { Option } = Select; 


  const handleTypeChange = (value: string) => {
    const accountType = value;
    setAccountType(accountType);
    form.setFieldValue("type", accountType);
    form.setFieldValue("number", "");
  };
  return (
    <> 
        <Select 
            className="m-0 p-0"
            key={"type"}
            value={accountType}
            popupClassName="lowerz"
            placeholder={"Acc No."}
            onChange={handleTypeChange}
            optionFilterProp="children" 
            dropdownStyle={{ width: '80px' }}
        >
            <Option key={"ACCOUNT_NUMBER"} value={"ACCOUNT_NUMBER"}>Acc No.</Option>
            <Option key={"IBAN"} value={"IBAN"}>IBAN</Option>
        </Select> 
    </>
  );
}

export default BankAccountType
