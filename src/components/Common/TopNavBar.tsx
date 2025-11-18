import {
  Badge,
  Button,
  Col,
  Drawer,
  Image,
  Menu,
  Popover,
  Row,
  Space,
  message,
} from "antd";
// import { Link, animateScroll } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowRightOutlined, MenuOutlined } from "@ant-design/icons";
import Bell from "../../assets/img/bell.svg";
import Blue_Bell from "../../assets/img/blue-bell.svg";
import { getLocalStorage } from "./Constants";
import moment from "moment";
import { getAllNotifications, updateNotifications, updateNotificationsByAlias } from "../../services/user";
import GrayLogout from "../../assets/img/gray_logout.svg";
import Logout from "./Logout";
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
import EscrowTransFilled from "../../assets/img/escrowTransFilled.svg";
import EscrowTrans from "../../assets/img/escrowTransGray.svg";
import BankAcc from "../../assets/img/bankacc.svg";
import BankAccFilled from "../../assets/img/bankaccfilled.svg";
import Archivedtrans from "../../assets/img/archivedTrans.svg";
import Archivedtransfill from "../../assets/img/archivedTransFilled.svg";
// import EnterpriseFilled from "../../assets/img/EnterpriseFilled.svg";
// import Enterprise from "../../assets/img/EnterpriseGray.svg";
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
import CloseIcon from "../../assets/img/blackclose.svg";
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
import onlinePayments from "../../assets/img/onlinepaygray.svg";
import onlinePaymentsFill from "../../assets/img/onlinepayfill.svg";
import supportlist from "../../assets/img/supportlistgray.svg"
import supportListFill from "../../assets/img/supportlistfill.svg"
import Managercheque from "../../assets/img/bankcheck.svg";
import Mangerchequegray from "../../assets/img/bankcheckfgray.svg";
import LeftArrow from "../../assets/img/leftArrow.svg";

// import Logo from "../../assets/img/Logo.svg";
import {
  // AddUser,
  AdminProfile,
  ArchivedList,
  BankList,
  CreateEscrow,
  Dashboard,
  DisputeManagementList,
  // EnterpriseCallList,
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
  // TransactionHistory,
  TrusteeTransaction,
  SupportList,
  TypeOfIssue,
  // UserList,
  SupportHelpList,
  EscrowTransactionHistory,
  BankTransactionHistory,
  UaepgsTransactionHistory,
  StrydeKYBManagementList,
  StrydeKYCManagementList,
  Cheques,
  AdminChequeList,
  SelllerManagementList
} from "./RouteConst";

