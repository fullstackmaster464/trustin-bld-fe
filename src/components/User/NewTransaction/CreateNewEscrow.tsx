import {
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Tooltip,
  message,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { getAllCountries } from "../../../services/masterData";
import { DEFAULT_COUNTRY, DEFAULT_COUNTRY_NAME, DEFAULT_COUNTRY_UAE, MINIMUM_INVOICE_AMOUNT, PLATFORM_CHARGE_APPLIED_ON, TRANSACTION_TYPE, USER_TYPE_TEXT, VALID_CURRENCY, alphanumericRegex, containNumber, getLocalStorage, modifyCresetUserType } from "../../Common/Constants";
import { getContractsDetails } from "../../../services/user";
import {
  getAllItemType,
  getContractDetails,
  getDynamicInputFields,
  getItemTypeCategoryByItemAlias,
  getPaymentDetails,
  getTxnData,
  getUserPlatformFees,
  // getUserData,
} from "../../../services/admin";
import EscrowAdvisorTransactionDetails from "./EscrowAdvisorTransactionDetails";
import TransactionDetails from "./TransactionDetails";
import infoIcon from "../../../assets/img/informIcon.svg"
import CountryFlag from "../../Common/CountryFlag";
// import { InputText } from "../../ui-elements/InputsRepo";
import CallingCodeContract from "../../Common/CallingCodeContract";
import CurrencyCodeContract from "../../Common/CurrencyCodeContract";
import { useDebounce } from "../../ManagerCheques/hook";
import { useWatch } from "antd/es/form/Form";
import PayoutAccount from "./PayoutAccount";
import { calculateUserPlatformFee } from "../../Common/InvoiceCalculations";

const CreateNewEscrow = (props: object|any):any => {
  const {
    formValues,
    setFormValues,
    setCurrencySymbol,
    form,
    setUserExists,
    setCountryPhone,
    contractId,
    userCountry,
    setUserCountry,
    doneSubmit,
    taxDetails,
    setTaxDetails,
    setitemName,
    setcategoryName,
    callingCode,
    setCallingCode,
    hasAdvisor,
    setHasAdvisor,
    countryError,
    setCountryError,
    advisorExists,
    setAdvisorExists,
    advisorFeeType,
    setAdvisorFeeType,
    isDraft,
    userExists,
    countryPhone,
    sellerCountryError,
    setSellerCountryError,
    isDraftedContract, 
    partyCountry,
    sellerAmount,
    payoutAccount,
    setPayoutAccount,
    setOpenAddBankAccountModal,
    bankAccountList,
  } = props;

  const enableAdvisor = process.env.ENABLE_ESCROW_ADVISOR === 'true';
  const [itemTypeList, setItemTypeList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [inputFields, setInputFields] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [currency, setCurrency] = useState("");
  const [isoCode, setIsoCode] = useState("");
  const [escrowisoCode, setEscrowIsoCode] = useState("");
  const [escrowCallingcode, setEscrowCallingcode] = useState("")
  const [didsubmit, setdidsubmit] = useState<any>("DEFAULT");
  const [splitOption, setSplitOption] = useState(false);
  const [splitCommissionOption, setSplitCommissionOption] = useState(false);
  const [isCountrySelected,setIsCountrySelected]=useState(false)
  // const [location, setlocation] = useState("");
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const counterUserAlias = getLocalStorage("counterUserAlias") ? getLocalStorage("counterUserAlias") : "";
  const userType = local ? JSON.parse(local)?.userType : "";
  const entityType = local ? JSON.parse(local)?.entityType : "";
  const { Option } = Select;
  const [itemType, setItemType] = useState(null);
  const [category, setCategory] = useState(null);
  const [errorMsg, setErrorMsg] = useState(false);
  const [minimumValue, setMinimumValue] = useState<any>();
  console.warn(setMinimumValue);
  
  // const [UserData, setUserData] = useState<any>({});
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [representativeData, setRepresentativeData] = useState<any>();
  const [advisorCountry, setAdvisorcountry] = useState();
  const counterParty = formValues.userType === "BUYER" ? "sellerCountry" : "buyerCountry";
  const counterCountry = useWatch(counterParty, form);
  React.useEffect(() => {
    // const unblock = () => {
    //   setlocation(window?.location.pathname);
    // };
    return () => {
      // unblock();
      setdidsubmit(0);
    };
  }, [didsubmit]);

  useEffect(() => {
    if (doneSubmit === true) {
      setdidsubmit(0);
    }
  }, [doneSubmit]);

  // useEffect(()=>{
  //   if(isCountrySelected){
  //     onCountryChange(isoCode)
  //   }
  //   },[isCountrySelected])


  useEffect(() => {
    if (errorMsg == true)
      message.error("Oops! Something went wrong. Please try again later!");
  }, [errorMsg]);

  // const handleApproveCancel = () => {
  //   setshowConfirmationPopup(false);
  //   return false;
  // };

  // const handleApprove = () => {
  //   setshowConfirmationPopup(false);
  //   navigate(`${location}`);
  // };
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
   
  
    const userFromUAE = useMemo(() => {
      return ( partyCountry === DEFAULT_COUNTRY || partyCountry === DEFAULT_COUNTRY_NAME || partyCountry === DEFAULT_COUNTRY_UAE );
    }, [partyCountry]);
 

    useEffect(() => {
      if (!counterCountry) return;
      
      const iscounterCountry = counterCountry === DEFAULT_COUNTRY || counterCountry === DEFAULT_COUNTRY_NAME ||  counterCountry === DEFAULT_COUNTRY_UAE;
 
      setSellerCountryError({
        message: !userFromUAE && !iscounterCountry ? "Either one of you should be from UAE" : "",
        status: !userFromUAE && !iscounterCountry,
      });
    }, [counterCountry, userFromUAE]);
  
  const selectedCurrency = VALID_CURRENCY.includes(currency) ? currency : "AED";

  useEffect(() => { 
    if(formValues?.sellerContactNumber){
      form.setFieldValue('sellerContactNumber',formValues.sellerContactNumber)
    }
  }, [formValues]);

 

  useEffect(() => {
    let _itemTypeList:any = [];
    let itemCategorylist:any = []
    getAllItemType(entityType)
      .then((response: any) => {
        setItemTypeList(response?.data);
        _itemTypeList = response?.data;
      })
      .catch(() => {
        message.error("Oops! Could not fetch list. Please try again later!");
      });
    if (contractId) {
      getTxnData(contractId, isDraftedContract == "true" ? "draft" : "")
        .then((response: any) => {  
          if (_itemTypeList) {
            itemCategorylist = _itemTypeList?.length 
            ? _itemTypeList.filter((item: any) => item.aliasName === response?.data?.itemTypeAlias)
              ?.at(0)?.itemCategories ?? []: [];
            setCategoryList(itemCategorylist);
              getItemTypeCategoryByItemAlias(response?.data?.itemCategoryAlias)
              .then(async (responseData: any) => {
                
                try {
   
                  const fixPlatformCharge = responseData;
                  const userPlatformCharge = await getUserPlatformFees(userAlias, TRANSACTION_TYPE.ESCROW);
                  const counterUserPlatformCharge:any = counterUserAlias ?  await getUserPlatformFees(counterUserAlias, TRANSACTION_TYPE.ESCROW): {};
                  
                  setcategoryName(fixPlatformCharge?.data?.name);

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
                        vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
                        minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
                        platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER,
                      };
                    } else {
                      taxDetailsObj = {
                        ...taxDetails,
                        platformChargeType: counterUserPlatformCharge.data.platformChargeType,
                        plateformFees: Number(counterUserPlatformCharge.data.platformFees),
                        vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
                        minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
                        platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
                      };
                    }
                  } else if (counterUserPlatformCharge?.status === 200 && counterUserPlatformCharge?.data) {
                    taxDetailsObj = {
                      ...taxDetails,
                      platformChargeType: counterUserPlatformCharge?.data?.platformChargeType,
                      plateformFees: Number(counterUserPlatformCharge?.data?.platformFees),
                      vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
                      minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
                      platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
                    };
                  } else if (userPlatformCharge?.status === 200 && userPlatformCharge?.data) {
                    taxDetailsObj = {
                      ...taxDetails,
                      platformChargeType: userPlatformCharge.data.platformChargeType,
                      plateformFees: Number(userPlatformCharge.data.platformFees),
                      vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
                      minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
                      platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
                    };

                  } else {
                    taxDetailsObj = {
                      platformChargeType: fixPlatformCharge?.data?.platformChargeType ?? null,
                      plateformFees: fixPlatformCharge?.data?.plateformFees
                        ? Number(fixPlatformCharge?.data?.plateformFees)
                        : null,
                      vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
                      minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
                      platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.DEFAULT
                    };
                  }
                  setTaxDetails(taxDetailsObj ?? taxDetails);
                } catch (error) {
                  console.error("Failed to fetch tax details", error);
                  // setErrorMsg(true);
                }
                
              })
              .catch(() => {
                setErrorMsg(true);
              });
            
            getContractsDetails(contractId, isDraftedContract == "true" ? "draft" : "")
            .then((resp) => {  

              setFormValues((prevState:any) => ({
                ...prevState,
                name:resp?.data?.getContractDetails?.name, 
                description: resp?.data?.getContractDetails?.description, 
                invoiceAmount: resp?.data?.contractDetails?.getContractDetails?.invoiceAmount,
                currency: resp?.data?.contractDetails?.getContractDetails?.currency
              }))
                const data:any = _itemTypeList.filter((item:any) => item.aliasName === response?.data?.itemTypeAlias)               
                setitemName(data[0]?.name);
                const dataCategory:any = itemCategorylist.filter((item:any) => item.aliasName === response?.data?.itemCategoryAlias)
                setcategoryName(dataCategory?.[0]?.name);
                if (
                  // ["0","1","12"].includes(resp?.data?.contractStatus)
                  ["0","1","12"].includes(resp?.data?.contractDetails?.getContractDetails?.contractStatus)
                ) { 
                  if (resp?.data?.contractDetails?.getContractDetails?.contractStartedBy === "BUYER") {                    
                    setUserCountry(resp?.data?.contractDetails?.getContractDetails?.sellerCountry);
                    setIsoCode(resp?.data?.contractDetails?.getContractDetails?.sellerCountry);
                    setCurrency(resp?.data?.contractDetails?.getContractDetails?.currency);
                    form.setFieldsValue({
                      contractStartedBy: "BUYER",
                      sellerCountry: resp?.data?.contractDetails?.getContractDetails?.sellerCountry,
                    });
                    setIsCountrySelected(true)
                    setItemType(resp?.data?.contractDetails?.getContractDetails?.itemTypeAlias);
                    setCategory(resp?.data?.contractDetails?.getContractDetails?.itemCategoryAlias);
                    form.setFieldsValue({
                      itemTypeAlias: resp?.data?.contractDetails?.getContractDetails?.itemTypeAlias,
                      itemCategoryAlias: resp?.data?.contractDetails?.getContractDetails?.itemCategoryAlias,
                    });
                  }
                  if (Number(resp?.data?.buyerPercent) < 100) {
                    form.setFieldsValue({
                      splitOption: "YES",
                      buyerPercent: resp?.data?.buyerPercent,
                      otherPercent: resp?.data?.sellerPercent,
                    });
                    setSplitOption(true);
                  }
                  if (Number(resp?.data?.buyerCommissionPercent) < 100) {
                    form.setFieldsValue({
                      splitCommissionOption: "YES",
                      buyerCommissionPercent: resp?.data?.buyerCommissionPercent,
                      sellerCommissionPercent: resp?.data?.sellerCommissionPercent,
                    });
                    setSplitCommissionOption(true);
                  }
                  if (resp?.data?.contractDetails?.getContractDetails?.contractStartedBy === "SELLER") {
                    setUserCountry(resp?.data?.contractDetails?.getContractDetails?.buyerCountry);
                    setIsoCode(resp?.data?.contractDetails?.getContractDetails?.buyerCountry);
                    setCurrency(resp?.data?.contractDetails?.getContractDetails?.currency);
                    form.setFieldsValue({
                      contractStartedBy: "SELLER",
                      buyerCountry: resp?.data?.contractDetails?.getContractDetails?.buyerCountry,
                    });
                    setItemType(resp?.data?.contractDetails?.getContractDetails?.itemTypeAlias);
                    setCategory(resp?.data?.contractDetails?.getContractDetails?.itemCategoryAlias);
                    form.setFieldsValue({
                      itemTypeAlias: resp?.data?.contractDetails?.getContractDetails?.itemTypeAlias,
                      itemCategoryAlias: resp?.data?.contractDetails?.getContractDetails?.itemCategoryAlias,
                    });
                  }
                  if (resp?.data?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR) {
                    setUserCountry(resp?.data?.buyerDetails?.countryAlias);
                    setIsoCode(resp?.data?.sellerDetails?.countryAlias);
                    form.setFieldsValue({
                      itemTypeAlias: response?.data?.itemTypeAlias,
                      itemCategoryAlias: response?.data?.itemCategoryAlias,
                    });
                    form.setFieldsValue({
                      contractStartedBy: USER_TYPE_TEXT.ESCROW_ADVISOR,
                      buyerCountry: resp?.data?.buyerDetails?.countryAlias,
                      buyerCommissionPercent: resp?.data?.buyerCommissionPercent,
                      sellerCommissionPercent: resp?.data?.sellerCommissionPercent,
                      escrowAdvisorCommission:resp?.data?.escrowAdvisorCommission
                    });
                  }
                  
                  form.setFieldsValue({
                    invoiceAmount: resp?.data?.contractDetails?.getContractDetails?.invoiceAmount,
                    currency: resp?.data?.contractDetails?.getContractDetails?.currency,
                    buyerPercent: resp?.data?.contractDetails?.getContractDetails?.buyerPercent,
                    sellerPercent: resp?.data?.contractDetails?.getContractDetails?.sellerPercent,
                  });
                  if (hasAdvisor) {
                    let tmpAdvisorCommission = resp?.data?.escrowAdvisorCommission;
                    if (resp?.data?.advisorFeeType === 'PERCENT') {
                      tmpAdvisorCommission = Number(tmpAdvisorCommission) * 100 / Number(resp?.data?.invoiceAmount)
                    }
                    form.setFieldsValue({
                      escrowAdvisorCommission:tmpAdvisorCommission,
                      buyerCommissionPercent: resp?.data?.buyerCommissionPercent,
                      sellerCommissionPercent: resp?.data?.sellerCommissionPercent,
                    });
                  }
                }
                if(response?.data?.dynamicInputFields?.length > 0) {
                  getDynamicInputFields(response?.data?.itemCategoryAlias)
                    .then((res: any) => {
                      setInputFields(
                        res?.data?.filter(
                          (item: any) => item.type === "BASIC_INPUT"
                        )
                      );
                      for (
                        let i = 0;
                        i <= response?.data?.dynamicInputFields?.length;
                        i++
                      ) {
                        form.setFieldsValue({
                          [`dynamicInputFields_${i}`]: {
                            [res?.data[i]?.aliasName]:
                              response?.data?.dynamicInputFields?.[i]?.value,
                          },
                        });
                      }
                    })
                    .catch((error: object) => {
                      if (error) {
                        setErrorMsg(true);
                      }
                    });
                }
                const advisorCountry = resp?.data?.contractDetails?.escrowAdvisorDetails?.countryAlias;
                if(advisorCountry){
                  setAdvisorcountry(advisorCountry)
                  onAdvisorCountryChange(advisorCountry);
                }
              })
              .catch(() => {
                setErrorMsg(true);
              });
          } 
        })
        .catch(() => {
          setErrorMsg(true);
        });
      getPaymentDetails(contractId, isDraftedContract == "true" ? "draft" : "")
        .then((response: any) => {      
          const tmpAdvisorFeeType = response?.data?.advisorFeeType
          let tmpEscrowAdvisorCommission = response?.data?.escrowAdvisorCommission
          if (tmpAdvisorFeeType === 'PERCENT') {
            tmpEscrowAdvisorCommission = Number(tmpEscrowAdvisorCommission) * 100 / Number(response?.data?.invoiceAmount)
          }
          form.setFieldsValue({
            name: response?.data?.itemName,
            description:
              response?.data?.contractDescription === null
                ? null
                : response?.data?.contractDescription,
            itemTypeAlias: response?.data?.itemTypeAlias,
            itemCategoryAlias: response?.data?.itemCategoryAlias,
            invoiceAmount: response?.data?.invoiceAmount,
            // currency: response?.data?.currency,
            currency: 'AED',//TEMP: static currency
            buyerCommissionPercent: response?.data?.buyerCommissionPercent,
            sellerCommissionPercent: response?.data?.sellerCommissionPercent,
            escrowAdvisorCommission:tmpEscrowAdvisorCommission,
            advisorFeeType: tmpAdvisorFeeType ?? 'FIXED'
          });
          
          if (response?.data?.escrowAdvisorAlias && ![response?.data?.buyerAlias,response?.data?.sellerAlias].includes(response?.data?.escrowAdvisorAlias)) {
            form.setFieldsValue({
              advisorOption: 'YES',
            })
            setHasAdvisor(true)
          } 
         
          if (Number(response?.data?.buyerCommissionPercent) < 100) {
            form.setFieldsValue({
              splitCommissionOption: "YES",
              buyerCommissionPercent: response?.data?.buyerCommissionPercent,
              sellerCommissionPercent: response?.data?.sellerCommissionPercent,
            });
            setSplitCommissionOption(true);
            
          }
          if (Number(response?.data?.buyerPercent) < 100) { 
            if(response?.data?.contractStartedBy === "SELLER"){
                form.setFieldsValue({
                  splitOption: "YES",
                  sellerPercent: response?.data?.sellerPercent,
                  otherPercent: response?.data?.buyerPercent,
                });
            }else{
              form.setFieldsValue({
                splitOption: "YES",
                buyerPercent: response?.data?.buyerPercent,
                otherPercent: response?.data?.sellerPercent,
              });
            }
            setSplitOption(true);
          }
        })
        .catch(() => {
          setErrorMsg(true);
        });
    }
    getAllCountries()
      .then((response) => {
        setCountryList(response.data);

        //   if (form.getFieldValue("sellerCountry") || form.getFieldValue("buyerCountry")) {
        //   const currentCountry = form.getFieldValue("sellerCountry") || form.getFieldValue("buyerCountry");
        //   const selected = response.data.find((c: any) => c.isoCode === currentCountry);
        //   if (selected) {
        //     setCallingCode(selected.callingCode);
        //     setIsoCode(selected.isoCode);
        //   }
        // }

      })
      .catch(() => {
        setErrorMsg(true);
      });

    // document.addEventListener("wheel", function (event) {
    //   if (document.activeElement.type === "number") {
    //     document.activeElement.blur();
    //   }
    // });
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);


  const onItemTypeChange = (itemTypeAlias: any) => {
    setItemType(itemTypeAlias);
    setInputFields([]);
    const data:any = itemTypeList.filter((item:any) => item.aliasName === itemTypeAlias)
    setitemName(data?.[0]?.name);
    setCategoryList(
      data[0]
        .itemCategories
    );
    form.setFieldsValue({ itemCategoryAlias: null });
  };

const onItemCategoryChange = async (itemCategoryAlias: any) => {
  setErrorMsg(false);
  setCategory(itemCategoryAlias);

    try {
   
      const fixPlatformCharge = await getItemTypeCategoryByItemAlias(itemCategoryAlias);
      const userPlatformCharge = await getUserPlatformFees(userAlias, TRANSACTION_TYPE.ESCROW);
       const counterUserPlatformCharge:any = counterUserAlias ?  await getUserPlatformFees(counterUserAlias, TRANSACTION_TYPE.ESCROW): {};
      
      setcategoryName(fixPlatformCharge?.data?.name);

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
            vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
            minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
            platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
          };
        } else {
          taxDetailsObj = {
            ...taxDetails,
            platformChargeType: counterUserPlatformCharge.data.platformChargeType,
            plateformFees: Number(counterUserPlatformCharge.data.platformFees),
            vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
            minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
            platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
          };
        }
      } else if (counterUserPlatformCharge?.status === 200 && counterUserPlatformCharge?.data) {
        taxDetailsObj = {
          ...taxDetails,
          platformChargeType: counterUserPlatformCharge?.data?.platformChargeType,
          plateformFees: Number(counterUserPlatformCharge?.data?.platformFees),
          vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
          minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
          platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
        };
      } else if (userPlatformCharge?.status === 200 && userPlatformCharge?.data) {
        taxDetailsObj = {
          ...taxDetails,
          platformChargeType: userPlatformCharge.data.platformChargeType,
          plateformFees: Number(userPlatformCharge.data.platformFees),
          vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
          minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
          platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
        };

      } else {
        taxDetailsObj = {
          platformChargeType: fixPlatformCharge?.data?.platformChargeType ?? null,
          plateformFees: fixPlatformCharge?.data?.plateformFees
            ? Number(fixPlatformCharge?.data?.plateformFees)
            : null,
          vatCharges: fixPlatformCharge?.data?.vatCharges ?? null,
          minimumPlatformFee: fixPlatformCharge?.data?.minimumPlatformCharge ?? null,
          platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.DEFAULT
        };
      }
      setTaxDetails(taxDetailsObj ?? taxDetails);
    } catch (error) {
      console.error("Failed to fetch tax details", error);
      setErrorMsg(true);
    }

  };
  const onAdvisorFeeTypeChange = (type:string) => {
    setAdvisorFeeType(type);
    setFormValues((prevState:any) => ({
      ...prevState,
      advisorFeeType: type,
    }));
    const allValues = form.getFieldsValue()
    for (const key in allValues) {
      const milestoneKey = key.split("_")
      if (milestoneKey[0] === "milestone") {
        form.setFieldsValue({
          [`milestone_${milestoneKey[1]}`]: { name: null },
        });
        form.setFieldsValue({
          [`milestone_${milestoneKey[1]}`]: { amountPercent: null },
        });
        form.setFieldsValue({
          [`milestone_${milestoneKey[1]}`]: {
            amount: null,
          },
        });
        form.setFieldsValue({
          [`milestone_${milestoneKey[1]}`]: { releaseDate: null },
        });
        form.setFieldsValue({
          [`milestone_${milestoneKey[1]}`]: { document: null },
        });
      }
    }
    if(type){
      form.setFieldsValue({
        escrowAdvisorCommission:0,
      });
    }
  }
  const onAdvisorCountryChange = (value: any) => {
    setAdvisorcountry(value);
    setEscrowIsoCode(value)
    setFormValues((prevState:any) => ({
      ...prevState,
      currency: "AED",
      advisorCountry: value
    }));
    const Advisorcallingcode:any =countryList.find((country: { isoCode: string }) => country.isoCode === value);
    const code=Advisorcallingcode?.callingCode
    setEscrowCallingcode(code);
    form.setFieldValue("advisorCountry", value);
  };


  // useEffect(() => {
  //   const UserEmail = JSON.parse(getLocalStorage("auth")!);
  //   getUserData(UserEmail?.email).then((response: any) => {
  //     setUserData(response?.data);
  //   })
  // },[])



  // const validateCountryMatch = async (value: string) => {
  //   if (!value) {
  //     return Promise.resolve();
  //   }
  //   if (value !== UserData.countryName) {
  //     return Promise.reject(`The registered country (${UserData.countryName}) of ${`${formValues?.userType === "SELLER" ? "buyer country" : "seller"}`} doesn't match with the selected country`)
  //   }
  //   return Promise.resolve();
  // };


  const onCurrencyChange = (e: any) => {
    setCurrency(e);
    form.setFieldValue('currency', e)
    setFormValues((prevState:any) => ({
      ...prevState,
      currency: e
    }));
  }

  const onCountryChange = (isoCode: string) => {
    const selectedCountry:any = countryList.find((country: { isoCode: string }) => country.isoCode === isoCode);
    setSellerCountryError({status:false});
    setIsCountrySelected(true)
 
        
    
    const Code = selectedCountry?.callingCode || "";
    setIsoCode(selectedCountry?.isoCode)
    setCallingCode(Code);
        
    // setUserExists(true)

    setdidsubmit(1);
    setCountryPhone(isoCode);
    const currencySymbol = selectedCurrency;//TEMP: static symbol
    // let currencySymbol = filter[0]?.currency?.symbol;
    setCurrencySymbol(currencySymbol);
    // const currency = 'AED'//countryFilter[0]?.currency?.isoCode //TEMP: static currency
    setCurrency(currency); 
    form.setFieldsValue({
      currency: currency
    });
    let country = {};
    if(formValues.userType === "BUYER") {
      form.setFieldsValue({
        sellerCountry: isoCode
      })
      country = { sellerCountry: isoCode }
    } else if(formValues.userType === "SELLER") {
      form.setFieldsValue({
        buyerCountry: isoCode
      })
      country = { buyerCountry: isoCode }
    } 
    setFormValues((prevState:any) => ({
      ...prevState,
      currency: currency,
      country: isoCode,
      ...country
    }));
    
    
  };
  const handleChange:any = useDebounce((e: any) => {
    formValues["changeInvoiceAmount"] = e?.target?.value;
    if (e.target?.id == "escrowAdvisorCommission" ) {
      formValues["escrowAdvisorCommission"] = e?.target?.value;
    }
    setErrorMsg(false);
    if (contractId !== undefined) {
      getContractDetails(contractId, userAlias, isDraftedContract === "true" ? "draft" : "")
        .then((response: any) => {
          if (response?.data?.contractStatus === "0") {
            if (
              response?.data?.invoiceAmount !==
              formValues["changeInvoiceAmount"]
            ) {
              getPaymentDetails(contractId, isDraftedContract == "true" ? "draft" : "")
                .then((resp: any) => {
                  form.setFieldsValue({
                    // isMilestone: true,
                    isMilestone: resp?.data?.isMilestone,
                    milestoneCount: resp?.data?.milestoneList?.length,
                  });
                  const obj = [];
                  for (let i = 1; i <= resp?.data?.milestoneList?.length; i++) {
                    obj.push({
                      id: i,
                      name: "",
                      releaseDate: "",
                      amount: "",
                      document: [],
                    });
                    form.setFieldsValue({
                      [`milestone_${i - 1}`]: { name: null },
                    });
                    form.setFieldsValue({
                      [`milestone_${i - 1}`]: { amountPercent: null },
                    });
                    form.setFieldsValue({
                      [`milestone_${i - 1}`]: {
                        amount: null,
                      },
                    });
                    form.setFieldsValue({
                      [`milestone_${i - 1}`]: { releaseDate: null },
                    });
                    form.setFieldsValue({
                      [`milestone_${i - 1}`]: { document: null },
                    });
                  }
                })
                .catch(() => {
                  setErrorMsg(true);
                });
            }
          }
        })

        .catch(() => {
          setErrorMsg(true);
        });
    }
 
    const name =
      e?.target?.name === "" &&
      (e?.target?.id === "buyerPercent" || e?.target?.id === "sellerPercent")
        ? e?.target?.id
        : e?.target?.name;
    const value = e?.target?.value;
    if (e?.target?.id === "buyerPercent" || e?.target?.id === "sellerPercent") {
      form.setFieldsValue({
        otherPercent: 100 - parseFloat(e.target.value || 0),
      });
      const otherName =
        name === "buyerPercent" ? "sellerPercent" : "buyerPercent";
      setFormValues((prevState:any) => ({
        ...prevState,
        [otherName]: 100 - parseFloat(e.target.value || 0),
      }));
    }
    setFormValues((prevState:any) => ({
      ...prevState,
      [name]: value,
    }));
  }, 500);

  const handleCommissionChange = (e: any) => {
    const name = e?.target?.name === "" && e?.target?.id === "buyerCommissionPercent" ? e?.target?.id : e?.target?.name;
    const value = e?.target?.value;
    if (e?.target?.id === "buyerCommissionPercent") {
      form.setFieldsValue({
        sellerCommissionPercent: 100 - parseFloat(e.target.value || 0),
      });
      const otherName = "sellerCommissionPercent";
      setFormValues((prevState:any) => ({
        ...prevState,
        [otherName]: 100 - parseFloat(e.target.value || 0),
      }));
    }
    setFormValues((prevState:any) => ({
      ...prevState,
      [name]: value,
    }));
  }
  const handleCommissionSplit = () => {
    if(hasAdvisor) {
      if(splitCommissionOption) {
        setFormValues((prevState:any) => ({
          ...prevState,
          buyerCommissionPercent: 100,
          sellerCommissionPercent: 0,
        }));

        form.setFieldsValue({
          buyerCommissionPercent: 100,
          sellerCommissionPercent: 0
        })  
      }
      setSplitCommissionOption(!splitCommissionOption);
      setdidsubmit(1);
    }
  }
  const handleSplit = () => { 
    
    if (splitOption) {
      setFormValues((prevState:any) => ({
        ...prevState,
        buyerPercent: 100,
        sellerPercent: 0,
      }));

      form.setFieldsValue({
        buyerPercent: 100,
        otherPercent: 0
      })

    }
    setSplitOption(!splitOption);
    setdidsubmit(1);
  };
  const handleAdvisor = () => {
    setFormValues((prevState:any) => ({
      ...prevState,
      escrowAdvisorCommission:0,
      buyerCommissionPercent: 100,
      sellerCommissionPercent: 0,
    }));
    form.setFieldsValue({
      escrowAdvisorCommission:0,
    });

    setHasAdvisor(!hasAdvisor);
    setdidsubmit(1);
  }

  const handleInvoiceAmount = (e: any) => {
    let value = e?.target?.value.trim();
    if (value.includes(".")) {
      const parts = value.split(".");
      if (parts[1]?.length > 1) {
        value = `${parts[0]}.${parts[1].substring(0, 1)}`;
      }
    }
    const formValue = { ...formValues };
    formValue["invoiceAmount"] = value;
    form.setFieldsValue({
      invoiceAmount: value,
    });
  };

  const validateName = (e: any) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    form.setFieldsValue({ name: result });
  };
  const validateDescription = (e: any) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    form.setFieldsValue({ description: result });
    const inputValue = e.target.value;
    if (inputValue.length >= 300) {
      message.error("Maximum characters limit reached (300).");
      return;
    }
  };

  useEffect(() => {
    const handleWheel = (e:any) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleKeyDown = (e:any) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
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
  
  const contactNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setdidsubmit(1);
    const fieldName = e.target.id === "sellerContactNumber" ? "sellerContactNumber" : "buyerContactNumber";
    const result = e.target.value.replace(/[^0-9]/gi, "");
    form.setFieldValue(fieldName,result);
    if (callingCode === "+971" && !result.startsWith("5") && result.length > 0) {
      form.setFields([
        {
          name: fieldName,
          errors: ["UAE numbers should start with 5"],
        },
      ]);
    } else {
      form.setFields([{ name: fieldName, errors: [] }]);
    }
  };

 const validateContactNumber = (callingCode: string) => {
    return (_: any, value: string) => {
      const result = value || "";
      if (!result) {
        return Promise.resolve();
      }
      if (callingCode === "+971" && result.length > 0 && !isDraft) {
        if (!result.startsWith("5")) {
          return Promise.reject("UAE numbers should start with 5");
        }
      }
      if (result.length < 7 && !isDraft) {
        return Promise.reject("Contact number must have at least 7 digits");
      }
      return Promise.resolve();
    };
  };

  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };

  return (
  <> 
    <div>
      <Row gutter={36}>
        <Col md={24} className="radioInput">
          <Form.Item
            name="contractStartedBy"
            initialValue={userType === USER_TYPE_TEXT.ESCROW_ADVISOR ? USER_TYPE_TEXT.ESCROW_ADVISOR : USER_TYPE_TEXT.BUYER}
            rules={[
              {
                required: true,
                message: "Please select user type!",
              },
            ]}
          >
            <Radio.Group
              name="userType"
              onChange={(e: any) => {
                setdidsubmit(1);
                handleChange(e)
              }}
              buttonStyle="solid"
              className="stepDetails_medium fw-400 width-50-rem"
            >
              {userType === 'ESCROW_ADVISOR' ? <Radio value={USER_TYPE_TEXT.ESCROW_ADVISOR}>I am Escrow Advisor</Radio> : <>
              <Radio value={USER_TYPE_TEXT.BUYER}>I am {modifyCresetUserType(userAlias,'buyer')}</Radio>
              <Radio value={USER_TYPE_TEXT.SELLER}>I am {modifyCresetUserType(userAlias,'seller')}</Radio>
              </>}
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>      
      <Row>
        <Col span={Width < 992 ? 24 : 8} className="pe-4">
          <p 
            className="enter-text-category"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            Item category
            <Tooltip
              title={
                <span className="response-tooltip">
                  Choose the category the best describes the item involved in this transaction
                </span>
              }
              overlayClassName='custom-tooltip info-icon'
              placement={Width > 475 ? "right" : "top"}
            >
              <img src={infoIcon} className="ms-1 mt-1"/>
            </Tooltip>
          </p>
          <Form.Item
            name="itemTypeAlias"
            rules={[
              {
                required: !isDraft,
                message: "Item category is required!",
              },
            ]}
            className="inputField w-100 no-bg-select"
          >
            <Select
              placeholder="Select item category"
              className="selct-form-field"
              popupClassName="lowerz"
              onChange={(aliasName) => {
                onItemTypeChange(aliasName);
                setdidsubmit(1);
              }}
              showSearch
              allowClear
              optionFilterProp="children"
            >
              {itemTypeList.map((item:any) => {
                return (
                  <Option key={item.aliasName} value={item.aliasName}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={Width < 992 ? 24 : 8} className="pe-4  px-0">
          <p className="enter-text-category">Item type</p>
          <Form.Item
            name="itemCategoryAlias"
            className="inputField w-100  no-bg-select"
            rules={[
              {
                required: !isDraft,
                message: "Item type is required!",
              },
            ]}
          >
            <Select
              placeholder="Select item type"
              className="selct-form-field"
              onChange={(aliasName) => {
                onItemCategoryChange(aliasName);
                setdidsubmit(1);
              }}
              popupClassName="lowerz"
              showSearch
              allowClear
              optionFilterProp="children"
            >
              {categoryList.map((category:any) => {
                return (
                  <Option key={category.aliasName} value={category.aliasName}>
                    {category.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        {inputFields.map((item: any, index: number) => {
          return (
            <>
              <Col span={Width < 992 ? 24 : 8} className="pe-4 px-0" key={`dynamicInputFields_${index}`}>
              <p className="enter-text-category">{item?.name}</p>
                <Form.Item
                  name={[`dynamicInputFields_${index}`, item?.aliasName]}
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      pattern: item?.regexValue,
                      message: `Invalid ${item?.name?.toLowerCase()} format!`,
                    },
                    {
                      required: item?.isMandatory,
                      message: "This field is required!",
                    },
                  ]}
                >
                  <Input
                    maxLength={45}
                    placeholder={item.placeholder}
                    key={item.aliasName}
                    onInput={() => {
                      setdidsubmit(1);
                    }}
                    type={item?.inputFieldType?.toLowerCase()}
                  />
                </Form.Item>
              </Col>
            </>
          );
        })}
        <Col span={Width < 992 ? 24 : 8} className="pe-4">
          <p className="enter-text-category">Item name</p>
          <Form.Item
            name="name"
            className="inputField w-100 error-input"
            rules={[
              {
                required: !isDraft,
                message: "This field is required!",
              },
              {
                whitespace: true,
                message: "Enter valid item name!",
              },
            ]}
          >
            <Input
              placeholder="Enter item name"
              maxLength={45}
              onInput={() => {
                setdidsubmit(1);
              }}
              onChange={(e) => validateName(e)}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <div className="stepDetails fw-400 mb-2 mt-3">
          <span className="stepDetails fw-400 mb-2 mt-3">Description</span>
          <span className="stepDetails_medium_sub"> (Optional)</span>
        </div>
        <Form.Item
          rules={[
            {
              whitespace: true,
              message: "Invalid description!",
            },
          ]}
          name="description"
          className="inputField w-100 mt-3 error-input"
        >
          <Input
            placeholder="Write your description here"
            maxLength={300}
            onInput={() => {
              setdidsubmit(1);
            }}
            onChange={(e) => validateDescription(e)}
          />
        </Form.Item>
      </Row>
      {enableAdvisor && <>
        <div>
          <span className="stepDetails fw-400 mb-2 mt-3 textOverflow" style={{whiteSpace: "wrap"}}>
            Do you want to add escrow advisor?
          </span>
        </div>
        <div>
          <Form.Item className="mb-3 radioInput" name="advisorOption">
            <Radio.Group onChange={handleAdvisor} defaultValue="NO">
              <Radio value="YES">Yes</Radio>
              <Radio value="NO">No</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </>}
      
      {hasAdvisor  ? (
  <>
    <div className="titleText mt-4 mb-4">Escrow advisor&apos;s details</div>
    <EscrowAdvisorTransactionDetails
      formValues={formValues}
      form={form}
      setUserExists={setUserExists}
      countryError={countryError}
      setCountryError={setCountryError}
      setUserCountry={setUserCountry}
      setAdvisorcountry={setAdvisorcountry}
      onAdvisorCountryChange={onAdvisorCountryChange}
      advisorExists={advisorExists}
      setAdvisorExists={setAdvisorExists}
      isDraft={isDraft}
      escrowCallingcode={escrowCallingcode}
      setEscrowCallingcode={setEscrowCallingcode}
    />
    <Row>
      <Col span={Width > 992 ? 8 : 24} className="pe-4">
        <p className="enter-text-category escrowFields">Escrow advisor country</p>
        <Form.Item
          name="advisorCountry"
          rules={[{ required: !isDraft, message: "Country is required!" }]}
          className="modal_inputField w-100 select"
        >
          <div className="country-selection w-100 inputField">
          <CountryFlag isoCode={escrowisoCode} />
          <Select
            disabled={advisorExists}
            value={advisorCountry}
            popupClassName="lowerz"
            placeholder="Select country"
            onChange={onAdvisorCountryChange}
            showSearch
            allowClear
            optionFilterProp="children"
          >
            {countryList.map((country: any) => (
              <Option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </Option>
            ))}
          </Select></div>
        </Form.Item>
      </Col>

      <Col span={Width > 992 ? 8 : 24} className="pe-4">
        <p className="enter-text-category escrowFields">Escrow advisor fees type</p>
        <Form.Item
          name="advisorFeeType"
          className="modal_inputField w-100 select "
        >
          <Select
            popupClassName="lowerz"
            placeholder="Select fee type"
            defaultValue="FIXED"
            onChange={onAdvisorFeeTypeChange}
            showSearch
            optionFilterProp="children"
          >
            <Option key="FIXED" value="FIXED">
              Fixed
            </Option>
            <Option key="PERCENT" value="PERCENT">
              Percent
            </Option>
          </Select>
        </Form.Item>
      </Col>

      <Col span={Width > 992 ? 8 : 24} className="pe-4">
        <p className="enter-text-category escrowFields">
          {advisorFeeType === 'PERCENT' ? 'Escrow advisor fee percent' : 'Escrow advisor fee (Inclusive of VAT)'}
        </p>
        <Form.Item
          name="escrowAdvisorCommission"
          className="inputField w-100 invoice-input"
          rules={[
            { required: true, message: "Escrow advisor fee is required!" },
            { pattern: containNumber, message: "Enter valid amount!" },
            {
              validator(_, value) {
                if (advisorFeeType === 'PERCENT' && parseFloat(value) > 100) {
                  
                  return Promise.reject("Percent exceeds 100%!");
                }
                return Promise.resolve();
              },
            },
          ]} 
        >
          <Input
            placeholder="Enter amount"
            maxLength={45}
            suffix={<span className="custom-suffix">{advisorFeeType === 'PERCENT' ? '%' : 'AED'}</span>}
            onChange={handleChange}
            disabled={!category || !itemType}
            onInput={() => setdidsubmit(1)}
            onKeyPress={(e)=>{
              const charCode = e.charCode;
              if (charCode < 48 || charCode > 57) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>
      </Col>
    </Row>
  </>
) : null}


    
      {hasAdvisor ? (
          <>
            {/* Optional Header if needed */}
            <div>
              <span className="stepDetails fw-400 mb-2 mt-3" style={{whiteSpace: "wrap"}}>
                Do you want to split the escrow advisor fee?
              </span>
              <span className="stepDetails_medium_sub">
                {" "}
                (Fee will be split between {modifyCresetUserType(userAlias,'buyer')} & {modifyCresetUserType(userAlias,'seller')})
              </span>
            </div>
            <div>
              <Form.Item className="mb-3 radioInput" name="splitCommissionOption">
                <Radio.Group onChange={handleCommissionSplit} defaultValue="NO">
                  <Radio value="YES">Yes</Radio>
                  <Radio value="NO">No</Radio>
                </Radio.Group>
              </Form.Item>
              
            </div>
          
            {splitCommissionOption ? (
              <>
                <Row>
                  <Col span={Width < 992 ? 24 : 8}>
                    <p className="enter-text-category">{modifyCresetUserType(userAlias,'Buyer')}&apos;s fee percentage</p>
                    <Form.Item
                      name={`buyerCommissionPercent`}
                      className="inputField w-100 error-input"
                      rules={[
                        {
                          required: !isDraft,
                          message: "Percent is required!",
                        },
                        {
                          validator: (_, value) => {
                            if (isDraft || !value) {
                              return Promise.resolve();
                            }
                            if (parseFloat(value) > 100) {
                              return Promise.reject("Percent exceeds 100%!");
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        suffix={"%"}
                        placeholder="Enter percentage"
                        type="number"
                        onChange={handleCommissionChange}
                        onInput={(e: any) => {
                          setdidsubmit(1);
                          e.target.value = Math.max(0, parseFloat(e.target.value))
                            .toString()
                            .slice(0, 3);
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={Width < 992 ? 24 : 8} className={Width < 992 ? "px-0" : "px-4"}>
                    <p className="enter-text-category">{modifyCresetUserType(userAlias,'Seller')}&apos;s fee percentage</p>
                    <Form.Item
                      name={`sellerCommissionPercent`}
                      className="inputField w-100 error-input"
                      rules={[
                        { required: !isDraft, message: "Percent is required!" }
                      ]}
                    >
                      <Input
                        placeholder={`Will display as per ${modifyCresetUserType(userAlias,'buyer')}'s %`}
                        disabled
                        suffix={"%"}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                
              </>
            ) : (
            null
            )}
            <hr className="lightgrayHr mb-5" />
          </>
        ) : null}

      <div>
        <span className="stepDetails fw-400 mb-2 mt-3 textOverflow">
          Do you want to split the Trustin platform fees?
        </span>
        <span className="stepDetails_medium_sub">
          {" "}
          (Fees will be split between {modifyCresetUserType(userAlias,'buyer')} & {modifyCresetUserType(userAlias,'seller')})
        </span>
        <Tooltip
          title={
            <span className="response-tooltip">
              Choose whether the transaction fees should be divided between the {modifyCresetUserType(userAlias,'buyer')} and {modifyCresetUserType(userAlias,'seller')}.
            </span>
          }
          overlayClassName='custom-tooltip info-icon'
          placement={Width > 475 ? "right" : "top"}
        >
          <img src={infoIcon} className="ms-1"/>
        </Tooltip>
      </div>
      <div>
        <Form.Item className="mb-3 radioInput" name="splitOption">
          <Radio.Group onChange={handleSplit} defaultValue="NO">
            <Radio value="YES">Yes</Radio>
            <Radio value="NO">No</Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      <Row>
        {splitOption && (
          <>
          <Col span={Width < 992 ? 24 : 8}>
              <p className="enter-text-category">
                {modifyCresetUserType(userAlias,formValues?.userType == "BUYER" ? "Buyer" : formValues?.userType == "ESCROW_ADVISOR" ? "Buyer" : "Seller")}&apos;s
                percentage
              </p>
              <Form.Item
                name={`${modifyCresetUserType(userAlias,(formValues.userType)  == 'ESCROW_ADVISOR' ? 'buyer' : (formValues.userType).toLowerCase())}Percent`}
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: "Percent is required!",
                  },
                  {
                    validator: (_, value) => {
                      if (isDraft || !value) {
                        return Promise.resolve();
                      }
                      if (parseFloat(value) > 100) {
                        return Promise.reject("Percent exceeds 100%!");
                      }
                      if (sellerAmount < 0) {
                        return Promise.reject("Invalid split percentage. The seller's share cannot be negative.");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input
                  suffix={"%"}
                  placeholder="Enter percentage"
                  type="number"
                  onChange={(e) => handleChange(e)}
                  onInput={(e: any) => {
                    setdidsubmit(1);
                    e.target.value = Math.max(0, parseFloat(e.target.value))
                      .toString()
                      .slice(0, 3);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={Width < 992 ? 24 : 8} className={Width < 992 ? "px-0":"px-3"}>
              <p className="enter-text-category">
                {modifyCresetUserType(userAlias,formValues?.userType === "SELLER" ? "Buyer" : "Seller")}&apos;s
                percentage 
              </p>
              <Form.Item
                name={`otherPercent`}
                className="inputField w-100 error-input"
              >
                <Input
                  placeholder={`Will display as per ${modifyCresetUserType(userAlias,formValues?.userType == "BUYER" ? "buyer" : formValues?.userType == "ESCROW_ADVISOR" ? "buyer" : "seller")}'s %`}
                  disabled
                  suffix={"%"}
                />
              </Form.Item>
            </Col>
          </>
        )}
        {
          userType === "ESCROW_ADVISOR" && formValues?.userType === USER_TYPE_TEXT.ESCROW_ADVISOR  ? (
            <>
            <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="enter-text-category">
                {modifyCresetUserType(userAlias,'Buyer')} country
              </p>
              <Form.Item
                name="buyerCountry"
                rules={[
                  {
                    required: !isDraft,
                    message: "Country is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
                <Select
                  popupClassName="lowerz"
                  placeholder="Select country"
                  onChange={onCountryChange}
                  showSearch
                  optionFilterProp="children"
                  
                >
                  {countryList.map((country:any) => {
                    // if(country.isoCode === "UAE")
                    return (
                      <Option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="enter-text-category">
                {modifyCresetUserType(userAlias,'Seller')} country
              </p>
              <Form.Item
                name="sellerCountry"
                rules={[
                  {
                    required: !isDraft,
                    message: "Country is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
                <Select
                  popupClassName="lowerz"
                  placeholder="Select country"
                  onChange={onCountryChange}
                  showSearch
                  optionFilterProp="children"
                  allowClear
                >
                  {countryList.map((country:any) => {
                    
                    return (
                      <Option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            </>
          ) : ""
          // (
            // <Col span={Width < 992 ? 24 : 8}>
            //   <p className="enter-text-category">
            //     {/* {formValues?.userType === "SELLER" ? "Buyer " : "Seller "}Country */}
            //   </p>
            //   <Form.Item
            //     name={`${
            //       formValues?.userType === "SELLER" ? "buyer" : "seller"
            //     }Country`}
            //     rules={[
            //       {
            //         required: !isDraft,
            //         message: "Country is required!",
            //       },
            //       // {
            //       //   validator: (_, value) => validateCountryMatch(value),
            //       // }
            //     ]}
            //     className="modal_inputField w-100 select country-errorMes"
            //   >
            //     <Select
            //       popupClassName="lowerz"
            //       placeholder="Select country"
            //       onChange={onCountryChange}
            //       showSearch
            //       optionFilterProp="children"
            //     >
            //       {countryList.map((country:any) => {
 
            //         return (
            //           <Option key={country.isoCode} value={country.name}>
            //             {country.name}
            //           </Option>
            //         );
            //       })}
            //     </Select>
            //   </Form.Item>
            // </Col>
            // ""
          // )
        }
        </Row>
        {formValues.userType === "SELLER" ? <>
          <hr className="lightgrayHr mb-5 mt-4" />
          <PayoutAccount 
            payoutAccount={payoutAccount} 
            setPayoutAccount={setPayoutAccount} 
            form={form} 
            setOpenAddBankAccountModal={setOpenAddBankAccountModal}
            bankAccountList={bankAccountList}
          />
        </> : null}
        <hr className="lightgrayHr mb-5 mt-4" />
        <div>
          { formValues?.userType === USER_TYPE_TEXT.BUYER ? (
            <div className="titleText mt-4 mb-4">
              {" "}
              {modifyCresetUserType(userAlias,'Seller')}&apos;s details
            </div>
          ) : formValues?.userType === USER_TYPE_TEXT.SELLER ? (
            <div className="titleText mt-4 mb-4">
              {" "}
              {modifyCresetUserType(userAlias,'Buyer')}&apos;s details
            </div>
          ) : userType === "ESCROW_ADVISOR" && formValues?.userType === USER_TYPE_TEXT.ESCROW_ADVISOR ? (
            <div className="titleText mt-4 mb-4">
              {" "}
              Details
            </div>
          ) : null}
        </div>
        <TransactionDetails
        formValues={formValues}
        setFormValues={setFormValues}
        form={form}
        userExists={userExists}
        setUserExists={setUserExists}
        advisorExists={advisorExists}
        setAdvisorExists={setAdvisorExists}
        countryError={countryError}
        setCountryError={setCountryError}
        countryPhone={countryPhone}
        contractId={contractId}
        setUserCountry={setUserCountry}
        userCountry={userCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        setEscrowCallingcode={setEscrowCallingcode}
        doneSubmit={doneSubmit}
        hasAdvisor={hasAdvisor}
        sellerCountryError={sellerCountryError}
        setSellerCountryError={setSellerCountryError}
        setIsCountrySelected={setIsCountrySelected}
        isoCode={isoCode}
        setIsoCode={setIsoCode}  
        countryList={countryList}
        onCountryChange={onCountryChange}
        isDraft={isDraft}
        isDraftedContract={isDraftedContract}
        setRepresentativeData={setRepresentativeData}
        taxDetails={taxDetails}
        setTaxDetails={setTaxDetails}
        />

        <Row gutter={36}>
    
        {formValues?.userType !== USER_TYPE_TEXT.SELLER ?
        <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category agreement-text-category">{modifyCresetUserType(userAlias,'Seller')}’s contact number </p>
              <Form.Item
                name="sellerContactNumber"
                className="inputField w-100 error-input"
                validateTrigger={["onBlur", "onChange"]}
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias,'Seller')} contact number is required!`,
                  },
                  {
                    validator: validateContactNumber(callingCode),
                  },
                ]}
              >
                <Input
                addonBefore={<CallingCodeContract callingCode={callingCode} setCallingCode={setCallingCode} isoCode={isoCode} setIsoCode={setIsoCode}/>}
                prefix={callingCode}
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
            </Col>:
            <Col span={Width > 992 ? 8 : 24}>
              <p className="enter-text-category agreement-text-category">Buyer’s contact number</p>
              <Form.Item
                name="buyerContactNumber"
                className="inputField w-100 error-input"
                validateTrigger={["onBlur", "onChange"]}
                rules={[
                  {
                    required: !isDraft,
                    message: `${modifyCresetUserType(userAlias,'Buyer')} contact number is required!`,
                  },
                  {
                    validator: validateContactNumber(callingCode),
                  },
                ]}
              >
                <Input
                addonBefore={<CallingCodeContract callingCode={callingCode} setCallingCode={setCallingCode} isoCode={isoCode} setIsoCode={setIsoCode}/>}
                  prefix={callingCode}
                  disabled={userExists}
                  placeholder={`Enter ${modifyCresetUserType(userAlias,'buyer')} contact number`}
                  maxLength={15}
                  onChange={contactNumber}
                />
              </Form.Item>
            </Col>}


      {
                representativeData  ?
                <>
                    <Col span={Width > 992 ? 8 : 24}>
                    <p  className="enter-text-category" >
                      Representative name
                    </p> 

                    <Form.Item className="inputField w-100">
                      <Input type='text' value={representativeData?.representativeName} disabled />
                    </Form.Item>
                  </Col>


                   <Col span={Width < 992 ? 24 : 8} >
                    <p className="seller-text-category agreement-text-category">Representative Contact Number</p>
                    <Form.Item className="inputField w-100 error-input" >
                      <Input
                      addonBefore={<CallingCodeContract callingCode={representativeData?.representativeCallingCode} isoCode={representativeData?.representativeCountryIsoCode} />}
                      prefix={representativeData?.representativeCallingCode}
                      value={representativeData?.representativeContactNumber}
                      disabled
                      />
                    </Form.Item>
                  </Col>
                </> : null
              }


        <Col span={Width < 992 ? 24 : 8} className={!splitOption ? "px-lg-3 px-3" : "pe-4 "}>
          <p 
            className="enter-text-category seller-text-category agreement-res-amount agreement-text-category"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            Agreement amount
            <Tooltip
              title={
                <span className="response-tooltip">
                  Enter the total monetary value agreed upon for the transaction.
                </span>
              }
              overlayClassName='custom-tooltip info-icon'
              placement={Width > 475 ? "right" : "top"}
            >
              <img src={infoIcon} className="ms-1" />
            </Tooltip>
          </p> 
          <Form.Item
            name="invoiceAmount"
            className="inputField w-100"
            rules={[
              {
                validator(_, value) {
                  if (isDraft) {
                    return Promise.resolve()
                  } else if (!value || parseFloat(value) === 0) {
                    return Promise.reject(`Amount must be greater than ${minimumValue != null ? minimumValue : MINIMUM_INVOICE_AMOUNT}`);
                  } else if (parseFloat(value) <= (minimumValue != null ? minimumValue : MINIMUM_INVOICE_AMOUNT)) {
                    return Promise.reject(`Amount must be greater than ${minimumValue != null ? minimumValue : MINIMUM_INVOICE_AMOUNT}`);
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}>
            <Input
              addonBefore={<CurrencyCodeContract formValues={formValues} onCurrencyChange={onCurrencyChange}/>}
              name="invoiceAmount"
              placeholder="Enter agreement amount"
              type={"number"}
              maxLength={45}
              // disabled={!isoCode || !category || !itemType}
              disabled={!(isCountrySelected || callingCode)}
              // suffix={<span className= "custom-suffix">{currencyName}</span>}
              onKeyPress={(e) => {
                handleInvoiceAmount(e);
              }}
              onKeyDown={handleKeyDown} 
            onChange={handleChange}
              onInput={() => {
                setdidsubmit(1);
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </div> 
   </>
  );
};


export default CreateNewEscrow;
