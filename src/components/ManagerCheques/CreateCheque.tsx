import {
  Breadcrumb,
  Col,
  Form,
  Row,
  Image,
  Card,
  Button,
  Spin,
  Tooltip,
  Input,
  Modal,
  Select,
  Radio,
  message,
  RadioChangeEvent,
  Checkbox
} from "antd";
import {  NormalText, SmallText } from "../ui-elements/TextRepo";
import {
  SecondaryOutLineButton,
  ViewButton,
} from "../ui-elements/ButtonRepo";
import { useEffect, useState } from "react";
import infoIcon from "../../assets/img/informIcon.svg"

// import Create from "../../assets/img/createEscrow.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllCountries, getlocalBankDetails, getWalletTotalAmountAndCount} from "../../services/user";
import { AuthTitle } from "../ui-elements/TextRepo";
import {  AuthUserTypes, DateWithUtcOffset, MC_TYPE, PLATFORM_CHARGE_APPLIED_ON, TRANSACTION_TYPE, USER_TYPE_TEXT, alphanumericRegex, getLocalStorage, modifyCresetUserType } from "../Common/Constants";
import { getRSCategoryByItemAlias, getRSTypeByCatAlias, getUserData, getUserPlatformFees } from "../../services/admin";
import { Cheques, EscrowTermsandCondition, SpecialTermsAndCondition, SuccessTxn } from "../Common/RouteConst"; 
// import TransactionDetails from "./NewTransaction/TransactionDetails"; 
import CustomContract from "./CustomContract";

import DefaultLayout from "../Common/DefaultLayout";

// import ViewSecondary from "../../assets/img/View_secondary.svg";
import ChequePreview from "./ChequePreview";
import SellerDetail from "./SellerDetail"; 
import { createCheque, createReceiveFund, getChequeDetails, getTxnData } from "../../services/cheque";
import RequestPaymentDetails from "../ManagerCheques/RequestPaymentDetails";
import ChequeCard from "./ChequeCard";
import Signature from "./Signature";
import managercheque from "../../assets/img/managerchequeGray.svg" 
import SourceOfFunds from "../User/NewTransaction/SourceOfFunds";
import { calculateUserPlatformFee } from "../Common/InvoiceCalculations";
import PoaDetailsForm from "./PoaDetailsForm";

import AddBankAccountModal from "../User/AddBankAccountModal";
import MCBankAccount from "./MCBankAccount";

type EntityType = "INDIVIDUAL" | "COMPANY";
type CustomerType = "I" | "C";

