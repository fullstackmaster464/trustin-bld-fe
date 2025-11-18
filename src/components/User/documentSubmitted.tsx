import { Image, message } from "antd";
import ThankYou from "../../assets/img/thank_you.svg";
import { getLocalStorage } from "../Common/Constants";
import { useEffect, useState } from "react";
import { fetchKybDetails } from "../../services/admin";
import Header from "../Common/header";

const DocumentSubmitted = () => {
  const LoginDetail = JSON.parse(getLocalStorage("auth")!);
  const userAlias = JSON.parse(getLocalStorage("auth")!)?.userAlias;
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
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div>
      <div className="m-5">
        <Header />
        <div className="welcome text-center welcome_res mt-5">
          Welcome, <b>{BusinessName}!</b>
        </div>
        <div className="mtop-5 mx-5">
          <div className="center my-5">
            <Image src={ThankYou} alt="thankyou" preview={false} />
          </div>
          <div className="center">
            <div className="grayText text-center thank w-40 mb-5">
            Thank you {BusinessName} for submitting your document details. Our team will review your 
            request and get back to you within one working day. 
            We appreciate your patience and cooperation in this process.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSubmitted;
