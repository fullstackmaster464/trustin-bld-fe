import { Image, message } from "antd";
import UserHeader from "./UserHeader";
import KYCKYBVerification from "../../assets/img/KYC_KYB_Verification.svg";
import { getLocalStorage } from "../Common/Constants";
import { useEffect, useState } from "react";
import { getAllNotifications } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { fetchKybDetails } from "../../services/admin";

const Final = () => {
  const LoginDetail = JSON.parse(getLocalStorage("auth")!);
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
  const isKycVerified = JSON.parse(getLocalStorage("auth")!)?.isKycVerified;
  const STEP = JSON.parse(getLocalStorage("auth")!)?.step
  const navigate = useNavigate();
  const [BusinessName, setBusinessName] = useState("");


  useEffect(() => {
    if (LoginDetail?.name) {
      fetchKybDetails(userAlias).then((response) => {
        setBusinessName(response?.data?.data[0]?.basic[0]?.typeOfEntity === "INDIVIDUAL" ? LoginDetail?.name : response?.data?.data[0]?.business[0]?.businessName)
      }).catch(() => {
        message.error("Could not fetch details. Please try again later!");
      })
    } else {
      setBusinessName('User');
    }

  }, [LoginDetail?.name])

  useEffect(() => {
    if(STEP !== 'done'){
      navigate(-1)
    }
    window.scrollTo(0, 0);
    const intervalId = setInterval(() => {
      getAllNotifications(userAlias)
        .then((response) => {
          if (response?.data?.data) {
            const kycVerifiedNotification = response?.data?.data?.find((elem: any) => (elem.notificationType == "kyc_verified" || elem.notificationType == "kyb_verified"));
            if (!!kycVerifiedNotification && isKycVerified === false) {
              localStorage.clear();
              window.location.href = "/login";
            }
          }
        })
        .catch(() => {
          // message.error("Could not fetch details. Please try again later!");
          clearInterval(intervalId)
        });
    }, 10000);
    return () => clearInterval(intervalId); //This is important
  }, []);
  
  return (
    <div>
      {STEP == 'done' ? 
      <div>
      <UserHeader />
      <div className="welcome text-center welcome_res mt-5">
        Welcome, <b>{BusinessName}!</b>
      </div>
      <div className="mtop-5 mx-5">
        <div className="center my-5">
          <Image src={KYCKYBVerification} alt="thankyou" preview={false} />
        </div>
        <div className="center">
          <div className="grayText text-center thank w-40 mb-5">
          Thank you {BusinessName} for submitting your KYC/KYB details. Our team will review your 
          request and get back to you within one working day. 
          We appreciate your patience and cooperation in this process.
          </div>
        </div>
      </div>
    </div>
    :""}
    </div>
  );
};

export default Final;
