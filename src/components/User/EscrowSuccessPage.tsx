import { Breadcrumb, Button, Card, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Create from "../../assets/img/createEscrow.svg";
import { Dashboard } from "../Common/RouteConst";
import SuccessTxn from "../../assets/img/TransactionSuccess.svg";
import { SecondaryOutLineButton } from "../ui-elements/ButtonRepo";
import copy from "clipboard-copy";
import DefaultLayout from "../Common/DefaultLayout";
import { toTitleCase } from "../Common/Constants";

const EscrowSuccess = () => {
  const [Width, setWidth] = useState(document?.body?.clientWidth);
  // let local = getLocalStorage("auth");
  // const userAlias = local ? JSON.parse(local)?.userAlias : "";
  // const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [pageloading, setPageLoading] = useState(true);
  const params = useLocation();
  
  const url = params?.state?.url;
  const from = params?.state?.from;
  const to = params?.state?.to;
  
  
  // const contractId = params?.state?.contractId;
  const handleCopy = () => {
    copy(url);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 5000);
  };
  useEffect(()=>{
    setTimeout(() => {
      setPageLoading(false)
    }, 1000);
  })

  const setWidthVal = () =>{
    setWidth(document.body.clientWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', ()=>{
      setWidthVal()
    });
    return () => window.removeEventListener('resize', setWidthVal);
  }, []);

  return (
    <div className="fullHeight scrollbar-container">
       <DefaultLayout
        page="create"
        TitleText="Escrow Transactions"
        TitleImage={Create}
        loading={pageloading}
        headerPage={
          <div className="d-flex">
                  <Image
                    src={Create}
                    preview={false}
                    className="mt-2"
                    alt="escrowimage"
                  />
                  <div className="ml-5">
                   <b> Escrow Transactions</b> 
                    <Breadcrumb separator=">">
                      <Breadcrumb.Item
                        onClick={() => {
                          navigate(Dashboard);
                        }}
                        className="cursor"
                      >
                        Dashboard
                      </Breadcrumb.Item>
                      <Breadcrumb.Item>Escrow Transactions</Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                </div>
              }
      >
            <Card className="noBorder mt-6 p-4 mb-3 status text-center">
              <Image src={SuccessTxn} preview={false} className="mt-5" />

              <div className="titleText mb-4 mt-5">
                {toTitleCase(from)} - {toTitleCase(to)}  Escrow Transaction
              </div>
              <div className="stepDetails_large fw-400 mx-15">
                Your initiated escrow transaction has been shared with your
                vendor through email. You can also copy paste this URL as per
                link below to share the transaction link directly.
              </div>
              {!isCopied ? (
                <Button className="rounded px-4 w-auto cursor" onClick={handleCopy}>
                  Copy Link
                </Button>
              ) : (
                <Button className="rounded px-4 w-auto">
                  Copied!
                </Button>
              )}
              <SecondaryOutLineButton
                children="Back to Home"
                className={Width > 500 ? "w-auto mx-4" : "w-auto mx-4 mt-3"}
                onClick={() => {
                  navigate(Dashboard);
                }}
              />
            </Card>
            </DefaultLayout>
    </div>
  );
};

export default EscrowSuccess;