const CreateCheque = (): JSX.Element => {
  const [formValues, setFormValues] = useState<any>({
    transactionType : MC_TYPE.REQUEST,
    userType: USER_TYPE_TEXT.BUYER,
    poaUserType: USER_TYPE_TEXT.BUYER,
  });
  
  const [buttonStatus, setButtonStatus] = useState("");
  
  const [countryPhone, setCountryPhone] = useState(0);
  const [userExists, setUserExists] = useState(false);
  const [countryError, setCountryError] = useState({ status: false });
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false); 
  
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [doneSubmit, setdoneSubmit] = useState(false);
  const [customField, setCustomField] = useState([]);
  const [customAttach, setCustomAttach] = useState<any>();
  const [customAttachmentIds, setCustomAttachmentIds] = useState<any>([]);
  const [customAttachUrl, setCustomAttachUrl] = useState<any>("");
  const [customAttachmentUrls, setCustomAttachmentUrls] = useState<any>([]); 

  const [error, setError] = useState({ status: false, message: "" });
  
  const navigate = useNavigate();
  const local = getLocalStorage("auth");
  const userData = local ? JSON.parse(local) : null;
  
  const userAlias = userData ? userData?.userAlias : "";
  const userType = userData ? userData?.userType : "";
  const entityType = userData ? userData?.entityType : "";
  const UserAlias = JSON.parse(getLocalStorage("auth")!); 
  const [previewValue,setPreviewValue] = useState<any>({})
  const [bankDetails,setBankDetails] = useState({})
  const [counterDetails,setCounterDetails] = useState<any>({})
  const [partyDetails,setPartyDetails] = useState<any>({})
  const [form] = Form.useForm();
  const [buttonText,setButtonText] = useState(''); 
  const [sellerCountryError,setSellerCountryError] = useState({ status: false });
  const [callingCode, setCallingCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [itemType, setItemType] = useState(null);
  const [itemdetails, setItemdetails] = useState({});
  const [, setdidsubmit] = useState<any>("DEFAULT");
  const [counterParty, setCounterParty] = useState<any>("Seller"); 
  const [, setErrorMsg] = useState(false);
  const [category, setCategory] = useState(null); 
  const [rsCatList, setRsCatList] = useState([]);
  const [rsItemList, setRsItemList] = useState([]);
  const [minimumValue, setMinimumValue] = useState<any>();
  // const [inputFields, setInputFields] = useState([]);
  const [taxDetails, setTaxDetails] = useState<any>();
  const [splitOption, setSplitOption] = useState(false);
  const [, setPlatformCharge] = useState(0);
  const [, setBuyerAmount] = useState({});
  const [invoiceCalculations,setInvoiceCalculations] = useState<any>();
  const [buyerCountry, setBuyerCountry] = useState<null | string>(null);
  const [counterCountry, setCounterCountry] = useState<null | string>(null);
  const [currency, setCurrency] = useState<string>("AED");
  const [isSellerRegistered, setIsSellerRegistered] = useState(false);
  const [searchCounterDetails, setSearchCounterDetails] = useState<any>(); 
  const [Width, setWidth] = useState(document?.body?.clientWidth);

  const [fileList2, setFileList2] = useState<any[]>([]); 
  const [isSellerExist, setSellerExist] = useState<boolean>(false);
  const [sellerDocCheck, isSellerDocCheck] = useState<boolean>(false);
  const [preparedCheques, setPreparedCheques] = useState([]);
  const [walletAmountAndCount, setWalletAmountAndCount] = useState<any>();
  const [sourceOfFundIds, setSourceOfFundIds] = useState<any>([]);
  const [sourceOfFundUrls, setSourceOfFundUrls] = useState<any>([]);  

  const [signature, setSignature] = useState("");
  const [signatureId, setSignatureId] = useState<any>(""); 

  const { Option } = Select;
  const { chequeAlias} = useParams();
  const location = useLocation()
  const value =location?.state?.value
  const [isDraft, setIsDraft] = useState(false);

  const [chequeDetails, setChequeDetails] = useState<any>();
  const [globalRemainingAmount, setGlobalRemainingAmount] = useState<number>(0);

  const [nationalityCallingCode, setNationalitytCallingCode] = useState('');
  const [nationalityIsoCode, setNationalityIsoCode] = useState("");
  const [counterNationality, setCounterNationality] = useState<null | string>(null);

  // Buyer / Party POA
const [partyPoaCountry, setPartyPoaCountry] = useState<string>("");
const [partyPoaCountryCode, setPartyPoaCountryCode] = useState<string>(""); 
const [partyPoaNationality, setPartyPoaNationality] = useState<string>("");
const [partyPoaNationalityCallingCode, setPartyPoaNationalityCallingCode] = useState<string>("");
const [partyUserExists, setPartyUserExists] = useState<boolean>(false);
const [partyPoaAlias, setPartyPoaAlias] = useState<string>("");
const [partyPoaDocuments, setPartyPoaDocuments] = useState<any[]>([]);
const [isPartyPoa, setIsPartyPoa] =  useState<boolean>(false);
const [partyPoaDocCheck, setPartyPoaDocCheck] = useState<boolean>(false);
const [partyPoaResidenceStatusTypeId, setPartyPoaResidenceStatusTypeId] = useState<number | any>(null);
const [partyPoaBusinessNatureTypeId, setPartyPoaBusinessNatureTypeId] = useState<number | any>(null);
const [partyPoaCountryofIncorporationTypeId, setPartyPoaCountryofIncorporationTypeId] = useState<number | any>(null);
const [partyPoaProfessionTypeId, setPartyPoaProfessionTypeId] = useState<number | any>(null);
const [partyPoaDob, setPartyPoaDob] = useState<any>();
// const [partyPoaOnboarded, setPartyPoaOnboarded] = useState<boolean>(false);
// Seller / Counter POA
const [counterPoaCountry, setCounterPoaCountry] = useState<string>("");
const [counterPoaCountryCode, setCounterPoaCountryCode] = useState<string>("");
const [counterPoaNationality, setCounterPoaNationality] = useState<string>("");
const [counterPoaNationalityCallingCode, setCounterPoaNationalityCallingCode] = useState<string>("");
const [counterUserExists, setCounterUserExists] = useState<boolean>(false);
const [counterPoaAlias, setCounterPoaAlias] = useState<string>("");
const [counterPoaDocuments, setCounterPoaDocuments] = useState<any[]>([]); 
const [isCounterPoa, setIsCounterPoa] =  useState<boolean>(false);
const [counterPoaDocCheck, setCounterPoaDocCheck] = useState<boolean>(false);
// const [counterPoaOnboarded, setCounterPoaOnboarded] = useState<boolean>(false);
const [counterPoaResidenceStatusTypeId, setCounterPoaResidenceStatusTypeId] = useState<number | any>(null);
const [counterPoaBusinessNatureTypeId, setCounterPoaBusinessNatureTypeId] = useState<number | any>(null);
const [counterPoaCountryofIncorporationTypeId, setCounterPoaCountryofIncorporationTypeId] = useState<number | any>(null);
const [counterPoaProfessionTypeId, setCounterPoaProfessionTypeId] = useState<number | any>(null);
const [counterPoaDob, setCounterPoaDob] = useState<any>();

const [isPartyBroker, setIsPartyBroker] =  useState<boolean>(false);
const [isCounterBroker, setIsCounterBroker] =  useState<boolean>(false);
const [sellerAlias, setSellerAlias] = useState<string>("");
const [openAddBankAccountModal, setOpenAddBankAccountModal] = useState<any>(false);
const [payoutAccount, setPayoutAccount] = useState<any>(null);
const [bankAccountList, setBankAccountList] = useState<any>([]);
const [countryList, setCountryList] = useState<any[]>([]);
  
  

    // const [fatfList, setFatfList] = useState([]);
    // const [fatfTypeId, setFatfTypeId] = useState(0);
    const [professionTypeId, setProfessionTypeId] = useState(null) 
    const [professionTypeList, setProfessionTypeList] = useState([])
    const [residenceStatusTypeId, setResidenceStatusTypeId] = useState(null);
    const [residenceStatusList, setResidenceStatusList] = useState([]);
    const [businessNatureTypeId, setBusinessNatureTypeId] = useState([]);
    const [businessNatureList, setBusinessNatureList] = useState([]);
    const [countryofIncorporationTypeId, setCountryofIncorporationTypeId] = useState(null); 
    const [incoporationCountryList, setIncoporationCountryList] = useState([]);
    const [selectedDate, setSelectedDate] = useState<any>();


  const setWidthVal = () => {
    setWidth(document.body.clientWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthVal();
    });
    return () => window.removeEventListener("resize", setWidthVal);
  }, []);

  useEffect(() => {
     
    setLoadingPage(true);
    totalAmountAndCount();
    getAllCountries()
      .then((response: any) => {
        const countryArr: any = (response?.data ?? [])
          .filter((c: any) => !!c?.isoCode && !!c?.name) // remove invalid entries
          .map((c: any): any => ({
            name: c?.name?.trim() ?? "",
            isoCode: c?.isoCode?.trim()?.toUpperCase() ?? "",
            callingCode: c?.callingCode?.trim() ?? "",
            symbol: c?.symbol?.trim()?.toUpperCase() ?? "",
          }));
        setCountryList(countryArr)
        getUserData(UserAlias?.email)
          .then((res: any) => {
            const countryName = response?.data.filter(
              (country: any) => country.isoCode === res?.data?.countryAlias
            )[0].name;
            setBuyerCountry(countryName);
          });
      });

       getlocalBankDetails(userAlias)
          .then((response) => {
            setBankAccountList(response.data.bankDetails);
            const primaryAccount = response.data.bankDetails?.find((account: any) => account.isPrimary);
            form.setFieldsValue({
              payout_account: primaryAccount?.aliasName,
            });
            setPayoutAccount(primaryAccount);
          })
          .catch(() => {
            message.error("Could not fetch details. Please try again later!");
          });
 
      
    getRSCategoryByItemAlias(entityType)
                  .then((responseData: any) => {   
                    const list = responseData.data;
              
                    if(list.length){ 
                      setRsCatList(list);
                      if (chequeAlias && value !== "draft") {
                        
                        getTxnData(chequeAlias)
                          .then((response: any) => {
                             
                            const transaction = response.data; 
                            const data = list.find((item :any)=> item.aliasName == transaction?.itemCategoryAlias);
                            setCategory(data);
                            
                            
                            const rctype = transaction?.itemCategoryAlias;
                            getRSTypeByCatAlias(rctype)
                              .then(async (response: any) => {
                                const ItemList = response.data;
                                const rcType = ItemList.find((item: any) => item.aliasName == transaction?.itemTypeAlias);
                                setRsItemList(ItemList);
                                setItemType(rcType)
                            const [userPlatformCharge, sellerPlatformCharge]:any = await Promise.all([
            getUserPlatformFees(userAlias, TRANSACTION_TYPE.MC),
            sellerAlias ? getUserPlatformFees(sellerAlias, TRANSACTION_TYPE.MC) : Promise.resolve({}),
          ]);

                                let taxDetailsObj: any = {
                                  platformChargeType: rcType?.platformChargeType,
                                  platformFees: rcType?.plateformFees,
                                  vatCharges: rcType?.vatCharges,
                                  minimumPlatformFee: rcType?.minimumPlatformCharge,
                                  platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.DEFAULT
                                };
                                if (userPlatformCharge?.status === 200 && userPlatformCharge?.data && sellerPlatformCharge?.status === 200 && sellerPlatformCharge?.data) {
                                  const invoiceAmount = form.getFieldValue("invoiceAmount");
                                  const buyerAmount = calculateUserPlatformFee(userPlatformCharge?.data, invoiceAmount);
                                  const sellerAmount = calculateUserPlatformFee(sellerPlatformCharge?.data, invoiceAmount);
                                  if (buyerAmount >= sellerAmount && userPlatformCharge) {
                                    taxDetailsObj = {
                                      ...taxDetailsObj,
                                      platformChargeType: userPlatformCharge.data.platformChargeType,
                                      platformFees: userPlatformCharge.data.platformFees
                                        ? Number(userPlatformCharge.data.platformFees)
                                        : taxDetailsObj.platformFees,
                                      platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
                                    };
                                  } else {
                                    taxDetailsObj = {
                                      ...taxDetailsObj,
                                      platformChargeType: sellerPlatformCharge.data.platformChargeType,
                                      platformFees: sellerPlatformCharge.data.platformFees
                                        ? Number(sellerPlatformCharge.data.platformFees)
                                        : taxDetailsObj.platformFees,
                                      platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
                                    };
                                  }
                                } else if (sellerPlatformCharge?.status === 200 && sellerPlatformCharge?.data) {
                                  taxDetailsObj = {
                                    ...taxDetailsObj,
                                    platformChargeType: sellerPlatformCharge?.data?.platformChargeType,
                                    platformFees: sellerPlatformCharge?.data?.platformFees
                                      ? Number(sellerPlatformCharge?.data?.platformFees)
                                      : taxDetailsObj.platformFees,
                                    platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
                                  };
                                } else if (userPlatformCharge?.status === 200 && userPlatformCharge?.data) {
                                  taxDetailsObj = {
                                    ...taxDetailsObj,
                                    platformChargeType: userPlatformCharge.data.platformChargeType,
                                    platformFees: userPlatformCharge.data.platformFees
                                      ? Number(userPlatformCharge.data.platformFees)
                                      : taxDetailsObj.platformFees,
                                    platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
                                  };
                                }
                                setTaxDetails({
                                  platformChargeType: taxDetailsObj?.platformChargeType,
                                  plateformFees: taxDetailsObj?.platformFees,
                                  vatCharges: taxDetailsObj?.vatCharges,
                                  minimumPlatformFee: taxDetailsObj?.minimumPlatformFee,
                                  platformChargeAppliedOn: taxDetailsObj?.platformChargeAppliedOn
                                });

                              });

                              getChequeDetails(chequeAlias, userAlias)
                              .then((resp) => {
                                
                                const chequeDetail = resp.data;
                                
                                
                                const transactionType = chequeDetail.transactionType === "RECEIVE" ? "RECEIVE" :  "REQUEST";
                                setSellerAlias(chequeDetail?.sellerAlias)
                                setItemdetails({
                                  itemCategory : chequeDetail?.itemCategoryName,
                                  itemType : chequeDetail?.itemTypeName,
                                  itemName : chequeDetail?.itemName,
                                  description : chequeDetail?.description
                                 })
                                
                                setSignature(chequeDetail?.fromSignDetails?.url);
                                setSignatureId(chequeDetail?.fromSign);

                                
                                setChequeDetails(chequeDetail);
                                setPartyDetails({
                                  name: chequeDetail?.fromDetails?.name || chequeDetail?.userName || "",
                                  email: chequeDetail?.fromDetails?.email || chequeDetail?.userEmail || "",
                                  countryAlias: chequeDetail?.buyerCountry || "",
                                  kycNationality: chequeDetail?.buyerNationality || chequeDetail?.buyerCountry || null,
                                  nationalityName: countryList?.find(
                                    (c: any) => c.isoCode === chequeDetail?.buyerNationality
                                  )?.name || chequeDetail?.buyerCountry || null,
                                  entityType:chequeDetail?.fromDetails?.entityType || chequeDetail?.countertypeOfEntity
                                });

                                setCounterDetails({
                                  name: chequeDetail?.toDetails?.name || chequeDetail?.counterContactName || "",
                                  email: chequeDetail?.toDetails?.email || chequeDetail?.counterContactEmail || "",
                                  countryAlias: countryList?.find(
                                    (c: any) => c.isoCode === chequeDetail?.counterCountry
                                  )?.name || chequeDetail?.counterCountry || "",
                                  kycNationality: chequeDetail?.counterNationality || null,
                                  nationalityName: countryList?.find(
                                    (c: any) => c.isoCode === chequeDetail?.counterNationality
                                  )?.name || null,
                                  entityType:chequeDetail?.toDetails?.entityType || userData?.entityType
                                });
                                setIsPartyPoa(chequeDetail?.isPartyPoa)
                                setIsCounterPoa(chequeDetail?.isCounterPoa)
                                const sofUrls = chequeDetail.sourceOfFunds && chequeDetail.sourceOfFunds.map((item: { url: any; }) => item.url);
                                setSourceOfFundUrls(sofUrls || []);
                                setSourceOfFundIds(chequeDetail?.sourceoffunds||[])
                                  if (["0","1","12"].includes(chequeDetail?.chequeStatus)) {
                                      setItemType(response?.data?.itemTypeAlias);
                                      setCategory(response?.data?.itemCategoryAlias);
                                      form.setFieldsValue({
                                        itemTypeAlias: response?.data?.itemTypeAlias,
                                        itemCategoryAlias: response?.data?.itemCategoryAlias,
                                        contractStartedBy : chequeDetail?.contractStartedBy
                                      });
                                   
                                      
                                      
                                    if (Number(chequeDetail?.buyerFeesPercent) < 100 && transactionType != "RECEIVE") {
                                      form.setFieldsValue({
                                        splitOption: "YES",
                                        buyerPercent: chequeDetail?.buyerFeesPercent,
                                        otherPercent: chequeDetail?.sellerFeesPercent,
                                        splitCommissionOption: "YES",
                                        buyerCommissionPercent: chequeDetail?.buyerFeesPercent,
                                        sellerCommissionPercent: chequeDetail?.sellerFeesPercent,
                                      });
                                      setSplitOption(true);
                                    }
                                    
                                    
                                    form.setFieldsValue({
                                      invoiceAmount: chequeDetail?.invoiceAmount,
                                      currency: chequeDetail?.currency,
                                      buyerPercent: chequeDetail?.buyerFeesPercent,
                                      sellerPercent: chequeDetail?.sellerFeesPercent,
                                      itemName:transaction?.itemName, 
                                      description: transaction?.description,
                                      transactionType : transactionType,
                                      bankAlias : chequeDetail.bankAlias,
                                      autoAssignFund : chequeDetail.autoAssignFund,
                                      isPaymentInitialized : chequeDetail.isPaymentInitialized,
                                      isPartyPoa: chequeDetail?.isPartyPoa,
                                      isCounterPoa: chequeDetails?.isCounterPoa
                                    });
                                    
                                    setFormValues({
                                      ...formValues,
                                      itemName: transaction?.itemName,
                                      description: transaction?.description,
                                      invoiceAmount: chequeDetail?.invoiceAmount,
                                      buyerPercent: chequeDetail?.buyerFeesPercent,
                                      sellerPercent: chequeDetail?.sellerFeesPercent,
                                      currency: chequeDetail?.currency,
                                      contractStartedBy: chequeDetail?.contractStartedBy,
                                      userType: chequeDetail.contractStartedBy,
                                      transactionType: transactionType,
                                      bankAlias: chequeDetail.bankAlias,
                                      autoAssignFund: chequeDetail.autoAssignFund,
                                      isPaymentInitialized: chequeDetail.isPaymentInitialized,
                                      isPartyPoa: chequeDetail?.isPartyPoa,
                                      isCounterPoa: chequeDetails?.isCounterPoa
                                    })

                                       if(chequeDetail.chequeDetails && chequeDetail.chequeDetails.length ){
                                        const preparedCheques = chequeDetail.chequeDetails.map((cheque:any)=>{
                                          return { 
                                            beneficiaryName : cheque.beneficiaryName,
                                            amount : cheque.amount,
                                            comment : cheque.comment,
                                            aliasName : cheque.aliasName,
                                            buyerRequested : cheque.buyerRequested,
                                           }  
                                        })
                                        setPreparedCheques(preparedCheques);
                                      }
                                  }
                                 
                                })
                                .catch((e) => {
                                  console.log("getChequeDetails  e",e);
                                  setErrorMsg(true);
                                });
                            
                          })
                          .catch((e) => { 
                            console.log("getTxnData  e",e);
                            setErrorMsg(true);
                          });
              
                      }
                      else{
          //                getDraftTxnData(chequeAlias)
          //                 .then((response: any) => {
                             
          //                   const transaction = response.data; 
          //                   const data = list.find((item :any)=> item.aliasName == transaction?.itemCategoryAlias);
          //                   setCategory(data);
                
          //                   const rctype = transaction?.itemCategoryAlias;
                            
          //                   getRSTypeByCatAlias(rctype)
          //                     .then(async (response: any) => {
          //                       const ItemList = response.data;
          //                       const rcType = ItemList.find((item: any) => item.aliasName == transaction?.itemTypeAlias);
          //                       setRsItemList(ItemList);
          //                       setItemType(rcType)
          //                   const [userPlatformCharge, sellerPlatformCharge]:any = await Promise.all([
          //   getUserPlatformFees(userAlias, TRANSACTION_TYPE.MC),
          //   sellerAlias ? getUserPlatformFees(sellerAlias, TRANSACTION_TYPE.MC) : Promise.resolve({}),
          // ]);
          //                       let taxDetailsObj: any = {
          //                         platformChargeType: rcType?.platformChargeType,
          //                         platformFees: rcType?.plateformFees,
          //                         vatCharges: rcType?.vatCharges,
          //                         minimumPlatformFee: rcType?.minimumPlatformCharge,
          //                         platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.DEFAULT
          //                       };
          //                       if (userPlatformCharge?.status === 200 && userPlatformCharge?.data && sellerPlatformCharge?.status === 200 && sellerPlatformCharge?.data) {
          //                         const invoiceAmount = form.getFieldValue("invoiceAmount");
          //                         const buyerAmount = calculateUserPlatformFee(userPlatformCharge?.data, invoiceAmount);
          //                         const sellerAmount = calculateUserPlatformFee(sellerPlatformCharge?.data, invoiceAmount);
          //                         if (buyerAmount >= sellerAmount && userPlatformCharge) {
          //                           taxDetailsObj = {
          //                             ...taxDetailsObj,
          //                             platformChargeType: userPlatformCharge.data.platformChargeType,
          //                             platformFees: userPlatformCharge.data.platformFees
          //                               ? Number(userPlatformCharge.data.platformFees)
          //                               : taxDetailsObj.platformFees,
          //                             platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
          //                           };
          //                         } else {
          //                           taxDetailsObj = {
          //                             ...taxDetailsObj,
          //                             platformChargeType: sellerPlatformCharge.data.platformChargeType,
          //                             platformFees: sellerPlatformCharge.data.platformFees
          //                               ? Number(sellerPlatformCharge.data.platformFees)
          //                               : taxDetailsObj.platformFees,
          //                             platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
          //                           };
          //                         }
          //                       } else if (sellerPlatformCharge?.status === 200 && sellerPlatformCharge?.data) {
          //                         taxDetailsObj = {
          //                           ...taxDetailsObj,
          //                           platformChargeType: sellerPlatformCharge?.data?.platformChargeType,
          //                           platformFees: sellerPlatformCharge?.data?.platformFees
          //                             ? Number(sellerPlatformCharge?.data?.platformFees)
          //                             : taxDetailsObj.platformFees,
          //                           platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
          //                         };
          //                         console.log("userPlatformCharge",userPlatformCharge)
          //                       } else if (userPlatformCharge?.status === 200 && userPlatformCharge?.data) {
          //                         taxDetailsObj = {
          //                           ...taxDetailsObj,
          //                           platformChargeType: userPlatformCharge.data.platformChargeType,
          //                           platformFees: userPlatformCharge.data.platformFees
          //                             ? Number(userPlatformCharge.data.platformFees)
          //                             : taxDetailsObj.platformFees,
          //                           platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
          //                         };
          //                       }
          //                       console.log("taxDetailsObj",taxDetailsObj)
          //                       setTaxDetails({
          //                         platformChargeType: taxDetailsObj?.platformChargeType,
          //                         plateformFees: taxDetailsObj?.platformFees,
          //                         vatCharges: taxDetailsObj?.vatCharges,
          //                         minimumPlatformFee: taxDetailsObj?.minimumPlatformFee,
          //                         platformChargeAppliedOn: taxDetailsObj?.platformChargeAppliedOn
          //                       });

          //                     });

          //                     console.log("chequeAlias",chequeAlias);
                              
          //                     getDraftChequeDetails(chequeAlias, userAlias)
          //                     .then((resp) => {
          //                       console.log("resp",resp)
          //                       const chequeDetail =resp.data;
          //                       console.log("chequeDetails",chequeDetail)
          //                       const transactionType = chequeDetail.transactionType === "RECEIVE" ? "RECEIVE" :  "REQUEST";
          //                       setSellerAlias(chequeDetail?.sellerAlias)
          //                       setItemdetails({
          //                         itemCategory : chequeDetail?.itemCategoryName,
          //                         itemType : chequeDetail?.itemTypeName,
          //                         itemName : chequeDetail?.itemName,
          //                         description : chequeDetail?.description
          //                        })
                                
          //                       setSignature(chequeDetail?.fromSignDetails?.url);
          //                       setSignatureId(chequeDetail?.fromSign);

          //                       const counterParty = chequeDetail.contractStartedBy == USER_TYPE_TEXT.BUYER ? "Seller" : "Buyer";
          //                       setCounterParty(counterParty);
          //                       setChequeDetails(chequeDetail);
          //                       const sofUrls = chequeDetail.sourceOfFunds && chequeDetail.sourceOfFunds.map((item: { url: any; }) => item.url);
          //                       setSourceOfFundUrls(sofUrls || []);
          //                       setSourceOfFundIds(chequeDetail?.sourceoffunds||[])
          //                         if (["0","1","12"].includes(chequeDetail?.chequeStatus)) {
          //                             setItemType(response?.data?.itemTypeAlias);
          //                             setCategory(response?.data?.itemCategoryAlias);
          //                             form.setFieldsValue({
          //                               itemTypeAlias: response?.data?.itemTypeAlias,
          //                               itemCategoryAlias: response?.data?.itemCategoryAlias,
          //                               contractStartedBy : chequeDetail?.contractStartedBy
          //                             });
                                   
                                      
          //                           if (Number(chequeDetail?.buyerFeesPercent) < 100) {
          //                             form.setFieldsValue({
          //                               splitOption: "YES",
          //                               buyerPercent: chequeDetail?.buyerFeesPercent,
          //                               otherPercent: chequeDetail?.sellerFeesPercent,
          //                               splitCommissionOption: "YES",
          //                               buyerCommissionPercent: chequeDetail?.buyerFeesPercent,
          //                               sellerCommissionPercent: chequeDetail?.sellerFeesPercent,
          //                             });
          //                             setSplitOption(true);
          //                           }
                                    
                                    
          //                           form.setFieldsValue({
          //                             invoiceAmount: chequeDetail?.invoiceAmount,
          //                             currency: chequeDetail?.currency,
          //                             buyerPercent: chequeDetail?.buyerFeesPercent,
          //                             sellerPercent: chequeDetail?.sellerFeesPercent,
          //                             itemName:transaction?.itemName, 
          //                             description: transaction?.description,
          //                             transactionType : transactionType,
          //                             bankAlias : chequeDetail.bankAlias,
          //                             autoAssignFund : chequeDetail.autoAssignFund,
          //                             isPaymentInitialized : chequeDetail.isPaymentInitialized,
          //                           });
                                    
          //                           setFormValues({...formValues,
          //                              itemName:transaction?.itemName,
          //                              description: transaction?.description,
          //                              invoiceAmount: chequeDetail?.invoiceAmount,
          //                              buyerPercent: chequeDetail?.buyerFeesPercent,
          //                              sellerPercent: chequeDetail?.sellerFeesPercent,
          //                              currency: chequeDetail?.currency,
          //                              contractStartedBy : chequeDetail?.contractStartedBy,
          //                              userType : chequeDetail.contractStartedBy,
          //                              transactionType : transactionType,
          //                              bankAlias : chequeDetail.bankAlias,
                                       
          //                              autoAssignFund : chequeDetail.autoAssignFund,
          //                              isPaymentInitialized : chequeDetail.isPaymentInitialized,
          //                             })
               
          //                              if(chequeDetail.chequeDetails && chequeDetail.chequeDetails.length ){
          //                               const preparedCheques = chequeDetail.chequeDetails.map((cheque:any)=>{
          //                                 return { 
          //                                   beneficiaryName : cheque.beneficiaryName,
          //                                   amount : cheque.amount,
          //                                   comment : cheque.comment,
          //                                   aliasName : cheque.aliasName,
          //                                   buyerRequested : cheque.buyerRequested,
          //                                  }  
          //                               })
          //                               setPreparedCheques(preparedCheques);
          //                             }
                                       
          //                         }
                                 
          //                       })
          //                       .catch((e) => {
          //                         console.log("getChequeDetails  e",e);
          //                         setErrorMsg(true);
          //                       });
                            
          //                 })
          //                 .catch((e) => { 
          //                   console.log("getTxnData  e",e);
          //                   setErrorMsg(true);
          //                 });
                      }


                    }
                  })

   

      setLoadingPage(false);
      
  }, []);
 

  useEffect(() => { 
    if(bankAccountList.length && chequeDetails){
      
      
      const payoutAccount = bankAccountList?.find((account: any) => account.aliasName == chequeDetails?.payoutAccount_bankAlias);
      
      form.setFieldsValue({
        payout_account: payoutAccount?.aliasName,
      });
      setPayoutAccount(payoutAccount);
    }
  }, [bankAccountList, chequeDetails]);
 

  const handleSubmit = () => {
    onFinish(form.getFieldsValue()).catch(() => {
      setIsSubmitting(true);
    });

  };

  const partyName = () => {
    let fromPartyName;
    switch (form.getFieldValue("contractStartedBy")) {
      case USER_TYPE_TEXT.BUYER:
      fromPartyName = 'buyer';
      break;
      case USER_TYPE_TEXT.SELLER:
      fromPartyName = 'seller';
      break;
      case USER_TYPE_TEXT.BUYERPOA:
      fromPartyName = 'POA of buyer';
      break;
      case USER_TYPE_TEXT.SELLERPOA:
      fromPartyName = 'POA of seller';
      break;
      default:
      fromPartyName = '';
      break;
    }
    return fromPartyName;
  }

  const counterPartyName = () => {
    let toPartyName; 
    if([USER_TYPE_TEXT.BUYER, USER_TYPE_TEXT.BUYERPOA].includes(form.getFieldValue("contractStartedBy")) && (form.getFieldValue("isCounterPoa") == false)) {
      toPartyName = 'seller';
    } else if([USER_TYPE_TEXT.BUYER, USER_TYPE_TEXT.BUYERPOA].includes(form.getFieldValue("contractStartedBy")) && (form.getFieldValue("isCounterPoa") == true)) {
      toPartyName = 'POA of seller';
    } else if([USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA].includes(form.getFieldValue("contractStartedBy"))  && (form.getFieldValue("isPartyPoa") == false)) {
      toPartyName = 'buyer';
    } else if([USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA].includes(form.getFieldValue("contractStartedBy"))  && (form.getFieldValue("isPartyPoa") == true)) {
      toPartyName = 'POA of buyer';
    }
    return toPartyName;
  }

