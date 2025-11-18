import { Button, Image } from "antd";
import Individual from "../../assets/img/CheckboxUser.svg";
import Company from "../../assets/img/checkBoxCompany.svg";
import Individual_select from "../../assets/img/individual_select.svg";
import Tick from "../../assets/img/circle_orange.svg";
import Company_select from "../../assets/img/company_select.svg";
import { useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import { Dashboard, KYBVerificatioStep2, KYCVerificatioStep2 } from "../Common/RouteConst";
import { getLocalStorage, setLocalStorage } from "../Common/Constants";
import { fetchKybDetails } from "../../services/admin";
import Loader from "../utilities/Loader";
const VerificationStep1 = () => {
  const [selected, setSelected] = useState(
    JSON.parse(getLocalStorage("auth")!)?.userType.toLowerCase()
  );
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  const [loading, setloading] = useState(true);
  const local = getLocalStorage("auth");
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const navigate = useNavigate();
  window.onresize = () => {
    setWidth(document.body.clientWidth);
  };

  // const [authorizationDoc, setAuthorizationDoc] = useState<any>({});
  const [disableEntityChange, setDisableEntityChange] = useState(false);
  
  const goBack = () =>{
    navigate(Dashboard)
  }
  const onFinish = () =>{
    updateLocalStorage();
    if(selected == "company"){
    navigate(KYBVerificatioStep2)
    }
    if(selected == 'individual') {
    navigate(KYCVerificatioStep2)
    }
  }

  const updateLocalStorage = () =>{
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!);
    localStroragevalue.entityType = selected;
    localStroragevalue.step = 2;
    setLocalStorage('auth',JSON.stringify(localStroragevalue));
  }
  
  useEffect(()=>{
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!);
    
    fetchKybDetails(userAlias)
      .then((res:any) => {
        if (res.data?.data?.[0]?.basic?.[0]) {
          // setAuthorizationDoc({ authorizationFile: res.data?.data?.[0]?.documents?.[0]?.authorizationDoc?.[0]?.fileName, authorizationFileUrl: res.data?.data?.[0]?.documents?.[0]?.authorizationDoc?.[0]?.url })
          setSelected(res.data?.data?.[0]?.basic?.[0]?.typeOfEntity?.toLowerCase())
        }
        else if (localStroragevalue?.entityType) {
          setSelected(localStroragevalue?.entityType?.toLowerCase())
        }

        const currentStep = localStroragevalue?.step || 1;
        const maxSteps = (localStroragevalue?.entityType?.toLowerCase() === "company") ? "7" : "5";          

        setDisableEntityChange(currentStep > maxSteps);
        setloading(false)
      })
      .catch(()=>{
        setloading(false)
      })
      window.scrollTo(0, 0);
  },[])

  return (
      
    <div className="main-body-wrappers">
      <UserHeader step={15} />
      {loading ? 
      <Loader /> :
    <div className="step1-wrapper">
      <div className="text-right formSubText p-4">
        Step 1/{selected == "company" ? 7 : 5}
      </div>
      <div className="welcome text-center">
        <b>KYC/KYB verification</b>
      </div>
      <div className="verification secondaryText text-center">
        Please select your entity type to proceed verification
      </div>
      {selected == "individual" ? (
        <div className={Width > 530 ? "d-flex center mt-5 gap-2" : "mt-5"}>
          <div className={Width < 530 ? "mb-5 center" : ""}>
            <div
              className="checkBoxUI selected cursor mx-4 text-center"
              onClick={() => {
                setSelected("individual");
              }}
              // style={{ pointerEvents: (!!authorizationDoc?.authorizationFile&& !!authorizationDoc?.authorizationFileUrl)  ? 'none' : 'auto'}}
              style={{ pointerEvents: disableEntityChange ? "none" : "auto" }}
            >
              <div className="checkTick">
                <Image src={Tick} alt="circle" preview={false} />
              </div>
              <div>
                <Image
                  src={Individual_select}
                  alt="individual"
                  preview={false}
                  className="my-5"
                />
                <div className="subText">Individual</div>
              </div>
            </div>
          </div>
          <div className={Width < 530 ? "mb-5 center step-selection-block-items" : ""}>
            <div
              className="checkBoxUI cursor mx-4  text-center"
              onClick={() => {
                setSelected("company");
              }}
              // style={{ pointerEvents: (!!authorizationDoc?.authorizationFile&& !!authorizationDoc?.authorizationFileUrl)  ? 'none' : 'auto' }}
              style={{ pointerEvents: disableEntityChange ? "none" : "auto" }}
            >
              <Image
                src={Company}
                alt="Company"
                preview={false}
                className="my-5"
              />
              <div className="subText">Company</div>
            </div>
          </div>
        </div>
      ) : selected == "company" ? (
        <div className={Width > 530 ? "d-flex center mt-5 gap-2" : "mt-5"}>
          <div className={Width < 530 ? "mb-5 center" : ""}>
            <div
              className="checkBoxUI  cursor mx-4 text-center"
              onClick={() => {
                setSelected("individual");
              }}
              // style={{ pointerEvents: (!!authorizationDoc?.authorizationFile&& !!authorizationDoc?.authorizationFileUrl)  ? 'none' : 'auto' }}
              style={{ pointerEvents: disableEntityChange ? "none" : "auto" }}
            >
              <Image
                src={Individual}
                alt="individual"
                preview={false}
                className="my-5"
              />
              <div className="subText">Individual</div>
            </div>
          </div>
          <div className={Width < 530 ? "mb-5 center step-selection-block-items" : ""}>
            <div
              className="checkBoxUI selected cursor mx-4  text-center"
              onClick={() => {
                setSelected("company");
              }}
              // style={{ pointerEvents: (!!authorizationDoc?.authorizationFile&& !!authorizationDoc?.authorizationFileUrl)  ? 'none' : 'auto' }}
              style={{ pointerEvents: disableEntityChange ? "none" : "auto" }}
            >
              {" "}
              <div className="checkTick">
                <Image src={Tick} alt="circle" preview={false} />
              </div>
              <div>
                <Image
                  src={Company_select}
                  alt="Company"
                  preview={false}
                  className="my-5"
                />
                <div className="subText">Company</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={Width > 530 ? "d-flex center mt-5 gap-2" : "mt-5"}>
          <div className={Width < 530 ? "mb-5 center" : ""}>
            <div
              className="checkBoxUI cursor mx-4 text-center"
              onClick={() => {
                setSelected("individual");
              }}
            >
              <Image
                src={Individual}
                alt="individual"
                preview={false}
                className="my-5"
              />
              <div className="subText">Individual</div>
            </div>
          </div>
          <div className={Width < 530 ? "mb-5 center" : ""}>
            <div
              className="checkBoxUI cursor mx-4  text-center"
              onClick={() => {
                setSelected("company");
              }}
            >
              <Image
                src={Company}
                alt="Company"
                preview={false}
                className="my-5"
              />
              <div className="subText">Company</div>
            </div>
          </div>
        </div>
      )}
      {selected != "" ? (
        <div className="text-center step-control-btn pb-4 md:pb-6">
          <Button
            className="rounded"
            onClick={() => {onFinish()}}
          >
            Save & Next
          </Button>
          <Button className="rounded_cancel mx-4" onClick={()=>{goBack()}} >Back</Button>

        </div>
      ) : (
        ""
      )}
    </div>}
    </div>
  );
};

export default VerificationStep1;
