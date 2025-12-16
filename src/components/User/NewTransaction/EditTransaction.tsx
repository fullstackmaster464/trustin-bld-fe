import { useEffect, useState } from "react";
import { USER_TYPE_TEXT, VALID_CURRENCY, getLocalStorage, modifyCresetUserType } from "../../Common/Constants";
import {
  getAllItemType,
  getContractDetails,
  getPaymentDetails,
  getUserData,
} from "../../../services/admin";
import { useLocation, useNavigate } from "react-router-dom";
import { Dashboard, SuccessTxn } from "../../Common/RouteConst";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Image,
  Modal,
  Row,
  Tooltip,
  message,
  notification,
} from "antd";
import {
  checkEnvStatus,
  createEscrowTransaction,
  getAllCountries,
  getContractsDetails,
  getlocalBankDetails,
  updateDocusign,
  updateUserAddress,
  uploadSignedDoc,
  virtualAccountAndAddress,
} from "../../../services/user";
import Create from "../../../assets/img/createEscrow.svg";
import CreateNewEscrow from "./CreateNewEscrow";
import PaymentDetails from "./PaymentDetails";
import CustomContract from "./CustomContract";
import PaymentRelease from "./PaymentRelease";
import {
  SecondaryOutLineButton,
} from "../../ui-elements/ButtonRepo";
import DefaultLayout from "../../Common/DefaultLayout";
import AddressDetails from "./AddressDetails";
import { AuthTitle, NormalText } from "../../ui-elements/TextRepo";
// import ViewSecondary from "../../../assets/img/View_secondary.svg";
import TransactionPreview from "./TransactionPreview";
import infoIcon from "../../../assets/img/informIcon.svg"
// import TransactionDetails from "./TransactionDetails";