// const poaPartyName = () => {
//   const type = form.getFieldValue("contractStartedBy");

//   const mapping: Record<string, string> = {
//     BUYERPOA: "poa of buyer",
//     SELLERPOA: "poa of seller",
//   };

//   return mapping[type] ?? "";
// };


  const validateName = (e: any) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    form.setFieldsValue({ itemName: result });
    setItemdetails((prev: any) => ({ ...prev, itemName: result }))
  };
  const validateDescription = (e: any) => {
    const result: string = e.target.value.replace(alphanumericRegex, "");
    setItemdetails((prev: any) => ({ ...prev, description: result }))
    form.setFieldsValue({ description: result });
    const inputValue = e.target.value;
        if (inputValue.length >= 300) {
          message.error("Maximum characters limit reached (300).");
          return;
       }
  }; 
  
  const handleSplit = (e: RadioChangeEvent) => {
    const isYes = e.target.value === "YES";
    setSplitOption(isYes);
        
    // Update form values
    form.setFieldsValue({
      splitOption: e.target.value,
      buyerPercent: isYes ? undefined : 100,
      sellerPercent: isYes ? undefined : 0
    });
  
    if (!isYes) {
      setFormValues((prevState:any) => ({
        ...prevState,
        buyerPercent: 100,
        sellerPercent: 0,
      }));
    }
    
    setdidsubmit(1);
  };

  const onRCCategoryChange = async (itemCategoryAlias: any) => { 
      const category :any =  rsCatList.find((a : any)=> a.aliasName == itemCategoryAlias);
      setItemdetails((prev: any) => ({ ...prev, itemCategory : category?.name }));
      setCategory(itemCategoryAlias);
        form.setFieldsValue({ itemTypeAlias: null });
        await getRSTypeByCatAlias(itemCategoryAlias)
          .then((response: any) => { 
            
            const itemTypeList = response?.data || [];
            setRsItemList(itemTypeList);
          })
          .catch((e) => {
            console.log("onRCCategoryChange e",e);
            setErrorMsg(true);
        });

  };
  
  const onRCTypeChange = async (aliasName: any) => {

    setErrorMsg(false);
    const category: any = rsItemList.find((item: any) => item.aliasName === aliasName)
    setItemdetails((prev: any) => ({ ...prev, itemType: category?.name }))
    if (category) {
      setMinimumValue(category.minimumInvoiceAmount)
      setItemType(aliasName);
       const [userPlatformCharge, sellerPlatformCharge]:any = await Promise.all([
            getUserPlatformFees(userAlias, TRANSACTION_TYPE.MC),
            sellerAlias ? getUserPlatformFees(sellerAlias, TRANSACTION_TYPE.MC) : Promise.resolve({}),
          ]);
      let taxDetailsObj = {
        platformChargeType: category?.platformChargeType,
        platformFees: category?.plateformFees,
        vatCharges: category?.vatCharges,
        minimumPlatformFee: category?.minimumPlatformCharge,
        platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.DEFAULT
      };

      if (userPlatformCharge?.status === 200 && userPlatformCharge?.data && sellerPlatformCharge?.status === 200 && sellerPlatformCharge?.data) {
        const invoiceAmount = form.getFieldValue("invoiceAmount");
        const buyerAmount = calculateUserPlatformFee(userPlatformCharge?.data, invoiceAmount);
        const sellerAmount = calculateUserPlatformFee(sellerPlatformCharge?.data, invoiceAmount);
        if (buyerAmount >= sellerAmount && userPlatformCharge) {
          taxDetailsObj = {
            ...taxDetailsObj,
            platformChargeType: userPlatformCharge.data.platformChargeType ?? taxDetailsObj.platformChargeType,
            platformFees: userPlatformCharge.data.platformFees
              ? Number(userPlatformCharge.data.platformFees)
              : taxDetailsObj.platformFees,
            platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
          };
        } else {
          taxDetailsObj = {
            ...taxDetailsObj,
            platformChargeType: sellerPlatformCharge.data.platformChargeType ?? taxDetailsObj.platformChargeType,
            platformFees: sellerPlatformCharge.data.platformFees
              ? Number(sellerPlatformCharge.data.platformFees)
              : taxDetailsObj.platformFees,
            platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
          };
        }
      } else if (sellerPlatformCharge?.status === 200 && sellerPlatformCharge?.data) {
        taxDetailsObj = {
          ...taxDetailsObj,
          platformChargeType: sellerPlatformCharge?.data?.platformChargeType ?? taxDetailsObj.platformChargeType,
          platformFees: sellerPlatformCharge?.data?.platformFees
            ? Number(sellerPlatformCharge?.data?.platformFees)
            : taxDetailsObj.platformFees,
          platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.SELLER
        };
      } else if (userPlatformCharge?.status === 200 && userPlatformCharge?.data) {
        taxDetailsObj = {
          ...taxDetailsObj,
          platformChargeType: userPlatformCharge.data.platformChargeType ?? taxDetailsObj.platformChargeType,
          platformFees: userPlatformCharge.data.platformFees
            ? Number(userPlatformCharge.data.platformFees)
            : taxDetailsObj.platformFees,
          platformChargeAppliedOn: PLATFORM_CHARGE_APPLIED_ON.BUYER
        };
      }
      setTaxDetails({
        platformChargeType: taxDetailsObj?.platformChargeType,
        plateformFees: taxDetailsObj?.platformFees,
        vatCharges: taxDetailsObj?.vatCharges,
        minimumPlatformFee: taxDetailsObj?.minimumPlatformFee,
        platformChargeAppliedOn: taxDetailsObj?.platformChargeAppliedOn
      });
    }

  };
  
  
  const onAddBankAccountSuccess = () => {
    getlocalBankDetails(userAlias)
      .then((response) => {
        setBankAccountList(response.data.bankDetails);
        const primaryAccount = response.data.bankDetails?.find((account: any) => account.isPrimary);
        form.setFieldsValue({
          payoutAccountAlias: primaryAccount?.aliasName,
        });
        setPayoutAccount(primaryAccount);
      })
      .catch();
  }

  
  const gotoPreview = async () => {
    try {

      // let chequeData = null;
      // if (chequeAlias && userAlias) {
      //   const chequeResp = await getChequeDetails(chequeAlias, userAlias);
      //   chequeData = chequeResp?.data || null;
      //   if (chequeData) {
      //     setChequeDetails(chequeData);
      //   }
      // }
        
      if (sellerCountryError && sellerCountryError?.status !== true) {
        await form.validateFields()
        const values = form.getFieldsValue()
        const customFieldList: any = {};

        for (const key in customField) {
          const Key = `cp${key}`;
          customFieldList[Key] = Object.values(customField)[key];
        }
        let requestBody: any = {};
        requestBody = {
          ...values,
          platformFee: invoiceCalculations?.platformFee ?? 0,
          platformPercent: invoiceCalculations?.platformPercent ?? 0,
          vatFee: invoiceCalculations?.vatFee ?? 0,
          buyerTransactionFee: invoiceCalculations?.buyerTransactionFee ?? 0,
          sellerTransactionFee: invoiceCalculations?.sellerTransactionFee ?? 0,
          buyerTotalFee: invoiceCalculations?.buyerTotalFee ?? 0,
          sellerTotalFee: invoiceCalculations?.sellerTotalFee ?? 0,
          buyerAmount: invoiceCalculations?.buyerAmount ?? 0,
          sellerAmount: invoiceCalculations?.sellerAmount ?? 0,
          totalAmount: invoiceCalculations?.totalAmount ?? 0,
          entityType,
          vatChargePercent: Number(taxDetails?.vatCharges) ?? Number(process.env.COUNTRY_VAT),
          buyerCountry: buyerCountry ? buyerCountry : 'AE',
          currency: currency,
          userEntityType: entityType,
          userAlias: userAlias,
          clientAlias: "TRUST-MC",
          countrycode: callingCode,
          status: buttonStatus,
          stateCode: form.getFieldsValue().cityCode,
          customPoint: customFieldList,
          customAttachments: customAttachmentIds
        }

        const sellerPercent = values.sellerPercent ? Number(values.sellerPercent) : 0;
        if(Number(sellerPercent) > 0){
          requestBody.sellerPercent = sellerPercent;
          requestBody.buyerPercent  = 100 - sellerPercent;
        }else{
          requestBody.sellerPercent = sellerPercent;
          requestBody.buyerPercent = 100;
        }
        
        requestBody.currency = currency ?? 'AED';

        if(values?.contractStartedBy === USER_TYPE_TEXT.BUYERPOA) {
          requestBody.isPartyPoa = true
          requestBody.isCounterPoa = values.isCounterPoa
          
        } else if(values?.contractStartedBy === USER_TYPE_TEXT.SELLERPOA){
          requestBody.isCounterPoa = true
          requestBody.isPartyPoa = values.isPartyPoa
        }
        setPartyDetails({
          name: userData?.name,
          email: userData?.email,
          countryAlias: buyerCountry || "AE",
          countryName:
            countryList?.find(
              (c: any) =>
                c.isoCode === buyerCountry ||
                c.name === buyerCountry
            )?.name || buyerCountry || "United Arab Emirates",
          kycNationality:
            requestBody?.nationality || requestBody?.nationality || "AE",
          nationalityName:
            countryList?.find(
              (c: any) =>
                c.isoCode === requestBody?.nationality ||
                c.name === requestBody?.nationality
            )?.name ||requestBody?.nationality || "United Arab Emirates",
            entityType:userData?.entityType
        });

        setCounterDetails({
          name: requestBody?.counterContactName,
          email: requestBody?.counterContactEmail,
          countryAlias: form.getFieldValue("counterCountry") || counterCountry || "AE",
          countryName:
            countryList?.find(
              (c: any) =>
                c.isoCode === (form.getFieldValue("counterCountry") || requestBody?.counterCountry)  ||
                c.name === requestBody?.counterCountry
            )?.name || requestBody?.counterCountry || "United Arab Emirates",
          kycNationality:
            form.getFieldValue("counterNationality") ?? requestBody?.counterNationality ?? requestBody?.counterCountry,
          nationalityName:
            countryList?.find(
              (c: any) =>
                c.isoCode === (form.getFieldValue("counterNationality") || requestBody?.counterNationality || requestBody?.sellerNationality) ||
                c.name === requestBody?.counterCountry
            )?.name || requestBody?.counterCountry || "United Arab Emirates",
             entityType:requestBody?.typeOfEntity
        });

        
        setPreviewValue(requestBody);
        setShowPreviewModal(true);
        setButtonText("");
      } else {
        message.warning("Either the buyer or the seller must be from the UAE.");
      }
    } catch (_e: any) {
      return false
    }
  }

  useEffect(() => {
    setCountryError({ status: false });
  }, [countryPhone]);
   
 

  const redirectOnSend = (
    contractId: any,
    url: any
  ) => {
    
    navigate(SuccessTxn, {
      state: {
        url: url,
        contractId: contractId,
        userType: userType,
      },
    });

  };

  const redirectOnList = () => {
    navigate(`${Cheques}?tab=all`);
    // navigate(Cheques);
  };

  // const onItemTypeChange = (itemTypeAlias: any) => {
  //   setItemType(itemTypeAlias);
  //   // setInputFields([]);
  //   const data:any = itemTypeList.filter((item:any) => item.aliasName === itemTypeAlias)
  //   // setitemName(data?.[0]?.name);
  //   setCategoryList(
  //     data[0]
  //       .itemCategories
  //   );
  //   form.setFieldsValue({ itemCategoryAlias: null });
  // };
    
  const handleCancelPreview = () => {
    setShowPreviewModal(false);
    setButtonText("")
  };


   const totalAmountAndCount = () => {
      getWalletTotalAmountAndCount(userAlias, "AED")
        .then((response) => {
          setWalletAmountAndCount(response.data?.walletTransaction);
        })
        .catch(() => { 
          setLoading(false);
        });
  };

  const onFinishRecived = async () => {
    
      await form.validateFields();
      
      const values = {...form.getFieldsValue()};

      if (values?.contractStartedBy === USER_TYPE_TEXT.SELLERPOA) {
          if(counterPoaDocuments?.length <= 0 && !counterUserExists){
          message.warning(`Please upload atleast one document of seller verification`)
          return
        }
      }
      // for counter party validation
      if (fileList2?.length <= 0 && !isSellerRegistered && values?.isSellerOnboarded === "NO") {  
        message.warning(`Please upload atleast one document of ${counterParty.toLowerCase()} verification`)
        return
      }

      // for counter party's poa validation
      if(values?.isPartyPoa){
        if(partyPoaDocuments?.length <= 0 && !partyUserExists){
          message.warning(`Please upload atleast one document of buyer verification`)
          return
        }
      }

        // Remove unwanted fields from values before proceeding
      ['Institutiontype', 'supplierNameAsPerBank', 'institutionName', 'IbanNumber'].forEach(field => {
        delete values[field];
      });
      const customFieldList: any = {};
      for (const key in customField) {
        const Key = `cp${key}`;
        customFieldList[Key] = Object.values(customField)[key];
      }

      let requestBody: any = {};
      

      setPartyDetails({
        name: userData?.name,
        email: userData?.email,
        countryAlias: buyerCountry ? buyerCountry : 'AE',
        entityType:userData?.entityType
      });
          
      setCounterDetails({
        name: values?.counterContactName,
        email: values?.counterContactEmail,
        countryAlias: counterCountry,
      });

      setBankDetails({
        name: form.getFieldsValue()?.bankName,
        IbanNumber: form.getFieldsValue()?.IbanNumber,
        Institutiontype: form.getFieldsValue()?.Institutiontype,
        institutionName: form.getFieldsValue()?.institutionName,
        routingCode: form.getFieldsValue()?.routingCode,
        routingScheme: form.getFieldsValue()?.routingScheme,
      });

      
           

      requestBody = {
        ...values,
       
        platformFee: Number(invoiceCalculations.platformFee),
        platformPercent: invoiceCalculations.platformPercent,
        vatFee: Number(invoiceCalculations.vatFee),
        buyerTransactionFee: Number(invoiceCalculations.buyerTransactionFee),
        sellerTransactionFee: Number(invoiceCalculations.sellerTransactionFee),
        buyerTotalFee: Number(invoiceCalculations.buyerTotalFee),
        sellerTotalFee: Number(invoiceCalculations.sellerTotalFee),
        buyerAmount: Number(invoiceCalculations.buyerAmount),
        sellerAmount: Number(invoiceCalculations.sellerAmount),
        totalAmount: Number(invoiceCalculations.totalAmount),
        entityType,
        vatChargePercent: Number(taxDetails.vatCharges) ?? Number(process.env.COUNTRY_VAT),
        buyerCountry: buyerCountry ? buyerCountry : 'AE',
        currency: currency,
        buyerPercent: 0,
        sellerPercent: 100,
        userEntityType: entityType,
        userAlias: userAlias,
        clientAlias: "TRUST-MC",
        countrycode: callingCode,
        status: buttonStatus,
        stateCode: form.getFieldsValue().cityCode,
        customPoint: customFieldList,
        fromSign : signatureId,
        customAttachments: customAttachmentIds,
        preparedCheques : preparedCheques,
        counterNationalityName:counterNationality,
        nationalityCallingCode:nationalityCallingCode,
        counterNationality:nationalityIsoCode,
        isSellerOnboarded : values?.isSellerOnboarded && values?.isSellerOnboarded === "YES",
        //Buyer/Party POA
        partyPoaCountry: partyPoaCountry,
        partyPoaCountryCode: partyPoaCountryCode,
        partyPoaNationality: partyPoaNationality,
        partyPoaNationalityCallingCode: partyPoaNationalityCallingCode,
        partyPoaAlias: partyPoaAlias,
        partyPoaTypeOfEntity: values?.partyPoaTypeOfEntity,
        partyPoaOnboarded: false,
        isPartyPoa: values?.isPartyPoa,
        //Seller/CounterParty POA
        counterPoaCountry: counterPoaCountry,
        counterPoaCountryCode: counterPoaCountryCode,
        counterPoaNationality: counterPoaNationality,
        counterPoaNationalityCallingCode: counterPoaNationalityCallingCode,
        counterPoaAlias: counterPoaAlias,
        counterPoaTypeOfEntity: values?.counterPoaTypeOfEntity,
        counterPoaOnboarded:false,     
        isCounterPoa:values?.isCounterPoa   
      }
      if(values?.allocatedFund){
        requestBody.isPaymentInitialized = true;
      }else{
        requestBody.isPaymentInitialized = false;
      }

      if(values?.contractStartedBy === USER_TYPE_TEXT.SELLERPOA){
        requestBody.isCounterPoa = true
        requestBody.counterPoaOnboarded = false
      }

      requestBody.currency = currency ?? 'AED';

      const sellerDoc = fileList2?.map((element,i) => {
        const str = `documentid_${i}`;
        return { [str] : element.id , document : element.document, expirydate : element.expirydate };
      });

      if(!userExists){
        requestBody["counterDocuments"] = sellerDoc
      } else {
        requestBody["counterDocuments"] = [];
        if(sellerDocCheck){
          requestBody["counterDocuments"] = sellerDoc
        }
      }
     
      
      const partyPoaDocs = buildPoaDocuments(partyPoaDocuments, partyUserExists);
      const counterPoaDocs = buildPoaDocuments(counterPoaDocuments, counterUserExists);
    
      if (partyPoaDocs) {
        if(!partyUserExists || partyPoaDocCheck){ // || experied 
          requestBody.partyPoaDocuments = partyPoaDocs
        }else{
          requestBody.partyPoaDocuments = [];  // because as per current flow this will not initiate screening again
        }
      }
        
      if (counterPoaDocs) {
        if(!counterUserExists || counterPoaDocCheck){ // || experied 
          requestBody.counterPoaDocuments = counterPoaDocs
        }else{
          requestBody.counterPoaDocuments = []; // because as per current flow this will not initiate screening again
        }
      } 

      if(values?.countertypeOfEntity === "COMPANY"){
        requestBody["CustomerType"] = "C";
        requestBody["natureofBusiness"] = values.natureofBusiness;
        requestBody["natureofBusinessTypeId"] = businessNatureTypeId;

        requestBody["countryofIncorporationTypeId"] = countryofIncorporationTypeId;
        requestBody["countryofIncorporation"] = values.countryofIncorporation;
        requestBody["dob"] = selectedDate ? DateWithUtcOffset(selectedDate) : null;
      }else{
        requestBody["CustomerType"] = "I";
        requestBody["profession"] = values?.profession != null ? String(values.profession) : "";
        requestBody["professionTypeId"] = professionTypeId;

        requestBody["residenceStatusTypeId"] = residenceStatusTypeId;
        requestBody["residenceStatus"] = values.residenceStatus;
      }
      
         //! Buyer/Party POA
      const partyPoaScreeningPayload = buildPoaScreeningPayload("partyPoa", values?.partyPoaTypeOfEntity, values, {
        professionTypeId: partyPoaProfessionTypeId,
        residenceStatusTypeId: partyPoaResidenceStatusTypeId,
        businessNatureTypeId: partyPoaBusinessNatureTypeId,
        countryofIncorporationTypeId: partyPoaCountryofIncorporationTypeId,
        dob: partyPoaDob
      });
      
      //! Seller/CounterParty POA
      const counterPoaScreeningPayload = buildPoaScreeningPayload("counterPoa", values?.counterPoaTypeOfEntity, values, {
        professionTypeId: counterPoaProfessionTypeId,
        residenceStatusTypeId: counterPoaResidenceStatusTypeId,
        businessNatureTypeId: counterPoaBusinessNatureTypeId,
        countryofIncorporationTypeId: counterPoaCountryofIncorporationTypeId,
        dob: counterPoaDob
      });

      requestBody = {...requestBody,...partyPoaScreeningPayload,...counterPoaScreeningPayload}
      
    if(buttonText === 'Preview'){
      gotoPreview2(requestBody);
      return
    }
      setLoading(true);
      setIsSubmitting(true);
       if(chequeAlias){
          requestBody["chequeId"] = chequeAlias;
        } 
         
        createReceiveFund(requestBody)
           .then((res) => {
              setdoneSubmit(true);
              if (res.status === 201 || res.status === 200) {
                buttonStatus === "SEND"
                  ? userExists
                    ? redirectOnSend(
                        res?.data?.contractTransactionDetail?.contractId ||
                          res?.data?.contractId, `${window.location.protocol}//${window.location.host}/transaction-details/${res?.data?.contractId}&src=sharing`
                      )
                    : redirectOnSend(
                        res?.data?.contractTransactionDetail?.contractId ||
                          res?.data?.contractId,`${window.location.protocol}//${window.location.host}/signup?referrer=transaction-details/${res?.data?.contractTransactionDetail?.contractId || res?.data?.contractId}&src=sharing`
                      )
                  : redirectOnList();
              }
            })
            .catch((err) => {
              setLoading(false);
              setdoneSubmit(false);
              setIsSubmitting(false);
              setError({
                status: err.data?.statusCode,
                message: err?.data?.message ? err?.data?.message : err?.data?.error ? err?.data?.error : "Something went wrong!",
              });
            });
     
  }
  

  const gotoPreview2 = async (requestBody :any) => {
    
      setPreviewValue(requestBody);
      setShowPreviewModal(true);
      setButtonText(""); 
    
     
  }

