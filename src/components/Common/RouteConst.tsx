export const Login = "/login";
export const SignUp = "/signup";
export const LoginLanding = "/login?source=signup-landing"
export const Signuplanding = "/signup-landing";
export const OtpVerification = "/otp-verification";
export const Forgot = "/forgot-password";
export const Reset = "/reset-password";
export const Dashboard = "/dashboard";
export const AddUser = "/add-user";
export const UserManagementList = "/user-management";
export const KYBManagementList = "/kyb-management-list";
export const KYCManagementList = "/kyc-management-list";
export const SelllerManagementList = "/seller-management-list";
export const SelllerManagementDetails = "/seller-details";
export const StrydeKYCManagementList = "/stryde-kyc-management-list";
export const StrydeKYBManagementList = "/stryde-kyb-management-list";
export const AdminKYBDetail = "/kyb-management/kyb-details";
export const AdminKYCDetail = "/kyc-management/kyc-details";
export const StrydeKYBDetails = "/stryde-kyb-management/stryde-kyb-details";
export const StrydeKYCDetails = "/stryde-kyc-management/stryde-kyc-details";
export const VerificationStep1 = "/verification-step-1";
export const KYCVerificatioStep2 = "/individual-verification-step-2";
export const KYCVerificatioStep3 = "/individual-verification-step-3";
export const KYCVerificatioStep4 = "/individual-verification-step-4";
export const KYCVerificatioStep5 = "/individual-verification-step-5";
export const KYBVerificatioStep2 = "/company-verification-step-2";
export const KYBVerificatioStep3 = "/company-verification-step-3";
export const KYBVerificatioStep4 = "/company-verification-step-4";
export const KYBVerificatioStep5 = "/company-verification-step-5";
export const KYBVerificatioStep6 = "/company-verification-step-6";
export const KYBVerificatioStep7 = "/company-verification-step-7";
export const VerificationCompleted = "/verification-progress";
export const DocumentSubmitted = "/document-submitted";
export const KYBDetails = "/kyb-details";
export const UserInfo = "/user-management/user-information";
export const VerifySignUp = "/link-sent";
export const EscrowInfo = "/escrow-account/escrow-information";
export const EscrowAccountsList = "/escrow-account-list";
export const EscrowTransactionList = "/escrow-transaction-list";
export const EscrowTransactionDetails =
  "/escrow-transaction/escrow-information";
export const DisputeManagementList = "/dispute-management-list";
export const DisputeManagementDetails = "/dispute-management/dispute-details";
export const Resolve_Dispute =
  "/dispute-management/dispute-details/resolve-dispute/";
export const ItemTypesList = "/item-types";
export const ItemCategoryList = "/item-category";
export const RealestateItemCategory = "/realestate-item-category";
export const RealestateItemType = "/realestate-item-types";
export const RegularCustomer = "/leads";
export const RegularCustomDetail = "/leads/details";
export const EnterpriseCallList = "/Enterprise-call-scheduler-list";
export const EnterpriseCallDetails = "/Enterprise-call-scheduler-list/details";
export const PaymentList = "/payment-log";
export const PaymentDetail = "/payment-log/details";
export const AdminProfile = "/my-profile";
export const AdminProfileEdit = "/edit-profile";
export const FieldManagement = "/item-category/field-management";
export const TransactionDetail = "/transaction-details";
export const TransactionHistory = "/transaction-history";
export const EscrowTransactionHistory = '/escrow-transaction-history';
export const BankTransactionHistory = '/bank-transaction-history';
export const SupportList = "/support-list";
export const TypeOfIssue="/type-of-issue";
export const VerifyUser="/verify-user";
export const VerifyEmail="/verify-email";
export const PaymentMethods="/payment-methods";


// USER

export const BankList = "/bank-account";
export const AddBank = "/bank-account/add-bank-account";
export const EditBank = "/bank-account/edit-bank-account/";
export const ArchivedList = "/archived-escrow-transaction";
export const CreateEscrow = "/create-escrow-transaction";
export const EditEscrow = "/edit-escrow-transaction";
export const SuccessTxn = "/escrow-transaction/success";
export const CreateCheque = "/create-manager-cheque"; 
export const EditCheque = "/edit-manager-cheque";
export const Cheques = "/cheques";
export const AdminChequeList = "/admin-cheques";
export const ChequeDetails = Cheques;
export const ChequeNetBanking = "/net-banking";
export const ChequeAddFund = "/add-funds";
export const TxnHistory = "/transaction-history";
export const WireTransfer = "/wire-transfer";
export const AddFund = '/make-payment'
export const NetBankPayment = '/net-bank-payment';
export const UaepgsTransactionHistory = "/uaepgs-transaction";
export const Termsandcondition = 'https://www.trustin.ae/terms-and-conditions'
export const EscrowTermsandCondition = "https://www.trustin.ae/escrow-terms-and-conditions"
export const SpecialTermsAndCondition = process.env.SPECIAL_TNC_LINK

// TRUSTEE
export const TrusteeTransaction = '/escrow-transaction-list'

//PAYMENTS LOGS
export const PaymentLogInfo = "/payment-log/details";

//ESCROW_ADVISOR
export const UserList = "/escrow-user-list";
export const EscrowAdvisorDetails ="/escrow-user-list/escrow-user-info"
//SUPPORT AND HELP
export const SupportHelp="/support-and-help";
export const SupportHelpList="/support-and-help-list";
export const EditSupport="/edit-support"
export const ViewSupport="/view-support"
