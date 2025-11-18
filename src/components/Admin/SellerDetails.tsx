import EscrowTransationHistorySteps from "./EscrowTransactionHistorySteps";
import {
  Breadcrumb,
  Card,
  Col,
  Image,
  Row,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Dashboard, EscrowAccountsList } from "../Common/RouteConst";
import LeftArrow from "../../assets/img/leftArrow.svg";
import MoveTo from "../../assets/img/moveTo.svg";
import WhiteUserFull from "../../assets/img/WhiteUserFull.svg";
import Email from "../../assets/img/white_email.svg";
import Globe from "../../assets/img/white_globe.svg";
import Payment from "../../assets/img/white_payment.svg";
import User from "../../assets/img/userHalf.svg";
import Job from "../../assets/img/job_white.svg";
import Calendar from "../../assets/img/Calendar.svg";
import ClockLight from "../../assets/img/clock_light.svg";
import BlueEye from "../../assets/img/blueEye.svg";
import Doc from "../../assets/img/grayDoc.svg";
import Id from "../../assets/img/id.svg";
import Suitcase from "../../assets/img/sellerJob.svg";
import DefaultLayout from "../Common/DefaultLayout";

const EscrowTransactionDetails = ():any => {
  const navigate = useNavigate();
  const description = (
    <div className="mt-1">
      <div className="d-flex">
        <Image src={User} alt="user" preview={false} className="px-1" />
        <div className="stepDetails_sub px-2">Kamal Sinha</div>
      </div>
      <div className="d-flex mt-2">
        <div className="d-flex">
          <Image
            src={Calendar}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className="stepDetails_sub mb-2 mx-1">28-Aug-2023</div>
        </div>
        <div className="d-flex mx-3">
          <Image
            src={ClockLight}
            alt="company"
            preview={false}
            className="px-1 min-width-25"
          />
          <div className="stepDetails_sub mb-2">10:15 AM</div>
        </div>
      </div>
    </div>
  );

  const goBack = () => {
    navigate(EscrowAccountsList);
  };
  return (
    <div className="scrollbar-container">
        <DefaultLayout
        page="escrow"
        loading={false}
        TitleText="Agreement Details"
        TitleImage={LeftArrow}
        backtoDashboard={true}
        headerPage={
          <div className="d-flex">
                  <Image
                    src={LeftArrow}
                    preview={false}
                    onClick={() => {
                      goBack();
                    }}
                    className="mt-2 cursor"
                  />
                  <div className="ml-5">
                    <b> Agreement Details</b>
                    <Breadcrumb separator=">">
                      <Breadcrumb.Item
                        onClick={() => {
                          navigate(Dashboard);
                        }}
                        className="cursor"
                      >
                        Dashboard
                      </Breadcrumb.Item>
                      <Breadcrumb.Item
                        className="cursor"
                        onClick={() => {
                          navigate(EscrowAccountsList);
                        }}
                      >
                        Escrow Transactions
                      </Breadcrumb.Item>
                      <Breadcrumb.Item className="cursor">
                        Escrow Transaction Detail
                      </Breadcrumb.Item>
                    </Breadcrumb>
                  </div>
                </div>
              }
      >
            <Row className="endtoend">
              <Col span={16}>
                <div className="bg-admin-card ">
                  <div className="endtoend px-5 pt-4 ">
                    <div className="title_white ">TRUST-1872</div>
                    <div className="d-flex">
                      <Image src={Job} alt="box" preview={false} />
                      <div className="whiteTitle18 px-3">29-Sep-2027</div>
                    </div>
                  </div>
                  <hr className=" w-100 opacity-50 mt-4" />
                  <Col span={20}>
                    <div className="px-5 endtoend py-4">
                      <div className="">
                        <div className="buyerBox">From Buyer</div>
                        <div className="d-flex my-3">
                          <Image
                            src={WhiteUserFull}
                            alt="box"
                            preview={false}
                          />
                          <div className="whiteTitle18 px-3">kamal Sinha</div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Email} alt="box" preview={false} />
                          <div className="whiteTitle18 px-3">
                            seller123@yopmail.com
                          </div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Globe} alt="box" preview={false} />
                          <div className="whiteTitle18 px-3">India</div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Payment} alt="box" preview={false} />
                          <div className="whiteTitle18 bold px-3">
                            AED 4,000
                          </div>
                        </div>
                      </div>
                      <div className="ml--10">
                        <Image src={MoveTo} alt="move" preview={false} />
                      </div>
                      <div className="">
                        <div className="buyerBox">To Seller</div>
                        <div className="d-flex my-3">
                          <Image
                            src={WhiteUserFull}
                            alt="box"
                            preview={false}
                          />
                          <div className="whiteTitle18 px-3">Javed habib</div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Email} alt="box" preview={false} />
                          <div className="whiteTitle18 px-3">
                            Habibj@yopmail.com
                          </div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Globe} alt="box" preview={false} />
                          <div className="whiteTitle18 px-3">UAE</div>
                        </div>
                        <div className="d-flex my-3">
                          <Image src={Payment} alt="box" preview={false} />
                          <div className="whiteTitle18 bold px-3">
                            AED 4,000
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </div>
                <div className="mt-4">
                  <Card className="px-4">
                    <div className="stepDetails mb-4 mt-3">
                      Category Details
                    </div>
                    <Row>
                      <Col span={12}>
                        <div className="d-flex">
                          <Image src={Suitcase} alt="user" preview={false} />
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Item Categories
                            </div>
                            <div className="stepDetails_medium fw-400">
                              Automobile
                            </div>
                          </div>
                        </div>
                        <div className="d-flex mt-4">
                          <Image src={Suitcase} alt="user" preview={false} />
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Item Type
                            </div>
                            <div className="stepDetails_medium fw-400">Car</div>
                          </div>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="d-flex">
                          <Image src={Doc} alt="user" preview={false} />
                          <div className="mx-3">
                            <div className="stepDetails_medium_sub">
                              Product Description
                            </div>
                            <div className="stepDetails_medium fw-400">
                              Automobile
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <hr className="lightgrayHr" />
                    <div className="stepDetails mb-4 mt-3">Payment Details</div>
                    <Card className="grayCard p-3">
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Agreement Amount
                        </div>
                        <div className="subText_small fw-400 text-right">
                          AED 4,000
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Total TrustIn Fees (1%) + 5% VAT
                        </div>
                        <div className="subText_small fw-400 text-right">
                          AED 40 + AED 2
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Transaction fees to be paid by buyer
                        </div>
                        <div className="subText_small fw-400 text-right">
                          AED 42
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Transaction fees to be paid by seller
                        </div>
                        <div className="subText_small fw-400 text-right">
                          AED 0
                        </div>
                      </div>
                      <div className="endtoend py-2">
                        <div className="stepDetails_medium_sub">
                          Total Agreement Amount
                        </div>
                        <div className="subText_small fw-400 text-right">
                          AED 4,042
                        </div>
                      </div>
                      <hr className="lightgrayHr" />
                      <div className="endtoend py-2">
                        <b className="subText_small">
                        Amount to be transferred to Escrow Account
                        </b>
                        <b className="subText_small text-right">
                        AED 4,042
                        </b>
                      </div>
                    </Card>
                    <div className="stepDetails mb-4 mt-3">Payment Release Condition</div>
                    <div className="d-flex">
                      <Image src={Id} alt="id" preview={false} />
                      <div className="subText_small fw-400 text-right mx-3">
                          Any Id Proof
                        </div>
                      <Image src={BlueEye} alt="id" preview={false} />

                    </div>
                  </Card>
                </div>
              </Col>
              <Col span={7}>
                <Card className="px-2 detailsCard h-auto">
                  <div className="stepDetails mb-4 mt-2 mx-2">Stages</div>
                  <EscrowTransationHistorySteps
                    currentStep={1}
                    description={description}
                  />
                </Card>
              </Col>
            </Row>
            </DefaultLayout>
          </div>
  );
};

export default EscrowTransactionDetails;
