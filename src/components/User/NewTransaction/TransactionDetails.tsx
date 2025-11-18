/* eslint-disable prefer-const */
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { AuthTitle, NormalText } from "../../ui-elements/TextRepo";
import { SecondaryOutLineButton } from "../../ui-elements/ButtonRepo";
import { getContractDetails, getUserData, getUserPlatformFees } from "../../../services/admin";
import {
  PLATFORM_CHARGE_APPLIED_ON,
  TRANSACTION_TYPE,
  // DEFAULT_COUNTRY,
  // DEFAULT_COUNTRY_NAME,
  // DEFAULT_COUNTRY_UAE,
  USER_TYPE_TEXT,
  emailRegex,
  getLocalStorage,
  modifyCresetUserType,
  setLocalStorage,
} from "../../Common/Constants";
import { useNavigate } from "react-router-dom";
import { getAllCountries } from "../../../services/masterData";
// import { InputText } from "../../ui-elements/InputsRepo";
import CountryFlag from "../../Common/CountryFlag";
import { calculateUserPlatformFee } from "../../Common/InvoiceCalculations";
// import { InputText } from "../../ui-elements/InputsRepo";

const TransactionDetails = (props: object | any): any => {
  let {
    formValues,
    setFormValues,
    form,
    userExists,
    setUserExists,
    countryError,
    setCountryError,
    contractId,
    setUserCountry,
    doneSubmit,
    hasAdvisor,
    // advisorExists,
    setAdvisorExists,
    isDraft,
    sellerCountryError,
    setSellerCountryError,
    setIsCountrySelected,
    isoCode,
    setIsoCode,
    setCallingCode,
    // callingCode,
    isDraftedContract,
    countryList,
    onCountryChange,
    setEscrowCallingcode,
    setRepresentativeData,
    // callingCode,
    taxDetails,
    setTaxDetails
  } = props;
  

  const [showCompany, setShowCompany] = useState(false);
  const [didsubmit, setdidsubmit] = useState<any>("DEFAULT");
  const [showConfirmationPopup, setshowConfirmationPopup] = useState(false);
  
  const [location, setlocation] = useState("");
  const [errorMsg, setErrorMsg] = useState(false)
  // const [UserData, setUserData] = useState<any>({});
  const [Width, setWidth] = useState(document?.body?.clientWidth);

  const navigate = useNavigate();
  const local = getLocalStorage("auth");
  const Email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const userType = local ? JSON.parse(local)?.userType : "";
  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  }
  const { Option } = Select;

  useEffect(() => {
    if (errorMsg == true)
      message.error("Oops! Something went wrong. Please try again later!");
  }, [errorMsg])


  // useEffect(() => {
  //   const UserEmail = JSON.parse(getLocalStorage("auth")!);
  //   // Fetch the user data once email is retrieved
  //   if (UserEmail?.email) {
  //     getUserData(UserEmail.email)
  //       .then((response: any) => {
  //         setUserData(response?.data); // Setting the user data after fetching
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching user data:", error);
  //       });
  //   }
  // }, []);


  useEffect(() => {
    if (contractId !== undefined) {
       
      getContractDetails(contractId, userAlias, (isDraft == true || isDraftedContract == "true") ? "draft" : "")
        .then((resp: any) => {
        
         
          if (
            ["0", "1", "12"].includes(resp?.data?.contractStatus) || (isDraftedContract == "true")
          ) {

            if (resp?.data?.contractStartedBy === "BUYER") {
              formValues["userType"] = "BUYER";
              if (resp?.data?.sellerDetails && resp?.data?.sellerDetails?.countrycode) {
                  const isoCode = resp?.data?.sellerDetails?.companyCountryIsoCode ? resp?.data?.sellerDetails?.companyCountryIsoCode : resp?.data?.sellerDetails?.countryAlias
                  const callingCode = resp?.data?.sellerDetails?.callingCode ? resp?.data?.sellerDetails?.callingCode : resp?.data?.sellerDetails?.countrycode

              
                  setIsoCode(isoCode)
                  setCallingCode(callingCode)
                // commenting code, reason is in prod if there is seller if from Pak and business is in UAE, then getting flag error,
                // ex. getting country name and number of user(pak) but displaying flags with uae
                // getAllCountries()
                //   .then((response: any) => {
                //     const country = response.data
                //     let code = country.filter((item: any) => item.callingCode === resp?.data?.sellerDetails?.countrycode)
                //     setIsoCode(code?.[0]?.isoCode)
                //   })
              }else{
                  const isoCode = resp?.data?.sellerDetails?.companyCountryIsoCode ? resp?.data?.sellerDetails?.companyCountryIsoCode : resp?.data?.sellerDetails?.countryAlias
                   getAllCountries()
                  .then((response: any) => {
                    const country = response.data
                    let code = country.filter((item: any) => item.isoCode === isoCode)
                    setIsoCode(code?.[0]?.isoCode)
                    setCallingCode(code?.[0]?.callingCode)
                  })
              
                  
                  // setIsoCode(isoCode)
                  // setCallingCode(  )
              }

              if (resp?.data?.agreementType === "company") {
                setShowCompany(true);
              }
              if (resp?.data?.sellerDetails?.email &&
                !!resp?.data?.sellerDetails?.email.match(emailRegex) &&
                Email !== resp?.data?.sellerDetails?.email
              ) {
                
                if (
                  formValues.userType === USER_TYPE_TEXT.BUYER &&
                  resp?.data?.sellerDetails?.userType === "USER"
                ) {
                  const sellerCountry = resp?.data?.sellerDetails?.companyCountryIsoCode ? resp?.data?.sellerDetails?.companyCountryIsoCode : resp?.data?.sellerDetails?.countryAlias
                  const contactNumber = resp?.data?.sellerDetails?.companyPhoneNumber ? resp?.data.sellerDetails.companyPhoneNumber : resp?.data?.sellerDetails?.contactNumber;
                  const contactName = resp?.data?.sellerDetails?.businessName ? resp?.data?.sellerDetails?.businessName : resp?.data?.sellerDetails?.name;
                  

                  // let country, contactNumber, contactName;
                  
                  // if(res?.data?.kybEntityType === "COMPANY") {
                  //   country = res?.data?.companyCountryIsoCode;
                  //   contactNumber = res?.data?.companyPhoneNumber;
                  //   contactName = res?.data?.businessName;
                  // }else{
                  //   country = res?.data?.countryAlias
                  //   contactNumber = res?.data?.contactNumber;
                  //   contactName = res?.data?.name
                  // }
                  setUserExists(true);
                  setFormValues((prevState:any) => ({
                    ...prevState,
                    sellerCountry: sellerCountry,
                    sellerContactNumber : contactNumber,
                  }));
                   
                  form.setFieldsValue({
                    sellerContactNumber: contactNumber ? parseInt(contactNumber) : undefined,
                    sellerContactName: contactName,
                  });

                    if(resp?.data?.sellerDetails?.kybEntityType === "COMPANY" && resp?.data?.sellerDetails?.representativeName && resp?.data?.sellerDetails?.representativeCallingCode){
                    const obj  = {
                      representativeName : resp?.data?.sellerDetails?.representativeName,
                      representativeCallingCode : resp?.data?.sellerDetails?.representativeCallingCode,
                      representativeContactNumber : resp?.data?.sellerDetails?.representativeContactNumber,
                      representativeCountry : resp?.data?.sellerDetails?.representativeCountry,
                      representativeCountryIsoCode : resp?.data?.sellerDetails?.representativeCountryIsoCode,
                    }
                    setRepresentativeData(obj);
                  }

                } else if (
                  formValues.userType === USER_TYPE_TEXT.SELLER &&
                  resp?.data?.getEmailForTemplate?.userType === "USER"
                ) {
                  
                  
                  setUserExists(true);
                  form.setFieldsValue({
                    buyerContactNumber: resp?.data?.getEmailForTemplate?.contactNumber
                      ? parseInt(resp?.data?.getEmailForTemplate?.contactNumber)
                      : undefined,
                    buyerContactName: resp?.data?.getEmailForTemplate?.name,
                  });
                } else {
                  setFormValues((prevState:any) => ({
                    ...prevState,
                    sellerCountry: resp?.data?.sellerDetails?.companyCountryIsoCode?resp?.data?.sellerDetails?.companyCountryIsoCode:resp?.data?.sellerDetails?.countryAlias
                  }));
                  setUserExists(false);
                }

                setUserCountry(resp?.data?.sellerDetails?.companyCountryIsoCode?resp?.data?.sellerDetails?.companyCountryIsoCode:resp?.data?.sellerDetails?.countryAlias);
              }
            } else if (resp?.data?.contractStartedBy === "SELLER") {
              
              formValues["userType"] = "SELLER";
              const isoCode = resp?.data?.buyerDetails?.companyCountryIsoCode ? resp?.data?.buyerDetails?.companyCountryIsoCode : resp?.data?.buyerDetails?.countryAlias
              const callingCode = resp?.data?.buyerDetails?.callingCode ? resp?.data?.buyerDetails?.callingCode : resp?.data?.buyerDetails?.countrycode
              const buyerCountry = resp?.data?.buyerDetails?.companyCountryIsoCode ? resp?.data?.buyerDetails?.companyCountryIsoCode : resp?.data?.buyerDetails?.countryAlias
              const contactNumber = resp?.data?.buyerDetails?.companyPhoneNumber ? resp?.data.buyerDetails.companyPhoneNumber : resp?.data?.buyerDetails?.contactNumber;
              const contactName   = resp?.data?.buyerDetails?.businessName ? resp?.data?.buyerDetails?.businessName : resp?.data?.buyerDetails?.name;
              form.setFieldsValue({
                contractStartedBy: "SELLER",
                buyerContactEmail: resp?.data?.buyerDetails?.email,
                buyerContactNumber: contactNumber,
                buyerContactName: resp?.data?.buyerDetails?.name,
                buyerCountry: buyerCountry,
                buyerTransactionFor: resp?.data?.agreementType,
                buyerCompanyName: contactName,
              });

              setFormValues((prevState:any) => ({
                ...prevState,
                userType: "SELLER"
              }));
 
             
              
              setCallingCode(callingCode)
              setIsoCode(isoCode)
              // if (resp?.data?.buyerDetails?.countrycode) {
              //   getAllCountries()
              //     .then((response: any) => {
              //       const country = response.data
              //       let code = country.filter((item: any) => item.callingCode === resp?.data?.buyerDetails?.countrycode)
              //       setIsoCode(code?.[0]?.isoCode)
              //     })
              // }

               if(resp?.data?.buyerDetails?.kybEntityType === "COMPANY" && resp?.data?.buyerDetails?.representativeName && resp?.data?.buyerDetails?.representativeCallingCode){
                  const obj  = {
                      representativeName : resp?.data?.buyerDetails?.representativeName,
                      representativeCallingCode : resp?.data?.buyerDetails?.representativeCallingCode,
                      representativeContactNumber : resp?.data?.buyerDetails?.representativeContactNumber,
                      representativeCountry : resp?.data?.buyerDetails?.representativeCountry,
                      representativeCountryIsoCode : resp?.data?.buyerDetails?.representativeCountryIsoCode,
                  }
                  setRepresentativeData(obj);
              }

              if (resp?.data?.agreementType === "company") {
                setShowCompany(true);
              }
              if (
                !!resp?.data?.buyerDetails?.email.match(emailRegex) &&
                Email !== resp?.data?.buyerDetails?.email
              ) {
                
                getUserData(resp?.data?.buyerDetails?.email)
                  .then((res) => {
                    if (res.data) {
                      // if (
                      //   form.getFieldValue(["buyerCountry"]) !==
                      //     res.data?.countryAlias &&
                      //   resp?.data?.sellerDetails?.userType === "USER"
                      // ) {
                      //   setCountryError({
                      //     message: "Country does not match for user!",
                      //     status: true,
                      //   });
                      // }
                      if (
                        formValues.userType === USER_TYPE_TEXT.BUYER &&
                        resp?.data?.sellerDetails?.userType === "USER"
                      ) {
                        setUserExists(true);
                        setFormValues((prevState:any) => ({
                          ...prevState,
                          sellerCountry: resp.data?.companyCountryIsoCode ?resp.data?.companyCountryIsoCode:resp.data?.countryAlias 
                        }));
                        
                        form.setFieldsValue({
                          sellerContactNumber: contactNumber,
                          sellerContactName: res.data.name,
                        });
                      } else if (
                        formValues.userType === USER_TYPE_TEXT.SELLER &&
                        resp?.data?.buyerDetails?.userType === "USER"
                      ) {
                        
                        setUserExists(true); 
                        setFormValues((prevState:any) => ({
                          ...prevState,
                          buyerCountry: buyerCountry     // resp?.data?.buyerDetails?.countryAlias
                        }));
                        form.setFieldsValue({
                          buyerContactNumber: contactNumber,
                          buyerContactName: contactName,
                          buyerCountry : buyerCountry
                        });

                      } else {
                        setUserExists(false);
                      }
                      setUserCountry = res.data?.companyCountryIsoCode ?res.data?.companyCountryIsoCode:res.data?.countryAlias;
                    }
                  })
                  .catch(() => {
                    setErrorMsg(true)
                  });
              }
            } else if (resp?.data?.contractStartedBy === "ESCROW_ADVISOR") {
              formValues["userType"] = userType;
              let contractUserType;
              if (Email === resp?.data?.buyerDetails?.email) {
                contractUserType = 'BUYER';
              } else if (Email === resp?.data?.sellerDetails?.email) {
                contractUserType = 'SELLER';
              } else {
                contractUserType = 'ESCROW_ADVISOR';
              }
              form.setFieldsValue({
                contractStartedBy: contractUserType,
                buyerContactEmail: resp?.data?.buyerDetails?.email,
                buyerContactNumber: resp?.data?.buyerDetails?.contactNumber,
                buyerContactName: resp?.data?.buyerDetails?.name,
                buyerCountry:  resp?.data?.buyerDetails?.companyCountryIsoCode?resp?.data?.buyerDetails?.companyCountryIsoCode:resp?.data?.buyerDetails?.countryAlias,
                buyerTransactionFor: resp?.data?.agreementType,
                buyerCompanyName: resp?.data?.companyName,
                sellerContactEmail: resp?.data?.sellerDetails?.email,
                sellerContactNumber: resp?.data?.sellerDetails?.contactNumber,
                sellerContactName: resp?.data?.sellerDetails?.name,
                sellerCountry: resp?.data?.sellerDetails?.companyCountryIsoCode?resp?.data?.sellerDetails?.companyCountryIsoCode:resp?.data?.sellerDetails?.countryAlias,
                sellerTransactionFor: resp?.data?.agreementType,
                sellerCompanyName: resp?.data?.companyName,
                escrowAdvisorCommission: resp?.data?.escrowAdvisorCommission
              });
              setFormValues({ ...formValues, sellerCountry: resp?.data?.sellerDetails?.companyCountryIsoCode?resp?.data?.sellerDetails?.companyCountryIsoCode:resp?.data?.sellerDetails?.countryAlias });
              if (resp?.data?.agreementType === "company") {
                setShowCompany(true);
              }
              if (
                !!resp?.data?.buyerDetails?.email.match(emailRegex) &&
                Email !== resp?.data?.buyerDetails?.email
              ) {
                getUserData(resp?.data?.buyerDetails?.email)
                  .then((res) => {
                    if (res.data) {
                      // if (
                      //   form.getFieldValue(["buyerCountry"]) !==
                      //     res.data?.countryAlias &&
                      //   resp?.data?.sellerDetails?.userType === "USER"
                      // ) {
                      //   setCountryError({
                      //     message: "Country does not match for user!",
                      //     status: true,
                      //   });
                      // }
                      if (
                        formValues.userType === USER_TYPE_TEXT.BUYER &&
                        resp?.data?.sellerDetails?.userType === "USER"
                      ) {
                        setUserExists(true);
                        setFormValues({ ...formValues, sellerCountry: res.data?.companyCountryIsoCode ?res.data?.companyCountryIsoCode:res.data?.countryAlias });
                        form.setFieldsValue({
                          sellerContactNumber: res.data.contactNumber
                            ? parseInt(res.data.contactNumber)
                            : undefined,
                          sellerContactName: res.data.name,
                        });
                      } else if (
                        formValues.userType === USER_TYPE_TEXT.SELLER &&
                        resp?.data?.buyerDetails?.userType === "USER"
                      ) {
                        setUserExists(true);
                        form.setFieldsValue({
                          buyerContactNumber: res.data.contactNumber
                            ? parseInt(res.data.contactNumber)
                            : undefined,
                          buyerContactName: res.data.name,
                        });
                      } else {
                        setUserExists(false);
                      }
                       setUserCountry = res.data?.companyCountryIsoCode ?res.data?.companyCountryIsoCode:res.data?.countryAlias;
                    }
                  })
                  .catch(() => {
                    setErrorMsg(true)
                  });
              }
            }
            if (resp?.data?.escrowAdvisorDetails?.email) {
              getAllCountries()
                .then((response) => {
                  const countrylist = response.data
                  const selectedCountry: any = countrylist.find((country: { isoCode: string }) => country.isoCode === resp?.data?.escrowAdvisorDetails?.countryAlias);
                  const Code = selectedCountry?.callingCode || "";
                  setIsoCode(selectedCountry?.isoCode)
                  setEscrowCallingcode(Code);
                })
              form.setFieldsValue({
                advisorCountry: resp?.data?.escrowAdvisorDetails?.countryAlias,
                escrowAdvisorCommission: resp?.data?.escrowAdvisorCommission,
                advisorContactEmail: resp?.data?.escrowAdvisorDetails?.email,
                advisorContactName: resp?.data?.escrowAdvisorDetails?.name,
                advisorContactNumber: resp?.data?.escrowAdvisorDetails?.contactNumber
              })
            }
          }
          
        })
        .catch(() => {
          if (isDraftedContract !== "true") {
            setErrorMsg(true)
          } 
        });
    }
    const handleResize = () => setWidthVal();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const unblock: any = (data: number) => {
      setlocation(window.location.pathname);
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

  useEffect(() => {
    if (doneSubmit === true) {
      setdidsubmit(0);
    }
  }, [doneSubmit]);
  const handleApproveCancel = () => {
    setshowConfirmationPopup(false);
    return false;
  };

  const handleApprove = () => {
    setshowConfirmationPopup(false);
    navigate(`${location}`);
  };

  const timer: any | undefined = useRef();
  const debounce = (email: any, func: any, delay: any) => {
    return () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        func(email);
      }, delay);
    };
  };

  const searchUserByEmail = (e: any, type = '') => {
    const email = e.target.value;
    setErrorMsg(false)
    if (email === "") {
      setCallingCode("");
      setLocalStorage("counterUserAlias","");
    }
    setRepresentativeData();
    if (!!email.match(emailRegex) && Email !== email) {
      const userData = debounce(email, (email: any) => {
        getUserData(email)
          .then(async (res) => {
            
            if (!res.data) {
              return;
            }
            
            //validation to only allow escrow advisor
            if (type === 'advisor' && res.data?.userType !== 'ESCROW_ADVISOR') {
              message.error("Escrow advisor not found");
              return;
            }
            if (type !== 'advisor' && res.data?.userType !== 'USER') {//if user not general user then throw error
              message.error("User is invalid");
              form.setFieldsValue({
                buyerContactEmail: null,
                sellerContactEmail: null
              })
              return;
            }
            if (res?.data?.userType === "USER") {
              setUserExists(true);
              setLocalStorage("otherPartyCountry", res.data?.countryAlias);
              setLocalStorage("counterUserAlias", res.data?.userAlias);

            } else if (res.data?.userType === 'ESCROW_ADVISOR') {
              setAdvisorExists(true);
            }

            const isEdit = window?.location?.pathname.includes("edit-escrow-transaction");
            const isCreate = window.location.href.includes("create-escrow-transaction")
            if (isCreate || isEdit) {
              if (formValues?.userType === "BUYER") {
                if (res?.data?.userType === "GUEST") {
                  setUserExists(false);
                  setAdvisorExists(false);
                } else if (res?.data?.userType === "USER") {
                  if (res?.data?.countryAlias && res.data.countryAlias !== form.getFieldValue(["sellerCountry"])) {
                    // const buyerCountry = UserData?.companyCountryIsoCode || UserData?.countryAlias;
                    const sellerCountry = res?.data?.companyCountryIsoCode || res?.data?.countryAlias;
                    form.setFieldsValue({
                      sellerCountry: sellerCountry
                      // setCurrencyName(currency);

                    });
                    setIsCountrySelected(true)
                    // const isBuyerFromUAE = buyerCountry && (buyerCountry === DEFAULT_COUNTRY || buyerCountry === DEFAULT_COUNTRY_NAME || buyerCountry === DEFAULT_COUNTRY_UAE);
                    // const isSellerFromUAE = sellerCountry && (sellerCountry === DEFAULT_COUNTRY || sellerCountry === DEFAULT_COUNTRY_NAME || sellerCountry === DEFAULT_COUNTRY_UAE);
                    
                    // if (!isBuyerFromUAE && !isSellerFromUAE) {
                    //   setSellerCountryError({
                    //     message: "Either one of you should be from UAE",
                    //     status: true
                    //     // message: "",
                    //     // status: false
                    //   });
                    //   setIsCountrySelected(false)
                    //   setIsoCode("")

                    // } else {
                      setSellerCountryError({
                        message: "",
                        status: false
                      });
                    // }
                  }

                  setUserExists(true);
                  let country, contactNumber, contactName;
                   country = res?.data?.companyCountryIsoCode ||  res?.data?.countryAlias;
                    contactNumber = res?.data?.companyPhoneNumber ||res?.data?.contactNumber;
                  if(res?.data?.kybEntityType === "COMPANY") {
                    // country = res?.data?.companyCountryIsoCode;
                    // contactNumber = res?.data?.companyPhoneNumber;
                    contactName = res?.data?.businessName;
                  }else{
                    // country = res?.data?.countryAlias
                    // contactNumber = res?.data?.contactNumber;
                    contactName = res?.data?.name
                  }
                  setFormValues({ ...formValues, sellerCountry: country });
                  
                  
                  form.setFieldsValue({
                    sellerContactNumber: contactNumber ? parseInt(contactNumber) : undefined,
                    sellerContactName: contactName,
                    sellerCountry: country
                  });

                   if(res?.data?.kybEntityType === "COMPANY" && res?.data?.representativeName && res?.data?.representativeCallingCode){
                    const obj  = {
                      representativeName : res?.data?.representativeName,
                      representativeCallingCode : res?.data?.representativeCallingCode,
                      representativeContactNumber : res?.data?.representativeContactNumber,
                      representativeCountry : res?.data?.representativeCountry,
                      representativeCountryIsoCode : res?.data?.representativeCountryIsoCode,
                    }
                    setRepresentativeData(obj);
                  }
                } 
              } else if (formValues?.userType === "SELLER") {
                if (res?.data?.userType === "GUEST") {
                  setUserExists(false);
                  setAdvisorExists(false);
                } else if (res?.data?.userType === "USER") {


                  if (res?.data?.countryAlias && res.data.countryAlias !== form.getFieldValue(["buyerCountry"])) {
                    // const sellerCountry = UserData?.companyCountryIsoCode || UserData?.countryAlias;
                    const buyerCountry = res?.data?.companyCountryIsoCode || res?.data?.countryAlias;
                    
                    form.setFieldsValue({
                      buyerCountry: buyerCountry
                    });

                    setIsCountrySelected(true);
                    // const isBuyerFromUAE = buyerCountry === "United Arab Emirates" || buyerCountry === "AE";
                    // const isSellerFromUAE = sellerCountry === "United Arab Emirates" || sellerCountry === "AE";
                    // if (!isBuyerFromUAE && !isSellerFromUAE) {
                    //   setSellerCountryError({
                    //     message: "Either one of you should be from UAE",
                    //     status: true
                    //   });
                    //   setIsCountrySelected(false)
                    //   setIsoCode("")
                    // } else {
                      setSellerCountryError({
                        message: "",
                        status: false
                      });
                    // }
                  }
                  
                  setUserExists(true);

                  let country, contactNumber, contactName;
                    country = res?.data?.companyCountryIsoCode || res?.data?.countryAlias;
                    contactNumber = res?.data?.companyPhoneNumber || res?.data?.contactNumber;
                  if(res?.data?.kybEntityType === "COMPANY") {
                    // country = res?.data?.companyCountryIsoCode;
                    // contactNumber = res?.data?.companyPhoneNumber;
                    contactName = res?.data?.businessName;
                  }else{
                    // country = res?.data?.countryAlias
                    // contactNumber = res?.data?.contactNumber;
                    contactName = res?.data?.name
                  }

                  setFormValues({ ...formValues, buyerCountry: country });
                  
                  form.setFieldsValue({
                    buyerContactNumber: contactNumber ? parseInt(contactNumber) : undefined,
                    buyerContactName: contactName,
                    buyerCountry: country
                  });

                  if(res?.data?.kybEntityType === "COMPANY" && res?.data?.representativeName && res?.data?.representativeCallingCode){
                    const obj  = {
                      representativeName : res?.data?.representativeName,
                      representativeCallingCode : res?.data?.representativeCallingCode,
                      representativeContactNumber : res?.data?.representativeContactNumber,
                      representativeCountry : res?.data?.representativeCountry,
                      representativeCountryIsoCode : res?.data?.representativeCountryIsoCode,
                    }
                    setRepresentativeData(obj);
                  }
                }
              } else if (formValues?.userType === "ESCROW_ADVISOR") {
                if (res?.data?.userType === "GUEST") {
                  setUserExists(false);
                } else if (res?.data?.userType === "USER" && e?.target?.id == 'buyerContactEmail') {
                  setUserExists(true);
                  form.setFieldsValue({
                    buyerContactNumber: res.data.contactNumber
                      ? parseInt(res.data.contactNumber)
                      : undefined,
                    buyerContactName: res.data.name,
                  });
                } else if (res?.data?.userType === "USER" && e?.target?.id == 'sellerContactEmail') {
                  setUserExists(true);
                  const sellerCountry = res.data?.companyCountryIsoCode ?res.data?.companyCountryIsoCode:res.data?.countryAlias;
                  setFormValues({ ...formValues, sellerCountry: sellerCountry });
                  
                  form.setFieldsValue({
                    sellerContactNumber: res.data.contactNumber
                      ? parseInt(res.data.contactNumber)
                      : undefined,
                    sellerContactName: res.data.name,
                    sellerCountry: sellerCountry,
                  });
                }
              }
            }

          try {
               
            const userPlatformCharge = await getUserPlatformFees(userAlias, TRANSACTION_TYPE.ESCROW);
            const counterUserPlatformCharge:any = res.data?.userAlias ?  await getUserPlatformFees(res.data?.userAlias, TRANSACTION_TYPE.ESCROW): {};
            
            // base tax details from fixPlatformCharge
            let taxDetailsObj:any;

            // override with user-specific fees if available
            if (userPlatformCharge?.status === 200 && userPlatformCharge?.data && counterUserPlatformCharge?.status === 200 && counterUserPlatformCharge?.data) {
              const invoiceAmount = form.getFieldValue("invoiceAmount")
              const buyerAmount = calculateUserPlatformFee(userPlatformCharge?.data, invoiceAmount);
              const sellerAmount = calculateUserPlatformFee(counterUserPlatformCharge?.data, invoiceAmount);
              if (buyerAmount >= sellerAmount && userPlatformCharge) {
                taxDetailsObj = {
                ...taxDetails,
                  platformChargeType: userPlatformCharge.data.platformChargeType,
                  plateformFees: Number(userPlatformCharge.data.platformFees),
                  platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER,
                };
              } else {
                taxDetailsObj = {
                ...taxDetails,
                  platformChargeType: counterUserPlatformCharge.data.platformChargeType,
                  plateformFees: Number(counterUserPlatformCharge.data.platformFees),
                  platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
                };
              }
            } else if (counterUserPlatformCharge?.status === 200 && counterUserPlatformCharge?.data) {
              taxDetailsObj = {
                ...taxDetails,
                platformChargeType: counterUserPlatformCharge?.data?.platformChargeType,
                plateformFees: Number(counterUserPlatformCharge?.data?.platformFees),
                platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
              };
            } else if (userPlatformCharge?.status === 200 && userPlatformCharge?.data) {
              taxDetailsObj = {
                ...taxDetails,
                platformChargeType: userPlatformCharge.data.platformChargeType,
                plateformFees: Number(userPlatformCharge.data.platformFees),
                platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
              };

            } else {
              taxDetailsObj = taxDetails;
            }
            setTaxDetails(taxDetailsObj ?? taxDetails);
          } catch (error) {
            console.error("Failed to fetch tax details", error);
            // setErrorMsg(true);
          }

            if (res?.data?.userType === 'ESCROW_ADVISOR' && hasAdvisor) {
              form.setFieldsValue({
                advisorContactNumber: res.data.contactNumber
                  ? parseInt(res.data.contactNumber)
                  : undefined,
                advisorContactName: res.data.name,
              });
            }
         

            
            
            
          //  if (res?.data?.countryCallingCode) {
          //     setCallingCode(res?.data?.countryCallingCode)
          //     setIsoCode(res?.data?.countryAlias)
          //   }
          //   else { 
            const callingCode = res?.data?.countryCallingCode ? res?.data?.countryCallingCode : res?.data?.callingCode
            const isoCode = res?.data?.companyCountryIsoCode?res?.data?.companyCountryIsoCode: res?.data?.countryAlias;
            // if(res?.data?.kybEntityType === "COMPANY") {
                setUserCountry = isoCode;
                setCallingCode(callingCode)
                setIsoCode(isoCode)
            // } else {
            //     setCallingCode(res?.data?.callingCode)
            //     setIsoCode(res?.data?.countryAlias)
            // }
            
            // }
          })
          .catch(() => {
            message.error("User not found");
          })
      }, 1000);
      userData();
    }
  };
  const handleChange = () => {
    // setError({ status: false, message: "" });
  };

  const twoFunction = (e: any) => {
    setdidsubmit(1);
    handleChange();
    const result = e.target.value.replace(/[^a-z ]/gi, "");
    form.setFieldsValue({ buyerContactName: result });
  };
  const threeFunction = (e: any) => {
    setdidsubmit(1);
    handleChange();
    const result = e.target.value.replace(/[^a-z ]/gi, "");
    form.setFieldsValue({ sellerContactName: result });
  };

  const onCompanyChange = (value: string) => {
    if (value === "individual") {
      setShowCompany(false);
    } else if (value === "company") {
      setShowCompany(true);
    }
  };
  useEffect(() => {
    onCompanyChange('individual');
  }, []);

  const contactNumber = (e: any) => {
    setdidsubmit(1);
    const result = e.target.value.replace(/[^0-9]/gi, "");
    const fieldName = e.target.id === "sellerContactNumber" ? "sellerContactNumber" : "buyerContactNumber";
    
    form.setFieldValue(fieldName, result);
  };
  const handleBlur = (e: any, contactType: string) => {
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
  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };

  return (

    <>
      {/* <Row>
        <Col span={24}>
          <Form.Item
            name="sellerTransactionFor"
            className="mb-4 select radioInput"
            initialValue={"individual"}
          >
            <Radio.Group defaultValue={showCompany} className="my-3">
              <Radio
                value={"individual"}
                onClick={() => {
                  setShowCompany(false);
                }}
              >
                Individual
              </Radio>
              <Radio
                value={"company"}
                onClick={() => {
                  setShowCompany(true);
                }}
              >
                Company
              </Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row> */}
      
       <Row gutter={36}>
        {formValues?.userType === USER_TYPE_TEXT.BUYER ? (
          <>
            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">{modifyCresetUserType(userAlias, 'Seller')}’s contact email</p>
              <Form.Item
                name="sellerContactEmail"
                className={`inputField w-100 error-input ${sellerCountryError?.status ? 'error-border' : ''}`}
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Seller')} contact email is required!`,
                  },
                  {
                    pattern: emailRegex,
                    message: `Enter valid ${modifyCresetUserType(userAlias, 'seller')} contact email!`,
                  },
                  () => ({
                    validator(_, value) {
                      if (!(value === Email)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(`${modifyCresetUserType(userAlias, 'Buyer')} and ${modifyCresetUserType(userAlias, 'seller')} email cannot be same!`)
                      );
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'seller')}'s contact email`}
                  onInput={(e: any) => {
                    setdidsubmit(1);
                    e.target.value = e.target.value.toLowerCase();
                    setCountryError({
                      message: "",
                      status: false,
                    });
                    setSellerCountryError({
                      message: null,
                      status: false,
                    });
                    form.setFieldsValue({
                      sellerCountry: null
                    });
                    form.setFieldsValue({ sellerContactNumber: "" });
                    form.setFieldsValue({ sellerContactName: "" });
                    
                    setFormValues((prevState:any) => ({
                      ...prevState,
                      sellerCountry: null
                    })); 
                    setIsoCode(null)
                    setCallingCode(null)
                    setUserExists(false);
                  }}
                  onChange={searchUserByEmail}
                // onBlur={searchUserByEmail}
                />
              </Form.Item>
              {/* {countryError?.status && (
                <p style={{ color: "red", margin: "-16px 0px 16px" }}>
                  {countryError?.message}
                </p>
              )} */}
              {sellerCountryError?.status && (
                <p style={{ color: "red", margin: "-16px 0px 16px" }}>
                  {sellerCountryError?.message}
                </p>
              )}
            </Col>
            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">{modifyCresetUserType(userAlias, 'Seller')}&apos;s name</p>
              <Form.Item
                name="sellerContactName"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Seller')} name is required!`,
                  },
                ]}
              >
                <Input
                  disabled={userExists}
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'seller')} name`}
                  onChange={threeFunction}
                  maxLength={45}
                />
              </Form.Item>
            </Col>
            <Col span={Width < 992 ? 24 : 8}>
              <p className="enter-text-category">
                {/* {modifyCresetUserType(userAlias, formValues?.userType === "SELLER" ? "Buyer" : "Seller")} country */}
                Residence Country
              </p>
              <Form.Item
                name={`${formValues?.userType === "SELLER" ? "buyer" : "seller"
                  }Country`}
                rules={[
                  {
                    required: !isDraft,
                    message: "Country is required!",
                  },
                  // {
                  //   validator: (_, value) => validateCountryMatch(value),
                  // }
                ]}
                // className="modal_inputField w-100 no-bg-select country-errorMes"
                className="modal_inputField w-100 select"
              >
                <div className="country-selection w-100 inputField">
                  <CountryFlag isoCode={isoCode} />
                  <Select
                    value={formValues?.userType === "SELLER" ? formValues.buyerCountry : formValues.sellerCountry}
                    popupClassName="lowerz"
                    placeholder="Select country"
                    onChange={onCountryChange}
                    showSearch
                    // disabled={!!sellerCountryError?.status}
                    allowClear
                    disabled={userExists}
                    optionFilterProp="children"
                    >
                    {countryList.map((country:any) => {
                    return (
                      <Option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </Option>
                    );
                  })}
            </Select>
           </div>
          </Form.Item>
        </Col>
            {/* <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">Seller’s contact number</p>
              <Form.Item
                name="sellerContactNumber"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias,'Seller')} contact number is required!`,
                  }
                ]}
              >
                <Input
                addonBefore={<CallingCodeContract callingCode={callingCode} />}
                // addonBefore={<PhoneCode callingCode={callingCode} />}
                  disabled={userExists}
                  placeholder={`Enter ${modifyCresetUserType(userAlias,'seller')} contact number`}
                  onInput={() => {
                    setdidsubmit(1);
                  }}
                  maxLength={10}
                  onBlur={(e)=>{handleBlur(e,"seller")}}
                  onChange={contactNumber}
                  onKeyPress={(e) => {
                    checkNumberInput(e);
                    handleBlur(e,"seller");
                  }}
                />
              </Form.Item>
            </Col> */}
            {showCompany ? (
              <Col span={Width > 992 ? 8 : 24}>
                <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Seller')}’s company name</p>
                <Form.Item
                  name="sellerCompanyName"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: !isDraft,
                      message: `${modifyCresetUserType(userAlias, 'Seller')} company name is required!`,
                    },
                  ]}
                >
                  <Input
                    placeholder={`Enter ${modifyCresetUserType(userAlias, 'seller')} company name`}
                    onInput={() => {
                      setdidsubmit(1);
                    }}
                  />
                </Form.Item>
              </Col>
            ) : null}
          </>
        ) : formValues?.userType === USER_TYPE_TEXT.SELLER ? (
          <>
            <Col span={Width > 992 ? 8 : 24}>
              <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Buyer')}’s contact email</p>
              <Form.Item
                name="buyerContactEmail"
                className={`inputField w-100 error-input ${sellerCountryError?.status ? 'error-border' : ''}`}
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Buyer')} contact email is required!`,
                  },
                  {
                    pattern: emailRegex,
                    message: `Enter valid ${modifyCresetUserType(userAlias, 'buyer')} contact email!`,
                  },
                  () => ({
                    validator(_, value) {
                      if (!(value === Email)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(`${modifyCresetUserType(userAlias, 'Buyer')} and ${modifyCresetUserType(userAlias, 'seller')} email cannot be same!`)
                      );
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'buyer')} contact email`}
                  onInput={(e: any) => {
                    setdidsubmit(1);
                    e.target.value = e.target.value.toLowerCase();
                    setCountryError({
                      message: "",
                      status: false,
                    });
                    setSellerCountryError({
                      message: null,
                      status: false,
                    });
                    form.setFieldsValue({
                      buyerCountry: null
                    });
                    form.setFieldsValue({ buyerContactNumber: "" });
                    form.setFieldsValue({ buyerContactName: "" });
                    setFormValues((prevState:any) => ({
                      ...prevState,
                      buyerCountry: null
                    }));
                    setIsoCode(null)
                    setCallingCode(null)
                    setUserExists(false);
                  }}
                  onChange={searchUserByEmail}
                // onBlur={searchUserByEmail}
                />
              </Form.Item>
              {/* {countryError?.status && (
                <p className="errMsg">{countryError?.message}</p>
              )} */}
              {sellerCountryError?.status && (
                <p style={{ color: "red", margin: "-16px 0px 16px" }}>
                  {sellerCountryError?.message}
                </p>
              )}
            </Col>
            <Col span={Width > 992 ? 8 : 24}>
              <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Buyer')}&apos;s name</p>
              <Form.Item
                name="buyerContactName"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Buyer')} name is required!`,
                  },
                ]}
              >
                <Input
                  disabled={userExists}
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'buyer')} name`}
                  onChange={twoFunction}
                  maxLength={45}
                />
              </Form.Item>
            </Col>
            <Col span={Width < 992 ? 24 : 8}>
              <p className="enter-text-category">
                {/* {formValues?.userType === "SELLER" ? "Buyer " : "Seller "}country */}
                Residence Country
              </p>
        
                  <Form.Item
                    name={`${formValues?.userType === "SELLER" ? "buyer" : "seller"}Country`}
                    rules={[
                      {
                        required: true,
                        message: "Country is required!",
                      },
                      // {
                      //   validator: (_, value) => validateCountryMatch(value),
                      // }
                    ]}
                    className="modal_inputField w-100 select"
                  >
                    <div className="country-selection w-100 inputField">
                      <CountryFlag isoCode={isoCode} />
                      <Select
                        value={form.getFieldValue("buyerCountry")}
                        popupClassName="lowerz"
                        placeholder="Select country"
                        onChange={onCountryChange}
                        showSearch
                        allowClear
                        disabled={userExists}
                        optionFilterProp="children"
                      >
                        {countryList.map((country: any) => {
                          return (
                            <Option key={country.isoCode} value={country.isoCode}>
                              {country.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </Form.Item>
                

            </Col>
            {showCompany ? (
              <Col span={Width > 992 ? 8 : 24}>
                <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Buyer')}&apos;s company name</p>
                <Form.Item
                  name="buyerCompanyName"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: !isDraft,
                      message: `${modifyCresetUserType(userAlias, 'Buyer')} company name is required!`,
                    },
                  ]}
                >
                  <Input
                    placeholder={`Enter ${modifyCresetUserType(userAlias, 'buyer')} company name`}
                    onInput={() => {
                      setdidsubmit(1);
                    }}
                  />
                </Form.Item>
              </Col>
            ) : null}
          </>
        ) : userType === "ESCROW_ADVISOR" && formValues?.userType === USER_TYPE_TEXT.ESCROW_ADVISOR ? (
          <>
            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">{modifyCresetUserType(userAlias, 'Seller')} contact email</p>
              <Form.Item
                name="sellerContactEmail"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Seller')} contact email is required!`,
                  },
                  {
                    pattern: emailRegex,
                    message: `Enter valid ${modifyCresetUserType(userAlias, 'seller')} contact email!`,
                  },
                  () => ({
                    validator(_, value) {
                      if (!(value === Email)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(`${modifyCresetUserType(userAlias, 'Buyer')} and ${modifyCresetUserType(userAlias, 'seller')} email cannot be same!`)
                      );
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'seller')}'s contact email`}
                  onInput={(e: any) => {
                    setdidsubmit(1);
                    e.target.value = e.target.value.toLowerCase();
                    setCountryError({
                      message: "",
                      status: false,
                    });
                    form.setFieldsValue({ sellerContactNumber: "" });
                    form.setFieldsValue({ sellerContactName: "" });
                    setUserExists(false);
                  }}
                  onChange={searchUserByEmail}
                />
              </Form.Item>
              {countryError?.status && (
                <p style={{ color: "red", margin: "-16px 0px 16px" }}>
                  {countryError?.message}
                </p>
              )}
            </Col>
            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">{modifyCresetUserType(userAlias, 'Seller')}&apos;s name</p>
              <Form.Item
                name="sellerContactName"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Seller')} name is required!`,
                  },
                ]}
              >
                <Input
                  disabled={userExists}
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'seller')} name`}
                  onChange={threeFunction}
                  maxLength={45}
                />
              </Form.Item>
            </Col>

            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">{modifyCresetUserType(userAlias, 'Seller')}’s contact number</p>
              <Form.Item
                name="sellerContactNumber"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Seller')} contact number is required!`,
                  }
                ]}
              >
                <Input
                  disabled={userExists}
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'seller')} contact number`}
                  onInput={() => {
                    setdidsubmit(1);
                  }}
                  maxLength={10}
                  onBlur={(e) => { handleBlur(e, "seller") }}
                  onChange={contactNumber}
                  onKeyPress={(e) => {
                    checkNumberInput(e);
                    handleBlur(e, "seller");
                  }}
                />
              </Form.Item>
            </Col>
            {showCompany ? (
              <Col span={Width > 992 ? 8 : 24}>
                <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Seller')}’s company name</p>
                <Form.Item
                  name="sellerCompanyName"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: !isDraft,
                      message: `${modifyCresetUserType(userAlias, 'Seller')} company name is required!`,
                    },
                  ]}
                >
                  <Input
                    placeholder={`Enter ${modifyCresetUserType(userAlias, 'seller')} company name`}
                    onInput={() => {
                      setdidsubmit(1);
                    }}
                  />
                </Form.Item>
              </Col>
            ) : null}

            <Col span={Width > 992 ? 8 : 24}>
              <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Buyer')}’s contact email</p>
              <Form.Item
                name="buyerContactEmail"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Buyer')} contact email is required!`,
                  },
                  {
                    pattern: emailRegex,
                    message: `Enter valid ${modifyCresetUserType(userAlias, 'buyer')} contact email!`,
                  },
                  () => ({
                    validator(_, value) {
                      if (!(value === form.getFieldValue("sellerContactEmail"))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(`${modifyCresetUserType(userAlias, 'Buyer')} and ${modifyCresetUserType(userAlias, 'seller')} email cannot be same!`)
                      );
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'buyer')} contact email`}
                  onInput={(e: any) => {
                    setdidsubmit(1);
                    e.target.value = e.target.value.toLowerCase();
                    setCountryError({
                      message: "",
                      status: false,
                    });
                    form.setFieldsValue({ buyerContactNumber: "" });
                    form.setFieldsValue({ buyerContactName: "" });
                    setUserExists(false);
                  }}
                  onChange={searchUserByEmail}
                />
              </Form.Item>
              {countryError?.status && (
                <p className="errMsg">{countryError?.message}</p>
              )}
            </Col>
            <Col span={Width > 992 ? 8 : 24}>
              <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Buyer')}&apos;s name</p>
              <Form.Item
                name="buyerContactName"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Buyer')} name is required!`,
                  },
                ]}
              >
                <Input
                  disabled={userExists}
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'buyer')} name`}
                  onChange={twoFunction}
                  maxLength={45}
                />
              </Form.Item>
            </Col>
            <Col span={Width > 992 ? 8 : 24}>
              <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Buyer')}’s contact number</p>
              <Form.Item
                name="buyerContactNumber"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias, 'Buyer')} contact number is required!`,
                  }
                ]}
              >
                <Input
                  disabled={userExists}
                  placeholder={`Enter ${modifyCresetUserType(userAlias, 'buyer')} contact number`}
                  onInput={() => {
                    setdidsubmit(1);
                  }}
                  maxLength={10}
                  onBlur={(e) => { handleBlur(e, "buyer") }}
                  onChange={contactNumber}
                  onKeyPress={(e) => {
                    checkNumberInput(e);
                    handleBlur(e, "buyer");
                  }}
                />
              </Form.Item>
            </Col>
            {showCompany ? (
              <Col span={Width > 992 ? 8 : 24}>
                <p className="enter-text-category">{modifyCresetUserType(userAlias, 'Buyer')}&apos;s company name</p>
                <Form.Item
                  name="buyerCompanyName"
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: !isDraft,
                      message: `${modifyCresetUserType(userAlias, 'Buyer')} company name is required!`,
                    },
                  ]}
                >
                  <Input
                    placeholder={`Enter ${modifyCresetUserType(userAlias, 'buyer')} company name`}
                    onInput={() => {
                      setdidsubmit(1);
                    }}
                  />
                </Form.Item>
              </Col>
            ) : null}
          </>

        ) : null}
      </Row>  
     
      {/* {hasAdvisor && ( 
        <>
          <hr className="lightgrayHr mb-5" />
          <div className="titleText mt-4 mb-4">
            Escrow advisor's details
          </div>
          <Row gutter={36}>
      
            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">Escrow advisor’s contact email</p>
              <Form.Item
                name="advisorContactEmail"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: true,
                    message: "Escrow advisor contact email is required!",
                  },
                  {
                    pattern: emailRegex,
                    message: "Enter valid escrow advisor contact email!",
                  },
                  ({ }) => ({
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
            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">Escrow advisor’s name</p>
              <Form.Item
                name="advisorContactName"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: true,
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

            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">Escrow advisor’s contact number</p>
              <Form.Item
                name="advisorContactNumber"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: true,
                    message: "Escrow advisor contact number is required!",
                  }
                ]}
              >
                <Input
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
      )} */}

      <Modal
        className="text-center modal-box"
        open={showConfirmationPopup}
        closable={false}
        footer={false}
        width={340}
        onCancel={() => handleApproveCancel()}
      >
        <AuthTitle children="Leave page?" className="" />
        <NormalText
          children="Changes you made may not be saved!"
          className="mb-4"
        />
        <div className="ant-modal-footer modalFooter">
          <SecondaryOutLineButton
            key="cancel"
            className="cancel"
            onClick={() => {
              handleApproveCancel();
            }}
          >
            Cancel
          </SecondaryOutLineButton>
          <Button
            onClick={() => {
              handleApprove();
            }}
            type="primary"
            className="reject_btn"
            style={{ height: "40px" }}
          >
            Yes
          </Button>
        </div>
      </Modal>

    </>

  );
};

export default TransactionDetails;
