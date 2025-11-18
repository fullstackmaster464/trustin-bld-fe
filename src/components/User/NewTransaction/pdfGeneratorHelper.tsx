import jsPDF from "jspdf";
import { getCommonPdf } from "../../../services/admin";
import siteLogo from "../../../assets/img/currentLogo.png";
import { getLocalStorage } from "../../Common/Constants";

export const createPdf = async (
  response: object | any,
  tab = "_self",
): Promise<any> => {
  try {
    // let url;
    const local = getLocalStorage("auth");
    const userAlias = local ? JSON.parse(local)?.userAlias : "";
    response.userAlias = userAlias;
    const res = await getCommonPdf(response);

      const doc:any = new jsPDF({compress:true, orientation:'portrait'});
      let totalPages = 0;
      let data;
      let pdfBlob;
      // Generate the PDF content
     await doc.html(res.data, {
        callback: async function (doc: any) {
        // Set the total number of pages once the PDF content is rendered
          totalPages = doc?.internal.getNumberOfPages();
          const internalWidth = doc.internal.pageSize.getWidth()
          const internalHeight = doc.internal.pageSize.getHeight()
          // Iterate over each page and add the header and footer
          for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            // Add the header
            doc.addImage(siteLogo, "PNG", 8, 10, 40, 10.25);
            doc.setFont('helvetica','bold');
            doc.setTextColor(255,102,0)
            doc.setFontSize(18);
            doc.text("Agreement Details",internalWidth - 60,18)
            // Add the footer
            // Calculate the position for each line of the footer
            const positionX = internalWidth / 2;
            const positionY = internalHeight - 10;
            doc.setFontSize(10);
            doc.setTextColor(115);
            doc.setFont('helvetica', 'normal');
            doc.text("© Copyright " + new Date().getFullYear() + " TrustIn", positionX - 45, positionY, { align: 'left'});
            doc.setTextColor(208,208,208);
            doc.text(" | ", positionX - 4, positionY, { align: 'left'});
            doc.setTextColor(115);
            doc.text("Email us: care@trustin.ae", positionX, positionY, { align: 'left'});
            doc.text("TrustIn Limited,512, 11th floor, Al Sarab Tower, ADGM Square, Al Maryah Island, Abu Dhabi-UAE.", positionX, positionY + 5, { align: 'center' });
            doc.setTextColor(0,55,149);
            doc.text(i.toString(), internalWidth - 12, positionY + 5);
          }
          pdfBlob = await doc.output('blob');
  
          const blobUrl = URL.createObjectURL(pdfBlob);
          data=blobUrl;
          // url = blobUrl
          if(tab !== 'no'){
            // window.open(blobUrl, tab);
          }
        },
        align: 'left',
        margin: [25, 10, 25, 10],
        showHead: "everyPage",
        autoPaging: 'text',
        x: 0,
        y: 0
      });
  
      return {blobData:pdfBlob, blobUrl:data}
    } catch (error) {
      return error;
    }
  };