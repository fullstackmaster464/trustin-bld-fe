import { Button, Popover, Image } from "antd";
import { getLocalStorage } from '../Common/Constants';
import BlueEye from '../../assets/img/blueEye.svg'
import { useEffect, useState } from "react";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import Doc from "../../assets/img/documentdark.svg";
import Download from "../../assets/img/download.svg";

const PendingStateComponent = (props: any):any => {
    const { val, handleVerify, data2, loading,setLoading, setButtonRequired } = props
    const userType = JSON.parse(getLocalStorage("auth")!)
    const [Width, setWidth] = useState(window?.screen?.width);
    const setWidthVal = () => {
      setWidth(document.body.clientWidth);
    };
    const downloadFile = (url: any) => {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "template.xlsx");
        document.body.appendChild(link);
        link.click();
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
        if (val.verifyRole === 'TRUSTEE') {
            pendingComponent = <>
                <div className='d-flex w-100 justify-content-between verify-responsive-text gap-2'>
                    <div className='d-flex align-items-center  responsive-margin-top gap-2'>
                        <Popover content={<>Click this icon to <br/> preview attached file</>} placement="bottomLeft">
                            <span className="preview-file pt-1 m-0" onClick={() => { handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name); setButtonRequired('d-none') }}>
                                <Image src={BlueEye} alt="id" className="d-flex" preview={false} height={16} width= {22}/>
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
                                <Image className="d-flex" src={Download} height={16} width={22} preview={false} />
                            </span>
                        </Popover>
                    <span className='green-status'> Verified by approver</span>
                    </div>
                    <div>
                        <Button onClick={() => {handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name)}} className="modal-button responsive-margin-top">Verify</ Button>
                    </div>
                </div>
            </>
        } else {
            pendingComponent = <>
                <div className={Width > 1200 ? "d-flex justify-content-start align-items-start" :"d-flex verified-text"}>
                   <div className="d-flex justify-content-start align-items-start">
                   <Popover content={<>Click this icon to <br />preview attached file</>} placement="bottomLeft" className="d-flex">
                        <span className="pt-1" onClick={() => { handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name); setButtonRequired('d-none') }}> 
                            <Image src={BlueEye} alt="id" className="d-flex" preview={false} height={16} width= {22}/>
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
                            <Image className="d-flex mt-1 mx-1" src={Download} height={16} width={22} preview={false} />
                        </span>
                    </Popover>
                    <span className="green-status ml-4">{val.verifyRole === "USER" ? 'Verified by buyer' : 'Verified'}</span>

                   </div>
                                   </div>
            </>
        }
    } else if (val.verified === 'REJECTED') {
        // If Buyer/seller has rejected any of milestones. trustee can verify again
        if (val.verifyRole === 'TRUSTEE') {
            pendingComponent = <>
                <Popover content="Click to download attachement" placement="bottomLeft">
                    <span >
                        <img
                            src={Doc}
                            alt="view"
                            className="cursor px-3"
                            onClick={() => {
                                downloadFile(val.url);
                              }}
                        />
                    </span>
                </Popover>
                {['AUTHORIZER','SENIOR_MANAGEMENT'].includes(userType) && <span className='red-status'>rejected by approver</span>}
                <div className='d-flex w-100 justify-content-end'>
                    <SecondaryOutLineButton
                    onClick={() => handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name)}
                    className="mb-2"> Re-verify
                    </SecondaryOutLineButton>
                </div>
            </>
        } else {
            pendingComponent = <>
            <div className={Width > 1200 ? "d-flex w-100 align-items-center" :"d-flex"}>
                <Popover content={<>Click this icon to <br />preview attached file</>} placement="bottom">
                    <span className="preview-file pt-1" onClick={() => { handleVerify(data2.aliasName, val.url, val.key, val.id, data2.name); setButtonRequired('d-none') }}>
                        <Image src={BlueEye} alt="id" className="d-flex" preview={false} height={16} width= {22}/>
                    </span>
                </Popover>
                <span className="red-status ms-2">{val.verifyRole === "USER" ? 'Rejected by buyer' : 'Rejected'}</span></div>
            </>
        }
    }
    return pendingComponent;
}

export default PendingStateComponent;