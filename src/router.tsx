import * as Sentry from "@sentry/react";
import  { useEffect, useState } from "react";
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes, Routes ,Navigate,Route} from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import OtpVerification from "./components/auth/OtpVerification";
import Dashboard from "./components/Admin/dashboard";
import KycKybDashboard from './components/KycKybManager/dashboard';
import AddUser from "./components/Admin/addUser";
import UserManagement from "./components/Admin/userManagement";
import KycKybUserManagement from "./components/KycKybManager/userManagement";
// import KYBDetails from "./components/User/kybDetails";
import UserInfo from "./components/Admin/UserInfo";
import KycKybUserInfo from "./components/KycKybManager/userInfo";
import EscrowInfo from "./components/Admin/escrowDetails";
import VerificationStep1 from "./components/User/Verification_step_1";
import IndividualStep2 from "./components/User/individual_step2";
import IndividualStep3 from "./components/User/individual_step3";
import IndividualStep4 from "./components/User/individual_step4";
import CompanyStep3 from "./components/User/company_step_3";
import CompanyStep4 from "./components/User/company_step_4";
import CompanyStep5 from "./components/User/company_step_5";
import CompanyStep6 from "./components/User/company_step_6";
import CompanyStep7 from "./components/User/company_step_7";
import CompanyStep2 from "./components/User/company_step_2";
import Final from "./components/User/VerificationFinal";
import KYBList from "./components/Admin/KYBManagementList";
import KYCList from "./components/Admin/KYCManagementList";
import StrydeKYCList from "./components/Admin/StrydeKYCManagementList";
import StrydeKYBList from "./components/Admin/StrydeKYBManagementList";
import EscrowAccountList from "./components/Admin/escrowAccountList";
import LinkSent from "./components/auth/LinkSent";
import AdminKYBDetails from "./components/Admin/KybDetails";
import { getLocalStorage } from "./components/Common/Constants";
import AdminKYCDetails from "./components/Admin/kycDetails";
import StrydeKYCDetails from "./components/Admin/StrydeKYCDetails";
import StrydeKYBDetails from "./components/Admin/StrydeKYBDetails";
import EscrowTransationDetails from "./components/Admin/SellerDetails";
import EscrowTransactionList from "./components/Admin/escrowTransactionList";
import ItemTypes from "./components/Admin/itemTypes";
import DisputeList from "./components/Admin/disputeList";
import DisputeDetails from "./components/Admin/disputeDetails";
import ResolveDispute from "./components/Admin/resolveDispute";
import RegularCustomers from "./components/Admin/regularCustomers";
import RegularCustomDetails from "./components/Admin/regularCustomerDetails";
import EnterpriseList from "./components/Admin/enterpriseList";
import EnterpriseDetails from "./components/Admin/enterpriseDetails";
import PaymentLog from "./components/Admin/paymentLog";
import PaymentLogDetails from "./components/Admin/paymentLogDetails";
import AdminProfile from "./components/Admin/MyProfile";
import EditAdminProfile from "./components/Admin/EditProfile";
import ItemCategory from "./components/Admin/ItemCategory";
import ItemCategoryFieldManagement from "./components/Admin/ItemCategoryFieldManagement";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import TransactionDetails from "./components/Admin/TransactionDetails";
import UserDashboard from "./components/User/Dashboard";
import EscrowAdvisorDashboard from './components/EscrowAdvisor/dashboard';
import BankAccountList from "./components/User/bankAccList";
import AddBankAccount from "./components/User/addBankAccount";
import EditBankAccount from "./components/User/editBankAccount";
import ArchivedTransaction from "./components/User/archivedTransaction";
import CreateTransaction from "./components/User/createTransaction";
import TrusteeDashboard from './components/Trustee/Dashboard'
import TrusteeEscrowTransactionList from "./components/Trustee/EscrowTransactionList";
import EditTransaction from "./components/User/NewTransaction/EditTransaction";
import EscrowSuccess from "./components/User/EscrowSuccessPage";
import TransactionHistory from "./components/User/TransactionHistory";
import EscrowTransactionHistory from './components/User/escrowTransactionHistory';
import BankTransactionHistory from './components/User/bankTransactionHistory';
import MakePayment from "./components/User/makepayment";
import NetBankPayment from "./components/User/netbankpayment";
import ChequeNetBankPayment from "./components/ManagerCheques/NetBankPayment";
import SessionExpired from "./components/auth/SessionExpired";
import TermsandConditions from "./components/Common/Termsandcondition";
import useFrameBusting from "./components/Common/useFrameBusting";
import IndividualStep5 from "./components/User/individual_step5";
import UserList from "./components/EscrowAdvisor/UserList";
import SupportAndHelp from "./components/Common/SupportAndHelp";
import SupportList from "./components/Admin/SupportList";
import SupportAndHelpList from "./components/Common/SupportAndHelpList";
import EditSupport from "./components/Common/EditSupport";
import ViewSupport from "./components/Common/ViewSupport";
import TypeOfIssue from "./components/Admin/typeOfIssue";
import RealestateItemCategory from "./components/Admin/RealestateItemCategory";
import RealestateItemType from "./components/Admin/RealestateItemType";
import { Spin } from "antd";