// const warn = (msg:string) => {
//   message.warning(msg);
//   return true; // for early return control
// };

  // const validateDocuments = () => {
  //   const isSellerNotOnboarded =
  //     ["NO", undefined].includes(form.getFieldValue("isSellerOnboarded")) ||
  //     ["NO", undefined].includes(formValues?.isSellerOnboarded);

  //   const isSellerSide = ["POA of seller", "POA of Seller", "Seller", "seller"].includes(counterParty);
  //   const isBuyerSide = ["POA of buyer", "POA of Buyer", "Buyer", "buyer"].includes(counterParty);

  //   const isContractStartedBy = form.getFieldValue("contractStartedBy");
  //   const isContractStartedByBuyerPoa = isContractStartedBy === "BUYERPOA";
  //   const isContractStartedBySeller = isContractStartedBy === "SELLER";
  //   const isContractStartedByBuyer = isContractStartedBy === "BUYER";
  //   const isContractStartedBySellerPoa = isContractStartedBy === "SELLERPOA";

  //   const isPoaParty = formValues?.isPartyPoa;
  //   const isCounterPoaParty = formValues?.isCounterPoa;

  //   // Validate main fileList2 existence
  //   if (
  //     fileList2?.length <= 0 &&
  //     !isSellerRegistered &&
  //     (isSellerSide || isBuyerSide) &&
  //     isSellerNotOnboarded
  //   ) {
  //     return warn(`Please upload at least one document for ${counterPartyName()} verification`);
  //   }

  //   // Buyer POA document validation
  //   const buyerNeedsUpload =
  //     partyPoaDocuments?.length <= 0 &&
  //     !partyUserExists &&
  //     isSellerNotOnboarded &&
  //     (
  //       // Case 1: Seller-side but buyer verification needed (e.g., POA of Seller)
  //       (isSellerSide && (isPartyPoa || isPoaParty || isContractStartedByBuyerPoa)) ||
  //       // Case 2: Buyer-side, started by seller or seller’s POA
  //       (isBuyerSide && ((isPartyPoa || isPoaParty) && (isContractStartedBySeller || isContractStartedBySellerPoa))) ||
  //       (isContractStartedByBuyerPoa)
  //     );

  //   if (buyerNeedsUpload) {
  //     return warn(`Please upload at least one document for buyer verification`);
  //   }

  //   // Seller POA document validation
  //   const sellerNeedsUpload =
  //     counterPoaDocuments?.length <= 0 &&
  //     !counterUserExists &&
  //     isSellerNotOnboarded &&
  //     (
  //       // Case 1: When counterParty is Seller → SellerPOA or SellerPOA started the contract
  //       (isSellerSide &&
  //         ((isCounterPoa || isCounterPoaParty || isContractStartedBySellerPoa))) ||
  //       // Case 2: When counterParty is Buyer → Buyer or BuyerPOA started the contract
  //       (isBuyerSide &&
  //         ((isCounterPoa || isCounterPoaParty) && (isContractStartedByBuyer || isContractStartedByBuyerPoa))) ||
  //       (isContractStartedBySellerPoa)
  //     );

  //   console.log("sellerNeedsUpload==>",sellerNeedsUpload);
      
  //   if (sellerNeedsUpload) {
  //     return warn(`Please upload at least one document for seller verification`);
  //   }

  //   return false; // No warnings triggered
  // };

  const onFinish = async (values: any) => {
  if (!isDraft) {
   if (customAttachmentIds.length <= 0) {
      message.warning('Please upload atleast one transaction document')
      return
    }
    if(!signatureId){
      message.warning(`Please upload signature.`)
      return;
    }
      
    // Validate that all emails are unique
    const emails = [
      userData?.email,
      values?.counterContactEmail,
      values?.partyPoaEmail,
      values?.counterPoaEmail,
    ].filter(Boolean); 
    const emailSet = new Set(emails); 
    if (emailSet.size !== emails.length) {
      message.warning("Each party's contact email must be unique.");
      return;
    }
    //  if (validateDocuments()) return; // because getting error in normal case, buyer-seller

    if(values?.transactionType == "RECEIVE"){
      onFinishRecived();
      return ;
    }
    
    if(searchCounterDetails?.userType == AuthUserTypes.GUEST_SELLER && values?.contractStartedBy == USER_TYPE_TEXT.SELLER){
      message.warning(`Perform operation is incorrect.`)
      return;
    }

    if (fileList2?.length <= 0 && !isSellerRegistered && values?.isSellerOnboarded === "NO") {
      message.warning(`Please upload atleast one document for ${counterParty.toLowerCase()} verification`)
      return
    }
    const sellerExpired = fileList2?.map(a=>a.isExpired) || [];
    if (fileList2?.length && sellerExpired.includes(true)) {
      message.warning(`Please reupload ${counterParty.toLowerCase()} documents`)
      return
    }
    
    if(preparedCheques.length && globalRemainingAmount < 0){
      message.warning(`Total cheque amount exceed.`);
      return 
    }
  }    
    
    if(values?.contractStartedBy === 'BUYERPOA'){
      if (partyPoaDocuments?.length <= 0 && !partyUserExists) {
        message.warning(`Please upload atleast one document for buyer verification`)
        return
      }
    }

    if (counterPoaDocuments?.length <= 0 && !counterUserExists && isCounterPoa) {
      message.warning(`Please upload atleast one document for seller verification`)
      return
    }

    // expiry check buyer 
    const partyPoaDocumentsExpired = partyPoaDocuments?.map(a => a.isExpired) || [];
    if (partyPoaDocuments?.length && partyPoaDocumentsExpired.includes(true)) {
      message.warning(`Please reupload ${counterParty.toLowerCase()} documents`)
      return
    }
    // expiry check seller
    const counterPoaDocumentsExpired = counterPoaDocuments?.map(a => a.isExpired) || [];
    if (counterPoaDocuments?.length && counterPoaDocumentsExpired.includes(true)) {
      message.warning(`Please reupload ${counterParty.toLowerCase()} documents`)
      return
    }
    if(buttonText === 'Preview' && !isDraft) {
      gotoPreview();
      return false
    } else {
        // setdoneSubmit(true);
        setLoading(true); 
        const customFieldList:any = {};

        for (const key in customField) {
          const Key = `cp${key}`;
          customFieldList[Key] = Object.values(customField)[key];
        }
        
        const requestBody:any = {
          ...values,
          platformFee: Number(invoiceCalculations?.platformFee) ?? 0,
          platformPercent: String(invoiceCalculations?.platformPercent) ?? 0,
          vatFee: Number(invoiceCalculations?.vatFee) ?? 0,
          buyerTransactionFee: Number(invoiceCalculations?.buyerTransactionFee) ?? 0,
          sellerTransactionFee: Number(invoiceCalculations?.sellerTransactionFee) ?? 0,
          buyerTotalFee: Number(invoiceCalculations?.buyerTotalFee) ?? 0,
          sellerTotalFee: Number(invoiceCalculations?.sellerTotalFee) ?? 0,
          buyerAmount: Number(invoiceCalculations?.buyerAmount) ?? 0,
          sellerAmount: Number(invoiceCalculations?.sellerAmount) ?? 0,
          totalAmount: Number(invoiceCalculations?.totalAmount) ?? 0,
          entityType,
          vatChargePercent: Number(taxDetails?.vatCharges) ?? Number(process.env.COUNTRY_VAT),
          buyerCountry: buyerCountry ? buyerCountry : 'AE',
          currency: currency,
          userEntityType: entityType,
          userAlias: userAlias,
          clientAlias: "TRUST-MC", 
          countrycode:callingCode,
          status: buttonStatus,
          stateCode: form.getFieldsValue().cityCode,
          fromSign : signatureId,
          customPoint: customFieldList,
          customAttachments: customAttachmentIds,
          preparedCheques : preparedCheques,
          counterNationalityName:counterNationality,
          nationalityCallingCode:nationalityCallingCode,
          counterNationality:nationalityIsoCode,
          platformChargeAppliedOn: taxDetails?.platformChargeAppliedOn,
          isSellerOnboarded : values?.isSellerOnboarded && values?.isSellerOnboarded === "YES",
          //! Buyer/Party POA
          partyPoaCountry:partyPoaCountry,
          partyPoaCountryCode:partyPoaCountryCode,
          partyPoaNationality:partyPoaNationality,
          partyPoaNationalityCallingCode:partyPoaNationalityCallingCode,
          partyPoaAlias:partyPoaAlias,
          partyPoaTypeOfEntity:values?.partyPoaTypeOfEntity,
          partyPoaOnboarded:false,

          //! Seller/CounterParty POA
          counterPoaCountry: counterPoaCountry,
          counterPoaCountryCode: counterPoaCountryCode,
          counterPoaNationality: counterPoaNationality,
          counterPoaNationalityCallingCode: counterPoaNationalityCallingCode,
          counterPoaAlias: counterPoaAlias,
          counterPoaTypeOfEntity:values?.counterPoaTypeOfEntity,
          counterPoaOnboarded:false,
        };  
        const sellerPercent = values.sellerPercent ? Number(values.sellerPercent) : 0;
        if(Number(sellerPercent) > 0){
          requestBody.sellerPercent = sellerPercent;
          requestBody.buyerPercent  = 100 - sellerPercent;
        } else {
          requestBody.sellerPercent = sellerPercent;
          requestBody.buyerPercent = 100;
        }

        if(values?.contractStartedBy === USER_TYPE_TEXT.BUYER || values?.contractStartedBy === USER_TYPE_TEXT.BUYERPOA) {
          requestBody.sourceOfFunds = sourceOfFundIds
        }

        if(values?.contractStartedBy === USER_TYPE_TEXT.BUYERPOA) {
          requestBody.isPartyPoa = true
          requestBody.isCounterPoa = values.isCounterPoa
          
        } else if(values?.contractStartedBy === USER_TYPE_TEXT.SELLERPOA){
          requestBody.isCounterPoa = true
          requestBody.counterPoaOnboarded = false
        }

        const sellerDoc = fileList2?.map((element,i) => {
          const str = `documentid_${i}`;
          return { [str] : element.id , document : element.document, expirydate : element.expirydate };
        });

        if(!userExists){
          requestBody["counterDocuments"] = sellerDoc
        } else {
          requestBody["counterDocuments"] = [];
          if(sellerDocCheck){
            requestBody["counterDocuments"] = sellerDoc
          }
        } 

      const partyPoaDocs = buildPoaDocuments(partyPoaDocuments, partyUserExists);
      const counterPoaDocs = buildPoaDocuments(counterPoaDocuments, counterUserExists);
      

      if (partyPoaDocs) {
        if(!partyUserExists || partyPoaDocCheck){ // || experied 
          requestBody.partyPoaDocuments = partyPoaDocs
        }else{
          requestBody.partyPoaDocuments = [];  // because as per current flow this will not initiate screening again
        }
      } 

      if (counterPoaDocs) {
        if(!counterUserExists || counterPoaDocCheck){ // || experied 
          requestBody.counterPoaDocuments = counterPoaDocs
        }else{
          requestBody.counterPoaDocuments = []; // because as per current flow this will not initiate screening again
        }
      }

        if(counterCountry == USER_TYPE_TEXT.BUYER){
          requestBody.buyerCountry = userData.counterAlias;
        }else if(counterCountry == USER_TYPE_TEXT.SELLER){
          requestBody.sellerCountry = userData.counterAlias;
        }

        requestBody.currency = currency ?? 'AED';


        if(chequeAlias){
          requestBody["chequeId"] = chequeAlias;
        }

        // if counter is buyer and its request then must be platform user
        if([USER_TYPE_TEXT.SELLER,USER_TYPE_TEXT.SELLERPOA].includes(requestBody?.contractStartedBy)  && requestBody?.transactionType == "REQUEST") { 
          requestBody.isSellerOnboarded = true;
        }

        if(values?.countertypeOfEntity === "COMPANY"){
          requestBody["CustomerType"] = "C";
          requestBody["natureofBusiness"] = values.natureofBusiness;
          requestBody["natureofBusinessTypeId"] = businessNatureTypeId;

          requestBody["countryofIncorporationTypeId"] = countryofIncorporationTypeId;
          requestBody["countryofIncorporation"] = values.countryofIncorporation;
          requestBody["dob"] = selectedDate ? DateWithUtcOffset(selectedDate) : null;

          
        }else{
          requestBody["CustomerType"] = "I";
          requestBody["profession"] = values.profession;
          requestBody["professionTypeId"] = professionTypeId;

          requestBody["residenceStatusTypeId"] = residenceStatusTypeId;
          requestBody["residenceStatus"] = values.residenceStatus;
        }  
        
      //! Buyer/Party POA
      const partyPoaScreeningPayload = buildPoaScreeningPayload("partyPoa", values?.partyPoaTypeOfEntity, values, {
        professionTypeId: partyPoaProfessionTypeId,
        residenceStatusTypeId: partyPoaResidenceStatusTypeId,
        businessNatureTypeId: partyPoaBusinessNatureTypeId,
        countryofIncorporationTypeId: partyPoaCountryofIncorporationTypeId,
        dob: partyPoaDob
      });

      //! Seller/CounterParty POA
      const counterPoaScreeningPayload = buildPoaScreeningPayload("counterPoa", values?.counterPoaTypeOfEntity, values, {
        professionTypeId: counterPoaProfessionTypeId,
        residenceStatusTypeId: counterPoaResidenceStatusTypeId,
        businessNatureTypeId: counterPoaBusinessNatureTypeId,
        countryofIncorporationTypeId: counterPoaCountryofIncorporationTypeId,
        dob: counterPoaDob
      });

        createCheque({...requestBody, ...partyPoaScreeningPayload, ...counterPoaScreeningPayload})
           .then((res) => {
              setdoneSubmit(true);
              if (res.status === 201 || res.status === 200) {
                buttonStatus === "SEND"
                  ? userExists
                    ? redirectOnSend(
                        res?.data?.contractTransactionDetail?.contractId ||
                          res?.data?.contractId, `${window.location.protocol}//${window.location.host}/transaction-details/${res?.data?.contractId}&src=sharing`
                      )
                    : redirectOnSend(
                        res?.data?.contractTransactionDetail?.contractId ||
                          res?.data?.contractId,`${window.location.protocol}//${window.location.host}/signup?referrer=transaction-details/${res?.data?.contractTransactionDetail?.contractId || res?.data?.contractId}&src=sharing`
                      )
                  : redirectOnList();
              }
            })
            .catch((err) => {
              setLoading(false);
              setdoneSubmit(false);
              setError({
                status: err.data?.statusCode,
                message: err?.data?.message ? err?.data?.message : err?.data?.error ? err?.data?.error : "Something went wrong!",
              });
            });
  }};

  const handleChange = (value: any) => {
    const counterParty = value == USER_TYPE_TEXT.BUYER ? modifyCresetUserType(userAlias,'Seller')  : modifyCresetUserType(userAlias,'Buyer');
    setCounterParty(counterParty);
    const transactionType = [USER_TYPE_TEXT.SELLER,USER_TYPE_TEXT.SELLERPOA].includes(value) ? MC_TYPE.RECEIVE : MC_TYPE.REQUEST;
    setFormValues({
      userType: value,
      transactionType: transactionType,
      buyerPercent : transactionType == MC_TYPE.RECEIVE ? 0 : 100,
      sellerPercent : transactionType == MC_TYPE.RECEIVE ? 100 : 0,
    });
    // form.resetFields();
    form.setFieldsValue({
      userType: value,
      transactionType: transactionType,
      buyerPercent : transactionType == MC_TYPE.RECEIVE ? 0 : 100,
      sellerPercent : transactionType == MC_TYPE.RECEIVE ? 100 : 0,
    });
  }

