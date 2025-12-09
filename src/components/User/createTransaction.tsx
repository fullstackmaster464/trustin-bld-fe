import {
  Breadcrumb,
  Col,
  Form,
  Row,
  Image,
  Card,
  Button,
  message,
  Spin,
  Tooltip
} from "antd";
import { BoldText, NormalText } from "../ui-elements/TextRepo";
import {
  SecondaryOutLineButton,
} from "../ui-elements/ButtonRepo";
import { useEffect, useState } from "react";
// import * as ibantools from "ibantools";
import Create from "../../assets/img/createEscrow.svg";
import { useNavigate } from "react-router-dom";
import {
  addUserAddress,
  checkEnvStatus,
  createEnvelopeApi,
  createEscrowTransaction,
  getContractsDetails,
  updateDocusign,
  uploadSignedDoc,
  virtualAccountAndAddress,
  getlocalBankDetails,
  getAllCountries,
  uploadPDFApi,
} from "../../services/user";
import { Modal } from "antd";
import { AuthTitle } from "../ui-elements/TextRepo";
import { USER_TYPE_TEXT, VALID_CURRENCY, getLocalStorage } from "../Common/Constants";
import { getUserData } from "../../services/admin";
import { Dashboard, SuccessTxn } from "../Common/RouteConst";
import CreateNewEscrow from "./NewTransaction/CreateNewEscrow";
import PaymentDetails from "./NewTransaction/PaymentDetails";
import PaymentRelease from "./NewTransaction/PaymentRelease";
// import TransactionDetails from "./NewTransaction/TransactionDetails";
import AddressDetails from "./NewTransaction/AddressDetails";
import { createPdf } from "./NewTransaction/pdfGeneratorHelper";
import CustomContract from "./NewTransaction/CustomContract";
import Warning from "../../assets/img/warningicon.svg";
import DefaultLayout from "../Common/DefaultLayout";
// import ViewSecondary from "../../assets/img/View_secondary.svg";
import TransactionPreview from "./NewTransaction/TransactionPreview";
import infoIcon from "../../assets/img/informIcon.svg";
import AddBankAccountModal from "./AddBankAccountModal";
// import MultiCounter from "./multi-counter";
// import TransactionDetails from "./NewTransaction/TransactionDetails";


