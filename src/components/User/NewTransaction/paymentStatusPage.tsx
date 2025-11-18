import { useLocation, useNavigate } from 'react-router-dom';
// import { SecondaryOutLineButton } from '../../ui-elements/ButtonRepo';
// import { Dashboard } from '../../Common/RouteConst';
import { useEffect } from 'react';
import { Spin } from 'antd';

const PaymentStatusPage = () => {
    let navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const responseStatus = queryParams.get('status');
    const responseMessage = queryParams.get('message');
    const txnRefNumber = queryParams.get('refNo');

    useEffect(() => {
        let beforeReturnUrlPath = localStorage.getItem('beforeReturnUrlPath') || '/';
        console.log("beforeReturnUrlPath:----",beforeReturnUrlPath);
        let contractid = beforeReturnUrlPath.split('/')[2]
        console.log("contractid:----",contractid);
        
        localStorage.removeItem('beforeReturnUrlPath');
        if(queryParams.size > 1 ) {
            navigate(beforeReturnUrlPath, { replace: true, state: { responseStatus, responseMessage, txnRefNumber, contractid } });
        } else {
            navigate(beforeReturnUrlPath, { replace: true, state: {responseStatus, contractid}})
        }
    }, [navigate]);

    return (
        <Spin className="mainloader spinner" />
        // <div className="payment-status">
        //     <h1>Payment Status</h1>
        //     <p>Status: {responseStatus}</p>
        //     <p>Message: {responseMessage}</p>
        //     <SecondaryOutLineButton
        //         children="Back to Home"
        //         className="w-auto mx-4 mb-5"
        //         onClick={() => {
        //             navigate(Dashboard);
        //         }}
        //       />
        // </div>
    );
};

export default PaymentStatusPage;