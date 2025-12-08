/* eslint-disable no-unsafe-optional-chaining */
import { Button, Form, Image, Input, Row, message, DatePicker, Select, Collapse, Col, Typography, Tabs, Spin, Upload, Tooltip, Radio } from "antd";
import UserHeader from "./UserHeader";
import { 
  // useCallback, 
  useEffect, 
  useRef, 
  useState } from "react";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import { InputText } from "../ui-elements/InputsRepo";
import Mobile from "../../assets/img/Mobile.svg";
import User from "../../assets/img/User_Full.svg";
import Designation from "../../assets/img/Designation.svg";
import BlueTick from "../../assets/img/blue_tick.svg";
import Role from "../../assets/img/role.svg";
import Flag from "../../assets/img/flag_gray.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { KYBVerificatioStep3, KYBVerificatioStep5 } from "../Common/RouteConst";
import { COMPANY_ROLE, OnlyText, onlyNumberRegex, getLocalStorage, KYB_VERIFICATION_STEPS_TITLE, setLocalStorage, acceptedFileExtension, beforeUploadFile, DOCUMENT_TYPE, alphanumericRegex, DateWithUtcOffset2 } from "../Common/Constants";
import ResponsiveSidebar from "./SidebarResponsiveCompany";
import { fetchKybDetails, getRiskConfiguration, getUserData } from "../../services/admin";
import { deleteShareHolderFile, updateShareHolder, updateDocuments, deleteShareHolderRepresentativeFile, deleteFile, deleteShareholderAddressProof } from "../../services/user";
// import { Option } from "antd/lib/mentions";
import { PercentageOutlined, PlusOutlined } from "@ant-design/icons";
import type { CollapseProps } from 'antd';
import InfoImg from "../../assets/img/info.svg";
const { TabPane } = Tabs;
import Tick from "../../assets/img/circle_orange.svg";
import Doc_large from "../../assets/img/Doc_large.svg";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import Pdf from "../../assets/img/pdfview.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import Doc from "../../assets/img/id.svg";
import Delete from "../../assets/img/delete.svg";
import ImagePreviewModal from "../Models/ImagePreviewModal";
import PdfPreviewModal from "../Models/PdfPreviewModal";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
interface RepresentativeDetails {
  documentNationality?: string,
  fatf?: number,
  nationality?: string,
  repDocNumber?: string,
  repExpiryDate?: any,
  representativeName?: string,
  roleType?: any,
  sharedOwnership?: boolean,
  representativeShare?: any,
  isCorporateShareholder?: any,
  companyShareholdingPercentage?: any
}
interface BasicDetails {
  name?: string,
  email?: string,
  callingCode?: string,
  contactNumber?: string,
  dob?: any,
  country?: string,
  typeOfEntity?: string,
  dateOfCorporation?: any,
  profession?: string,
  placeOfBirth?: string,
  placeOfBirthId?: string,
  gender?: string,
  customerProfession?: number,
  residenceStatus?: number,
  countryofIncorporation?: number
}

interface Shareholder {
  [key: string]: any;
  beneficialOwnerDob?: string;
  designation?: string;
  beneficialOwnerNationality?: string;
  shareholdingsPercentage?: number;
  companyShareholdingsPercentage?: string;
}
enum DocumentType {
  ShareHoldingTradeLicenseDoc = 'shareHoldingTradeLicenseDoc',
  ShareHoldingMoaDoc = 'shareHoldingMoaDoc',
  ShareHoldingOtherDoc = 'shareHoldingOtherDoc',
  RepAddProof = 'repAddProof',
  ShareHoldingCompanyAddressDoc = 'shareHoldingCompanyAddressDoc',
  ShareholderAddressProof = 'shareholderAddressProof',
}
type TargetKey = React.MouseEvent | React.KeyboardEvent | string | any;

