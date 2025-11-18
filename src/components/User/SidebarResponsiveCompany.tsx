import { Image } from "antd";
import BlueTick from "../../assets/img/blue_tick.svg";
const ResponsiveSidebar = (props: any) => {
  const { step } = props;
  return (
    <div className="bg-tab-res step-items-header">
      <div className="py-4 d-flex step-items-link">
        <div
          className={
            step > 2 ? "tabButton mx-4-res mt--38" : "tabButton mx-4-res"
          }
        >
          {step > 2 ? (
            <div className="center py-2">
              <Image
                src={BlueTick}
                alt="tick"
                preview={false}
                className="hw-20"
              />
            </div>
          ) : (
            ""
          )}
          <div className="step1 activeBtn overflowVerText_twoLines center">
            <span> Basic information </span>
          </div>
        </div>
        <div
          className={
            step > 3 ? "tabButton mx-4-res mt--38" : "tabButton mx-4-res"
          }
        >
          {step > 3 ? (
            <div className="center py-2">
              <Image
                src={BlueTick}
                alt="tick"
                preview={false}
                className="hw-20"
              />
            </div>
          ) : (
            ""
          )}
          <div
            className={
              step >= 3
                ? "step1 activeBtn overflowVerText_twoLines center"
                : "step1 inactiveBtn overflowVerText_twoLines center"
            }
          >
            <span> Representative & owners </span>
          </div>
        </div>
        <div
          className={
            step > 4 ? "tabButton mx-4-res mt--38" : "tabButton mx-4-res"
          }
        >
          {step > 4 ? (
            <div className="center py-2">
              <Image
                src={BlueTick}
                alt="tick"
                preview={false}
                className="hw-20"
              />
            </div>
          ) : (
            ""
          )}
          <div
            className={
              step >= 4
                ? "step1 activeBtn overflowVerText_twoLines center"
                : "step1 inactiveBtn overflowVerText_twoLines center"
            }
          >
            <span>Beneficial owners</span>
          </div>
        </div>
        <div
          className={
            step > 5 ? "tabButton mx-4-res mt--38" : "tabButton mx-4-res"
          }
        >
          {step > 5 ? (
            <div className="center py-2">
              <Image
                src={BlueTick}
                alt="tick"
                preview={false}
                className="hw-20"
              />
            </div>
          ) : (
            ""
          )}
          <div
            className={
              step >= 5
                ? "step1 activeBtn overflowVerText_twoLines center"
                : "step1 inactiveBtn overflowVerText_twoLines center"
            }
          >
            <span> Business details </span>
          </div>
        </div>
        <div
          className={
            step > 5 ? "tabButton mx-4-res mt--38" : "tabButton mx-4-res"
          }
        >
          {step > 6 ? (
            <div className="center py-2">
              <Image
                src={BlueTick}
                alt="tick"
                preview={false}
                className="hw-20"
              />
            </div>
          ) : (
            ""
          )}{" "}
          <div
            className={
              step >= 6
                ? "step1 activeBtn overflowVerText_twoLines center"
                : "step1 inactiveBtn overflowVerText_twoLines center"
            }
          >
            <span> Required documents </span>
          </div>
        </div>
        <div
          className={
            step > 7 ? "tabButton mx-4-res mt--38" : "tabButton mx-4-res"
          }
        >
          {step > 7 ? (
            <div className="center py-2">
              <Image
                src={BlueTick}
                alt="tick"
                preview={false}
                className="hw-20"
              />
            </div>
          ) : (
            ""
          )}
          <div
            className={
              step >= 7
                ? "step1 activeBtn overflowVerText_twoLines center"
                : "step1 inactiveBtn overflowVerText_twoLines center"
            }
          >
            <span>FATCA Self-Certification</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveSidebar;