const REACT_SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
const SENTRY_ENABLED = process.env.SENTRY_ENABLED;
const REACT_TRACE_PROPAGATION_TARGETS = process.env.REACT_APP_TRACE_PROPAGATION_TARGETS?.split(',').map((target:any) => {
  if (target?.startsWith('http')) {
    return new RegExp(`^${target.replace('.', '\\.')}`);
  }
  return target;
});

Sentry.init({
  dsn: REACT_SENTRY_DSN,
  enabled: SENTRY_ENABLED === 'true',
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect: useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  // tracesSampleRate: 1.0, //  Capture 100% of the transactions
  tracesSampleRate: process.env.REACT_APP_ENVIRONMENT === 'production' ? 0.1 : 1.0, // Adjust sample rate based on environment
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: REACT_TRACE_PROPAGATION_TARGETS,
  // Session Replay
  replaysSessionSampleRate: process.env.REACT_APP_ENVIRONMENT === 'production' ? 0.1 : 1.0, // Adjust for production // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.1.0,

  environment: process.env.REACT_APP_ENVIRONMENT || 'development', // Set environment
});
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);
import PaymentStatusPage from "./components/User/NewTransaction/paymentStatusPage";
import UAEPGSTransactionList from "./components/User/uaepgsTransactionsList";
import DocumentSubmitted from "./components/User/documentSubmitted";
import VerifyUser from "./components/auth/VerifyUser";
import VerifyEmail from "./components/auth/OtpEmailVerification";
import PageNotFound from "./components/Common/PageNotFound";
import  ContractPDFDetails from "./components/Admin/ContractPDFDetails";
import PaymentMethods from "./components/Admin/paymentMethods";
import Signuplanding from "./components/auth/Signuplanding";
import CreateCheque from "./components/ManagerCheques/CreateCheque";
import SellerManagementList from "./components/ManagerCheques/SellerManagementList";
import SellerGuestDetails from "./components/ManagerCheques/SellerGuestDetails";
import ChequeList from "./components/ManagerCheques/ChequeList";
import AdminChequeList from "./components/ManagerCheques/AdminChequeList";
import ChequeDetails from "./components/ManagerCheques/ChequeDetails";
import AddFunds from "./components/ManagerCheques/addfunds";

