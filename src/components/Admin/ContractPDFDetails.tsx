import { message, Spin } from "antd";
import "../auth/auth.scss";
import { useEffect, useState } from "react";
// @ts-ignore
import { useParams } from "react-router-dom";
import { createPdf } from "../User/NewTransaction/pdfGeneratorHelper";




const ContractPDFDetails = () => {
    const contractId = useParams();
    const [pdfUrl, setPdfUrl] = useState("");

    const viewPdf = (UrlData: any) => {
        createPdf(UrlData)
            .then(async (res) => {
                const pdf: any = await res;
                setPdfUrl(pdf.blobUrl);
            })
            .catch(() => {
                message.error(
                    "Oops! Could not view the invoice. Please try again later!"
                );
            });
    };
    useEffect(() => {
        viewPdf(contractId)
    }, []);

    return (
        <div>
            <div className="dashboardTabs pt-15 userDashboardTab scrollable-container" style={{ height: '100vh' }}>
                <div className="d-flex w-100 h-100">
                    {!pdfUrl ? (
                        <div
                            className="d-flex align-items-center justify-content-center w-100"
                            style={{ height: "100vh" }}
                        >
                            <Spin size="large" className="mainloader pdf" />
                        </div>
                    ) : (
                        <>
              <object
                data={pdfUrl}
                type="application/pdf"
                width="100%"
                height="450"
                useMap="invoice-details"
              >
                <p>Your browser does not support viewing PDFs {" "}
                
                </p>
                </object>
                <div className="text-center mt-3">
                  <a href={pdfUrl} download="contract-details.pdf">
                  <button className="btn btn-primary">
                    Download the PDF
                    </button>
                  </a>
              </div>
              </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractPDFDetails;
