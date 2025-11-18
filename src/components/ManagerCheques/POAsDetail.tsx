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
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { getAllCountries } from "../../services/masterData";
import { acceptedFileExtension,  beforeUploadFile, DateWithUtcOffset, emailRegex, getLocalStorage, modifyCresetUserType, USER_TYPE_TEXT } from "../Common/Constants";
import CallingCodeContract from "../Common/CallingCodeContract";

import Pdf from "../../assets/img/pdfview.svg";
import Delete from "../../assets/img/delete.svg";
// import Tick from "../../assets/img/circle_orange.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
// import Doc_large from "../../assets/img/Doc_large.svg"; 
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import PlusUpload from "../../assets/img/PlusUpload.svg";
import infoIcon from "../../assets/img/informIcon.svg"
import Dragger from "antd/es/upload/Dragger";
import PDFPreview from "../Common/PdfPreviewIcon";
import { getSearchUserData } from "../../services/cheque";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import moment from "moment";
import { useDebounce } from "./hook";
import { getuserDetail } from "../../services/admin"; 
import CountryFlag from "../Common/CountryFlag";

const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const POAsDetail = (props: object|any):any => {
  const {
    formValues,
    setFormValues,
    form, 
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
    setPoaCounterNationality,
    poanationalityCallingCode,
    setPoaNationalitytCallingCode,
    poanationalityIsoCode,
    setPoaNationalityIsoCode,
    poafileList,
    setpoafileList,   
    isSellerDocCheck, 
    setIsSellerRegistered,
    chequeDetails, 
    poaownerParty,
    setSearchCounterDetails
  } = props;
  
  const [countryList, setCountryList] = useState([]);
  const [isoCode, setIsoCode] = useState("");
  const [didsubmit, setdidsubmit] = useState<any>("DEFAULT"); 
  
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

  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const Token = local ? JSON.parse(local)?.token : ""; 

   

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
    
  },[formValues?.userType]);

  useEffect(()=> {
    
    const counterAlias = chequeDetails?.contractStartedBy == USER_TYPE_TEXT.BUYER ? chequeDetails?.sellerAlias : chequeDetails?.buyerAlias;
    
    if(chequeDetails && counterAlias){
       getuserDetail(counterAlias)
        .then((res: any) => {
          const email = res?.data?.data?.userDetails?.email;
          form.setFieldsValue({ counterContactEmail : email });
          getSearchUserData(email)
          .then((res : any) => {
            if (res.data) {
                setPOAsDetail(res.data);
            }
          })
           
        });
    }
  },[chequeDetails])

   

  const removeDocument2 = async (id: string) => {
    const filteredDocumentList = poafileList && poafileList?.filter((elem: any) => elem?.id !== id);
    setpoafileList(filteredDocumentList);
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


  
  const onCountryChange = (isoCode: string) => {
   
    setSellerCountryError({status:false});
    
 
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
 


  const onNationalityChange = (isoCode: string) => {
    setSellerCountryError({status:false});
    
 
    const selectedCountry:any = countryList.find((i: { isoCode: string }) => i.isoCode === isoCode);
    const Code = selectedCountry?.callingCode || "";
    setPoaNationalityIsoCode(selectedCountry?.isoCode);
    console.warn(poanationalityCallingCode)
    setPoaNationalitytCallingCode(Code);
    setPoaCounterNationality(selectedCountry?.name)
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
  
  const threeFunction = (e:any) => {
    setdidsubmit(1);
    // handleChange();
    const result = e.target.value.replace(/[^a-z ]/gi, "");
    form.setFieldsValue({ counterContactName: result });
  };

  
  
  const propss2: UploadProps = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/contracts/uploadSignature",
    beforeUpload: async (file: any, fileListToUpload: any) => {
      const totalFiles = poafileList?.length + fileListToUpload?.length;
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
      counterCountry: null
    });
    form.setFieldsValue({ poasContactNumber: "" });
    form.setFieldsValue({ poasContactName: "" });
    setUserExists(false);
    
    setpoafileList([])
  }, 500)

  const setPOAsDetail = (details : any) => {
    console.log("details",details);
    
    if (details) {
      const isCompleted = (details?.ekycState === "COMPLETED");
      setUserExists(isCompleted);
      setIsSellerRegistered(details.userType === 'USER');
      setSearchCounterDetails(details);
      if(details?.countryName || details?.countryAlias){
        const country : any = countryList.find((country: { name: string }) => country.name === details?.countryName || country.name === details?.countryAlias);
        onCountryChange(country.isoCode)
      }
      let nationalityIsoCode: any;
      if (details?.kycNationality || details?.kybNationality) {
        const country: any = countryList.find((country: { name: string }) => country.name.toLowerCase() == details?.kycNationality?.toLowerCase() || country.name.toLowerCase() == details?.kybNationality?.toLowerCase());
        nationalityIsoCode = country.isoCode
        onNationalityChange(country.isoCode)
      }
      if ((details?.kycNationality == null || details?.kycNationality == undefined || details?.kycNationality == "") && (details?.nationality) || (details?.sellerNationality)) {
        const country: any = countryList.find((country: any) => country.isoCode === details?.nationality || country.isoCode === details?.sellerNationality);
        nationalityIsoCode = country.isoCode
        onNationalityChange(country.isoCode)
      }
      setTimeout(() => {
        form.setFieldsValue({
          poasContactName: details.name,
          poasCountry: details?.countryAlias,
          poasContactNumber: details.contactNumber ? details.contactNumber : undefined, 
          poastypeOfEntity: details.typeOfEntity,
          poasNationality: details.nationality ?? nationalityIsoCode,
         });
      }, 500);
       
     
     const document = details.sellerDocuments?.map((a : any)=> {
       return {...a, isExpired : moment(a.expirydate).isBefore(moment()) };
     });
     isSellerDocCheck(document?.map((a: any)=>a.isExpired).includes(true));
     setpoafileList(document); 
   }
  }
  
  const searchUserByEmail = (e:any) => {
      const email = e.target.value;
      

      setErrorMsg(false)
      if(email === ""){
        setCallingCode("")
      }
      if (!!email.match(emailRegex) && Email !== email) {
        const userData = debounce(email,(email: any) => {
         isSellerDocCheck(false);
         getSearchUserData(email)
         .then((res : any) => {
          console.log("res==>",res);
           
          const userDetails = res.data;
          if (userDetails.userType === 'USER') {
              setPOAsDetail(res.data);
          }else{
              clearPOAsDetails();
              message.warning("Email not valid.");
          }
         })
         .catch((e : any) => {
          setpoafileList([]);
          if (e?.status === 403) {
           
            clearPOAsDetails();
            message.warning(e?.data?.error?.message || "Something went wrong !");
          } else if(e?.data?.error?.message){
            message.warning(e.data.error.message);
          } else {
            message.warning("Something went wrong !");
          }
         })},1000);
        userData();
      }

    };

    const clearPOAsDetails = () => {
       setCountryError({
          message: "",
          status: false,
        });
        setSellerCountryError({
          message: null,
          status: false,
        });
        form.setFieldsValue({
          counterCountry: null
        });
        form.setFieldsValue({ poasContactNumber: "" });
        form.setFieldsValue({ poasContactName: "" });
        form.setFieldsValue({ poasContactEmail: "" });
        setUserExists(false);
        
        setpoafileList([])
    }
  
  const contactNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setdidsubmit(1);
    const fieldName = "counterContactNumber";
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
      if (callingCode === "+971" && result.length > 0) {
        if (!result.startsWith("5")) {
          return Promise.reject("UAE numbers should start with 5");
        }
      }
      if (result.length < 7) {
        return Promise.reject("contact number must have at least 7 digits");
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
    if(!text) {
      message.error("Please enter document name");
      return;
    }else if (text.length > 300) {
      message.error("Document name cannot exceed 300 characters");
      return;
    }else if(!expiryDate) {
      message.error("Please select date");
      return;
    } else if(!uploadedFile) {
      message.error("Please select file");
      return;
    }

    const sellerDocs = poafileList;
    const expiryDt = typeof expiryDate === 'string' ? expiryDate : expiryDate.format('DD-MM-YYYY') ;
    if(documentId){
      const updatedFileList = sellerDocs.map((doc: any)=> 
        doc.id === documentId 
        ? { ...uploadedFile, document: text, expirydate: DateWithUtcOffset(expiryDt) }
        : doc
      );   
      setpoafileList(updatedFileList);
    } else {
      const updatedFileList = [...poafileList, {...uploadedFile,document : text, expirydate : DateWithUtcOffset(expiryDt) }];
      setpoafileList(updatedFileList);
    }
    
    setUploadModal(false);
    

    setTimeout(() => {
      setuploadedFile(null);
      setText("");  
      setExpiryDate(null);
    }, 1000);
  }

  const onUploadSupplierDoc = ()=>{
    setUploadModal(true);
    setText("");
    setExpiryDate(null)
    setuploadedFile(null);
  }

  
  return (
      <>    
        <Row gutter={36}>
             <Col span={Width > 992 ? 8 : 24}>
              <p className="seller-text-category">
              {poaownerParty}&apos;s contact email
              </p>
              <Form.Item
                name="poasContactEmail"
                className={`inputField w-100 error-input ${sellerCountryError?.status ? 'error-border' : ''}`}
                rules={[
                  {
                    required: true,
                    message: `email is required!`,
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
              <p className="seller-text-category">{poaownerParty}&apos;s name</p>
              <Form.Item
                name="poasContactName"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: true,
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
              {poaownerParty}&apos;s residence country
              </p>
              <Form.Item
                name="poasCountry"
                rules={[
                  {
                    required: true,
                    message: "Country is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
                <Select
                  disabled={userExists}
                  popupClassName="lowerz"
                  placeholder="Select country"
                  onChange={onCountryChange}
                  showSearch
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
              </Form.Item>
            </Col> 

              <Col span={Width < 992 ? 24 : 8} className="pe-4">
              <p className="seller-text-category">
              {poaownerParty}&apos;s nationality
              </p>
              <Form.Item
                name="poasNationality"
                rules={[
                  {
                    required: true,
                    message: "Nationality is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
               <div className="country-selection w-100 inputField">
                <CountryFlag isoCode={poanationalityIsoCode} />
                <Select
                  disabled={userExists && poanationalityIsoCode}
                  popupClassName="lowerz"
                  placeholder="Select nationality"
                  onChange={onNationalityChange}
                  showSearch
                  optionFilterProp="children"
                  value={poanationalityIsoCode} 
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
              <p className="seller-text-category agreement-text-category">{poaownerParty}&apos;s contact number</p>
              <Form.Item
                name="poasContactNumber"
                className="inputField w-100 error-input"
                rules={[
                  {
                    required: true,
                    message: `contact number is required!`,
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
              {poaownerParty}&apos;s entity type
              </p>
              <Form.Item
                name="poastypeOfEntity"
                rules={[
                  {
                    required: true,
                    message: "Entity type is required!",
                  },
                ]}
                className="modal_inputField w-100 select"
              >
                <Select
                  disabled={userExists}
                  popupClassName="lowerz"
                  placeholder="Select entity"
                  optionFilterProp="children">
                  <Option key="COMPANY" value="COMPANY">Company</Option>
                  <Option key="INDIVIDUAL" value="INDIVIDUAL">Individual</Option>
                </Select>
              </Form.Item>
            </Col>       
      </Row>


        <>
          <Row className={Width > 424 ? "mt-3 ms-3 mb-2" : "mt-3 mb-2"}>
            <div className="d-flex w-100">
              <div className="stepDetails_medium upload_address">
              {poaownerParty}&apos;s document
              </div>
            </div>
          </Row>
          <Row  className={Width > 424 ? "ms-3 mb-4" : "mb-4"}>
            <div className="doc-block w-100">
              <div className={ "d-flex gap-3 flex-wrap moa-doc-list"}>
                <>
                  {poafileList && poafileList?.map((singleFile: any, index: number) => {
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
                  
                  { poafileList?.length < 5 && !userExists ?  <div>
                    <div  onClick={onUploadSupplierDoc} className="seller-upload-document cursor">
                    <div className="seller-upload-document_innerfields">
                        <Image src={PlusUpload} alt="passport" preview={false} />
                        <div className="subText_xs overflowText_twoLines w-upload">
                          {poafileList?.some((file: any) => file.status === 'REJECTED') ? (
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
            </div>
          </Row>
        </>
            
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
                      <p className="seller-text-category" style={{marginLeft:'0px'}}>Document name</p>
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
                              <img src={infoIcon} className="ms-1 mt-0 mb-2" />
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

export default POAsDetail;
