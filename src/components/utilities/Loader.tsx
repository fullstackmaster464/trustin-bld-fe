import { Spin } from "antd";
// import { LoadingOutlined } from "@ant-design/icons";

// const antIcon = (
//   <LoadingOutlined style={{ fontSize: 50, color: "#013399" }} spin />
// );

const Loader = () => {
  return (
    <div className="outer">
      <div className="middle">
        <div className="inner">
          <div className="d-flex align-items-center justify-content-center">
            <div className="mx-auto">
              <Spin size="large" className="mainloader"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
