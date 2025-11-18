import {
  Badge,
  Image,
  Menu,
  Popover,
  message,
  Dropdown,
  Button,
  Row,
  Col,
} from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import Bell from "../../assets/img/bell.svg";
import Blue_Bell from "../../assets/img/blue-bell.svg";
// import defaultUser from "../../assets/img/defaultUser.svg";
import { useEffect, useState, useRef } from "react";
import {
  AdminProfile,
  KYBVerificatioStep6,
  KYCVerificatioStep4,
} from "./RouteConst";
import { useNavigate } from "react-router-dom";
import { USER_TYPE_TEXT, getLocalStorage, setLocalStorage } from "./Constants";
import {
  getAllNotifications,
  updateNotifications,
  updateNotificationsByAlias,
} from "../../services/user";
// import LogoutIcon from "../../assets/img/logout.svg";
import type { MenuProps } from "antd";
import Logout from "../Common/Logout";
import moment from "moment";
import { fetchKybSummary } from "../../services/admin";
const Header = (props: any) => {
  const { page  } = props;
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [ProfileLetter, setProfileLetter] = useState("");
  const [pageValue, setPageValue] = useState("");
  window.onresize = () => {
    setWidth(document.body.clientWidth);
  };
  const [notifications, setNotifications] = useState<any>([]);
  const LoginDetail = JSON.parse(getLocalStorage("auth") || "{}");
  const { userAlias, isKycVerified, name } = LoginDetail;
  const UserType = JSON.parse(getLocalStorage("auth")!)?.userType;
  const [logoutModal, setLogoutModal] = useState(false);
  // const [scroll, setScroll] = useState(false);
  const [BusinessName, setBusinessName] = useState("");
  const navigate = useNavigate();
  const [viewAll, setViewAll] = useState(false);
  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const [agrementAcceptedAellerInfo, setAgrementAcceptedSellerInfo] = useState<any>(null);
  const handleViewToggle = () => {
    setViewAll(!viewAll);
    if (notificationsRef.current) {
      notificationsRef.current.scrollTop = 0;
    }
  };

  const checkIsUserVerified = () => {
    if ((UserType == "USER" && isKycVerified) || UserType != "USER")
      navigate(AdminProfile, { replace: true });
  };

  useEffect(() => {
    if (Array.isArray(notifications.data)) {
      notifications.data.forEach((notification: { notificationType: string, isRead: boolean }) => {
        if (notification.notificationType === "aggrement_accept_by_buyer_seller") {
          setAgrementAcceptedSellerInfo(notification)
        }
      });
    }
  }, [notifications]);

  useEffect(() => {
    getAllNotifications(userAlias)
      .then((response) => {
        setNotifications(response?.data);
      })
      .catch(() => {
        // message.error("Could not fetch details. Please try again later!");
      });

      let entityType = "";
        fetchKybSummary(userAlias).then((userDetails :any)=>{
          const isRepDocExpired = userDetails?.data?.data?.isRepDocExpired || false;
        if (isRepDocExpired) {
          const localStrorageValue = JSON.parse(getLocalStorage("auth")!);
          localStrorageValue.isKycVerified = false;
          setLocalStorage("auth", JSON.stringify(localStrorageValue));
        }

        if (userDetails?.data?.data) {
          entityType = userDetails?.data?.data?.typeOfEntity;
        }
        let isTradeLicenseExpired = false;
        let isShrDocExpired = false;
        if (entityType === "COMPANY") {
          isTradeLicenseExpired = userDetails?.data?.data?.isTradeLicenseExpired;
          isShrDocExpired = userDetails?.data?.data?.isShrDocExpired;
          if (isTradeLicenseExpired || isShrDocExpired) {
            const localStrorageValue = JSON.parse(getLocalStorage("auth")!);
            localStrorageValue.isKycVerified = false;
            setLocalStorage("auth", JSON.stringify(localStrorageValue));
          }
        }
        }).catch(() => {
          message.error("Could not fetch details. Please try again later!");
        });
  }, [userAlias]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getAllNotifications(userAlias)
        .then(async (response) => {
          let entityType = "";
          const userDetails = await fetchKybSummary(userAlias).catch(() => {
            // message.error("Could not fetch details. Please try again later!");
          });
          const isRepDocExpired =
            userDetails?.data?.data?.isRepDocExpired;
          if (isRepDocExpired) {
            const localStrorageValue = JSON.parse(getLocalStorage("auth")!);
            localStrorageValue.isKycVerified = false;
            setLocalStorage("auth", JSON.stringify(localStrorageValue));
          }

          if (userDetails?.data?.data) {
            entityType = userDetails?.data?.data?.typeOfEntity;
          }
          let isTradeLicenseExpired = false;
          let isShrDocExpired = false;
          if (entityType === "COMPANY") {
            isTradeLicenseExpired = userDetails?.data?.data?.isTradeLicenseExpired;
            isShrDocExpired = userDetails?.data?.data?.isShrDocExpired;
            if (isTradeLicenseExpired || isShrDocExpired) {
              const localStrorageValue = JSON.parse(getLocalStorage("auth")!);
              localStrorageValue.isKycVerified = false;
              setLocalStorage("auth", JSON.stringify(localStrorageValue));
            }
          }
          
          if (response?.data?.data) {
            const kycVerifiedNotification = response?.data?.data?.find(
              (elem: any) =>
                elem.notificationType == "kyc_verified" ||
                elem.notificationType == "kyb_verified"
            );
            const kycRejectedNotification = response?.data?.data?.find(
              (elem: any) => elem.notificationType == "kyc_rejected"
            );
            if (
              !!kycVerifiedNotification &&
              isKycVerified === false &&
              !isRepDocExpired &&
              !isTradeLicenseExpired &&
              !isShrDocExpired
            ) {
              // localStorage.clear();
              // window.location.href = "/login";
            }
            if (
              !!kycRejectedNotification &&
              isKycVerified === false &&
              entityType === "INDIVIDUAL" &&
              window?.location?.pathname == "/verification-progress"
            ) {
              navigate(KYCVerificatioStep4, { replace: true });
            }
            if (
              !!kycRejectedNotification &&
              isKycVerified === false &&
              entityType === "COMPANY" &&
              window?.location?.pathname == "/verification-progress"
            ) {
              navigate(KYBVerificatioStep6, { replace: true });
            }
          }
          setNotifications(response?.data);
        })
        .catch(() => {
          message.error("Could not fetch details. Please try again later!");
          clearInterval(intervalId);
        });
    }, 10000);
    return () => clearInterval(intervalId); //This is important
  }, []);
  const notificationsUpdate = () => {
    updateNotifications({ userAlias: userAlias })
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
    const initials = BusinessName?.match(/\b\w/g) || [];
    const profileLetter = (initials.length > 1 ? `${initials[0]}${initials[1]}` : initials[0]) || "U";
    setProfileLetter(profileLetter)
  }, [BusinessName]);

  useEffect(() => {
    fetchKybSummary(userAlias)
      .then((response) => {
        if (response?.data?.data?.typeOfEntity === "COMPANY") {
          setBusinessName(response?.data?.data?.businessName);
        } else {
          setBusinessName(name);
        }
      })
      .catch(() => {
        message.error("Could not fetch details. Please try again later!");
      });
  }, []);

  const items: MenuProps["items"] = [
    ...(isKycVerified || (UserType !== "USER" && UserType !== "ESCROW_ADVISOR")
      ? [
          {
            label: (
              <div
                className="d-flex align-items-center signout-menu"
                onClick={checkIsUserVerified}
              >
                <UserOutlined className="px-1" />
                <span className="p-2">My Profile</span>
              </div>
            ),
            key: "0",
          },
        ]
      : []),
    {
      label: (
        <div
          className="d-flex align-items-center signout-menu"
          onClick={() => {
            setLogoutModal(true);
          }}
        >
          <LogoutOutlined className="px-1" />
          <span className="mx-2">Sign Out</span>
        </div>
      ),
      key: "1",
    },
  ];
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
  return (
    <>
    
    {!page && UserType === "USER" && (
    <div className="iso-text text-center pt-0 pb-3">
      <span className="blinking-circle active me-2"></span>
      Announcement : 
      <span style={{ color: '#ff6600' }}> Trustin Limited is now an ISO 27001 Certified Company </span>
    </div>
     )}
    <div className={Width < 992 ? "endtoend mt-10" : "w-100 endtoend"}> 
      {!page ? (
        <div className="welcome mb-4">
         
          Welcome, <b>{LoginDetail?.name || "User"}</b>
          <br />
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
        <div className="welcome mb-4 w-inherit">{page}</div>
      )}
      <div>
        <div className="d-flex notify gap-1">
          <Menu>
            {UserType === "USER" || UserType === "TRUSTEE" || UserType === "ADMIN" || UserType === 'MAKER' || UserType === 'ESCROW_ADVISOR'? (
              <Popover
                overlayClassName=" box-shadow"
                trigger="click"
                getPopupContainer={(trigger: any) => trigger.parentElement}
                content={
                  <>
                    <div
                      ref={notificationsRef}
                      className={
                        viewAll
                          ? "notifications-popup pb-2"
                          : "default-notification pb-2"
                      }
                    >
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
                    <Row className="d-flext justify-content-center">
                      <Col className=" py-3">
                        <Button
                          key="submit"
                          type="primary"
                          className="modal-button mx-2"
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
                  className="notification"
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
          <Dropdown
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <div className="d-flex cursor">
              <span className="userProfile userProfile_pending d-flex border-none align-items-center">
                <div className="d-flex modal-title mx-1 ">
                  <span className="profileLetter">{ProfileLetter}</span>
                </div>
                <div className={"profileText"}>
                  {LoginDetail?.name || "User"}
                  {LoginDetail?.userType !== "USER" && (
                    <div className="secondaryText">
                      {USER_TYPE_TEXT[LoginDetail?.userType]}
                    </div>
                  )}
                </div>
              </span>
            </div>
          </Dropdown>
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
    </>
  );
};

export default Header;