const UserRoutes = ():any => {
  useFrameBusting();
//   const TOKEN = JSON.parse(getLocalStorage("auth")!)?.token;
//   const TYPE = JSON.parse(getLocalStorage("auth")!)?.userType;

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [isKycVerified, setIsKycVerified] = useState<boolean>(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {

    const auth = getLocalStorage("auth");
    if (auth) {
      const { token, userType, otp, isKycVerified } = JSON.parse(auth);
      setIsAuthenticated(!!token);
      setUserType(userType);
      const OTP_VERIFICATION_ENABLED = process.env.ENABLE_OTP_VERIFICATION === "true"; 
      const otpValid = otp ?? false;
      const otpRequired = OTP_VERIFICATION_ENABLED ? otpValid : true;
      setIsOtpVerified(otpRequired);
      setIsKycVerified(isKycVerified);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div
      className="d-flex align-items-center justify-content-center w-100"
      style={{ height: "100vh" }}
    >
      <Spin size="large" className="mainloader pdf" />
    </div>;
  }

  return (
    <SentryRoutes>
    {/* <Routes> */}
      {/* Common Routes */}
      <Route
        index
        element={isAuthenticated && isOtpVerified ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route path="/payment-status" element={<PaymentStatusPage />} />
      <Route
        path="/signup"
        element={isAuthenticated && isOtpVerified ? <Navigate to="/dashboard" replace /> : <Signup />}
      />
      <Route
        path="/signup-landing"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signuplanding />}
      />
      <Route
        path="/link-sent"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LinkSent />}
      />
      <Route
        path="/login"
        element={isAuthenticated && isOtpVerified ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/otp-verification"
        element={isAuthenticated  && (process.env.ENABLE_OTP_VERIFICATION !== "true") ? <Navigate to="/dashboard" replace /> : <OtpVerification /> }
      />
      <Route
        path="/forgot-password"
        element={
          isAuthenticated && isOtpVerified ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
        }
      />
      <Route
        path="/reset-password"
        element={
          isAuthenticated && isOtpVerified ? <Navigate to="/dashboard" replace /> : <ResetPassword />
        }
      />
       <Route
        path="/session-expired"
        element={
          isAuthenticated && isOtpVerified ? <Navigate to="/dashboard" replace /> : <SessionExpired />
        }
      />
       <Route
        path="/terms-and-conditions"
        element={ <TermsandConditions /> }
      />

      <Route
        path="/transaction-details/:contractId"
        element= {
          (!isAuthenticated || !isOtpVerified) && !userType ? <Navigate to="/login" replace /> : userType === "USER" && !isKycVerified ? <Navigate to="/dashboard" replace /> : <TransactionDetails /> 
        }
      />
      <Route
        path="/contract-details/:contractId"
        element={
          (!isAuthenticated || !isOtpVerified) && !userType ? (
            <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`} replace />
          ) : userType === "USER" && !isKycVerified ? <Navigate to="/dashboard" replace /> :  (
            <ContractPDFDetails />
          )
        }
      />

      {userType ? (
        <>
          <Route
            path="/transaction-details/:contractId"
            element={
              !isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : userType === "USER" && !isKycVerified ? <Navigate to="/dashboard" replace /> :  <TransactionDetails />
            }
          />
          <Route
            path="/contract-details/:contractId"
            element={
              (!isAuthenticated || !isOtpVerified) && !userType ? (
                <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`} replace />
              ) : userType === "USER" && !isKycVerified ? <Navigate to="/dashboard" replace /> :  (
                <ContractPDFDetails />
              )
            }
          />
          <Route
            path="/my-profile"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminProfile />
            }
          />
          <Route
            path="/edit-profile"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <EditAdminProfile />
            }
          />
           <Route
            path="/support-and-help"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : userType === "USER" && !isKycVerified ? <Navigate to="/dashboard" replace /> : <SupportAndHelp />
            }
          />
          <Route
            path="/support-and-help-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : userType === "USER" && !isKycVerified ? <Navigate to="/dashboard" replace /> : <SupportAndHelpList />
            }
          />
          <Route
            path="/edit-support/:id/:photoId"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : userType === "USER" && !isKycVerified ? <Navigate to="/dashboard" replace /> : <EditSupport />
            }
          />
          <Route
            path="/view-support/:id/:photoId"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : userType === "USER" && !isKycVerified ? <Navigate to="/dashboard" replace /> : <ViewSupport />
            }
          />
        </>
      ) : (
        <Route path="*" element={<PageNotFound />} />
      )}
      {/* Trustee Routes */}
      {
      (userType == 'TRUSTEE' || userType == 'APPROVER') ? (
        <>
          <Route
            path="/dashboard"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <TrusteeDashboard />
            }
          />
          <Route
            path="/escrow-transaction-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <TrusteeEscrowTransactionList />
            }
          />
          <Route
            path="/admin-cheques"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminChequeList/>
            }
          />
          <Route
            path="/cheques/:chequeAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <ChequeDetails/>
            }
          />
           <Route
            path="/payment-log"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <PaymentLog />}
          />
           <Route
            path="/kyb-management-list"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <KYBList />}
          /> 
          <Route
            path="/kyc-management-list"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <KYCList />}
          />
          <Route
            path="/seller-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <SellerManagementList/>
            }
          />
          <Route
            path="/seller-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <SellerGuestDetails/>
            }
          />
          <Route
            path="/kyb-management/kyb-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminKYBDetails />
            }
          />
          <Route
            path="/kyc-management/kyc-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminKYCDetails />
            }
          />
          <Route
            path="/stryde-kyc-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYCList />
            }
          />
          <Route
            path="/stryde-kyb-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYBList />
            }
          />
            <Route
              path="/stryde-kyb-management/stryde-kyb-details/:userAlias"
              element={
                !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYBDetails />
              }
            />
            <Route
              path="/stryde-kyc-management/stryde-kyc-details/:userAlias"
              element={
                !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYCDetails />
              }
            />
          </>
        ) : 
        (
          <Route path="*" element={<PageNotFound />} />
        )
      }

      {/* User Routes */}

      {userType == "USER" ? (
        <>
          <Route
            path="/dashboard"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <UserDashboard />
            }
          />
          <Route
            path="/verification-step-1"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <VerificationStep1 />
            }
          />
          <Route
            path="/individual-verification-step-2"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <IndividualStep2 />
            }
          />
          <Route
            path="/individual-verification-step-3"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <IndividualStep3 />
            }
          />
          <Route
            path="/individual-verification-step-4"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <IndividualStep4 />
            }
          />
          <Route
            path="/individual-verification-step-5"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <IndividualStep5 />
            }
          />
          <Route
            path="/company-verification-step-2"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep2 />
            }
          />
          <Route
            path="/company-verification-step-3"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep3 />
            }
          />
          <Route
            path="/company-verification-step-4"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep4 />
            }
          />
          <Route
            path="/company-verification-step-5"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep5 />
            }
          />
          <Route
            path="/company-verification-step-6"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep6 />
            }
          />
          <Route
            path="/company-verification-step-7"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep7 />
            }
          />
          <Route
            path="/verification-progress"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <Final />}
          />
          <Route
            path="/document-submitted"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <DocumentSubmitted />}
          />

          <Route
            path="/bank-account"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <BankAccountList />
            }
          />
          <Route
            path="/bank-account/add-bank-account"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <AddBankAccount />
            }
          />
          <Route
            path="/bank-account/edit-bank-account/:id"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <EditBankAccount />
            }
          />
           <Route
            path="/archived-escrow-transaction"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <ArchivedTransaction />
            }
          />
          <Route
            path="/uaepgs-transaction"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <UAEPGSTransactionList />
            }
          />
           <Route
            path="/create-escrow-transaction"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <CreateTransaction />
            }
          />
            <Route
            path="/edit-escrow-transaction/:useralias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <EditTransaction />
            }
          />
          <Route
            path="/escrow-transaction/success"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <EscrowSuccess />
            }
          />
          <Route
            path="/cheques"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <ChequeList/>
            }
          />
          <Route
            path="/cheques/:chequeAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <ChequeDetails/>
            }
          />
          <Route
            path="/cheques/:chequeAlias/add-funds"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <AddFunds/>
            }
          />
          <Route
            path="/cheques/:chequeAlias/net-banking"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <ChequeNetBankPayment/>
            }
          />
          <Route
            path="/create-manager-cheque"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <CreateCheque />
            }
          />
          <Route
            path="/edit-manager-cheque/:chequeAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <CreateCheque/>
            }
          />
           <Route
            path="/transaction-history"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <TransactionHistory />
            }
          />
          <Route
            path="/escrow-transaction-history"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <EscrowTransactionHistory />
            }
          />
          <Route
            path="/bank-transaction-history"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <BankTransactionHistory />
            }
          />
           <Route
            path="/make-payment/:useralias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <MakePayment />
            }
          />
           <Route
            path="/net-bank-payment/:useralias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <NetBankPayment />
            }
          />
        </>
      ) : (
          <>
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/verify-user/:userAlias?" element={<VerifyUser />} />
            <Route path="/verify-email/:userAlias?" element={<VerifyEmail />} />
            <Route path="*" element={<PageNotFound />} />
          </>
         
      )}

    {/* Escrow Advisor Routes */}

      {userType == "ESCROW_ADVISOR" ? (
        <>
          <Route
            path="/dashboard"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <EscrowAdvisorDashboard />
            }
          />
          <Route
            path="/company-verification-step-2"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep2 />
            }
          />
          <Route
            path="/company-verification-step-3"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep3 />
            }
          />
          <Route
            path="/company-verification-step-4"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep4 />
            }
          />
          <Route
            path="/company-verification-step-5"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep5 />
            }
          />
          <Route
            path="/company-verification-step-6"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep6 />
            }
          />
          <Route
            path="/company-verification-step-7"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <CompanyStep7 />
            }
          />
          <Route
            path="/verification-progress"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <Final />}
          />

          <Route
            path="/bank-account"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <BankAccountList />
            }
          />
          <Route
            path="/bank-account/add-bank-account"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <AddBankAccount />
            }
          />
          <Route
            path="/bank-account/edit-bank-account/:id"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <EditBankAccount />
            }
          />
           <Route
            path="/archived-escrow-transaction"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <ArchivedTransaction />
            }
          />
           <Route
            path="/create-escrow-transaction"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <CreateTransaction />
            }
          />
            <Route
            path="/edit-escrow-transaction/:useralias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <EditTransaction />
            }
          />
          <Route
            path="/escrow-transaction/success"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <EscrowSuccess />
            }
          />
           <Route
            path="/transaction-history"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <TransactionHistory />
            }
          />
          <Route
            path="/escrow-transaction-history"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <EscrowTransactionHistory />
            }
          />
          <Route
            path="/bank-transaction-history"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <BankTransactionHistory />
            }
          />
           <Route
            path="/make-payment/:useralias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <MakePayment />
            }
          />
          <Route
            path="/escrow-user-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <UserList />
            }
          />
          <Route
            path="/escrow-user-list/escrow-user-info/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : !isKycVerified ? <Navigate to="/dashboard" replace /> : <UserInfo />
            }
          />
        </>
      ) : (
          <>
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/verify-email/:userAlias?" element={<VerifyEmail />} />
            <Route path="*" element={<PageNotFound />} />
          </>
      )}

      {/*Checker Maker Routes*/}
      {(userType == "CHECKER" || userType == "MAKER") ? (
        <>
          <Route
            path="/kyb-management-list"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <KYBList />}
          />
          <Route
            path="/kyc-management-list"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <KYCList />}
          />
          <Route
            path="/user-management/user-information/:userAlias"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <KycKybUserInfo />}
          />
          <Route
            path="/dashboard"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <KycKybDashboard />}
          />
          <Route
            path="/add-user"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <AddUser />}
          />
          <Route
            path="/user-management"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <KycKybUserManagement />
            }
          />
          <Route
            path="/kyb-management/kyb-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminKYBDetails />
            }
          />
          <Route
            path="/kyc-management/kyc-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminKYCDetails />
            }
          />
           <Route
            path="/stryde-kyc-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYCList />
            }
          />
          <Route
            path="/stryde-kyb-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYBList />
            }
          />
          <Route
            path="/stryde-kyb-management/stryde-kyb-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYBDetails />
            }
          />
          <Route
            path="/stryde-kyc-management/stryde-kyc-details/:userAlias"
            element={
              !isAuthenticated || !isOtpVerified? <Navigate to="/login" replace /> : <StrydeKYCDetails />
            }
          />
        </>
      ) : (
        ""
      )}
      {/* Admin Routes */}
      {(userType == "ADMIN" || userType == "AUTHORIZER" || userType == "SENIOR_MANAGMENT" || userType =="SUPPORT_ENGINEER") ? (
        <>
          <Route
            path="/kyb-management-list"
            element={!isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <KYBList />}
          />
          <Route
            path="/kyc-management-list"
            element={!isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <KYCList />}
          />
          <Route
            path="/user-management/user-information/:userAlias"
            element={!isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <UserInfo />}
          />
          <Route
            path="/dashboard"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <Dashboard />}
          />
          <Route
            path="/add-user"
            element={!isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <AddUser />}
          />
          <Route
            path="/user-management"
            element={
              !isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <UserManagement />
            }
          />
          <Route
            path="/kyb-management/kyb-details/:userAlias"
            element={
              !isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminKYBDetails />
            }
          />
          <Route
            path="/kyc-management/kyc-details/:userAlias"
            element={
              !isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminKYCDetails />
            }
          />
          <Route
            path="/escrow-account-list"
            element={
              !isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <EscrowAccountList />
            }
          />
          <Route
            path="/escrow-account/escrow-information/:userAlias"
            element={!isAuthenticated || !isOtpVerified ? <Navigate to="/login" replace /> : <EscrowInfo />}
          />{" "}
          <Route
            path="/escrow-transaction/escrow-information/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? (
                <Navigate to="/login" replace />
              ) : (
                <EscrowTransationDetails />
              )
            }
          />
          <Route
            path="/escrow-transaction-list"
            element={
              !isAuthenticated  || !isOtpVerified ? (
                <Navigate to="/login" replace />
              ) : (
                <EscrowTransactionList />
              )
            }
          />
          <Route
            path="/admin-cheques"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <AdminChequeList/>
            }
          />
          <Route
            path="/cheques/:chequeAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <ChequeDetails/>
            }
          />
          <Route
            path="/item-types"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <ItemTypes />}
          />
          <Route
            path="/item-category"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <ItemCategory />
            }
          />
          <Route
            path="/realestate-item-category"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <RealestateItemCategory />}
          />
          <Route
            path="/realestate-item-types"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <RealestateItemType />
            }
          />
          <Route
            path="/type-of-issue"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <TypeOfIssue />
            }
          />
          <Route
            path="/payment-methods"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <PaymentMethods />
            }
          />
          <Route
            path="/item-category/field-management/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? (
                <Navigate to="/login" replace />
              ) : (
                <ItemCategoryFieldManagement />
              )
            }
          />
          <Route
            path="/dispute-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <DisputeList />
            }
          />
          <Route
            path="/dispute-management/dispute-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <DisputeDetails />
            }
          />
          <Route
            path="/dispute-management/dispute-details/resolve-dispute/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <ResolveDispute />
            }
          />
          <Route
            path="/leads"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <RegularCustomers />
            }
          />
          <Route
            path="/leads/details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? (
                <Navigate to="/login" replace />
              ) : (
                <RegularCustomDetails />
              )
            }
          />
          <Route
            path="/Enterprise-call-scheduler-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <EnterpriseList />
            }
          />
          <Route
            path="/Enterprise-call-scheduler-list/details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <EnterpriseDetails />
            }
          />
          <Route
            path="/payment-log"
            element={!isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <PaymentLog />}
          />
          <Route
            path="/payment-log/details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <PaymentLogDetails />
            }
          />
          <Route
            path="/support-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <SupportList />
            }
          />
           <Route
            path="/stryde-kyc-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYCList />
            }
          />
          <Route
            path="/stryde-kyb-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYBList />
            }
          />
          <Route
            path="/stryde-kyb-management/stryde-kyb-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYBDetails />
            }
          />
          <Route
            path="/stryde-kyc-management/stryde-kyc-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <StrydeKYCDetails />
            }
          />
           <Route
            path="/seller-management-list"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <SellerManagementList/>
            }
          />
          <Route
            path="/seller-details/:userAlias"
            element={
              !isAuthenticated  || !isOtpVerified ? <Navigate to="/login" replace /> : <SellerGuestDetails/>
            }
          />
        </>
      ) : (
        <Route path="*" element={<PageNotFound />} />
      )}
     </SentryRoutes>
    // {/* </Routes> */}
  );
};

export default UserRoutes;
