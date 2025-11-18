import { Breadcrumb, Card, Col, Image, Modal, Row, Tabs,DatePicker, Upload,message,Button, Tooltip, Input, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import MyProfileIcon from "../../assets/img/Headers/My_Profile.svg";
// import Profile from "../../assets/img/profileImg.svg";
// import Circle from "../../assets/img/camera.svg";
import Edit from "../../assets/img/edit_orange.svg";
import EditWhite from "../../assets/img/edit_white.svg";
import Update from "../../assets/img/uploadblue.svg";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { AdminProfileEdit,DocumentSubmitted } from "../Common/RouteConst";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import { ViewButton } from "../ui-elements/ButtonRepo";
import { fetchKybDetails, getUserData } from "../../services/admin";
import { getAllCountries } from "../../services/user";
import { DOCUMENT_TYPE, getLocalStorage, setLocalStorage,acceptedFileExtension,DateWithUtcOffset, alphanumericRegex } from "../Common/Constants";
import DefaultLayout from "../Common/DefaultLayout";
import TabPane from "antd/lib/tabs/TabPane";
import Meta from "antd/lib/card/Meta";
import BlueEye from "../../assets/img/blueEye.svg";
import Doc from "../../assets/img/id.svg";
import { Document, Page, pdfjs} from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
import PdfPreviewModal from "../Models/PdfPreviewModal";
import { updateFinal } from "../../services/user";
import { UploadOutlined } from "@ant-design/icons";
import { InputText } from "../ui-elements/InputsRepo";
import SuccessIcon from "../../assets/img/Successpopupicon.svg";

interface ShareHolder {
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  Gender?: string;
  shareholdingsPercentage?: number;
  designation?: string;
  moduleForSanctionScreening?: string;
  beneficialOwnerDob?: Date;
  beneficialOwnerNationality?: string;
}

interface RepresentativeDetails {
  documentNationality?: string,
  fatf?: number,
  nationality?: string,
  repDocNumber?: string,
  repExpiryDate?: any,
  representativeName?: string,
  roleType?: any,
  sharedOwnership?: boolean
  representativeShare?: any
  isCorporateShareholder?: any
}

enum DateType {
  TradeLicense,
  RepDoc,
  ShrDoc
}

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
const AdminProfile = (props: object|any):any => {
  const {
    AddressData
  } = props;
  const navigate = useNavigate();

  const [UserData, setUserData] = useState<any>({});
  const [editEmailIcon, setEditEmailIcon] = useState(Edit);
  const [editContactIcon, setEditContactIcon] = useState(Edit);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('profile');
  const [KYBDetails, setKYBDetails] = useState<any>({});
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const userType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [viewModal, setViewModal] = useState(false);
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [frontUrl,setFrontUrl] = useState("");
  const [backUrl, setBackUrl] = useState("");
  const [tradeLicenseUrl,setTradeLicenseUrl] = useState("");
  const [frontStatus, setFrontStatus] = useState("");
  const [backStatus,setBackStatus] = useState('');
  const [tradeLicenseStatus, setTradeLicenseStatus] = useState("");
  const [repExpiryDate, setRepExpiryDate] = useState<any>('');
  const [repDocNo,setRepDocNo] = useState<string>('');
  const [repDocType, setRepDocType] = useState<string>('');
  const [tradeLicenseExpiryDate, setTradeLicenseExpiryDate] = useState<any>('');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState<string>('---');
  const [shareholderDocData, setShareholderDocData] = useState<any>({});
  const [isRepValidSubmit, setRepValidSubmit] = useState(false);
  const [shrValidSubmit, setShrValidSubmit] = useState<any>({});
  const [isTradeLicenseValidSubmit, setTradeLicenseValidSubmit] = useState(false);
  const [countryCodes, setCountryCodes] = useState<any>([]);
  const [businessName, setBusinessName] = useState("")
  const local:any = getLocalStorage("auth");
  const Token = local ? JSON.parse(local)?.token : "";
  const entityType = JSON.parse(getLocalStorage("auth")!)?.entityType;
  const [shareHoldersPayload, setShareHoldersPayload] = useState<ShareHolder[]>([]);
  const [representativeDetails, setRepresentativeDetails] = useState<RepresentativeDetails>({});
  const [shareholderAuthorizationFileList, setShareholderAuthorizationFileList] = useState<any[]>([]);
  const [shareholderRepresentativeFileList, setShareholderRepresentativeFileList] = useState<any[]>([]);
  const [shareholderAddressFileList, setShareholderAddressFileList] = useState<any[]>([]);
  const [expiryUpdateModal, setExpiryUpdateModal] = useState(false)

  const onTabchange = (tabValue: string) => {    
    setTab(tabValue);
  };
  const handleDateChange = (_date: any,_dateString:string | string[], type:DateType) => { 
    if (type === DateType.TradeLicense) {
      setTradeLicenseExpiryDate(_date);
    } else if(type === DateType.RepDoc) {
      setRepExpiryDate(_date);
    }
  }

  const handleShrDateChange = (_date:any, _dateString:string | string[], sortId:number|string) => {
    const docData = {...shareholderDocData};
    const key = 'shr_'+sortId;
    if (docData[key]) {
      docData[key].expiryDate = _date
    } else {
      docData[key] = {expiryDate: _date}
    }
    setShareholderDocData(docData)
  }

  const handleRepDocNumberChange = (e:any) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    setRepDocNo(result);
  }

  const handleTradeLicenseNumberChange = (e:any) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    setTradeLicenseNumber(result);
  }

  const handleShrDocNumberChange = (e:any,sortId:string|number) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    const docData = {...shareholderDocData};
    const key = 'shr_'+sortId;
    if (docData[key]) {
      docData[key].docNumber = result
    } else {
      docData[key] = {docNumber: result}
    }
    setShareholderDocData(docData)
  }

  const handleRepDocTypeChange = async (selectedValue: any) => {
    setRepDocType(selectedValue);
  };

  const handleShrDocTypeChange = (selectedValue:any,sortId:string|number) => {
    const docData = {...shareholderDocData};
    const key = 'shr_'+sortId;
    if (docData[key]) {
      docData[key].docType = selectedValue
    } else {
      docData[key] = {docType: selectedValue}
    }
    setShareholderDocData(docData)
  }

  const checkAndNavigate = () => {
    const hasOnlyTradeLicense = !Object.keys(shrValidSubmit).length && !isTradeLicenseValidSubmit;

    if ((!isRepValidSubmit || !isTradeLicenseValidSubmit || Object.values(shrValidSubmit).some(status => !status)) && !hasOnlyTradeLicense) { 
      setExpiryUpdateModal(false);
    } else {
      setExpiryUpdateModal(true);
      navigate(DocumentSubmitted);
    }
  };

  const updateRep = () => {
    if (repExpiryDate && repDocNo) {
      const expiryDt = typeof repExpiryDate === 'string' ? repExpiryDate : repExpiryDate.format('DD-MM-YYYY') ;
      updateFinal({
        userAlias: userAlias,
        type: 'individual',
        repExpiryDate: DateWithUtcOffset(expiryDt),
        repDocNumber: repDocNo,
        repDocType: repDocType,
        isExpiryUpdated: true,
      }).then(async () => {
        setExpiryUpdateModal(true);
      }).catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      })
    } else {
      if (!repExpiryDate) {
        message.error("Please select expiry date!");
      } else {
        message.error("Please enter document number!");
      }
    }
  }

  const updateTradeLicense = () => {
    if (tradeLicenseExpiryDate) {
      const expiryDt = typeof tradeLicenseExpiryDate === 'string' ? tradeLicenseExpiryDate : tradeLicenseExpiryDate.format('DD-MM-YYYY') ;
      updateFinal({
        userAlias: userAlias,
        type: 'tradeLicense',
        tradeLicenseExpiryDate: DateWithUtcOffset(expiryDt),
        tradeLicenseNumber: tradeLicenseNumber,
        isExpiryUpdated: true,
      }).then(async () => {
        setExpiryUpdateModal(true);
      }).catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      })
    } else {
      message.error("Please select trade license expiry date!");
    }
  }

  const updateShareholder = (sortId:number,docType:string, expiryDate:any, docNumber: string) => {
    if (shareholderDocData?.['shr_'+sortId]?.expiryDate) {
      const expiryDt = typeof expiryDate === 'string' ? expiryDate : expiryDate.format('DD-MM-YYYY');
      updateFinal({
        userAlias: userAlias,
        type: 'shareholderDocument',
        expiryDate: DateWithUtcOffset(expiryDt),
        docNumber: docNumber,
        sortId: sortId,
        docType: docType,
        isExpiryUpdated : true
      }).then(async () => {
        setExpiryUpdateModal(true);
      }).catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      })
    } else {
      message.error("Please select shareholder trade license expiry date!");
    }
  }

  const prepareShareholderData = (shrPayload:any) => {
    if (shrPayload.length) {
      const tmp:any = {};
      for (const i in shrPayload) {
        const key = 'shr_'+(parseInt(i) + 1)
        const shareholder = shrPayload[i];
        if (shareholder.type === 'COMPANY') {
          tmp[key] = {
            type: shareholder.type,
            docType: 'TRADE_LICENSE',
            expiryDate: shareholder.docExpiryDate ? dayjs.utc(shareholder.docExpiryDate):'',
            docNumber: shareholder.docNumber,
            docStatus: shareholder.docStatus
          }
        } else {
          tmp[key] = {
            type: shareholder.type,
            docType: shareholder.beneficialOwnerDocNationality ?? 'NATIONAL_ID',
            expiryDate:shareholder.docExpiryDate ? dayjs.utc(shareholder.docExpiryDate):'',
            docNumber: shareholder.docNumber,
            frontStatus: shareholder.frontStatus,
            backStatus: shareholder.backStatus
          }
        }
      }
      setShareholderDocData(tmp);
    }
  }

  const checkValidRepSubmit = () => {
    if ((!frontStatus || frontStatus === 'VERIFIED')
      && (!backStatus  || backStatus === 'VERIFIED')
      && repExpiryDate 
      && typeof repExpiryDate !== 'string' 
      && repDocNo
      && repExpiryDate.isAfter(dayjs(new Date()))) {
        setRepValidSubmit(true);
    } else {
      setRepValidSubmit(false);
    }
  }

  const checkValidTradeLicenseSubmit = () => {
    if ((!tradeLicenseStatus || tradeLicenseStatus === 'VERIFIED')
      && tradeLicenseExpiryDate 
      && typeof tradeLicenseExpiryDate !== 'string'
      && tradeLicenseExpiryDate.isAfter(dayjs(new Date()))
      && tradeLicenseNumber
    ) {
      setTradeLicenseValidSubmit(true);
    } else {
      setTradeLicenseValidSubmit(false);
    }
  }

  const checkValidShrSubmit = () => {
    let tmpShrData:any = {...shareholderDocData}
    for (const key in tmpShrData) {
      let toUpdate = false;
      const shrDocData = tmpShrData?.[key];
      if (shrDocData && shrDocData.expiryDate 
        && typeof shrDocData.expiryDate !== 'string'
        && shrDocData.expiryDate.isAfter(dayjs(new Date()))
        && shrDocData.docNumber
      ) {
       
        if (shrDocData.type === 'COMPANY') {
          if (!shrDocData.docStatus || shrDocData.docStatus === 'VERIFIED') {
            toUpdate = true;
          }
        } else {
          if ((!shrDocData.frontStatus || shrDocData.frontStatus === 'VERIFIED') 
            && (!shrDocData.backStatus || shrDocData.backStatus === 'VERIFIED')) {
            toUpdate = true;
          }
        }
      }
      if (toUpdate) {
        tmpShrData = {...tmpShrData, ...{[key]:true}}
      } else {
        tmpShrData = {...tmpShrData, ...{[key]:false}}
      }
    }
    setShrValidSubmit(tmpShrData);
  }
  
  useEffect(() => { 
    checkValidRepSubmit()
  },[frontStatus,backStatus,repExpiryDate, repDocNo])

  useEffect(() => {
    checkValidShrSubmit();
  },[shareholderDocData])

  useEffect(() => {
    checkValidTradeLicenseSubmit();
  },[tradeLicenseStatus,tradeLicenseExpiryDate, tradeLicenseNumber])


  
  const getCountryList = () => {
    getAllCountries()
      .then((response: any) => {
        setCountryCodes(response?.data); 
      })
      .catch(() => {
        message.error("Could not fetch country. Please try again later");
      });
  };

  useEffect(() => {
    getCountryList();
  }, [AddressData]);
  
  const getCallingCode = (countryName: string) => {
    const selectedCountry = countryCodes.find((country: any) => {
      return country.name === countryName || country.isoCode === countryName;
    });
  
    return selectedCountry?.callingCode || 'No Calling Code Available';
  };

  useEffect(() => {
    const UserEmail = JSON.parse(getLocalStorage("auth")!);
    setLoading(true);
    getUserData(UserEmail?.email).then((response: any) => {
      setUserData(response?.data);
      const userDetails = JSON.parse(getLocalStorage("auth")!);
      userDetails.name = response?.data?.name;
      userDetails.contactNumber = response?.data?.contactNumber;
      setLocalStorage("auth", JSON.stringify(userDetails));
    fetchKybDetails(userAlias).then((response: any) => {
      const data = response?.data?.data?.[0];
      setShareHoldersPayload(data?.shareholdersPayload);
      prepareShareholderData(data?.shareholdersPayload);
      if(data?.representative) {
        const repDetails = Array.isArray(data?.representative) ? data?.representative[0] : data?.representative;
        setRepresentativeDetails(repDetails);
      }
      setKYBDetails(data);

      if (data?.kybInfo?.length > 0) {
        setShareholderAuthorizationFileList(data?.shareholderDocuments);
        setShareholderRepresentativeFileList(data?.representativeShareholderDocuments);
        setShareholderAddressFileList(data?.shareholderAddressProofDocuments);
      }
      setFrontUrl(data?.documents?.[0]?.repDocFront?.[0]?.url);
      setBackUrl(data?.documents?.[0]?.repDocBack?.[0]?.url);
      setTradeLicenseUrl(data?.documents[0]?.businessRegProof?.[0]?.url);
      setFrontStatus(data?.documents[0]?.repDocFront[0]?.status);
      setBackStatus(data?.documents[0]?.repDocBack[0]?.status);
      const repExpDate = data?.representative[0]?.repExpiryDate
      setRepExpiryDate(repExpDate ? dayjs.utc(repExpDate) : '');
      setRepDocNo(data?.representative[0].repDocNumber);
      setRepDocType(data?.representative[0].repDocType ?? 'NATIONAL_ID');
      if (data?.basic?.[0]?.typeOfEntity === "COMPANY" ) {
        const tradeExpDate = data?.business?.[0]?.tradeLicenseExpiryDate
        setTradeLicenseExpiryDate(tradeExpDate ? dayjs.utc(tradeExpDate) : '')
        setTradeLicenseStatus(data?.documents[0]?.businessRegProof[0]?.status)
        const tradeLicenseNumber = data?.business?.[0]?.tradeLicenseNumber;
        setTradeLicenseNumber(tradeLicenseNumber);
      }
      if (data?.representative[0]?.isRepDocExpired && userType === 'USER') {
        setTab('document');
      }
      const name = data?.basic?.[0]?.typeOfEntity === "COMPANY" 
        ? response?.data?.data[0]?.business[0]?.businessName 
        : userDetails.name;
      setBusinessName(name);
      setLoading(false);
      }).catch(() => {
        setLoading(false);
      });

    }).catch(() => {
      setLoading(false);
    });
  }, [userAlias, userType]);

  const uploadFrontDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    onChange: (info: any) => {
      const { status } = info.file;
      if (status === 'done') {
        if (info?.file?.response?.data?.key) {
          fetchKybDetails(userAlias).then((response: any) => {
            const data = response?.data?.data?.[0];
            setKYBDetails(data);
            setFrontUrl(data?.documents?.[0]?.repDocFront?.[0]?.url);
            setFrontStatus('');
          })
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      } 
    }
  };
  const uploadBackDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments", 
    onChange: (info: any) => {
      const { status } = info.file;
      if (status === 'done') {
        if (info?.file?.response?.data?.key) {
          fetchKybDetails(userAlias).then((response: any) => {
            const data = response?.data?.data?.[0];
            
            setKYBDetails(data);
            setBackUrl(data?.documents?.[0]?.repDocBack?.[0]?.url);
            setBackStatus('')
          })
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      } 
    }
  };
  const uploadTradeDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    onChange: (info: any) => {
      const { status } = info.file;
      if (status === 'done') {
        if (info?.file?.response?.data?.key) {
          fetchKybDetails(userAlias).then((response: any) => {
            const data = response?.data?.data?.[0];
            setKYBDetails(data);
            setTradeLicenseUrl(data?.documents?.[0]?.businessRegProof?.[0]?.url);
            setTradeLicenseStatus('');
          })
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      } 
    }
  };

  const uploadShrDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    onChange: (info: any) => {
      const { status } = info.file;
      if (status === 'done') {
        if (info?.file?.response?.data?.key) {
          fetchKybDetails(userAlias).then((response: any) => {
            const data = response?.data?.data?.[0];
            setKYBDetails(data);
            setShareHoldersPayload(data?.shareholdersPayload);
            prepareShareholderData(data?.shareholdersPayload);
          })
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      } 
    }
  }

  const isRepDocumentExpired = KYBDetails?.representative ? KYBDetails.representative[0]?.isRepDocExpired : false;
  const isTradeLicenseExpired = KYBDetails?.business?.[0]?.isTradeLicenseExpired ? KYBDetails?.business[0].isTradeLicenseExpired : false;
  const repDocTypeTitle = (docNationality: string) => DOCUMENT_TYPE[docNationality] ?? 'Nationality id'

  const findObjectByKey = (arr: any, key: string) => {
    return arr.find((obj: any) => key in obj) || {};
  }
  const generateDynamicKey = (key: string, keyNumber: string) => {
    return `${key}${keyNumber}`;
  }

  return (
    <div className="scrollbar-container">
      <div className="fullHeight">
        <DefaultLayout
          page="profile"
          loading={loading}
          TitleText="My profile"
          TitleImage={MyProfileIcon}
          headerPage={
            <div className="d-flex">
              <Image
                src={MyProfileIcon}
                preview={false}
                className="mt-2"
                alt="escrowimage"
              />
              <div className="ml-5">
                <b> My profile</b>
                <Breadcrumb separator=">">
                  {/* <Breadcrumb.Item
                    onClick={() => {
                      navigate(Dashboard);
                    }}
                    className="cursor"
                  >
                    Dashboard
                  </Breadcrumb.Item> */}
                  <Breadcrumb.Item>My profile</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </div>
          }
        >
          <Card className="noBorder mt-6 profile-details-card">
            <div className="dashboardTabs pt-15 userDashboardTab">
              <div className="d-flex endtoend w-100 ">
                {/* {Width > 767 ?  */}
                <div className="d-flex w-100 overflow-auto escrow-tran-card dashboardTabs">
                  <Tabs
                    defaultActiveKey={tab}
                    className="tableTab overflow-auto w-100"
                    onChange={onTabchange}
                    activeKey={tab}
                  >
                    <TabPane tab={"Profile Details"} key="profile"></TabPane>
                    {(userType === 'USER' || userType === 'ESCROW_ADVISOR') && KYBDetails?.basic?.[0]?.typeOfEntity === 'COMPANY'?<TabPane tab={"User Details"} key="userdetials"></TabPane>:""}
                    {(userType === 'USER' || userType === 'ESCROW_ADVISOR') ? <TabPane tab={"Document Details"} key="document"></TabPane> : ""}
                    
                  </Tabs>
                </div>
              </div>
            </div>
            {tab == "profile" && (
              <Col span={24} className="mt-5">
                <div className="endtoend profile-title-header titleText">
                  <div className="titleText">Profile details</div>
                </div>

                <Row className="mt-5" align="middle">
                  <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                    <div className="stepDetails_medium_light my-2 fw-500">
                      {entityType === "COMPANY" ? "Business name" : "Name"}
                    </div>
                    <div className="stepDetails_medium fw-500 me-4">
                      {entityType === "COMPANY" ? `${businessName}` : `${UserData?.name}`}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                  <div className="stepDetails_medium_light my-2 fw-500 d-flex justify-content-start align-items-center">
                    <div>Email address</div>
                    <div className="d-flex align-items-center">
                      <ViewButton
                        onClick={() => {
                          navigate(AdminProfileEdit, { state: { disableContact: true, companyNumber: KYBDetails?.business[0]?.phoneNumber } });
                        }}
                        className="w-auto ms-3"
                      >
                        <Image
                          src={editEmailIcon}
                          alt="edit"
                          className="edit-icon"
                          preview={false}
                        />
                      </ViewButton>
                    </div>
                  </div>
                    <div className="stepDetails_medium fw-500">
                      {UserData?.email}
                    </div>                    
                  </Col>                  
                </Row>
                <Row className="mt-4">
                  <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                    <div className="stepDetails_medium_light my-2 fw-500">
                      Country
                    </div>
                    <div className="stepDetails_medium fw-500">
                    {entityType === "COMPANY" ? `${UserData?.companyCountry}` : `${UserData?.countryName}`}
                  </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div className="stepDetails_medium_light my-2 fw-500">
                      Country code
                    </div>
                    <div className="stepDetails_medium fw-500">
                      {UserData?.callingCode && !KYBDetails?.business?.[0]?.companyCountry ? (
                        <span>{UserData.callingCode}</span>
                      ) : (
                        KYBDetails?.business?.[0]?.companyCountry ? (
                          <span>{getCallingCode(KYBDetails.business[0].companyCountry)}</span>
                        ) : null
                      )}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-4"  align="middle">
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <div className="stepDetails_medium_light my-2 fw-500 d-flex justify-content-start align-items-center">
                     <div> Contact number</div>
                      <div className="profile-title-header titleText d-flex align-items-center">
                      <ViewButton
                        onClick={() => {
                          navigate(AdminProfileEdit, { state: { disableEmail: true, companyNumber: KYBDetails?.business[0]?.phoneNumber } });
                        }}
                        className="w-auto ms-3"
                      >
                          <Image
                            src={editContactIcon}
                            className="edit-icon"
                            alt="edit"
                            preview={false}
                            style={{minWidth:'20px',maxWidth:'20px'}}
                          />
                      </ViewButton>
                    </div>

                    </div>
                    <div className="stepDetails_medium fw-500">
                      {UserData?.contactNumber && !KYBDetails?.business?.[0]?.phoneNumber ? (
                        <span>{UserData.contactNumber}</span>
                      ) : (
                        KYBDetails?.business?.[0]?.phoneNumber ? (
                          <span>{KYBDetails.business[0].phoneNumber}</span>
                        ) : null
                      )}
                    </div>

                  </Col>
                 
                </Row>
              </Col>
            )}
             {tab == "document" && 
             (
              <div>
                <Card className="mb-4 mt-4 details-card">
                  {KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url ||
                  KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url ? (
                    <div className="subText_medium border-left">
                      <b>Business</b>
                    </div>
                  ) : null}
                  <Row gutter={20}>
                    {tradeLicenseUrl ? (
                      <Col sm={24} md={12} lg={8} xl={8} className="my-4">
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                                <div className={isTradeLicenseExpired && ['EXPIRED','REJECTED'].includes(tradeLicenseStatus) ? "hover-image-container" : ""}>
                                  {
                                      tradeLicenseUrl.includes(
                                      ".pdf"
                                    ) ? (
                                      <>
                                        <div className="admin-panel-pdf-preview">
                                          <Document
                                            file={tradeLicenseUrl}
                                              externalLinkRel="_blank" 
                                          >
                                            <Page pageNumber={1} width={175} />
                                          </Document>
                                        </div>
                                      </>
                                    ) : (
                                      <Image
                                        alt="example"
                                        src={
                                          KYBDetails?.documents?.[0]
                                            ?.businessRegProof?.[0]?.url
                                        }
                                        height={175}
                                        preview={false}
                                        className={isTradeLicenseExpired && ['EXPIRED','REJECTED'].includes(tradeLicenseStatus) ? "image" : ""}
                                      />
                                    )
                                  }
                                  {
                                    isTradeLicenseExpired && ['EXPIRED','REJECTED'].includes(tradeLicenseStatus)? 
                                    <div className="preview-icon cursor">
                                      <Upload
                                          // disabled={uploadLoading}
                                          showUploadList={false}
                                          maxCount={1}
                                          accept={acceptedFileExtension}
                                          {...uploadTradeDoc}
                                          {...{
                                            data: {
                                              businessType: "businessRegProof",
                                              type: "documents",
                                              userAlias: userAlias
                                            },
                                          }}
                                        >
                                        <UploadOutlined
                                          className="cursor"
                                        />
                                      </Upload>
                                    </div> : ""
                                  }
                                </div>
                              }
                            >
                              <Meta title={
                                  <div className="endtoend status">
                                    <span className="doc-titles">Trade license</span>
                                    {isTradeLicenseExpired && ['EXPIRED','REJECTED'].includes(tradeLicenseStatus) ? <span className="pending">{tradeLicenseStatus === 'REJECTED' ? 'Rejected' : 'Expired'}</span> : ''}
                                    <div className="d-flex">
                                      <span className="pending">
                                        {isTradeLicenseExpired ? 
                                        <Tooltip title="Reupload document" placement="top" overlayClassName="custom-tooltip">
                                          <Upload                 
                                            showUploadList={false}
                                            maxCount={1}
                                            accept={acceptedFileExtension}
                                            {...uploadTradeDoc}
                                            {...{
                                              data: {
                                                businessType: "businessRegProof",
                                                type: "documents",
                                                userAlias: userAlias
                                              },
                                            }}
                                          >
                                            <Image
                                              src={Update}
                                              className="me-2"
                                              alt="update"
                                              preview={false}
                                              style={{ height: '15px', width: '15px', cursor: 'pointer' }}
                                            />
                                          </Upload>
                                        </Tooltip>
                                        : ''}
                                      </span>
                                      <Image
                                        src={BlueEye}
                                        alt="company"
                                        preview={false}
                                        className="px-1 cursor min-width-25"
                                        onClick={() => {
                                        if(! KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url.includes(".pdf")){
                                          setViewModal(true);
                                          setTitle("Trade license");
                                          setUrl(KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url);
                                        }
                                        else{
                                          setverifyVisible(true)
                                          setImagUrl(KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url)
                                        }
                                        }}
                                      />
                                    </div>
                                  </div>
                              } />                              
                            </Card>
                          </div>
                        </div>
                      </Col>
                    ) : null}
                    {KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url ? (
                      <Col sm={24} md={12} lg={8} xl={8} className="my-4">
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                                KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url.includes(
                                  ".pdf"
                                ) ? (
                                  <>
                                    <div className="admin-panel-pdf-preview ">
                                      <Document
                                        file={KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url}
                                          externalLinkRel="_blank" 
                                          className="w-100 cursor h-175"
                                      >
                                        <Page pageNumber={1} width={175} />
                                      </Document>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    alt="example"
                                    src={
                                      KYBDetails?.documents?.[0]
                                        ?.businessAddProof?.[0]?.url
                                    }
                                    height={175}
                                    preview={false}
                                  />
                                )
                              }
                            >
                              <Meta
                                title={
                                  <div className="endtoend">
                                    <span className="doc-titles">Operating Address Proof</span>
                                    <Image
                                      src={BlueEye}
                                      alt="company"
                                      preview={false}
                                      className="px-1 cursor min-width-25"
                                      onClick={() => {
                                        if(! KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url.includes(".pdf")){
                                        setViewModal(true);
                                        setTitle("Operating Address Proof");
                                        setUrl(KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url);
                                        }else{
                                          setverifyVisible(true)
                                          setImagUrl(KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url)
                                        }
                                      }}                                      
                                    />
                                  </div>
                                }
                              />
                            </Card>
                          </div>
                        </div>
                      </Col>
                    ) : null}
                    {KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url ? (
                      <Col sm={24} md={12} lg={8} xl={8} className="my-4">
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                                KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url.includes(
                                  ".pdf"
                                ) ? (
                                  <>
                                    <div className="admin-panel-pdf-preview ">
                                      <Document
                                        file={KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url}
                                          externalLinkRel="_blank" 
                                      >
                                        <Page pageNumber={1} width={175} />
                                      </Document>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    alt="example"
                                    src={
                                      KYBDetails?.documents?.[0]
                                        ?.vatDoc?.[0]?.url
                                    }
                                    height={175}
                                    preview={false}
                                  />
                                )
                              }
                            >
                              <Meta
                                title={
                                  <div className="endtoend">
                                    <span className="doc-titles">VAT Documents</span>
                                    <Image
                                      src={BlueEye}
                                      alt="company"
                                      preview={false}
                                      className="px-1 cursor min-width-25"
                                      onClick={() => {
                                        if(! KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url.includes(".pdf")){
                                          setViewModal(true);
                                          setTitle("Operating Address Proof");
                                          setUrl(KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url);
                                        } else{
                                          setverifyVisible(true)
                                          setImagUrl(KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url)
                                        }
                                      }}
                                    />
                                  </div>
                                }
                              />
                            </Card>
                          </div>
                        </div>
                      </Col>
                    ) : null}
                    {KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url ? (
                      <Col sm={24} md={12} lg={8} xl={8} className="my-4">
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                                KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url.includes(
                                  ".pdf"
                                ) ? (
                                  <>  
                                    <div className="admin-panel-pdf-preview ">
                                      <Document
                                        file={KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url}
                                          externalLinkRel="_blank" 
                                          onLoadError={console.error}
                                      >
                                        <Page pageNumber={1} width={175} />
                                      </Document>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    alt="example"
                                    src={
                                      KYBDetails?.documents?.[0]
                                        ?.otherDoc?.[0]?.url
                                    }
                                    height={175}
                                    preview={false}
                                  />
                                )
                              }
                            >
                              <Meta
                                title={
                                  <div className="endtoend">
                                    <span className="doc-titles">Other Documents</span>
                                    <Image
                                      src={BlueEye}
                                      alt="company"
                                      preview={false}
                                      className="px-1 cursor min-width-25"
                                      onClick={() => {
                                        if(! KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url.includes('.pdf')){
                                          setViewModal(true);
                                          setTitle("Operating Address Proof");
                                          setUrl(KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url);
                                        } else{
                                          setverifyVisible(true)
                                          setImagUrl(KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url)
                                        }
                                      }}
                                    />
                                  </div>
                                }
                              />
                            </Card>
                          </div>
                        </div>
                      </Col>
                    ) : null}
                    {KYBDetails?.moaDocuments?.length > 0 ? 
                    KYBDetails?.moaDocuments?.map((moaUrl: any,index:any) => 
                    (
                      <Col key={index} sm={24} md={12} lg={8} xl={8} className="my-4">
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                                moaUrl?.url.includes(
                                  ".pdf"
                                ) ? (
                                  <>
                                    <div className="admin-panel-pdf-preview ">
                                      <Document
                                        file={moaUrl?.url}
                                          externalLinkRel="_blank" 
                                      >
                                        <Page pageNumber={1} width={175} />
                                      </Document>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    alt="example"
                                    src={
                                      moaUrl?.url
                                    }
                                    height={175}
                                    preview={false}
                                  />
                                )
                              }
                            >
                              <Meta
                                title={
                                  <div className="endtoend">
                                    <span className="doc-titles">MOA Documents</span>
                                    <Image
                                      src={BlueEye}
                                      alt="company"
                                      preview={false}
                                      className="px-1 cursor min-width-25"
                                      onClick={() => {
                                        if(!moaUrl?.url.includes(
                                          ".pdf"
                                        ) ){
                                          setViewModal(true);
                                          setTitle("Operating Address Proof");
                                          setUrl(moaUrl?.url);
                                        }
                                        else{
                                          setverifyVisible(true)
                                          setImagUrl(moaUrl?.url)
                                        }
                                      }}
                                    />
                                  </div>
                                }
                              />
                            </Card>
                          </div>
                        </div>
                      </Col>
                    )) : null}
                  </Row>
                    <>
                      <Row>
                        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                        {tradeLicenseExpiryDate &&
                        <>
                          <div className="stepDetails_medium_light my-2 fw-500 status">
                            Trade License Expiry date <span className="pending">{isTradeLicenseExpired && (!tradeLicenseExpiryDate || tradeLicenseExpiryDate.valueOf() < Date.now())? 'Expired': ''}</span>
                          </div>
                          <div className="stepDetails_medium fw-500">
                            {
                            (isTradeLicenseExpired ? (
                              <DatePicker
                                defaultValue={tradeLicenseExpiryDate}
                                onChange={ (date: any, dateString: string | string[]) =>{handleDateChange(date,dateString, DateType.TradeLicense)}}
                                format={{
                                  format: 'DD-MM-YYYY',
                                  type: 'mask',
                                }}
                                placeholder="Select expiry date"
                                disabledDate={(current:any)=>{
                                  return current && current.valueOf() < Date.now()
                                }}
                              />
                            ) : (tradeLicenseExpiryDate ? tradeLicenseExpiryDate.format('DD-MM-YYYY') : ''))} 
                          </div>
                        </>}
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                        {tradeLicenseExpiryDate  &&
                        <>
                          <div className="stepDetails_medium_light my-2 fw-500 status">
                            Trade License Number
                          </div>
                          <div className="stepDetails_medium fw-500">
                            {
                            (isTradeLicenseExpired ? (
                              <InputText
                                fieldname="tradeLicenseNumber"
                                className="inputField mb-4"
                              >
                                <Input
                                  type="text"
                                  placeholder="Enter document number"
                                  defaultValue={tradeLicenseNumber}
                                  onChange={handleTradeLicenseNumberChange}
                                  prefix={
                                    <span className="inputGlobe hw-18">
                                      <Image
                                        src={Doc}
                                        alt="trade license number"
                                        className="me-3"
                                        preview={false}
                                      />
                                    </span>
                                  }
                                  maxLength={50}
                                />
                              </InputText>
                            ) : (tradeLicenseNumber ? tradeLicenseNumber : '---'))} 
                          </div>
                        </>}
                        </Col>
                      </Row>
                      {
                        isTradeLicenseExpired &&
                        <Row>
                          <Col xs={12} sm={12} md={6} lg={6} xl={4}>
                            <Button
                              onClick={updateTradeLicense}
                              className={isTradeLicenseValidSubmit ? "rounded my-2" : "rounded disabled my-2"}
                              onMouseOver={() => {
                                setEditEmailIcon(EditWhite);
                                setEditContactIcon(EditWhite);
                              }}
                              onMouseLeave={() => {
                                setEditEmailIcon(Edit);
                                setEditContactIcon(Edit);
                              }}
                              disabled={!isTradeLicenseValidSubmit}
                            >
                              Update 
                            </Button>
                          </Col>
                        </Row>
                      }
                    </>
                  {KYBDetails?.documents?.[0]?.businessRegProof?.[0]?.url ||
                  KYBDetails?.documents?.[0]?.businessAddProof?.[0]?.url || KYBDetails?.documents?.[0]?.vatDoc?.[0]?.url || KYBDetails?.documents?.[0]?.otherDoc?.[0]?.url || KYBDetails?.moaDocuments?.length > 0 ? (
                    <hr className="lightgrayHr" />
                  ) : null}
                  {KYBDetails?.basic?.[0]?.typeOfEntity !== 'INDIVIDUAL' ? 
                    <div className="subText_medium border-left mt-4">
                      <b>Representative</b>
                    </div> : ''
                  }
                  <Row gutter={20}>
                    {KYBDetails?.documents?.[0]?.repDocFront?.[0]?.url ? (
                      <><Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={8}
                        xl={8}
                        className="my-4"
                      >
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                              <div className={isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(frontStatus) ? "hover-image-container" : ""}>
                                {
                                frontUrl.includes(".pdf") ? (
                                  <>
                                    <div className="admin-panel-pdf-preview image">
                                      <Document
                                        file={frontUrl}
                                        externalLinkRel="_blank"
                                      >
                                        <Page pageNumber={1} width={175} />
                                      </Document>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    alt="example"
                                    src={
                                      frontUrl
                                    }
                                    height={175}
                                    width={"100%"}
                                    preview={false}
                                    className={isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(frontStatus) ? "image" : ""}
                                    />
                                )
                                }
                                {
                                isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(frontStatus)?
                                  <div className="preview-icon cursor">
                                    <Upload
                                      // disabled={uploadLoading}
                                      showUploadList={false}
                                      maxCount={1}
                                      accept={acceptedFileExtension}
                                      {...uploadFrontDoc}
                                      {...{
                                        data: {
                                          businessType: "repDocFront",
                                          type: "documents",
                                          userAlias: userAlias,
                                          repDocType: repDocType,
                                        },
                                      }}
                                    >
                                      <UploadOutlined
                                        className="cursor"
                                        />
                                    </Upload>
                                  </div> : ""
                                  }
                              </div>
                              }
                            >
                              <Meta title={
                                <div className="endtoend status">
                                <span className="doc-titles">{repDocType ? DOCUMENT_TYPE[
                                  repDocType
                                  ] + " front" : "Emirates ID front"}</span>
                                {isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(frontStatus) ? <span className="pending">{frontStatus === 'REJECTED' ? 'Rejected' : 'Expired'}</span> : ''}
                                <div className="d-flex">
                                  <span className="pending">
                                    {isRepDocumentExpired ?
                                      <Tooltip title="Reupload document" placement="top" overlayClassName="custom-tooltip">
                                        <Upload
                                          // disabled={uploadLoading}
                                          showUploadList={false}
                                          maxCount={1}
                                          accept={acceptedFileExtension}
                                          {...uploadFrontDoc}
                                          {...{
                                            data: {
                                              businessType: "repDocFront",
                                              type: "documents",
                                              userAlias: userAlias,
                                              repDocType: repDocType,
                                            },
                                          }}
                                        >
                                          <Image
                                            src={Update}
                                            className="me-2"
                                            alt="update"
                                            preview={false}
                                            style={{ height: '15px', width: '15px', cursor: 'pointer' }}
                                            />
                                        </Upload>
                                      </Tooltip>
                                      : ''}
                                  </span>
                                  <Image
                                    src={BlueEye}
                                    alt="view"
                                    preview={false}
                                    className="px-1 cursor min-width-25"
                                    onClick={
                                      () => {
                                      if(! frontUrl.includes(".pdf")){
                                        setViewModal(true);
                                        setTitle(repDocType ? DOCUMENT_TYPE[
                                          repDocType
                                        ] + " front" : "Emirates ID front");
                                        setUrl(frontUrl);
                                      } else {
                                        setverifyVisible(true)
                                        setImagUrl(frontUrl)
                                      }
                                    }
                                  } 
                                  />
                                </div>
                              </div>
                            } />
                            </Card>
                          </div>
                        </div>
                      </Col>
                    </>
                    ) : null}
                    {backUrl ? (
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={8}
                        xl={8}
                        className="my-4"
                      >
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                                
                                <div className={isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(backStatus) ? "hover-image-container" : ""}> 
                                {
                                  backUrl.includes(
                                  ".pdf"
                                ) ? (
                                  <>
                                    <div className={isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(backStatus) ? "admin-panel-pdf-preview image" : "admin-panel-pdf-preview"}>
                                      <Document
                                        file={backUrl}
                                          externalLinkRel="_blank" 
                                      >
                                        <Page pageNumber={1} width={175} />
                                      </Document>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    alt="example"
                                    src={
                                      backUrl
                                    }
                                    height={175}
                                    width={"100%"}
                                    preview={false}
                                    className={isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(backStatus) ? "image" : ""}
                                  />
                                ) 
                               }
                                {isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(backStatus) ? 
                                <div className="preview-icon cursor">
                                  <Upload
                                    // disabled={uploadLoading}
                                    showUploadList={false}
                                    maxCount={1}
                                    accept={acceptedFileExtension}
                                    {...uploadBackDoc}
                                    {...{
                                      data: {
                                        businessType: "repDocBack",
                                        type: "documents",
                                        userAlias: userAlias,
                                        repDocType: repDocType,
                                      },
                                    }}
                                  >                      
                                    <UploadOutlined
                                      className="cursor"
                                    />
                                  </Upload>
                                </div> : "" }
                              </div>
                              }
                            >
                              <Meta title={
                                <div className="endtoend status">
                                  <span className="doc-titles">
                                    {
                                      repDocType ? DOCUMENT_TYPE[
                                      repDocType
                                      ] + " back" : "National id back"
                                    }
                                  </span>
                                  {isRepDocumentExpired && ['EXPIRED','REJECTED'].includes(backStatus) ? <span className="pending">{backStatus === 'REJECTED' ? 'Rejected' : 'Expired'}</span> : ''}
                                  <div className="d-flex">
                                    <span className="pending">{isRepDocumentExpired ? 
                                        <Tooltip title="Reupload document" placement="top" overlayClassName="custom-tooltip">
                                          <Upload                 
                                            showUploadList={false}
                                            maxCount={1}
                                            accept={acceptedFileExtension}
                                            {...uploadBackDoc}
                                            {...{
                                              data: {
                                                businessType: "repDocBack",
                                                type: "documents",
                                                userAlias: userAlias,
                                                repDocType: repDocType,
                                              },
                                            }}
                                          >
                                            <Image
                                            src={Update}
                                            className="me-2"
                                            alt="view"
                                            preview={false}
                                            style={{height:'15px',width:'15px',cursor:'pointer'}}
                                            />
                                          </Upload>
                                        </Tooltip>
                                      : ''}
                                    </span>
                                    <div>
                                      <Image
                                        src={BlueEye}
                                        alt="company"
                                        preview={false}
                                        className="px-1 cursor min-width-25"
                                        onClick={() => {
                                          if(! backUrl.includes(".pdf") ){
                                            setViewModal(true);
                                            setTitle(repDocType ? DOCUMENT_TYPE[
                                              repDocType
                                            ] + " back" : "National id back");
                                            setUrl(backUrl);
                                          } else {
                                            setverifyVisible(true)
                                            setImagUrl(backUrl)
                                          }
                                          
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              } />  
                            </Card>
                          </div>
                        </div>
                      </Col>
                    ) : null}
                    {KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url ? (
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={8}
                        xl={8}
                        className="my-4"
                      >
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                                KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url.includes(
                                  ".pdf"
                                ) ? (
                                  <>
                                    <div className="admin-panel-pdf-preview">
                                      <Document
                                        file={KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url}
                                          externalLinkRel="_blank" 
                                      >
                                        <Page pageNumber={1} width={175} />
                                      </Document>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    alt="example"
                                    src={
                                      KYBDetails?.documents?.[0]
                                        ?.repAddProof?.[0]?.url
                                    }
                                    height={175}
                                    preview={false}
                                  />
                                )
                              }
                            >
                              <Meta  title={
                                  <div className="endtoend">
                                    <span className="doc-titles">Address proof</span>
                                    <Image
                                      src={BlueEye}
                                      alt="company"
                                      preview={false}
                                      className="px-1 cursor min-width-25"
                                      onClick={() => {
                                        if(! KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url.includes(".pdf")){
                                        setViewModal(true);
                                        setTitle("Address Proof");
                                        setUrl(KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url);}
                                        else{
                                          setverifyVisible(true)
                                          setImagUrl(KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url)
                                        }
                                      }}
                                    />
                                  </div>
                                } />
                            </Card>
                          </div>
                        </div>
                      </Col>
                    ) : null}
                    {KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url ? (
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={8}
                        xl={8}
                        className="my-4"
                      >
                        <div className="afterApproveCard">
                          <div className="afterApproveCard-img-card">
                            <Card
                              className=" kybcard"
                              cover={
                                KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url.includes(
                                  ".pdf"
                                ) ? (
                                  <>
                                    <div className="admin-panel-pdf-preview">
                                      <Document
                                        file={KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url}
                                          externalLinkRel="_blank" 
                                      >
                                        <Page pageNumber={1} width={175} />
                                      </Document>
                                    </div>
                                  </>
                                ) : (
                                  <Image
                                    alt="example"
                                    src={
                                      KYBDetails?.documents?.[0]
                                        ?.authorizationDoc?.[0]?.url
                                    }
                                    height={175}
                                    preview={false}
                                  />
                                )
                              }
                            >
                              <Meta title={
                                  <div className="endtoend">
                                    <span className="doc-titles">Authorization Document</span>
                                    <Image
                                      src={BlueEye}
                                      alt="company"
                                      preview={false}
                                      className="px-1 cursor min-width-25"
                                      onClick={() => {
                                       if(! KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url.includes(".pdf")){
                                        setViewModal(true);
                                        setTitle("Authorization Document");
                                        setUrl(KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url);
                                       }
                                       else{
                                        setverifyVisible(true)
                                        setImagUrl(KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url)
                                       }
                                      }}
                                    />
                                  </div>
                                } />
                            </Card>
                          </div>
                        </div>
                      </Col>
                    ) : null}
                  </Row>
                      <>
                        <Row className="gap-3">
                          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                            <div className="stepDetails_medium_light my-2 fw-500 status">
                              Expiry date <span className="pending">{isRepDocumentExpired && (!repExpiryDate || repExpiryDate.valueOf() < Date.now()) ? 'Expired': ''}</span>
                            </div>
                            <div className="stepDetails_medium fw-500">
                              {
                              (isRepDocumentExpired ? (
                                <DatePicker
                                  defaultValue={repExpiryDate}
                                  onChange={ (date: any, dateString: string | string[]) =>{handleDateChange(date,dateString, DateType.RepDoc)}}
                                  format={{
                                    format: 'DD-MM-YYYY',
                                    type: 'mask',
                                  }}
                                  placeholder="Select expiry date"
                                  disabledDate={(current:any)=>{
                                    return current && current.valueOf() < Date.now()
                                  }}
                                />
                              ) : (repExpiryDate ? repExpiryDate.format('DD-MM-YYYY') : ''))} 
                            </div>
                          </Col>
                          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                            <div className="stepDetails_medium_light my-2 fw-500 status">
                              {(repDocType ? DOCUMENT_TYPE[repDocType]: 'National id') + ' number'} 
                            </div>
                            <div className="stepDetails_medium fw-500">
                              {
                              (isRepDocumentExpired ? (
                                <InputText
                                  fieldname="repDocNumber"
                                  className="inputField mb-4"
                                >
                                  <Input
                                    type="text"
                                    placeholder="Enter document number"
                                    defaultValue={repDocNo}
                                    onChange={handleRepDocNumberChange}
                                    prefix={
                                      <span className="inputGlobe hw-18">
                                        <Image
                                          src={Doc}
                                          alt="document-number"
                                          className="me-3"
                                          preview={false}
                                        />
                                      </span>
                                    }
                                    maxLength={50}
                                  />
                                </InputText>
                              ) : (repDocNo ? repDocNo : '---'))} 
                            </div>
                          </Col>
                          {
                            isRepDocumentExpired &&
                            <Col>
                              <div className="stepDetails_medium_light my-2 fw-500 status">
                                Document type 
                              </div>
                              <div className="stepDetails_medium fw-500">
                                <Radio.Group onChange={async(e:any)=>{handleRepDocTypeChange(e?.target?.value)}} className="d-flex justify-content-between document-radio-btn" value={repDocType} >
                                  <Radio value="NATIONAL_ID">
                                    National id
                                  </Radio>
                                  <Radio value="PASSPORT">Passport</Radio>
                                </Radio.Group>
                              </div>
                            </Col>
                          }
                        </Row>
                        {
                          isRepDocumentExpired && 
                          <Row>
                            <Col xs={12} sm={12} md={6} lg={6} xl={4}>
                              <Button
                                onClick={updateRep}
                                className={isRepValidSubmit ? "rounded my-2" : "rounded disabled my-2"}
                                onMouseOver={() => {
                                  setEditEmailIcon(EditWhite);
                                  setEditContactIcon(EditWhite);
                                }}
                                onMouseLeave={() => {
                                  setEditEmailIcon(Edit);
                                  setEditContactIcon(Edit);
                                }}
                                disabled={!isRepValidSubmit}
                              >
                                Update 
                              </Button>
                            </Col>
                          </Row>
                        }
                      </>
                  {frontUrl ||
                  backUrl || KYBDetails?.documents?.[0]?.repAddProof?.[0]?.url || KYBDetails?.documents?.[0]?.authorizationDoc?.[0]?.url ? (
                    <hr className="lightgrayHr" />
                  ) : null}
                  {KYBDetails?.shareholderDocuments?.length > 0 || KYBDetails?.representativeShareholderDocuments?.length > 0 ?
                  <div className="subText_medium border-left my-4">
                    <b>Shareholders</b>
                  </div> : ""}
                  <div className="overflow-auto escrow-tran-card">
                  <Tabs className="custom-tabs overflow-auto w-100">
                    {shareHoldersPayload?.map((_item: any, index: any) => {
                      const id = String(index + 1);
                      const idKey = 'shr_'+id;
                      let shareholderDocArr: any, repShareholderDynamicKey: any, repShareholderDocArr: any, shareholderDynamicKey: any,addressProofShareholderDynamicKey:any,addressProofShareholderDocArr:any;
                      const cond = representativeDetails && representativeDetails?.isCorporateShareholder == true && ((representativeDetails?.representativeShare > 0 && index == 1) || (representativeDetails?.representativeShare == 0 && index == 0))
                      if (!cond) {
                        shareholderDynamicKey = generateDynamicKey("shareholder_", id);
                        shareholderDocArr = findObjectByKey(shareholderAuthorizationFileList, shareholderDynamicKey)[shareholderDynamicKey];
                        repShareholderDynamicKey = generateDynamicKey("representativeShareholderId_", id);
                        repShareholderDocArr = findObjectByKey(shareholderRepresentativeFileList, repShareholderDynamicKey)[repShareholderDynamicKey];
                       addressProofShareholderDynamicKey = generateDynamicKey("addressProof_", id);
                      addressProofShareholderDocArr = findObjectByKey(shareholderAddressFileList, addressProofShareholderDynamicKey)[addressProofShareholderDynamicKey];
                    
                      }
                      const shrDocExpiryDate = shareholderDocData[idKey] ? shareholderDocData[idKey].expiryDate : _item.docExpiryDate ? dayjs(_item.docExpiryDate) : null;
                      const docNumber = shareholderDocData[idKey] ? shareholderDocData[idKey].docNumber: _item.docNumber;
                      const isShrDocExpired = !!_item.isDocExpired;
                      const shrFrontStatus = _item.frontStatus;
                      const shrBackStatus = _item.backStatus;
                      const shrAddressStatus = _item.addressStatus;
                      const shrDocStatus = _item.docStatus;
                      const shrTradeLicenseUrl = _item.docUrl;
                      const shrFrontUrl = _item.frontUrl;
                      const shrBackUrl = _item.backUrl;
                      const shrAddresskUrl = _item.addressUrl;
                      const docType = shareholderDocData[idKey] ? shareholderDocData[idKey].docType :  _item.beneficialOwnerDocNationality ? _item.beneficialOwnerDocNationality : 'NATIONAL_ID';
                      const docTypeTitle = cond ? 'Trade license' : repDocTypeTitle(docType);
                      return (
                        <TabPane tab={<span className="shareholder_tab">{`Shareholder ${index + 1}`}</span>} key={index}>
                          {(cond) ? (
                            <>
                              <Row gutter={20}>
                                {shrTradeLicenseUrl ? (
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={12}
                                    lg={8}
                                    xl={8}
                                    className="mb-4"
                                  >
                                    <div className="afterApproveCard">
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            <div className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrDocStatus) ? "hover-image-container" : ""}>
                                              {
                                                shrTradeLicenseUrl.includes(
                                                ".pdf"
                                                ) ? (
                                                  <>
                                                    <div className="admin-panel-pdf-preview ">
                                                      <Document
                                                        file={shrTradeLicenseUrl}
                                                        externalLinkRel="_blank"
                                                        className="w-100 cursor h-175"
                                                      >
                                                        <Page pageNumber={1} width={175} />
                                                      </Document>
                                                    </div>
                                                  </>
                                                ) : (
                                                  <Image
                                                    alt="example"
                                                    src={
                                                      shrTradeLicenseUrl
                                                    }
                                                    height={175}
                                                    preview={false}
                                                    className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrDocStatus) ? "image" : ""}
                                                  />
                                                )
                                              }
                                              {
                                                isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrDocStatus)? 
                                                <div className="preview-icon cursor">
                                                  <Upload
                                                      // disabled={uploadLoading}
                                                      showUploadList={false}
                                                      maxCount={1}
                                                      accept={acceptedFileExtension}
                                                      {...uploadShrDoc}
                                                      {...{
                                                        data: {
                                                          businessType: "shareHoldingTradeLicenseDoc",
                                                          type: "documents",
                                                          userAlias: userAlias
                                                        },
                                                      }}
                                                    >
                                                    <UploadOutlined
                                                      className="cursor"
                                                    />
                                                  </Upload>
                                                </div> : ""
                                              }
                                            </div>
                                          }
                                        >
                                          <Meta title={
                                            <div className="endtoend status">
                                              <span className="doc-titles">{"Trade licence proof"}</span>
                                              {isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrDocStatus) ? <span className="pending">{shrDocStatus === 'REJECTED' ? 'Rejected' : 'Expired'}</span> : ''}
                                              <div className='d-flex'>
                                                <span className="pending">
                                                  {isShrDocExpired ? 
                                                    <Tooltip title="Reupload document" placement="top" overlayClassName="custom-tooltip">
                                                      <Upload                 
                                                        // disabled={uploadLoading}
                                                        showUploadList={false}
                                                        maxCount={1}
                                                        accept={acceptedFileExtension}
                                                        {...uploadShrDoc}
                                                        {...{
                                                          data: {
                                                            businessType: "shareHoldingTradeLicenseDoc",
                                                            type: "documents",
                                                            userAlias: userAlias
                                                          },
                                                        }}
                                                      >
                                                        <Image
                                                          src={Update}
                                                          className="me-2"
                                                          alt="update"
                                                          preview={false}
                                                          style={{ height: '15px', width: '15px', cursor: 'pointer' }}
                                                        />
                                                      </Upload>
                                                    </Tooltip>:""
                                                  }
                                                </span>
                                                <Image
                                                  src={BlueEye}
                                                  alt="company"
                                                  preview={false}
                                                  className="px-1 cursor min-width-25"
                                                  onClick={() => {
                                                    if (!shrTradeLicenseUrl.includes(
                                                      ".pdf"
                                                    )) {
                                                      setViewModal(true);
                                                      setTitle("Trade licence proof");
                                                      setUrl(shrTradeLicenseUrl);
                                                    } else {
                                                      setverifyVisible(true)
                                                      setImagUrl(shrTradeLicenseUrl);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          } />
                                        </Card>
                                      </div>
                                    </div>
                                  </Col>
                                ) : null}
                                {KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url ? (<Col
                                  xs={24}
                                  sm={24}
                                  md={12}
                                  lg={8}
                                  xl={8}
                                  className="mb-4"
                                >
                                  <div className="afterApproveCard">
                                    <div className="afterApproveCard-img-card">
                                      <Card
                                        className=" kybcard"
                                        cover={
                                          KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url.includes(
                                            ".pdf"
                                          ) ? (
                                            <>
                                              <div className="admin-panel-pdf-preview ">
                                                <Document
                                                  file={KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url}
                                                  externalLinkRel="_blank"
                                                  className="w-100 cursor h-175"
                                                >
                                                  <Page pageNumber={1} width={175} />
                                                </Document>
                                              </div>
                                            </>
                                          ) : (
                                            <Image
                                              alt="example"
                                              src={
                                                KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url
                                              }
                                              height={175}
                                              preview={false}
                                            />
                                          )
                                        }
                                      >
                                        <Meta title={
                                          <div className="endtoend">
                                            <span className="doc-titles">{"MOA proof"}</span>
                                            <Image
                                              src={BlueEye}
                                              alt="company"
                                              preview={false}
                                              className="px-1 cursor min-width-25"
                                              onClick={() => {
                                                if (!KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url.includes(
                                                  ".pdf"
                                                )) {
                                                  setViewModal(true);
                                                  setTitle("MOA proof");
                                                  setUrl(KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url);
                                                } else {
                                                  setverifyVisible(true)
                                                  setImagUrl(KYBDetails?.documents?.[0]?.shareHoldingMoaDoc?.[0]?.url);
                                                }
                                              }}
                                            />
                                          </div>
                                        } />
                                      </Card>
                                    </div>
                                  </div>
                                </Col>
                                ) : null}
                                        {KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url ? (<Col
                                  xs={24}
                                  sm={24}
                                  md={12}
                                  lg={8}
                                  xl={8}
                                  className="mb-4"
                                >
                                  <div className="afterApproveCard">
                                    <div className="afterApproveCard-img-card">
                                      <Card
                                        className=" kybcard"
                                        cover={
                                          KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url.includes(
                                            ".pdf"
                                          ) ? (
                                            <>
                                              <div className="admin-panel-pdf-preview ">
                                                <Document
                                                  file={KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url}
                                                  externalLinkRel="_blank"
                                                  className="w-100 cursor h-175"
                                                >
                                                  <Page pageNumber={1} width={175} />
                                                </Document>
                                              </div>
                                            </>
                                          ) : (
                                            <Image
                                              alt="example"
                                              src={
                                                KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url
                                              }
                                              height={175}
                                              preview={false}
                                            />
                                          )
                                        }
                                      >
                                        <Meta title={
                                          <div className="endtoend">
                                            <span className="doc-titles">{"Address proof"}</span>
                                            <Image
                                              src={BlueEye}
                                              alt="company"
                                              preview={false}
                                              className="px-1 cursor min-width-25"
                                              onClick={() => {
                                                if (!KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url.includes(
                                                  ".pdf"
                                                )) {
                                                  setViewModal(true);
                                                  setTitle("Address proof");
                                                  setUrl(KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url);
                                                } else {
                                                  setverifyVisible(true)
                                                  setImagUrl(KYBDetails?.documents?.[0]?.shareHoldingCompanyAddressDoc?.[0]?.url);
                                                }
                                              }}
                                            />
                                          </div>
                                        } />
                                      </Card>
                                    </div>
                                  </div>
                                </Col>
                                ) : null}
                                {KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url ? (<Col
                                  xs={24}
                                  sm={24}
                                  md={12}
                                  lg={8}
                                  xl={8}
                                  className="mb-4"
                                >
                                  <div className="afterApproveCard">
                                    <div className="afterApproveCard-img-card">
                                      <Card
                                        className=" kybcard"
                                        cover={
                                          KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url.includes(
                                            ".pdf"
                                          ) ? (
                                            <>
                                              <div className="admin-panel-pdf-preview ">
                                                <Document
                                                  file={KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url}
                                                  externalLinkRel="_blank"
                                                  className="w-100 cursor h-175"
                                                >
                                                  <Page pageNumber={1} width={175} />
                                                </Document>
                                              </div>
                                            </>
                                          ) : (
                                            <Image
                                              alt="example"
                                              src={
                                                KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url
                                              }
                                              height={175}
                                              preview={false}
                                            />
                                          )
                                        }
                                      >
                                        <Meta title={
                                          <div className="endtoend">
                                            <span className="doc-titles">{"Other document"}</span>
                                            <Image
                                              src={BlueEye}
                                              alt="company"
                                              preview={false}
                                              className="px-1 cursor min-width-25"
                                              onClick={() => {
                                                if (!KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url.includes(
                                                  ".pdf"
                                                )) {
                                                  setViewModal(true);
                                                  setTitle("Other document");
                                                  setUrl(KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url);
                                                } else {
                                                  setverifyVisible(true)
                                                  setImagUrl(KYBDetails?.documents?.[0]?.shareHoldingOtherDoc?.[0]?.url);
                                                }
                                              }}
                                            />
                                          </div>
                                        } />
                                      </Card>
                                    </div>
                                  </div>
                                </Col>
                                ) : null}
                              </Row>
                            </>) : (
                            <>
                              <Row gutter={20}>
                                {shareholderAuthorizationFileList?.length > 0 && (shareholderDocArr && shrFrontUrl) ? (<>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={12}
                                    lg={8}
                                    xl={8}
                                    className="mb-4"
                                  >
                                    <div className="afterApproveCard">
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            <div className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrFrontStatus) ? "hover-image-container" : ""}>
                                              {
                                                shrFrontUrl.includes(
                                                  ".pdf"
                                                ) ? (
                                                  <>
                                                    <div className="admin-panel-pdf-preview ">
                                                      <Document
                                                        file={shrFrontUrl}
                                                        externalLinkRel="_blank"
                                                        className="w-100 cursor h-175"
                                                      >
                                                        <Page pageNumber={1} width={175} />
                                                      </Document>
                                                    </div>
                                                  </>
                                                ) : (
                                                  <Image
                                                    alt="example"
                                                    src={
                                                      shrFrontUrl
                                                    }
                                                    height={175}
                                                    preview={false}
                                                    className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrFrontStatus) ? "image" : ""}
                                                  />
                                                )
                                              }
                                              {
                                                isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrFrontStatus)? 
                                                <div className="preview-icon cursor">
                                                  <Upload
                                                      showUploadList={false}
                                                      maxCount={1}
                                                      accept={acceptedFileExtension}
                                                      {...uploadShrDoc}
                                                      {...{
                                                        data: {
                                                          businessType: "shareholderDoc",
                                                          type: "documents",
                                                          userAlias: userAlias,
                                                          repDocType: repDocType,
                                                          shareholderKey: 'shareholder_'+id
                                                        },
                                                      }}
                                                    >
                                                      <UploadOutlined
                                                      className="cursor"
                                                    />
                                                  </Upload>
                                                </div> : ""
                                              }
                                            </div>
                                          }
                                        >
                                          <Meta title={
                                            <div className="endtoend status">
                                              <span className="doc-titles">{docTypeTitle + " front"}</span>
                                              {isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrFrontStatus) ? <span className="pending">{shrFrontStatus === 'REJECTED' ? 'Rejected' : 'Expired'}</span> : ''}
                                              <div className="d-flex">
                                                <span className="pending">
                                                  {isShrDocExpired ? 
                                                  <Tooltip title="Reupload document" placement="top" overlayClassName="custom-tooltip">
                                                    <Upload                 
                                                      showUploadList={false}
                                                      maxCount={1}
                                                      accept={acceptedFileExtension}
                                                      {...uploadShrDoc}
                                                      {...{
                                                        data: {
                                                          businessType: "shareholderDoc",
                                                          type: "documents",
                                                          userAlias: userAlias,
                                                          repDocType: repDocType,
                                                          shareholderKey: 'shareholder_'+id
                                                        },
                                                      }}
                                                    >
                                                      <Image
                                                        src={Update}
                                                        className="me-2"
                                                        alt="update"
                                                        preview={false}
                                                        style={{ height: '15px', width: '15px', cursor: 'pointer' }}
                                                      />
                                                    </Upload>
                                                  </Tooltip>
                                                  : ''}
                                                </span>
                                                <Image
                                                  src={BlueEye}
                                                  alt="company"
                                                  preview={false}
                                                  className="px-1 cursor min-width-25"
                                                  onClick={() => {
                                                    if (!shrFrontUrl.includes(
                                                      ".pdf"
                                                    )) {
                                                      setViewModal(true);
                                                      setTitle(docTypeTitle + " front");
                                                      setUrl(shrFrontUrl);
                                                    } else {
                                                      setverifyVisible(true)
                                                      setImagUrl(shrFrontUrl);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          } />
                                        </Card>
                                      </div>
                                    </div>
                                  </Col>
                                </>) : null}
                                {shareholderRepresentativeFileList?.length > 0 && (repShareholderDocArr && shrBackUrl) ? (<>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={12}
                                    lg={8}
                                    xl={8}
                                    className="mb-4"
                                  >
                                    <div className="afterApproveCard">
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            <div className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrBackStatus) ? "hover-image-container" : ""}>
                                              {
                                                  shrBackUrl.includes(
                                                  ".pdf"
                                                ) ? (
                                                  <>
                                                    <div className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrBackStatus) ? "admin-panel-pdf-preview image" : "admin-panel-pdf-preview"}>
                                                      <Document
                                                        file={shrBackUrl}
                                                        externalLinkRel="_blank"
                                                        className="w-100 cursor h-175"
                                                      >
                                                        <Page pageNumber={1} width={175} />
                                                      </Document>
                                                    </div>
                                                  </>
                                                ) : (
                                                  <Image
                                                    alt="example"
                                                    src={
                                                      shrBackUrl
                                                    }
                                                    height={175}
                                                    preview={false}
                                                    className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrBackStatus) ? "image" : ""}
                                                  />
                                                )
                                              }
                                              {
                                                isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrBackStatus) ? 
                                                <div className="preview-icon cursor">
                                                  <Upload
                                                    showUploadList={false}
                                                    maxCount={1}
                                                    accept={acceptedFileExtension}
                                                    {...uploadShrDoc}
                                                    {...{
                                                      data: {
                                                        businessType: "representativeShareholderDoc",
                                                        type: "documents",
                                                        userAlias: userAlias,
                                                        representativeShareholderKey: 'representativeShareholderId_'+id
                                                      },
                                                    }}
                                                  >                      
                                                    <UploadOutlined
                                                      className="cursor"
                                                    />
                                                  </Upload>
                                                </div> : "" 
                                              }
                                            </div>
                                          }
                                        >
                                          <Meta title={
                                            <div className="endtoend status">
                                              <span className="doc-titles">{docTypeTitle + " back"}</span>
                                              {isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrBackStatus) ? <span className="pending">{shrBackStatus === 'REJECTED' ? 'Rejected' : 'Expired'}</span> : ''}
                                              <div className="d-flex">
                                              <span className="pending">{isShrDocExpired ? 
                                                <Tooltip title="Reupload document" placement="top" overlayClassName="custom-tooltip">
                                                  <Upload                 
                                                    showUploadList={false}
                                                    maxCount={1}
                                                    accept={acceptedFileExtension}
                                                    {...uploadShrDoc}
                                                    {...{
                                                      data: {
                                                        businessType: "representativeShareholderDoc",
                                                        type: "documents",
                                                        userAlias: userAlias,
                                                        representativeShareholderKey: 'representativeShareholderId_'+id
                                                      },
                                                    }}
                                                  >
                                                    <Image
                                                    src={Update}
                                                    className="me-2"
                                                    alt="view"
                                                    preview={false}
                                                    style={{height:'15px',width:'15px',cursor:'pointer'}}
                                                    />
                                                  </Upload>
                                                </Tooltip>
                                                  : ''}
                                                </span>
                                                <Image
                                                  src={BlueEye}
                                                  alt="company"
                                                  preview={false}
                                                  className="px-1 cursor min-width-25"
                                                  onClick={() => {
                                                    if (!shrBackUrl.includes(".pdf")) {
                                                      setViewModal(true);
                                                      setTitle(docTypeTitle + " back");
                                                      setUrl(shrBackUrl);
                                                    }
                                                    else {
                                                      setverifyVisible(true)
                                                      setImagUrl(shrBackUrl);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          } />
                                        </Card>
                                      </div>
                                    </div>
                                  </Col>
                                </>) : null}
                                     {shareholderAddressFileList?.length > 0 && (addressProofShareholderDocArr && shrAddresskUrl) ? (<>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={12}
                                    lg={8}
                                    xl={8}
                                    className="mb-4"
                                  >
                                    <div className="afterApproveCard">
                                      <div className="afterApproveCard-img-card">
                                        <Card
                                          className=" kybcard"
                                          cover={
                                            <div className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrAddressStatus) ? "hover-image-container" : ""}>
                                              {
                                                  shrAddresskUrl.includes(
                                                  ".pdf"
                                                ) ? (
                                                  <>
                                                    <div className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrAddressStatus) ? "admin-panel-pdf-preview image" : "admin-panel-pdf-preview"}>
                                                      <Document
                                                        file={shrAddresskUrl}
                                                        externalLinkRel="_blank"
                                                        className="w-100 cursor h-175"
                                                      >
                                                        <Page pageNumber={1} width={175} />
                                                      </Document>
                                                    </div>
                                                  </>
                                                ) : (
                                                  <Image
                                                    alt="example"
                                                    src={
                                                      shrAddresskUrl
                                                    }
                                                    height={175}
                                                    preview={false}
                                                    className={isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrAddressStatus) ? "image" : ""}
                                                  />
                                                )
                                              }
                                              {
                                                isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrAddressStatus) ? 
                                                <div className="preview-icon cursor">
                                                  <Upload
                                                    showUploadList={false}
                                                    maxCount={1}
                                                    accept={acceptedFileExtension}
                                                    {...uploadShrDoc}
                                                    {...{
                                                      data: {
                                                        businessType: "shareholderAddressProof",
                                                        type: "documents",
                                                        userAlias: userAlias,
                                                        shareholderKey: 'addressProof_'+id
                                                      },
                                                    }}
                                                  >                      
                                                    <UploadOutlined
                                                      className="cursor"
                                                    />
                                                  </Upload>
                                                </div> : "" 
                                              }
                                            </div>
                                          }
                                        >
                                          <Meta title={
                                            <div className="endtoend status">
                                              <span className="doc-titles">{"Address Proof"}</span>
                                              {isShrDocExpired && ['EXPIRED','REJECTED'].includes(shrAddressStatus) ? <span className="pending">{shrAddressStatus === 'REJECTED' ? 'Rejected' : 'Expired'}</span> : ''}
                                              <div className="d-flex">
                                              <span className="pending">{isShrDocExpired ? 
                                                <Tooltip title="Reupload document" placement="top" overlayClassName="custom-tooltip">
                                                  <Upload                 
                                                    showUploadList={false}
                                                    maxCount={1}
                                                    accept={acceptedFileExtension}
                                                    {...uploadShrDoc}
                                                    {...{
                                                      data: {
                                                        businessType: "shareholderAddressProof",
                                                        type: "documents",
                                                        userAlias: userAlias,
                                                        shareholderKey: 'addressProof_'+id
                                                      },
                                                    }}
                                                  >
                                                    <Image
                                                    src={Update}
                                                    className="me-2"
                                                    alt="view"
                                                    preview={false}
                                                    style={{height:'15px',width:'15px',cursor:'pointer'}}
                                                    />
                                                  </Upload>
                                                </Tooltip>
                                                  : ''}
                                                </span>
                                                <Image
                                                  src={BlueEye}
                                                  alt="company"
                                                  preview={false}
                                                  className="px-1 cursor min-width-25"
                                                  onClick={() => {
                                                    if (!shrAddresskUrl.includes(".pdf")) {
                                                      setViewModal(true);
                                                      setTitle(docTypeTitle + " back");
                                                      setUrl(shrAddresskUrl);
                                                    }
                                                    else {
                                                      setverifyVisible(true)
                                                      setImagUrl(shrAddresskUrl);
                                                    }
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          } />
                                        </Card>
                                      </div>
                                    </div>
                                  </Col>
                                </>) : null}
                              </Row>
                            </>)}
                              <>
                                <Row>
                                  <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                                    <div className="stepDetails_medium_light my-2 fw-500 status">
                                      Expiry date <span className="pending">{isShrDocExpired && (!shrDocExpiryDate || shrDocExpiryDate.valueOf() < Date.now())? 'Expired': ''}</span>
                                    </div>
                                    <div className="stepDetails_medium fw-500">
                                      {
                                      (isShrDocExpired ? (
                                        <DatePicker
                                          value={shrDocExpiryDate}
                                          onChange={ (date: any, dateString: string | string[]) =>{handleShrDateChange(date,dateString, id)}}
                                          format={{
                                            format: 'DD-MM-YYYY',
                                            type: 'mask',
                                          }}
                                          placeholder="Select expiry date"
                                          disabledDate={(current:any)=>{
                                            return current && current.valueOf() < Date.now()
                                          }}
                                        />
                                      ) : (shrDocExpiryDate ? shrDocExpiryDate.format('DD-MM-YYYY') : ''))} 
                                    </div>
                                  </Col>
                                  <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                                    <div className="stepDetails_medium_light my-2 fw-500 status">
                                      {docTypeTitle} number
                                    </div>
                                    <div className="stepDetails_medium fw-500">
                                      {
                                      (isShrDocExpired ? (
                                        <InputText
                                          fieldname={"shrDoc_"+id}
                                          className="inputField mb-4"
                                        >
                                          <Input
                                            type="text"
                                            placeholder="Enter document number"
                                            defaultValue={docNumber}
                                            onChange={(e: any) =>{handleShrDocNumberChange(e, id)}}
                                            prefix={
                                              <span className="inputGlobe hw-18">
                                                <Image
                                                  src={Doc}
                                                  alt="doc number"
                                                  className="me-3"
                                                  preview={false}
                                                />
                                              </span>
                                            }
                                            maxLength={50}
                                          />
                                        </InputText>
                                      ) : (docNumber ? docNumber : '---'))} 
                                    </div>
                                  </Col>
                                  {
                                    isShrDocExpired && !cond && 
                                    <Col>
                                      <div className="stepDetails_medium_light my-2 fw-500 status">
                                        Document type
                                      </div>
                                      <div className="stepDetails_medium fw-500">
                                        <Radio.Group onChange={async(e:any)=>{handleShrDocTypeChange(e?.target?.value,id)}} className="d-flex justify-content-between document-radio-btn" value={docType} >
                                          <Radio value="NATIONAL_ID">
                                            National id
                                          </Radio>
                                          <Radio value="PASSPORT">Passport</Radio>
                                        </Radio.Group>
                                      </div>
                                    </Col>
                                  }
                                </Row>
                                {
                                  isShrDocExpired &&
                                  <Row>
                                    <Col xs={12} sm={12} md={6} lg={6} xl={4}>
                                      <Button
                                        onClick={() => updateShareholder(parseInt(id),docType,shrDocExpiryDate,docNumber)}
                                        className={shrValidSubmit[idKey] ? "rounded my-2" : "rounded disabled my-2"}
                                        onMouseOver={() => {
                                          setEditEmailIcon(EditWhite);
                                          setEditContactIcon(EditWhite);
                                        }}
                                        onMouseLeave={() => {
                                          setEditEmailIcon(Edit);
                                          setEditContactIcon(Edit);
                                        }}
                                        disabled={!shrValidSubmit[idKey]}
                                      >
                                        Update
                                      </Button>
                                    </Col>
                                  </Row>
                                }
                              </>
                        </TabPane>
                      );
                    })}
                  </Tabs>
                  </div>
                </Card>
              </div>
            )}
             {tab == "userdetials" && 
             (
              <Col span={24} className="mt-5">
              <div className="endtoend profile-title-header titleText">
                <div className="titleText">User details</div>
              </div>

              <Row className="mt-5" align="middle">
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                  <div className="stepDetails_medium_light my-2 fw-500">
                    Name
                  </div>
                  <div className="stepDetails_medium fw-500 me-4">
                    {UserData?.name}
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={6}>
                  <div className="stepDetails_medium_light my-2 fw-500 d-flex justify-content-start align-items-center">
                    <div>Email address</div>
                    <div className="d-flex align-items-center">
                      <ViewButton
                        onClick={() => {
                          navigate(AdminProfileEdit, { state: { disableContact: true, userUpdate:true } });
                        }}
                        className="w-auto ms-3"
                      >
                        {/* {Width > 420 ? "Edit Email" : ""} */}
                          <Image
                            src={editEmailIcon}
                            // className={Width > 420 ? "pl-3" : ""}
                            alt="edit"
                            className="edit-icon"
                            preview={false}
                          />
                      </ViewButton>
                    </div>
                  </div>
                  <div className="stepDetails_medium fw-500">
                    {UserData?.email}
                  </div>
                </Col>
              
              </Row>
              <Row className="mt-4">
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                  <div className="stepDetails_medium_light my-2 fw-500">
                    Country
                  </div>
                  <div className="stepDetails_medium fw-500">
                  {UserData?.countryName}
                </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="stepDetails_medium_light my-2 fw-500">
                    Country code
                  </div>
                  <div className="stepDetails_medium fw-500">
                  {UserData?.callingCode}
                  </div>
                </Col>
              </Row>
              <Row className="mt-4" align="middle">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                  <div className="stepDetails_medium_light my-2 fw-500 d-flex justify-content-start align-items-center">
                    <div>Contact number</div>
                    <div className="profile-title-header titleText">
                      <ViewButton
                        onClick={() => {
                          navigate(AdminProfileEdit, { state: { disableEmail: true, userUpdate:true } });
                        }}
                        className="w-auto ms-3"
                      >
                          <Image
                            src={editContactIcon}
                            alt="edit"
                            className="edit-icon"
                            preview={false}
                            style={{minWidth:'20px',maxWidth:'20px'}}
                          />
                      </ViewButton>
                    </div>
                  </div>
                  <div className="stepDetails_medium fw-500">
                  {UserData?.contactNumber}
                  </div>

                </Col>
                
              </Row>
            </Col>
             )}
          </Card>
        </DefaultLayout>
      </div>
      <Modal
        open={expiryUpdateModal}
        footer={false}
        closable={false}
        className="modal-box success"
        centered
        width={500}
        onCancel={checkAndNavigate}
      >
        <div className="text-center">
          <Image src={SuccessIcon} alt="success" preview={false} className="mt-5" />
       
          <div className="titleText mt-5 mb-3">Documents uploaded successfully!</div>
          <Button className="rounded_blue_outline btn-OK mb-4" onClick={checkAndNavigate}>Ok</Button>
        </div>
      </Modal>
      <Modal
        open={viewModal}
        footer={false}
        className="modal-box "
        title={
          <span className="change-client-classification">
            {title} preview
            <hr className="lightgrayHr" />
          </span>
        }
        centered
        width={520}
        onCancel={() => setViewModal(false)}
      >
        <div className="text-center">
            <Image
              src={url}
              preview={false}
              alt="preview"
              className="max-h-460 my-3"
            />
        </div>
      </Modal>
      {imagUrl.includes(".pdf") && 
            <PdfPreviewModal
            isverifyVisible={isverifyVisible}
            setverifyVisible={setverifyVisible}
            imagUrl={imagUrl}
            setImagUrl={setImagUrl}
          />}
    </div>
  );
};

export default AdminProfile;