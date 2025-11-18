import { Image, Progress,Dropdown, Menu, Popover, Badge, message } from "antd";
import Logo from "../../assets/img/Logo.svg";
import { SecondaryColor, darkWhite } from "../Common/ColorConstants";
import { USER_TYPE_TEXT, getLocalStorage } from "../Common/Constants";
import { useEffect, useState } from "react";
import type { MenuProps } from 'antd';
import Bell from "../../assets/img/bell.svg";
import Logout from "../Common/Logout"
import moment from "moment";
import { getAllNotifications, updateNotifications } from "../../services/user";
import { KYBVerificatioStep6, KYCVerificatioStep4 } from "../Common/RouteConst";
import { useNavigate } from "react-router-dom";
import { fetchKybDetails } from "../../services/admin";
import { LogoutOutlined } from "@ant-design/icons";
const UserHeader = (props: any) => {
  const { step } = props;
  const LoginDetail = JSON.parse(getLocalStorage("auth") || "{}");
  const { UserType, userAlias, isKycVerified, name } = LoginDetail;
  const [ProfileLetter, setProfileLetter] = useState("");
  const [logoutModal, setLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState<any>([]);
  const [BusinessName, setBusinessName] = useState("");
  const navigate = useNavigate();

  const notificationsUpdate = () => {
    updateNotifications({ userAlias: userAlias })
      .then((response:any) => {
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
  const [pageValue, setPageValue] = useState("");
 
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
    if (name) {
      fetchKybDetails(userAlias).then((response) => {
        setBusinessName(response?.data?.data[0]?.basic[0]?.typeOfEntity === "INDIVIDUAL" ? name : response?.data?.data[0]?.business[0]?.businessName)
      }).catch(() => {
        message.error("Could not fetch details. Please try again later!");
      })
    } else {
      setBusinessName('User');
    }

  }, [name])

  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllNotifications(userAlias)
        .then(async(response) => {
          let entityType = "";
          let documents:any = "";
          const userDetails = await fetchKybDetails(userAlias).catch(() => {
            // message.error("Could not fetch details. Please try again later!");
          });
          
          if (userDetails?.data?.data?.[0]?.basic?.[0]) {
            entityType = userDetails?.data?.data?.[0]?.basic?.[0].typeOfEntity;
            documents = userDetails?.data?.data?.[0]?.documents?.[0];
           
            if ((documents?.repDocFront?.[0]?.status === "REJECTED" ||
              documents?.repDocBack?.[0]?.status === "REJECTED" ||
              documents?.repAddProof?.[0]?.status === "REJECTED" ||
              documents?.authorizationDoc?.[0]?.status === "REJECTED") && (entityType === "INDIVIDUAL") && (window?.location?.pathname == "/verification-progress")) {
              navigate(KYCVerificatioStep4, { replace: true });
            }
            if ((documents?.businessRegProof?.[0]?.status === "REJECTED" ||
              documents?.businessAddProof?.[0]?.status === "REJECTED" ||
              documents?.repDocFront?.[0]?.status === "REJECTED" ||
              documents?.repDocBack?.[0]?.status === "REJECTED" ||
              documents?.repAddProof?.[0]?.status === "REJECTED" ||
              documents?.authorizationDoc?.[0]?.status === "REJECTED") && (entityType === "COMPANY") && (window?.location?.pathname == "/verification-progress")) {
              navigate(KYBVerificatioStep6, { replace: true });
            }
          }          
          if (response?.data?.data) {
            const kycVerifiedNotification = response?.data?.data?.find((elem: any) => (elem.notificationType == "kyc_verified" || elem.notificationType == "kyb_verified"));
            const kycRejectedNotification = response?.data?.data?.find((elem: any) => elem.notificationType == "kyc_rejected");
            if (!!kycVerifiedNotification && isKycVerified === false) {
              localStorage.clear();
              window.location.href = "/login";
            }
       
            if ((documents?.repDocFront?.[0]?.status === "REJECTED" ||
              documents?.repDocBack?.[0]?.status === "REJECTED" ||
              documents?.repAddProof?.[0]?.status === "REJECTED" ||
              documents?.authorizationDoc?.[0]?.status === "REJECTED") && !!kycRejectedNotification && isKycVerified === false && (entityType === "INDIVIDUAL") && (window?.location?.pathname == "/verification-progress")) {
              navigate(KYCVerificatioStep4, { replace: true });
            }
            if ((documents?.businessRegProof?.[0]?.status === "REJECTED" ||
              documents?.businessAddProof?.[0]?.status === "REJECTED" ||
              documents?.repDocFront?.[0]?.status === "REJECTED" ||
              documents?.repDocBack?.[0]?.status === "REJECTED" ||
              documents?.repAddProof?.[0]?.status === "REJECTED" ||
              documents?.authorizationDoc?.[0]?.status === "REJECTED") && !!kycRejectedNotification && isKycVerified === false && (entityType === "COMPANY") && (window?.location?.pathname == "/verification-progress")) {
              navigate(KYBVerificatioStep6, { replace: true });
            }
          }
          setNotifications(response?.data);
        })
        .catch(() => {
          message.error("Could not fetch details. Please try again later!");
          clearInterval(intervalId)
        });
    }, 10000);
    
    return () => clearInterval(intervalId); //This is important
  }, [useState]);

  useEffect(() => {
    const initials = BusinessName?.match(/\b\w/g) || [];
    const profileLetter = (initials.length > 1 ? `${initials[0]}${initials[1]}` : initials[0]) || "U";
    setProfileLetter(profileLetter); 
  }), [BusinessName];

  const items: MenuProps['items'] = [
    {
      label: (
        <div className="d-flex align-items-center signout-menu signout-menu-width" onClick={() => { setLogoutModal(true) }}>
          <LogoutOutlined className="px-1"/>
          <span className="mx-2">Sign Out</span>
        </div>
      ),
      key: '1',
    }]
  return (
    <div className="main-top-header">
      <div className="d-flex w-100 endtoend verification">
          <div className="d-flex verification w-50">
            <Image src={Logo} alt="logo" preview={false} />
            <div className="welcome space-left">
              Welcome, <b>{BusinessName || "User"}!</b>
            </div>
          </div>
        <div className="d-flex notify cursor">
        <Menu>
            {UserType === "USER" || UserType === "TRUSTEE" || UserType === 'ESCROW_ADVISOR' ? (
              <Popover
                overlayClassName=" box-shadow"
                trigger="click"
                getPopupContainer={(trigger: any) => trigger.parentElement}
                content={
                    <div className="notifications-popup">
                      {notifications?.data?.map((item: any) => (
                        <>
                          <p key={item.id} className="mb-0">
                            {item.message}
                          </p>
                          <span className="fw-4">
                            {moment(item.createAt).format(
                              "DD-MM-YYYY, h:mm a"
                            )}
                          </span>
                        </>
                      ))}
                    </div>
                }
                placement="bottomRight"
              >
                <Menu.Item
                  key="notification"
                  className="notification"
                  onClick={() => {
                    notificationsUpdate();
                  }}
                  icon={
                    <Image
                      src={Bell}
                      alt="bell"
                      preview={false}
                      height={54}
                      width={54}
                      className="cursor"
                    />
                  }
                  style={{
                    lineHeight: "normal",
                    textAlign: "center",
                  }}
                >
                  {
                    <>
                      <div
                        // style={{ position: "relative" }}
                        className="notifi_box"
                      >
                        {/* For Desktop */}
                        <Badge
                          count={notifications?.count}
                          className="notifi_badge"
                        >
                          {/* <span style={{ fontSize: "14px" }}>
                            Notifications
                          </span> */}
                        </Badge>
                        {/* For Mobile */}
                        {/* <Badge
                          count={notifications?.count}
                          className="desk_notification"
                        ></Badge> */}
                      </div>
                      {/* // <Link to="/#" ><span>Notifications </span> {notifications?.count} </Link> */}
                    </>
                  }
                </Menu.Item>
              </Popover>
            ) : null}
          </Menu>
        <Dropdown menu={{items}} trigger={['click']} placement="bottomRight" className="mb-5">
            <div className="d-flex">
          <span
            className="userProfile userProfile_pending d-flex border-none align-items-center"
          >
            <div className="d-flex modal-title mx-1 align-items-center"><span className="profileLetter">{ProfileLetter}</span></div>
                <div className={"profileText"}>
                  {BusinessName || "User"}
                  {LoginDetail?.userType !== "USER" && (
                    <div className="secondaryText">
                      {USER_TYPE_TEXT[LoginDetail?.userType]}
                    </div>)}
                </div>
          </span>
        </div>
        </Dropdown>
        </div>
      </div>

      <Progress
        className="mb-0"
        percent={step}
        showInfo={false}
        strokeColor={SecondaryColor}
        size="small"
        trailColor={darkWhite}
      />
      {logoutModal ? (
        <Logout
          logoutModal={logoutModal}
          setLogoutModal={setLogoutModal}
          setpageValue={setPageValue}
          pageValue={pageValue}
        />
      ) : null}
    </div>
  );
};

export default UserHeader;
