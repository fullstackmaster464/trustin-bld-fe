import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image } from "antd";
import Logo from "../../assets/img/Logo.svg";
import Sessionexpired from "../../assets/img/Session Expired.svg";
const SessionExpired = () => {
  const [Width, setWidth] = useState<number>(document?.body?.clientWidth);
  const navigate = useNavigate();
  window.onresize = () => {
    setWidth(document.body.clientWidth);
  };
  return (
    <div className='container vertical-center'>
        <div
            className={Width > 500 ?  "d-flex justify-content-center px-5": "d-flex justify-content-center px-3"}
            style={{ textAlign: "center",alignItems:"center",height:"100%",flexDirection:"column" }}
        >
            <Image preview={false} src={Logo} className="sessionlogo" />
            <Image preview={false} src={Sessionexpired}  className="mt-5"/>
            <h3 className={Width > 767 ? "session-expired-text mt-5" :"session-small-text mt-4"}>Your session is expired</h3>
            <Button
              key="submit"
              type="primary"
              className={Width > 767 ? "session-expired-button mt-4 mx-2" :"session-small-button mt-4 mx-2"}
              onClick={()=>{navigate("/login")}}
            >
              Login
            </Button>
        </div>
    </div>
  )
}

export default SessionExpired