const CompanyStep4 = ():any => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const local = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const params = useLocation();
  let shareholdings =0;

  const { Paragraph } = Typography;
  const ENTITY_TYPE = JSON.parse(getLocalStorage("auth")!)?.entityType
  const STEP = JSON.parse(getLocalStorage("auth")!)?.step;

  const [basicDetails, setBasicDetails] = useState<BasicDetails>({});
  const [representativeDetails, setRepresentativeDetails] = useState<RepresentativeDetails>({});
  const [countryList, setCountryList] = useState([]);
  const [shareholders, setShareholders] = useState<any>([]);
  const [tab, setTab] = useState<any>(1);
  const [activeTab,setActiveTab]= useState<any>("1");
  const [fileList, setFileList] = useState<any[]>([]);
  const [formTouched, setformTouched] = useState(false)
  const [shareholderDoc, setShareholderDoc] = useState<any>({});
  const [uploadLoading, setUploadLoading] = useState(false);
  const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [imagePreviewModal, setImagePreviewModal] = useState<boolean>(false);
  const [imagUrl, setImagUrl] = useState<any>("");
  const [representativeShareholderDoc, setRepresentativeShareholderDoc] = useState<any>({});
  const [representativeFileList, setRepresentativeFileList] = useState<any[]>([]);
  const [uploadError,setUploadError] = useState<any>([{
    emiratesFront:"",
    emiratesBack:"",
  }])
  const [isValid, setIsValid] = useState(false);
  const [countryofIncorporationTypeId, setCountryofIncorporationTypeId] = useState("")
  const [countryofIncorporationTypeList, setCountryofIncorporationTypeList] = useState([]);
  const [documentData, setDocumentData] = useState<any>();
  const [haveShareHoldingtradeLicenseProof, setHaveShareHoldingtradeLicenseProof] = useState<any>(0);
  const [shareHoldingTradeLicenseDoc, setshareHoldingTradeLicenseDoc] = useState<any>({});
  const [haveShareHoldingMoaDoc, setHaveShareHoldingMoaDoc] = useState<any>(0);
  const [shareHoldingMoaDoc, setShareHoldingMoaDoc] = useState<any>({});
  const [haveShareHoldingOtherDoc, setHaveShareHoldingOtherDoc] = useState<any>(0);
  const [shareHoldingOtherDoc, setShareHoldingOtherDoc] = useState<any>({});
  const [totalShareholdingsPercentage,  setTotalShareholdingsPercentage] = useState<any>(0);
  const initialized = useRef(false);
  const Token = local ? JSON.parse(local)?.token : "";
  const UserEmail = JSON.parse(getLocalStorage("auth")!)?.email;
  const [country, setCountry] = useState("");
  const [shareholderAddressDoc, setShareholderAddressDoc] = useState<any>({});
  const [shareholderAddressDocFileList, setShareholderAddressDocFileList] = useState<any[]>([]);
  const [haveShareHoldingCompanyAddressDoc, setHaveShareHoldingCompanyAddressDoc] = useState<any>(0);
  const [shareHoldingCompanyAddressDoc, setShareHoldingCompanyAddressDoc] = useState<any>({});
  const validatePercentage = (percent: number) => percent > 0 && percent <= 100;

  const getKybDetails = async (userAliasId: string) => {
    setLoading(true);
    try {  const res = await fetchKybDetails(userAliasId);
      // setLoading(false);
        const shareholders = res?.data?.data?.[0]?.shareholdersPayload;
        const representative = res?.data?.data?.[0]?.representative?.[0];
        const documents = res?.data?.data?.[0]?.documents?.[0];
        const designation = res?.data?.data?.[0]?.representative?.[0]?.roleType;
        const representativeShare = res?.data?.data?.[0]?.representative?.[0]?.representativeShare;        
        const isCorporateShareholder = res?.data?.data?.[0]?.representative?.[0]?.isCorporateShareholder;        
        setDocumentData(documents);
        setHaveShareHoldingtradeLicenseProof(documents?.shareHoldingTradeLicenseDoc?.[0]?.url ? 1 : 0);
        setshareHoldingTradeLicenseDoc(documents?.shareHoldingTradeLicenseDoc?.[0]?.url ? documents?.shareHoldingTradeLicenseDoc?.[0]?.fileName : {});
        setHaveShareHoldingMoaDoc(documents?.shareHoldingMoaDoc?.[0]?.url ? 1 : 0);
        setShareHoldingMoaDoc(documents?.shareHoldingMoaDoc?.[0]?.url ? documents?.shareHoldingMoaDoc?.[0]?.fileName : {});
        setShareHoldingCompanyAddressDoc(documents?.shareHoldingCompanyAddressDoc?.[0]?.url ? documents?.shareHoldingCompanyAddressDoc?.[0]?.fileName : {});
        setHaveShareHoldingCompanyAddressDoc(documents?.shareHoldingCompanyAddressDoc?.[0]?.url ? 1 : 0);
        setHaveShareHoldingOtherDoc(documents?.shareHoldingOtherDoc?.[0]?.url ? 1 : 0);
        setShareHoldingOtherDoc(documents?.shareHoldingOtherDoc?.[0]?.url ? documents?.shareHoldingOtherDoc?.[0]?.fileName : {});
        setRepresentativeDetails(res?.data?.data?.[0]?.representative?.[0]);
        setBasicDetails(res?.data?.data?.[0]?.basic?.[0]);
        if (res?.data?.data?.[0]?.shareholderDocuments?.length) {
          res.data.data[0].shareholderDocuments = res.data.data[0].shareholderDocuments.filter((elem:any) => {
            return !!Object.keys(elem).length
          });
        }
        setFileList(res?.data?.data?.[0]?.shareholderDocuments);
        setShareholderDoc(res?.data?.data?.[0]?.shareholderDoc);
        setRepresentativeFileList(res?.data?.data?.[0]?.representativeShareholderDocuments);
        setRepresentativeShareholderDoc(res?.data?.data?.[0]?.representativeShareholderDoc);
        setShareholderAddressDoc(res?.data?.data?.[0]?.shareholderAddressProofDoc);
        setShareholderAddressDocFileList(res?.data?.data?.[0]?.shareholderAddressProofDocuments);
        setActiveTab(shareholders?.length);

      if (res?.data?.data?.[0]?.shareholdersPayload?.length > 0) {
        const shareholdersData = res?.data?.data?.[0]?.shareholdersPayload;
      
        
        const formattedData = shareholdersData.map((item: any, index: any) => {
          if (isCorporateShareholder && item.CompnayName && item.companyShareholdingDateOfIncorporation && item.companyShareholdingsPercentage && item.companyShareholdingCountryOfIncorporation) {
            return {
              key: (index + 1).toString(),
              label: `Shareholder ${(index + 1).toString()}`,
              CompnayName: item.CompnayName,
              companyShareholdingDateOfIncorporation: item.companyShareholdingDateOfIncorporation ? dayjs(item.companyShareholdingDateOfIncorporation) : null,
              companyShareholdingsPercentage: item.companyShareholdingsPercentage ,
              companyShareholdingCountryOfIncorporation: item.companyShareholdingCountryOfIncorporation,
              docExpiryDate: item.docExpiryDate ? dayjs.utc(item.docExpiryDate) : null,
              docNumber: item.docNumber
            };
          } else {
            return {
              key: (index + 1).toString(),
              label: `Shareholder ${(index + 1).toString()}`,
              beneficialOwnerDob: item.beneficialOwnerDob ? dayjs(item.beneficialOwnerDob) : null,
              beneficialOwnerDocNationality: item?.beneficialOwnerDocNationality ? item.beneficialOwnerDocNationality : "PASSPORT",
              docExpiryDate: item.docExpiryDate ? dayjs.utc(item.docExpiryDate) : null,
              docNumber: item.docNumber,
              ...item
            };
          }
        }).filter(Boolean);
        
        setShareholders(formattedData)
        
        const transformedData: { [key: string]: any } = {};
        shareholdersData.forEach(async (shareholder: any, index: any) => {
          onTabChange((index + 1).toString())
          Object.entries(shareholder).forEach(([key, value]: any) => {
            if (key == "beneficialOwnerDob" || key == "companyShareholdingDateOfIncorporation") {
              transformedData[`${key}-${index + 1}`] = dayjs(value);
            } else if (key == "docExpiryDate") {
              transformedData[`${key}-${index + 1}`] = value ? dayjs(value):null;
            } else if(key == "companyShareholdingCountryOfIncorporation"){
              transformedData[`${key}-${index + 1}`] = value != null ? value.toString() : null;
              form.setFieldsValue({[`${key}-${index + 1}`]: value != null ? value.toString() : null});
            } else {
              transformedData[`${key}-${index + 1}`] = value != null ? value.toString() : null;
            }
          });
        });
        form.setFieldsValue(transformedData);
      } else if (res?.data?.data?.[0]?.shareholdersPayload?.length == 0 || res?.data?.data?.[0]?.shareholdersPayload?.length == undefined) {        
        if (representative?.sharedOwnership == true  || representativeShare >= 0) {
          const formattedData = {
            key: "1",
            label: `Shareholder 1`,
            FirstName: null,
            MiddleName: null,
            LastName:null,
            Gender: null,
            shareholdingsPercentage: validatePercentage(Number(representativeShare)) ? representativeShare : 0,
            designation: designation,
            beneficialOwnerDob: representative?.representativeDob ? representative.representativeDob : null,
            beneficialOwnerNationality: representative?.nationality ? representative?.nationality : null,
            beneficialOwnerDocNationality : representative?.repDocType ?? 'PASSPORT',
            docExpiryDate: representative?.repExpiryDate ? dayjs.utc(representative.repExpiryDate): null,
            docNumber: representative?.repDocNumber
          };
          let tab2;
          if (isCorporateShareholder === true && representative?.companyShareholdingPercentage) {
            tab2 =  {
              key: "2",
              label: `Shareholder 2`,
              CompnayName:null,
              companyShareholdingDateOfIncorporation: null,
              companyShareholdingsPercentage: validatePercentage(Number(representative?.companyShareholdingPercentage)) ? representative?.companyShareholdingPercentage : 0,
              companyShareholdingCountryOfIncorporation: null,
              docExpiryDate: null,
              docNumber: null
            };
          }
          isCorporateShareholder === true && representative?.companyShareholdingPercentage ? setShareholders([formattedData, tab2]) : setShareholders([formattedData]);
          const shareholdersData = isCorporateShareholder === true && representative?.companyShareholdingPercentage ? [formattedData, tab2] : [formattedData];
          const transformedData: { [key: string]: any } = {};
          shareholdersData.forEach(async (shareholder: any, index: any) => {
            onTabChange((index + 1).toString())
            Object.entries(shareholder).forEach(([key, value]: any) => {
              if (key == "beneficialOwnerDob" || key == "companyShareholdingDateOfIncorporation" || key === "docExpiryDate") {
                transformedData[`${key}-${index + 1}`] = value ? dayjs(value) : null;
              } else {
                transformedData[`${key}-${index + 1}`] = value ? value.toString() : null;
              }
            });
          });
          form.setFieldsValue(transformedData);
        } else {
          if (isCorporateShareholder === true && representative?.companyShareholdingPercentage) {
            const tab1 =  {
              CompnayName:null,
              companyShareholdingDateOfIncorporation: null,
              companyShareholdingsPercentage: validatePercentage(Number(representative?.companyShareholdingPercentage)) ? representative?.companyShareholdingPercentage : 0,
              companyShareholdingCountryOfIncorporation: null,
              docExpiryDate: null,
              docNumber: null
            };
            const shareholdersDetail = [tab1];
            const formattedData = shareholdersDetail.map((item: any, index: any) => {
                return {
                  key: (index + 1).toString(),
                  label: `Shareholder ${(index + 1).toString()}`,
                  CompnayName: item.CompnayName ? item.CompnayName : "",
                  companyShareholdingDateOfIncorporation: item?.companyShareholdingDateOfIncorporation ? dayjs(item.companyShareholdingDateOfIncorporation) :null,
                  companyShareholdingsPercentage: validatePercentage(Number(representative?.companyShareholdingPercentage)) ? representative?.companyShareholdingPercentage : 0,
                  companyShareholdingCountryOfIncorporation: item.companyShareholdingCountryOfIncorporation,
                  docExpiryDate: item.docExpiryDate ? dayjs(item.docExpiryDate) : null,
                  docNumber: item.docNumber
                };
            }).filter(Boolean);
            setShareholders(formattedData)
  
            const transformedData: { [key: string]: any } = {};
  
            formattedData.forEach(async (shareholder: any, index: any) => {
              onTabChange((index + 1).toString())
              Object.entries(shareholder).forEach(([key, value]: any) => {
                if (key == "beneficialOwnerDob" || key == "companyShareholdingDateOfIncorporation" || key == "docExpiryDate") {
                  transformedData[`${key}-${index + 1}`] = value ? dayjs(value) : null;
                } else {
                  transformedData[`${key}-${index + 1}`] = value != null ? value.toString() : null;
                }
              });
            });
            form.setFieldsValue(transformedData);
          }
          // addTab();
        }
      }

      if (representative?.sharedOwnership == true || representativeShare > 0) {
        const shareholdersData: Shareholder[] = res?.data?.data?.[0]?.shareholdersPayload ?? [];
      
        if (shareholdersData.length > 0) {
          let currentShareholder: any = {};
          let currentCompany: any = {};  
          shareholdersData.map((eachSh: any) => {
            if(eachSh?.designation && eachSh?.shareholdingsPercentage > 0) {
              currentShareholder = eachSh;
            } else if(eachSh?.CompnayName && eachSh?.companyShareholdingsPercentage) {
              currentCompany = eachSh;
            }
          })
          
          if (designation && designation !== currentShareholder?.designation) {
            updateShareholdersData(shareholdersData, 'designation', designation);
          }

          if (representative?.nationality && representative?.nationality !== currentShareholder?.beneficialOwnerNationality) {
            updateShareholdersData(shareholdersData, 'beneficialOwnerNationality', representative.nationality);
          }
          
          
          if (representative.representativeDob && !dayjs(representative.representativeDob).isSame(dayjs(currentShareholder?.beneficialOwnerDob))) {
            updateShareholdersData(shareholdersData, 'beneficialOwnerDob', representative.representativeDob);
          }

          if (representativeShare && representativeShare !== currentShareholder?.shareholdingsPercentage) {
            updateShareholdersData(shareholdersData, 'shareholdingsPercentage', representativeShare);
          }

          if (representative?.repDocType && representative?.repDocType !== currentShareholder?.beneficialOwnerDocNationality) {
            updateShareholdersData(shareholdersData, 'beneficialOwnerDocNationality', representative.repDocType);
          }

          if (representative?.repExpiryDate && !dayjs(representative.repExpiryDate).isSame(dayjs(currentShareholder?.docExpiryDate))) {
            updateShareholdersData(shareholdersData, 'docExpiryDate', dayjs(representative.repExpiryDate), true);
          }

          if (representative?.repDocNumber && representative?.repDocNumber !== currentShareholder?.docNumber) {
            updateShareholdersData(shareholdersData, 'docNumber', representative?.repDocNumber);
          }
      
          if (isCorporateShareholder === true && representative?.companyShareholdingPercentage && (representative?.companyShareholdingPercentage !== currentCompany?.companyShareholdingsPercentage || currentCompany?.companyShareholdingsPercentage == undefined)) {
            let shareholderArray: any = []
            let tab2: any =  {
            CompnayName:null,
            companyShareholdingDateOfIncorporation: null,
            companyShareholdingsPercentage: 0,
            companyShareholdingCountryOfIncorporation: null
          };
          shareholderArray = [...shareholdersData,tab2]
          if(shareholdersData?.[0].companyShareholdingsPercentage &&  Number(shareholdersData?.[0]?.companyShareholdingsPercentage) > 0 && representativeShare > 0 && !currentShareholder?.shareholdingsPercentage) {
            tab2 = {
              FirstName: null,
              MiddleName: null,
              LastName:null,
              Gender: null,
              shareholdingsPercentage: representativeShare,
              designation: designation,
              beneficialOwnerDob: representative?.representativeDob ? representative.representativeDob : null,
              beneficialOwnerNationality: representative?.nationality ? representative?.nationality : null,
              beneficialOwnerDocNationality : representative?.repDocType ?? 'PASSPORT'
            }
            shareholderArray = [tab2,...shareholdersData]
          }
          const shareholdersDetail = shareholderArray;
            const formattedData = shareholdersDetail.map((item: any, index: any) => {
              if (isCorporateShareholder && ((item?.designation == "" || item?.designation == undefined) && item?.CompnayName)) {
                return {
                  key: (index + 1).toString(),
                  label: `Shareholder ${(index + 1).toString()}`,
                  CompnayName: item.CompnayName ? item.CompnayName : "",
                  companyShareholdingDateOfIncorporation: item?.companyShareholdingDateOfIncorporation ? dayjs(item.companyShareholdingDateOfIncorporation) :null,
                  companyShareholdingsPercentage: validatePercentage(Number(representative?.companyShareholdingPercentage)) ? representative?.companyShareholdingPercentage : 0,
                  companyShareholdingCountryOfIncorporation: item.companyShareholdingCountryOfIncorporation
                };
              } else {
                return {
                  key: (index + 1).toString(),
                  label: `Shareholder ${(index + 1).toString()}`,
                  beneficialOwnerDob: item.beneficialOwnerDob ? dayjs(item.beneficialOwnerDob) : null,
                  beneficialOwnerDocNationality: item?.beneficialOwnerDocNationality ? item.beneficialOwnerDocNationality : "PASSPORT",
                  ...item
                };
              }
            }).filter(Boolean);
            setShareholders(formattedData)
  
            const transformedData: { [key: string]: any } = {};
  
            formattedData.forEach(async (shareholder: any, index: any) => {
              onTabChange((index + 1).toString())
              Object.entries(shareholder).forEach(([key, value]: any) => {
                if (key == "beneficialOwnerDob" || key == "companyShareholdingDateOfIncorporation" || key == 'docExpiryDate') {
                  transformedData[`${key}-${index + 1}`] = value ? dayjs(value) : null;
                } else {
                  transformedData[`${key}-${index + 1}`] = value != null ? value.toString() : null;
                }
              });
            });
            form.setFieldsValue(transformedData);
          }
        }
        if(res?.data?.data?.[0]?.shareholderDocuments?.[0]?.shareholder_1?.[0]?.fileName !== res?.data?.data?.[0]?.documents[0]?.repDocFront?.[0]?.fileName){
          if (res?.data?.data?.[0]?.shareholderDoc?.shareholder_1) {
            await removeDocument("shareholder_1", res?.data?.data?.[0]?.shareholderDoc?.shareholder_1);
          }
          await uploadFile(documents?.repDocFront?.[0]?.url, documents?.repDocFront?.[0]?.fileName, "shareholder_1", "shareholderDoc","docChanged");
        } else if(res?.data?.data?.[0]?.representativeShareholderDocuments?.[0]?.representativeShareholderId_1?.[0]?.fileName !== res?.data?.data?.[0]?.documents[0]?.repDocBack?.[0]?.fileName){
          if (res?.data?.data?.[0]?.representativeShareholderDoc?.representativeShareholderId_1) {
            await removeDocument1("representativeShareholderId_1", res?.data?.data?.[0]?.representativeShareholderDoc?.representativeShareholderId_1);
          }
          await uploadFile(documents?.repDocBack?.[0]?.url, documents?.repDocBack?.[0]?.fileName, "representativeShareholderId_1", "representativeShareholderDoc","docChanged");
        } else if (res?.data?.data?.[0]?.shareholderAddressProofDocuments?.[0]?.addressProof_1?.[0]?.fileName !== res?.data?.data?.[0]?.documents[0]?.repAddProof?.[0]?.fileName) {
          if (res?.data?.data?.[0]?.shareholderAddressProofDoc?.addressProof_1) {
            await removeAddressProofDocument("addressProof_1", res?.data?.data?.[0]?.shareholderAddressProofDocuments?.[0]?.addressProof_1?.[0]?.id)
          }
          await uploadFile(documents?.repAddProof?.[0]?.url, documents?.repAddProof?.[0]?.fileName, "addressProof_1", "shareholderAddressProof", "docChanged");
        }
      } else if(isCorporateShareholder === true && Number(representative?.companyShareholdingPercentage) > 0){
        const shareholdersCompanyData = res?.data?.data?.[0]?.shareholdersPayload ?? [];
        let tab1 =  {
          CompnayName:null,
          companyShareholdingDateOfIncorporation: null,
          companyShareholdingsPercentage: validatePercentage(Number(representative?.companyShareholdingPercentage)) ? representative?.companyShareholdingPercentage : 0,
          companyShareholdingCountryOfIncorporation: null
        };
        if(shareholdersCompanyData?.length > 0) {
          shareholdersCompanyData.map((eachSh: any) => {
            if(eachSh?.CompnayName && eachSh?.companyShareholdingsPercentage) {
              tab1= eachSh
            }
          })
        }
        const shareholdersDetail = [tab1];
        const formattedData = shareholdersDetail.map((item: any, index: any) => {
            return {
              key: (index + 1).toString(),
              label: `Shareholder ${(index + 1).toString()}`,
              CompnayName: item.CompnayName ? item.CompnayName : "",
              companyShareholdingDateOfIncorporation: item?.companyShareholdingDateOfIncorporation ? dayjs(item.companyShareholdingDateOfIncorporation) :null,
              companyShareholdingsPercentage: validatePercentage(Number(representative?.companyShareholdingPercentage)) ? representative?.companyShareholdingPercentage : 0,
              companyShareholdingCountryOfIncorporation: item.companyShareholdingCountryOfIncorporation
            };
        }).filter(Boolean);
        setShareholders(formattedData)

        const transformedData: { [key: string]: any } = {};

        formattedData.forEach(async (shareholder: any, index: any) => {
          onTabChange((index + 1).toString())
          Object.entries(shareholder).forEach(([key, value]: any) => {
            if (key == "beneficialOwnerDob" || key == "companyShareholdingDateOfIncorporation" || key === 'docExpiryDate') {
              transformedData[`${key}-${index + 1}`] = value ? dayjs(value) : null;
            } else {
              transformedData[`${key}-${index + 1}`] = value != null ? value.toString() : null;
            }
          });
        });
        form.setFieldsValue(transformedData);
      }
    } catch (error) {
      setLoading(false)
      message.error("Oops! Could not fetch details. Please try again later!");
    }
  }  

  // useEffect(() => {

  //   if (
  //     basicDetails.countryofIncorporation !== 116869 && (selectedNationality&&selectedNationality.toUpperCase() !== "UNITED ARAB EMIRATES")
  //   ) {
  //     setNationalityId("PASSPORT");
  //   } else {
  //     setNationalityId("NATIONAL_ID");
  //   }
  // }, [selectedNationality, basicDetails]);

  const handleAddressProofUploadChange = (info: any, shareholderKey: string) => {
    // if (info.file.status === "done") {
    //   const uploadedFile = info.file.response?.data;
    //   setFileList((prev) => ({
    //     ...prev,
    //     [key]: [uploadedFile],
    //   }));
      
    //   setUploadError((prev: any) => ({ ...prev, [key]: "" }));
    // } else if (info.file.status === "error") {
    //   setUploadError((prev: any) => ({
    //     ...prev,
    //     [key]: `${info.file.name} upload failed.`,
    //   }));
    // }
     if (shareholderKey !== undefined) {
      if (info.file.status === "uploading") {
        setUploadLoading(true);
        setLoading(true);
      }
      if (info.file.status === "done") {
        setUploadLoading(false);
        setLoading(false);
        if (validateFile(info)) {
          setShareholderAddressDoc(info);
          setShareholderAddressDocFileList([...shareholderAddressDocFileList, { [shareholderKey]:  [info.file.response.data] }]);
        }
      }
    }
  };

  useEffect(() => {
    if (initialized.current) {//to prevent re-render
      return;
    }
    initialized.current = true;
    if (ENTITY_TYPE !== 'company' || STEP !== 4) {
      navigate(-1);
    } else {
      getRiskConfigurationDetails();
    }
    
    // if (shareholders?.length > 0) {
    //   addTab()
    // }
  }, []);

  useEffect(() => {
    if (shareholders?.length > 0 && shareholders?.length > Number(tab)) {
      addTab()
    }
  }, [tab])  

  useEffect(() => {
    getUserData(UserEmail)
      .then((response: any) => {
        setCountry(response?.data?.countryName);
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later!");
      });
  }, []);

  useEffect(() => {
    if (!shareholders || shareholders?.length == 0) {
      return;
    }
    const totalPercentage = shareholders && shareholders?.reduce((acc: any, shareholder: any) => {
      let companyPercentage = 0;
      const shareholderPercentage = parseInt(shareholder.shareholdingsPercentage);
      if (representativeDetails && representativeDetails?.isCorporateShareholder && shareholder?.companyShareholdingsPercentage) {
        companyPercentage = parseInt(shareholder?.companyShareholdingsPercentage);
      }
      const percentage = (isNaN(shareholderPercentage) ? 0 : shareholderPercentage) + companyPercentage;
      return acc + (isNaN(percentage) ? 0 : percentage);
    }, 0);
    setTotalShareholdingsPercentage(totalPercentage)
    if(totalPercentage === 100){
      setIsValid(true);
    } else if(totalPercentage > 100){
      message.error("Total percentage can not more than 100%");
      setIsValid(false);
    }
  }, [shareholders]);
  
  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 3;
    setLocalStorage('auth', JSON.stringify(localStroragevalue))
    navigate(KYBVerificatioStep3);
  }
  const getRiskConfigurationDetails = async () => {
    setLoading(true);
    getRiskConfiguration({ RiskCategory: "C" })
      .then((response) => {
        if (response?.data?.status === 201 || response?.data?.status === 200) {
          if (response?.data?.result && response?.data?.result?.length) {
            const result = response?.data?.result;
            const graphicRiskIndex = result.findIndex((d: any) => d?.riskCategory == 'Geographic Risk');
            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Nationality Partner 1') {
                  setCountryList(r?.riskItems || []);
                }
              })
            }
            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Country of Incorporation') {
                  setCountryofIncorporationTypeId(r?.id)
                  setCountryofIncorporationTypeList(r?.riskItems || [])
                }
              })
            }
          }
          // setLoading(false);
        }
      }).then(async()=>{
        await getKybDetails(userAlias);
      }).catch((error) => {
        setLoading(false);
        message.error(error?.error?.message ? error?.error?.message : "Something went wrong")
      })
      .finally(() => {
        setLoading(false); 
      });
  }

  const handleCancel = () => {
    form.resetFields();
  }

  const generateRow = ({ icon, text }: any) => (
    <Col xs={24} className="d-flex align-items-center mt-3">
      <Image src={icon} alt="icon" preview={false} className="sidebar-submenu-icons" />
      <Paragraph className="stepDetails_sub mx-2 mb-0">{text}</Paragraph>
    </Col>
  );

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BASIC_INFORMATION}</div><Image src={BlueTick} alt="tick" preview={false} />
        </span>
      ),
      children: (<>
          {generateRow({ icon: Mail, text: email })}
          {generateRow({ icon: Country, text: params?.state?.basic?.country ? params?.state?.basic?.country : basicDetails?.country })}
          {generateRow({ icon: Mobile, text: (params?.state?.basic?.callingCode && params?.state?.basic?.contactNumber) ? `${params?.state?.basic?.callingCode} ${params?.state?.basic?.contactNumber}` : `${basicDetails?.callingCode} ${basicDetails?.contactNumber}` })}
      </>),
    },
    {
      key: '2',
      label: (
        <span>
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REPRESENTATIVE_OWNERS}</div><Image src={BlueTick} alt="tick" preview={false} />
        </span>
      ),
      children: (<>
          {generateRow({ icon: User, text: params?.state?.formValues?.representativeName ? params?.state?.formValues?.representativeName : representativeDetails?.representativeName })}
          {generateRow({ icon: Role, text: params?.state?.formValues?.roleType ? COMPANY_ROLE[params?.state?.formValues?.roleType] : COMPANY_ROLE[representativeDetails?.roleType] })}
          {generateRow({ icon: Flag, text: params?.state?.formValues?.nationality ? params?.state?.formValues?.nationality : representativeDetails?.nationality })}
      </>),
    },
    {
      key: '3',
      label: (
        <span className="step1 activeBtn pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BENEFICIAL_OWNERS}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '4',
      label: (
        <span className="pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.BUSINESS_DETAILS}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '5',
      label: (
        <span className="pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '6',
      label: (
        <span className="pl--24px">
          <div className="stepDetails">{KYB_VERIFICATION_STEPS_TITLE.FATCA_SELF_CERTIFICATION_FORM}</div>
        </span>
      ),
      showArrow:false
    },
  ];


  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  const addTab = () => {
    const newKey = `${shareholders?.length + 1}`;
    const newTab: any = {
      key: newKey,
      label: `Shareholder ${newKey}`,
      children: (
        <></>
      ),
    };
    const existingTabs = JSON.parse(JSON.stringify(shareholders));
    const tabExist = existingTabs.filter((item: any) => item.label === newTab.label)
    if (tabExist.length === 0) {
      setShareholders([...shareholders, newTab]);
    } else {
      setShareholders([newTab])
    }
    setTab(newKey)
    setActiveTab(newKey)
    const upload:any = [...uploadError]
    upload.push({
      emiratesFront:"",
      emiratesBack:""
    })
    setUploadError(upload)
  }

  const handleTabDataChange = (tabKey: string, field: string, value: string) => {
    const updatedTabs = shareholders.map((tab: any) => {
      if (field === 'FirstName' || field === 'LastName' || field === 'designation' || field === 'CompnayName') {
        const result: string = value.replace(OnlyText, "");
        if (tab.key === tabKey) {
          form.setFieldsValue({ [`${field}-${tabKey}`]: result });
          return { ...tab, [field]: result };
        }
        return tab;
      } else if (field === 'docNumber') {
        const result: string = value.replace(alphanumericRegex, "");
        if (tab.key === tabKey) {
          form.setFieldsValue({ [`${field}-${tabKey}`]: result });
          return { ...tab, [field]: result };
        }
        return tab;
      } else if (field === 'companyShareholdingCountryOfIncorporation') {
        const percent: any = representativeDetails?.companyShareholdingPercentage;
        if (tab.key === tabKey) {
          form.setFieldsValue({ [`companyShareholdingsPercentage-${tabKey}`]: percent });
          form.setFieldsValue({ [`${field}-${tabKey}`]: value });
          return { ...tab, [field]: value , companyShareholdingsPercentage : percent  };
        }
        return tab;
      } else if (field === 'shareholdingsPercentage' || field === 'companyShareholdingsPercentage') {
        const percent: any = value.replace(/[^0-9.]/gi, "");
        if (tab.key === tabKey) {
          form.setFieldsValue({ [`${field}-${tabKey}`]: percent });
          return { ...tab, [field]: percent };
        }
        return tab;
      } else {
        if (tab.key === tabKey) {
          if(['beneficialOwnerDob','companyShareholdingDateOfIncorporation','docExpiryDate'].includes(field)){
            const date = DateWithUtcOffset2(value);
            return { ...tab, [field]: date };
          } else {
            if (field === 'beneficialOwnerNationality') {
              if (value !== 'UNITED ARAB EMIRATES') {
                return {
                  ...tab,
                  [field]: value,
                  beneficialOwnerDocNationality: 'PASSPORT'
                }
              } else {
                return { ...tab, 
                  [field]: value,
                  beneficialOwnerDocNationality: 'NATIONAL_ID'
                 };
              }
            } else {
              return { ...tab, [field]: value };
            }
          }
        }
        return tab;
      }
    });
    setShareholders(updatedTabs);
  };
  
  const validateShareholderFields = () => {
    // Define the fields to be checked
    const requiredFields = [
      'FirstName',
      'LastName',
      'Gender',
      'shareholdingsPercentage',
      'designation',
      'beneficialOwnerDob',
      'beneficialOwnerNationality',
    ];

    const requiredFieldsForCompany = [
      'CompnayName',
      'companyShareholdingDateOfIncorporation',
      'companyShareholdingsPercentage',
      'companyShareholdingCountryOfIncorporation',
    ]

    return shareholders.every((shareholder: any, index: any) => {
      let fieldsToCheck;

      if (representativeDetails) {
        if (representativeDetails.representativeShare === 0 && representativeDetails.isCorporateShareholder) {
          if (index === 0) {
            fieldsToCheck = requiredFieldsForCompany;
          }
        } else if (representativeDetails.representativeShare > 0 && representativeDetails.isCorporateShareholder) {
          if (index === 1) {
            fieldsToCheck = requiredFieldsForCompany;
          }
        }
      }

      if (!fieldsToCheck) {
        fieldsToCheck = requiredFields;
      }

      return fieldsToCheck.every((field) => {
        const value = shareholder[field];
        if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
          message.error("Please check all of the shareholders tabs and fill out the required data to submit the form.");
          return false;
        }
        return true;
      });
    });
  };
    
  const onFinish = () => {
    const isValidForm =  validateShareholderFields();
    if (totalShareholdingsPercentage !== 100) {
      message.error("Please check the sum of all the shareholder's tabs; the shareholding percentage must be 100%.");
      return false;
    } else if(isValidForm){
      if (shareholders && shareholders?.length > 0) {
        const isCorporateShareholder = representativeDetails?.isCorporateShareholder === true;
        const shareHolderArr = shareholders.map((item: any) => {
          if (isCorporateShareholder && item.CompnayName && item.companyShareholdingDateOfIncorporation && item.companyShareholdingsPercentage && item.companyShareholdingCountryOfIncorporation) {
            return {
              CompnayName: item.CompnayName,
              companyShareholdingDateOfIncorporation: item.companyShareholdingDateOfIncorporation ? dayjs(item.companyShareholdingDateOfIncorporation) : "",
              companyShareholdingsPercentage: item.companyShareholdingsPercentage,
              companyShareholdingCountryOfIncorporation: item.companyShareholdingCountryOfIncorporation,
              companyShareholdingCountryOfIncorporationTypeId: countryofIncorporationTypeId,
              docExpiryDate: item.docExpiryDate ? dayjs(item.docExpiryDate) : "",
              docNumber: item.docNumber
            };
          } else {
            if (item.beneficialOwnerDob?.length === 10) {
              item.beneficialOwnerDob = item.beneficialOwnerDob + 'T00:00:00.000Z'; //patch to handle date without timezone
            }
            return {
              FirstName: item.FirstName,
              MiddleName: item.MiddleName,
              LastName: item.LastName,
              Gender: item.Gender,
              shareholdingsPercentage: item.shareholdingsPercentage,
              designation: item.designation,
              beneficialOwnerDob: item.beneficialOwnerDob ? dayjs(item.beneficialOwnerDob) : "",
              beneficialOwnerNationality: item.beneficialOwnerNationality,
              beneficialOwnerDocNationality: item?.beneficialOwnerDocNationality ? item?.beneficialOwnerDocNationality : 'PASSPORT',
              docExpiryDate: item.docExpiryDate ? dayjs(item.docExpiryDate) : "",
              docNumber: item.docNumber
            };
          }
        }).filter(Boolean);
        setLoading(true);
        const reqBody = {
          type: "share_holders",
          userAlias: userAlias,
          shareholdersPayload: shareHolderArr
        }
        updateShareHolder(reqBody)
          .then((res) => {
            setLoading(false);
            if (res.status === 201 || res.status === 200) {
              const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
              localStroragevalue.step = 5;
              setLocalStorage('auth', JSON.stringify(localStroragevalue))
              navigate(KYBVerificatioStep5, {
                state: {
                  shareholdersPayload: shareHolderArr,
                  basic: params?.state?.basic,
                  representativeDetails: params?.state?.formValues
                }
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            message.error(err?.message ? err?.message : "Oops! Something went wrong. Please try again later!");
          });
      }
      setLoading(false);
    }
  };

  const remove = async(targetKey: TargetKey) => {
    if (targetKey == "1") {
      message.error("You can't remove default tabs")
    } else if (Number(representativeDetails?.representativeShare) > 0 && representativeDetails?.isCorporateShareholder === true && targetKey == "2") {
      message.error("You can't remove default tabs")
    } else {
      const targetIndex = shareholders.findIndex((pane: any) => pane.key === targetKey);
      const newPanes = shareholders.filter((pane: any) => pane.key !== targetKey);
      if (newPanes.length && targetKey === activeTab) {
        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
        setActiveTab(key);
      }
      setShareholders(newPanes);
      form.resetFields(
        [`FirstName-${targetKey}`,
        `MiddleName-${targetKey}`,
        `LastName-${targetKey}`,
        `Gender-${targetKey}`,
        `designation-${targetKey}`,
        `shareholdingsPercentage-${targetKey}`,
        `beneficialOwnerDob-${targetKey}`,
        `beneficialOwnerNationality-${targetKey}`,
        `roleType${targetKey}`
      ]
      )
      if (targetKey) {
        const updatedShareholders = shareholders.filter((tab: any) => tab.key !== targetKey);
        setShareholders(updatedShareholders);
        
        if (generateDynamicKey("shareholder_", targetKey) && findObjectByKey(fileList, generateDynamicKey("shareholder_", targetKey)) && generateDynamicKey("shareholder_", targetKey), findObjectByKey(fileList, generateDynamicKey("shareholder_", targetKey))[generateDynamicKey("shareholder_", targetKey)]?.[0]?.id) {
          await removeDocument(generateDynamicKey("shareholder_", targetKey), findObjectByKey(fileList, generateDynamicKey("shareholder_", targetKey))[generateDynamicKey("shareholder_", targetKey)]?.[0]?.id);
        }

        if (generateDynamicKey("representativeShareholderId_", targetKey) && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", targetKey)) && generateDynamicKey("representativeShareholderId_", targetKey), findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", targetKey))[generateDynamicKey("representativeShareholderId_", targetKey)]?.[0]?.id) {
          await removeDocument1(generateDynamicKey("representativeShareholderId_", targetKey), findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", targetKey))[generateDynamicKey("representativeShareholderId_", targetKey)]?.[0]?.id);
        }

      }
    }

  };

  const onEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') {
      addTab();
    } else {
      remove(targetKey);
    }
  };

  const beforeUploadFront =async (file: any,index:any) => {
    const checkBeforeUpload = beforeUploadFile(file,"")
    if(checkBeforeUpload == true){
      setUploadLoading(true);
      const oldUploadError:any = [...uploadError]
      oldUploadError[index].emiratesFront = ""
      await setUploadError(oldUploadError) 
      return true;
    }
    else{
      setUploadLoading(false);
      const oldUploadError:any = [...uploadError]
      oldUploadError[index].emiratesFront = checkBeforeUpload
      await setUploadError(oldUploadError) 
      return false
    }
  };

  const beforeUploadBack =async (file: any,index:any) => {
    const checkBeforeUpload = beforeUploadFile(file,"")
    if(checkBeforeUpload == true){
      setUploadLoading(true);
      const oldUploadError:any = [...uploadError]
      oldUploadError[index].emiratesBack = ""
      await setUploadError(oldUploadError) 
      return true;
    }
    else{
      setUploadLoading(false);
      const oldUploadError:any = [...uploadError]
      oldUploadError[index].emiratesBack = checkBeforeUpload
      await setUploadError(oldUploadError) 
      return false
    }
  };


  const validateFile = (file: any) => {
    const data = file.file;
    const fileType: boolean = ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(data.type);
    const isLt5M: boolean = data.size / 1024 / 1024 <= 5;

    return fileType && isLt5M;
  };

  const uploadButton = (shareHolderKey: string) => {
    return (
      <div>
        {((fileList?.length > 0 && findObjectByKey(fileList, shareHolderKey)) || ((shareholderDoc && Object?.keys(shareholderDoc)?.length > 0 )&& fileList && findObjectByKey(fileList, shareHolderKey))) && fileList?.length > 0 && findObjectByKey(fileList, shareHolderKey) && findObjectByKey(fileList, shareHolderKey)[shareHolderKey]?.[0]?.status !== "REJECTED" && (
          <div className="endtoend mt-3">
            <div></div>
            <Image
              src={Tick}
              alt="circle"
              className="tick_upload"
              preview={false}
            />
          </div>
        )}

        <div style={{ marginTop: (shareholderDoc?.file?.name || (shareholderDoc && Object.keys(shareholderDoc)?.length > 0)) ? -12 : 27 }}>
          <Image src={Doc_large} alt="passport" preview={false} />
          <div className="mt-3 subText_xs overflowText w-upload">
            {fileList?.length > 0 && findObjectByKey(fileList, shareHolderKey) && findObjectByKey(fileList, shareHolderKey)[shareHolderKey]?.[0]?.status === "REJECTED" ? (
              <span className="rejectReasonText">Re-upload</span>
            ) : (shareholderDoc && Object.keys(shareholderDoc)?.length > 0) && (fileList.length > 0 && findObjectByKey(fileList, shareHolderKey)) ? (
              findObjectByKey(fileList, shareHolderKey)[shareHolderKey]?.[0]?.fileName ? findObjectByKey(fileList, shareHolderKey)[shareHolderKey]?.[0]?.fileName : findObjectByKey(fileList, shareHolderKey)[shareHolderKey]?.[0]?.inputfileid
            ) : shareholderDoc?.file?.name ? (
              shareholderDoc?.file?.name
            ) : (
              DOCUMENT_TYPE[getDocNationality(shareHolderKey?.split("_")?.[1])] + " front"
            )}
          </div>
        </div>
      </div>
    );
  };

 const uploadAddressProofButton = (shareHolderKey: string) => {
    return (
      <div>
        {((shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, shareHolderKey)) || ((shareholderDoc && Object?.keys(shareholderDoc)?.length > 0 )&& shareholderAddressDocFileList && findObjectByKey(shareholderAddressDocFileList, shareHolderKey))) && shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, shareHolderKey) && findObjectByKey(shareholderAddressDocFileList, shareHolderKey)[shareHolderKey]?.[0]?.status !== "REJECTED" && (
          <div className="endtoend mt-3">
            <div></div>
            <Image
              src={Tick}
              alt="circle"
              className="tick_upload"
              preview={false}
            />
          </div>
        )}

        <div style={{ marginTop: (shareholderAddressDoc?.file?.name || (shareholderDoc && Object.keys(shareholderDoc)?.length > 0)) ? -12 : 27 }}>
          <Image src={Doc_large} alt="passport" preview={false} />
          <div className="mt-3 subText_xs overflowText w-upload">
            {shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, shareHolderKey) && findObjectByKey(shareholderAddressDocFileList, shareHolderKey)[shareHolderKey]?.[0]?.status === "REJECTED" ? (
              <span className="rejectReasonText">Re-upload</span>
            ) : (shareholderAddressDoc && Object.keys(shareholderAddressDoc)?.length > 0) && (shareholderAddressDocFileList.length > 0 && findObjectByKey(shareholderAddressDocFileList, shareHolderKey)) ? (
              findObjectByKey(shareholderAddressDocFileList, shareHolderKey)[shareHolderKey]?.[0]?.fileName ? findObjectByKey(shareholderAddressDocFileList, shareHolderKey)[shareHolderKey]?.[0]?.fileName : findObjectByKey(shareholderAddressDocFileList, shareHolderKey)[shareHolderKey]?.[0]?.inputfileid
            ) :  
              "Address Proof"
             }
          </div>
        </div>
      </div>
    );
  };

  const handleFileUpload = async (fileObject: any, shareholderKey: string, documentType = "") => {
    setLoading(true);
    setUploadLoading(true);
    if (shareholderKey !== undefined) {
      const file = fileObject?.file;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", "file");
      formData.append("shareholderKey", shareholderKey);
      formData.append("type", "documents");
      formData.append("userAlias", userAlias);
      if (typeof documentType === 'string' && documentType === "shareholderAddressProof") {
        formData.append("businessType", documentType);
      } else {
        formData.append("businessType", "shareholderDoc");
      }
      await updateDocuments(formData).then((response: any) => {
        if ([200, 201].includes(response?.statusCode || response?.status)) {
          setUploadLoading(false);
          setLoading(false);
          if (typeof documentType === 'string' && documentType === "shareholderAddressProof") {
            const { shareholderAddressProof, ...newData } = response?.data?.data;
            setShareholderDoc(shareholderAddressProof)
            const index = shareholderAddressDocFileList.findIndex((item: any) => item[shareholderKey]);
            if (index > -1) {
              shareholderAddressDocFileList[index] = { [shareholderKey]: [newData] }
              setShareholderAddressDocFileList(shareholderAddressDocFileList)
            } else {
              setShareholderAddressDocFileList([...shareholderAddressDocFileList, { [shareholderKey]: [newData] }]);
            }
          } else {
            const { shareholderDoc, ...newData } = response?.data?.data;
            setShareholderDoc(shareholderDoc)
            const index = fileList.findIndex((item: any) => item[shareholderKey]);
            if (index > -1) {
              fileList[index] = { [shareholderKey]: [newData] }
              setFileList(fileList)
            } else {
              setFileList([...fileList, { [shareholderKey]: [newData] }]);
            }
          }

        }
      }).catch(() => {
        setLoading(false);
        setUploadLoading(false);
        message.error("Failed to upload file");
      })
    }
  };

  const handleFileUploadChange = (info: any, shareholderKey: string) => {
    if (shareholderKey !== undefined) {
      if (info.file.status === "uploading") {
        setUploadLoading(true);
        setLoading(true);
      }
      if (info.file.status === "done") {
        setUploadLoading(false);
        setLoading(false);
        if (validateFile(info)) {
          setShareholderDoc(info);
          setFileList([  ...fileList,{   [shareholderKey]:{ [shareholderKey]:  [info.file.response.data] }}]);
        }
      }
    }
  };
  const removeDocument = async (shareHolderKey: string, id: string) => {
    const filteredShareholder = fileList && fileList?.filter((obj: any) => !(shareHolderKey in obj));
    setFileList(filteredShareholder);

    for (const [key, value] of Object.entries(shareholderDoc)) {
      if (value === id) {
        delete shareholderDoc[key];
        break;
      }
    }
    setShareholderDoc(shareholderDoc)

    const payload = {
      id: id,
      userAlias: userAlias,
      docType: "shareholderDoc",
      shareholderDoc: shareholderDoc,
    }

    await deleteShareHolderFile(payload)
      .then(async (response: any) => {
        if (response?.status === 201 || response?.status === 200) { /* empty */ }
      }).catch(() => {
        message.error('Something went wrong. Please try again!');
      });
  };
  const removeDocument1 = async (key: string, id: string) => {
    const filteredRepresentative = representativeFileList && representativeFileList?.filter((obj: any) => !(key in obj));
    setRepresentativeFileList(filteredRepresentative);

    for (const [key, value] of Object.entries(representativeShareholderDoc)) {
      if (value === id) {
        delete representativeShareholderDoc[key];
        break;
      }
    }
    setRepresentativeShareholderDoc(representativeShareholderDoc)
    const payload = {
      id: id,
      userAlias: userAlias,
      docType: "representativeShareholderDoc",
      representativeShareholderDoc: representativeShareholderDoc,
      
    }

    await deleteShareHolderRepresentativeFile(payload)
      .then(async (response: any) => {
        if (response?.status === 201 || response?.status === 200) { /* empty */ }
      }).catch(() => {
        message.error('Something went wrong. Please try again!');
      });
  };

  const removeAddressProofDocument = async (shareholderKey: string, id: string) => {
    try {
      setShareholderAddressDocFileList(prev =>
        prev?.filter((obj: any) => !(shareholderKey in obj)) ?? []
      );

      // for (const [key, value] of Object.entries(shareholderAddressDoc)) {
      //   if (value === id) {
      //     delete shareholderAddressDoc[key];
      //     break;
      //   }
      // }
      // setShareholderAddressDoc(shareholderAddressDoc);

      const updatedShareholderAddressDoc = { ...shareholderAddressDoc };
      for (const [key, value] of Object.entries(updatedShareholderAddressDoc)) {
        if (value === id) {
          delete updatedShareholderAddressDoc[key];
          break;
        }
      }
      setShareholderAddressDoc(updatedShareholderAddressDoc);

      const payload = {
        id: Number(id),
        userAlias,
        docType: "shareholderAddressProof",
        shareholderKey,
      };

      const response = await deleteShareholderAddressProof(payload);
      if (response?.status === 200 || response?.status === 201) {
        message.success(response?.data?.message);
      }
    } catch (error) {
      message.error("Something went wrong. Please try again!");
    }
  };

  const uploadButton1 = (shareHolderKey: string) => (
    <div>
      {((representativeFileList?.length > 0 && findObjectByKey(representativeFileList, shareHolderKey)) || (representativeShareholderDoc && Object?.keys(representativeShareholderDoc)?.length > 0 && representativeFileList && findObjectByKey(representativeFileList, shareHolderKey))) && representativeFileList?.length > 0 && findObjectByKey(representativeFileList, shareHolderKey) && findObjectByKey(representativeFileList, shareHolderKey)[shareHolderKey]?.[0]?.status !== "REJECTED" && (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      )}

      <div style={{ marginTop: (representativeShareholderDoc?.file?.name || (representativeShareholderDoc && Object.keys(representativeShareholderDoc)?.length > 0)) ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {representativeFileList?.length > 0 && findObjectByKey(representativeFileList, shareHolderKey) && findObjectByKey(representativeFileList, shareHolderKey)[shareHolderKey]?.[0]?.status === "REJECTED" ? (
            <span className="rejectReasonText">Re-upload</span>
          ) : (representativeShareholderDoc && Object.keys(representativeShareholderDoc)?.length > 0) && (representativeFileList && findObjectByKey(representativeFileList, shareHolderKey)) ? (
            findObjectByKey(representativeFileList, shareHolderKey)[shareHolderKey]?.[0]?.fileName ? findObjectByKey(representativeFileList, shareHolderKey)[shareHolderKey]?.[0]?.fileName : findObjectByKey(representativeFileList, shareHolderKey)[shareHolderKey]?.[0]?.inputfileid
          ) : representativeShareholderDoc?.file?.name ? (
            representativeShareholderDoc?.file?.name
          ) : (
            DOCUMENT_TYPE[getDocNationality(shareHolderKey?.split("_")?.[1])] + " back"
          )}
        </div>
      </div>
    </div>
  );

  const handleFileUploadChange1 = (info: any, shareholderKey: string) => {

    if (shareholderKey !== undefined) {
      if (info.file.status === "uploading") {
        setUploadLoading(true);
        setLoading(true);
      }
      if (info.file.status === "done") {
        setUploadLoading(false);
        setLoading(false);
        if (validateFile(info)) {
          setRepresentativeShareholderDoc(info);
          setRepresentativeFileList([...representativeFileList, { [shareholderKey]:  [info.file.response.data] }]);
        }
      }
    }
  };
  const handleFileUpload1 = async (fileObject: any, shareholderKey: string) => {
    setLoading(true);
    setUploadLoading(true);
    if (shareholderKey !== undefined) {
      const file = fileObject?.file;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", "file");
      formData.append("businessType", "representativeShareholderDoc");
      formData.append("representativeShareholderKey", shareholderKey);
      formData.append("type", "documents");
      formData.append("userAlias", userAlias);

      await updateDocuments(formData).then((response: any) => {
        if ([200, 201].includes(response?.statusCode || response?.status)) {
          setUploadLoading(false);
          setLoading(false);
          const { representativeShareholderDoc, ...newData } = response?.data?.data;
          setRepresentativeShareholderDoc(representativeShareholderDoc)
          const index = representativeFileList.findIndex((item: any) => item[shareholderKey]);
          if(index > -1) {
            representativeFileList[index] = {[shareholderKey]: [newData]}
            setRepresentativeFileList(representativeFileList)
          } else {
            setRepresentativeFileList([...representativeFileList, { [shareholderKey]: [newData] }]);
          }
         
        }
      }).catch(() => {
        setLoading(false);
        setUploadLoading(false);
        message.error("Failed to upload file");
      })
    }
  };
  const handleImagePreview = (url: any) => {
    setImagUrl(url);
    setTimeout(() => {
      setImagePreviewModal(true);
    }, 500);
  }
  const handlePDFView = (url: any) => {
    setImagUrl(url);
    setverifyVisible(true)
  }

  const findObjectByKey = (arr: any, key: string) => {
    return arr.find((obj: any) => key in obj) || false;
  }
  const generateDynamicKey = (key: string, keyNumber: string) => {
    return `${key}${keyNumber}`;
  }

  const uploadFile = async (fileUrl: any, fileName: any, shareholderKey: string, businessType: string, type?: any) => {
    if (type !== "docChanged") {
      setLoading(true);
    }
    try {
      const response = await axios.get(fileUrl, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const formData = new FormData();
      formData.append("file", blob, fileName);
      formData.append("name", "file");
      formData.append("businessType", businessType);
      formData.append("type", "documents");
      formData.append("userAlias", userAlias);
      formData.append("reqType", "autoUpload");
      if (businessType === "shareholderDoc") {
        formData.append("shareholderKey", shareholderKey);
      } else if (businessType === "representativeShareholderDoc") {
        formData.append("representativeShareholderKey", shareholderKey);
      } else if (businessType === "shareholderAddressProof") {
        formData.append("shareholderKey", shareholderKey);
      }
      await updateDocuments(formData).then((response: any) => {
        if ([200, 201].includes(response?.statusCode || response?.status)) {
          setUploadLoading(false);
          setLoading(false);
          if (businessType === "shareholderDoc") {
            const { shareholderDoc, ...newData } = response?.data?.data;
            setShareholderDoc(shareholderDoc);
            setFileList([...fileList, { [shareholderKey]: [newData] }]);
          } else if (businessType === "representativeShareholderDoc") {
            const { representativeShareholderDoc, ...newData } = response?.data?.data;
            setRepresentativeShareholderDoc(representativeShareholderDoc);
            setRepresentativeFileList([...representativeFileList, { [shareholderKey]: [newData] }]);
          } else if (businessType === "shareholderAddressProof") {
            const { shareholderAddressDoc, ...newData } = response?.data?.data;
            setShareholderAddressDoc(shareholderAddressDoc);
            setShareholderAddressDocFileList([...shareholderAddressDocFileList, { [shareholderKey]: [newData] }]);
          }
        }
      }).catch(() => {
        setLoading(false);
        setUploadLoading(false);
        message.error("Failed to upload file");
      }).finally(async() =>{
        setLoading(false);
        setUploadLoading(false);
        if (type == "docChanged") {
          await getKybDetails(userAlias) 
        }
      });
    } catch (error) {
      setLoading(false);
      message.error("Failed to fetch image");
    }
  };
  
  const updateShareholdersData = (
    shareholdersData: Shareholder[],
    key: string,
    value: any,
    formatDate = false
  ) => {
    
    shareholdersData[0][key] = value;
    const formattedData = shareholdersData.map((item, index) => ({
      key: (index + 1).toString(),
      label: `Shareholder ${(index + 1).toString()}`,
      beneficialOwnerDob: formatDate && item.beneficialOwnerDob ? dayjs(item.beneficialOwnerDob) : item.beneficialOwnerDob,
      docExpiryDate: item.docExpiryDate ? dayjs(item.docExpiryDate) : null,
      ...item
    }));
    
    setShareholders(formattedData);
  
    const transformedData: { [key: string]: any } = {};
    shareholdersData.forEach((shareholder, index) => {
      onTabChange((index + 1).toString());
      Object.entries(shareholder).forEach(([key, value]) => {
        if (key === "beneficialOwnerDob" || key === "companyShareholdingDateOfIncorporation") {
          transformedData[`${key}-${index + 1}`] = value != null ? dayjs.utc(value) : null;
        } else if (key === 'docExpiryDate') {
          transformedData[`${key}-${index + 1}`] = value != null ? dayjs.utc(value) : null;
        } else {
          transformedData[`${key}-${index + 1}`] = value != null ? value.toString() : null;
        }
      });
    });
  
    form.setFieldsValue(transformedData);
  };

  const getDocNationality = (shareholderKey: string) => {
    const shareholder = shareholders && shareholders?.length > 0 && shareholders?.find((elem:any )=> elem.key === shareholderKey);
    return shareholder?.beneficialOwnerDocNationality || 'PASSPORT';
  };
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const uploadShareHoldingtradeLicenseDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file,"")
      if(checkBeforeUpload == true){
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          shareHoldingTradeLicenseDoc: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState:any) =>({
          ...prevState,
          docFront:""
          }))
      return true;
      }
      else{
        setUploadLoading(false);
        setUploadError((prevState:any) =>({
          ...prevState,
          docFront:checkBeforeUpload
          }))
        return false
      }
    },

    onChange: (info: any) => {
      const { status, response } = info.file;
   
      if (status !== "uploading") {
        setUploadLoading(false);
        setDocumentData({
          ...documentData,
          shareHoldingTradeLicenseDoc: [
            {
              loading: false,
              url: "",
            },
          ],
        });
        setHaveShareHoldingtradeLicenseProof(info?.fileList?.length ? 1 : 0);
      }

      if (status === "done") {
        if (response?.statusCode === 200 || response?.status === 201) {
          setUploadLoading(false);
              setHaveShareHoldingtradeLicenseProof(1);
              setshareHoldingTradeLicenseDoc(info);
              setUploadLoading(false);
          
        } else {
          setUploadLoading(false);
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            shareHoldingTradeLicenseDoc: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        setDocumentData({
          ...documentData,
          shareHoldingTradeLicenseDoc: [
            {
              loading: false,
              url: "",
            },
          ],
        });
        setHaveShareHoldingtradeLicenseProof(0);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const uploadBtnShareHoldingtradeLicense = (
    <div>
      {(shareHoldingTradeLicenseDoc?.file?.name || typeof shareHoldingTradeLicenseDoc == 'string') && (documentData?.shareHoldingTradeLicenseDoc?.[0]?.status !== "REJECTED") ? (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}
      <div style={{ marginTop: shareHoldingTradeLicenseDoc?.file?.name || typeof shareHoldingTradeLicenseDoc == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.shareHoldingTradeLicenseDoc?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof shareHoldingTradeLicenseDoc == 'string') ? shareHoldingTradeLicenseDoc : shareHoldingTradeLicenseDoc?.file?.name ? shareHoldingTradeLicenseDoc?.file?.name : "Trade license"
          }
        </div>
      </div>
    </div>
  );

  const uploadShareHoldingMoaDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "")
      if (checkBeforeUpload == true) {
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          shareHoldingMoaDoc: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState: any) => ({
          ...prevState,
          shareHoldingMoaDoc: ""
        }))
        return true;
      }
      else {
        setUploadLoading(false);
        setUploadError((prevState: any) => ({
          ...prevState,
          shareHoldingMoaDoc: checkBeforeUpload
        }))
        return false
      }
    },
    onChange: (info: any) => {
      setUploadLoading(true);
      setDocumentData({
        ...documentData,
        shareHoldingMoaDoc: [
          {
            url: "",
            loading: true,
          },
        ],
      });
      const { status, response } = info.file;
      if (status !== "uploading") {
        setUploadLoading(false);
        setHaveShareHoldingMoaDoc(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        if (response?.statusCode === 200 || response?.status === 201) {
          setUploadLoading(false);
          setHaveShareHoldingMoaDoc(1);
          setShareHoldingMoaDoc(info);
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            shareHoldingMoaDoc: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        setHaveShareHoldingMoaDoc(0);
        setDocumentData({
          ...documentData,
          shareHoldingMoaDoc: [
            {
              loading: false,
            },
          ],
        });
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const uploadShareHolderAddressDocForCompany = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "")
      if (checkBeforeUpload == true) {
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          shareHoldingCompanyAddressDoc: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState: any) => ({
          ...prevState,
          shareHoldingCompanyAddressDoc: ""
        }))
        return true;
      }
      else {
        setUploadLoading(false);
        setUploadError((prevState: any) => ({
          ...prevState,
          shareHoldingCompanyAddressDoc: checkBeforeUpload
        }))
        return false
      }
    },
    onChange: (info: any) => {
      setUploadLoading(true);
      setDocumentData({
        ...documentData,
        shareHoldingCompanyAddressDoc: [
          {
            url: "",
            loading: true,
          },
        ],
      });
      const { status, response } = info.file;
      if (status !== "uploading") {
        setUploadLoading(false);
        setHaveShareHoldingCompanyAddressDoc(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        if (response?.statusCode === 200 || response?.status === 201) {
          setUploadLoading(false);
          setHaveShareHoldingCompanyAddressDoc(1);
          setShareHoldingCompanyAddressDoc(info);
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            shareHoldingCompanyAddressDoc: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        setHaveShareHoldingCompanyAddressDoc(0);
        setDocumentData({
          ...documentData,
          shareHoldingCompanyAddressDoc: [
            {
              loading: false,
            },
          ],
        });
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const uploadBtnShareHolderAddressDocForCompany = (
    <div>
      {(shareHoldingCompanyAddressDoc?.file?.name || typeof shareHoldingCompanyAddressDoc == 'string') && (documentData?.shareHoldingCompanyAddressDoc?.[0]?.status !== "REJECTED") ? (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}

      <div style={{ marginTop: shareHoldingCompanyAddressDoc?.file?.name || typeof shareHoldingCompanyAddressDoc == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.shareHoldingCompanyAddressDoc?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof shareHoldingCompanyAddressDoc == 'string') ? shareHoldingCompanyAddressDoc : shareHoldingCompanyAddressDoc?.file?.name ? shareHoldingCompanyAddressDoc?.file?.name : "Address proof"
          }
        </div>
      </div>
    </div>
  );

  const uploadBtnShareHoldingMoaDoc = (
    <div>
      {(shareHoldingMoaDoc?.file?.name || typeof shareHoldingMoaDoc == 'string') && (documentData?.shareHoldingMoaDoc?.[0]?.status !== "REJECTED") ? (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}

      <div style={{ marginTop: shareHoldingMoaDoc?.file?.name || typeof shareHoldingMoaDoc == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.shareHoldingMoaDoc?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof shareHoldingMoaDoc == 'string') ? shareHoldingMoaDoc : shareHoldingMoaDoc?.file?.name ? shareHoldingMoaDoc?.file?.name : "MOA document"
          }
        </div>
      </div>
    </div>
  );

  const removeDocumentForCompany = async (docType: DocumentType, id: string) => {
    const payload = {
      id,
      userAlias: userAlias,
      docType,
    };

    const addressproof = { ...documentData };
    const url = addressproof[docType]?.[0]?.url || "";

    addressproof[docType] = [{ loading: true, url: '' }];
    setDocumentData({ ...addressproof });

    try {
      const response = await deleteFile(payload);

        if (response?.status === 201 || response?.status === 200) {
          addressproof[docType] = [];
          setDocumentData(addressproof);

          switch (docType) {
            case DocumentType.ShareHoldingTradeLicenseDoc:
              setHaveShareHoldingtradeLicenseProof(0);
              setshareHoldingTradeLicenseDoc({});
              break;
            case DocumentType.ShareHoldingMoaDoc:
              setHaveShareHoldingMoaDoc(0);
              setShareHoldingMoaDoc({});
              break;
            case DocumentType.ShareHoldingOtherDoc:
              setHaveShareHoldingOtherDoc(0);
              setShareHoldingOtherDoc({});
              break;
            case DocumentType.ShareHoldingCompanyAddressDoc: 
              setHaveShareHoldingCompanyAddressDoc(0);
              setShareHoldingCompanyAddressDoc({});
              break;

            default:
              break;
          }
        }
      } catch {
        addressproof[docType] = [{ loading: false, url }];
        setDocumentData({ ...addressproof });
        message.error('Something went wrong. Please try again!');
      }
  };

  const uploadShareHoldingOtherDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "")
      if (checkBeforeUpload == true) {
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          shareHoldingOtherDoc: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState: any) => ({
          ...prevState,
          shareHoldingOtherDoc: ""
        }))
        return true;
      }
      else {
        setUploadLoading(false);
        setUploadError((prevState: any) => ({
          ...prevState,
          shareHoldingOtherDoc: checkBeforeUpload
        }))
        return false
      }
    },
    onChange: (info: any) => {
      setUploadLoading(true);
      setDocumentData({
        ...documentData,
        shareHoldingOtherDoc: [
          {
            url: "",
            loading: true,
          },
        ],
      });
      const { status, response } = info.file;
      if (status !== "uploading") {
        setUploadLoading(false);
        setHaveShareHoldingOtherDoc(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        if (response?.statusCode === 200 || response?.status === 201) {
          setUploadLoading(false);
          setHaveShareHoldingOtherDoc(1);
          setShareHoldingOtherDoc(info);
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            shareHoldingOtherDoc: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        setHaveShareHoldingOtherDoc(0);
        setDocumentData({
          ...documentData,
          shareHoldingOtherDoc: [
            {
              loading: false,
            },
          ],
        });
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const uploadBtnShareHoldingOtherDoc = (
    <div>
      {(shareHoldingOtherDoc?.file?.name || typeof shareHoldingOtherDoc == 'string') && (documentData?.shareHoldingOtherDoc?.[0]?.status !== "REJECTED") ? (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}
    
      <div style={{ marginTop: shareHoldingOtherDoc?.file?.name || typeof shareHoldingOtherDoc == 'string' ? -12 : 27 }}>
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          {(documentData?.shareHoldingOtherDoc?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof shareHoldingOtherDoc == 'string') ? shareHoldingOtherDoc : shareHoldingOtherDoc?.file?.name ? shareHoldingOtherDoc?.file?.name : "Other document"
          }
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div>
        {ENTITY_TYPE === 'company' && STEP === 4 ?
          <div>
            {(uploadLoading || loading) && (
              <div
                className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
              >
                <Spin size="large" className="mainloader"/>
              </div>
            )}
            <UserHeader step={60} />
            <div className="text-right formSubText p-5">Step 4/6</div>
            <ResponsiveSidebar step={4} />
            <div className="d-flex center_res">
              <div className="px-5 verification_sidebar">
                <div className="slidebar-step-3-block">
                  <Collapse items={items} bordered={false} />
                  <div className="step_info p-50 d-flex mb-5">
                    <Image src={InfoImg} alt="info" preview={false} className="mb-1" />
                    <div>
                      <div className="step">Tips for taking pictures</div>
                      <div className="mt-2 step4">(Size upto 5mb)</div>
                      <div className="mt-2 step4">Jpg, jpeg, png, pdf format</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 px-5-res">
                <div className="d-flex step-title">
                  <Image
                    src={LeftArrow}
                    alt="arrow"
                    preview={false}
                    className="cursor"
                    onClick={() => {
                      goBack()
                    }}
                  />
                  <div className="titleText px-3 px-md-5">Shareholders</div>
                </div>
                {fileList.length || !fileList.length ? (
                  <Form scrollToFirstError onFinish={onFinish} form={form} className="basic-info-form-block shearholder-items-block">
                    <Tabs
                      hideAdd
                      onChange={onTabChange}
                      activeKey={activeTab}
                      type="editable-card"
                      onEdit={onEdit}
                      className="custom-tabs"
                    >
                      {
                        shareholders?.length > 0 && shareholders?.map(
                          (item: any, index: number) => {
                            shareholdings += parseInt(item?.shareholdingsPercentage);

                            const isUAE = !!(item.beneficialOwnerNationality &&  item.beneficialOwnerNationality.toUpperCase() === "UNITED ARAB EMIRATES");
                            const documentType = isUAE || item.beneficialOwnerDocNationality ? item.beneficialOwnerDocNationality : 'PASSPORT';
                            
                            return (
                              <TabPane  tab={
                                <span className="shareholder_tab">
                                  {`Shareholder ${index + 1} `}
                                </span>
                                } 
                                key={item.key}
                              >
                                <div>
                                  {((representativeDetails && representativeDetails?.isCorporateShareholder == true  && representativeDetails?.representativeShare > 0 && index == 1) 
                                      ||(representativeDetails && representativeDetails?.isCorporateShareholder == true && representativeDetails?.representativeShare == 0 && index == 0)
                                    ) ? (
                                      <>
                                        <Row>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">
                                              Company name <span className="red">*</span>
                                            </div>
                                            <InputText
                                              fieldname={`CompnayName-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Enter company name!",
                                                },
                                              ]}
                                            >
                                              <Input
                                                type="text"
                                                placeholder="Enter the company name"
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <Image
                                                      src={User}
                                                      alt="CompnayName "
                                                      className="me-3"
                                                      preview={false}
                                                    />
                                                  </span>
                                                }
                                                maxLength={50}
                                                value={item[`CompnayName-${item.key}`]}
                                                onChange={e => handleTabDataChange(item.key, 'CompnayName', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">Date of incorporation<span className="red">*</span></div>
                                            <Form.Item name={`companyShareholdingDateOfIncorporation-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please select date of incorporation!",
                                                },
                                              ]}
                                            >
                                              <DatePicker
                                                format={{
                                                  format: 'DD-MM-YYYY',
                                                  type: 'mask',
                                                }}
                                                placeholder="Select date of incorporation"
                                                className="dob_step"
                                                disabledDate={(current:any)=>{
                                                  return current && current.valueOf() > Date.now()
                                                }}     
                                                onChange={(_, dateString: any) => handleTabDataChange(item.key, 'companyShareholdingDateOfIncorporation', dateString)}
                                              />
                                            </Form.Item>
                                          </div>
                                        </Row>
                                        <Row>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small">Country of incorporation <span className="red">*</span></div>
                                            <InputText
                                              fieldname={`companyShareholdingCountryOfIncorporation-${item.key}`}
                                              rules={[
                                                { required: true, 
                                                  message: "Country of incorporation is required!" ,
                                                },
                                              ]}
                                              className="mb-4"
                                            >
                                              <Select
                                                placeholder="Select country of incorporation"
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                onChange={(value:any) => handleTabDataChange(item.key, 'companyShareholdingCountryOfIncorporation', value.toString())}
                                              >
                                                {countryofIncorporationTypeList?.length > 0 && countryofIncorporationTypeList?.map((value: any) => {
                                                  return (  
                                                    <Option key={value.id} value={value.id.toString()} >{value.riskItem}</Option>
                                                  )
                                                })}
                                              </Select>
                                            </InputText>
                                          </div>

                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small">Percentage of shareholdings <span className="red">*</span></div>
                                            <InputText
                                              fieldname={`companyShareholdingsPercentage-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Shareholdings percentage is required!",
                                                },
                                                {
                                                  pattern: onlyNumberRegex,
                                                  message: "Enter valid shareholdings percentage!",
                                                },
                                                {
                                                  validator(_: any, value: string) {
                                                    if (parseFloat(value) === 0) {
                                                      return Promise.reject("Enter valid percentage percent!");
                                                    } else if (shareholdings > 100) {
                                                      return Promise.reject("Total percentage can not more than 100%");
                                                    }
                                                    else if (parseFloat(value) > 100) {
                                                      return Promise.reject("Percentage exceeds 100%");
                                                    } else {
                                                      return Promise.resolve();
                                                    }
                                                  },
                                                },
                                              ]}
                                            >
                                              <Input
                                                placeholder="of shareholdings"
                                                maxLength={6}
                                                onInput={(e: any) => {
                                                  if (e.target.value.length > 6)
                                                    e.target.value = e.target.value.slice(
                                                      0,
                                                      e.target.maxLength
                                                    );
                                                }}
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <PercentageOutlined />
                                                  </span>
                                                }
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                                    e.preventDefault();
                                                  }
                                                }}
                                                value={item[`companyShareholdingsPercentage-${item.key}`]}
                                                onChange={e => handleTabDataChange(item.key, 'companyShareholdingsPercentage', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                        </Row>
                                        <Row>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">
                                              Trade license expiration date <span className="red">*</span>
                                            </div>
                                            <Form.Item name={`docExpiryDate-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please select trade license!",
                                                },
                                              ]}
                                            >
                                              <DatePicker
                                                format={{
                                                  format: 'DD-MM-YYYY',
                                                  type: 'mask',
                                                }}
                                                placeholder="Select trade license expiry date"
                                                className="dob_step"
                                                disabledDate={(current:any) => {
                                                  return  current && current.valueOf() < Date.now();
                                                }}
                                                onChange={(_, dateString: any) => handleTabDataChange(item.key, 'docExpiryDate', dateString)}
                                              />
                                            </Form.Item>
                                          </div>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">
                                              License number <span className="red">*</span>
                                            </div>
                                            <InputText
                                              fieldname={`docNumber-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Enter document number!",
                                                },
                                              ]}
                                            >
                                              <Input
                                                type="text"
                                                placeholder="Enter the document number"
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <Image
                                                      src={Doc}
                                                      alt="DocumentNumber"
                                                      className="me-3"
                                                      preview={false}
                                                    />
                                                  </span>
                                                }
                                                maxLength={50}
                                                value={item[`docNumber`]}
                                                onChange={e => handleTabDataChange(item.key, 'docNumber', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                        </Row>
                                        <Row >
                                          <div>
                                            <Row className="mt-4">
                                              <div className="d-flex w-100">
                                                <div className="stepDetails_medium upload_address">
                                                  Trade license
                                                </div>
                                              </div>
                                            </Row>
                                            <Row className="max-w-25">
                                              <div className="d-flex doc-upload-block">
                                                <div className="upload_address doc-block">
                                                  <Upload disabled={uploadLoading} listType="picture-card" className="avatar-uploader" showUploadList={false}
                                                    maxCount={1}
                                                    accept={acceptedFileExtension}
                                                    {...uploadShareHoldingtradeLicenseDoc}
                                                    {...{
                                                      data: {
                                                        businessType: "shareHoldingTradeLicenseDoc",
                                                        type: "documents", userAlias: userAlias,
                                                      },
                                                    }}>
                                                    {uploadBtnShareHoldingtradeLicense}
                                                  </Upload>
                                                  {shareHoldingTradeLicenseDoc?.file?.name || typeof shareHoldingTradeLicenseDoc == 'string' ? (
                                                    <div className="view-delete-res-icon mt-1">
                                                      {documentData?.shareHoldingTradeLicenseDoc?.[0]?.url 
                                                      && !documentData?.shareHoldingTradeLicenseDoc?.[0]?.loading 
                                                      &&  (
                                                            documentData?.shareHoldingTradeLicenseDoc?.[0]?.url 
                                                            && documentData?.shareHoldingTradeLicenseDoc?.[0]?.url.includes(".pdf") ? (
                                                                <span className="d-flex endtoend">
                                                                  <div className="blue_text cursor" onClick={() => { handlePDFView(documentData?.shareHoldingTradeLicenseDoc?.[0]?.url) }}>
                                                                    <Image preview={false} src={Pdf} alt="view" /> <span className="px-1">View</span>
                                                                  </div>
                                                                  {
                                                                    documentData?.shareHoldingTradeLicenseDoc?.[0]?.status !==
                                                                    "VERIFIED" && (
                                                                      <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocumentForCompany(DocumentType.ShareHoldingTradeLicenseDoc,
                                                                      documentData?.shareHoldingTradeLicenseDoc?.[0]?.id)} className="cursor" />
                                                                    )
                                                                  }
                                                                </span>
                                                            ) : (
                                                              <>
                                                                <div className="d-flex endtoend">
                                                                  <div className="blue_text cursor" onClick={() => {
                                                                    handleImagePreview(documentData?.shareHoldingTradeLicenseDoc?.[0]?.url)
                                                                  }}>
                                                                    <Image preview={false} src={BlueEye} alt="view" /> <span className="px-1">View</span>
                                                                  </div>
                                                                  {documentData?.shareHoldingTradeLicenseDoc?.[0]?.status !== "VERIFIED" && (
                                                                    <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocumentForCompany(DocumentType.ShareHoldingTradeLicenseDoc,
                                                                      documentData?.shareHoldingTradeLicenseDoc?.[0]?.id)} className="cursor" />)
                                                                  }
                                                                  {documentData?.shareHoldingTradeLicenseDoc?.[0]?.status === "VERIFIED" && (
                                                                    <span className="text-green mb-2 ml-3rem">
                                                                      <CheckCircleOutlined /> Verified{" "}
                                                                    </span>
                                                                  )}
                                                                </div>
                                                              </>
                                                            )
                                                          )}
                                                          {documentData?.shareHoldingTradeLicenseDoc?.[0]?.loading && (
                                                            <Spin indicator={Loader} className="ml-20" />
                                                          )}
                                                    </div>
                                                  ) : null}

                                                  {documentData?.shareHoldingTradeLicenseDoc?.[0]?.status === "REJECTED" && (
                                                    <Tooltip title={documentData?.shareHoldingTradeLicenseDoc?.[0]?.reason}>
                                                    <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                                        Reason : {documentData?.shareHoldingTradeLicenseDoc?.[0]?.reason}
                                                      </span>
                                                    </Tooltip>
                                                  )}
                                                  {haveShareHoldingtradeLicenseProof != 1 && formTouched === true ? <div className="errMsg px-2">Trade license required!</div> : ""}
                                                  <span className="uploaderror ant-form-item-explain-error">{uploadError?.docFront}</span>
                                                </div>
                                              </div>
                                              <div>
                                              </div>
                                              </Row>
                                          </div>
                                          <div className="ml-4">
                                            <Row className="mt-4">
                                              <div className="d-flex w-100">
                                                <div className="stepDetails_medium upload_address">
                                                  MOA document
                                                </div>
                                              </div>
                                            </Row>
                                            <Row>
                                              <div className="d-flex doc-upload-block">
                                                <div className="upload_address doc-block">
                                                  <Upload
                                                    disabled={uploadLoading}
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    accept={acceptedFileExtension}
                                                    maxCount={1}
                                                    showUploadList={false}
                                                    {...uploadShareHoldingMoaDoc}
                                                    {...{
                                                      data: {
                                                        businessType: "shareHoldingMoaDoc",
                                                        type: "documents",
                                                        userAlias: userAlias,
                                                      },
                                                    }}
                                                  >
                                                    {uploadBtnShareHoldingMoaDoc}
                                                  </Upload>
                                                  {shareHoldingMoaDoc?.file?.name || typeof shareHoldingMoaDoc == 'string' ? (
                                                    <div className="view-delete-res-icon mt-1">
                                                      {documentData?.shareHoldingMoaDoc?.[0]?.url &&
                                                        !documentData?.shareHoldingMoaDoc?.[0]?.loading && (
                                                          documentData?.shareHoldingMoaDoc?.[0]?.url &&
                                                            documentData?.shareHoldingMoaDoc?.[0]?.url.includes(".pdf") ? (
                                                            <span className="d-flex endtoend px-2">
                                                              <div className="blue_text cursor" onClick={() => { handlePDFView(documentData?.shareHoldingMoaDoc?.[0]?.url) }}>
                                                                <Image
                                                                  preview={false}
                                                                  src={Pdf} alt="view"
                                                                /> <span className="px-1" >View</span>
                                                              </div>
                                                              {documentData?.shareHoldingMoaDoc?.[0]?.status !==
                                                                "VERIFIED" && (
                                                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocumentForCompany(DocumentType.ShareHoldingMoaDoc, documentData?.shareHoldingMoaDoc?.[0]?.id)} className="cursor" />
                                                                )}
                                                            </span>
                                                          ) : (
                                                            <>
                                                              <div className="d-flex endtoend">
                                                                <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.shareHoldingMoaDoc?.[0]?.url) }}>
                                                                  <Image
                                                                    preview={false}
                                                                    src={BlueEye} alt="view"
                                                                  /> <span className="px-1" >View</span>
                                                                </div>
                                                                {documentData?.shareHoldingMoaDoc?.[0]?.status !== "VERIFIED" && (
                                                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocumentForCompany(DocumentType.ShareHoldingMoaDoc, documentData?.shareHoldingMoaDoc?.[0]?.id)} className="cursor" />
                                                                )}
                                                                {documentData?.shareHoldingMoaDoc?.[0]?.status === "VERIFIED" && (
                                                                  <span className="text-green mb-2 ml-3rem">
                                                                    <CheckCircleOutlined /> Verified
                                                                  </span>
                                                                )}
                                                              </div>
                                                            </>
                                                          )
                                                        )}
                                                      {documentData?.shareHoldingMoaDoc?.[0]?.loading && (
                                                        <Spin indicator={Loader} className="ml-20" />
                                                      )}
                                                    </div>
                                                  ) : null}
                                                  <div>
                                                    {documentData?.shareHoldingMoaDoc?.[0]?.status === "REJECTED" && (
                                                      <Tooltip title={documentData?.shareHoldingMoaDoc?.[0]?.reason}>
                                                        <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                                          Reason :  {documentData?.shareHoldingMoaDoc?.[0]?.reason}
                                                        </span>
                                                      </Tooltip>
                                                    )}
                                                  </div>
                                                  <span className="uploaderror ant-form-item-explain-error">{uploadError?.shareHoldingMoaDoc}</span>
                                                  {haveShareHoldingMoaDoc != 1 && formTouched === true ? "" : ""}
                                                </div>
                                              </div>
                                            </Row>
                                          </div>
                                          <div className="ml-4">
                                            <Row className="mt-4">
                                              <div className="d-flex w-100">
                                                <div className="stepDetails_medium upload_address">
                                                  Address Proof
                                                </div>
                                              </div>
                                            </Row>
                                             <Row>
                                              <div className="d-flex doc-upload-block">
                                                <div className="upload_address doc-block">
                                                  <Upload
                                                    disabled={uploadLoading}
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    accept={acceptedFileExtension}
                                                    maxCount={1}
                                                    showUploadList={false}
                                                    {...uploadShareHolderAddressDocForCompany}
                                                    {...{
                                                      data: {
                                                        businessType: "shareHoldingCompanyAddressDoc",
                                                        type: "documents",
                                                        userAlias: userAlias,
                                                      },
                                                    }}
                                                  >
                                                    {uploadBtnShareHolderAddressDocForCompany}
                                                  </Upload>
                                                  {shareHoldingCompanyAddressDoc?.file?.name || typeof shareHoldingCompanyAddressDoc == 'string' ? (
                                                    <div className="view-delete-res-icon mt-1">
                                                      {documentData?.shareHoldingCompanyAddressDoc?.[0]?.url &&
                                                        !documentData?.shareHoldingCompanyAddressDoc?.[0]?.loading && (
                                                          documentData?.shareHoldingCompanyAddressDoc?.[0]?.url &&
                                                            documentData?.shareHoldingCompanyAddressDoc?.[0]?.url.includes(".pdf") ? (
                                                            <span className="d-flex endtoend px-2">
                                                              <div className="blue_text cursor" onClick={() => { handlePDFView(documentData?.shareHoldingCompanyAddressDoc?.[0]?.url) }}>
                                                                <Image
                                                                  preview={false}
                                                                  src={Pdf} alt="view"
                                                                /> <span className="px-1" >View</span>
                                                              </div>
                                                              {documentData?.shareHoldingCompanyAddressDoc?.[0]?.status !==
                                                                "VERIFIED" && (
                                                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocumentForCompany(DocumentType.ShareHoldingCompanyAddressDoc, documentData?.shareHoldingCompanyAddressDoc?.[0]?.id)} className="cursor" />
                                                                )}
                                                            </span>
                                                          ) : (
                                                            <>
                                                              <div className="d-flex endtoend">
                                                                <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.shareHoldingCompanyAddressDoc?.[0]?.url) }}>
                                                                  <Image
                                                                    preview={false}
                                                                    src={BlueEye} alt="view"
                                                                  /> <span className="px-1" >View</span>
                                                                </div>
                                                                {documentData?.shareHoldingCompanyAddressDoc?.[0]?.status !== "VERIFIED" && (
                                                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocumentForCompany(DocumentType.ShareHoldingCompanyAddressDoc, documentData?.shareHoldingCompanyAddressDoc?.[0]?.id)} className="cursor" />
                                                                )}
                                                                {documentData?.shareHoldingCompanyAddressDoc?.[0]?.status === "VERIFIED" && (
                                                                  <span className="text-green mb-2 ml-3rem">
                                                                    <CheckCircleOutlined /> Verified
                                                                  </span>
                                                                )}
                                                              </div>
                                                            </>
                                                          )
                                                        )}
                                                      {documentData?.shareHoldingCompanyAddressDoc?.[0]?.loading && (
                                                        <Spin indicator={Loader} className="ml-20" />
                                                      )}
                                                    </div>
                                                  ) : null}
                                                  <div>
                                                    {documentData?.shareHoldingCompanyAddressDoc?.[0]?.status === "REJECTED" && (
                                                      <Tooltip title={documentData?.shareHoldingCompanyAddressDoc?.[0]?.reason}>
                                                        <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                                          Reason :  {documentData?.shareHoldingCompanyAddressDoc?.[0]?.reason}
                                                        </span>
                                                      </Tooltip>
                                                    )}
                                                  </div>
                                                  <span className="uploaderror ant-form-item-explain-error">{uploadError?.shareHoldingCompanyAddressDoc}</span>
                                                  {haveShareHoldingCompanyAddressDoc != 1 && formTouched === true ? "" : ""}
                                                </div>
                                              </div>
                                            </Row>
                                          </div>
                                          <div className="ml-4">
                                            <Row className="mt-4">
                                              <div className="d-flex w-100">
                                                <div className="stepDetails_medium upload_address">
                                                  Other document (Optional)
                                                </div>
                                              </div>
                                            </Row>
                                            <Row>
                                              <div className="d-flex doc-upload-block">
                                                <div className="upload_address doc-block">
                                                  <Upload
                                                    disabled={uploadLoading}
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    accept={acceptedFileExtension}
                                                    maxCount={1}
                                                    showUploadList={false}
                                                    {...uploadShareHoldingOtherDoc}
                                                    {...{
                                                      data: {
                                                        businessType: "shareHoldingOtherDoc",
                                                        type: "documents",
                                                        userAlias: userAlias,
                                                      },
                                                    }}
                                                  >
                                                    {uploadBtnShareHoldingOtherDoc}
                                                  </Upload>
                                                  {shareHoldingOtherDoc?.file?.name || typeof shareHoldingOtherDoc == 'string' ? (
                                                    <div className="view-delete-res-icon mt-1">
                                                      {documentData?.shareHoldingOtherDoc?.[0]?.url &&
                                                        !documentData?.shareHoldingOtherDoc?.[0]?.loading && (
                                                          documentData?.shareHoldingOtherDoc?.[0]?.url &&
                                                            documentData?.shareHoldingOtherDoc?.[0]?.url.includes(".pdf") ? (
                                                            <span className="d-flex endtoend">
                                                              <div className="blue_text cursor" onClick={() => { handlePDFView(documentData?.shareHoldingOtherDoc?.[0]?.url) }}>
                                                                <Image
                                                                  preview={false}
                                                                  src={Pdf} alt="view"
                                                                /> <span className="px-1" >View</span>
                                                              </div>
                                                              {documentData?.shareHoldingOtherDoc?.[0]?.status !==
                                                                "VERIFIED" && (
                                                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocumentForCompany(DocumentType.ShareHoldingOtherDoc, documentData?.shareHoldingOtherDoc?.[0]?.id)} className="cursor" />
                                                                )}
                                                            </span>
                                                          ) : (
                                                            <>
                                                              <div className="d-flex endtoend">
                                                                <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.shareHoldingOtherDoc?.[0]?.url) }}>
                                                                  <Image
                                                                    preview={false}
                                                                    src={BlueEye} alt="view"
                                                                  /> <span className="px-1" >View</span>
                                                                </div>
                                                                {documentData?.shareHoldingOtherDoc?.[0]?.status !== "VERIFIED" && (
                                                                  <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocumentForCompany(DocumentType.ShareHoldingOtherDoc, documentData?.shareHoldingOtherDoc?.[0]?.id)} className="cursor" />
                                                                )}
                                                                {documentData?.shareHoldingOtherDoc?.[0]?.status === "VERIFIED" && (
                                                                  <span className="text-green mb-2 ml-3rem">
                                                                    <CheckCircleOutlined /> Verified
                                                                  </span>
                                                                )}
                                                              </div>
                                                            </>
                                                          )
                                                        )}
                                                      {documentData?.shareHoldingOtherDoc?.[0]?.loading && (
                                                        <Spin indicator={Loader} className="ml-20" />
                                                      )}
                                                    </div>
                                                  ) : null}
                                                  <div>
                                                    {documentData?.shareHoldingOtherDoc?.[0]?.status === "REJECTED" && (
                                                      <Tooltip title={documentData?.shareHoldingOtherDoc?.[0]?.reason}>
                                                        <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                                          Reason :  {documentData?.shareHoldingOtherDoc?.[0]?.reason}
                                                        </span>
                                                      </Tooltip>
                                                    )}
                                                  </div>
                                                  <span className="uploaderror ant-form-item-explain-error">{uploadError?.shareHoldingOtherDoc}</span>
                                                  {haveShareHoldingOtherDoc != 1 && formTouched === true ? "" : ""}
                                                </div>
                                              </div>
                                            </Row>
                                          </div>
                                        </Row>
                                      </>
                                    ): (
                                      <>
                                        <Row>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">
                                              First name <span className="red">*</span>
                                            </div>
                                            <InputText
                                              fieldname={`FirstName-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Enter first name!",
                                                },
                                              ]}
                                            >
                                              <Input
                                                type="text"
                                                placeholder="Enter the first name"
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <Image
                                                      src={User}
                                                      alt="FirstName"
                                                      className="me-3"
                                                      preview={false}
                                                    />
                                                  </span>
                                                }
                                                maxLength={50}
                                                value={item[`FirstName`]}
                                                onChange={e => handleTabDataChange(item.key, 'FirstName', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">
                                              Middle name
                                            </div>
                                            <InputText
                                              fieldname={`MiddleName-${item.key}`}
                                              className="inputField mb-4"
                                            >
                                              <Input
                                                type="text"
                                                placeholder="Enter the middle name"
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <Image
                                                      src={User}
                                                      alt="MiddleName"
                                                      className="me-3"
                                                      preview={false}
                                                    />
                                                  </span>
                                                }
                                                maxLength={50}
                                                value={item[`MiddleName`]}
                                                onChange={e => handleTabDataChange(item.key, 'MiddleName', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                        </Row>
                                        <Row>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">
                                              Last name <span className="red">*</span>
                                            </div>
                                            <InputText
                                              fieldname={`LastName-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Enter last name!",
                                                },
                                              ]}
                                            >
                                              <Input
                                                type="text"
                                                placeholder="Enter the last name"
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <Image
                                                      src={User}
                                                      alt="LastName"
                                                      className="me-3"
                                                      preview={false}
                                                    />
                                                  </span>
                                                }
                                                maxLength={50}
                                                value={item[`LastName`]}
                                                onChange={e => handleTabDataChange(item.key, 'LastName', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">Gender <span className="red">*</span></div>
                                            <InputText
                                              className="mb-4"
                                              fieldname={`Gender-${item.key}`}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Select gender!",
                                                },
                                              ]}
                                            >
                                              <Select
                                                className=" pl-38px before-gender-img"
                                                placeholder="Select gender"
                                                allowClear
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                value={item['Gender']}
                                                onChange={(value) => handleTabDataChange(item.key, 'Gender', value)}
                                              >
                                                <Select.Option cl value="Male">Male</Select.Option>
                                                <Select.Option value="Female">Female</Select.Option>
                                              </Select>
                                            </InputText>
                                          </div>
                                        </Row>
                                        <Row>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small"> Percentage of shareholdings <span className="red">*</span></div>
                                            <InputText
                                              fieldname={`shareholdingsPercentage-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Shareholdings percentage is required!",
                                                },
                                                {
                                                  pattern: onlyNumberRegex,
                                                  message: "Enter valid shareholdings percentage!",
                                                },
                                                {
                                                  validator(_: any, value: string) {
                                                    if (parseFloat(value) === 0) {
                                                      return Promise.reject("Enter valid percentage percent!");
                                                    } 
                                                    // else if (shareholdings > 100 || !representativeDetails?.sharedOwnership && shareholdings + representativeDetails?.representativeShare > 100) {
                                                    //   return Promise.reject("Total percentage can not more than 100%");
                                                    // }
                                                    else if (shareholdings > 100 ) {
                                                      return Promise.reject("Total percentage can not more than 100%");
                                                    }
                                                    else if (parseFloat(value) > 100) {
                                                      return Promise.reject("Percentage exceeds 100%");
                                                    } else {
                                                      return Promise.resolve();
                                                    }
                                                  },
                                                },
                                              ]}
                                            >
                                              <Input
                                                placeholder="of shareholdings"
                                                maxLength={6}
                                                onInput={(e: any) => {
                                                  if (e.target.value.length > 6)
                                                    e.target.value = e.target.value.slice(
                                                      0,
                                                      e.target.maxLength
                                                    );
                                                }}
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <PercentageOutlined />
                                                  </span>
                                                }
                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                                      e.preventDefault();
                                                  }
                                                }}
                                                value={item[`shareholdingsPercentage-${item.key}`]}
                                                onChange={e => handleTabDataChange(item.key, 'shareholdingsPercentage', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                          <div className=" w-100-res">
                                            <div className="subText_small">Designation <span className="red">*</span></div>
                                            <InputText fieldname={`designation-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Designation is required!",
                                                },
                                              ]}
                                            >
                                              <Input
                                                placeholder={"Designation"}
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <Image src={Designation} className="me-3" preview={false} />
                                                  </span>
                                                }
                                                value={item[`designation-${item.key}`]}                                    
                                                onChange={e => handleTabDataChange(item.key, 'designation', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                        </Row>
                                        <Row>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small">Date of birth <span className="red">*</span></div>
                                            <Form.Item name={`beneficialOwnerDob-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please select date of birth!",
                                                },
                                              ]}
                                            >
                                              <DatePicker
                                                format={{
                                                  format: 'DD-MM-YYYY',
                                                  type: 'mask',
                                                }}
                                                placeholder="Select date of birth"
                                                className="dob_step"
                                                disabledDate={(current:any) => {
                                                  return current > dayjs().subtract(18, "years");
                                                }}
                                                // value={dayjs(item[`beneficialOwnerDob-${item.key}`])}
                                                onChange={(_, dateString: any) => handleTabDataChange(item.key, 'beneficialOwnerDob', dateString)}
                                              />
                                            </Form.Item>
                                          </div>
                                          <div className=" w-100-res">
                                            <div className="subText_small">Nationality <span className="red">*</span></div>
                                            <InputText
                                              className="country-selection mb-4"
                                              fieldname={`beneficialOwnerNationality-${item.key}`}
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please select nationality!",
                                                },
                                              ]}
                                            >
                                              <Select
                                                className="w-100 before-country-img"
                                                placeholder="Select nationality"
                                                allowClear
                                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                showSearch
                                                optionFilterProp="children"
                                                onChange={async (value) => {
                                                  handleTabDataChange(item.key, 'beneficialOwnerNationality', value);
                                                  
                                                  if (value && value.toUpperCase() !== "UNITED ARAB EMIRATES") {
                                                    const previousVal = form.getFieldValue(`beneficialOwnerDocNationality-${item.key}`)
                                                    form.setFieldValue(`beneficialOwnerDocNationality-${item.key}`,'PASSPORT')
                                                    const shrKey = generateDynamicKey("shareholder_", item.key)
                                                    const repShrKey = generateDynamicKey("representativeShareholderId_", item.key)
                                                    if (previousVal === 'NATIONAL_ID') {
                                                      if (shrKey
                                                        && findObjectByKey(fileList, shrKey)?.[shrKey]?.[0]?.id) {
                                                        await removeDocument(shrKey, findObjectByKey(fileList, shrKey)[shrKey]?.[0]?.id);
                                                      }
                                                      if (repShrKey && findObjectByKey(representativeFileList, repShrKey)?.[repShrKey]?.[0]?.id) {
                                                        await removeDocument1(repShrKey, findObjectByKey(representativeFileList, repShrKey)[repShrKey]?.[0]?.id);
                                                      }
                                                    }
                                                    
                                                  } else {
                                                    form.setFieldValue(`beneficialOwnerDocNationality-${item.key}`,'NATIONAL_ID')
                                                  }
                                                }}
                                                
                                              >
                                                {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                                                  return (
                                                    <Option key={index} value={value.riskItem} >{value.riskItem}</Option>
                                                  )
                                                })}
                                              </Select>
                                            </InputText>
                                          </div>
                                        </Row>
                                        <Row>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">ID Expiry Date <span className="red">*</span></div>
                                            <Form.Item name={`docExpiryDate-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Please select the ID expiry date",
                                                },
                                              ]}
                                            >
                                              <DatePicker
                                                format={{
                                                  format: 'DD-MM-YYYY',
                                                  type: 'mask',
                                                }}
                                                placeholder="Select expiry date"
                                                className="dob_step"
                                                disabledDate={(current:any) => {
                                                  return  current && current.valueOf() < Date.now();
                                                }}
                                                onChange={(_, dateString: any) => handleTabDataChange(item.key, 'docExpiryDate', dateString)}
                                              />
                                            </Form.Item>
                                          </div>
                                          <div className="pr-25 w-100-res">
                                            <div className="subText_small mb-2 mt-2">
                                              ID Number <span className="red">*</span>
                                            </div>
                                            <InputText
                                              fieldname={`docNumber-${item.key}`}
                                              className="inputField mb-4"
                                              rules={[
                                                {
                                                  required: true,
                                                  message: "Enter ID number!",
                                                },
                                              ]}
                                            >
                                              <Input
                                                type="text"
                                                placeholder="Enter the ID number"
                                                prefix={
                                                  <span className="inputGlobe">
                                                    <Image
                                                      src={Doc}
                                                      alt="DocumentNumber"
                                                      className="me-3"
                                                      preview={false}
                                                    />
                                                  </span>
                                                }
                                                maxLength={50}
                                                value={item[`docNumber`]}
                                                onChange={e => handleTabDataChange(item.key, 'docNumber', e.target.value)}
                                              />
                                            </InputText>
                                          </div>
                                        </Row>
                                        <Row className="mt-4">
                                          <div className=" w-100-res">
                                            {/* <div className="subText_small">Nationality <span className="red">*</span></div> */}
                                            <InputText
                                              className="country-selection mb-4 pl-38px rm-background"
                                              fieldname={`beneficialOwnerDocNationality-${item.key}`}
                                              // rules={[
                                              //   {
                                              //     required: true,
                                              //     message: "Please select document type!",
                                              //   },
                                              // ]}
                                            >
                                              <Radio.Group
                                                onChange={async(e: any) => { handleTabDataChange(item.key, 'beneficialOwnerDocNationality', e?.target?.value)
                                                  const shrKey = generateDynamicKey("shareholder_", item.key);
                                                  const shrRepKey = generateDynamicKey("representativeShareholderId_", item.key)
                                                  if (shrKey 
                                                    && findObjectByKey(fileList, shrKey)?.[shrKey]?.[0]?.id) {
                                                    await removeDocument(shrKey, findObjectByKey(fileList, shrKey)[shrKey]?.[0]?.id);
                                                  }
                                                  if (shrRepKey && findObjectByKey(representativeFileList, shrRepKey)?.[shrRepKey]?.[0]?.id) {
                                                    await removeDocument1(shrRepKey, findObjectByKey(representativeFileList, shrRepKey)[shrRepKey]?.[0]?.id);
                                                  }
                                                }}
                                                className="d-flex"
                                                value={documentType}     
                                                options={
                                                  // isUAE || documentType === "NATIONAL_ID" ? [
                                                [    {value: 'NATIONAL_ID', label: 'National ID'},
                                                    {value: 'PASSPORT', label: 'Passport'}]
                                                  // ] : [{value: 'PASSPORT', label: 'Passport'}]
                                                }
                                              >
                                                
                                                  {/* {(basicDetails?.countryofIncorporation === 116869 || 
                                                  (!selectedNationality  || selectedNationality.toUpperCase() === "UNITED ARAB EMIRATES")) ? (
                                                    <>
                                                      <Radio value="NATIONAL_ID" className="me-4">National ID</Radio>
                                                      <Radio value="PASSPORT"  >Passport</Radio>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Radio value="PASSPORT">Passport</Radio>
                                                    </>
                                                  )} */}
                                              </Radio.Group>
                                            </InputText>
                                          </div>
                                        </Row>
                                        {(country !== "United Arab Emirates") && (
                                          <div className="card text-bg-light mb-4">
                                            <div className="card-body">
                                              <p className="subText_xs mb-0">
                                                All company representatives, owners, 
                                                and shareholders must upload attested passports.
                                                The identification documentation provided should be certified as a true copy of 
                                                the original document by any one of the following: a) registered lawyer, b) registered notary, 
                                                c) chartered accountant, d) government ministry, e) post office, f) police officer or g) an embassy or consulate.
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                        <Row className="gap-4">
                                          <div className="shareholder-doc">
                                            <div className="d-flex flex-wrap gap-4">
                                              <div>
                                                <Row>
                                                  <div className="d-flex w-100 mb-2">
                                                    <div className="stepDetails_medium upload_address">
                                                    {DOCUMENT_TYPE[item?.beneficialOwnerDocNationality?item?.beneficialOwnerDocNationality:"PASSPORT"] +" front"} 
                                                    </div>
                                                  </div>
                                                </Row>
                                                <Upload
                                                  beforeUpload={(file:any)=>{beforeUploadFront(file,index)}}
                                                  onChange={(info: any) => {handleFileUploadChange(info, `shareholder_${item.key}`)}}
                                                  customRequest={(file: any) =>{handleFileUpload(file, `shareholder_${item.key}`)}}
                                                  fileList={[]}
                                                  listType="picture-card"
                                                  className="avatar-uploader"
                                                  accept={acceptedFileExtension}
                                                >
                                                  {uploadButton(generateDynamicKey("shareholder_", item.key))}
                                                </Upload>

                                          
                                                {fileList?.length > 0 && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key)) ? (
                                                  <div>
                                                    {fileList?.length > 0 && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key)) && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.url && !findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.loading && (
                                                      findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.url && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.url.includes(".pdf") ? (
                                                        <span className="d-flex endtoend p-1">
                                                          <div className="blue_text cursor" onClick={() => handlePDFView(findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.url)}>
                                                            <Image preview={false} src={Pdf} alt="view" />
                                                            <span className="px-1">View</span>
                                                          </div>
                                                          {fileList?.length > 0 && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.status !== "VERIFIED" && (
                                                            <Image
                                                              src={Delete}
                                                              alt="Delete"
                                                              preview={false}
                                                              onClick={() => removeDocument(generateDynamicKey("shareholder_", item.key), findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.id)}
                                                              className="cursor"
                                                            />
                                                          )}
                                                        </span>
                                                      ) : (
                                                        <div className="d-flex endtoend p-1">
                                                          <div className="blue_text cursor" onClick={() => handleImagePreview(findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.url)}>
                                                            <Image preview={false} src={BlueEye} alt="view" />
                                                            <span className="px-1">View</span>
                                                          </div>
                                                          {fileList?.length > 0 && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.status !== "VERIFIED" && (
                                                            <Image
                                                              src={Delete}
                                                              alt="Delete"
                                                              preview={false}
                                                              onClick={() => removeDocument(generateDynamicKey("shareholder_", item.key), findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.id)}
                                                              className="cursor"
                                                            />
                                                          )}
                                                          {fileList?.length > 0 && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.status === "VERIFIED" && (
                                                            <span className="text-green mb-2 ml-3rem">
                                                              <CheckCircleOutlined /> Verified
                                                            </span>
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                    {fileList?.length > 0 && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.loading && (
                                                      <Spin indicator={Loader} className="ml-20" />
                                                    )}
                                                  </div>
                                                ) : null}

                                                {fileList?.length > 0 && findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))&&findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.status === "REJECTED" && (
                                                  <Tooltip title={findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.reason}>
                                                    <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                                      Reason: {findObjectByKey(fileList, generateDynamicKey("shareholder_", item.key))[generateDynamicKey("shareholder_", item.key)]?.[0]?.reason}
                                                    </span>
                                                  </Tooltip>
                                                )}

                                                {fileList?.length === 0 && formTouched === true && (
                                                  <div className="errMsg px-2">Emirates Id front required!</div>
                                                )}
                                                <span className="uploaderror ant-form-item-explain-error">{uploadError?.[index]?.emiratesFront}</span>
                                              </div>

                                              <div>
                                                <Row>
                                                  <div className="d-flex w-100 mb-2">
                                                    <div className="stepDetails_medium upload_address">
                                                    {DOCUMENT_TYPE[item?.beneficialOwnerDocNationality?item?.beneficialOwnerDocNationality:"PASSPORT"] +" back"} 
                                                    </div>
                                                  </div>
                                                </Row> 
                                                <Upload
                                                  beforeUpload={(file:any)=>{beforeUploadBack(file,index)}}
                                                  onChange={(info: any) => { handleFileUploadChange1(info, `representativeShareholderId_${item.key}`) }}
                                                  customRequest={(file: any) => { handleFileUpload1(file, `representativeShareholderId_${item.key}`) }}
                                                  fileList={representativeFileList}
                                                  listType="picture-card"
                                                  className="avatar-uploader"
                                                  accept={acceptedFileExtension}
                                                >
                                                  {uploadButton1(generateDynamicKey("representativeShareholderId_", item.key))}
                                                </Upload>
                                                {representativeFileList?.length > 0 && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key)) ? (
                                                  <div>
                                                    {
                                                      representativeFileList?.length > 0 
                                                      && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key)) 
                                                      && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.url 
                                                      && !findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.loading 
                                                      && (
                                                        findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.url && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.url.includes(".pdf") ? (
                                                          <span className="d-flex endtoend p-1">
                                                            <div className="blue_text cursor" onClick={() => handlePDFView(findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.url)}>
                                                              <Image preview={false} src={Pdf} alt="view" />
                                                              <span className="px-1">View</span>
                                                            </div>
                                                            {representativeFileList?.length > 0 && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.status !== "VERIFIED" && (
                                                              <Image
                                                                src={Delete}
                                                                alt="Delete"
                                                                preview={false}
                                                                onClick={() => removeDocument1(generateDynamicKey("representativeShareholderId_", item.key), findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.id)}
                                                                className="cursor"
                                                              />
                                                            )}
                                                          </span>
                                                        ) : (
                                                          <div className="d-flex endtoend p-1">
                                                            <div className="blue_text cursor" onClick={() => handleImagePreview(findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.url)}>
                                                              <Image preview={false} src={BlueEye} alt="view" />
                                                              <span className="px-1">View</span>
                                                            </div>
                                                            {representativeFileList?.length > 0 && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.status !== "VERIFIED" && (
                                                              <Image
                                                                src={Delete}
                                                                alt="Delete"
                                                                preview={false}
                                                                onClick={() => removeDocument1(generateDynamicKey("representativeShareholderId_", item.key), findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.id)}
                                                                className="cursor"
                                                              />
                                                            )}
                                                            {representativeFileList?.length > 0 && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.status === "VERIFIED" && (
                                                              <span className="text-green mb-2 ml-3rem">
                                                                <CheckCircleOutlined /> Verified
                                                              </span>
                                                            )}
                                                          </div>
                                                        )
                                                      )
                                                    }
                                                    {representativeFileList?.length > 0 && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.loading && (
                                                      <Spin indicator={Loader} className="ml-20" />
                                                    )}
                                                  </div>
                                                  ) : null
                                                }

                                                {representativeFileList?.length > 0 && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key)) && findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.status === "REJECTED" && (
                                                  <Tooltip title={findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.reason}>
                                                    <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                                      Reason: {findObjectByKey(representativeFileList, generateDynamicKey("representativeShareholderId_", item.key))[generateDynamicKey("representativeShareholderId_", item.key)]?.[0]?.reason}
                                                    </span>
                                                  </Tooltip>
                                                )}
                                                    {representativeFileList?.length === 0 && formTouched === true && (
                                                  <div className="errMsg px-2">Emirates Id back required!</div>
                                                )}
                                                <span className="uploaderror ant-form-item-explain-error">{uploadError?.[index]?.emiratesBack}</span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="shareholder-doc">
                                            <div className="d-flex flex-wrap gap-4">
                                              <div>
                                                <Row>
                                                  <div className="d-flex w-100 mb-2">
                                                    <div className="stepDetails_medium upload_address">
                                                      Address Proof
                                                    </div>
                                                  </div>
                                                </Row>
                                                <Upload
                                                  beforeUpload={(file: any) => beforeUploadFile(file, "")}
                                                  onChange={(info: any) => handleAddressProofUploadChange(info, `addressProof_${item.key}`)}
                                                  customRequest={(file: any) => handleFileUpload(file, `addressProof_${item.key}`,"shareholderAddressProof")}
                                                  fileList={[]}
                                                  listType="picture-card"
                                                  className="avatar-uploader"
                                                  accept={acceptedFileExtension}
                                                >
                                                  {uploadAddressProofButton(generateDynamicKey("addressProof_", item.key))}
                                                </Upload>

                                                  {shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key)) ? (
                                                  <div>
                                                    {shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key)) && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.url && !findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.loading && (
                                                      findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.url && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.url.includes(".pdf") ? (
                                                        <span className="d-flex endtoend p-1">
                                                          <div className="blue_text cursor" onClick={() => handlePDFView(findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.url)}>
                                                            <Image preview={false} src={Pdf} alt="view" />
                                                            <span className="px-1">View</span>
                                                          </div>
                                                          {shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.status !== "VERIFIED" && (
                                                            <Image
                                                              src={Delete}
                                                              alt="Delete"
                                                              preview={false}
                                                              onClick={() => removeAddressProofDocument(generateDynamicKey("addressProof_", item.key), findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.id)}
                                                              className="cursor"
                                                            />
                                                          )}
                                                        </span>
                                                      ) : (
                                                        <div className="d-flex endtoend p-1">
                                                          <div className="blue_text cursor" onClick={() => handleImagePreview(findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.url)}>
                                                            <Image preview={false} src={BlueEye} alt="view" />
                                                            <span className="px-1">View</span>
                                                          </div>
                                                          {shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.status !== "VERIFIED" && (
                                                            <Image
                                                              src={Delete}
                                                              alt="Delete"
                                                              preview={false}
                                                              onClick={() => removeAddressProofDocument(generateDynamicKey("addressProof_", item.key), findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.id)}
                                                              className="cursor"
                                                            />
                                                          )}
                                                          {shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.status === "VERIFIED" && (
                                                            <span className="text-green mb-2 ml-3rem">
                                                              <CheckCircleOutlined /> Verified
                                                            </span>
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                    {shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.loading && (
                                                      <Spin indicator={Loader} className="ml-20" />
                                                    )}
                                                  </div>
                                                ) : null}

                                                {shareholderAddressDocFileList?.length > 0 && findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))&&findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.status === "REJECTED" && (
                                                  <Tooltip title={findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.reason}>
                                                    <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                                      Reason: {findObjectByKey(shareholderAddressDocFileList, generateDynamicKey("addressProof_", item.key))[generateDynamicKey("addressProof_", item.key)]?.[0]?.reason}
                                                    </span>
                                                  </Tooltip>
                                                )}

                                                {fileList?.length === 0 && formTouched === true && (
                                                  <div className="errMsg px-2">Emirates Id front required!</div>
                                                )}
                                                <span className="uploaderror ant-form-item-explain-error">{uploadError?.[index]?.emiratesFront}</span>
                                              </div>
                                            </div>
                                          </div>
                                        </Row>
                                      </>
                                    )
                                  }
                                </div>
                              </TabPane>
                            )
                          }
                        )
                      }
                    </Tabs>
                    <Row className="center_res">
                      <div className="d-flex step-control-btn">
                        {(
                          fileList?.length > 0 && 
                          representativeFileList?.length > 0 && 
                          shareholderAddressDocFileList?.length > 0 && 
                          (
                            ( 
                              representativeDetails?.isCorporateShareholder === false
                              && fileList?.length >= shareholders?.length
                              && representativeFileList?.length >= shareholders?.length 
                              && shareholderAddressDocFileList?.length>= shareholders?.length 
                            ) || 
                            (
                              representativeDetails?.isCorporateShareholder === true
                              && (fileList?.length + haveShareHoldingtradeLicenseProof) >= shareholders?.length
                              && (representativeFileList?.length + haveShareHoldingMoaDoc ) >= shareholders?.length
                              && (shareholderAddressDocFileList?.length + haveShareHoldingCompanyAddressDoc ) >= shareholders?.length
                            )
                          )
                        ) ? (
                          <Button  htmlType="submit" loading={loading}
                            onClick={() => { setformTouched(true); }}
                            disabled={!isValid}
                            className={isValid ?"rounded":"rounded disabled" }
                          >
                            {uploadLoading ? "Please wait..." : "Save & Next"}
                          </Button>
                        ) : (representativeDetails?.companyShareholdingPercentage == 100 && representativeDetails?.representativeShare == 0 && haveShareHoldingMoaDoc == 1 && haveShareHoldingtradeLicenseProof == 1 && haveShareHoldingCompanyAddressDoc == 1) ?
                          (
                            <Button htmlType="submit" loading={loading || uploadLoading}
                              onClick={() => { setformTouched(true) }}
                              disabled={!isValid}
                              className={isValid ?"rounded":"rounded disabled" }
                            >
                              {uploadLoading ? "Please wait..." : "Save & Next"}
                            </Button>
                          ) : (
                            <Button className="rounded disabled" htmlType="submit" loading={loading || uploadLoading}
                              onClick={() => { setformTouched(true) }}
                              disabled={true}
                            >
                              {uploadLoading ? "Please wait..." : "Save & Next"}
                            </Button>
                          )
                        }                      
                        <Button className="cancel-outline-btn mx-4" onClick={handleCancel}>Reset</Button>                      
                        {/* <Button disabled={(shareholdings >= 100 || !representativeDetails?.sharedOwnership && shareholdings + representativeDetails?.representativeShare >= 100)  && true} className={(shareholdings >= 100) || (!representativeDetails?.sharedOwnership && shareholdings + representativeDetails?.representativeShare >= 100) ? "rounded disabled": "rounded"} htmlType="button" onClick={addTab}>
                          <PlusOutlined />Add More Owner
                        </Button> */}
                      
                        <Button
                          disabled={(totalShareholdingsPercentage != 100 ) ? false : true}
                          className={(totalShareholdingsPercentage != 100) ? "rounded " : "rounded disabled"}
                          htmlType="button" onClick={addTab}>
                          <PlusOutlined />Add More Owner
                        </Button>
                      </div>
                    </Row>
                  </Form>
                ) : null}
              </div>
            </div>
          </div> : ""
        }
      </div>
      {/** Image Preview Modal */}
      <ImagePreviewModal
        imagePreviewModal={imagePreviewModal}
        setImagePreviewModal={setImagePreviewModal}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
      {/** Pdf Preview Modal */}
      <PdfPreviewModal
        isverifyVisible={isverifyVisible}
        setverifyVisible={setverifyVisible}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
    </>
  );
};

export default CompanyStep4;
