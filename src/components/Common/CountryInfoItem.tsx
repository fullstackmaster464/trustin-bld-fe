import React, { useEffect, useState } from "react";
import { Tooltip, Image } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { findCountryName } from "./Constants";

interface CountryInfoItemProps {
  icon: string; // image src
  tooltipLabel: string; // tooltip title text (e.g., "Residance country" or "Nationality")
  countryName: string; // code or name (e.g., "IN", "India")
  countryList?: any[];
}

const CountryInfoItem: React.FC<CountryInfoItemProps> = ({
  icon,
  tooltipLabel,
  countryName,
  countryList=[],
}) => {
  const displayValue = countryList?.length > 0 ? findCountryName(countryList, countryName) : countryName ?? "-";
  // const showTooltip = displayValue && displayValue?.length * 7 > 136;

  const [Width, setWidth] = useState(0);

  
    useEffect(() => {
     const handleResize = () => {
    setWidth(document.body.clientWidth);
      };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);
  
  return (
    <>
      <div className="d-flex flex-column flex-sm-row mx-3 pt-1 flex-wrap gap-1 mt-1">
          <div className="d-flex align-items-start me-sm-4 mb-1 mb-sm-0 gap-2">
             <Image src={icon} alt="icon" preview={false} />
                <Tooltip title={displayValue || "-"}
                      placement="top"
                      overlayClassName="leads-custom-tooltip"
                      arrow={false}
                      >
                  <span  className={Width > 640 ? "whiteTitle18 ps-2" : "whiteTitle18 ps-2 noWrap country-overflowtext"}
                    >{displayValue || "-"}</span>
                </Tooltip>
                  <Tooltip
                     title={tooltipLabel}
                     arrow={false}
                         overlayClassName="custom-tooltip signupTooltip"
                      >
                    <span className="nationality_info p-0">
                       <InfoCircleOutlined />
                      </span>
                  </Tooltip>
               </div> 
             </div>
     </>
  );
};

export default CountryInfoItem;
