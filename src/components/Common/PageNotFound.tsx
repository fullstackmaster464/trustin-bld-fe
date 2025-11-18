import { Image } from "antd";
import pageNotFound from "../../assets/img/pageNotFound.svg";
import { useNavigate } from "react-router-dom";
import { MainButtonRound } from "../ui-elements/ButtonRepo";
import { Dashboard, Login } from "./RouteConst";
import { getLocalStorage } from "./Constants";
import Logo from "../../assets/img/Logo.svg";

const PageNotFound = ():any => {
  const TOKEN = JSON.parse(getLocalStorage("auth")!)?.token;
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <div className="welcome text-center welcome_res mt-5">
        </div>
        <div className="mx-5">
          <div className="center my-4">
            <Image src={Logo} alt="page-not-found" preview={false} />
          </div>
          <div className="center">
            <Image src={pageNotFound} alt="page-not-found" preview={false} />
          </div>
          <div className="center">
            <div className="grayText text-dark text-center thank w-40 mb-5">
              Page not found. Please check the URL or contact support for help.
            </div>
          </div>
          <div className="d-flex justify-content-center mb-5">
            <MainButtonRound
              children={TOKEN ? "Take me to homepage" : "Take me to login"}
              className="w-auto"
              onClick={() => {
                {
                  TOKEN ? (navigate(Dashboard))
                    : (navigate(Login))
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
