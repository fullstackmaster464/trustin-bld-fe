import { Breadcrumb, Image, Tabs, Input } from "antd";
import { useState } from "react";
import "../../assets/scss/custom.scss";
import "../../assets/scss/custom.scss";
import TabPane from "antd/lib/tabs/TabPane";
import EscrowTransactionIcon from "../../assets/img/Headers/Escrow_transactions.svg";
import DefaultLayout from "../Common/DefaultLayout";
import { useLocation } from "react-router-dom";
import OngoingTransaction from "./OnGoingTransaction";
import ApprovedTransaction from "./ApprovedTransaction";
import PendingTransaction from "./PendingTransaction";
import DisputedTransaction from "./DisputedTransactions";
import Search from "../../assets/img/search.svg";
import ArchivedTransaction from "./ArchivedTransaction";
import AllTransaction from "./AllTransaction";
import RejectedTransaction from "./RejectedTransaction";
import ExpiredTransaction from "./ExpiredTransaction";

const EscrowTransactionList = ():any => {
    const location = useLocation();
  const [tab, setTab] = useState(location?.state?.tab ? location?.state?.tab : "All" );
  const [searchedKey, setSearchedKey] = useState("");
  const onTabchange = (tabValue: string) => {
    setTab(tabValue);
  };

  return (
    <div className="fullHeight scrollbar-container">
      <DefaultLayout
        page="transaction"
        TitleText="Escrow transaction"
        TitleImage={EscrowTransactionIcon}
        loading=""
        headerPage={
          <div className="d-flex">
            <Image
              src={EscrowTransactionIcon}
              preview={false}
              className="mt-2"
              alt="escrowimage"
            />
            <div className="ml-5">
              <b> Escrow transaction</b>
              <Breadcrumb separator=">">
                {/* <Breadcrumb.Item
                  onClick={() => {
                    navigate(Dashboard);
                  }}
                >
                  Dashboard
                </Breadcrumb.Item> */}
                <Breadcrumb.Item className="breadcrumb-title-text">Escrow transaction</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        }
      >
          <div className="dashboardTabs pt-15">
          <div className="escrow-tabs-container">
              <div
                className="tabs-container mt-3">
                <Tabs
                  defaultActiveKey={tab}
                  className="tableTab"
                  onChange={onTabchange}
                >
                  <TabPane tab={`All`} key="All"></TabPane>
                  <TabPane tab={`Pending`} key="Pending"></TabPane>
                  <TabPane tab={`Ongoing`} key="Ongoing"></TabPane>
                  <TabPane tab={`Approved`} key="Approved"></TabPane>
                  <TabPane tab={`Rejected`} key="Rejected"></TabPane>
                  <TabPane tab={`Disputed`} key="Disputed"></TabPane>
                  <TabPane tab={`Expired`} key="Expired"></TabPane>
                  <TabPane tab={`Archived`} key="Archived"></TabPane>
                </Tabs>
              </div>
              <div className="search-container">
                <Input
                  className="search-input-additem"
                  placeholder="Search"
                  aria-label="Search transactions"
                  prefix={<Image src={Search} alt="search" preview={false} />}
                  onInput={(e: any) => {
                    setSearchedKey(e.target.value);
                    // onSearch(e.target.value, 1, page);
                  }}
                />
              </div>
          </div>

          <div>
            {tab === 'All' && <AllTransaction searchedKey={searchedKey} setSearchedKey={setSearchedKey}/>}
            {tab === 'Pending' && <PendingTransaction searchedKey={searchedKey} setSearchedKey={setSearchedKey}/>}
            {tab === 'Rejected' && <RejectedTransaction searchedKey={searchedKey} setSearchedKey={setSearchedKey}/>}
            {/* {tab === 'Pending' && <PendingTransaction/>} */}
            {tab === 'Ongoing' && <OngoingTransaction searchedKey={searchedKey} setSearchedKey={setSearchedKey}/>}
            {tab === 'Approved' && <ApprovedTransaction  searchedKey={searchedKey} setSearchedKey={setSearchedKey}/>}
            {tab === 'Disputed' && <DisputedTransaction searchedKey={searchedKey} setSearchedKey={setSearchedKey}/>}
            {tab === 'Expired' && <ExpiredTransaction searchedKey={searchedKey} setSearchedKey={setSearchedKey}/>}
            {tab === 'Archived' && <ArchivedTransaction searchedKey={searchedKey} setSearchedKey={setSearchedKey}/>}
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
};

export default EscrowTransactionList;
