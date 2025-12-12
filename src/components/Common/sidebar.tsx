import { Button, Image, Menu, Tooltip } from "antd";
import DashboardImg from "../../assets/img/dashboard.svg";
import GrayDashboard from "../../assets/img/dashboardOutline.svg";
// import NewUser from "../../assets/img/addUserFilled.svg";
// import GrayNewUser from "../../assets/img/grayUser.svg";
import Management from "../../assets/img/managementFilled.svg";
import GrayManagement from "../../assets/img/gray_management.svg";
import Escrow from "../../assets/img/escrowFilled.svg";
import GrayEscrow from "../../assets/img/grayescrow.svg";
import Settings from "../../assets/img/settingsFilled.svg";
import GraySettings from "../../assets/img/gray_settings.svg";
import Enquiry from "../../assets/img/enquiryFilled.svg";
import GrayEnquiry from "../../assets/img/gray_enquiry.svg";
import PaymentLog from "../../assets/img/paymentFilled.svg";
import GrayPaymentLog from "../../assets/img/gray_payment.svg";
import Profile from "../../assets/img/myprofileFilled.svg";
import GrayProfile from "../../assets/img/gray_user.svg";
import LogoutIcon from "../../assets/img/logout.svg";
import GrayLogout from "../../assets/img/gray_logout.svg";
import EscrowTransFilled from "../../assets/img/escrowTransFilled.svg";
import EscrowTrans from "../../assets/img/escrowTransGray.svg";
import BankAcc from "../../assets/img/bankacc.svg";
import BankAccFilled from "../../assets/img/bankaccfilled.svg";
import Archivedtrans from "../../assets/img/archivedTrans.svg";
import Archivedtransfill from "../../assets/img/archivedTransFilled.svg";
import CustomerFilled from "../../assets/img/customerFilled.svg";
import CustomerGray from "../../assets/img/customerGray.svg";
import DisputeFilled from "../../assets/img/disputeFilled.svg";
import DisputeGray from "../../assets/img/DisputeGray.svg";
import UserGrayIcon from "../../assets/img/UserGrayIcon.svg";
import UserFilledIcon from "../../assets/img/UserFilledIcon.svg";
import KybGray from "../../assets/img/KybGray.svg";
import KybFilled from "../../assets/img/KybFilled.svg";
import KycGray from "../../assets/img/KycGray.svg";
import KycFilled from "../../assets/img/KycFilled.svg";
import transactionHistory from "../../assets/img/transactionHistory.svg";
import grayTransactionHistory from "../../assets/img/greyTransactionHistory.svg";
import escrowAccounts from "../../assets/img/escrowaccounts.svg";
import escrowAccountsFill from "../../assets/img/escrowaccountsfill.svg";
import bankAccounts from "../../assets/img/bankaccounts.svg";
import bankAccountsFill from "../../assets/img/bankaccountsfill.svg";
import itemCategories from "../../assets/img/itemcategory.svg";
import itemCategoriesFill from "../../assets/img/itemcategoryfill.svg";
import itemTypes from "../../assets/img/itemtypes.svg";
import itemTypesFill from "../../assets/img/itemtypesfill.svg";
import typeOfIssue from "../../assets/img/typeofissue.svg";
import typeOfIssueFill from "../../assets/img/typeofissuefill.svg";
import paymentMethods from "../../assets/img/paymentmethods.svg";
import paymentMethodsFill from "../../assets/img/paymentmethodsfill.svg";
import onlinePayments from "../../assets/img/onlinepaygray.svg";
import onlinePaymentsFill from "../../assets/img/onlinepayfill.svg";
import supportlist from "../../assets/img/supportlistgray.svg"
import supportListFill from "../../assets/img/supportlistfill.svg"
import Logo from "../../assets/img/bld-market-logo.jpg";
import FormLogo from "../../assets/img/bld-market-logo.jpg";
import Managercheque from "../../assets/img/bankcheck.svg";
import Mangerchequegray from "../../assets/img/bankcheckfgray.svg";
import { useState } from "react";
import {
  // AddUser,
  AdminProfile,
  ArchivedList,
  BankList,
  CreateEscrow,
  Dashboard,
  DisputeManagementList,
  EscrowAccountsList,
  EscrowTransactionList,
  ItemCategoryList,
  ItemTypesList,
  KYBManagementList,
  KYCManagementList,
  PaymentList,
  RegularCustomer,
  // UserDashboard,
  UserManagementList,
  EscrowTransactionHistory,
  BankTransactionHistory,
  // UserList,
  TrusteeTransaction,
  SupportList,
  SupportHelpList,
  TypeOfIssue,
  UaepgsTransactionHistory,
  PaymentMethods,
  StrydeKYCManagementList,
  StrydeKYBManagementList, 
  SelllerManagementList,
  Cheques,
  AdminChequeList,
  RealestateItemCategory,
  RealestateItemType,
} from "./RouteConst";
import { ArrowRightOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Logout from "./Logout";
import { getLocalStorage } from "./Constants";
import { useNavigate } from "react-router-dom";



const Sidebar = (props: object | any): any => {
  const { collapsed, setCollapsed, page } = props;
  const [logoutModal, setLogoutModal] = useState(false);
  const [pageValue, setPageValue] = useState("");
  const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const navigate = useNavigate();

  const handleCollapse = () => setCollapsed(!collapsed);
  const isMCEnabled : boolean = process.env.ENABLE_MANAGER_CHEQUE === "true";

  const getIcon = (activePage: any, targetPage: any, filledIcon: any, grayIcon: any) => {
    return activePage === targetPage && !pageValue ? (
      <Image preview={false} src={filledIcon} alt={targetPage} />
    ) : (
      <Image preview={false} src={grayIcon} alt={targetPage} />
    );
  };

  const handleNavigate = (navigateFn: any, label: any, className?: string, title?: string) => {
    return (
      <a className={className ? className : ""} title={title ? title : ""} onClick={() => navigateFn()}>{label}</a>
    );
  };

  const adminItems = [
    {
      key: "dashboard",
      icon: handleNavigate(() => navigate(Dashboard), getIcon(page, "dashboard", DashboardImg, GrayDashboard)),
      label: handleNavigate(() => navigate(Dashboard), "Dashboard"),
    },
    // {
    //   key: "newuser",
    //   icon:
    //     page == "newuser" && !pageValue ? (
    //       <Image preview={false} src={NewUser} alt="new user" />
    //     ) : (
    //       <Image preview={false} src={GrayNewUser} alt="new user" />
    //     ),
    //   label: <a onClick={()=>navigate(AddUser)}>New User</a>,
    // },
    {
      key: "management",
      icon: page.includes("management") && !pageValue ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "user_management",
          icon: getIcon(page, "user_management", UserFilledIcon, UserGrayIcon),
          label: handleNavigate(() => navigate(UserManagementList), "User Management"),
        },
        {
          key: "kyb_management",
          icon: getIcon(page, "kyb_management", KybFilled, KybGray),
          label: handleNavigate(() => navigate(KYBManagementList), "KYB Management"),
        },
        {
          key: "kyc_management",
          icon: getIcon(page, "kyc_management", KycFilled, KycGray),
          label: handleNavigate(() => navigate(KYCManagementList), "KYC Management"),
        },
        {
          key: "stryde_kyb_management",
          icon: getIcon(page, "stryde_kyb_management", KybFilled, KybGray),
          label: handleNavigate(() => navigate(StrydeKYBManagementList), "Stryde KYB Management"),
        },
        {
          key: "stryde_kyc_management",
          icon: getIcon(page, "stryde_kyc_management", KycFilled, KycGray),
          label: handleNavigate(() => navigate(StrydeKYCManagementList), "Stryde KYC Management"),
        },
        ...(isMCEnabled
          ? [{
            key: "seller_management",
            icon: getIcon(page, "seller_management", KycFilled, KycGray),
            label: handleNavigate(() => navigate(SelllerManagementList), "Screening Management"),
          }]
          : []),
        {
          key: "dispute_management",
          icon: getIcon(page, "dispute_management", DisputeFilled, DisputeGray),
          label: handleNavigate(() => navigate(DisputeManagementList), "Dispute Management"),
        },
      ],
      label: <a>Management</a>,
    },
    {
      key: "escrow",
      icon: page.includes("escrow") && !pageValue ? (
        <Image preview={false} src={Escrow} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEscrow} alt="Escrow" />
      ),
      children: [
        {
          key: "escrow_accounts",
          icon: getIcon(page, "escrow_accounts", escrowAccountsFill, escrowAccounts),
          label: handleNavigate(() => navigate(EscrowAccountsList), "Escrow Accounts"),
        },
        {
          key: "escrow_transaction",
          icon: getIcon(page, "escrow_transaction", EscrowTransFilled, EscrowTrans),
          label: handleNavigate(() => navigate(EscrowTransactionList), "Escrow Transactions"),
        }, 
      ],
      label: <a>Escrow</a>,
    },
   
    {
      key: "config",
      icon: page.includes("config") && !pageValue ? (
        <Image preview={false} src={Settings} alt="Escrow" />
      ) : (
        <Image preview={false} src={GraySettings} alt="Escrow" />
      ),
      children: [
        {
          key: "config_type",
          icon: getIcon(page, "config_type", itemCategoriesFill, itemCategories),
          label: handleNavigate(() => navigate(ItemTypesList), "Item Categories"),
        },
        {
          key: "config_category",
          icon: getIcon(page, "config_category", itemTypesFill, itemTypes),
          label: handleNavigate(() => navigate(ItemCategoryList), "Item Types"),
        },
        ...(isMCEnabled ?
          [{
            key: "config_category_real",
            icon: getIcon(page, "config_category_real", itemCategoriesFill, itemCategories),
            label: handleNavigate(() => navigate(RealestateItemCategory), "Item Categories(MC)"),
          },
          {
            key: "config_type_real",
            icon: getIcon(page, "config_type_real", itemTypesFill, itemTypes),
            label: handleNavigate(() => navigate(RealestateItemType), "Item Types(MC)"),
          }] : []
        ),
        {
          key: "config_issue",
          icon: getIcon(page, "config_issue", typeOfIssueFill, typeOfIssue),
          label: handleNavigate(() => navigate(TypeOfIssue), "Type Of Issue"),
        },
        {
          key: "config_payment_methods",
          icon: getIcon(page, "config_payment_methods", paymentMethodsFill, paymentMethods),
          label: handleNavigate(() => navigate(PaymentMethods), "Payment Methods"),
        },
      ],
      label: <a>Configuration</a>,
    },
    
    {
      key: "enquiry",
      icon: page.includes("enquiry") && !pageValue ? (
        <Image preview={false} src={Enquiry} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEnquiry} alt="Escrow" />
      ),
      children: [
        {
          key: "enquiry_regular",
          icon: getIcon(page, "enquiry_regular", CustomerFilled, CustomerGray),
          label: handleNavigate(() => navigate(RegularCustomer), "Leads"),
        },
        // {
        //   key: "enquiry_enterprise",
        //   icon:
        //     page == "enquiry_enterprise" ? (
        //       <Image preview={false} src={EnterpriseFilled} alt="Escrow" />
        //     ) : (
        //       <Image preview={false} src={Enterprise} alt="Escrow" />
        //     ),
        //   label: <a onClick={()=>navigate(EnterpriseCallList)}>Enterprise</a>,
        // },
      ],
      label: <a>Enquiry</a>,
    },
    ...(isMCEnabled
      ? [{
        key: "cheque",
        icon: handleNavigate(() => navigate(AdminChequeList), getIcon(page, "cheque", Managercheque, Mangerchequegray)),
        label: handleNavigate(() => navigate(AdminChequeList), "Manager Cheque"),
      }]
      : []),
   
    {
      key: "payment",
      icon: handleNavigate(() => navigate(PaymentList), getIcon(page, "payment", PaymentLog, GrayPaymentLog)),
      label: handleNavigate(() => navigate(PaymentList), "Payment Logs"),
    },
    {
      key: "support",
      icon: handleNavigate(() => navigate(SupportList), getIcon(page, "support", supportListFill, supportlist)),
      label: handleNavigate(() => navigate(SupportList), "Support List"),
    },
  ];

 
  const supportEngineer = [
    {
      key: "dashboard",
      icon: handleNavigate(() => navigate(Dashboard), getIcon(page, "dashboard", DashboardImg, GrayDashboard)),
      label: handleNavigate(() => navigate(Dashboard), "Dashboard"),
    },
    // {
    //   key: "newuser",
    //   icon:
    //     page == "newuser" && !pageValue ? (
    //       <Image preview={false} src={NewUser} alt="new user" />
    //     ) : (
    //       <Image preview={false} src={GrayNewUser} alt="new user" />
    //     ),
    //   label: <a onClick={()=>navigate(AddUser)}>New User</a>,
    // },
    {
      key: "management",
      icon: page.includes("management") && !pageValue ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "user_management",
          icon: getIcon(page, "user_management", UserFilledIcon, UserGrayIcon),
          label: handleNavigate(() => navigate(UserManagementList), "User Management"),
        },
        {
          key: "kyb_management",
          icon: getIcon(page, "kyb_management", KybFilled, KybGray),
          label: handleNavigate(() => navigate(KYBManagementList), "KYB Management"),
        },
        {
          key: "kyc_management",
          icon: getIcon(page, "kyc_management", KycFilled, KycGray),
          label: handleNavigate(() => navigate(KYCManagementList), "KYC Management"),
        },
        {
          key: "stryde_kyb_management",
          icon:
            page == "stryde_kyb_management" && !pageValue ? (
              <Image preview={false} src={KybFilled} alt="kyb" />
            ) : (
              <Image preview={false} src={KybGray} alt="kyb" />
            ),
          label: <a onClick={()=>navigate(StrydeKYBManagementList)}>Stryde KYB Management</a>,
        },
        {
          key: "stryde_kyc_management",
          icon:
            page == "stryde_kyc_management" && !pageValue ? (
              <Image preview={false} src={KycFilled} alt="user" />
            ) : (
              <Image preview={false} src={KycGray} alt="user" />
            ),
          label: <a onClick={()=>navigate(StrydeKYCManagementList)}>Stryde KYC Management</a>,
        },
        ...(isMCEnabled
          ? [{
            key: "seller_management",
            icon: getIcon(page, "seller_management", KycFilled, KycGray),
            label: handleNavigate(() => navigate(SelllerManagementList), "Screening Management"),
          }]
          : []),
        {
          key: "dispute_management",
          icon: getIcon(page, "dispute_management", DisputeFilled, DisputeGray),
          label: handleNavigate(() => navigate(DisputeManagementList), "Dispute Management"),
        },
      ],
      label: <a>Management</a>,
    },
    {
      key: "escrow",
      icon: page.includes("escrow") && !pageValue ? (
        <Image preview={false} src={Escrow} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEscrow} alt="Escrow" />
      ),
      children: [
        {
          key: "escrow_accounts",
          icon: getIcon(page, "escrow_accounts", escrowAccountsFill, escrowAccounts),
          label: handleNavigate(() => navigate(EscrowAccountsList), "Escrow Accounts"),
        },
        {
          key: "escrow_transaction",
          icon: getIcon(page, "escrow_transaction", EscrowTransFilled, EscrowTrans),
          label: handleNavigate(() => navigate(EscrowTransactionList), "Escrow Transactions"),
        },
      ],
      label: <a>Escrow</a>,
    },
    {
      key: "config",
      icon: page.includes("config") && !pageValue ? (
        <Image preview={false} src={Settings} alt="Escrow" />
      ) : (
        <Image preview={false} src={GraySettings} alt="Escrow" />
      ),
      children: [
        {
          key: "config_type",
          icon: getIcon(page, "config_type", itemCategoriesFill, itemCategories),
          label: handleNavigate(() => navigate(ItemTypesList), "Item Categories"),
        },
        {
          key: "config_category",
          icon: getIcon(page, "config_category", itemTypesFill, itemTypes),
          label: handleNavigate(() => navigate(ItemCategoryList), "Item Types"),
        },
        {
          key: "config_issue",
          icon: getIcon(page, "config_issue", typeOfIssueFill, typeOfIssue),
          label: handleNavigate(() => navigate(TypeOfIssue), "Type Of Issue"),
        },
        {
          key: "config_payment_methods",
          icon: getIcon(page, "config_payment_methods", paymentMethodsFill, paymentMethods),
          label: handleNavigate(() => navigate(PaymentMethods), "Payment Methods"),
        },
      ],
      label: <a>Configuration</a>,
    },
    ...(isMCEnabled
      ? [{
        key: "cheque",
        icon: handleNavigate(() => navigate(AdminChequeList), getIcon(page, "cheque", Managercheque, Mangerchequegray)),
        label: handleNavigate(() => navigate(AdminChequeList), "Manager Cheque"),
      }]
      : []),
    {
      key: "payment",
      icon: handleNavigate(() => navigate(PaymentList), getIcon(page, "payment", PaymentLog, GrayPaymentLog)),
      label: handleNavigate(() => navigate(PaymentList), "Payment Logs"),
    },
    {
      key: "support",
      icon: handleNavigate(() => navigate(SupportList), getIcon(page, "support", supportListFill, supportlist)),
      label: handleNavigate(() => navigate(SupportList), "Support List"),
    },
  ];

  const AuthorizerItems: any = [
    {
      key: "dashboard",
      icon: handleNavigate(() => navigate(Dashboard), getIcon(page, "dashboard", DashboardImg, GrayDashboard)),
      label: handleNavigate(() => navigate(Dashboard), "Dashboard"),
    },
    // {
    //   key: "newuser",
    //   icon: handleNavigate(() => navigate(AddUser), getIcon(page, "newuser", NewUser, GrayNewUser)),
    //   label: handleNavigate(() => navigate(AddUser), "New User")
    // },
    {
      key: "management",
      icon: page.includes("management") && !pageValue ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "kyb_management",
          icon: getIcon(page, "kyb_management", KybFilled, KybGray),
          label: handleNavigate(() => navigate(KYBManagementList), "KYB Management"),
        },
        {
          key: "kyc_management",
          icon: getIcon(page, "kyc_management", KycFilled, KycGray),
          label: handleNavigate(() => navigate(KYCManagementList), "KYC Management"),
        },
        {
          key: "stryde_kyb_management",
          icon: getIcon(page, "stryde_kyb_management", KybFilled, KybGray),
          label: handleNavigate(() => navigate(StrydeKYBManagementList), "Stryde KYB Management"),
        },
        {
          key: "stryde_kyc_management",
          icon: getIcon(page, "stryde_kyc_management", KycFilled, KycGray),
          label: handleNavigate(() => navigate(StrydeKYCManagementList), "Stryde KYC Management"),
        },
        ...(isMCEnabled
          ? [{
            key: "seller_management",
            icon: getIcon(page, "seller_management", KycFilled, KycGray),
            label: handleNavigate(() => navigate(SelllerManagementList), "Screening Management"),
          }]
          : []),
        {
          key: "dispute_management",
          icon: getIcon(page, "dispute_management", DisputeFilled, DisputeGray),
          label: handleNavigate(() => navigate(DisputeManagementList), "Dispute Management"),
        },
      ],
      label: <a>Management</a>,
    },
    {
      key: "escrow",
      icon: page.includes("escrow") && !pageValue ? (
        <Image preview={false} src={Escrow} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEscrow} alt="Escrow" />
      ),
      children: [
        {
          key: "escrow_accounts",
          icon: getIcon(page, "escrow_accounts", Escrow, GrayEscrow),
          label: handleNavigate(() => navigate(EscrowAccountsList), "Escrow Accounts"),
        },
        {
          key: "escrow_transaction",
          icon: getIcon(page, "escrow_transaction", EscrowTransFilled, EscrowTrans),
          label: handleNavigate(() => navigate(EscrowTransactionList), "Escrow Transactions"),
        },
      ],
      label: <a>Escrow</a>,
    },
    ...(isMCEnabled
      ? [{
        key: "cheque",
        icon: handleNavigate(() => navigate(AdminChequeList), getIcon(page, "cheque", Managercheque, Mangerchequegray)),
        label: handleNavigate(() => navigate(AdminChequeList), "Manager Cheque"),
      }]
      : []),
    {
      key: "payment",
      icon: handleNavigate(() => navigate(PaymentList), getIcon(page, "payment", PaymentLog, GrayPaymentLog)),
      label: handleNavigate(() => navigate(PaymentList), "Payment Logs"),
    },
    // {
    //   key: "profile",
    //   icon:
    //     page == "profile" && !pageValue ? (
    //       <Image preview={false} src={Profile} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayProfile} alt="Escrow" />
    //     ),
    //   label: <a onClick={()=>navigate(AdminProfile)}>My Profile</a>,
    // },
    // {
    //   key: "logout",
    //   icon:
    //     page == "logout" || pageValue == "logout" ? (
    //       <Image preview={false} src={LogoutIcon} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayLogout} alt="Escrow" />
    //     ),
    //   label: (
    //     <a
    //       onClick={() => {
    //         setLogoutModal(true);
    //       }}
    //     >
    //       Sign Out
    //     </a>
    //   ),
    // },
  ];

  const approverItems: object[] = [
    {
      key: "dashboard",
      icon: handleNavigate(() => navigate(Dashboard), getIcon(page, "dashboard", DashboardImg, GrayDashboard)),
      label: handleNavigate(() => navigate(Dashboard), "Dashboard"),
    },
    {
      key: "management",
      icon: page.includes("management") && !pageValue ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "kyb_management",
          icon: getIcon(page, "kyb_management", KybFilled, KybGray),
          label: handleNavigate(() => navigate(KYBManagementList), "KYB Management"),
        },
        {
          key: "kyc_management",
          icon: getIcon(page, "kyc_management", KycFilled, KycGray),
          label: handleNavigate(() => navigate(KYCManagementList), "KYC Management"),
        },
        {
          key: "stryde_kyb_management",
          icon:getIcon(page, "stryde_kyb_management", KybFilled, KybGray),
          label: handleNavigate(() => navigate(StrydeKYBManagementList), "Stryde KYB Management"),
        },
        {
          key: "stryde_kyc_management",
          icon:getIcon(page, "stryde_kyc_management", KycFilled, KycGray),
          label: handleNavigate(() => navigate(StrydeKYCManagementList), "Stryde KYC Management"),
        },
        ...(isMCEnabled
          ? [{
            key: "seller_management",
            icon: getIcon(page, "seller_management", KycFilled, KycGray),
            label: handleNavigate(() => navigate(SelllerManagementList), "Screening Management"),
          }]
          : []),
      ],
      label: <a>Management</a>,
    },
    {
      key: "transaction",
      icon: handleNavigate(() => navigate(TrusteeTransaction), getIcon(page, "transaction", EscrowTransFilled, EscrowTrans)),
      label: handleNavigate(() => navigate(TrusteeTransaction), "Escrow"),
    },
    ...(isMCEnabled
      ? [ {
        key: "cheque",
        icon: handleNavigate(() => navigate(AdminChequeList), getIcon(page, "cheque", Managercheque, Mangerchequegray)),
        label: handleNavigate(() => navigate(AdminChequeList), "Manager Cheque"),
      }]
      : []),
      {
        key: "payment",
        icon: handleNavigate(() => navigate(PaymentList), getIcon(page, "payment", PaymentLog, GrayPaymentLog)),
        label: handleNavigate(() => navigate(PaymentList), "Payment Logs"),
      },
    // {
    //   key: "profile",
    //   icon:
    //     page == "profile" && !pageValue ? (
    //       <Image preview={false} src={Profile} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayProfile} alt="Escrow" />
    //     ),
    //   label: <a onClick={()=>navigate(AdminProfile)}>My Profile</a>,
    // },
    // {
    //   key: "logout",
    //   icon:
    //     page == "logout" || pageValue == "logout" ? (
    //       <Image preview={false} src={LogoutIcon} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayLogout} alt="Escrow" />
    //     ),
    //   label: (
    //     <a
    //       onClick={() => {
    //         setLogoutModal(true);
    //       }}
    //     >
    //       Sign Out
    //     </a>
    //   ),
    // },
  ];

  
  
  
  const userItems: any = [
    {
      key: "dashboard",
      icon: handleNavigate(() => navigate(Dashboard), getIcon(page, "dashboard", DashboardImg, GrayDashboard)),
      label: handleNavigate(() => navigate(Dashboard), "Dashboard"),
    },
    {
      key: "create",
      icon: handleNavigate(() => navigate(CreateEscrow), getIcon(page, "create", EscrowTransFilled, EscrowTrans)),
      label: handleNavigate(() => navigate(CreateEscrow), "Escrow Transaction"),
    },
    ...(isMCEnabled
      ? [{
          key: "cheque",
          icon: handleNavigate(() => navigate(Cheques), getIcon(page, "cheque", Managercheque, Mangerchequegray)),
          label: handleNavigate(() => navigate(Cheques), `Manager Cheque`),
        }]
      : []),
    {
      key: "uaepgshistory",
      icon: handleNavigate(() => navigate(UaepgsTransactionHistory), getIcon(page, "uaepgshistory", onlinePaymentsFill, onlinePayments)),
      label: handleNavigate(() => navigate(UaepgsTransactionHistory), "Online Payments"),
    },
    {
      key: "bank",
      icon: handleNavigate(() => navigate(BankList), getIcon(page, "bank", BankAccFilled, BankAcc)),
      label: handleNavigate(() => navigate(BankList), "Bank Account"),
    },
    {
      key: "archived",
      icon: handleNavigate(() => navigate(ArchivedList), getIcon(page, "archived", Archivedtransfill, Archivedtrans)),
      label: handleNavigate(() => navigate(ArchivedList), "Archived Escrow Transaction"),
    },
    {
      key: "transactionhistory",
      icon: (<Image
        preview={false}
        src={page.includes('transactionhistory') && !pageValue ? transactionHistory : grayTransactionHistory}
        alt="transaction history"
      />),
      collapsed: false,
      children: [
        {
          key: "transactionhistory_escrow",
          icon: getIcon(page, "transactionhistory_escrow", escrowAccountsFill, escrowAccounts),
          label: handleNavigate(() => navigate(EscrowTransactionHistory), "Escrow Accounts", "text-ellipsis", "Escrow Transaction History"),
        },
        {
          key: "transactionhistory_bank",
          icon: getIcon(page, "transactionhistory_bank", bankAccountsFill, bankAccounts),
          label: handleNavigate(() => navigate(BankTransactionHistory), "Bank Accounts", "text-ellipsis", "Bank Transaction History"),
        },
      ],
      label: <a className="" title='Transaction History'>Transaction History</a>,
    },
    // {
    //   key: "history",
    //   icon:
    //     page == "history" && !pageValue ? (
    //       <Image preview={false} src={Profile} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayProfile} alt="Escrow" />
    //     ),
    //   label: <a onClick={()=>navigate(AdminProfile)}>Transaction History</a>,
    // },

    // {
    //   key: "profile",
    //   icon:
    //     page == "profile"&& !pageValue  ? (
    //       <Image preview={false} src={Profile} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayProfile} alt="Escrow" />
    //     ),
    //   label: <a onClick={()=>navigate(AdminProfile)}>My Profile</a>,
    // },
    // {
    //   key: "logout",
    //   icon:
    //     page == "logout" || pageValue == "logout" ? (
    //       <Image preview={false} src={LogoutIcon} alt="logout" />
    //     ) : (
    //       <Image preview={false} src={GrayLogout} alt="logout" />
    //     ),
    //   label: (
    //     <a
    //       onClick={() => {
    //         setLogoutModal(true);
    //       }}
    //     >
    //       Sign Out
    //     </a>
    //   ),
    // },
  ];

  const escrowAdvisorItems: any = [
    {
      key: "dashboard",
      icon: handleNavigate(() => navigate(Dashboard), getIcon(page, "dashboard", DashboardImg, GrayDashboard)),
      label: handleNavigate(() => navigate(Dashboard), "Dashboard"),
    },
    // {
    //   key: "create",
    //   icon:
    //     page == "create" && !pageValue ? (
    //       <Image preview={false} src={EscrowTransFilled} alt="new user" />
    //     ) : (
    //       <Image preview={false} src={EscrowTrans} alt="new user" />
    //     ),
    //   label: <a onClick={()=>navigate(CreateEscrow)}>Escrow Transaction</a>,
    // },
    // {
    //   key: "user-list",
    //   icon:
    //     page == "history" && !pageValue ? (
    //       <Image preview={false} src={Profile} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayProfile} alt="Escrow" />
    //     ),
    //   label: <a onClick={()=>navigate(UserList)}>User List</a>,
    // },
    {
      key: "bank",
      icon: handleNavigate(() => navigate(BankList), getIcon(page, "bank", BankAccFilled, BankAcc)),
      label: handleNavigate(() => navigate(BankList), "Bank Account"),
    },
    {
      key: "archived",
      icon: handleNavigate(() => navigate(ArchivedList), getIcon(page, "archived", Archivedtransfill, Archivedtrans)),
      label: handleNavigate(() => navigate(ArchivedList), "Archived Escrow Transaction"),
    },
    // {
    //   key: "transactionhistory",
    //   icon:
    //     page == "transactionhistory" && !pageValue ? (
    //       <Image
    //         preview={false}
    //         src={transactionHistory}
    //         alt="transaction history"
    //       />
    //     ) : (
    //       <Image
    //         preview={false}
    //         src={grayTransactionHistory}
    //         alt="transaction history"
    //       />
    //     ),
    //   label: <a onClick={()=>navigate(TransactionHistory)}>Transaction History</a>,
    // },
    {
      key: "transactionhistory",
      icon: (<Image
        preview={false}
        src={page.includes('transactionhistory') && !pageValue ? transactionHistory : grayTransactionHistory}
        alt="transaction history"
      />),
      collapsed: false,
      children: [
        {
          key: "transactionhistory_escrow",
          icon: getIcon(page, "transactionhistory_escrow", escrowAccountsFill, escrowAccounts),
          label: handleNavigate(() => navigate(EscrowTransactionHistory), "Escrow Accounts", "text-ellipsis", "Escrow Transaction History"),
        },
        {
          key: "transactionhistory_bank",
          icon: getIcon(page, "transactionhistory_bank", bankAccountsFill, bankAccounts),
          label: handleNavigate(() => navigate(BankTransactionHistory), "Bank Accounts", "text-ellipsis", "Bank Transaction History"),
        },
      ],
      label: <a className="" title='Transaction History'>Transaction History</a>,
    },
    
    // {
    //   key: "profile",
    //   icon:
    //     page == "profile"&& !pageValue  ? (
    //       <Image preview={false} src={Profile} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayProfile} alt="Escrow" />
    //     ),
    //   label: <a onClick={()=>navigate(AdminProfile)}>My Profile</a>,
    // },
    // {
    //   key: "logout",
    //   icon:
    //     page == "logout" || pageValue == "logout" ? (
    //       <Image preview={false} src={LogoutIcon} alt="logout" />
    //     ) : (
    //       <Image preview={false} src={GrayLogout} alt="logout" />
    //     ),
    //   label: (
    //     <a
    //       onClick={() => {
    //         setLogoutModal(true);
    //       }}
    //     >
    //       Sign Out
    //     </a>
    //   ),
    // },
  ];

  const checkerMakerItems: object[] = [
    {
      key: "dashboard",
      icon: handleNavigate(() => navigate(Dashboard), getIcon(page, "dashboard", DashboardImg, GrayDashboard)),
      label: handleNavigate(() => navigate(Dashboard), "Dashboard"),
    },
    {
      key: "management",
      icon: page.includes("management") && !pageValue ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "kyb_management",
          icon: getIcon(page, "kyb_management", KybFilled, KybGray),
          label: handleNavigate(() => navigate(KYBManagementList), "KYB Management"),
        },
        {
          key: "kyc_management",
          icon: getIcon(page, "kyc_management", KycFilled, KycGray),
          label: handleNavigate(() => navigate(KYCManagementList), "KYC Management"),
        },
      ],
      label: <a>Management</a>,
    },
    {
      key: "profile",
      icon: handleNavigate(() => navigate(AdminProfile), getIcon(page, "profile", Profile, GrayProfile)),
      label: handleNavigate(() => navigate(AdminProfile), "My Profile"),
    },
    {
      key: "logout",
      icon: handleNavigate(() => navigate(AdminProfile), getIcon(page, "logout", LogoutIcon, GrayLogout)),
      label: (<a onClick={() => { setLogoutModal(true); }}  >Sign Out </a>
      ),
    },
    {
      key: "logout",
      icon:
        page == "logout" || pageValue == "logout" ? (
          <Image preview={false} src={LogoutIcon} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayLogout} alt="Escrow" />
        ),
      label: (
        <a
          onClick={() => {
            setLogoutModal(true);
          }}
        >
          Sign Out
        </a>
      ),
    },
  ]

  const getMenuItems = (UserType: string, items: { [key: string]: any[] }) => {
    const userTypeToItemsMap: { [key: string]: any[] } = {
      ADMIN: items.adminItems,
      USER: items.userItems,
      ESCROW_ADVISOR: items.escrowAdvisorItems,
      TRUSTEE: items.approverItems,
      APPROVER: items.approverItems,
      AUTHORIZER: items.AuthorizerItems,
      SENIOR_MANAGMENT: items.AuthorizerItems,
      MAKER: items.checkerMakerItems,
      CHECKER: items.checkerMakerItems,
      SUPPORT_ENGINEER :items.supportEngineer
    };

    return userTypeToItemsMap[UserType] || [];
  };

  const items = getMenuItems(UserType, {
    adminItems,
    userItems,
    escrowAdvisorItems,
    approverItems,
    AuthorizerItems,
    checkerMakerItems,
    supportEngineer
  });

  return (
    <div className="h-100">
       <div className="d-flex h-100 flex-column">
      {/* <div className="center">
        <Image preview={false} src={Logo} className="sidebarlogo" />
      </div> */}
      {/* <Button className="custom-new-bruger-btn" type="primary" onClick={handleCollapse}>
        {(collapsed) ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button> */}
      {/* <div className="custom-new-bruger-btn" onClick={handleCollapse}>
        {(collapsed) ? <MenuUnfoldOutlined className="sidebar-icon"/> : <MenuFoldOutlined className="sidebar-icon"/>}
      </div> */}
      <div className="custom-new-bruger-btn">
         <button type="button" onClick={handleCollapse} className="icon-btn"> {collapsed ? ( <MenuUnfoldOutlined className="sidebar-icon" /> ) : ( <MenuFoldOutlined className="sidebar-icon" /> )} </button> 
         </div>
      <div className="center" style={{background:'#fff'}}>
            {(collapsed)?
             <Image src={FormLogo} height={100} width={60} preview={false} className="sidebarlogo" onClick={() => {navigate(Dashboard)}} style={{cursor:'pointer', objectFit:'contain'}}/>:
              <Image preview={false} height={100} width={100} src={Logo} className="sidebarlogo" onClick={() => {navigate(Dashboard)}} style={{cursor:'pointer',objectFit:'contain'}}/>
            }
            </div>
        <Menu
          inlineCollapsed={collapsed}
          theme="dark"
          mode="inline"
          selectedKeys={[pageValue == '' ? page : pageValue]}
          defaultOpenKeys={[page.includes("management") ? 'management' : page.split('_')[0]]}
          items={items ? items : []}
          className="sidebar_menu"
        />
        {(collapsed) ? (
          <>
            {(UserType !== "ADMIN" && UserType !== "SUPPORT_ENGINEER") && (
              <Tooltip title="For Support & Help" placement="right">
              <Button className="help_button fixed-bottom-bar custom-help-support-btn"
                onClick={() => { navigate(SupportHelpList) }}>
                <ArrowRightOutlined />
              </Button>
              </Tooltip>)}
          </>
        ) : <>
         {(UserType !== "ADMIN" && UserType !== "SUPPORT_ENGINEER") && (
            <Button 
              className="help_button fixed-bottom-bar custom-help-support-btn"
              onClick={() => { navigate(SupportHelpList); }}
            >
              For Support & Help <ArrowRightOutlined />
            </Button>
          )}
        </>
        }
      </div>

      <div>
        {logoutModal ? (
          <Logout
            logoutModal={logoutModal}
            setLogoutModal={setLogoutModal}
            setpageValue={setPageValue}
          />
        ) : null}</div>

    </div>
  );
};

export default Sidebar;
