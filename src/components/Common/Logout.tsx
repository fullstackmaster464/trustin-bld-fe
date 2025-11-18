import { Button, Image, Modal } from "antd";
import LogoutIcon from "../../assets/img/logoutIcon.svg";
import { useEffect } from "react";

const Logout = (props: any) => {
  const { logoutModal, setLogoutModal, setpageValue } = props;

  const handleModalCancel = () => {
    setLogoutModal(false);
    setpageValue('')
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  useEffect(() => {
    setpageValue("logout");
  });
  return (
    <Modal
      open={logoutModal}
      footer={false}
      className="modal-box"
      centered
      width={450}
      closable={false}
    >
      <div className="text-center p-4">
        <Image src={LogoutIcon} alt="logout" preview={false} className="mb-4 signout-image" />
        <div className="welcome fw-700">
          Are you sure <br />
          you want to logout?
        </div>
        <div className="">
          <Button
            key="submit"
            type="primary"
            style={{width:'140px'}}
            htmlType="submit"
            className="modal-button-cancel mt-lg-5 mt-4"
            onClick={() => {
              logout();
            }}
          >
            Yes
          </Button>
          <Button
            key="submit"
            type="primary"
            className="modal-button mt-lg-5 mx-2 mt-3"
            onClick={() => {
              handleModalCancel();
            }}
          >
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default Logout;
