import {Col, Form, Input, Row, message } from "antd";
import { useEffect, useRef, useState } from "react";
import {
  emailRegex,
  getLocalStorage,
  setLocalStorage,
  DEFAULT_COUNTRY_CODE,
  MobilNumberRegex,
} from "../../Common/Constants";
import {  getUserData } from "../../../services/admin";
import PhoneCode from "../../Common/PhoneCode";
const EscrowAdvisorTransactionDetails = (props: object|any):any => {
  const {
    form,
    setUserExists,  
    onAdvisorCountryChange,
    countryError,
    setCountryError,
    advisorExists,
    setAdvisorExists,
    isDraft,
    escrowCallingcode,
    setEscrowCallingcode
  } = props;
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [didsubmit, setdidsubmit] = useState<any>("DEFAULT");
  const [errorMsg, setErrorMsg] = useState(false)
  const local = getLocalStorage("auth");
  const Email = local ? JSON.parse(local)?.email : "";
  const timer: any|undefined = useRef();

  useEffect(() => {
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
  },[])
  

  useEffect(() => {
    const unblock:any = (data: number) => {
      if (
        window.location.pathname !== "/create-escrow-transaction" &&
        data === 1
      ) {
        // setshowConfirmationPopup(true);
        return false;
      }
    };
    return () => {
      unblock(didsubmit);
      setdidsubmit(0);
    };
  }, [didsubmit]);

 

  useEffect(()=>{
    if(errorMsg == true)
    message.error("Oops! Something went wrong. Please try again later!");
  },[errorMsg])

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  const debounce = (email: any,func: any, delay: any) => {
    return () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        func(email);
      }, delay);
    };
  };

  const searchUserByEmail = (e:any,type = '') => {
    const email = e.target.value;
    setErrorMsg(false)
    if(email === ""){
      setEscrowCallingcode("")
    }
    if (!!email.match(emailRegex) && Email !== email) {
      const userData = debounce(email,(email: any) => {
        getUserData(email)
        .then((res) => {
          
          setEscrowCallingcode(res?.data?.callingCode)
          if (!res.data) {
            return;
          }
          
          //validation to only allow escrow advisor
          if (type === 'advisor' && !(res.data?.userType == 'ESCROW_ADVISOR' || res.data?.userType == 'GUEST')) {//is user not escrow advisor then throw error
            message.error("User not an escrow advisor");
            form.setFieldsValue({
              advisorContactEmail: null
            })
            return;
          }
          
          if (res?.data?.userType === "USER") {
            setUserExists(true);
            setLocalStorage("otherPartyCountry", res.data?.countryAlias);
          } else if (res.data?.userType === 'ESCROW_ADVISOR') {
            setAdvisorExists(true);
          }
          
          if (res?.data?.userType === 'ESCROW_ADVISOR' || res?.data?.userType === 'GUEST') {
            form.setFieldsValue({
              advisorContactNumber: res.data.contactNumber
                ? parseInt(res.data.contactNumber)
                : undefined,
              advisorContactName: res.data.name,
              advisorCountry:res.data.companyCountryIsoCode
            });
            const countryIsoCode = res.data.companyCountryIsoCode;
            onAdvisorCountryChange(countryIsoCode)
            // setCallingCode(res.data.callingCode)
          }
        })
        .catch(() => {
          message.error("User not found");
        })},1000);
      userData();
    }
  };

  const threeFunction = (e:any) => {
    setdidsubmit(1);
    const result = e.target.value.replace(/[^a-z ]/gi, "");
    form.setFieldsValue({ sellerContactName: result });
  };

  const handleBlur = (e:any, contactType:string) => {
    const newValue = e.target.value.startsWith('0') ? e.target.value.substring(1) : e.target.value;
    let fieldName = '';
    if (contactType === 'seller') {
      fieldName = 'sellerContactNumber';
    } else if (contactType === 'advisor') {
      fieldName = 'advisorContactNumber'
    } else {
      fieldName = 'buyerContactNumber'
    }
    form.setFieldValue(fieldName, newValue);
  }

  const contactNumber = (e: any) => {
    setdidsubmit(1);
    const result = e.target.value.replace(/[^0-9]/gi, "");
    const fieldName = e.target.id === "sellerContactNumber" ? "sellerContactNumber" : "buyerContactNumber";
     form.setFieldValue(fieldName, result);
  };


  const validateContactNumber = (_rule: any, value: string) => {
    return new Promise((resolve: any, reject: any) => {
      if (!value) {
        return resolve();
      }
      const validNumber = String(value).replace(new RegExp(MobilNumberRegex, 'g'), '');
      if (escrowCallingcode === DEFAULT_COUNTRY_CODE && !isDraft) {
        if (!validNumber.startsWith('5')) {
          return reject("UAE numbers should start with 5");
        }
      }
      if (validNumber.length < 7 && !isDraft) {
        return reject("Contact number must have at least 7 digits");
      }
      resolve(); 
    });
  };  


  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };

  return <>
    <Row>
      <Col span={Width > 992 ? 8 : 24} className="pe-4">
        <p className="seller-text-category escrow-fields">Escrow advisor’s contact email</p>
        <Form.Item
          name="advisorContactEmail"
          className="inputField w-100 error-input"
          rules={[
            {
              required: !isDraft,
              message: "Escrow advisor contact email is required!",
            },
            {
              pattern: emailRegex,
              message: "Enter valid escrow advisor contact email!",
            },
            () => ({
              validator(_, value) {
                if (!(value === Email)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Email cannot be same!")
                );
              },
            }),
          ]}
        >
          <Input
            placeholder="Enter escrow advisor's contact email"
            onInput={(e:any) => {
              setdidsubmit(1);
              e.target.value = e.target.value.toLowerCase();
              setCountryError({
                message: "",
                status: false,
              });
              form.setFieldsValue({ advisorContactNumber: "" });
              form.setFieldsValue({ advisorContactName: "" });
              setAdvisorExists(false);
            }}
            onChange={(e) => searchUserByEmail(e,'advisor')}
            // onBlur={searchUserByEmail}
          />
        </Form.Item>
        {countryError?.status && (
          <p style={{ color: "red", margin: "-16px 0px 16px" }}>
            {countryError?.message}
          </p>
        )}
      </Col>
      <Col span={Width > 992 ? 8 : 24} className="pe-4">
        <p className="seller-text-category escrow-fields">Escrow advisor’s name</p>
        <Form.Item
          name="advisorContactName"
          className="inputField w-100 error-input"
          rules={[
            {
              required: !isDraft,
              message: "Escrow advisor name is required!",
            },
          ]}
        >
          <Input
            disabled={advisorExists}
            placeholder="Enter escrow advisor name"
            onChange={threeFunction}
            maxLength={45}
          />
        </Form.Item>
      </Col>

      <Col span={Width > 992 ? 8 : 24} className="pe-4">
        <p className="seller-text-category escrow-fields">Escrow advisor’s contact number</p>
        <Form.Item
          name="advisorContactNumber"
          className="inputField w-100 error-input"
          validateTrigger={["onBlur", "onChange"]}
          rules={[
            {
              required: !isDraft,
              message: "Escrow advisor contact number is required!",
            },
            {
              validator: validateContactNumber, 
            },
          ]}
        >
          <Input
           addonBefore={<PhoneCode callingCode={escrowCallingcode} />}
            disabled={advisorExists}
            placeholder="Enter escrow advisor contact number"
            onInput={() => {
              setdidsubmit(1);
            }}
            maxLength={10}
            onBlur={(e)=>{handleBlur(e,"advisor")}}
            onChange={contactNumber}
            onKeyPress={(e) => {
              checkNumberInput(e);
              handleBlur(e,"advisor");
            }}
          />
        </Form.Item>
      </Col>
    </Row>
  </>
}

export default EscrowAdvisorTransactionDetails;