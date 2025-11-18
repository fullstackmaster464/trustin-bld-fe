import { Image } from "antd";
import SidebarImg from "../../../assets/img/sidebarimg.svg";
import SidebarImgOTP from "../../../assets/img/otpsidebar.svg";
import SidebarImgForgot from '../../../assets/img/forgot.svg'
import UserUerify from '../../../assets/img/userUerify.svg'
const LeftSideStructure = (props:any) => {
  const { page,width } = props;
  return (
      <div className={width > 991 ? "container vertical-center-relative" : "mx-4"}>
        <div className={width > 991 ? "centered" :""}>
          <div
            className={width > 991 ? "justify-content-center px-5 mt-5" : "justify-content-start mb-auto-width mt-5"}
            style={width > 991 ? { marginLeft: "100px" } : {}}
          >
            {/* <b><div className="sidebarNumber">#1</div></b> */}
            {page == "userVerify" ? (<>
              <b><div className="sidebarText">Digital Escrow <br />
              Platform</div></b>
            </>):(
              <>
                <div className="mb-5">
                <h1 className="sidebarText">UAE & Middle East's First Regulated Trust as a Service Digital Escrow Platform</h1>
                </div>
               </>
            )}
           
            {/* <b><div className="sidebarText">Platform</div></b> */}
            {width > 991 ? <div className="side-div-image">
            {page == "otp" ? (
              <Image
                preview={false}
                src={SidebarImgOTP}
                height={348}
                width={427}
                className="landing1"
              />
            ) : page == "forgot" ?  (
              <Image
                preview={false}
                src={SidebarImgForgot}
                height={348}
                width={427}
                className="landing1 pt-5 ml--100"
              />
            ): page == "userVerify" ?  (
              <Image
                preview={false}
                src={UserUerify}
                height={462}
                width={462}
                className="landing1 pt-5"
              />
            ): (
              <Image
                preview={false}
                src={SidebarImg}
                height={348}
                width={427}
                className="landing1"
              />
            )}
            </div> : ""}
            {width > 991 ? <p className="copyright my-5">
              {`©${new Date().getFullYear()} TrustIn`}
            </p> : ""}
          </div>
        </div>
      </div>
  );
};

export default LeftSideStructure;
