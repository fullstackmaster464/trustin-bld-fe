import {
  Col,
  Form,
  Input,
   
  Image,
  Row,
  Select,
  Tooltip,
  message,
  Spin,
  Card,
  UploadProps,
  Modal,
  Button,
  DatePicker,
  Upload,
  Radio,
} from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getAllCountries } from "../../services/masterData";
import { acceptedFileExtension,  AuthUserTypes,  beforeUploadFile, capitalizeFirst, DateWithUtcOffset, DEFAULT_COUNTRY, DEFAULT_COUNTRY_NAME, DEFAULT_COUNTRY_UAE, emailRegex, getLocalStorage, MC_TYPE, MINIMUM_INVOICE_AMOUNT, modifyCresetUserType, PLATFORM_CHARGE_APPLIED_ON,  TRANSACTION_TYPE, USER_TYPE_TEXT } from "../Common/Constants";
import infoIcon from "../../assets/img/informIcon.svg"
import CallingCodeContract from "../Common/CallingCodeContract";

import Pdf from "../../assets/img/pdfview.svg";
import Delete from "../../assets/img/delete.svg";
// import Tick from "../../assets/img/circle_orange.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
// import Doc_large from "../../assets/img/Doc_large.svg"; 
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import PlusUpload from "../../assets/img/PlusUpload.svg";
import Dragger from "antd/es/upload/Dragger";
import PDFPreview from "../Common/PdfPreviewIcon";
import { getSearchUserData } from "../../services/cheque";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import dayjs from "dayjs"; 
import moment from "moment";
import { useDebounce } from "./hook";
import { getRiskConfiguration, getuserDetail, getUserPlatformFees } from "../../services/admin";
import { useWatch } from "antd/es/form/Form";
import CountryFlag from "../Common/CountryFlag";
import { calculateUserPlatformFee } from "../Common/InvoiceCalculations";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const SellerDetail = (props: object|any):any => { 
  const {
    formValues,
    setFormValues,
    form,
    currency,
    setCurrency,
    setUserExists,
    setCountryPhone,
    doneSubmit,
    callingCode,
    setCallingCode,
    setCountryError,
    userExists,
    sellerCountryError,
    setSellerCountryError,
    setCounterCountry,
    setCounterNationality,
    nationalityCallingCode,
    setNationalitytCallingCode,
    nationalityIsoCode,
    setNationalityIsoCode,
    fileList2,
    setFileList2,
    category,
    itemType,
    minimumValue,
    isSellerDocCheck,
    isSellerRegistered,
    setIsSellerRegistered,
    chequeDetails,
    counterParty,
    setSearchCounterDetails,
    buyerCountry,
    setSellerAlias,
    taxDetails,
    setTaxDetails,
    setCounterParty,
    isPartyPoa,
    setIsPartyPoa,
    isCounterPoa,
    setIsCounterPoa,
    isPartyBroker,
    setIsPartyBroker,
    isCounterBroker,
    setIsCounterBroker,
    isDraft,
    setProfessionTypeId,
    setProfessionTypeList,
    setResidenceStatusTypeId,
    setResidenceStatusList,
    setBusinessNatureTypeId,
    setBusinessNatureList,
    setCountryofIncorporationTypeId,
    setIncoporationCountryList,
    setSelectedDate,
    professionTypeList,
    residenceStatusList,
    businessNatureList,
    incoporationCountryList,
    selectedDate,
  } = props;

  const [countryList, setCountryList] = useState([]);
  const [isoCode, setIsoCode] = useState("");
  const [didsubmit, setdidsubmit] = useState<any>("DEFAULT"); 
  const [isCountrySelected,setIsCountrySelected]=useState(false)
  const [isNationalitySelected,setIsNationalitySelected]=useState(false)
  // const [location, setlocation] = useState("");
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const Email = local ? JSON.parse(local)?.email : "";
  const { Option } = Select;
  const [errorMsg, setErrorMsg] = useState(false);
  // const [UserData, setUserData] = useState<any>({});
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [imagUrl, setImagUrl] = useState<any>("");
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);

  const [text, setText] = useState<string>("");
  const [loader, setLoader] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [uploadedFile, setuploadedFile] = useState<any>();
  const [expiryDate, setExpiryDate] = useState<any>(null);
  const [documentId, selectedDocumentId] = useState<any>(null);
  const [previewFileUrl, setPreviewFileUrl] = useState<any>(null); 
  const [entityType, setEntityType] = useState<string>(); 
  
  const sellerCountry = useWatch('counterCountry', form);

  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const Token = local ? JSON.parse(local)?.token : ""; 
 
   
  
  const isBuyerFromUAE = useMemo(() => {
    return (
      buyerCountry === DEFAULT_COUNTRY ||
      buyerCountry === DEFAULT_COUNTRY_NAME ||
      buyerCountry === DEFAULT_COUNTRY_UAE
    );
  }, [buyerCountry]);

  useEffect(() => {
    if (!sellerCountry) return;
    
    const isSellerUAE =
      sellerCountry === DEFAULT_COUNTRY ||
      sellerCountry === DEFAULT_COUNTRY_NAME || 
      sellerCountry === DEFAULT_COUNTRY_UAE;
    
    setSellerCountryError({
      message: !isBuyerFromUAE && !isSellerUAE ? "Either one of you should be from UAE" : "",
      status: !isBuyerFromUAE && !isSellerUAE,
    });
  }, [sellerCountry, isBuyerFromUAE]);

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
  useEffect(() => {
     
    getAllCountries()
    .then((response : any) => {
      
      setCountryList(response.data);
    })
    .catch((e) => {
      console.log("getAllCountries e",e);
      setErrorMsg(true);
    });

    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);
 
  useEffect(()=> {
    const counterAlias = [USER_TYPE_TEXT.BUYER, USER_TYPE_TEXT.BUYERPOA].includes(chequeDetails?.contractStartedBy) ? chequeDetails?.sellerAlias : chequeDetails?.buyerAlias;
    if(chequeDetails && counterAlias){
       getuserDetail(counterAlias)
        .then(async(res: any) => {
          
          const email = res?.data?.data?.userDetails?.email;
          if([AuthUserTypes.GUEST,AuthUserTypes.USER].includes(res?.data?.data?.userDetails?.userType)){
            form.setFieldsValue({ 
              counterContactName: res?.data?.data?.userDetails.name,
              counterContactNumber: res?.data?.data?.userDetails?.contactNumber ? res?.data?.data?.userDetails?.contactNumber : undefined, 
              counterCountry: res?.data?.data?.userDetails?.countryAlias,
              countertypeOfEntity: res?.data?.data?.userDetails?.typeOfEntity,
              counterNationality: res?.data?.data?.userDetails?.nationality,
             });
             setIsoCode(res?.data?.data?.userDetails?.countryAlias);
             setNationalityIsoCode(res?.data?.data?.userDetails?.nationalityCode);
             const sellerAlias = res?.data?.data?.userDetails?.userAlias
             setSellerAlias(sellerAlias);

                if(res?.data?.data?.userDetails?.countryAlias && countryList?.length){
                const country : any = countryList.find((country: { isoCode: string }) => country.isoCode === res?.data?.data?.userDetails?.countryAlias);
                if(country) onCountryChange(country.isoCode)
              }
            
                if(res?.data?.data?.userDetails?.nationality && countryList?.length){
                const country : any = countryList.find((country: { isoCode: string }) => country.isoCode === res?.data?.data?.userDetails?.nationality);
                if(country) onNationalityChange(country.isoCode)
              }              
          }

          form.setFieldsValue({ counterContactEmail : email });
          getSearchUserData(email)
          .then((res : any) => {
            if (res.data) {
              
                setSellerDetails(res.data);
            }
          })
           
        });
    }
  },[chequeDetails])

   

  const removeDocument2 = async (id: string) => {
    const filteredDocumentList = fileList2 && fileList2?.filter((elem: any) => elem?.id !== id);
    setFileList2(filteredDocumentList);
  };


  const handleImagePreview = (url:string) => { 
    setPreviewFileUrl(url);
  }

  const handlePDFView = (url: any) => {
    if (url) {
      setImagUrl(url);
      setverifyVisible(true)
    }
  }

  const onNationalityChange = (isoCode: string) => {
    setSellerCountryError({status:false});
    setIsNationalitySelected(true) 
 
    const selectedCountry:any = countryList.find((i: { isoCode: string }) => i.isoCode === isoCode);
    const Code = selectedCountry?.callingCode || "";
    setNationalityIsoCode(selectedCountry?.isoCode);
    console.warn(nationalityCallingCode)
    setNationalitytCallingCode(Code);
    setCounterNationality(selectedCountry?.name)
    setdidsubmit(1);

    form.setFieldsValue({
      currency: "AED",
      counterNationality : isoCode
    });
    setFormValues((prevState:any) => ({
      ...prevState,
      currency: "AED",
      counterNationality: isoCode
    }));
  };

  const onCountryChange = (isoCode: string) => {
   
    setSellerCountryError({status:false});
    setIsCountrySelected(true) 
 
    const selectedCountry:any = countryList.find((i: { isoCode: string }) => i.isoCode === isoCode);
    
    const Code = selectedCountry?.callingCode || "";
    setIsoCode(selectedCountry?.isoCode)
    setCallingCode(Code);
    setCounterCountry(selectedCountry?.name)
    // setUserExists(true)

    // setCurrency(selectedCountry?.currency?.isoCode ?? "AED")
    setCurrency("AED")
    setdidsubmit(1);
    setCountryPhone(isoCode);
    form.setFieldsValue({
      // currency: selectedCountry?.currency?.isoCode ?? "AED",
      currency: "AED",
      counterCountry : isoCode
      // counterContactEmail: "",
      // counterContactNumber: "",
      // counterContactName: "",
      // sellerCompanyName: "",
      // buyerContactEmail: "",
      // buyerContactNumber: "",
      // buyerContactName: "",
      // buyerCompanyName: "",
      // advisorContactEmail: "",
      // advisorContactNumber: '',
      // advisorContactName: ''
    });
    setFormValues((prevState:any) => ({
      ...prevState,
      // currency: selectedCountry?.currency?.isoCode ?? "AED",
      currency: "AED",
      country: isoCode
    }));
  };

  const handleChange:any = (e: any) => {
    formValues["changeInvoiceAmount"] = e?.target?.value;
    
    setErrorMsg(false);
    
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
      invoiceAmount: e?.target?.value,
    }));
  };

  
  const threeFunction = (e:any) => {
    setdidsubmit(1);
    // handleChange();
    const result = e.target.value.replace(/[^a-z ]/gi, "");
    form.setFieldsValue({ counterContactName: result });
  };



  const getRiskConfigurationDetails = async(counterEntityType : string) => {
      setEntityType(counterEntityType);
      const entityType = counterEntityType == "COMPANY" ? "C" : "I";

      setCountryofIncorporationTypeId(0);
      setIncoporationCountryList([]);
      setResidenceStatusTypeId(0);
      setResidenceStatusList([]);
      setBusinessNatureList([]);
  
     await getRiskConfiguration({ RiskCategory: entityType })
        .then((response) => {
          
          
          if (response?.data?.status === 201 || response?.data?.status === 200) {
            
            // setRiskDetails(response?.data?.result);
            if (response?.data?.result && response?.data?.result?.length) {
              const result = response?.data?.result;
              const custRiskIndex = result.findIndex((d: any) => d?.riskCategory == 'Customer Risk')
              const graphicRiskIndex = result.findIndex((d:any) => d.riskCategory == 'Geographic Risk')
              
              if(entityType == 'C'){
                if (custRiskIndex > -1) {
                  result[custRiskIndex]['riskTypes'].map((r: any) => {
                    if (r?.riskType == 'Nature of Business') {
                      setBusinessNatureTypeId(r?.id);
                      setBusinessNatureList(r?.riskItems || [])
                    }
                  })
                }
                if (graphicRiskIndex > -1) {
                  result[graphicRiskIndex]['riskTypes']?.map((r:any) => { 
                    if (r?.riskType == 'Country of Incorporation') {
                      setCountryofIncorporationTypeId(r?.id)
                      setIncoporationCountryList(r?.riskItems || []);
                    }
                  })
                }
              } else {
                if (custRiskIndex > -1) {
                  result[custRiskIndex]['riskTypes'].map((r: any) => {
                    if (r?.riskType == 'Profession') {
  
                      setProfessionTypeId(r?.id);
                      setProfessionTypeList(r?.riskItems || [])
                    }
                    if (r?.riskType == 'Residence Status') {
                      setResidenceStatusTypeId(r?.id);
                      setResidenceStatusList(r?.riskItems || [])
                    }
                  })
                }
              }
              return result
            }
          }
        }).catch((error) => {
          message.error(error?.error?.message ? error?.error?.message : "Something went wrong");
        });
    }

  
    const handleEDDateChange = (date: dayjs.Dayjs | null, dateString:string | string[]) => {
        if (date && !date.isValid()) {
            message.error('Please enter a valid date');
            return;
          }
        setSelectedDate(dateString);
      }
  
  const propss2: UploadProps = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/contracts/uploadSignature",
    beforeUpload: async (file: any, fileListToUpload: any) => {
      const totalFiles = fileList2?.length + fileListToUpload?.length;
      if (totalFiles > 10) {
        message.error('You can only upload a maximum of 10 files.');
        return false
      }

      const checkBeforeUpload = beforeUploadFile(file,"Document")
      if (checkBeforeUpload == true) {
        setLoader(true);
        return true;
      } else {
        setLoader(false);
        message.error(checkBeforeUpload);
        return false
      }
    },

    onChange: async (info : any) => {
 
      const { status, response } = info.file; 
      if (status !== 'uploading') {
        setLoader(false);
      }
      if (status === 'done') {
        setuploadedFile(response);
        setLoader(false);
      } else if (status === 'error') {
        setLoader(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    // onDrop(e) {
      // console.log('Dropped files', e.dataTransfer.files);
    // },
  };


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

  

  useEffect(() => {
    const handleWheel = (e:any) => {
      if (e.target.type === 'number') {
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
      fieldName = 'counterContactNumber';
    } else {
      fieldName = 'buyerContactNumber'
    }
    form.setFieldValue(fieldName, newValue);
  }

   const timer: any|undefined = useRef();
    const debounce = (email: any,func: any, delay: any) => {
      return () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          func(email);
        }, delay);
      };
    }; 
    
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
       }
    };
  }, []);
  
  const onSellerEmailInput = useDebounce((e: any) => {
    
    setdidsubmit(1);
    e.target.value = e.target.value.toLowerCase();
    setIsSellerRegistered(false);
    setCountryError({
      message: "",
      status: false,
    });
    setSellerCountryError({
      message: null,
      status: false,
    });
    form.setFieldsValue({
      counterCountry: null,
      counterContactName: null,
      counterContactNumber: null,
      counterNationality: null,
      countertypeOfEntity: null,
    });
    setIsoCode("");
    setNationalityIsoCode("");
    setCounterNationality("");
    setSellerAlias("");
    setUserExists(false);
    
    setFileList2([])
  }, 500)

  const setSellerDetails = async (details : any) => {
    console.log("details==>",details);
    if (details) {
      const [userPlatformCharge, sellerPlatformCharge]: any = await Promise.all([
        getUserPlatformFees(userAlias, TRANSACTION_TYPE.MC),
        details.userAlias
          ? getUserPlatformFees(details.userAlias, TRANSACTION_TYPE.MC)
          : Promise.resolve({}),
      ]);

      let taxDetailsObj = taxDetails;
      if (
        userPlatformCharge?.status === 200 &&
        userPlatformCharge?.data &&
        sellerPlatformCharge?.status === 200 &&
        sellerPlatformCharge?.data
      ) {
        const invoiceAmount = form.getFieldValue("invoiceAmount");
        const buyerAmount = calculateUserPlatformFee(
          userPlatformCharge?.data,
          invoiceAmount
        );
        const sellerAmount = calculateUserPlatformFee(
          sellerPlatformCharge?.data,
          invoiceAmount
        );
        if (buyerAmount >= sellerAmount && userPlatformCharge) {
          taxDetailsObj = {
            ...taxDetails,
            platformChargeType: userPlatformCharge.data.platformChargeType,
            platformFees: userPlatformCharge.data.platformFees
              ? Number(userPlatformCharge.data.platformFees)
              : taxDetails.platformFees,
            platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER,
          };
        } else {
          taxDetailsObj = {
            ...taxDetails,
            platformChargeType: sellerPlatformCharge.data.platformChargeType,
            platformFees: sellerPlatformCharge.data.platformFees
              ? Number(sellerPlatformCharge.data.platformFees)
              : taxDetails.platformFees,
            platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER,
          };
        }
      } else if (
        sellerPlatformCharge?.status === 200 &&
        sellerPlatformCharge?.data
      ) {
        taxDetailsObj = {
          ...taxDetails,
          platformChargeType: sellerPlatformCharge?.data?.platformChargeType,
          platformFees: sellerPlatformCharge?.data?.platformFees
            ? Number(sellerPlatformCharge?.data?.platformFees)
            : taxDetails.platformFees,
          platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER,
        };
      } else if (userPlatformCharge?.status === 200 && userPlatformCharge?.data) {
        taxDetailsObj = {
          ...taxDetails,
          platformChargeType: userPlatformCharge.data.platformChargeType,
          platformFees: userPlatformCharge.data.platformFees
            ? Number(userPlatformCharge.data.platformFees)
            : taxDetails.platformFees,
          platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER,
        };
      }
      setTaxDetails((prev: any) => ({
        ...prev,
        platformChargeType:
          taxDetailsObj?.platformChargeType ?? taxDetails?.platformChargeType,
        plateformFees: taxDetailsObj?.platformFees ?? taxDetails?.plateformFees,
        platformChargeAppliedOn:
          taxDetailsObj?.platformChargeAppliedOn ??
          taxDetails?.platformChargeAppliedOn,
      }));

      const isCompleted = (details?.ekycState === "COMPLETED");
      setUserExists(isCompleted);
      setIsSellerRegistered([AuthUserTypes.USER, AuthUserTypes.GUEST].includes(details.userType));
      setSellerAlias(details.userAlias);
      setSearchCounterDetails(details);
      let nationalityIsoCode: any;
      if(details?.countryName || details?.countryAlias){
        const country : any = countryList.find((country: { name: string }) => country.name === details?.countryName || country.name === details?.countryAlias);
        onCountryChange(country?.isoCode)
      }
      if (details?.kycNationality || details?.kybNationality) {
        const nationality = details?.kycNationality?.trim()?.toLowerCase()
          || details?.kybNationality?.trim()?.toLowerCase();
        const country: any = countryList.find((c: any) =>
          c?.name?.trim()?.toLowerCase() == nationality
        );
        nationalityIsoCode = country?.isoCode
        onNationalityChange(country?.isoCode)
      }
      if ((details?.kycNationality == null || details?.kycNationality == undefined || details?.kycNationality == "") && (details?.nationality) || (details?.sellerNationality)) {
         const nationality = details?.nationality?.trim()
          || details?.sellerNationality?.trim();
        const country: any = countryList.find((country: any) => country.isoCode?.trim() === nationality);
        nationalityIsoCode = country?.isoCode
        onNationalityChange(country?.isoCode)
      }

      getRiskConfigurationDetails(details?.typeOfEntity);
      
      setTimeout(() => {
 
        const isSellerOnboarded =  ["USER","GUEST"].includes(details.userType) ? "YES" :  "NO";
        let partyPoa:boolean,counterPoa:boolean;
        form.setFieldsValue({
          counterContactName: details.name,
          counterContactNumber: details.contactNumber ? details.contactNumber : undefined, 
          counterCountry: details?.countryAlias,
          countertypeOfEntity: details?.typeOfEntity ?? details?.userTypeOfEntity,
          counterNationality: details?.nationality || nationalityIsoCode,
          isSellerOnboarded: isSellerOnboarded ?? "NO",
          isCounterPoa: isCounterPoa ?? false,
          isPartyPoa: isPartyPoa ?? false
         });
        if (form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.BUYERPOA) {
          form.setFieldValue("isPartyPoa", true)
          partyPoa = true;
        } else if (form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.SELLERPOA) {
          form.setFieldValue("isCounterPoa", true)
          counterPoa = true;
        }
        setFormValues((prevState: any) => ({
          ...prevState,
          isSellerOnboarded: isSellerOnboarded ?? "NO",
          isCounterPoa: counterPoa ?? isCounterPoa ?? false,
          isPartyPoa: partyPoa ?? isPartyPoa ?? false
        }));  
        
        if (details?.typeOfEntity === "INDIVIDUAL") {
          form.setFieldsValue({
            profession: parseInt(details.profession),
            residenceStatus: details.residenceStatus
          });
        } else {
          form.setFieldsValue({
            natureofBusiness: details.natureofBusiness,
            countryofIncorporation: details.countryofIncorporation,
            dob: dayjs(details.dob),
          });
        }
      }, 500);
      const document = details.sellerDocuments?.map((a: any) => {
        return {
          ...a, isExpired: a.expirydate ? dayjs(a.expirydate).isBefore(dayjs()) : false,
        };
      });
      if (fileList2?.length > 0) {
        const sellerDocs = fileList2;
        const expiryDt = typeof expiryDate === 'string' ? expiryDate : expiryDate.format('DD-MM-YYYY');
        const updatedFileList = sellerDocs.map((doc: any) =>
          doc.id === documentId
            ? { ...uploadedFile, document: text, expirydate: DateWithUtcOffset(expiryDt), isExpired: expiryDate ? dayjs(expiryDate).isBefore(dayjs()) : false, }
            : doc
        );
        isSellerDocCheck(updatedFileList?.map((a: any) => a.isExpired).includes(true));
        if (!updatedFileList?.map((a: any) => a.isExpired).includes(true)) {
          setFileList2(updatedFileList);
        } else {
          isSellerDocCheck(document?.map((a: any) => a.isExpired).includes(true));
          setFileList2(document);
        }

      } else {
        isSellerDocCheck(document?.map((a: any) => a.isExpired).includes(true));
        setFileList2(document);
      }
      
  
   }
  }
  
  const searchUserByEmail = (e:any) => {
      const email = e.target.value;
       
      setErrorMsg(false)
      if(email === ""){
        setCallingCode("")
        // setLocalStorage("counterUserAlias","");
      }
      if (!!email.match(emailRegex) && Email !== email) {
        const userData = debounce(email,(email: any) => {
          
         isSellerDocCheck(false);
         getSearchUserData(email)
         .then((res : any) => {
          
          
           if (res.data) {
            if([USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA].includes(formValues?.userType)  && formValues?.transactionType ===  "REQUEST" && res.data.userType == "GUEST_SELLER"){
              message.warning("Email is invalid");
              return;
            }
            setSellerDetails(res.data);
           }
         })
         .catch((e : any) => {
          if (e?.status === 403) {
            clearCounter();
            message.warning(e?.data?.error?.message || "Something went wrong !");
          } else if(e?.data?.error?.message){
            clearCounter();
            message.warning(e.data.error.message);
          } else {
            clearCounter();
            message.warning("Something went wrong !");
          }
         })},1000);
        userData();
      }
  };
  
    const clearCounter = () =>{
      setCountryError({
              message: "",
              status: false,
            });
            setSellerCountryError({
              message: null,
              status: false,
            });
            form.setFieldsValue({
              counterCountry: null,
              counterContactNumber : null,
              counterContactName : null,
              counterNationality : null,
              countertypeOfEntity : null,
              // isSellerOnboarded: "NO",
            });
            setIsoCode("");
            setNationalitytCallingCode("");
            setNationalityIsoCode("")
            setCounterNationality("")
            setUserExists(false);
            setFileList2([]);
            setEntityType("");
            setIsSellerRegistered()
            // setFormValues((prevState: any) => ({
            //   ...prevState,
            //   isSellerOnboarded: "NO",
            // }));
    }

  const contactNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setdidsubmit(1);
    const fieldName = "counterContactNumber";
    const result = e.target.value.replace(/[^0-9]/gi, "");
    form.setFieldValue(fieldName,result);
    // if (callingCode === "+971" && !result.startsWith("5") && result.length > 0) {
    //   form.setFields([
    //     {
    //       name: fieldName,
    //       errors: ["UAE numbers should start with 5"],
    //     },
    //   ]);
    // } else {
    //   form.setFields([{ name: fieldName, errors: [] }]);
    // }
  };

 const validateContactNumber = (_callingCode: string) => {
    return (_: any, value: string) => {
      const result = value || "";
      // if (callingCode === "+971" && result.length > 0) {
      //   if (!result.startsWith("5")) {
      //     return Promise.reject("UAE numbers should start with 5");
      //   }
      // }
      if (isDraft) {
        return Promise.resolve();
      }
      if (result.length < 7) {
        return Promise.reject("Contact number must have at least 7 digits");
      }
      return Promise.resolve();
    };
  };

  const validateBeneficiaryName = (value: any) => {
    if (!value || value.trim() === "") {
        return Promise.reject(new Error("Please enter document name"));
    }
    if (!/^[a-zA-Z0-9\s,\/#?\-\.]*$/.test(value)) {
        return Promise.reject(new Error("Document name: Only letters, numbers, spaces, and , - ? # / . are allowed"));
    }
    if (value.length < 3) {
        return Promise.reject(new Error("Document name must be at least 3 characters"));
    }
    if (value.length > 255) {
        return Promise.reject(new Error("Document name cannot exceed 255 characters"));
    }
    return Promise.resolve();
  };

  const checkNumberInput = (e: any) => {
    const key = e.keyCode || e.which;
    if (!(key >= 48 && key <= 57)) {
      e.preventDefault();
    }
  };

  
  const handleDateChange = (_date: any,_dateString:string | string[]) => { 
    setExpiryDate(_date);
  }


  
  const sellerReupload = (documentDetails : any) => { 
    setUploadModal(true);
    setText(documentDetails?.document);
    setExpiryDate(null);
    setuploadedFile(null);
    selectedDocumentId(documentDetails.id)
  }


  const onUploadDocument = () => {
    const nameValidation = validateBeneficiaryName(text);
    nameValidation
      .then(() => {
        if (!expiryDate) {
        message.error("Please select date");
        return;
      } else if(!uploadedFile) {
        message.error("Please select file");
        return;
      }

        const sellerDocs = fileList2;
        const expiryDt = typeof expiryDate === 'string' ? expiryDate : expiryDate.format('DD-MM-YYYY');
        if (documentId) {
          const updatedFileList = sellerDocs.map((doc: any) =>
            doc.id === documentId
              ? { ...uploadedFile, document: text, expirydate: DateWithUtcOffset(expiryDt), isExpired: expiryDate ? dayjs(expiryDate).isBefore(dayjs()) : false, }
              : doc
          );
          isSellerDocCheck(updatedFileList?.map((a: any) => a.isExpired).includes(true));
          setFileList2(updatedFileList)
        } else {
          const updatedFileList = [...fileList2, { ...uploadedFile, document: text, expirydate: DateWithUtcOffset(expiryDt), isExpired: expiryDate ? dayjs(expiryDate).isBefore(dayjs()) : false, }];
          setFileList2(updatedFileList);
          isSellerDocCheck(updatedFileList?.map((a: any) => a.isExpired).includes(true));
        }

      setUploadModal(false);
      
      setTimeout(() => {
        setuploadedFile(null);
        setText("");  
        setExpiryDate(null);
      }, 1000);
      }).catch((err) => {
        message.error(err.message);
      });
  }

  const onUploadSupplierDoc = ()=>{
    setUploadModal(true);
    setText("");
    setExpiryDate(null)
    setuploadedFile(null);
    selectedDocumentId(null)
  }

  return (
      <>  
       <div>
            <span className="stepDetails fw-400 mb-2 mt-3 textOverflow">
              Is this party a POA 
            </span>
            </div>
          <div>
            {
              (["SELLERPOA","SELLER"].includes(formValues.userType)) ?  
              <Form.Item className="mb-3 radioInput" name="isPartyPoa">
              <Radio.Group  value={isPartyPoa}
                onChange={(e) => {
                    const value = e.target.value;
                    if(value == true){
                      setCounterParty("POA of Buyer");
                      setIsPartyPoa(true);
                    }else{
                      setCounterParty("Buyer");
                      setIsPartyPoa(false);
                    }
                    setFormValues((prevState:any) => ({
                        ...prevState,
                      isPartyPoa: form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.BUYERPOA ?true :isPartyPoa,
                    }));
                }}>
                <Radio value={true}>Yes</Radio> 
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
            : 
            <Form.Item className="mb-3 radioInput"  name="isCounterPoa">
              <Radio.Group value={isCounterPoa}
                onChange={(e) => {
                    const value = e.target.value;
                    if(value == true){
                      setCounterParty("POA of Seller");
                      setIsCounterPoa(true);
                    }else{
                      setCounterParty("Seller");
                      setIsCounterPoa(false);
                    }
                    setFormValues((prevState:any) => ({
                        ...prevState,
                      isCounterPoa: form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.SELLERPOA ? true: isCounterPoa,
                    }));
                }}>
               <Radio value={true}>Yes</Radio> 
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
            }
          </div>
            {
              // USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA
              (([USER_TYPE_TEXT.BUYER, USER_TYPE_TEXT.BUYERPOA].includes(formValues?.userType)) || formValues?.transactionType === "RECEIVE" ) ?
              <>
                <div>
                  <span className="stepDetails fw-400 mb-2 mt-3 textOverflow">
                    Do you want to onboard this party ?
                  </span>
                  <Tooltip
                    title={
                      <span className="response-tooltip">
                        Choose whether the counter party is onboared or not.
                      </span>
                    }
                    overlayClassName='custom-tooltip info-icon'
                    placement={Width > 475 ? "right" : "top"}>
                    <img src={infoIcon} className="ms-1"/>
                  </Tooltip>
                </div>
                <div>
                  <Form.Item className="mb-3 radioInput" name="isSellerOnboarded">
                    <Radio.Group  defaultValue="NO" disabled={userExists} onChange={(event)=>{
                                                                              setIsSellerRegistered(event.target.value === "YES")
                                                                              clearCounter();
                                                                              form.setFieldsValue({ counterContactEmail : null });
                                                                          }} >
                      <Radio value="YES">Yes</Radio>
                      <Radio value="NO">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
                </> : null
            }
           <div style={{display:"none"}}>
            <span className="stepDetails fw-400 mb-2 mt-3 textOverflow">
              Is this party a Broker 
            </span>
            </div>
              <div  style={{display:"none"}}>
            {
              (["SELLERPOA","SELLER"].includes(formValues.userType)) ?  
              <Form.Item className="mb-3 radioInput" name="isPartyBroker">
              <Radio.Group  value={isPartyBroker}
                onChange={(e) => {
                    const value = e.target.value;
                    if(value == true){
                      setCounterParty("Broker of Buyer");
                      setIsPartyBroker(true);
                    }else{
                      setCounterParty("Buyer");
                      setIsPartyBroker(false);
                    }
                    setFormValues((prevState:any) => ({
                        ...prevState,
                      isPartyBroker: isPartyBroker,
                    }));
                }}>
                <Radio value={true}>Yes</Radio> 
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
            : 
            <Form.Item className="mb-3 radioInput"  name="isCounterBroker">
              <Radio.Group value={isCounterBroker}
                onChange={(e) => {
                    const value = e.target.value;
                    if(value == true){
                      setCounterParty("Broker of Seller");
                      setIsCounterBroker(true);
                    }else{
                      setCounterParty("Seller");
                      setIsCounterBroker(false);
                    }
                    setFormValues((prevState:any) => ({
                        ...prevState,
                      isCounterBroker: isCounterBroker,
                    }));
                }}>
               <Radio value={true}>Yes</Radio> 
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
            }
          </div>
          
         <Row gutter={36}>
            <Col span={Width > 992 ? 8 : 24}>
                <p className="seller-text-category">
               {capitalizeFirst(`${counterParty}'s contact email`)}
                </p>
              <Form.Item
                name="counterContactEmail"
                className={`inputField w-100 error-input ${sellerCountryError?.status ? 'error-border' : ''}`}
                rules={[
                  {
                    required: !isDraft,
                    message: `Email is required!`,
                  },
                  {
                    pattern: emailRegex,
                    message: `Enter valid email!`,
                  },
                  () => ({
                    validator(_, value) {
                      if (!(value === Email)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(`${modifyCresetUserType(userAlias,'Buyer')} and ${modifyCresetUserType(userAlias,'Seller')} email cannot be same!`)
                      );
                    },
                  }),
                ]}
              >
                <Input
                  placeholder={`Enter email`}
                  onInput={onSellerEmailInput}
                  onChange={searchUserByEmail}
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
              <p className="seller-text-category"> {capitalizeFirst(`${counterParty}'s name`)}</p>
              <Form.Item
                name="counterContactName"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `Name is required!`,
                  },
                ]}
              >
                <Input
                  readOnly={userExists}
                  placeholder={`Enter name`}
                  onChange={threeFunction}
                  maxLength={45}
                />
              </Form.Item>
            </Col>
            <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
              {capitalizeFirst(`${counterParty}'s residence country`)}
              </p>
              <Form.Item
                name="counterCountry"
                rules={[
                  {
                    required: !isDraft,
                    message: "Country is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
               <div className="country-selection w-100 inputField">
                <CountryFlag isoCode={isoCode} />
                <Select
                  disabled={userExists}
                  popupClassName="lowerz"
                  placeholder="Select country"
                  onChange={onCountryChange}
                  showSearch
                  optionFilterProp="children"
                  value={isoCode || undefined} 
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
               <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
                 {capitalizeFirst(`${counterParty}'s nationality`)}
              </p>
              <Form.Item
                name="counterNationality"
                rules={[
                  {
                    required: !isDraft,
                    message: "Nationality is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
               <div className="country-selection w-100 inputField">
                <CountryFlag isoCode={nationalityIsoCode} />
                <Select
                  disabled={userExists && nationalityIsoCode}
                  popupClassName="lowerz"
                  placeholder="Select nationality"
                  onChange={onNationalityChange}
                  showSearch
                  optionFilterProp="children"
                  value={nationalityIsoCode || undefined} 
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
            <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category agreement-text-category">
                   {capitalizeFirst(`${counterParty}'s contact number`)}</p>
              <Form.Item
                name="counterContactNumber"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: !isDraft,
                    message: `Contact number is required!`,
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
                  placeholder={`Enter contact number`}
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
            </Col>  

            <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
                 {capitalizeFirst(`${counterParty} entity type`)}
              </p>
              <Form.Item
                name="countertypeOfEntity"
                rules={[
                  {
                    required: !isDraft,
                    message: "Entity type is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
                <Select
                  disabled={userExists}
                  onChange={(value)=>{ 
                    console.log("value",value);
                    getRiskConfigurationDetails(value);
                   }}
                  popupClassName="lowerz"
                  placeholder="Select entity"
                  optionFilterProp="children">
                  <Option key="COMPANY" value="COMPANY">Company</Option>
                  <Option key="INDIVIDUAL" value="INDIVIDUAL">Individual</Option>
                </Select>
              </Form.Item>
            </Col>


          {
          entityType == "INDIVIDUAL" && !isSellerRegistered && form.getFieldValue("isSellerOnboarded") == "NO" ? 
           <>
            <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
                Profession  <span className="red">*</span>
              </p>
              <Form.Item
                name="profession"
                rules={[
                  { required: !isDraft, message: "Profession is required!" },
                ]}
                className="modal_inputField w-100 select"
              >
                   <Select
                   
                      style={{minWidth:'370px'}}
                      placeholder="Select profession"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      disabled={userExists}
                      >
                      {professionTypeList?.length > 0 && professionTypeList?.map((value: any, index: any) => {
                          return (
                            <Option key={index} value={value.id} >{value.riskItem}</Option>
                          )
                      })}
                    </Select>
              </Form.Item>
            </Col>

             <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
                Residence  <span className="red">*</span>
              </p>
              <Form.Item
                name="residenceStatus"
                rules={[
                  { required: !isDraft, message: "Residence is required!" },
                ]}
                className="modal_inputField w-100 select">
                  <Select
                      allowClear
                      placeholder={"Residence"}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      showSearch
                      optionFilterProp="children"
                      disabled={userExists}
                    >
                      {residenceStatusList?.length > 0 && residenceStatusList?.map((value: any, index: any) => {
                        return (
                          <Option key={index} value={value.id} >{value.riskItem}</Option>
                        )
                      })}
                    </Select>
              </Form.Item>
            </Col>
            </> : null
          } 


         {
          entityType == "COMPANY" && !isSellerRegistered && form.getFieldValue("isSellerOnboarded") == "NO" ? 
           <>
            <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
                Country of incorporation  <span className="red">*</span>
              </p>
              <Form.Item
                name="countryofIncorporation"
                rules={[
                  { required: !isDraft, message: "Country of incorporation is required!" },
                ]}
                className="modal_inputField w-100 select"
              >
                  <Select
                      placeholder="Select country of incorporation"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      disabled={userExists}
                    >
                      {incoporationCountryList?.length > 0 && incoporationCountryList?.map((value: any, index: any) => {
                          return (
                            <Option key={index} value={value.id} >{value.riskItem}</Option>
                          )
                      })}
                    </Select>
              </Form.Item>
            </Col>

             <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
                Nature of business   <span className="red">*</span>
              </p>
              <Form.Item
                name="natureofBusiness"
                rules={[
                  { required: !isDraft, message: "Nature of business is required!" },
                ]}
                className="modal_inputField w-100 select"
              >
                 <Select
                    allowClear
                    placeholder={"Nature of business"}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    showSearch
                    optionFilterProp="children"
                    disabled={userExists}
                  >
                    {businessNatureList?.length > 0 && businessNatureList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.id} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
              </Form.Item>
            </Col>

               <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
                Establishment date   <span className="red">*</span>
              </p>
              <Form.Item
                name="dob"
                rules={[
                  {
                    required: !isDraft,
                    message: "Establishment date is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
                   <DatePicker
                        placeholder="Select Establishment date"
                        value={selectedDate}
                        format={{
                          format: 'DD-MM-YYYY',
                          type: 'mask',
                        }}
                        onChange={handleEDDateChange}
                        disabled={userExists}
                        disabledDate={(current:any) => {
                          const customDate = moment().format("YYYY-MM-DD");
                          return current && current > moment(customDate, "YYYY-MM-DD");
                        }}
                        className="w-100 d-flex"
                      />
              </Form.Item>
            </Col>

            </> : null
      }

    { formValues?.transactionType !== MC_TYPE.RECEIVE ?
        <Col span={Width < 992 ? 24 : 8} className="px-lg-3 px-3">  
          <p className="enter-text-category seller-text-category agreement-res-amount agreement-text-category capitalize"
            style={{ display: 'flex', alignItems: 'center' }}>
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
                  } else if (parseFloat(value) <= (minimumValue !== null ? minimumValue : MINIMUM_INVOICE_AMOUNT)) {
                    return Promise.reject(`Amount must be greater than ${minimumValue != null ? minimumValue : MINIMUM_INVOICE_AMOUNT}`);
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input
              name="invoiceAmount"
              placeholder="Enter agreement amount"
              type={"number"}
              maxLength={45}
              disabled={!isCountrySelected || !callingCode || !category || !itemType || !isNationalitySelected}
              suffix={<span className= "custom-suffix">{currency}</span>}
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
        : null }
      </Row>
              
             


      { (form.getFieldValue("isSellerOnboarded") == "NO"  &&  ((formValues?.transactionType === MC_TYPE.REQUEST  || ['seller','POA of Seller', 'buyer'].includes(counterParty)) || formValues?.transactionType === MC_TYPE.RECEIVE )) &&
        (<>
          <Row className={Width > 424 ? "mt-3 ms-3 mb-2" : "mt-3 mb-2"}>
            <div className="d-flex w-100">
              <div className="stepDetails_medium upload_address">
                 {capitalizeFirst(`${counterParty}'s document`)}
              </div>
              <Tooltip
                title={
                  <span className="response-tooltip">
                    Emirates ID or Passport is required
                  </span>
                }
                overlayClassName='custom-tooltip'
                placement="top"
              >
                <img src={infoIcon} className="ms-1" />
              </Tooltip>
            </div>
          </Row>
          <Row  className={Width > 424 ? "ms-3 mb-4" : "mb-4"}>
            <div className="doc-block w-100">
              <div className={ "d-flex gap-3 flex-wrap moa-doc-list"}>
                <>
                  {fileList2 && fileList2?.map((singleFile: any, index: number) => {
                    const isPDF = singleFile?.url?.includes('.pdf');
                    const isLoading = singleFile?.loading;
                    
                    return (
                      <div key={index}>
                        {singleFile?.url && !isLoading && (
                          <ul className="sellers-moa-doc-list-ul mb-0">
                            <li key={singleFile?.id}>
                              <div>
                                {(singleFile?.file?.name || singleFile?.fileName  || typeof singleFile == 'object') && (singleFile?.status !== "REJECTED") ? (
                                  <div>
                                    {isPDF ? (
                                      <div
                                        className="signature-image sellers-moa-doc-signature-image m admin-panel-pdf-preview pdf-viewIcon"
                                        onClick={() => handlePDFView(singleFile?.url)}
                                      >
                                        <PDFPreview url={singleFile?.url} onPreviewClick={() => handlePDFView(singleFile?.url)} />
                                      </div>
                                    ) : (
                                      <Image preview={true} className="signature-image m sellers-moa-doc-signature-image" src={singleFile?.url} />
                                    )}
                                  </div>
                                ) : null}
                              
                                <div style={{ marginTop: typeof singleFile == 'object' || singleFile?.file?.name ? -12 : 27 }} onClick={()=>{ singleFile?.isExpired ?  sellerReupload(singleFile) : null }}  >
                                  {/* <Image src={Doc_large} alt="passport" preview={false} /> */}
                                  <div className="mt-3 subText_xs overflowText_twoLines w-upload sellers-moa-doc-description">
                                  <Tooltip
                                      title= {singleFile?.document && singleFile?.document.length > 15
                                        ? singleFile?.document
                                        : null
                                      }
          
                                      overlayClassName="leads-custom-tooltip"
                                    >
                                    <div className="ellipsis-container">
                                     {singleFile?.document}
                                    </div>
                                    </Tooltip>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <span className="d-flex endtoend pr-1">
                              <span className={Width > 475 ? "pr-1" : ""}>Expiry date </span>
                              <span className="text-danger mb-2 ml-3rem">
                               { moment(singleFile?.expirydate).format('DD-MM-YYYY') }
                              </span>
                            </span>
                            <span className="d-flex endtoend p-1">
                              <div className="blue_text cursor" onClick={() => (isPDF ? handlePDFView(singleFile.url) : handleImagePreview(singleFile?.url))}>
                                <Image preview={false} src={isPDF ? Pdf : BlueEye} alt="view" />
                                <span className="px-1">View </span>
                              </div>
                              {singleFile?.status !== 'VERIFIED' && !userExists && (
                                <Image
                                  src={Delete}
                                  alt="Delete"
                                  preview={false}
                                  onClick={() => removeDocument2(singleFile.id)}
                                  className="cursor moa-doc-delete-icon"
                                />
                              )}
                              {singleFile?.isExpired && (
                                <span className="text-danger mb-2 ml-3rem">
                                  Expired
                                  <span className="text-danger mb-2 ml-3rem ms-2 cursor">
                                    <UploadOutlined className="upload-icon" onClick={()=>{ sellerReupload(singleFile) }}/> 
                                  </span>
                                </span>
                              )}
                            </span>
                          </ul>
                        )}
                        {isLoading && (
                          <Spin indicator={Loader} className="ml-20" />
                        )}
                      </div>
                    );
                  })}
                  
                  { fileList2?.length < 5 && !userExists ?  <div>
                    <div  onClick={onUploadSupplierDoc} className="seller-upload-document cursor">
                    <div className="seller-upload-document_innerfields">
                        <Image src={PlusUpload} alt="passport" preview={false} />
                        <div className="subText_xs overflowText_twoLines w-upload">
                          {fileList2?.some((file: any) => file.status === 'REJECTED') ? (
                            <span className="rejectReasonText">Re-upload</span>
                          ) : (
                            "Document"
                          )}
                        </div>
                      </div>
                    </div>
                  </div> : ''}
                </>
              </div>
              <Row>
                <ul className="stepDetails_medium_sub mt-4">
                  <li>
                    Resident: Emirates ID (front & back) <br />
                    Non-resident: Passport
                  </li>
                  <li>
                    Trade license of Broker (if any)
                  </li>
                  {((isCounterPoa || isPartyPoa) && counterParty?.includes("POA")) && (
                    <li>
                      {capitalizeFirst(counterParty) === "POA of buyer" ? "Buyer Power of Attorney (POA)" : "Seller Power of Attorney (POA)"} 
                    </li>
                  )}
                </ul>
              </Row>
            </div>
          </Row>
          </>
        )
      }

      {previewFileUrl && 
        <Image
          className="img_preview"
          preview={{
            visible: !!previewFileUrl,
            src: previewFileUrl,
            onVisibleChange: (value) => {
              setPreviewFileUrl(value);
            },
          }}
        />
      }
{/* Upload Documents */}
  <Modal
        open={uploadModal}
        footer={false}
        className="classification-modal"
        title={
          <span className="change-client-classification">
            Upload documents
            <hr className="lightgrayHr" />
          </span>
        }
        centered
      >
        <Row gutter={16} className="mt-3">
              <Col span={24} className="mb-4">
              <div className="doc-block w-100 modal-doc-block">
                    <div className={ "d-flex  moa-doc-list flex-column"}>
                      <> 
                        <p className="seller-text-category" style={{ marginLeft: "0px" }}>Document name</p>
                          <Input placeholder="Enter document name." value={text} type="text" onChange={(e) => setText(e.target.value)} style={{background:'#fafafa'}}/>
                      </>
                    </div>
                  </div>
              </Col>
              <Col span={24} className="mb-4">
              <div className="doc-block w-100 modal-doc-block">
                    <div className={ "d-flex  moa-doc-list flex-column"}>
                      <> 
                      <p className="seller-text-category" style={{marginLeft:'0px'}}>Expiry date</p>
                      {/* <div className="stepDetails_medium fw-500"> */}
                                <DatePicker
                                  value={expiryDate}
                                  style={{width : "100%"}}
                                  onChange={ (date: any, dateString: string | string[]) =>{handleDateChange(date,dateString)}}
                                  format={{
                                    format: 'DD-MM-YYYY',
                                    type: 'mask',
                                  }}
                                  placeholder="Select expiry date"
                                  disabledDate={(current:any)=>{
                                    return current && current.valueOf() < Date.now()
                                  }}
                                />
                            {/* </div> */}
                      </>
                    </div>
                  </div>
              </Col>
              <Col span={24}>
              <div>
                          { uploadedFile?.url ? <Card
                            className=" kybcard" 
                            cover={
                              
                              uploadedFile?.url.includes(
                                ".pdf"
                              ) ? (
                                <>
                                  <div className="admin-panel-pdf-preview" onClick={() => { handlePDFView(uploadedFile?.url) }}>
                                    <PDFPreview
                                      url={uploadedFile?.url || ''}
                                      onPreviewClick={handlePDFView}
                                    />
                                  </div>
                                </>
                              ) : (
                                <Image
                                  alt="example"
                                  src={uploadedFile?.url}
                                  height={175}
                                />
                              )
                            } 
                          >
                          {
                             uploadedFile.isExpired ? 
                            <Upload {...propss2} accept={acceptedFileExtension}>
                            <UploadOutlined className="cursor"/> 
                            <span className="rejectReasonText">Re-upload</span>
                            </Upload> : null 
                            }
                          </Card> : <>
                          <div className="enter-text-category d-flex mb-2 m-0 p-0">Document
                            <Tooltip
                              title={
                                <span className="response-tooltip">
                                  Emirates ID or Passport is required
                                </span>
                              }
                              overlayClassName='custom-tooltip'
                              placement="top"
                            >
                              <img src={infoIcon} className="ms-1" />
                            </Tooltip>
                          </div>
                          <Dragger {...propss2} accept={acceptedFileExtension} className="moa-document d-block">
                           <div>
                              <Image src={PlusUpload} alt="passport" preview={false} />
                              <div className="mt-3 subText_xs overflowText_twoLines mx-4">
                              Upload Document
                              </div>
                            </div>
                            </Dragger>
                          </> 
                          }
                        </div>            
              </Col>

              <Col span={24}>
              <div className="">
                <Button
                  key="button"
                  type="primary"
                  htmlType="button"
                  className="modal-button mt-5"
                  loading={loader}
                  onClick={() => {
                    onUploadDocument();
                    // updateKyb
                  }}
                >
                  Submit
                </Button> 
                <Button
                  key="cancel"
                  type="primary"
                  className="modal-button-cancel mt-5 mx-2"
                  onClick={() => {
                    setUploadModal(false)
                  }}
                >
                  Cancel
                </Button>
               </div>
              </Col>

            </Row>
                 

        
      </Modal>

      <PdfPreviewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />

   </>
  );
};

export default SellerDetail;
