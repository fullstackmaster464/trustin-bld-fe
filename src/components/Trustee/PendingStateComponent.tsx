import { Button, Popover, Image } from "antd";
import { getLocalStorage } from '../Common/Constants';
import BlueEye from '../../assets/img/blueEye.svg'
import { useEffect, useRef, useState } from "react";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import Doc from "../../assets/img/documentdark.svg";
import Download from "../../assets/img/download.svg";
import { useLocation } from "react-router-dom";

const PendingStateComponent = (props: object|any):any => {
    const { val, handleVerify, data2, loading,setLoading, setButtonRequired } = props
    const userType = JSON.parse(getLocalStorage("auth")!)
    const [Width, setWidth] = useState(window?.screen?.width);
    const setWidthVal = () => {
      setWidth(document.body.clientWidth);
    };

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const location = useLocation();
    const triggerevent =location.state?.triggerButton

    useEffect(() => {
        // Check if the trigger condition is passed via state
        if (triggerevent) {
            setTimeout(() => {
            if (buttonRef.current ) {
                const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                buttonRef.current.dispatchEvent(event);
            }
        }, 1000);
        }
        else {
            console.warn('buttonRef is null');
        }
    }, [triggerevent]);
        
    const downloadFile = (url: string) => {
        try {
            if (!url || typeof url !== "string") {
                throw new Error("Invalid URL provided.");
            }
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "template.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to download file:', error);
            alert("Failed to download the file. Please try again.");
        }
    };    
    useEffect(() => {
      window.addEventListener("resize", () => {
        setWidthVal();
      });
      return () => window.removeEventListener("resize", setWidthVal);
    }, [])
    let pendingComponent = null;
    if (!val.verified) {
        // If status is not verified, Trustee will handle Verify
        pendingComponent = <>
            <div className='d-flex w-100 justify-content-end'>
            <Button
                onClick={() => {handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name);setLoading(false)}}
                className="mb-2 blue-status modal-button"
                loading={loading}
            >Verify
            </ Button>
            </div>
        </>
    } else if (val.verified === 'VERIFIED') {
        // If Buyer/seller has verified any of milestones. trustee can verify again
        if (val.verifyRole === 'USER') {
            pendingComponent = <>
                <div className={Width > 425 ? 'd-flex w-100 justify-content-between flex-wrap gap-3' : 'd-flex w-100 justify-content-between flex-column flex-wrap gap-3'}>
                    <div className='d-flex align-items-center gap-2'><Popover content={<>Click this icon to <br /> preview attached file</>} placement="bottomLeft">
                        <span className="preview-file pt-1" onClick={() => { handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name); setButtonRequired('d-none') }}>
                            <Image src={BlueEye} alt="id" className="d-flex" preview={false} height={16} width= {22}/></span>
                    </Popover>
                    <Popover
                        content={
                            <>
                            Click this icon to <br />
                            download attached file
                            </>
                        }
                        placement="bottomLeft"
                    >
                        <span
                            className="preview-file cursor"
                            onClick={() => {
                            downloadFile(val.url);
                            setButtonRequired("d-none");
                            }}
                        >
                            <Image className="d-flex" src={Download} height={16} width={22} preview={false} />
                        </span>
                    </Popover>
                    <span className='ms-1 green-status'> Verified by buyer</span></div>
                    <div>
                        <Button ref={buttonRef} onClick={() => {handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name)}} className="modal-button">Verify</ Button>
                    </div>
                </div>
            </>
        } else {
            pendingComponent = <>
                <div className={`d-flex gap-2 w-100 align-items-center justify-content-end res-view-button ${
                    Width > 1200 ? "" : ""
                }`}>
                    <Popover
                    content={<>Click this icon to <br />preview attached file</>}
                    placement="bottomLeft"
                    overlayStyle={{ zIndex: 999 }} 
                    >
                    <span
                        className="pt-1"
                        onClick={() => {
                        handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name);
                        setButtonRequired("d-none");
                        }}
                    >
                        <Image
                        src={BlueEye}
                        alt="id"
                        className="d-flex"
                        preview={false}
                        height={16}
                        width={22}
                        style={{ cursor: "pointer" }}
                        />
                    </span>
                    </Popover>
                    <Popover
                        content={
                            <>
                            Click this icon to <br />
                            download attached file
                            </>
                        }
                        placement="bottomLeft"
                    >
                        <span
                            className="preview-file cursor"
                            onClick={() => {
                            downloadFile(val.url);
                            setButtonRequired("d-none");
                            }}
                        >
                            <Image className="d-flex mx-1" src={Download} height={16} width={22} preview={false} />
                        </span>
                    </Popover>
                    <span className="green-status ps-2">Verified</span>
                </div>
            </>
        }
    } else if (val.verified === 'REJECTED') {
        // If Buyer/seller has rejected any of milestones. trustee can verify again
        if (val.verifyRole === 'USER') {
            pendingComponent = <>
                <Popover content="Click to download attachement" placement="bottomLeft">
                    <span >
                        <img
                            src={Doc}
                            alt="view"
                            className="cursor px-3"
                        />
                    </span>
                </Popover>
                {userType === "TRUSTEE" && <span className='red-status'>rejected by buyer</span>}
                <div className='d-flex w-100 justify-content-end'>
                    <SecondaryOutLineButton
                    onClick={() => handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name)}
                    className="mb-2"> Re-verify
                    </SecondaryOutLineButton>
                </div>
            </>
        } else {
            pendingComponent = <>
            <div className={Width > 1200 ? "d-flex w-100 align-items-center" :"d-flex mt-3"}>
                <Popover content={<>Click this icon to <br />preview attached file</>} placement="bottomLeft">
                    <span className="preview-file pt-1" onClick={() => { handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name); setButtonRequired('d-none') }}>
                        <Image src={BlueEye} alt="id" className="d-flex" preview={false} height={16} width= {22}/>
                    </span>
                </Popover>
                <span className="red-status ms-2">Rejected</span>
            </div>
            </>
        }
    }
    return pendingComponent;
}

export default PendingStateComponent;