const EditTransaction = ():any => {
  const [formValues, setFormValues] = useState<any>({
    userType: USER_TYPE_TEXT.BUYER,
    subContractParty: USER_TYPE_TEXT.TENENT,
    currency: VALID_CURRENCY[0],
  });
  const [buyerCount, setBuyerCount] = useState(null);
  const [buyerCountOpposite, setBuyerCountOpposite] = useState(null);
  const [enableMultiBuyer, setEnableMultiBuyer] = useState(false);
  const [enableMultiBuyerOpposite, setEnableMultiBuyerOpposite] = useState(false);
  const [buyers, setBuyers] = useState<any>([]);
  const [buyersOpposite, setBuyersOpposite] = useState<any>([]);
  const [buttonStatus, setButtonStatus] = useState<any>();
  const [isMatchAmount, setIsMatchAmount] = useState<any>();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewValue,setPreviewValue] = useState({})
  const [editInvoiceAmount, setEditInvoiceAmount] = useState(false);
  const [editContractDetails, setEditContractDetails] = useState<any>({});
  const [advisorDetails, setAdvisorDetails] = useState<any>({});
  const [editPaymentDetails, setEditPaymentDetails] = useState<any>([]);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [platformCharge, setPlatformCharge] = useState(0);
  const [leftAmount, setLeftAmount] = useState(0);
  const [countryPhone, setCountryPhone] = useState(0);
  // const [countryList, setCountryList] = useState<any[]>([]);
  const [amountDiffrence, setAmountDiffrence] = useState("");
  const [addedDoc, setAddedDoc] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const [userExists, setUserExists] = useState(false);
  // const [contractStartedBy, setContractStartedBy] = useState(null);
  const [countryError, setCountryError] = useState({ status: false });
  const [amount, setAmount] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [pageloading, setPageLoading] = useState(true);
  const [taxDetails, setTaxDetails] = useState<any>({});
  const [doneSubmit, setdoneSubmit] = useState<any>("");
  const [signature, setSignature] = useState<any>("");
  const [EscrowAdvisorFee, setEscrowAdvisorFee] = useState<any>("");
  const [advisorFeeType, setAdvisorFeeType] = useState<any>("FIXED");
  const [buyerCommissionPercent,setBuyerCommissionPercent] = useState<any>(0);
  const [buyerPercent,setBuyerPercent] = useState<any>(0);
  const [signatureId, setSignatureId] = useState<any>("");
  const [customField, setCustomField] = useState<any>("");
  const [customAttachUrl, setCustomAttachUrl]= useState<any>("");
  const [customAttachmentUrls, setCustomAttachmentUrls] = useState<any>([]);
  const [customAttach, setCustomAttach]= useState<any>();
  const [customAttachmentIds, setCustomAttachmentIds] = useState<any>([]);
  const [isManualsignature, setisManualSignature] = useState(true);
  const [docusignDone, setDocusignDone] = useState<any>(null)
  const [error, setError] = useState({ status: false, message: "" });
  const contractId = window?.location?.pathname.split("/").pop();
  const [isVirtualAccount, setIsVirtualAccount] = useState(false);
  const [RequriedDoc, setRequriedDoc] = useState<any>({});
  const [invoiceCalculations,setInvoiceCalculations] = useState<any>({
    platformFee: 0,
    platformPercent: 0,
    minimumPlatformCharge: 0,
    vatFee: 0,
    buyerTransactionFee: 0,
    sellerTransactionFee: 0,
    buyerAdvisorFee: 0,
    sellerAdvisorFee: 0,
    buyerTotalFee:0,
    sellerTotalFee:0,
    buyerAmount:0,
    sellerAmount:0,
    totalAmount:0,
    milestonePercent:0
  });
  const [requiredDocError, setRequiredDocError] = useState<any>({ status: false });
  const [sellerCountryError,setSellerCountryError] = useState({ status: false });
  const [setIsoCode] = useState("");
  // const [buyerAmount, setBuyerAmount] = useState({});
  const local = getLocalStorage("auth");
  const UserAlias = JSON.parse(getLocalStorage("auth")!);
  const userData = local ? JSON.parse(local) : null;
  const name = userData ? userData?.name : "";
  const userAlias = userData ? userData?.userAlias : "";
  
  const entityType = userData ? userData?.entityType : ""; 
  const [buyerAmount, setBuyerAmount] = useState({});
  const [sellerAmount, setSellerAmount] = useState<number>(0);
  const [itemName,setitemName] = useState("")
  const [categoryName,setcategoryName] = useState("");
  const [callingCode, setCallingCode] = useState('');
  const [buttonText,setButtonText] = useState('')
  const [hasAdvisor, setHasAdvisor] = useState(false);
  const [advisorExists, setAdvisorExists] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [BuyerCountry,setBuyerCountry] = useState("")
  const [partyCountry,setPartyCountry] = useState("")
  const [payoutAccount, setPayoutAccount] = useState<any>(null);
  const [bankAccountList, setBankAccountList] = useState<any>([]);

  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [sellerDetails,setSellerDetails] = useState({})
  const [buyerDetails,setBuyerDetails] = useState({})
  const [sourceOfFundIds, setSourceOfFundIds] = useState<any>([]);
  const [sourceOfFundUrls, setSourceOfFundUrls] = useState<any>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isDraftedContract = queryParams.get('isDraftedContract');

  const itemsDetails:any = {};
  Object.keys(amount).forEach((key:any) => {
    if (amount[key] === undefined) {
      delete amount[key];
    }
  });

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  const handleCancelPreview = () => {
    setShowPreviewModal(false);
    setButtonText("")
  };
  const getContract = (id: any, type?: string) => {    
    getContractsDetails(id,type).then((res:any)=>{
      setDocusignDone(res?.data?.contractDetails?.getContractDetails?.fromSign !== null ? res?.data?.contractDetails?.getContractDetails?.fromSign : null);
      const tmpAdvisorFeeType = res?.data?.contractPaymentDetails?.advisorFeeType
      let tmpCommission = res?.data?.contractPaymentDetails?.escrowAdvisorCommission
      const tmpInvoiceAmount = Number(res?.data?.contractDetails?.getContractDetails?.invoiceAmount)
      if (tmpAdvisorFeeType === 'PERCENT') {
        tmpCommission = Number(tmpCommission) * 100 / tmpInvoiceAmount;
      }
      form.setFieldsValue({name:res?.data?.contractDetails?.getContractDetails?.name,
        description:res?.data?.contractDetails?.getContractDetails?.description
      })
      form.setFieldsValue({
        sellerContactEmail: res?.data?.contractDetails?.sellerDetails?.email,
        sellerContactNumber: res?.data?.contractDetails?.sellerDetails?.contactNumber,
        sellerContactName: res?.data?.contractDetails?.sellerDetails?.name,
        sellerCountry: res?.data?.contractDetails?.sellerDetails?.countryAlias,
        sellerTransactionFor: res?.data?.contractDetails?.getContractDetails?.agreementType,
        sellerCompanyName: res?.data?.contractDetails?.getContractDetails?.companyName,
      });
      setEscrowAdvisorFee(tmpCommission)
      setAdvisorFeeType(res?.data?.contractPaymentDetails?.advisorFeeType)
      setBuyerCommissionPercent(res?.data?.contractPaymentDetails?.buyerCommissionPercent || 0)
      setBuyerPercent(res?.data?.contractPaymentDetails?.buyerPercent)
      
    }).catch(()=>{ 
      message.error("Could not fetch contract details. Please try again later!")
    })
  }

  useEffect(()=>{    
    getContract(contractId, isDraftedContract == 'true' ? "draft" : "")
  },[])

  useEffect(() => {
    setPageLoading(true)
    virtualAccountAndAddress(userAlias).then((response: any) => {
      setPageLoading(false)
      setIsVirtualAccount(response?.data?.isVirtualAccount);
    });
    getAllItemType(entityType)
      .then(() => {
        setPageLoading(false)
         itemsDetails["itemTypeAlias"]?.data?.filter((item:any) => item.name === form.getFieldsValue(['itemTypeAlias'])['itemTypeAlias'])[0].aliasName
         itemsDetails["itemCategoryAlias"]?.data?.filter((item:any) => item.name === form.getFieldsValue(['itemCategoryAlias'])['itemCategoryAlias'])[0].aliasName
      })
      .catch((error) => {
        setPageLoading(false)
        console.log("Error!", error);
      });
    // assignItemCategory();
      getContractDetails(contractId, userAlias, isDraftedContract == "true" ? "draft" : "")
      .then((response) => {

        
        
        
        const buyerList = response.data?.buyerList || [];
        const sellerList = response.data?.sellerList || [];

        const formatedData = (list: any[], role: "BUYER" | "SELLER") => {
          const map = new Map<string | number, any>();
          list.forEach((entry: any, idx: number) => {
            const userDet = entry.userDetail || {};
            const email = userDet.email || entry.email || "";
            const alias = entry.userAlias || userDet.userAlias || entry.aliasName;
            const key = email || alias || idx; 

            const obj = {
              id: entry?.id || userDet?.id || idx + 1,
              userAlias: alias,
              type: role,
              email: email,
              name: userDet?.name || entry?.name || "",
              contact: userDet?.contactNumber || entry?.contactNumber || entry?.contact || "",
              country: userDet?.countryAlias || entry?.countryAlias || "AE",
              callingCode: userDet?.callingCode || entry?.callingCode || "+971",
              isMain: (userDet && (userDet.isMainUser === true)) || entry.isMainUser || false,
            };

            if (!map.has(key)) {
              map.set(key, obj);
            } else {
              const existing = map.get(key);
              if ((obj.isMain && !existing.isMainUser) || (!existing.userAlias && obj.userAlias)) {
                map.set(key, { ...existing, ...obj });
              }
            }
          });
          return Array.from(map.values());
        };

        const formattedBuyers = formatedData(buyerList, "BUYER");
        const formattedSellers = formatedData(sellerList, "SELLER");

        
        
        if(response?.data?.contractStartedBy === USER_TYPE_TEXT.BUYER){
          setBuyers(formattedBuyers);
          setBuyersOpposite(formattedSellers);
          
          const hasMultipleBuyers = formattedBuyers.length > 1;
          const hasMultipleSellers = formattedSellers.length > 1;

          setEnableMultiBuyer(hasMultipleBuyers);
          setEnableMultiBuyerOpposite(hasMultipleSellers);

          if (hasMultipleBuyers) {
            form.setFieldsValue({ multipartyOption: "YES" });
          }
          if (hasMultipleSellers) {
              form.setFieldsValue({ multipartyOptionOpposite: "YES" });
          }
          setBuyerCount(formattedBuyers?.length as any);
          setBuyerCountOpposite(formattedSellers?.length as any);
        }else{
          setBuyers(formattedSellers);
          setBuyersOpposite(formattedBuyers);
          
          const hasMultipleBuyers = formattedSellers.length > 1;
          const hasMultipleSellers = formattedBuyers.length > 1;

          setEnableMultiBuyer(hasMultipleBuyers);
          setEnableMultiBuyerOpposite(hasMultipleSellers);
          if (hasMultipleBuyers) {
            form.setFieldsValue({ multipartyOptionOpposite: "YES" });
          }
          if (hasMultipleSellers) {
            form.setFieldsValue({ multipartyOption: "YES" });
          }
          setBuyerCount(formattedSellers?.length as any);
          setBuyerCountOpposite(formattedBuyers?.length as any);
        }

        setPageLoading(false)
        setAdvisorDetails(response.data?.escrowAdvisorDetails)
        setEditContractDetails(response.data);
        const countryCode = response?.data?.contractStartedBy === USER_TYPE_TEXT.BUYER ? response?.data?.sellerDetails?.countrycode : response?.data?.buyerDetails?.countrycode
        setCallingCode(countryCode)
        setSignature(response?.data?.signatureFileUrl);
        setSignatureId(response?.data?.fromSign)
      })
      .catch((error) => {
        setPageLoading(false)
        console.log("Error!", error);
      });
      getPaymentDetails(contractId, isDraftedContract == "true" ? "draft" : "")
      .then((response) => {
        setPageLoading(false)
        setEditPaymentDetails(response.data);
        if (response.data.fromEnvelope) {
          setisManualSignature(false);
        }
        if (response.data.customAttach) {
          setCustomAttach(response.data.customAttach.id)
          setCustomAttachUrl(response.data.customAttach.url);
        }
        if (response.data.customAttachments?.length) {
          const tmpIds = [];
          const tmpUrls = [];
          for (let i = 0; i < response.data?.customAttachments.length; i++) {
            tmpIds.push(response.data?.customAttachments[i].id);
            tmpUrls.push(response.data?.customAttachments[i].url)
          }
          setCustomAttachmentIds(tmpIds);
          setCustomAttachmentUrls(tmpUrls);

        } else {
          if (response.data.customAttach) {
            setCustomAttachmentIds([response.data.customAttach.id]);//for older entries
            setCustomAttachmentUrls([response.data.customAttach.url]);//for older entries
          }
        }
      })
      .catch((error) => {
        setPageLoading(false)
        console.log("Error!", error);
      });
  }, []);

  useEffect(() => {
     getAllCountries()
          .then((response: any) => {
            // setCountryList(response?.data || []);
            getUserData(UserAlias?.email)
              .then((res: any) => {
                const countryName = response?.data.filter(
                  (country: any) => country.isoCode === res?.data?.countryAlias
                )[0]?.isoCode;
                if (res?.data?.userType !== USER_TYPE_TEXT.ESCROW_ADVISOR) {
                  setBuyerCountry(countryName)
                }

                const partyCnt = res?.data?.companyCountryIsoCode ? res?.data?.companyCountryIsoCode  : res?.data?.countryAlias
                setPartyCountry(partyCnt);
              })
          })
  }, []);

  useEffect(() => {
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
    
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);
  
  useEffect(() => {
    if (bankAccountList?.length > 0 && editPaymentDetails?.payoutAccountAlias) {
      const account = bankAccountList.find((account: any) => account.aliasName === editPaymentDetails.payoutAccountAlias)
      setPayoutAccount(account);
    }
  }, [bankAccountList, editPaymentDetails?.payoutAccountAlias])

  useEffect(() => {
    if (formValues?.userType === "SELLER") {
      setFormValues((prev: any) => ({
        ...prev, payoutCurrency: payoutAccount?.accountCurrency ?? payoutAccount?.currency
      }))
    } else {
      setFormValues((prev: any) => ({
        ...prev, payoutCurrency: undefined
      }))
    }
  }, [payoutAccount?.accountCurrency, payoutAccount?.currency, formValues?.userType])

  useEffect(() => {
    setRequiredDocError({ status: false });
  }, [RequriedDoc]);

  window.addEventListener("beforeunload", (event) => {
    window.location.pathname === "/create-new-transaction"
      ? (event.returnValue = "")
      : event.preventDefault();
  });

  const redirectOnSend = (
    contractId: string,
    userType: any,
    url: string
  ) => {
    navigate(SuccessTxn, {
      state: {
        url: url,
        contractId: contractId,
        userType: userType,
        from: formValues.subContractParty,
        to: formValues.subContractCounterParty
      },
    });
  };

  const redirectOnDashboard = () => {
    navigate(Dashboard);
  };

  const openNotification = (msg = "") => {
    notification.info({
      message: "Error",
      description: msg ? msg : "Please sign document",
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    });
  };
  const changeStatusHandler = async () => {
    setLoading(true);
    try {
      const res = await checkEnvStatus(editPaymentDetails.fromEnvelope);
      if (res.data.status === "completed") {
        updateDocusign({ contractId, userAlias: userAlias, statusId: 1 })
          .then(() => {
            uploadSignedDoc({ id: editPaymentDetails.fromEnvelope, contractId })
              .then(() => {
                setLoading(false);
                redirectOnDashboard();
              })
              .catch(() => {
                setLoading(false);
                openNotification("Something went's wrong");
              });
          })
          .catch(() => {
            setLoading(false);
            openNotification("Something went's wrong");
          });
      } else {
        openNotification();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const onFinish = (values: any) => {

    // Validate buyers and buyersOpposite: ensure emails are present, valid and unique across both arrays
    
    const participants = [...(buyers || []), ...(buyersOpposite || [])].filter(Boolean);
    
    
    if (participants.length) {
      // simple email regex
      const emailRegex = /^\S+@\S+\.\S+$/;
      // check for missing/invalid emails
      const invalid = participants.find(
        (p: any) => !p?.email || !emailRegex.test((p.email || "").trim())
      );
      if (invalid) {
        setLoading(false);
        message.error("Please provide a valid email for all participants.");
        return;
      }
      // check uniqueness (case-insensitive)
      const emails = participants.map((p: any) => (p.email || "").trim().toLowerCase());
      const duplicate = emails.find((e: string, i: number) => emails.indexOf(e) !== i);
      if (duplicate) {
        setLoading(false);
        message.error(`Duplicate email detected: ${duplicate}`);
        return;
      }
    }
    
    if (buttonText === "Preview") {
      gotoPreview();
      return false;
    } else {
      const contractStartedBy = editPaymentDetails?.contractStartedBy;
      const isDrafted = isDraftedContract == "true";
      if (
        (contractStartedBy === "ESCROW_ADVISOR" && docusignDone === null) ||
        (!isDrafted && contractStartedBy !== "ESCROW_ADVISOR" && docusignDone !== null) ||
        (isDrafted && contractStartedBy !== "ESCROW_ADVISOR")
      ) {
        if (editPaymentDetails.fromEnvelope) {
          changeStatusHandler();
          // return;
        }
        setdoneSubmit(true);
        values["contractAlias"] = contractId;
        setLoading(true);
        const dynamicInputFields: any = [];
        const milestoneList: any = [];
        const customFieldList: any = {};

        for (const key in customField) {
          const keyVal: any = key;
          const Key = `cp${key}`;
          customFieldList[Key] = Object.values(customField)[keyVal];
        }

        for (const key in values) {
          if (key.split("_")[0] === "dynamicInputFields") {
            dynamicInputFields.push({
              aliasName: Object.keys(values[key])[0],
              value: Object.values(values[key])[0],
            });
            delete values[key];
          }
        }
        // for (let key in values) {
        //   if (key.split("_")[0] === "Doc") {
        //     documentList.push(values[key]);
        //     delete values[key];
        //   }
        // }

        if (!isDrafted && values.isMilestone === false && Object.values(RequriedDoc).length <= 0) {
          setLoading(false);
          setRequiredDocError({
            message: "Documents required",
            status: true,
          });
          return;
        }
        for (const key in values) {
          if (key.split("_")[0] === "milestone") {
            values[`milestone_` + key.split("_")[1]].releaseDate =
              values[`milestone_` + key.split("_")[1]].releaseDate.format("YYYY-MM-DD");
            milestoneList.push(values[key]);
            delete values[key];
          }
        }
        if (values.isMilestone === false) {
          values["milestoneCount"] = 1;
        }
        if (values?.buyerPercent) {
          values.sellerPercent = values.otherPercent;
        } else {
          values.buyerPercent = values.otherPercent;
        }

        if (!values?.fromSign) {
          values.fromSign = editContractDetails?.fromSign;
        } else {
          values.fromSign = values.fromSign.file.response.id;
        }

        if (!values?.splitOption || values?.splitOption === "NO") {
          values.sellerPercent = 0;
          values.buyerPercent = 100;
        }

        if ((values?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || values?.advisorContactEmail) && !values?.splitCommissionOption || values?.splitCommissionOption === "NO") {
          values.sellerCommissionPercent = 0;
          values.buyerCommissionPercent = 100;
        }

        if (!values.isMilestone) {
          values["isMilestone"] = false;
        }

        if(values?.address1 && values?.address2 && values?.address3 && values?.countryCode && values?.cityCode && values?.postalCode && values?.phoneNumber) {

          const address = {
            address1: values?.address1,
            address2: values?.address2,
            address3: values?.address3,
            cityCode: values?.cityCode,
            countryCode: values?.countryCode,
            postalCode: values?.postalCode,
            stateCode: values?.cityCode,
            phoneNumber: values?.phoneNumber,
            userAlias: userAlias,
            updatedBy: name
          } 
          updateUserAddress(userAlias,address)
          .then(() => {})
          .catch((err: any) => {
            setLoading(false);
            setError({
              status: err.data?.statusCode,
              message: err?.data?.message,
            });
          })
        }

        // Build maps of existing buyer/seller userAlias (or ids) from editContractDetails
        const existingBuyerMap: any = {};
        const existingSellerMap: any = {};
        if (editContractDetails?.buyerList?.length) {
          editContractDetails.buyerList.forEach((b: any) => {
            const email = b?.userDetail?.email || b?.email;
            if (email) {
              existingBuyerMap[email] = b?.userAlias || b?.userDetail?.userAlias || b?.userAlias;
              existingBuyerMap[`${email}_id`] = b?.id || b?.userDetail?.id || b?.userId;
            }
          });
        }
        if (editContractDetails?.sellerList?.length) {
          editContractDetails.sellerList.forEach((s: any) => {
            const email = s?.userDetail?.email || s?.email;
            if (email) {
              existingSellerMap[email] = s?.userAlias || s?.userDetail?.userAlias || s?.userAlias;
              existingSellerMap[`${email}_id`] = s?.id || s?.userDetail?.id || s?.userId;
            }
          });
        }

        const requestBody:any = {
          ...editContractDetails,
          ...values,
          

          
          userEntityType: entityType,
          userAlias: userAlias,
          clientAlias: "TRUST",
          dynamicInputFields: dynamicInputFields,
          documentList: RequriedDoc,
          milestoneList: milestoneList,
          milestoneCount: milestoneList.length,
          countrycode:callingCode,
          status: buttonStatus,
          fromSign: values?.fromSign === "" ? undefined : values?.fromSign?.file?.response?.id ? values?.fromSign?.file.response.id : values?.fromSign,
          customPoint: customFieldList,
          customAttach : customAttach ? customAttach : null,
          customAttachments: customAttachmentIds,
          platformChargeAppliedOn:taxDetails?.platformChargeAppliedOn,
          payoutAccountAlias: payoutAccount?.aliasName
        };
        if (hasAdvisor && values.advisorFeeType === 'PERCENT' && values.escrowAdvisorCommission) {
          requestBody.escrowAdvisorCommission = Number(values.escrowAdvisorCommission) * Number(values.invoiceAmount) * 0.01;
        }

        if(values?.contractStartedBy === USER_TYPE_TEXT.BUYER) {
          requestBody.sourceOfFunds = sourceOfFundIds
        }

        if(values.contractStartedBy === "BUYER"){ 
          if(buyers.length){
            requestBody.buyerList = buyers.map((item: any) => {
              const mappedUserAlias = item.userAlias || existingBuyerMap[item.email];
              const mappedId = item.id || existingBuyerMap[`${item.email}_id`];
              const buyerObj: any = {
                email: item.email,
                name: item.name,
                contactNumber: item.contact,
                countryAlias: item.country,
                countrycode: item.callingCode,
                role: "BUYER",
                userType: "USER",
                isMainUser: item.isMainUser ?? item.isMain,
              };
              if (mappedUserAlias) buyerObj.userAlias = mappedUserAlias;
              if (mappedId) buyerObj.id = mappedId;
              return buyerObj;
            })
          }
          if(buyersOpposite.length){
            requestBody.sellerList = buyersOpposite.map((item: any) => {
              const mappedUserAlias = item.userAlias || existingSellerMap[item.email];
              const mappedId = item.id || existingSellerMap[`${item.email}_id`];
              const sellerObj: any = {
                email: item.email,
                name: item.name,
                contactNumber: item.contact,
                countryAlias: item.country,
                countrycode: item.callingCode,
                role: "SELLER",
                userType: "USER",
                isMainUser: item.isMainUser ?? item.isMain,
              };
              if (mappedUserAlias) sellerObj.userAlias = mappedUserAlias;
              if (mappedId) sellerObj.id = mappedId;
              return sellerObj;
            })
        }

        }else{
          if(buyers.length){
          requestBody.sellerList = buyers.map((item: any) => {
            const mappedUserAlias = item.userAlias || existingBuyerMap[item.email];
            const mappedId = item.id || existingBuyerMap[`${item.email}_id`];
            const buyerObj: any = {
              email: item.email,
              name: item.name,
              contactNumber: item.contact,
              countryAlias: item.country,
              countrycode: item.callingCode,
              role: "SELLER",
              userType: "USER",
              isMainUser: item.isMainUser ?? item.isMain,
            };
            if (mappedUserAlias) buyerObj.userAlias = mappedUserAlias;
            if (mappedId) buyerObj.id = mappedId;
            return buyerObj;
          })
        }
        if(buyersOpposite.length){
            requestBody.buyerList = buyersOpposite.map((item: any) => {
              const mappedUserAlias = item.userAlias || existingSellerMap[item.email];
              const mappedId = item.id || existingSellerMap[`${item.email}_id`];
              const sellerObj: any = {
                email: item.email,
                name: item.name,
                contactNumber: item.contact,
                countryAlias: item.country,
                countrycode: item.callingCode,
                role: "BUYER",
                userType: "USER",
                isMainUser: item.isMainUser ?? item.isMain,
              };
              if (mappedUserAlias) sellerObj.userAlias = mappedUserAlias;
              if (mappedId) sellerObj.id = mappedId;
              return sellerObj;
            })
          }
        } 

        // assignItemCategory();

        // setContractStartedBy(requestBody.contractStartedBy);
        requestBody.currency = formValues?.currency || "AED";
        if (
          (leftAmount === 0 || !requestBody.isMilestone || milestoneList.length > 0) &&
          !countryError.status
        ) {
          setIsMatchAmount("");
          setAmountDiffrence("");
          createEscrowTransaction(requestBody)
            .then((res) => {
              setdoneSubmit(true);
              setLoading(false);
              if (res.status === 201 || res.status === 200) {
                // TODO: needs to pass values from api response
                buttonStatus === "SEND"
                  ? userExists
                    ? redirectOnSend(
                        res?.data?.contractId,
                        contractStartedBy,
                        `${window.location.protocol}//${window.location.host}/transaction-details/${res?.data?.contractId}&src=sharing`
                      )
                    : redirectOnSend(
                        res?.data?.contractId,
                        contractStartedBy,
                        `${window.location.protocol}//${window.location.host}/signup?referrer=transaction-details/${res?.data?.contractId}&src=sharing`
                      )
                  : redirectOnDashboard();
              }
            })
            .catch(() => {
              setLoading(false);
              setdoneSubmit(false);
            });
        }
      } else {
        message.info(`Signature is pending. So can not send the transaction to ${modifyCresetUserType(userAlias,formValues?.userType === USER_TYPE_TEXT.BUYER ? "seller" : "buyer")}. Please check your mail.`)
      }
    }
  };

  // const getNationalityInfo = (countryValue: string) => {
  //   const found = countryList?.find(
  //     (c: any) => c.isoCode === countryValue || c.name === countryValue
  //   );
  //   return {
  //     kycNationality: countryValue || "United Arab Emirates",
  //     nationalityName: found?.name || countryValue || "United Arab Emirates",
  //   };
  // };
  const gotoPreview = async () => {
    try {
      if (sellerCountryError && sellerCountryError?.status !== true) {
        await form.validateFields()
        const values = form.getFieldsValue()
        const dynamicInputFields = [];
        const milestoneList = [];
        const customFieldList: any = {};

        for (const key in customField) {
          const keyVal: any = key
          const Key = `cp${key}`;
          customFieldList[Key] = Object.values(customField)[keyVal];
        }

        for (const key in values) {
          const val: any = values
          if (key.split("_")[0] === "dynamicInputFields") {
            dynamicInputFields.push({
              aliasName: Object.keys(val[key])[0],
              value: Object.values(val[key])[0],
            });
            delete val[key];
          }
        }
        // for (let key in values) {
        //   let val:any = values
        //   if (key.split("_")[0] === "Doc") {
        //     documentList.push(val[key]);
        //     delete val[key];
        //   }
        // }
        for (const key in values) {
          const val: any = values
          if (key.split("_")[0] === "milestone") {
            milestoneList.push(val[key]);
            delete val[key];
          }
        }
        if (values.isMilestone === false) {
          values["milestoneCount"] = 1;
        }
        if (values?.buyerPercent) {
          values.sellerPercent = values.otherPercent;
        } else {
          values.buyerPercent = values.otherPercent;
        }

        if (!values?.splitOption || values?.splitOption === "NO") {
          values.sellerPercent = 0;
          values.buyerPercent = 100;
        }
        if (!values?.splitCommissionOption || values?.splitCommissionOption === "NO") {
          values.sellerCommissionPercent = 0;
          values.buyerCommissionPercent = 100;
        }
        const requestBody: any = {
          ...values,
          userAlias: userAlias,
          clientAlias: "TRUST",
          dynamicInputFields: dynamicInputFields,
          documentList: RequriedDoc,
          milestoneList: milestoneList,
          milestoneCount: milestoneList.length,
          countrycode: callingCode,
          status: buttonStatus,
          fromSign: values?.fromSign === "" ? undefined : values?.fromSign?.file.response.id,
          customPoint: customFieldList,
          customAttach: customAttach,
          customAttachments: customAttachmentIds
        }
        if (hasAdvisor && values.advisorFeeType === 'PERCENT' && values.escrowAdvisorCommission) {
          requestBody.escrowAdvisorCommission = Number(values.escrowAdvisorCommission) * Number(values.invoiceAmount) * 0.01;
        }
        // setContractStartedBy(requestBody.contractStartedBy);
        if (requestBody?.contractStartedBy != "ESCROW_ADVISOR") {
          // const sellerCountry =
          //   requestBody?.contractStartedBy === "BUYER"
          //     ? requestBody?.sellerCountry
          //     : requestBody?.buyerCountry;

          const currentBuyerDetails = editContractDetails?.buyerDetails || {};
          const buyerCountry = requestBody?.contractStartedBy === 'BUYER' ? requestBody?.buyerCountry : requestBody?.sellerCountry;

          setBuyerDetails({
            name: requestBody?.contractStartedBy === 'BUYER' ? requestBody?.buyerContactName : requestBody?.sellerContactName,
            email: requestBody?.contractStartedBy === 'BUYER' ? requestBody?.buyerContactEmail : requestBody?.sellerContactEmail,
            countryAlias: buyerCountry,
            kycNationality: currentBuyerDetails.kycNationality || currentBuyerDetails.nationalityName,
            nationalityName: currentBuyerDetails.nationalityName || currentBuyerDetails.kycNationality 
          });

          const currentSellerDetails = editContractDetails?.sellerDetails || {};
          const sellerCountry = requestBody?.contractStartedBy === 'BUYER' ? requestBody?.sellerCountry : requestBody?.buyerCountry;

          setSellerDetails({
            name: requestBody?.contractStartedBy === 'BUYER' ? requestBody?.sellerContactName : requestBody?.buyerContactName,
            email: requestBody?.contractStartedBy === 'BUYER' ? requestBody?.sellerContactEmail : requestBody?.buyerContactEmail,
            countryAlias: sellerCountry,
            kycNationality: currentSellerDetails.kycNationality || currentSellerDetails.nationalityName,
            nationalityName: currentSellerDetails.nationalityName || currentSellerDetails.kycNationality 
          });
          if (userAlias === editContractDetails?.sellerDetails?.userAlias) {
            setBuyerDetails(editContractDetails?.sellerDetails);
          } else {
            setBuyerDetails(editContractDetails?.buyerDetails);
          }
          // setBuyerDetails(editContractDetails?.buyerDetails);
          if (hasAdvisor) {
            setAdvisorDetails({
              name: requestBody?.advisorContactName,
              email: requestBody?.advisorContactEmail,
              countryAlias: requestBody?.advisorCountry
            })
          }
        } else {
          setSellerDetails({
            name: requestBody?.sellerContactName,
            email: requestBody?.sellerContactEmail,
            countryAlias: requestBody?.sellerCountry,
          });
          setBuyerDetails({
            name: requestBody?.buyerContactName,
            email: requestBody?.buyerContactEmail,
            countryAlias: requestBody?.buyerCountry,
          });
          setAdvisorDetails({
            name: requestBody?.advisorContactName,
            email: requestBody?.advisorContactEmail,
            countryAlias: requestBody?.advisorCountry
          })
        }

        requestBody.currency = formValues?.currency;
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
  
  return (
    <>
    <div className="fullHeight scrollbar-container">
      <DefaultLayout
        page="create"
        loading={pageloading}
        TitleText="Escrow Transactions"
        TitleImage={Create}
        headerPage={
          <div className="d-flex">
          <Image
            src={Create}
            preview={false}
            className="mt-2"
            alt="escrowimage"
          />
          <div className="ml-5">
            <b> Escrow transactions</b>
            <Breadcrumb separator=">">
              {/* <Breadcrumb.Item
                onClick={() => {
                  navigate(Dashboard);
                }}
                className="cursor"
              >
                Dashboard
              </Breadcrumb.Item> */}
              <Breadcrumb.Item>Escrow transactions</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
      }
      >
            <Card className="noBorder mt-6 p-4 mb-3 status">
              <div>
                <div className="titleText mb-4">Edit escrow transaction</div>
                <Row>
                  <Col md={24}>
                    <div id="new-escrow">
                      <Form  scrollToFirstError={{
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'center',
                      }} onFinish={onFinish} form={form}>
                        <CreateNewEscrow
                          formValues={formValues}
                          setFormValues={setFormValues}
                          form={form}
                          buyers={buyers}
                          setBuyers={setBuyers}
                          buyersOpposite={buyersOpposite}
                          setBuyersOpposite={setBuyersOpposite}
                          buyerCount={buyerCount}
                          setBuyerCount={setBuyerCount}
                          buyerCountOpposite={buyerCountOpposite}
                          setBuyerCountOpposite={setBuyerCountOpposite}
                          enableMultiBuyer={enableMultiBuyer}
                          setEnableMultiBuyer={setEnableMultiBuyer}
                          enableMultiBuyerOpposite={enableMultiBuyerOpposite}
                          setEnableMultiBuyerOpposite={setEnableMultiBuyerOpposite}
                          setCurrencySymbol={setCurrencySymbol}
                          userExists={userExists}
                          setUserExists={setUserExists}
                          setCountryPhone={setCountryPhone}
                          countryPhone={countryPhone}
                          contractId={contractId}
                          editInvoiceAmount={editInvoiceAmount}
                          setEditInvoiceAmount={setEditInvoiceAmount}
                          setUserCountry={setUserCountry}
                          userCountry={userCountry}
                          countryError={countryError}
                          setCountryError={setCountryError}
                          doneSubmit={doneSubmit}
                          taxDetails={taxDetails}
                          setTaxDetails={setTaxDetails}
                          setcategoryName={setcategoryName}
                          setitemName={setitemName}
                          callingCode={callingCode}
                          setCallingCode={setCallingCode}
                          hasAdvisor={hasAdvisor}
                          sellerAmount={sellerAmount}
                          setHasAdvisor={setHasAdvisor}
                          advisorExists={advisorExists}
                          setAdvisorExists={setAdvisorExists}
                          advisorFeeType={advisorFeeType}
                          setAdvisorFeeType={setAdvisorFeeType}
                          isDraft={isDraft}
                          sellerCountryError={sellerCountryError}
                          setSellerCountryError={setSellerCountryError}
                          setIsCountrySelected={true}
                          setIsoCode={setIsoCode}
                          isDraftedContract={isDraftedContract}
                          BuyerCountry={BuyerCountry} 
                          partyCountry={partyCountry} 
                          payoutAccount={payoutAccount}
                          setPayoutAccount={setPayoutAccount}
                          bankAccountList={bankAccountList}
                          editContractDetails={editContractDetails}
                        />
                        <PaymentDetails
                          formValues={formValues}
                          setFormValues={setFormValues}
                          setPlatformCharge={setPlatformCharge}
                          doneSubmit={doneSubmit}
                          taxDetails={taxDetails}
                          setTaxDetails={setTaxDetails}
                          setSellerAmount={setSellerAmount}
                          setBuyerAmount={setBuyerAmount}
                          EscrowAdvisorFee={EscrowAdvisorFee}
                          advisorFeeType={advisorFeeType}
                          buyerCommissionPercent={buyerCommissionPercent}
                          buyerPercent={buyerPercent}
                          setInvoiceCalculations={setInvoiceCalculations}
                          hasAdvisor={hasAdvisor}
                          isDraft={isDraft}
                          isDraftedContract={isDraftedContract}
                        />
                        {!isVirtualAccount && editPaymentDetails?.contractStartedBy !== USER_TYPE_TEXT.ESCROW_ADVISOR &&(
                          <div>
                            <div className="titleText mb-4">Address</div>
                            <AddressDetails
                              formValues={formValues}
                              setFormValues={setFormValues}
                              form={form}
                              contractId={contractId}
                              setCurrencySymbol={setCurrencySymbol}
                              userExists={userExists}
                              setUserExists={setUserExists}
                              setCountryPhone={setCountryPhone}
                              isDraft={isDraft}
                              countryPhone={countryPhone}
                            />
                          </div>
                        )}
                        <hr className="lightgrayHr" />
                        <div>
                          {/* {formValues?.userType === USER_TYPE_TEXT.BUYER ? (
                            <div className="titleText mt-4 mb-4">
                              {" "}
                              Seller's details
                            </div>
                          ) : (
                            <div className="titleText mt-4 mb-4">
                              {" "}
                              Buyer's details
                            </div>
                          )} */}
                        </div>
                        {/* <div className="stepDetails fw-400 mb-2 mt-3 ">
                          Creating escrow transaction for?
                        </div> */}
                        {/* <TransactionDetails
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
                          doneSubmit={doneSubmit}
                          hasAdvisor={hasAdvisor}
                          isDraft={isDraft}
                          isDraftedContract={isDraftedContract}
                        /> */}
                        <div className="titleText mt-5 mb-4">
                          Custom Contract
                        </div>
                        <CustomContract
                          form={form}
                          setCustomObj={setCustomField}
                          customAttach = {customAttach}
                          setCustomAttach = {setCustomAttach}
                          customAttachmentIds = {customAttachmentIds}
                          setCustomAttachmentIds = {setCustomAttachmentIds}
                          customeEditData={editPaymentDetails.customPoint}
                          customAttachUrl = {customAttachUrl}
                          setCustomAttachUrl = {setCustomAttachUrl}
                          customAttachmentUrls={customAttachmentUrls}
                          setCustomAttachmentUrls={setCustomAttachmentUrls}
                          isDraft={isDraft}
                          isDraftedContract={isDraftedContract}
                        />
                        <div 
                          className="titleText mt-5 mb-4"
                          style={{display: "flex", alignItems: "center"}}
                        >
                          Release Payment: Conditions & Required Documents
                          <Tooltip
                            title={
                              <span className="response-tooltip">
                                Select &apos;Yes&apos; if you want to disburse the total amount in predefined milestones.
                              </span>
                            }
                            overlayClassName='custom-tooltip info-icon'
                            placement={Width > 475 ? "right" : "top"}
                          >
                            <img src={infoIcon} className="ms-1" />
                          </Tooltip>
                        </div>
                        <PaymentRelease
                          formValues={formValues}
                          form={form}
                          setFormValues={setFormValues}
                          leftAmount={leftAmount}
                          setLeftAmount={setLeftAmount}
                          isMatchAmount={isMatchAmount}
                          setIsMatchAmount={setIsMatchAmount}
                          currencySymbol={currencySymbol}
                          setAmount={setAmount}
                          amountDiffrence={amountDiffrence}
                          platformCharge={platformCharge}
                          setAddedDoc={setAddedDoc}
                          addedDoc={addedDoc}
                          setRequriedDoc={setRequriedDoc}
                          setRequriedDocError={setRequiredDocError}
                          requiredDocError= {requiredDocError}
                          contractId={contractId}
                          editInvoiceAmount={editInvoiceAmount}
                          setEditInvoiceAmount={setEditInvoiceAmount}
                          taxDetails={taxDetails}
                          signature={signature}
                          setSignature={setSignature}
                          signatureId={signatureId}
                          setSignatureId={setSignatureId}
                          setLoading={setLoading}
                          signatureReq={isManualsignature}
                          setsignatureReq={setisManualSignature}
                          buyerAmount={buyerAmount}
                          type={buttonText}
                          invoiceCalculations= {invoiceCalculations}
                          isDraft={isDraft}
                          isDraftedContract={isDraftedContract}
                          setSourceOfFundIds={setSourceOfFundIds}
                          sourceOfFundIds={sourceOfFundIds}
                          setSourceOfFundUrls={setSourceOfFundUrls}
                          sourceOfFundUrls={sourceOfFundUrls}
                        />
                       <div className={Width > 450 ? "mb-4 gap-3 d-flex" : "mb-4 d-flex flex-column gap-3"}>
                        { formValues?.userType !== USER_TYPE_TEXT.ESCROW_ADVISOR && (
                          <SecondaryOutLineButton
                            className="w-auto"
                            children="Save as Draft"
                            htmlType="submit"
                            loading={loading}
                            onClick={() => {
                              setButtonStatus("DRAFT");
                              setButtonText("Preview");
                              setIsDraft(true);
                              form.setFieldsValue({ required: false });
                            }}
                          />
                        )}
                         { formValues?.userType !== USER_TYPE_TEXT.ESCROW_ADVISOR && (
                          <Button
                            className="rounded w-auto"
                            style={{marginTop:'0px'}}
                            htmlType="submit"
                            loading={loading}
                            onClick={() => {setButtonStatus("SEND");setButtonText("Preview");
                              setIsDraft(false);
                              form.setFieldsValue({ required: true });
                            }}
                          >
                            Send to Submit
                          </Button>
                         )}
                         { formValues?.userType === USER_TYPE_TEXT.ESCROW_ADVISOR && (
                          <>
                           <Button
                           className="modal-button w-auto"
                           htmlType="submit"
                           loading={loading}
                           onClick={() => {
                             setButtonStatus("SEND");
                             setButtonText("Preview")
                           }}
                         >
                         Invite Users
                         </Button>
                          <SecondaryOutLineButton
                            children="Back to Home"
                            className="w-auto mx-4 mb-5"
                            onClick={() => {
                              navigate(Dashboard);
                            }}
                          />
                          </>
                         )}
                        </div>
                      </Form>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card>
            </DefaultLayout>
          </div>
          <Modal
            open={error.status}
            onOk={() => setError({ status: false, message: "" })}
            onCancel={() => setError({ status: false, message: "" })}
            footer={false}
            className="text-center modal-box"
            width={410}
          >
            <AuthTitle children={"Warning"}  className="red"/>
            <NormalText children={error.message} />
          </Modal>
          <Modal
        className="modal-box"
        open={showPreviewModal}
        onCancel={() => handleCancelPreview()}
        width={"80%"}
        footer={false}
      >
        <TransactionPreview 
          escrowAdvisorDetails={advisorDetails} 
          contractDetail={previewValue} 
          taxDetails={taxDetails} 
          buyers={buyers} 
          buyersOpposite={buyersOpposite}
          buyerDetails={buyerDetails} 
          sellerDetails={sellerDetails} 
          categoryName={categoryName} 
          itemName={itemName} 
          sourceOfFundUrls={sourceOfFundUrls}
          signature={signature} 
          invoiceCalculations={invoiceCalculations} 
          customAttachUrl={customAttachUrl} 
          customAttachmentUrls={customAttachmentUrls}
          isDraftedContract={isDraftedContract}
          payoutAccount={payoutAccount}
        />
        <Button
            className={Width > 500 ? "modal-button w-auto" :"modal-button w-100"}
            loading={loading}
            onClick={() => {onFinish(form.getFieldsValue()) }}
          >
          {buttonStatus === "DRAFT" ? "Save as draft" : "Save and Submit"}
          </Button>
          <SecondaryOutLineButton
            className={Width > 500 ? "w-100 mx-3" :"editBtn w-100 mx-0 my-3"}
            loading={loading}
            onClick={() => { handleCancelPreview() }}
          >Edit</SecondaryOutLineButton>
      </Modal>


      </>
  );
};
export default EditTransaction;