const buildPoaDocuments = (
  documents: any,
  userExists: boolean
): Record<string, string>[] => {
  console.log('Line No. => 1162 ==> userExists',userExists);
  if (!Array.isArray(documents)) return [];

  // Filter valid documents first (skip null or empty ones)
  const validDocs = documents?.filter(
    (doc) => doc && (doc.id || doc.document || doc.expirydate)
  );
  // Then map with fresh continuous index
  return validDocs?.map((doc, index) => {
    const entry: Record<string, any> = {};

    if (doc?.id != null && doc?.id !== "") entry[`documentid_${index}`] = doc.id;
    if (doc?.document != null && doc?.document !== "") entry.document = doc.document;
    if (doc?.expirydate != null && doc?.expirydate !== "") entry.expirydate = doc.expirydate;

    return entry;
  });
};

// Reusable helper function to build POA entity-specific data
const buildPoaScreeningPayload = (
  prefix: "partyPoa" | "counterPoa",
  typeOfEntity: EntityType | undefined,
  values: Record<string, any>,
  typeIds: {
    professionTypeId: number;
    residenceStatusTypeId: number;
    businessNatureTypeId: number;
    countryofIncorporationTypeId: number;
    dob:any;
  }
) => {
  if (!typeOfEntity) return {};

  const isIndividual = typeOfEntity === "INDIVIDUAL";
  const isCompany = typeOfEntity === "COMPANY";

  const base = {
    CustomerType: isIndividual ? "I" : "C" as CustomerType,
  };

  if (isIndividual) {
    return {
      ...base,
      [`${prefix}Profession`]: values?.[`${prefix}Profession`] ?? "",
      [`${prefix}ProfessionTypeId`]: typeIds.professionTypeId,
      [`${prefix}ResidenceStatusTypeId`]: typeIds.residenceStatusTypeId,
      [`${prefix}ResidenceStatus`]: values?.[`${prefix}ResidenceStatus`] ?? "",
    };
  }

  if (isCompany) {
    return {
      ...base,
      [`${prefix}NatureofBusiness`]: values?.[`${prefix}NatureofBusiness`] ?? "",
      [`${prefix}BusinessNatureTypeId`]: typeIds.businessNatureTypeId,
      [`${prefix}CountryofIncorporationTypeId`]: typeIds.countryofIncorporationTypeId,
      [`${prefix}CountryofIncorporation`]: values?.[`${prefix}CountryofIncorporation`] ?? "",
      [`${prefix}Dob`]: typeIds?.dob
        ? DateWithUtcOffset(typeIds?.dob)
        : null,
    };
  }

  return {};
};

  return (
    <>
    <Spin spinning={loading} className="mainloader" size="large">
      <Form 
          form={form}
          onFinish={onFinish}
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          }}
          initialValues={{
            splitOption: "NO",
            buyerPercent: 100,
            sellerPercent: 0,
            isSellerOnboarded : formValues?.isSellerOnboarded ?? "NO",
            isPartyPoa : isPartyPoa ?? false,
            isCounterPoa : isCounterPoa ?? false,
          }}
        >
      <div className="fullHeight scrollbar-container">
      <DefaultLayout
        page="cheque"
        TitleText="Escrow Transaction"
        TitleImage={managercheque}
        loading={loadingPage}
        headerPage={
          <div className="d-flex">
                    <Image
                      src={managercheque}
                      preview={false}
                      className="mt-2"
                      alt="escrowimage"
                    />
                    <div className="ml-5">
                      <b> Manager cheque</b>
                      <Breadcrumb separator=">">
                        {/* <Breadcrumb.Item
                          onClick={() => {
                            navigate(Dashboard);
                          }}
                          className="cursor"
                        >
                          Dashboard
                        </Breadcrumb.Item> */}
                        <Breadcrumb.Item className="breadcrumb-title-text">Manager cheque</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <Card className="noBorder mt-6 p-4 mb-3 status">
                
                  <div>
                    <div className="titleText mb-4"> New transaction </div>
                    <Row>
                         {/* <Col md={24} className="radioInput">
                          <Form.Item
                            name="contractStartedBy"
                            initialValue={USER_TYPE_TEXT.BUYER}
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
                                handleChange(e)
                              }}
                              buttonStyle="solid"
                              className="stepDetails_medium fw-400 width-50-rem"
                            >
                              <Radio value={USER_TYPE_TEXT.BUYER}>I am {modifyCresetUserType(userAlias,'buyer')}</Radio>
                              <Radio value={USER_TYPE_TEXT.SELLER}>I am {modifyCresetUserType(userAlias,'seller')}</Radio>
                              <Radio value={USER_TYPE_TEXT.BUYERPOA}>I am POA of {modifyCresetUserType(userAlias,'buyer')}</Radio>
                              <Radio value={USER_TYPE_TEXT.SELLERPOA}>I am POA of {modifyCresetUserType(userAlias,'seller')}</Radio>
                            </Radio.Group>
                          </Form.Item>
                        </Col> */}


                        <Col md={24} className="radioInput">
                          <p className="enter-text-category">Transaction role
                             <Tooltip
                                title={
                                  <span className="response-tooltip">
                                    This party is user
                                  </span>
                                }
                                overlayClassName='custom-tooltip info-icon'
                                placement={Width > 475 ? "right" : "top"}
                              >
                                <img src={infoIcon} className="ms-1 mt-1"/>
                              </Tooltip>
                          </p>
                          <Form.Item
                            name="contractStartedBy"
                            initialValue={USER_TYPE_TEXT.BUYER}
                            rules={[
                              {
                                required: true,
                                message: "Please select user type!",
                              },
                            ]}
                           >
                        <Select
                          placeholder="Select who you are"
                          className="stepDetails_medium fw-400 width-50-rem"
                          onChange={(value) => {
                            handleChange(value)
                          }}
                            >
                              <Option value={USER_TYPE_TEXT.BUYER}>
                                I am {modifyCresetUserType(userAlias, "buyer")}
                              </Option>
                              <Option value={USER_TYPE_TEXT.SELLER}>
                                I am {modifyCresetUserType(userAlias, "seller")}
                              </Option>
                              <Option value={USER_TYPE_TEXT.BUYERPOA}>
                                I am POA of {modifyCresetUserType(userAlias, "buyer")}
                              </Option>
                              <Option value={USER_TYPE_TEXT.SELLERPOA}>
                                I am POA of {modifyCresetUserType(userAlias, "seller")}
                              </Option>
                              {/* <Option value={USER_TYPE_TEXT.BROKER}>
                                I am {modifyCresetUserType(userAlias, "broker")}
                              </Option> */}
                            </Select>
                          </Form.Item>
                        </Col>
                    </Row>

                  {[USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA].includes(formValues?.userType) ?
                     <Row>
                       <Col span={Width < 992 ? 24 : 8} className="pe-4">
                        <p className="enter-text-category" style={{ display: 'flex', alignItems: 'center' }}>
                          Transaction type
                        </p>
                        <Form.Item  name="transactionType" className="inputField w-100 no-bg-select" initialValue={MC_TYPE.RECEIVE}>
                          <Select placeholder="Select transaction type" className="selct-form-field" disabled popupClassName="lowerz" suffixIcon={null}>
                            <Option key={MC_TYPE.RECEIVE} value={MC_TYPE.RECEIVE}> Receive Manager Cheque / Receive Funds </Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                   : "" }

                  {[USER_TYPE_TEXT.BUYERPOA].includes(formValues?.userType) ?
                    (<>
                      {/* Buyer / partyPoa */}
                      {((form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.BUYERPOA || formValues?.userType === USER_TYPE_TEXT.BUYERPOA) || (form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.BUYER || formValues?.userType === USER_TYPE_TEXT.BUYER) && form.getFieldValue("isPartyPoa") == true) ? (<>
                        <PoaDetailsForm
                          prefix="partyPoa"
                          poaParty="Buyer"
                          form={form}
                          // formValues={formValues}
                          setFormValues={setFormValues}
                          userExists={partyUserExists}
                          setUserExists={setPartyUserExists}
                          country={partyPoaCountry}
                          setCountry={setPartyPoaCountry}
                          countryCode={partyPoaCountryCode}
                          setCountryCode={setPartyPoaCountryCode}
                          nationality={partyPoaNationality}
                          isDraft={isDraft}
                          setNationality={setPartyPoaNationality}
                          // nationalityCallingCode={partyPoaNationalityCallingCode}
                          setNationalityCallingCode={setPartyPoaNationalityCallingCode}
                          setUserAlias={setPartyPoaAlias}
                          fileList={partyPoaDocuments}
                          setFileList={setPartyPoaDocuments}
                          poaDetails={chequeDetails?.partyPoaDetails}
                          setDocumentCheck={setPartyPoaDocCheck}
                          // setUserOnboarded={setPartyPoaOnboarded}
                          // professionTypeId={partyPoaProfessionTypeId}
                          setProfessionTypeId={setPartyPoaProfessionTypeId}
                          // residenceStatusTypeId={partyPoaResidenceStatusTypeId}
                          setResidenceStatusTypeId={setPartyPoaResidenceStatusTypeId}
                          // businessNatureTypeId={partyPoaBusinessNatureTypeId}
                          setBusinessNatureTypeId={setPartyPoaBusinessNatureTypeId}
                          // countryofIncorporationTypeId={partyPoaCountryofIncorporationTypeId}
                          setCountryofIncorporationTypeId={setPartyPoaCountryofIncorporationTypeId}
                          selectedDob={partyPoaDob}
                          setSelectedDob={setPartyPoaDob}
                        />
                      </>) : null}
                    </>)
                    :
                    [USER_TYPE_TEXT.SELLERPOA].includes(formValues?.userType) ? (
                      <>
                        {/* Seller / counterPoa */}
                        {((form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.SELLERPOA || formValues?.userType === USER_TYPE_TEXT.SELLERPOA) || (form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.SELLER || formValues?.userType === USER_TYPE_TEXT.SELLER) || form.getFieldValue("isCounterPoa") == true) ? (<>
                          <PoaDetailsForm
                            prefix="counterPoa"
                            poaParty="Seller"
                            form={form}
                            // formValues={formValues}
                            setFormValues={setFormValues}
                            userExists={counterUserExists}
                            setUserExists={setCounterUserExists}
                            country={counterPoaCountry}
                            setCountry={setCounterPoaCountry}
                            countryCode={counterPoaCountryCode}
                            setCountryCode={setCounterPoaCountryCode}
                            nationality={counterPoaNationality}
                            isDraft={isDraft}
                            setNationality={setCounterPoaNationality}
                            // nationalityCallingCode={counterPoaNationalityCallingCode}
                            setNationalityCallingCode={setCounterPoaNationalityCallingCode}
                            setUserAlias={setCounterPoaAlias}
                            fileList={counterPoaDocuments}
                            setFileList={setCounterPoaDocuments}
                            poaDetails={chequeDetails?.counterPoaDetails}
                            setDocumentCheck={setCounterPoaDocCheck}
                            // setUserOnboarded={setCounterPoaOnboarded}
                            // professionTypeId={counterPoaProfessionTypeId}
                            setProfessionTypeId={setCounterPoaProfessionTypeId}
                            // residenceStatusTypeId={counterPoaResidenceStatusTypeId}
                            setResidenceStatusTypeId={setCounterPoaResidenceStatusTypeId}
                            // businessNatureTypeId={counterPoaBusinessNatureTypeId}
                            setBusinessNatureTypeId={setCounterPoaBusinessNatureTypeId}
                            // countryofIncorporationTypeId={counterPoaCountryofIncorporationTypeId}
                            setCountryofIncorporationTypeId={setCounterPoaCountryofIncorporationTypeId}
                            selectedDob={counterPoaDob}
                            setSelectedDob={setCounterPoaDob}
                          />
                        </>) : null}
                      </>
                    ) : ""}

                     <hr className={Width > 425 ? "lightgrayHr mb-4" : "lightgrayHr mb-4 mt-5"} />                            
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
                          name="itemCategoryAlias"
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
                              onRCCategoryChange(aliasName);
                              setdidsubmit(1);
                            }}
                            showSearch
                            allowClear
                            optionFilterProp="children"
                          >
                            {rsCatList.map((item:any) => {
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
                          name="itemTypeAlias"
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
                              onRCTypeChange(aliasName);
                              setdidsubmit(1);
                            }}
                            popupClassName="lowerz"
                            showSearch
                            allowClear
                            optionFilterProp="children"
                          >
                            {rsItemList.map((category:any) => {
                              return (
                                <Option key={category.aliasName} value={category.aliasName}>
                                  {category.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                      </Col> 
                      <Col span={Width < 992 ? 24 : 8} className="pe-4">
                        <p className="enter-text-category">Item name</p>
                        <Form.Item
                          name="itemName"
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
                          onInput={() => {
                            setdidsubmit(1);
                          }}
                          onChange={(e) => validateDescription(e)}
                        />
                      </Form.Item>
                    </Row>
                    {
                      form.getFieldValue('transactionType') !==  MC_TYPE.RECEIVE ? 
                      <>
                      <div>
                        <span className="stepDetails fw-400 mb-2 mt-3 textOverflow">
                          Do you want to split the Trustin platform fees?
                        </span>
                        {/* <span className="stepDetails_medium_sub">
                          {" "}
                          (Fees will be split between Buyer & Seller)
                        </span> */}
                        <Tooltip
                          title={
                            <span className="response-tooltip">
                              Choose whether the transaction fees should be divided between the Buyer & Seller.
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
                          <Radio.Group 
                            onChange={(e) => handleSplit(e)}
                            defaultValue="NO"
                          >
                            <Radio value="YES">Yes</Radio>
                            <Radio value="NO">No</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </div>
                     </> 
                     : null
                    }
                    
                    {splitOption && form.getFieldValue('transactionType') !==  MC_TYPE.RECEIVE &&  (
                      <Row>
                        {counterParty == 'Seller' ?
                          <>
                          <Col span={Width < 992 ? 24 : 8}>
                            <p className="enter-text-category">
                              Buyer&apos;s
                              percentage
                            </p>
                            <Form.Item
                              name={`buyerPercent`}
                              className="inputField w-100 error-input"
                              rules={[
                                {
                                  required: !isDraft,
                                  message: "Percent is required!",
                                },
                                {
                                  validator(_, value) {
                                    if (isDraft) {
                                      return Promise.resolve();
                                    }
                                    if (value === "") {
                                      return Promise.resolve();
                                    }
                                    if (parseFloat(value) <= 100) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject("Percent exceeds 100%!");
                                  },
                                },
                              ]}
                            >
                              <Input
                                suffix={"%"}
                                placeholder="Enter percentage"
                                type="number"
                              onChange={(e) => { 
                                // formValues["changeInvoiceAmount"] = e?.target?.value 
                                if (e?.target?.value != "") {
                                  form.setFieldValue("sellerPercent", 100 - parseFloat(e?.target?.value));
                                  setFormValues((prevState:any) => ({
                                    ...prevState,
                                    buyerPercent: parseFloat(e?.target?.value),
                                    sellerPercent: 100 - parseFloat(e?.target?.value),
                                  }));
                                } else {
                                  form.setFieldValue("sellerPercent", null);
                                }
                              }}
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
                              Seller&apos;s
                              percentage
                            </p>
                            <Form.Item
                              name={`sellerPercent`}
                              className="inputField w-100 error-input"
                              
                            >
                              <Input
                                placeholder={`Will display as per buyer's %`}
                                disabled
                                suffix={"%"}
                              />
                            </Form.Item>
                          </Col>
                          </> : <>
                          <Col span={Width < 992 ? 24 : 8}>
                            <p className="enter-text-category">
                              Seller&apos;s
                              percentage
                            </p>
                            <Form.Item
                              name={`sellerPercent`}
                              className="inputField w-100 error-input"
                               rules={[
                                {
                                  required: !isDraft,
                                  message: "Percent is required!",
                                },
                                {
                                  validator(_, value) {
                                    if (isDraft) {
                                      return Promise.resolve();
                                    }
                                    if (value === "") {
                                      return Promise.resolve();
                                    }
                                    if (parseFloat(value) <= 100) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject("Percent exceeds 100%!");
                                  },
                                },
                              ]}
                            >
                              <Input
                                suffix={"%"}
                                placeholder="Enter percentage"
                                type="number"
                                onChange={(e) => {
                                  // formValues["changeInvoiceAmount"] = e?.target?.value 
                                  if (e?.target?.value != "") {
                                    form.setFieldValue("buyerPercent", 100 - parseFloat(e?.target?.value));
                                    setFormValues((prevState:any) => ({
                                      ...prevState,
                                      sellerPercent: parseFloat(e?.target?.value),
                                      buyerPercent: 100 - parseFloat(e?.target?.value),
                                    }));
                                  } else {
                                    form.setFieldValue("buyerPercent", null);
                                  }
                                }}
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
                              Buyer&apos;s percentage
                            </p>
                            <Form.Item
                              name={`buyerPercent`}
                              className="inputField w-100 error-input"
                            >
                              <Input
                                placeholder={`Will display as per seller's %`}
                                disabled
                                suffix={"%"}
                              />
                            </Form.Item>
                          </Col>

                          </>
                            }
                      </Row>
                    )}
                    <Row>
                      <Col md={24}>

                   
                      
                        <div id="new-escrow">
                            <hr className="lightgrayHr mb-5 mt-4" /> 


                            <div className="titleText mt-4 mb-4">
                            { [USER_TYPE_TEXT.BUYER, USER_TYPE_TEXT.BUYERPOA].includes(formValues?.userType) ?
                             <div className="titleText mt-4 mb-4">
                                           {" "}
                                           {modifyCresetUserType(userAlias,'Seller')}&apos;s details
                                         </div>
                             :
                               [USER_TYPE_TEXT.SELLER, USER_TYPE_TEXT.SELLERPOA].includes(formValues?.userType) ? (
                                <div className="titleText mt-4 mb-4">
                                              {" "}
                                              {modifyCresetUserType(userAlias,'Buyer')}&apos;s details
                                            </div>
                              ) : "" }
                            </div>
                         
                       

                            <SellerDetail
                              formValues={formValues}
                              setFormValues={setFormValues}
                              form={form}
                              currency={currency}
                              setCurrency={setCurrency}
                              userExists={userExists}
                              setUserExists={setUserExists}
                              setCountryPhone={setCountryPhone}
                              doneSubmit={doneSubmit}
                              callingCode={callingCode}
                              setCallingCode={setCallingCode}
                              setSellerExist={setSellerExist}
                              isSellerExist={isSellerExist}
                              countryError={countryError}
                              setCountryError={setCountryError}
                              sellerCountryError={sellerCountryError}
                              setSellerCountryError={setSellerCountryError}
                              setCounterCountry={setCounterCountry}
                              setCounterNationality={setCounterNationality}
                              nationalityCallingCode={nationalityCallingCode}
                              setNationalitytCallingCode={setNationalitytCallingCode}
                              nationalityIsoCode={nationalityIsoCode}
                              setNationalityIsoCode={setNationalityIsoCode}
                              setFileList2={setFileList2}
                              fileList2={fileList2}
                              category={category}
                              itemType={itemType}
                              minimumValue={minimumValue}
                              isSellerDocCheck={isSellerDocCheck}
                              isSellerRegistered={isSellerRegistered}
                              setIsSellerRegistered={setIsSellerRegistered}
                              chequeDetails={chequeDetails}
                              counterParty={counterPartyName()}
                              setSearchCounterDetails={setSearchCounterDetails}
                              buyerCountry={buyerCountry}
                              setSellerAlias={setSellerAlias}
                              taxDetails={taxDetails}
                              setTaxDetails={setTaxDetails}
                              setCounterParty={setCounterParty}
                              isPartyPoa={isPartyPoa}
                              setIsPartyPoa={setIsPartyPoa}
                              isDraft={isDraft}
                              isCounterPoa={isCounterPoa}
                              setIsCounterPoa={setIsCounterPoa}
                              isPartyBroker={isPartyBroker}
                              setIsPartyBroker={setIsPartyBroker}
                              isCounterBroker={isCounterBroker}
                              setIsCounterBroker={setIsCounterBroker}

                              // setFatfList={setFatfList}
                              // setFatfTypeId={setFatfTypeId}
                              setProfessionTypeId={setProfessionTypeId}
                              setProfessionTypeList={setProfessionTypeList}
                              setResidenceStatusTypeId={setResidenceStatusTypeId}
                              setResidenceStatusList={setResidenceStatusList}
                              setBusinessNatureTypeId={setBusinessNatureTypeId}
                              setBusinessNatureList={setBusinessNatureList}
                              setCountryofIncorporationTypeId={setCountryofIncorporationTypeId}
                              setIncoporationCountryList={setIncoporationCountryList}
                              setSelectedDate={setSelectedDate}
                              professionTypeList={professionTypeList}
                              residenceStatusList={residenceStatusList}
                              businessNatureList={businessNatureList}
                              incoporationCountryList={incoporationCountryList}
                              selectedDate={selectedDate}
                              />
                            
                        {[USER_TYPE_TEXT.BUYERPOA, USER_TYPE_TEXT.BUYER].includes(formValues?.userType) ?
                          (<>
                            {/* Seller / counterPoa */}
                            {((form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.SELLERPOA || formValues?.userType === USER_TYPE_TEXT.SELLERPOA) || ((form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.SELLER || formValues?.userType === USER_TYPE_TEXT.SELLER) ) || form.getFieldValue("isCounterPoa") == true) ? (<>
                              <hr className={Width > 425 ? "lightgrayHr mb-4" : "lightgrayHr mb-4 mt-5"} /> 
                              <PoaDetailsForm
                                prefix="counterPoa"
                                poaParty="Seller"
                                form={form}
                                // formValues={formValues}
                                setFormValues={setFormValues}
                                userExists={counterUserExists}
                                setUserExists={setCounterUserExists}
                                country={counterPoaCountry}
                                setCountry={setCounterPoaCountry}
                                countryCode={counterPoaCountryCode}
                                setCountryCode={setCounterPoaCountryCode}
                                nationality={counterPoaNationality}
                                isDraft={isDraft}
                                setNationality={setCounterPoaNationality}
                                // nationalityCallingCode={counterPoaNationalityCallingCode}
                                setNationalityCallingCode={setCounterPoaNationalityCallingCode}
                                setUserAlias={setCounterPoaAlias}
                                fileList={counterPoaDocuments}
                                setFileList={setCounterPoaDocuments}
                                poaDetails={chequeDetails?.counterPoaDetails}
                                setDocumentCheck={setCounterPoaDocCheck}
                                // setUserOnboarded={setCounterPoaOnboarded}
                                // professionTypeId={counterPoaProfessionTypeId}
                                setProfessionTypeId={setCounterPoaProfessionTypeId}
                                // residenceStatusTypeId={counterPoaResidenceStatusTypeId}
                                setResidenceStatusTypeId={setCounterPoaResidenceStatusTypeId}
                                // businessNatureTypeId={counterPoaBusinessNatureTypeId}
                                setBusinessNatureTypeId={setCounterPoaBusinessNatureTypeId}
                                // countryofIncorporationTypeId={counterPoaCountryofIncorporationTypeId}
                                setCountryofIncorporationTypeId={setCounterPoaCountryofIncorporationTypeId}
                                selectedDob={counterPoaDob}
                                setSelectedDob={setCounterPoaDob}
                              />
                            </>) : null}

                          </>)
                          :
                          [USER_TYPE_TEXT.SELLERPOA, USER_TYPE_TEXT.SELLER].includes(formValues?.userType) ? (
                            <>
                              {/* Buyer / partyPoa */}
                              {((form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.BUYERPOA || formValues?.userType === USER_TYPE_TEXT.BUYERPOA) || (form.getFieldValue("contractStartedBy") === USER_TYPE_TEXT.BUYER || formValues?.userType === USER_TYPE_TEXT.BUYER) || form.getFieldValue("isPartyPoa") == true) ? (<>
                                <hr className={Width > 425 ? "lightgrayHr mb-4" : "lightgrayHr mb-4 mt-5"} /> 
                                <PoaDetailsForm
                                  prefix="partyPoa"
                                  poaParty="Buyer"
                                  form={form}
                                  // formValues={formValues}
                                  setFormValues={setFormValues}
                                  userExists={partyUserExists}
                                  setUserExists={setPartyUserExists}
                                  country={partyPoaCountry}
                                  setCountry={setPartyPoaCountry}
                                  countryCode={partyPoaCountryCode}
                                  setCountryCode={setPartyPoaCountryCode}
                                  nationality={partyPoaNationality}
                                  setNationality={setPartyPoaNationality}
                                  isDraft={isDraft}
                                  // nationalityCallingCode={partyPoaNationalityCallingCode}
                                  setNationalityCallingCode={setPartyPoaNationalityCallingCode}
                                  setUserAlias={setPartyPoaAlias}
                                  fileList={partyPoaDocuments}
                                  setFileList={setPartyPoaDocuments}
                                  poaDetails={chequeDetails?.partyPoaDetails}
                                  setDocumentCheck={setPartyPoaDocCheck}
                                  // setUserOnboarded={setPartyPoaOnboarded}
                                  // professionTypeId={partyPoaProfessionTypeId}
                                  setProfessionTypeId={setPartyPoaProfessionTypeId}
                                  // residenceStatusTypeId={partyPoaResidenceStatusTypeId}
                                  setResidenceStatusTypeId={setPartyPoaResidenceStatusTypeId}
                                  // businessNatureTypeId={partyPoaBusinessNatureTypeId}
                                  setBusinessNatureTypeId={setPartyPoaBusinessNatureTypeId}
                                  // countryofIncorporationTypeId={partyPoaCountryofIncorporationTypeId}
                                  setCountryofIncorporationTypeId={setPartyPoaCountryofIncorporationTypeId}
                                  selectedDob={partyPoaDob}
                                  setSelectedDob={setPartyPoaDob}
                                />
                              </>) : null}
                            </>
                          ) : ""}

                          {/* bank   */}
                          {
                            formValues?.transactionType ===  MC_TYPE.RECEIVE ? 
                            <>
                            <hr className="lightgrayHr mt-4" /> 
                              <MCBankAccount
                                category={category}
                                itemType={itemType}
                                minimumValue={minimumValue}
                                currency={currency}
                                isDraft={isDraft}
                                payoutAccount={payoutAccount}
                                formValues={formValues}
                                setFormValues={setFormValues}
                                setPayoutAccount={setPayoutAccount}
                                form={form}
                                setOpenAddBankAccountModal={setOpenAddBankAccountModal}
                                bankAccountList={bankAccountList}
                              /> </> : null
                            }

                            <RequestPaymentDetails 
                              formValues={formValues}
                              setFormValues={setFormValues}
                              setPlatformCharge={setPlatformCharge}
                              doneSubmit={doneSubmit}
                              taxDetails={taxDetails}
                              setTaxDetails={setTaxDetails}
                              setBuyerAmount={setBuyerAmount}
                              setInvoiceCalculations={setInvoiceCalculations}
                              hasAdvisor={false}
                              hideSellerAmount={true}
                              sellerAlias={sellerAlias} 
                              
                            />  
                        </div>  
                       
                        <hr className="lightgrayHr mb-5 mt-4"/>
                          <div className="mt-4 mb-4">
                            <div className="titleText mt-4 mb-4">
                              Contract documents
                            </div>
                            <div> {/* style={{ marginBottom: "80px"}} */}
                              <CustomContract 
                                form={form} 
                                setCustomObj={setCustomField} 
                                customAttach={customAttach} 
                                setCustomAttach ={setCustomAttach} 
                                customAttachmentIds = {customAttachmentIds}
                                setCustomAttachmentIds = {setCustomAttachmentIds}
                                setCustomAttachUrl={setCustomAttachUrl} 
                                customAttachmentUrls={customAttachmentUrls} 
                                setCustomAttachmentUrls={setCustomAttachmentUrls}
                                chequeDetails={chequeDetails}
                              />
                            </div>
                            <Row className="mt-0 mx-2">
                              <ul className="stepDetails_medium_sub">
                                <li>
                                  Form F
                                </li>
                                <li>
                                  Initial contract of sale or Title deed (if available)
                                </li>
                                <li>
                                  Other Sales related document
                                </li>
                              </ul>
                            </Row>
                            {/* </div> */}
                            <hr className="lightgrayHr mb-5 mt-4"/>
                            <div>
                              <ChequeCard 
                              invoiceCalculations={invoiceCalculations}
                              formValues={formValues} 
                              setPreparedCheques={setPreparedCheques}
                              preparedCheques={preparedCheques} 
                              setGlobalRemainingAmount={setGlobalRemainingAmount}
                              globalRemainingAmount={globalRemainingAmount}
                              />
                            </div>
                            <Row>
                              <ul className="stepDetails_medium_sub">
                                <li>
                                  Enter the beneficiary split for the cheque — specify how the payment will be divided.
                                </li>
                              </ul>
                            </Row>
                            { [USER_TYPE_TEXT.BUYER, USER_TYPE_TEXT.BUYERPOA].includes(formValues?.userType) ? (
                              <>
                              <hr className="lightgrayHr" />
                              <SourceOfFunds
                                setSourceOfFundIds={setSourceOfFundIds}
                                sourceOfFundIds={sourceOfFundIds}
                                setSourceOfFundUrls={setSourceOfFundUrls}
                                sourceOfFundUrls={sourceOfFundUrls}
                                setLoading={setLoading}
                                isDraft={isDraft}
                                form={form}
                              />
                              <Row>
                                <ul className="stepDetails_medium_sub">
                                  <li>
                                    Upload bank statement(s) evidencing the funds used to purchase the property
                                  </li>
                                </ul>
                              </Row>
                              </>
                            ) : null}
                            <hr className="lightgrayHr mb-5 mt-4" /> 
                              <> 
                                <Signature
                                  signature={signature}
                                  signatureId={signatureId}
                                  setSignature={setSignature}
                                  setSignatureId={setSignatureId}
                                  setLoading={setLoading}
                                  name="fromSign"
                                  // signatureReq={signatureReq}
                                  // setsignatureReq={setsignatureReq}
                                  contractExist={false}
                                  chequeDetails={chequeDetails}
                                  isDraft={isDraft}
                                />
                                <Row>
                                  <ul className="stepDetails_medium_sub mt-4">
                                    <li>
                                      TrustIn will check the documents against the agreement and
                                      payment will be released to the {modifyCresetUserType(userAlias,'seller')}.
                                    </li>
                                    <li>
                                      We will notify both the parties by email on every action and steps.
                                      Involved parties can track the live status on the platform as well.
                                      
                                    </li>
                                  </ul>
                                </Row>
                                { (formValues['userType'] === "BUYER" && formValues["transactionType"] == MC_TYPE.REQUEST) ||
                                  (formValues['userType'] === "SELLER" && formValues["transactionType"] == MC_TYPE.RECEIVE)  ? 

                                  walletAmountAndCount?.availableAmount >= invoiceCalculations?.totalAmount ? 
                                    <Row>
                                      <Form.Item
                                        name="allocatedFund"
                                        valuePropName="checked"
                                        className="inputField w-100 radioInput">
                                        <Checkbox className="mt-1">
                                          <SmallText
                                            className="formSubText forgetpassword agreeEscrow"
                                              children={
                                                <>
                                                  You have 
                                                  {` ${currency || "AED"}  `}
                                                  {  parseFloat(invoiceCalculations?.totalAmount).toFixed(2)  }
                                                    {` `}available in your escrow balance. Would you like to auto-assign these funds to this Manager Cheque transaction? 
                                                      <Tooltip
                                                          title={
                                                            <span className="response-tooltip">
                                                              If not marked now, you will have to come later to add funds.
                                                            </span>
                                                          }
                                                          overlayClassName='custom-tooltip info-icon'
                                                          placement={Width > 475 ? "right" : "top"}
                                                        >
                                                          <img src={infoIcon} className="ms-1"/>
                                                        </Tooltip>
                                                </>
                                              }
                                              style={{ textAlign: "start" }}
                                          />
                                        </Checkbox>
                                      </Form.Item>
                                    </Row>
                                  : 
                                    <Row>
                                      <Form.Item
                                        name="autoAssignFund"
                                        valuePropName="checked"
                                        className="inputField w-100 radioInput">
                                        <Checkbox className="mt-1">
                                          <SmallText
                                            className="formSubText forgetpassword agreeEscrow text-break text-wrap"
                                              children={
                                                <>
                                                  No funds are currently available. Would you like us to auto-assign the funds to this Manager Cheque transaction when new funds are added?
                                                    <Tooltip
                                                        title={
                                                          <span className="response-tooltip">
                                                            If not marked now, you will have to come later to add funds.
                                                          </span>
                                                        }
                                                        overlayClassName='custom-tooltip info-icon'
                                                        placement={Width > 475 ? "right" : "top"}
                                                      >
                                                      <img src={infoIcon} className="ms-1"/>
                                                    </Tooltip>
                                                </>
                                              }
                                              style={{ textAlign: "start" }}
                                          />
                                        </Checkbox>
                                      </Form.Item>
                                    </Row>
                               : null }
                                </>
                            <hr className={Width > 425 ? "lightgrayHr mb-4" : "lightgrayHr mb-4 mt-5"} />

                            <Form.Item
                              name="agreement"
                              valuePropName="checked"
                              className="inputField w-100 radioInput"
                              rules={[
                                {
                                  validator: (_, value) =>
                                    !isDraft
                                      ? value
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Please read and agree!"))
                                      : Promise.resolve(),
                                },
                              ]}
                            >
                              <Checkbox
                                className="mt-1"
                              >
                                <SmallText
                                  className="formSubText forgetpassword agreeEscrow"
                                    children={
                                      <>
                                        I agree to TrustIn {" "}
                                        <ViewButton
                                          className="mb-0 escrowTerms"
                                          children="Escrow Terms & Conditions"
                                          onClick={()=>{
                                            let tncLink = EscrowTermsandCondition;
                                            const specialUsers = process.env.SPECIAL_USER_ALIASES ? process.env.SPECIAL_USER_ALIASES.split(','): [];
                                            if (SpecialTermsAndCondition 
                                              && specialUsers.includes(userAlias)
                                            ) {
                                              tncLink = SpecialTermsAndCondition;
                                            }
                                            window.open(tncLink,'_blank')
                                          }}
                                        />
                                      </>
                                    }
                                    style={{ textAlign: "start" }}
                                />
                              </Checkbox>
                            </Form.Item>
                         

                            
                            
                            <div className={Width > 550 ?"mb-4 d-flex" : "d-flex flex-column"}>
                                  <Button
                                    className="modal-button w-auto"
                                    htmlType="submit"
                                    loading={loading}
                                    onClick={() => {
                                      setIsDraft(false);
                                      setButtonStatus("PENDING");
                                      setButtonText("Preview");
                                    }}
                                  >
                                    {
                                      (
                                        form.getFieldValue('transactionType') === "RECEIVE"  ? 
                                          ( form.getFieldValue('isSellerOnboarded') === "NO" ?  "Preview and Submit" : "Preview and send") :
                                          ( form.getFieldValue('isSellerOnboarded') === "NO" ?  "Preview and submit" : `Send to ${counterPartyName()}`)
                                      )
                                    }
                                  
                                  </Button>
                                  <span style={{display:"none"}}>
                                  <SecondaryOutLineButton
                                    className={Width > 550 ? "w-auto mx-3" :"w-auto mx-0 my-3"}
                                    children="Save as Draft"
                                    htmlType="submit"
                                    loading={loading}
                                    // shouldUpdate
                                    onClick={() => {
                                      setIsDraft(true);
                                      form.setFieldsValue({ required: false });
                                      setButtonStatus("DRAFT");
                                      setButtonText("Preview");
                                    }}/>
                                    </span>
                            </div>
                             
                        </div>
                      </Col>
                    </Row>
                  </div>
                
              </Card>
              </DefaultLayout>
            </div>
              </Form>
      
      <Modal
        className="modal-box"
        open={showPreviewModal}
        onCancel={() => handleCancelPreview()}
        width={"80%"}
        footer={false}
      >
        <ChequePreview 
          chequeDetail={previewValue}  
          itemdetails={itemdetails}
          partyDetails={partyDetails}
          counterDetails={counterDetails}
          bankDetails={bankDetails}
          taxDetails={taxDetails}
          signature={signature} 
          customAttachUrl={customAttachUrl} 
          customAttachmentUrls={customAttachmentUrls}
          fileList2={fileList2}
          sourceOfFundUrls={sourceOfFundUrls}
          invoiceCalculations={invoiceCalculations}
          preparedCheques={preparedCheques}
          formValues={formValues}
          party={partyName()}
          counterParty={counterPartyName()}
          countryList={countryList}
        />
          <span className="edit-btn" style={{display:buttonStatus === "DRAFT"?"none":""}}>
          <Button
            className={Width > 505 ? "rounded w-auto mx-2" :"rounded w-auto"}
            loading={loading}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            { buttonStatus === "DRAFT" ? "Save as draft" :  
             (
               form.getFieldValue('transactionType') === "RECEIVE"  ? ( form.getFieldValue('isSellerOnboarded') === "NO" ?  "Preview and Submit" : "Submit") :
               isSellerRegistered  ?  `Send to ${counterPartyName()}` : `Submit`
             )
            }
          </Button></span>
          <span className="edit-btn mt-3">
          {/* <SecondaryOutLineButton
            className={"w-100 mx-0"}
            loading={loading}
            onClick={() => { handleCancelPreview() }}
          >Edit </SecondaryOutLineButton> */}
          <Button 
          className={Width > 505 ? "edit-button-outline mt-1 mx-2" :"edit-button-outline mt-0 mx-2"}  loading={loading} onClick={() => { handleCancelPreview() }} >Edit</Button>
          </span>
      </Modal>
      <Modal
        open={error.status}
        onOk={() => setError({ status: false, message: "" })}
        onCancel={() => setError({ status: false, message: "" })}
        footer={false}
        className="text-center modal-box"
        width={410}
      >
        <AuthTitle children={"Warning"}  className="red"/>
        <NormalText children={error.message} className="my-5" />
      </Modal> 

      <AddBankAccountModal open={openAddBankAccountModal} setOpen={setOpenAddBankAccountModal} onSuccess={onAddBankAccountSuccess}/>
     
 
      </Spin>
    </>
  );
};
export default CreateCheque;