const CreateTransaction = (): JSX.Element => {
  const [formValues, setFormValues] = useState<any>({
    userType: USER_TYPE_TEXT.BUYER,
    subContractParty: USER_TYPE_TEXT.TENENT,
    currency: VALID_CURRENCY[0],
  });
  const [buyerCount, setBuyerCount] = useState(null);
  const [buyerCountOpposite, setBuyerCountOpposite] = useState(null);
  const [enableMultiBuyer, setEnableMultiBuyer] = useState(false);
  const [enableMultiBuyerOpposite, setEnableMultiBuyerOpposite] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [buyersOpposite, setBuyersOpposite] = useState([]);
  const [isManualsignature, setisManualSignature] = useState(true);
  const [buttonStatus, setButtonStatus] = useState("");
  const [isMatchAmount, setIsMatchAmount] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [platformCharge, setPlatformCharge] = useState(0);
  const [leftAmount, setLeftAmount] = useState(0);
  const [countryPhone, setCountryPhone] = useState(0);
  // const [countryList, setCountryList] = useState<any[]>([]);
  const [amountDiffrence, setAmountDiffrence] = useState("");
  const [addedDoc, setAddedDoc] = useState(false);
  const [RequriedDoc, setRequriedDoc] = useState<any>({});
  const [userExists, setUserExists] = useState(false);
  const [advisorExists, setAdvisorExists] = useState(false);
  const [countryError, setCountryError] = useState({ status: false });
  const [amount, setAmount] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [isVirtualAccount, setIsVirtualAccount] = useState(false);
  const [isKycVerified, setIsKycVerified] = useState<any>(false);
  const [advisorDetails, setAdvisorDetails] = useState<any>({});
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [doneSubmit, setdoneSubmit] = useState(false);
  const [taxDetails, setTaxDetails] = useState({});
  const [signature, setSignature] = useState("");
  const [signatureId, setSignatureId] = useState<any>("");
  const [customField, setCustomField] = useState([]);
  const [customAttach, setCustomAttach] = useState<any>();
  const [customAttachmentIds, setCustomAttachmentIds] = useState<any>([]);
  const [customAttachUrl, setCustomAttachUrl] = useState<any>("");
  const [customAttachmentUrls, setCustomAttachmentUrls] = useState<any>([]);
  const [envelopId, setenvelopId] = useState("");
  const [contractId, setContractId] = useState("");
  const [error, setError] = useState({ status: false, message: "" });
  const [docuSignInfoPopup, setDocuSignInfoPopup] = useState(false);
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [docusignDone, setDocusignDone] = useState<any>(null)
  const navigate = useNavigate();
  const local = getLocalStorage("auth");
  const userData = local ? JSON.parse(local) : null;
  const email = userData ? userData?.email : "";
  const name = userData ? userData?.name : "";
  const userAlias = userData ? userData?.userAlias : "";
  const userType = userData ? userData?.userType : "";
  const entityType = userData ? userData?.entityType : "";
  const [openAddBankAccountModal, setOpenAddBankAccountModal] = useState<any>(false);
  const UserAlias = JSON.parse(getLocalStorage("auth")!);
  const [previewValue,setPreviewValue] = useState({})
  const [SellerDetails,setSellerDetails] = useState({})
  const [BuyerDetails,setBuyerDetails] = useState({})
  const [itemName,setitemName] = useState("")
  const [categoryName,setcategoryName] = useState("")
  const [form] = Form.useForm();
  const formValuesData = form.getFieldsValue();
  const [buttonText,setButtonText] = useState('');
  const [BuyerCountry,setBuyerCountry] = useState("")
  const [partyCountry,setPartyCountry] = useState("")
  const [hasAdvisor, setHasAdvisor] = useState(false);
  const [advisorFeeType, setAdvisorFeeType] = useState<any>("FIXED");
  const [sellerCountryError,setSellerCountryError] = useState({ status: false });
  const [callingCode, setCallingCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sourceOfFundIds, setSourceOfFundIds] = useState<any>([]);
  const [sourceOfFundUrls, setSourceOfFundUrls] = useState<any>([]);
  const [payoutAccount, setPayoutAccount] = useState<any>(null);
  const [bankAccountList, setBankAccountList] = useState<any>([]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    onFinish(form.getFieldsValue()).finally(() => {
      setIsSubmitting(false);
    });
  };

  const [isDraft, setIsDraft] = useState(false);
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
  const [buyerAmount, setBuyerAmount] = useState({});
  Object.keys(amount).forEach((key:any) => {
    if (amount[key] === undefined) {
      delete amount[key];
    }
  });
  const [sellerAmount, setSellerAmount] = useState<number>(0);
  const getContract =(id:any) => {
    getContractsDetails(id).then((res:any)=>{
      setDocusignDone(res?.data?.contractDetails?.getContractDetails?.fromSign !== null ? res?.data?.contractDetails?.getContractDetails?.fromSign : null);
    }).catch(()=>{
      message.error("Could not fetch contract details. Please try again later!")
    })
  }

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
        const values = form.getFieldsValue();
        const dynamicInputFields = [];
        const milestoneList = [];
        const customFieldList: any = {};

        for (const key in customField) {
          const Key = `cp${key}`;
          customFieldList[Key] = Object.values(customField)[key];
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
        let requestBody: any = {};
        requestBody = {
          ...values,
          userAlias: userAlias,
          clientAlias: "TRUST",
          dynamicInputFields,
          documentList: RequriedDoc,
          milestoneList,
          milestoneCount: milestoneList.length,
          status: buttonStatus,
          countrycode: callingCode,
          fromSign: values?.fromSign === "" ? undefined : values?.fromSign?.file.response.id,
          customPoint: customFieldList,
          customAttach: customAttach,
          customAttachments: customAttachmentIds,
          payoutAccountAlias: payoutAccount?.aliasName,
        };

        requestBody.currency = formValues?.currency || "AED";

        // === If NOT started by Escrow Advisor ===
        if (requestBody?.contractStartedBy !== "ESCROW_ADVISOR") {
          // const buyerEmail = requestBody.buyerContactEmail || userData?.email;
          // const sellerEmail = requestBody.sellerContactEmail;
          const buyerCountry = requestBody.buyerCountry || userData?.country;
          const sellerCountry = requestBody.sellerCountry;

          // // Get nationality info based on KYC
          // const buyerKycData = await getNationalityWithKyc(buyerEmail, buyerCountry);
          // const sellerKycData = await getNationalityWithKyc(sellerEmail, sellerCountry);

          setSellerDetails({
            name:
              requestBody?.contractStartedBy === "BUYER"
                ? requestBody?.sellerContactName
                : requestBody?.buyerContactName,
            email:
              requestBody?.contractStartedBy === "BUYER"
                ? requestBody?.sellerContactEmail
                : requestBody?.buyerContactEmail,
            countryAlias: sellerCountry,
            // ...getNationalityInfo(sellerCountry),
          });
          setBuyerDetails({
            name: userData?.name,
            email: userData?.email,
            countryAlias: buyerCountry,
            // ...getNationalityInfo(buyerCountry),
          });

          if (hasAdvisor) {
            const advisorCountry = requestBody?.advisorCountry;
            // const advisorEmail = requestBody.advisorContactEmail;
            // const advisorKycData = await getNationalityWithKyc(advisorEmail, advisorCountry);

            setAdvisorDetails({
              name: requestBody?.advisorContactName,
              email: requestBody?.advisorContactEmail,
              countryAlias: advisorCountry,
              // ...getNationalityInfo(advisorCountry),
            });
          }
        } 
        // === If started by ESCROW_ADVISOR ===
        else {
          // const sellerEmail = requestBody?.sellerContactEmail;
          // const buyerEmail = requestBody?.buyerContactEmail;
          // const advisorEmail = requestBody?.advisorContactEmail;

          const sellerCountry = requestBody?.sellerCountry;
          const buyerCountry = requestBody?.buyerCountry;
          const advisorCountry = requestBody?.advisorCountry;

          // KYC checks for all three
          // const sellerKycData = await getNationalityWithKyc(sellerEmail, sellerCountry);
          // const buyerKycData = await getNationalityWithKyc(buyerEmail, buyerCountry);
          // const advisorKycData = await getNationalityWithKyc(advisorEmail, advisorCountry);

          setSellerDetails({
            name: requestBody?.sellerContactName,
            email: requestBody?.sellerContactEmail,
            countryAlias: sellerCountry,
            // ...getNationalityInfo(sellerCountry),
          });

          setBuyerDetails({
            name: requestBody?.buyerContactName,
            email: requestBody?.buyerContactEmail,
            countryAlias: buyerCountry,
            // ...getNationalityInfo(buyerCountry),
          });

          setAdvisorDetails({
            name: requestBody?.advisorContactName,
            email: requestBody?.advisorContactEmail,
            countryAlias: advisorCountry,
            // ...getNationalityInfo(advisorCountry),
          });
        }
        if (hasAdvisor && values.advisorFeeType === 'PERCENT' && values.escrowAdvisorCommission) {
          requestBody.escrowAdvisorCommission = Number(values.escrowAdvisorCommission) * Number(values.invoiceAmount) * 0.01;
        }
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
    
    if (formValues?.userType === "SELLER") {
      setFormValues((prev: any) => ({
        ...prev, payoutCurrency: payoutAccount?.accountCurrency
      }))
    } else {
      setFormValues((prev: any) => ({
        ...prev, payoutCurrency: undefined
      }))
    }
  }, [payoutAccount?.accountCurrency, formValues?.userType])

  useEffect(() => {
    getAllCountries()
      .then((response: any) => {
        // setCountryList(response?.data || []);
        getUserData(UserAlias?.email)
          .then((res: any) => { 
            const countryName = response?.data.filter(
              (country: any) => country.isoCode === res?.data?.countryAlias
            )[0]?.isoCode;
            
            const partyCnt = res?.data?.companyCountryIsoCode ? res?.data?.companyCountryIsoCode  : res?.data?.countryAlias  
            setPartyCountry(partyCnt);
            if (res?.data?.userType !== USER_TYPE_TEXT.ESCROW_ADVISOR) {
              setBuyerCountry(countryName)
            }
            const currencySymbol = response?.data.filter(
              (country: any) => country.isoCode === res?.data?.countryAlias
            )[0]?.currency?.isoCode;
            form.setFieldsValue({ countryIsoCode: countryName });
            form.setFieldsValue({ currency: currencySymbol });
          })
      })

      
    if(userType === USER_TYPE_TEXT.ESCROW_ADVISOR) {
      setFormValues({
        userType: USER_TYPE_TEXT.ESCROW_ADVISOR
      })
    }
    
  }, []);

  useEffect(()=>{
    if(contractId) {
    getContract(contractId)
    }
  },[contractId])
  useEffect(() => {
    setCountryError({ status: false });
  }, [countryPhone]);
  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }
  useEffect(() => {
    setLoadingPage(true);
    virtualAccountAndAddress(userAlias).then((response: any) => {
      setLoadingPage(false)
      setIsVirtualAccount(response?.data?.isVirtualAccount);
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

    getUserData(email)
      .then((response) => {
        if (response.data.ekycStatus === true) {
          setIsKycVerified(response.data.ekycStatus);
          setShowVerificationModal(false);
        } else {
          setIsKycVerified(response.data.ekycStatus);
          setShowVerificationModal(true);
        }
      })
      .catch(() => {
        setLoadingPage(false)
        message.error("Could not fetch details. Please try again later!");
      });
      window.addEventListener('resize', ()=>{
        setWidthVal()
      });
      
      return () => window.removeEventListener('resize', setWidthVal);
  }, []);

  useEffect(() => {
    if (signature && formValuesData.fromSign) {
      setisManualSignature(false);
    }
    if(!signature){
      setisManualSignature(true);
      form.setFieldValue("fromSign",'')
    }

  }, [formValuesData]);

  const redirectOnSend = (
    contractId: any,
    url: any
  ) => {
    if (!envelopId) {
      pdfGenerate(contractId);
    }
    navigate(SuccessTxn, {
      state: {
        url: url,
        contractId: contractId,
        userType: userType,
      },
    });

  };

  const redirectOnDashboard = () => {
    navigate(Dashboard);
  };

  const handleCancel = () => {
    setIsKycVerified(false);
    navigate(Dashboard);
  };
    
  const handleCancelPreview = () => {
    setShowPreviewModal(false);
    setButtonText("")
  };

  const onAddBankAccountSuccess = () => {
    getlocalBankDetails(userAlias)
      .then((response) => {
        setBankAccountList(response.data.bankDetails);
        const primaryAccount = response.data.bankDetails?.find((account: any) => account.isPrimary);
        form.setFieldsValue({
          payout_account: primaryAccount?.aliasName,
        });
        setPayoutAccount(primaryAccount);
      })
      .catch();
  }
  
  const onFinish = async (values: any) => {
    if(buttonStatus == "DRAFT"){
        const sellerFields = [
          values.sellerContactEmail,
          values.sellerContactName,
          values.sellerContactNumber,
          values.sellerCountry
        ];
        const someSellerFieldPresent = sellerFields.some(field => !!field);
        const allSellerFieldsPresent = sellerFields.every(field => !!field);

        if (someSellerFieldPresent && !allSellerFieldsPresent) {
          message.error("If any seller field is filled, all seller fields (Name, Email, Number, Country) are required.");
          setLoading(false);
          return;
        } 
    }
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
    

    if(buttonText === 'Preview'){
      gotoPreview();
      return false
    } else{
      if (envelopId) {
        changeStatusHandler();
        return;
      }

      const bankResponse = await getlocalBankDetails(userAlias);
      if ((bankResponse?.data?.bankDetails?.length === 0 && formValues?.userType === USER_TYPE_TEXT.SELLER) || 
      (bankResponse?.data?.bankDetails?.length === 0 && formValues?.userType === USER_TYPE_TEXT.ESCROW_ADVISOR)){
        setLoading(false);
        setOpenAddBankAccountModal(true);
        return false;
      }
      if(!envelopId || (envelopId && docusignDone !== null)){
        if(buttonStatus === "SIGNATURE_PENDING") {
          setDocuSignInfoPopup(true);
        }
        setdoneSubmit(true);
        setLoading(true);
        const dynamicInputFields = [];
        const milestoneList = [];
        const customFieldList:any = {};

        for (const key in customField) {
          const Key = `cp${key}`;
          customFieldList[Key] = Object.values(customField)[key];
        }

        for (const key in values) {
          const val:any = values
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
          const val:any = values
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

        if ((values?.contractStartedBy === USER_TYPE_TEXT.ESCROW_ADVISOR || values?.advisorContactEmail) && !values?.splitCommissionOption || values?.splitCommissionOption === "NO") {
          values.sellerCommissionPercent = 0;
          values.buyerCommissionPercent = 100;
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
            createdBy: name,
            updatedBy: name
          }
          addUserAddress(address)
          .then(() => {})
          .catch((err: any) => {
            setLoading(false);
            setError({
              status: err.data?.statusCode,
              message: err?.data?.message,
            });
          })
        }

        const requestBody:any = {
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
          stateCode: form.getFieldsValue().cityCode,
          fromSign: values?.fromSign === "" ? undefined : values?.fromSign?.file.response.id,
          customPoint: customFieldList,
          customAttach :customAttach ? customAttach : null,
          customAttachments: customAttachmentIds,
          payoutAccountAlias: payoutAccount?.aliasName
        };
      
        if(values.contractStartedBy === "BUYER"){ 
          if(buyers.length){
            requestBody.buyerList = buyers.map((item: any) => ({
                email: item.email,
                name: item.name,
                contactNumber: item.contact,
                countryAlias: item.country,
                countrycode: item.callingCode,
                role: "BUYER",
                userType: "USER",
                isMainUser: item.isMain,
              }))
            }
          if(buyersOpposite.length){
            requestBody.sellerList = buyersOpposite.map((item: any) => ({
                email: item.email,
                name: item.name,
                contactNumber: item.contact,
                countryAlias: item.country,
                countrycode: item.callingCode,
                role: "SELLER",
                userType: "USER",
                isMainUser: item.isMain,
              }))
          }
        }else{
            if(buyers.length){
            requestBody.sellerList = buyers.map((item: any) => ({
                email: item.email,
                name: item.name,
                contactNumber: item.contact,
                countryAlias: item.country,
                countrycode: item.callingCode,
                role: "SELLER",
                userType: "USER",
                isMainUser: item.isMain,
              }))
            }
          if(buyersOpposite.length){
            requestBody.buyerList = buyersOpposite.map((item: any) => ({
                email: item.email,
                name: item.name,
                contactNumber: item.contact,
                countryAlias: item.country,
                countrycode: item.callingCode,
                role: "BUYER",
                userType: "USER",
                isMainUser: item.isMain,
              }))
          }
        }


        if(values?.contractStartedBy === USER_TYPE_TEXT.BUYER) {
          requestBody.sourceOfFunds = sourceOfFundIds
        }
 
        if (hasAdvisor && values.advisorFeeType === 'PERCENT' && values.escrowAdvisorCommission) {
          requestBody.escrowAdvisorCommission = Number(values.escrowAdvisorCommission) * Number(values.invoiceAmount) * 0.01;
        }
        // setContractStartedBy(requestBody.contractStartedBy);
        requestBody.currency = formValues?.currency || 'AED';
        if(leftAmount != 0 && requestBody.isMilestone){
          message.error("Please add your remaining amount to Milestone!")
        }
        if (
          (leftAmount === 0 || !requestBody.isMilestone) &&
          !countryError.status
        ) {
          setIsMatchAmount("");
          setAmountDiffrence("");
          
          createEscrowTransaction(requestBody)
            .then((res) => {
              setContractId(
                res?.data?.contractTransactionDetail?.contractId ||
                  res?.data?.contractId
              );
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
                  : buttonStatus === "SIGNATURE_PENDING"
                  ? pdfGenerate(
                      res?.data?.contractTransactionDetail?.contractId ||
                        res?.data?.contractId
                    )
                  : redirectOnDashboard();
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
        } 
        else {
          setLoading(false);
        }
      } else {
        message.info("Signature is pending.So can not send the transaction to seller. Please check your mail.")
      }
    }
  };

  const changeStatusHandler = async () => {
    setLoading(true);
    try {
      const res = await checkEnvStatus(envelopId);
      if (res.data.status === "completed") {
        updateDocusign({
          contractId,
          userAlias: userAlias,
          statusId: 1,
        })
          .then(() => {
            uploadSignedDoc({ id: envelopId, contractId })
              .then(() => {
                setLoading(false);
                redirectOnSend(
                  contractId,`${window.location.protocol}//${window.location.host}/transaction-details/${contractId}&src=sharing`
                );
              })
              .catch(() => {
                setLoading(false);
                message.error(
                  "Oops! Could not upload document. Please try again later!"
                );
              });
          })
          .catch(() => {
            setLoading(false);
            message.error(
              "Oops! Could not upload document. Please try again later!"
            );
          });
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const onclickDocusignPopup = () => {
    setDocuSignInfoPopup(false);
  };

  const createEnvelope = (data: any, transactionId: string) => {
    const payload = {
      uri: data.contractDetails.pdfDatas.url,
      email: email,
      name: name,
      transactionId,
      data: "fromEnvelope",
    };

    createEnvelopeApi(payload)
      .then((res) => {
        setenvelopId(res.data.envelopeId);
        // message.info("Please check your email and sign document");
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Something went wrong. Please try again later!");
      });
  };

  const uploadPDF = (pdfData: any, id: string) => {
    const data = new FormData();
    data.append("file", pdfData);
    data.append("id", id);
    uploadPDFApi(data)
      .then(() => {
        getContractsDetails(id).then((res) => {
          if (formValuesData?.fromSign === undefined || formValuesData?.fromSign === "" ) {
            createEnvelope(res.data, id);
          }
        });
      })
      .catch(() => {
        setLoading(false);
        message.error("Oops! Could not upload file. Please try again later!");
      });
  };
  // pdf start
  const pdfGenerate = (UrlData: any) => {
    createPdf({ contractId: UrlData }, "_blank")
    .then(async (res: any) => {
      const pdf = await res;
          uploadPDF(pdf.blobData, UrlData);
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later!");
        });
  };


  return (
    <>
    <Spin spinning={loading} className="mainloader" size="large">
      <div className="fullHeight scrollbar-container">
      <DefaultLayout
        page="create"
        TitleText="Escrow Transaction"
        TitleImage={Create}
        loading={loadingPage}
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
                        <Breadcrumb.Item className="breadcrumb-title-text">Escrow transactions</Breadcrumb.Item>
                      </Breadcrumb>
                    </div>
                  </div>
                }
      >
              <Card className="noBorder mt-6 p-4 mb-3 status">
                {isKycVerified === true && (
                  <div>
                    <div className="titleText mb-4">New escrow transaction</div>

                    <Row>
                      <Col md={24}>
                        <div id="new-escrow">
                          <Form onFinish={onFinish} scrollToFirstError={{
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'center',
                          }} form={form}>
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
                              countryError={countryError}
                              setCountryError={setCountryError}
                              advisorExists={advisorExists}
                              setAdvisorExists={setAdvisorExists}
                              advisorFeeType={advisorFeeType}
                              setAdvisorFeeType={setAdvisorFeeType}
                              isDraft={isDraft}
                              sellerCountryError={sellerCountryError}
                              setSellerCountryError={setSellerCountryError}
                              BuyerCountry={BuyerCountry} 
                              partyCountry={partyCountry} 
                              payoutAccount={payoutAccount}
                              setPayoutAccount={setPayoutAccount}
                              setOpenAddBankAccountModal={setOpenAddBankAccountModal}
                              bankAccountList={bankAccountList}
                            />
                            <PaymentDetails
                              formValues={formValues}
                              setFormValues={setFormValues}
                              setPlatformCharge={setPlatformCharge}
                              doneSubmit={doneSubmit}
                              taxDetails={taxDetails}
                              setSellerAmount={setSellerAmount} 
                              setTaxDetails={setTaxDetails}
                              setBuyerAmount={setBuyerAmount}
                              setInvoiceCalculations={setInvoiceCalculations}
                              hasAdvisor={hasAdvisor}
                            />
                            {/* adding bank address */}
                            {!isVirtualAccount && formValues?.userType !== USER_TYPE_TEXT.ESCROW_ADVISOR && (
                              <div>
                                <div className="titleText mb-4"> Your address</div>
                                <AddressDetails
                                  formValues={formValues}
                                  setFormValues={setFormValues}
                                  form={form}
                                  setCurrencySymbol={setCurrencySymbol}
                                  userExists={userExists}
                                  setUserExists={setUserExists}
                                  setCountryPhone={setCountryPhone}
                                />
                              </div>
                            )}
                            {/* adding bank address */}
                            <hr className="lightgrayHr mb-5 mt-4" />
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
                              doneSubmit={doneSubmit}
                              hasAdvisor={hasAdvisor}
                              isDraft={isDraft}
                            /> */}

                            {/* start  */}
                            
                            {/* <MultiCounter

                            /> */}

                            {/* end  */}
                            <div className="titleText mt-4 mb-4">
                              Custom contract
                            </div>
                            <CustomContract 
                              form={form} 
                              setCustomObj={setCustomField} 
                              customAttach={customAttach} 
                              setCustomAttach ={setCustomAttach} 
                              customAttachmentIds = {customAttachmentIds}
                              setCustomAttachmentIds = {setCustomAttachmentIds}
                              customAttachUrl={customAttachUrl} 
                              setCustomAttachUrl={setCustomAttachUrl} 
                              customAttachmentUrls={customAttachmentUrls} 
                              setCustomAttachmentUrls={setCustomAttachmentUrls}
                              isDraft={isDraft}
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
                              setRequriedDoc={setRequriedDoc}
                              addedDoc={addedDoc}
                              taxDetails={taxDetails}
                              signature={signature}
                              setSignature={setSignature}
                              signatureId={signatureId}
                              setSignatureId={setSignatureId}
                              setLoading={setLoading}
                              signatureReq={isManualsignature}
                              setsignatureReq={setisManualSignature}
                              envelopeId={envelopId}
                              buyerAmount={buyerAmount}
                              type={buttonText}
                              invoiceCalculations= {invoiceCalculations}
                              isDraft={isDraft}
                              setSourceOfFundIds={setSourceOfFundIds}
                              sourceOfFundIds={sourceOfFundIds}
                              setSourceOfFundUrls={setSourceOfFundUrls}
                              sourceOfFundUrls={sourceOfFundUrls}
                            />
                            <div className={Width > 550 ?"mb-4 d-flex" : "d-flex flex-column"}>
                              {/* <Button
                                className="modal-button w-auto"
                                htmlType="submit"
                                loading={loading}
                                onClick={() => {
                                  setButtonStatus("SEND");
                                  setButtonText("")
                                }}
                              > */}
                                { formValues?.userType === USER_TYPE_TEXT.ESCROW_ADVISOR ? ( 
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
                                    }}
                                  />
                                  </>
                                  
                                ) : (
                                  <>
                                  <Button
                                    className="modal-button w-auto"
                                    htmlType="submit"
                                    loading={loading}
                                    onClick={() => {
                                        setButtonStatus("SEND");
                                        setButtonText("Preview");
                                        setIsDraft(false);
                                        form.setFieldsValue({ required: true });
                                    }}
                                  >

                                    Send to {""}
                                    {formValues?.userType === USER_TYPE_TEXT.BUYER
                                      ? hasAdvisor ? "Seller and Advisor" : "Seller"
                                      : hasAdvisor ? "Buyer and Advisor" : "Buyer"
                                    }
                                  </Button>
                                  </>
                                )}
                                { formValues?.userType !== USER_TYPE_TEXT.ESCROW_ADVISOR && (
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
                                     
                                    }}
                                  />
                                )

                                }
                              {/* {!envelopId && !signature && formValues?.userType !== USER_TYPE_TEXT.ESCROW_ADVISOR && (formValuesData?.fromSign === undefined || formValuesData?.fromSign === "") && (
                                <SecondaryOutLineButton
                                  className="w-auto"
                                  children="Send to Docusign"
                                  htmlType="submit"
                                  loading={loading}
                                  onClick={() => {
                                    setButtonStatus("SIGNATURE_PENDING");
                                    setisManualSignature(false);
                                  }}
                                />
                              )} */}
                            </div>
                          </Form>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card>
              </DefaultLayout>
              </div>
      <Modal
        className="text-center modal-box"
        open={showVerificationModal}
        closable={false}
        footer={false}
        width={410}
        onCancel={() => handleCancel()}
      >
        <div>
          {isKycVerified === "pending"
            ? "Please wait until the approval of your KYC/KYB details to create an escrow transaction."
            : "Please complete the KYC/KYB process to create an escrow transaction."}
        </div>
        <div className="ant-modal-footer modalFooter">
          <SecondaryOutLineButton
            key="cancel"
            className="cancel"
            onClick={() => {
              handleCancel();
            }}
          >
            Ok
          </SecondaryOutLineButton>
        </div>
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
          buyerDetails={BuyerDetails} 
          buyersOpposite={buyersOpposite}
          buyers={buyers}
          sellerDetails={SellerDetails} 
          categoryName={categoryName} 
          itemName={itemName} 
          signature={signature} 
          BuyerCountry={BuyerCountry} 
          sourceOfFundUrls={sourceOfFundUrls}
          invoiceCalculations={invoiceCalculations} 
          customAttachUrl={customAttachUrl} 
          customAttachmentUrls={customAttachmentUrls}
          payoutAccount={payoutAccount}
        />
          <span className="edit-btn">
          <Button
            className={Width > 505 ? "rounded w-auto mx-2" :"rounded w-auto"}
            loading={loading}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {buttonStatus === "DRAFT" ? "Save as draft" : userType != "ESCROW_ADVISOR" ? `Send to ${formValues?.userType === USER_TYPE_TEXT.BUYER
              ? hasAdvisor ? "Seller and Advisor" : "Seller"
              : hasAdvisor ? "Buyer and Advisor" : "Buyer"}` : "Invite User"
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
      <Modal
        open={docuSignInfoPopup}
        footer={false}
        className="text-center modal-box"
        width={500}
        closable={false}
      >
        <Image
          src={Warning}
          alt="Warning"
          preview={false}
          height={68}
          width={75}
        />
        <AuthTitle children={"Warning!"}  style={{
          marginTop: "12px",
          fontSize: "32px",
          fontWeight: "400px",
          color: "red",
        }}/>
        <BoldText children="Please check your email for signing contract document after signing the document you can click on send to seller button for creating a contract." />
       
        <div className="">
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              className="modal-button mt-4"
              onClick={()=>{onclickDocusignPopup()}}
            >
              Ok
            </Button>
          
          </div>
      </Modal>
      <AddBankAccountModal open={openAddBankAccountModal} setOpen={setOpenAddBankAccountModal} onSuccess={onAddBankAccountSuccess}/>
      </Spin>
    </>
  );
};
export default CreateTransaction;