const TopNavBar = (props: object|any):any => {
  const { page,TitleText,TitleImage,backtoDashboard } = props;
  // const [active, setactive] = useState(["0"]);
  const [visible, setVisible] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const navigate = useNavigate();
  const isUserVerified = JSON.parse(getLocalStorage("auth")!)?.isKycVerified;
  const isMCEnabled : boolean = process.env.ENABLE_MANAGER_CHEQUE === "true";

  const [logoutModal, setLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState<any>([]);
  const LoginDetail = JSON.parse(getLocalStorage("auth")!);
  const UserType = LoginDetail?.userType;
  const userAlias = LoginDetail?.userAlias;
  // const isKycVerified = LoginDetail?.isKycVerified;
  const [pageValue, setPageValue] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const [agrementAcceptedAellerInfo, setAgrementAcceptedSellerInfo] = useState<any>(null);
  const handleViewToggle = () => {
    setViewAll(!viewAll);
    if (notificationsRef.current) {
      notificationsRef.current.scrollTop = 0;
    }
  };

  // const checkIsUserVerified = () => {
  //   if ((UserType == "USER" && isKycVerified) || UserType != "USER")
  //     navigate(AdminProfile, { replace: true });
  // };

  const getIcon = (activePage: any, targetPage: any, filledIcon: any, grayIcon: any) => {
    return activePage === targetPage && !pageValue ? (
      <Image preview={false} src={filledIcon} alt={targetPage} />
    ) : (
      <Image preview={false} src={grayIcon} alt={targetPage} />
    );
  };

  const handleNavigate = (navigateFn: any, label: any, className?: string, title?: string) => {
    return (
      <a className={className ? className : ""} title={title ? title : ""} onClick={(e) => { e.preventDefault(); navigateFn(); }}>{label}</a>
    );
  };

  const adminItems: any = [
    {
      key: "dashboard",
      icon:
        page == "dashboard" ? (
          <Image preview={false} src={DashboardImg} alt="dashboard" />
        ) : (
          <Image preview={false} src={GrayDashboard} alt="dashboard" />
        ),
      label: <a href={Dashboard}>Dashboard</a>,
    },
    // {
    //   key: "newuser",
    //   icon:
    //     page == "newuser" ? (
    //       <Image preview={false} src={NewUser} alt="new user" />
    //     ) : (
    //       <Image preview={false} src={GrayNewUser} alt="new user" />
    //     ),
    //   label: <a href={AddUser}>New User</a>,
    // },
    {
      key: "management",
      icon: page.includes("management") ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "user_management",
          icon:
            page == "user_management" ? (
              <Image preview={false} src={UserFilledIcon} alt="user" />
            ) : (
              <Image preview={false} src={UserGrayIcon} alt="user" />
            ),
          label: <a href={UserManagementList}>User Management</a>,
        },
        {
          key: "kyb_management",
          icon:
            page == "kyb_management" ? (
              <Image preview={false} src={KybFilled} alt="kyb" />
            ) : (
              <Image preview={false} src={KybGray} alt="kyb" />
            ),
          label: <a href={KYBManagementList}>KYB Management</a>,
        },
        {
          key: "kyc_management",
          icon:
            page == "kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="kyc" />
            ),
          label: <a href={KYCManagementList}>KYC Management</a>,
        },
        {
          key: "stryde_kyb_management",
          icon:
            page == "stryde_kyb_management" ? (
              <Image preview={false} src={KycFilled} alt="stryde kyb" />
            ) : (
              <Image preview={false} src={KycGray} alt="stryde kyc" />
            ),
          label: <a href={StrydeKYBManagementList}>Stryde KYB Management</a>,
        },
        {
          key: "stryde_kyc_management",
          icon:
            page == "stryde_kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="stryde kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="stryde kyc" />
            ),
          label: <a href={StrydeKYCManagementList}>Stryde KYC Management</a>,
        },
        ...(isMCEnabled
          ? [{
            key: "seller_management",
            icon:
              page == "seller_management" ? (
                <Image preview={false} src={KycFilled} alt="screening management" />
              ) : (
              <Image preview={false} src={KycGray} alt="screening management" />
              ),
            label: handleNavigate(() => navigate(SelllerManagementList), "Screening Management"),
            }]
        : []),
           {
          key: "dispute_management",
          icon:
            page == "dispute_management" ? (
              <Image preview={false} src={DisputeFilled} alt="Escrow" />
            ) : (
              <Image preview={false} src={DisputeGray} alt="Escrow" />
            ),
          label: <a href={DisputeManagementList}>Dispute Management</a>,
        },
      ],
      label: <a>Management</a>,
    },
    {
      key: "escrow",
      icon: page.includes("escrow") ? (
        <Image preview={false} src={Escrow} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEscrow} alt="Escrow" />
      ),
      children: [
        {
          key: "escrow_accounts",
          icon:
            page == "escrow_accounts" ? (
              <Image preview={false} src={escrowAccountsFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={escrowAccounts} alt="Escrow" />
            ),
          label: <a href={EscrowAccountsList}>Escrow Accounts</a>,
        },
        {
          key: "escrow_transaction",
          icon:
            page == "escrow_transaction" ? (
              <Image preview={false} src={EscrowTransFilled} alt="Escrow" />
            ) : (
              <Image preview={false} src={EscrowTrans} alt="Escrow" />
            ),
          label: <a href={EscrowTransactionList}>Escrow Transactions</a>,
        },
      ],
      label: <a>Escrow</a>,
    },
    {
      key: "config",
      icon: page.includes("config") ? (
        <Image preview={false} src={Settings} alt="Escrow" />
      ) : (
        <Image preview={false} src={GraySettings} alt="Escrow" />
      ),
      children: [
        {
          key: "config_type",
          icon:
            page == "config_type" ? (
              <Image preview={false} src={itemCategoriesFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={itemCategories} alt="Escrow" />
            ),
          label: <a href={ItemTypesList}>Item Categories</a>,
        },
        {
          key: "config_category",
          icon:
            page == "config_category" ? (
              <Image preview={false} src={itemTypesFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={itemTypes} alt="Escrow" />
            ),
          label: <a href={ItemCategoryList}>Item Types</a>,
        },
        {
          key: "config_issue",
          icon:
            page == "config_issue" && !pageValue ? (
              <Image preview={false} src={typeOfIssueFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={typeOfIssue} alt="Escrow" />
            ),
          label: <a onClick={()=>navigate(TypeOfIssue)}>Type Of Issue</a>,
        },
      ],
      label: <a>Configuration</a>,
    },
    {
      key: "enquiry",
      icon: page.includes("enquiry") ? (
        <Image preview={false} src={Enquiry} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEnquiry} alt="Escrow" />
      ),
      children: [
        {
          key: "enquiry_regular",
          icon:
            page == "enquiry_regular" ? (
              <Image preview={false} src={CustomerFilled} alt="Escrow" />
            ) : (
              <Image preview={false} src={CustomerGray} alt="Escrow" />
            ),
          label: <a href={RegularCustomer}>Leads</a>,
        },
        // {
        //   key: "enquiry_enterprise",
        //   icon:
        //     page == "enquiry_enterprise" ? (
        //       <Image preview={false} src={EnterpriseFilled} alt="Escrow" />
        //     ) : (
        //       <Image preview={false} src={Enterprise} alt="Escrow" />
        //     ),
        //   label: <a href={EnterpriseCallList}>Enterprise</a>,
        // },
      ],
      label: <a>Enquiry</a>,
    },
    ...(isMCEnabled
      ? [
    {
      key: "cheque",
      icon:
        page == "cheque" ? (
          <Image preview={false} src={Managercheque} alt="cheque" />
        ) : (
          <Image preview={false} src={Mangerchequegray} alt="cheque" />
        ),
      label: <a href={AdminChequeList}>Manager Cheque</a>,
    }]
    : []),
    {
      key: "payment",
      icon:
        page == "payment" ? (
          <Image preview={false} src={PaymentLog} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayPaymentLog} alt="Escrow" />
        ),
      label: <a href={PaymentList}>Payment Logs</a>,
    },
    {
      key: "support",
      icon:
        page == "support" && !pageValue ? (
          <Image preview={false} src={supportListFill} alt="support" />
        ) : (
          <Image preview={false} src={supportlist} alt="support" />
        ),
      label: <a onClick={()=>navigate(SupportList)}>Support List</a>,
    },
    {
      key: "profile",
      icon:
        page == "profile" ? (
          <Image preview={false} src={Profile} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayProfile} alt="Escrow" />
        ),
      label: <a href={AdminProfile}>My Profile</a>,
    },
    {
      key: "logout",
      icon:
        page == "logout" ? (
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
  ];
  const AuthorizerItems: any = [
    {
      key: "dashboard",
      icon:
        page == "dashboard" ? (
          <Image preview={false} src={DashboardImg} alt="dashboard" />
        ) : (
          <Image preview={false} src={GrayDashboard} alt="dashboard" />
        ),
      label: <a href={Dashboard}>Dashboard</a>,
    },
    // {
    //   key: "newuser",
    //   icon:
    //     page == "newuser" ? (
    //       <Image preview={false} src={NewUser} alt="newuser" />
    //     ) : (
    //       <Image preview={false} src={GrayNewUser} alt="newuser" />
    //     ),
    //   label: <a href={AddUser}>New User</a>,
    // },
    {
      key: "management",
      icon: page.includes("management") ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "kyb_management",
          icon:
            page == "kyb_management" ? (
              <Image preview={false} src={KybFilled} alt="kyb" />
            ) : (
              <Image preview={false} src={KybGray} alt="kyb" />
            ),
          label: <a href={KYBManagementList}>KYB Management</a>,
        },
        {
          key: "kyc_management",
          icon:
            page == "kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="kyc" />
            ),
          label: <a href={KYCManagementList}>KYC Management</a>,
        },
        {
          key: "stryde_kyb_management",
          icon:
            page == "stryde_kyb_management" ? (
              <Image preview={false} src={KycFilled} alt="stryde kyb" />
            ) : (
              <Image preview={false} src={KycGray} alt="stryde kyc" />
            ),
          label: <a href={StrydeKYBManagementList}>Stryde KYB Management</a>,
        },
        {
          key: "stryde_kyc_management",
          icon:
            page == "stryde_kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="stryde kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="stryde kyc" />
            ),
          label: <a href={StrydeKYCManagementList}>Stryde KYC Management</a>,
        },
        ...(isMCEnabled
          ? [{
            key: "seller_management",
            icon:
            page == "seller_management" ? (
              <Image preview={false} src={KycFilled} alt="screening management" />
            ) : (
              <Image preview={false} src={KycGray} alt="screening management" />
            ),
            label: handleNavigate(() => navigate(SelllerManagementList), "Screening Management"),
          }]
          : []),
        {
          key: "dispute_management",
          icon:
            page == "dispute_management" ? (
              <Image preview={false} src={DisputeFilled} alt="Escrow" />
            ) : (
              <Image preview={false} src={DisputeGray} alt="Escrow" />
            ),
          label: <a href={DisputeManagementList}>Dispute Management</a>,
        },
      ],
      label: <a>Management</a>,
    },
    {
      key: "escrow",
      icon: page.includes("escrow") ? (
        <Image preview={false} src={Escrow} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEscrow} alt="Escrow" />
      ),
      children: [
        {
          key: "escrow_accounts",
          icon:
            page == "escrow_accounts" ? (
              <Image preview={false} src={escrowAccountsFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={escrowAccounts} alt="Escrow" />
            ),
          label: <a href={EscrowAccountsList}>Escrow Accounts</a>,
        },
        {
          key: "escrow_transaction",
          icon:
            page == "escrow_transaction" ? (
              <Image preview={false} src={EscrowTransFilled} alt="Escrow" />
            ) : (
              <Image preview={false} src={EscrowTrans} alt="Escrow" />
            ),
          label: <a href={EscrowTransactionList}>Escrow Transactions</a>,
        },
      ],
      label: <a>Escrow</a>,
    },
    ...(isMCEnabled
      ? [
    {
      key: "cheque",
      icon:
        page == "cheque" ? (
          <Image preview={false} src={Managercheque} alt="cheque" />
        ) : (
          <Image preview={false} src={Mangerchequegray} alt="cheque" />
        ),
      label: <a href={AdminChequeList}>Manager Cheque</a>,
    }]
    : []),
    {
      key: "payment",
      icon:
        page == "payment" ? (
          <Image preview={false} src={PaymentLog} alt="payment" />
        ) : (
          <Image preview={false} src={GrayPaymentLog} alt="payment" />
        ),
      label: <a href={PaymentList}>Payment Logs</a>,
    },

    {
      key: "profile",
      icon:
        page == "profile" ? (
          <Image preview={false} src={Profile} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayProfile} alt="Escrow" />
        ),
      label: <a href={AdminProfile}>My Profile</a>,
    },

    {
      key: "logout",
      icon:
        page == "logout" ? (
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
  ];

  const escrowAdvisorItems: any = [
    {
      key: "dashboard",
      icon:
        page == "dashboard" && !pageValue ? (
          <Image preview={false} src={DashboardImg} alt="dashboard" />
        ) : (
          <Image preview={false} src={GrayDashboard} alt="dashboard" />
        ),
      label: <a onClick={()=>navigate(Dashboard)}>Dashboard</a>,
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
      icon:
        page == "bank" && !pageValue ? (
          <Image preview={false} src={BankAccFilled} alt="Escrow" />
        ) : (
          <Image preview={false} src={BankAcc} alt="Escrow" />
        ),
      label: <a onClick={()=>navigate(BankList)}>Bank Account</a>,
    },
    {
      key: "archived",
      icon:
        page == "archived" && !pageValue ? (
          <Image preview={false} src={Archivedtransfill} alt="Escrow" />
        ) : (
          <Image preview={false} src={Archivedtrans} alt="Escrow" />
        ),
      label: (
        <a onClick={()=>navigate(ArchivedList)} className="text-ellipsis">
          Archived Escrow Transaction
        </a>
      ),
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
        src={page.includes('transaction_history') && !pageValue ? transactionHistory : grayTransactionHistory}
        alt="transaction history"
      />),
      children: [
        {
          key: 'transactionhistory_escrow',
          icon: <Image
            preview={false}
            src={page == "transactionhistory_escrow" && !pageValue ? escrowAccountsFill : escrowAccounts}
            alt="escrow transaction history"
          />,
          label: <a onClick={()=>navigate(EscrowTransactionHistory)}  title="Escrow Transaction History">Escrow Accounts</a>
        },
        {
          key: 'transactionhistory_bank',
          icon: <Image
            preview={false}
            src={page == "transactionhistory_bank" && !pageValue ? bankAccountsFill : bankAccounts}
            alt="bank transaction history"
          />,
          label: <a onClick={()=>navigate(BankTransactionHistory)} title="Bank Transaction History">Bank Accounts</a>
        }
      ],
      label: <a title='Transaction History'>Transaction History</a>,
    },
    {
      key: "profile",
      icon:
        page == "profile"&& !pageValue  ? (
          <Image preview={false} src={Profile} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayProfile} alt="Escrow" />
        ),
      label: <a onClick={()=>navigate(AdminProfile)}>My Profile</a>,
    },
    {
      key: "logout",
      icon:
        page == "logout" || pageValue == "logout" ? (
          <Image preview={false} src={LogoutIcon} alt="logout" />
        ) : (
          <Image preview={false} src={GrayLogout} alt="logout" />
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
  ];
  const userItems: any = [
    {
      key: "dashboard",
      icon:
        page == "dashboard" ? (
          <Image preview={false} src={DashboardImg} alt="dashboard" />
        ) : (
          <Image preview={false} src={GrayDashboard} alt="dashboard" />
        ),
      label: <a href={Dashboard}>Dashboard</a>,
    },
    {
      key: "create",
      icon:
        page == "create" ? (
          <Image preview={false} src={EscrowTransFilled} alt="new user" />
        ) : (
          <Image preview={false} src={EscrowTrans} alt="new user" />
        ),
      label: <a href={CreateEscrow}>Escrow Transaction</a>,
    },
    ...(isMCEnabled
      ? [
    {
      key: "cheque",
      icon:
        page == "cheque" ? (
          <Image preview={false} src={Managercheque} alt="cheque" />
        ) : (
          <Image preview={false} src={Mangerchequegray} alt="cheque" />
        ),
      label: <a href={Cheques}>Manager Cheque</a>,
    }]
    : []),
    {
      key: "uaepgshistory",
      icon:
        page == "uaepgshistory" && !pageValue ? (
          <Image
            preview={false}
            src={onlinePaymentsFill}
            alt="uaepgs history"
          />
        ) : (
          <Image
            preview={false}
            src={onlinePayments}
            alt="uaepgs history"
          />
        ),
      label: <a onClick={()=>navigate(UaepgsTransactionHistory)}>Online Payments</a>,
    },
    {
      key: "bank",
      icon:
        page == "bank" ? (
          <Image preview={false} src={BankAccFilled} alt="Escrow" />
        ) : (
          <Image preview={false} src={BankAcc} alt="Escrow" />
        ),
      label: <a href={BankList}>Bank Account</a>,
    },
    {
      key: "archived",
      icon:
        page == "archived" ? (
          <Image preview={false} src={Archivedtransfill} alt="Escrow" />
        ) : (
          <Image preview={false} src={Archivedtrans} alt="Escrow" />
        ),
      label: <a href={ArchivedList}>Archived Escrow Transaction</a>,
    },
    // {
    //   key: "history",
    //   icon:
    //     page == "history" ? (
    //       <Image preview={false} src={Profile} alt="Escrow" />
    //     ) : (
    //       <Image preview={false} src={GrayProfile} alt="Escrow" />
    //     ),
    //   label: <a href={AdminProfile}>Transaction History</a>,
    // },
    // {
    //   key: "transactionhistory",
    //   icon:
    //     page == "transactionhistory" ? (
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
    //   label: <a href={TransactionHistory}>Transaction History</a>,
    // },
    {
      key: "transactionhistory",
      icon: (<Image
        preview={false}
        src={page.includes('transactionhistory') && !pageValue ? transactionHistory : grayTransactionHistory}
        alt="transaction history"
      />),
      children: [
        {
          key: 'transactionhistory_escrow',
          icon: <Image
            preview={false}
            src={page == "transactionhistory_escrow" && !pageValue ? escrowAccountsFill : escrowAccounts}
            alt="escrow transaction history"
          />,
          label: <a onClick={()=>navigate(EscrowTransactionHistory)} title="Escrow Transaction History">Escrow Accounts</a>
        },
        {
          key: 'transactionhistory_bank',
          icon: <Image
            preview={false}
            src={page == "transactionhistory_bank" && !pageValue ? bankAccountsFill : bankAccounts}
            alt="bank transaction history"
          />,
          label: <a onClick={()=>navigate(BankTransactionHistory)}  title="Bank Transaction History">Bank Accounts</a>
        }
      ],
      label: <a  title='Transaction History'>Transaction History</a>,
    },
    {
      key: "profile",
      icon:
        page == "profile" ? (
          <Image preview={false} src={Profile} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayProfile} alt="Escrow" />
        ),
      label: <a href={AdminProfile}>My Profile</a>,
    },
    {
      key: "logout",
      icon:
        page == "logout" || pageValue == "logout" ? (
          <Image preview={false} src={LogoutIcon} alt="logout" />
        ) : (
          <Image preview={false} src={GrayLogout} alt="logout" />
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
  ];
  const approverItems: object[] = [
    {
      key: "dashboard",
      icon:
        page == "dashboard" ? (
          <Image preview={false} src={DashboardImg} alt="dashboard" />
        ) : (
          <Image preview={false} src={GrayDashboard} alt="dashboard" />
        ),
      label: <a href={Dashboard}>Dashboard</a>,
    },
    {
      key: "management",
      icon: page.includes("management") ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "kyb_management",
          icon:
            page == "kyb_management" ? (
              <Image preview={false} src={KybFilled} alt="kyb" />
            ) : (
              <Image preview={false} src={KybGray} alt="kyb" />
            ),
          label: <a href={KYBManagementList}>KYB Management</a>,
        },
        {
          key: "kyc_management",
          icon:
            page == "kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="kyc" />
            ),
          label: <a href={KYCManagementList}>KYC Management</a>,
        },
        {
          key: "stryde_kyb_management",
          icon:
            page == "stryde_kyb_management" ? (
              <Image preview={false} src={KybFilled} alt="stryde kyb" />
            ) : (
              <Image preview={false} src={KybGray} alt="stryde kyb" />
            ),
          label: <a href={StrydeKYBManagementList}>Stryde KYB Management</a>,
        },
        {
          key: "stryde_kyc_management",
          icon:
            page == "stryde_kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="stryde kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="stryde kyc" />
            ),
          label: <a href={StrydeKYCManagementList}>Stryde KYC Management</a>,
        },
        ...(isMCEnabled
          ? [{
            key: "seller_management",
            icon:
            page == "seller_management" ? (
              <Image preview={false} src={KycFilled} alt="screening management" />
            ) : (
              <Image preview={false} src={KycGray} alt="screening management" />
            ),
            label: handleNavigate(() => navigate(SelllerManagementList), "Screening Management"),
          }]
          : []),
      ],
      label: <a>Management</a>,
    },
    {
      key: "transaction",
      icon: page.includes("transaction") && !pageValue ? (
        <Image preview={false} src={Escrow} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEscrow} alt="Escrow" />
      ),
      label: <a onClick={()=>navigate(TrusteeTransaction)}>Escrow</a>,
    },
    ...(isMCEnabled
      ? [
    {
      key: "cheque",
      icon: page.includes("cheque") && !pageValue ? (
        <Image preview={false} src={Managercheque} alt="Manager Cheque" />
      ) : (
        <Image preview={false} src={Mangerchequegray} alt="Manager Cheque" />
      ),
      label: <a onClick={()=>navigate(AdminChequeList)}>Manager Cheque</a>,
    }]
    : []),
    {
      key: "payment",
      icon:
        page == "payment" ? (
          <Image preview={false} src={PaymentLog} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayPaymentLog} alt="Escrow" />
        ),
      // label: <a href={PaymentList}>Payment Logs</a>,
      label: <a onClick={()=>navigate(PaymentList)}>Payment Logs</a>,
    },

    {
      key: "profile",
      icon:
        page == "profile" ? (
          <Image preview={false} src={Profile} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayProfile} alt="Escrow" />
        ),
      label: <a href={AdminProfile}>My Profile</a>,
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
  ];
  const unVerifiedUserItems = [
    {
      key: "dashboard",
      icon:
        page == "dashboard" ? (
          <Image preview={false} src={DashboardImg} alt="dashboard" />
        ) : (
          <Image preview={false} src={GrayDashboard} alt="dashboard" />
        ),
      label: <a href={Dashboard}>Dashboard</a>,
    },
    {
      key: "logout",
      icon:
        page == "logout" ? (
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
    }
  ]
  const checkerMakerItems = [
    {
      key: "dashboard",
      icon:
        page == "dashboard" ? (
          <Image preview={false} src={DashboardImg} alt="dashboard" />
        ) : (
          <Image preview={false} src={GrayDashboard} alt="dashboard" />
        ),
      label: <a href={Dashboard}>Dashboard</a>,
    },
    {
      key: "management",
      icon: page.includes("management") ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "kyb_management",
          icon:
            page == "kyb_management" ? (
              <Image preview={false} src={KybFilled} alt="kyb" />
            ) : (
              <Image preview={false} src={KybGray} alt="kyb" />
            ),
          label: <a href={KYBManagementList}>KYB Management</a>,
        },
        {
          key: "kyc_management",
          icon:
            page == "kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="kyc" />
            ),
          label: <a href={KYCManagementList}>KYC Management</a>,
        },
      ],
      label: <a>Management</a>,
    },
    {
      key: "profile",
      icon:
        page == "profile" ? (
          <Image preview={false} src={Profile} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayProfile} alt="Escrow" />
        ),
      label: <a href={AdminProfile}>My Profile</a>,
    },

    {
      key: "logout",
      icon:
        page == "logout" ? (
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
  ];
  const supportengineerItems: any = [
    {
      key: "dashboard",
      icon:
        page == "dashboard" ? (
          <Image preview={false} src={DashboardImg} alt="dashboard" />
        ) : (
          <Image preview={false} src={GrayDashboard} alt="dashboard" />
        ),
      label: <a href={Dashboard}>Dashboard</a>,
    },
    {
      key: "management",
      icon: page.includes("management") ? (
        <Image preview={false} src={Management} alt="management" />
      ) : (
        <Image preview={false} src={GrayManagement} alt="management" />
      ),
      children: [
        {
          key: "user_management",
          icon:
            page == "user_management" ? (
              <Image preview={false} src={UserFilledIcon} alt="user" />
            ) : (
              <Image preview={false} src={UserGrayIcon} alt="user" />
            ),
          label: <a href={UserManagementList}>User Management</a>,
        },
        {
          key: "kyb_management",
          icon:
            page == "kyb_management" ? (
              <Image preview={false} src={KybFilled} alt="kyb" />
            ) : (
              <Image preview={false} src={KybGray} alt="kyb" />
            ),
          label: <a href={KYBManagementList}>KYB Management</a>,
        },
        {
          key: "kyc_management",
          icon:
            page == "kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="kyc" />
            ),
          label: <a href={KYCManagementList}>KYC Management</a>,
        },
        {
          key: "stryde_kyb_management",
          icon:
            page == "stryde_kyb_management" ? (
              <Image preview={false} src={KycFilled} alt="stryde kyb" />
            ) : (
              <Image preview={false} src={KycGray} alt="stryde kyc" />
            ),
          label: <a href={StrydeKYBManagementList}>Stryde KYB Management</a>,
        },
        {
          key: "stryde_kyc_management",
          icon:
            page == "stryde_kyc_management" ? (
              <Image preview={false} src={KycFilled} alt="stryde kyc" />
            ) : (
              <Image preview={false} src={KycGray} alt="stryde kyc" />
            ),
          label: <a href={StrydeKYCManagementList}>Stryde KYC Management</a>,
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
          icon:
            page == "dispute_management" ? (
              <Image preview={false} src={DisputeFilled} alt="Escrow" />
            ) : (
              <Image preview={false} src={DisputeGray} alt="Escrow" />
            ),
          label: <a href={DisputeManagementList}>Dispute Management</a>,
        },
      ],
      label: <a>Management</a>,
    },
    {
      key: "escrow",
      icon: page.includes("escrow") ? (
        <Image preview={false} src={Escrow} alt="Escrow" />
      ) : (
        <Image preview={false} src={GrayEscrow} alt="Escrow" />
      ),
      children: [
        {
          key: "escrow_accounts",
          icon:
            page == "escrow_accounts" ? (
              <Image preview={false} src={escrowAccountsFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={escrowAccounts} alt="Escrow" />
            ),
          label: <a href={EscrowAccountsList}>Escrow Accounts</a>,
        },
        {
          key: "escrow_transaction",
          icon:
            page == "escrow_transaction" ? (
              <Image preview={false} src={EscrowTransFilled} alt="Escrow" />
            ) : (
              <Image preview={false} src={EscrowTrans} alt="Escrow" />
            ),
          label: <a href={EscrowTransactionList}>Escrow Transactions</a>,
        },
      ],
      label: <a>Escrow</a>,
    },
    {
      key: "config",
      icon: page.includes("config") ? (
        <Image preview={false} src={Settings} alt="Escrow" />
      ) : (
        <Image preview={false} src={GraySettings} alt="Escrow" />
      ),
      children: [
        {
          key: "config_type",
          icon:
            page == "config_type" ? (
              <Image preview={false} src={itemCategoriesFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={itemCategories} alt="Escrow" />
            ),
          label: <a href={ItemTypesList}>Item Categories</a>,
        },
        {
          key: "config_category",
          icon:
            page == "config_category" ? (
              <Image preview={false} src={itemTypesFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={itemTypes} alt="Escrow" />
            ),
          label: <a href={ItemCategoryList}>Item Types</a>,
        },
        {
          key: "config_issue",
          icon:
            page == "config_issue" && !pageValue ? (
              <Image preview={false} src={typeOfIssueFill} alt="Escrow" />
            ) : (
              <Image preview={false} src={typeOfIssue} alt="Escrow" />
            ),
          label: <a onClick={()=>navigate(TypeOfIssue)}>Type Of Issue</a>,
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
      icon:
        page == "payment" ? (
          <Image preview={false} src={PaymentLog} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayPaymentLog} alt="Escrow" />
        ),
      label: <a href={PaymentList}>Payment Logs</a>,
    },
    {
      key: "support",
      icon:
        page == "support" && !pageValue ? (
          <Image preview={false} src={supportListFill} alt="support" />
        ) : (
          <Image preview={false} src={supportlist} alt="support" />
        ),
      label: <a onClick={()=>navigate(SupportList)}>Support List</a>,
    },
    {
      key: "profile",
      icon:
        page == "profile" ? (
          <Image preview={false} src={Profile} alt="Escrow" />
        ) : (
          <Image preview={false} src={GrayProfile} alt="Escrow" />
        ),
      label: <a href={AdminProfile}>My Profile</a>,
    },
    {
      key: "logout",
      icon:
        page == "logout" ? (
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
  ];

  useEffect(() => {
    const handleScrollPosition = () => {
      if (window.pageYOffset > 0) {
        setScrollDown(true);
      } else {
        setScrollDown(false);
      }
    };

    window.addEventListener("scroll", handleScrollPosition);
    return () => window.removeEventListener("scroll", handleScrollPosition);
  }, []);
  useEffect(() => {
    if (Array.isArray(notifications.data)) {
      notifications.data.forEach((notification: { notificationType: string, isRead: boolean }) => {
        if (notification.notificationType === "aggrement_accept_by_buyer_seller") {
          setAgrementAcceptedSellerInfo(notification)
        }
      });
    }
  }, [notifications]);

  const handleUpdate = (item: any) => {
    updateNotificationsByAlias({ aliasName: item.aliasName })
      .then((response) => {
        if (response?.status === 201 || response?.status === 200) {
          getAllNotifications(userAlias)
            .then((response) => {
              setNotifications(response?.data);
            })
            .catch(() => {
              // message.error("Could not fetch details. Please try again later!");
            });
        }
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later!");
      });
  };

  useEffect(() => {
    getAllNotifications(userAlias)
      .then((response) => {
        setNotifications(response?.data);
      })
      .catch(() => {
        // message.error("Could not fetch details. Please try again later!");
      });
  }, [userAlias]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllNotifications(userAlias)
        .then((response) => {
          setNotifications(response?.data);
        })
        .catch(() => {
          // message.error("Could not fetch details. Please try again later!");
          clearInterval(intervalId);
        });
    }, 10000);
    return () => clearInterval(intervalId); //This is important
  }, [userAlias]);
  const notificationsUpdate = () => {
    updateNotifications({ userAlias: userAlias })
      .then((response: any) => {
        if (response?.status === 201 || response?.status === 200) {
          getAllNotifications(userAlias)
            .then((response) => {
              setNotifications(response?.data);
            })
            .catch(() => {
              // message.error("Could not fetch details. Please try again later!");
            });
        }
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later!");
      });
  };
  const showDrawer = () => {
    setVisible(true);
  };
  const goBack = () =>{
    if(backtoDashboard == true){
      navigate(-1)
    }
  }
  return (

    <>
    <div
    
    >
     
     <div  className={
        scrollDown
          ? "w-100 px-4 py-3 mb-8  fixedHeader bgColorWhite"
          : "w-100 px-4 py-3 mb-8  fixedHeader bgColorTrans"
      }>
          {!TitleText && UserType === "USER" && (
        <div className="d-block">
              <div className="iso-text pb-3 text-center" role="alert" aria-live="polite">
              <span className="blinking-circle active me-2" aria-hidden="true"></span>
               Announcement:
                <span style={{color:'#ff6600'}}> Trustin Limited is now an ISO 27001 Certified Company </span>
              </div>
        </div>)}
      <div className="d-flex justify-content-between align-items-center">
      {!TitleText ? (
      <div className="welcome">
        Welcome, <b>{LoginDetail?.name || "User" }</b>
          {agrementAcceptedAellerInfo && UserType === "USER" ? (
              <h6>
                🎉 Congratulations! your escrow account is open, powered by
                <img
                  src="https://trustin-live-docs.s3.amazonaws.com/EMIRATESNBD.png"
                  alt=""
                  style={{ width: "100px", height: "auto" }}
                  className="ms-2"
                />
              </h6>
            ) : null}
      </div>
    ) : (
      // <div className="welcome w-inherit">{page}</div>
      <div className="d-flex w-100">
         {TitleImage && (
              <Image
                src={TitleImage}
                preview={false}
                className={`cursor ${TitleImage === LeftArrow ? 'res-leftarrow-icon' : 'header-icon'}`}
                alt="escrowimage"
                onClick={goBack}
              />
            )}
      <div className="ml-4 verticalcenter_div">
        <b>{TitleText}</b>
      </div>
    </div>
    )}

     
            <div className="d-flex my-3">
              <div className="d-flex">
        <Menu>
          {UserType === "USER" || UserType === "TRUSTEE" ? (
            <Popover
              overlayClassName="popover-mobile box-shadow"
              trigger="click"
              getPopupContainer={(trigger: any) => trigger.parentElement}
              content={
                <>
                  <div  ref={notificationsRef}
                      className={
                        viewAll
                          ? "notifications-popup pb-2"
                          : "default-notification pb-2"
                      }>
                    {notifications?.data?.map((item: any) => (
                      <div key={item.id}>
                        {item.isRead ? (
                          <p key={item.id} className="mb-0">
                            {item.message}
                          </p>
                        ) : (
                          <b
                            key={item.id}
                            className="mb-0 cursor"
                            onClick={() => handleUpdate(item)}
                          >
                            {item.message}
                          </b>
                        )}

                        <span className="fw-4">
                          {moment(item.createAt).format("DD-MM-YYYY, h:mm a")}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Row className="d-flex justify-content-center">
                      <Col className=" py-3 read-view-btns">
                        <Button
                          key="submit"
                          type="primary"
                          className="modal-button mx-2 mb-2"
                          onClick={() => {
                            notificationsUpdate();
                          }}
                        >
                          Mark as read
                        </Button>
                        <Button
                          type="primary"
                          className="modal-button mx-2"
                          onClick={handleViewToggle}
                        >
                          {viewAll ? "View less" : "View all"}
                        </Button>
                      </Col>
                    </Row>
                </>
              }
              placement="bottomRight"
            >
              <Menu.Item
                key="notification"
                className="notification notification_res"
                icon={
                  notifications?.count > 0 ? (
                    <Image
                      src={Bell}
                      alt="bell"
                      preview={false}
                      height={54}
                      width={54}
                      className="cursor"
                    />
                  ) : (
                    <Image
                      src={Blue_Bell}
                      alt="bell"
                      preview={false}
                      height={54}
                      width={54}
                      className="cursor"
                    />
                  )
                }
                style={{
                  lineHeight: "normal",
                  textAlign: "end",
                }}
              >
                {
                  <>
                    <div className="notifi_box">
                      {/* For Desktop */}
                      <Badge
                        count={notifications?.count}
                        className="notifi_badge"
                      ></Badge>
                    </div>
                  </>
                }
              </Menu.Item>
            </Popover>
          ) : null}
        </Menu>
      </div>

      <div>
        <Space onClick={showDrawer}>
          {" "}
          <MenuOutlined className="d-block d-lg-none menuIcon mt-2" />
        </Space>
        <Drawer
          height={400}
          open={visible}
          placement="right"
          onClose={() => setVisible(false)}
          title={<div className="endtoend mx-3"><span className="mt-2">Menu</span><span><Image src={CloseIcon} className="cursor" preview={false} onClick={()=>{ setVisible(false)}}/></span></div>}
        >
          {/* <div className="center">
            <Image preview={false} src={Logo} className="sidebarlogo" />
          </div> */}
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[page]}
            defaultOpenKeys={[page.includes("management") ? 'management' : page.split('_')[0] ]}
            items={
              UserType === "ADMIN"
                ? adminItems
                : UserType === "USER" && isUserVerified
                ? userItems 
                : UserType === "USER" && !isUserVerified 
                ? unVerifiedUserItems
                : UserType === "ESCROW_ADVISOR" && isUserVerified
                ? escrowAdvisorItems
                : UserType === "TRUSTEE" || UserType === "APPROVER"
                ? approverItems
                : UserType === "AUTHORIZER" || UserType == "SENIOR_MANAGMENT"
                ? AuthorizerItems
                : UserType === "CHECKER" || UserType == "MAKER" 
                ? checkerMakerItems
                : UserType === "SUPPORT_ENGINEER"
                ? supportengineerItems
                :""
            }
            className="sidebar_menu"
          />
          {(UserType !== "ADMIN" && UserType !== "SUPPORT_ENGINEER") &&  (
          <Button className="w-100 endtoend help_button my-5"
            onClick={() => {navigate(SupportHelpList)}}>
            {" "}
            For Support & Help <ArrowRightOutlined />
          </Button>
          )}
        </Drawer>
      </div>
      </div>
      </div>
      {logoutModal ? (
        <Logout
          logoutModal={logoutModal}
          setLogoutModal={setLogoutModal}
          setpageValue={setPageValue}
          page={pageValue}
        />
      ) : null}
    </div>
    </div>
    </>
  );
};

export default TopNavBar;
