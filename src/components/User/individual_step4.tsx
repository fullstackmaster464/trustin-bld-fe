import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Radio,
  Row,
  Upload,
  message,
  Spin,
  Select,
  Tooltip,
  Collapse,
  Col
} from "antd";
import UserHeader from "./UserHeader";
import { useEffect, useState } from "react";
import LeftArrow from "../../assets/img/leftArrow.svg";
import Country from "../../assets/img/Country.svg";
import Mail from "../../assets/img/Email_outline.svg";
import { InputText } from "../ui-elements/InputsRepo";
import Mobile from "../../assets/img/Mobile.svg";
import User from "../../assets/img/User_Full.svg";
import Doc from "../../assets/img/doc.svg";
import Doc_large from "../../assets/img/Doc_large.svg";
import address from "../../assets/img/location_gray.svg";
import Passport from "../../assets/img/fileupload.svg";
import City from "../../assets/img/building.svg";
import InfoImg from "../../assets/img/info.svg";
import BlueTick from "../../assets/img/blue_tick.svg";
import BlueEye from "../../assets/img/blue_eye.svg";
import Delete from "../../assets/img/delete.svg";
import Tick from "../../assets/img/circle_orange.svg";
import Pdf from "../../assets/img/pdfview.svg";
import POBOX from "../../assets/img/chat.svg";
// import i_icon from "../../assets/img/i-icons.svg";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { KYCVerificatioStep3, KYCVerificatioStep5 } from "../Common/RouteConst";
import IndividualResponsiveSidebar from "./SidebarResponsiveIndividual";
import { fetchKybDetails, getRiskAssessment, getRiskConfiguration, saveKyc } from "../../services/admin";
import { DOCUMENT_TYPE, KYC_VERIFICATION_STEPS_TITLE, OnlyText, acceptedFileExtension, beforeUploadFile, getLocalStorage, setLocalStorage, DateWithUtcOffset2 } from "../Common/Constants";
import {  deleteFile,  extractTextFromCanvas,  extractTextFromImage, getIdNumberFromDocument, getUserNameFromDocument, getUserNameFromPassport,  getUserPassportNumber, readImageData, updateFinalV2, updateUserName, userKyc } from "../../services/user";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { Option } from "antd/lib/mentions";
import ImagePreviewModal from "../Models/ImagePreviewModal";
import type { CollapseProps } from 'antd';
import {Typography } from 'antd';
import PdfPreviewModal from "../Models/PdfPreviewModal"; 

enum DocumentType {
  RepAddProof = 'repAddProof',
  RepDocFront = 'repDocFront',
  RepDocBack = 'repDocBack'
}
interface DocumentData {
  repAddProof?: any[] | any;
  repDocFront?: any[] | any;
  repDocBack?: any[] | any
}

interface BasicDetails {
  name?: string,
  email?: string,
  callingCode?: string,
  contactNumber?: string,
  dob?: any,
  country?: string,
  typeOfEntity?: string,
  dateOfCorporation?: any,
  profession?: string,
  placeOfBirth?: string,
  placeOfBirthId?: string,
  gender?: string,
  customerProfession?: number,
  residenceStatus?: number,
  countryofIncorporation?: number
}

const IndividualStep4 = ():any => { 
  const [addressFile, setAddressFile] = useState<any>({});
  const [frontFile, setFrontFile] = useState<any>();
  const [backFile, setBackFile] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<any>({});
  const [value, setValue] = useState("EMIRATES_ID");
  const [haveuploaddocfront, sethaveuploaddocfront] = useState(0);
  const [haveuploaddocback, sethaveuploaddocback] = useState(0);
  const [formTouched, setformTouched] = useState(false)
  const [documentData, setDocumentData] = useState<DocumentData>();
  const [uploadLoading, setUploadLoading] = useState(false);
  const [basicDetails, setBasicDetails] = useState<BasicDetails>({});
  const [addressDetails, setAddressDetails] = useState<any>({});
  const [imagePreviewModal, setImagePreviewModal] = useState<boolean>(false);
  const [isverifyVisible, setverifyVisible] = useState<boolean>(false);
  const [uploadError,setUploadError] = useState<any>({
    emiratesFront:"",
    emiratesBack:"",
    address:"",
  })
  const [imagUrl, setImagUrl] = useState<any>("");
  const Loader = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const params = useLocation();
  const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  const local:any = getLocalStorage("auth");
  const email = local ? JSON.parse(local)?.email : "";
  const userAlias = local ? JSON.parse(local)?.userAlias : "";
  const Token = local ? JSON.parse(local)?.token : "";
  const ENTITY_TYPE = local ? JSON.parse(local!)?.entityType : ""
  const STEP = local ? JSON.parse(local!)?.step :""
  const userName = local ? JSON.parse(local)?.name : ""; 
  
  const [countryList, setCountryList] = useState([]);
  const [Name, setName] = useState('');
  const [DocNumber, setDocNumber] = useState('');
  const [loading, setLoading] = useState(false);
  // const [digiScreeningReqObj, setDigiScreeningReqObj] = useState<any>({});
  const [riskDetails, setRiskDetails] = useState<any>([]);
  const [accuracy, setAccuracy] = useState<any>(0);
  // const UserEmail = JSON.parse(getLocalStorage("auth")!)?.email;
  // const [country, setCountry] = useState("");

  const { Paragraph } = Typography;

  useEffect(() =>{
    setName(form.getFieldValue("docName"))
    setDocNumber(form.getFieldValue("docNumber"))
  },[form])
  const goBack = () => {
    const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
    localStroragevalue.step = 3;
    setLocalStorage('auth', JSON.stringify(localStroragevalue))
    navigate(KYCVerificatioStep3);
  }

  const onChange = async(e: any) => {
    setValue(e.target.value);
    if ((documentData?.repDocFront?.[0]?.id) && (typeof frontFile == 'string') ? frontFile : frontFile?.file?.name) {
      setLoading(true);
      await removeDocument(DocumentType.RepDocFront, documentData?.repDocFront?.[0]?.id);
      setLoading(false);
    }
    if (documentData?.repDocBack?.[0]?.id && (typeof backFile == 'string') ? backFile : backFile?.file?.name) {
      setLoading(true);
      await removeDocument(DocumentType.RepDocBack, documentData?.repDocBack?.[0]?.id);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (basicDetails?.residenceStatus === 116752) {
      setValue("EMIRATES_ID");
    } else {
      setValue("PASSPORT");
    }
  }, [basicDetails?.residenceStatus]);

  const onFinish = () => {
    setLoading(true);
    const docName = form.getFieldsValue().docName;
    const docNumber = form.getFieldsValue().docNumber;
    const documentNationality = form.getFieldsValue().documentNationality;
      const reqBoday = {
        userAlias,
        name: docName
      }

    // let date = selectedDate ? moment(selectedDate, 'DD-MM-YYYY').toISOString() : null;
    updateUserName(reqBoday).then((response) => {
      if ([200, 201].includes(response?.status) && response?.data?.affected > 0) {
      updateFinalV2({
        userAlias: userAlias,
        type: "individual",
        representativeName: docName,
        repDocNumber: docNumber,
        repExpiryDate: DateWithUtcOffset2(selectedDate),
        repDocType: value,
        documentNationality: documentNationality,
        CustomerType : ENTITY_TYPE == 'company' ? 'C' : 'I',
        documentAccuracyPercentage:accuracy
      })
        .then(async (res) => {
          if (res.status === 200 || res.status === 201) {
            // setLoading(true);
            // let reqObj = {
            //   ...digiScreeningReqObj,
            //   LastName: docName,
            //   Nationality: documentNationality,
            //   CustomerIdType: value,
            // }
            // await getDigiScreening(reqObj);
            const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
            localStroragevalue.step = 5;
            setLocalStorage('auth',JSON.stringify(localStroragevalue))
            navigate(KYCVerificatioStep5,{state:{
              basic: basicDetails?basicDetails:params?.state,
              addressDetails: params?.state?.formValues
            }});
          }
        })
        .catch(() => {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later!");
        });
      }
    }).catch(() => {
      setLoading(false);
        message.error("Oops! Something went wrong. Please try again later!");
    });
  };
  const validateName = (e: any) => {
    const result: string = e.target.value.replace(OnlyText, "");
    form.setFieldsValue({ docName: result });
    updateName(result);
  };

  const validateFile = (file: any) => {
    const data = file?.file
    const fileType: boolean = data?.type === "image/jpeg" || data?.type === "image/jpg" || data?.type === "image/png" || data?.type === "application/pdf";
    const isLt5M: boolean = data?.size / 1024 / 1024 <= 5;
    if (fileType && isLt5M) {
      return true
    }
    else {
      return false
    }
  }
 

  const uploadDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "")
      if(checkBeforeUpload == true){
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          repAddProof: [
            {
              url: "",
              loading: true,
            },
          ],
        });
        setUploadError((prevState:any) =>({
          ...prevState,
          address:""
          })) 
      return true;
      }
      else{
        setUploadLoading(false);
        setUploadError((prevState:any) =>({
          ...prevState,
          address:checkBeforeUpload
          })) 
          return false
      }
    },
    onChange: (info: any) => {
      if(!isLt5M){
        setUploadLoading(false);
      }else{
        setUploadLoading(true);
      }
      const { status, response } = info.file;

      if (status !== "uploading") {
        setUploadLoading(false);
      }

      if (status === "done") {
        if (response?.statusCode === 200 || response?.status === 201) {
          setUploadLoading(false);
          if (validateFile(info)) {
            setAddressFile(info);
          }
        }
        if (info.file.response.data.key) {
          setDocumentData({
            ...documentData,
            repAddProof: [info?.file?.response?.data],
          });
        }
      } else if (status === "error") {
        setUploadLoading(false);
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  // useEffect(() => {
  //   getUserData(UserEmail)
  //     .then((response: any) => {
  //       setCountry(response?.data?.countryName);
  //     })
  //     .catch(() => {
  //       message.error("Could not fetch details. Please try again later!");
  //     });
  // }, []);
 
  

  const rotateImageBitmap = (bitmap: ImageBitmap, degrees: number): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    const radians = (degrees * Math.PI) / 180;
    const rotate90 = degrees % 180 !== 0;

    canvas.width = rotate90 ? bitmap.height : bitmap.width;
    canvas.height = rotate90 ? bitmap.width : bitmap.height;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);

    return canvas;
  };



  const autoRotateImageForBestOCRNew = async ( file: File): Promise<{ rotatedCanvas: HTMLCanvasElement; extractedText: any }> => {
      const rotations = [0, 90, 180, 270];

        // Decode once
      const bitmap = await createImageBitmap(file);
        try {
        
        // Run all rotations in parallel
        // Rotate + OCR in parallel
        const results = await Promise.all(
          rotations.map(async (angle) => {
            const canvas = rotateImageBitmap(bitmap, angle);
            const extractedText = await extractTextFromCanvas(canvas);
            return { angle, canvas, extractedText };
          })
        );

        // Pick the best result
        const best = results.reduce((a, b) =>
          (b.extractedText.averageAccuracy || 0) > (a.extractedText.averageAccuracy || 0) ? b : a
        );

        return { rotatedCanvas: best.canvas, extractedText: best.extractedText };
       } finally {
        bitmap.close();
      }
    };
 
  
  const autoRotateImageForBestOCR = async (file: File): Promise<{ rotatedFile: File; extractedText: any }> => {
    const rotations = [0, 90, 180, 270];
  
    let bestAccuracy = 0;
    let bestText: any = null;
    let bestBlob: Blob | null = null;
  
    for (const angle of rotations) {
      const rotatedBlob = await rotateImage(file, angle);
      
      
      const rotatedFile = new File([rotatedBlob], file.name, { type: file.type });
  
      const imageData = await readImageData(rotatedFile);
     
      const extractedText = await extractTextFromImage(imageData);
      
      const accuracy = extractedText?.averageAccuracy || 0;
  
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
        bestText = extractedText;
        bestBlob = rotatedBlob;
      }
    }
  
    return {
      rotatedFile: new File([bestBlob!], file.name, { type: file.type }),
      extractedText: bestText,
    };
  };
  
  const rotateImage = (file: File, degrees: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
  
        const radians = (degrees * Math.PI) / 180;
  
        const rotate90 = degrees % 180 !== 0;
        canvas.width = rotate90 ? img.height : img.width;
        canvas.height = rotate90 ? img.width : img.height;
  
        ctx?.translate(canvas.width / 2, canvas.height / 2);
        ctx?.rotate(radians);
        ctx?.drawImage(img, -img.width / 2, -img.height / 2);
  
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject("Failed to rotate image");
        }, file.type);
      };
  
      img.onerror = reject;
      img.src = url;
    });
  };  
  
  const isLt5M  = true;
  const uploadFrontDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: async(file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "");
      if (!file || file.type !== "application/pdf") {
        if (value === "PASSPORT") {
          setUploadLoading(true);
          message.info("Hang tight! We’re carefully scanning your document to extract the text.");
          const { extractedText } = await autoRotateImageForBestOCRNew(file);
          setAccuracy(extractedText?.averageAccuracy);
          const isPassport = validatePassportText(extractedText?.text);
          setUploadLoading(false);
          
          if (!isPassport) {
            message.warning("OCR couldn't validate the passport. You can still continue and enter details manually.");
            // return Upload.LIST_IGNORE; // Prevent upload
          }else{
            message.success("Almost there… your document is being processed with OCR.");
          }
        }       
        if (value === "EMIRATES_ID") {
          message.info("Hang tight! We’re carefully scanning your document to extract the text.");
          setUploadLoading(true);
          const { extractedText } = await autoRotateImageForBestOCR(file);
          setAccuracy(extractedText?.averageAccuracy);
          const isEmiratesId = validateEmiratIDText(extractedText?.text);
          setUploadLoading(false);
          if (!isEmiratesId) {
            message.warning("OCR couldn't validate the Emirates ID. You can still continue and enter details manually.");
            // return Upload.LIST_IGNORE; // Prevent upload
          }else{
             message.success("Almost there… your document is being processed with OCR.");
          }
        }
      }
      if(checkBeforeUpload == true){
        setUploadError((prevState:any) =>({
        ...prevState,
        emiratesFront:""
        }))
        setUploadLoading(true);
        setDocumentData({
        ...documentData,
        repDocFront: [
          {
            url: "",
            loading: true,
          },
        ],
      });
        return true;
      } else{
        setUploadError((prevState:any) =>({
          ...prevState,
          emiratesFront:checkBeforeUpload
          })) 
        setUploadLoading(false);
        return false;
      }
    },
    onChange: (info: any) => {   
      const { status } = info.file;
      if (status !== "uploading") {
        sethaveuploaddocfront(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        
        sethaveuploaddocfront(1);
        if (info?.file?.response?.data?.key) {
          userKyc({
            fileName: info?.file?.response?.data?.key,
            userAlias: userAlias,
          })
            .then((res) => {
              setUploadLoading(false);
              setDocumentData({
                ...documentData,
                repDocFront: [info?.file?.response?.data],
              });
              let finalList = [];
              const filtered = res?.data?.data?.wordList.filter(function (el: any) {
                return el != null;
              });
              finalList = filtered;
              // Get document no. since the number is seperated by '-'
              for (let i = 1; i < filtered?.length; i++) {
                if (filtered[i].includes("-")) {
                  const getDocNo = filtered[i]
                    .split("-")
                    .toString()
                    .replace(",", "")
                    .replace(",", "")
                    .replace(",", "");
                  finalList.push(getDocNo);
                }
              }
              let name;
              let docId;
              if (value == "PASSPORT") {
                name = finalList && finalList?.length > 0 ? getUserNameFromPassport(finalList) : "";
                docId = finalList && finalList?.length > 0 ? getUserPassportNumber(finalList) : "";
              } else {
                name = finalList && finalList?.length > 0 ? getUserNameFromDocument(finalList) : "";
                docId = finalList && finalList?.length > 0 ? getIdNumberFromDocument(finalList) : "";
              }
              if (name) {
                form.setFieldsValue({
                  docName: name
                })
              }else{
                form.setFieldsValue({
                  docName: ""
                })
              }
              if (docId) {
                form.setFieldsValue({
                  docNumber: docId
                })
              }else{
                form.setFieldsValue({
                  docNumber: ""
                })
              }
              if (validateFile(info)) {
                setFrontFile(info);
              }
            })
            .catch(() => {
              setUploadLoading(false);
              message.error("Oops! Something went wrong. Please try again later!");
            });
        } else {
          setUploadLoading(false);
        }
      } else if (status === "error") {
        setUploadLoading(false);
        sethaveuploaddocfront(0);
        setDocumentData({
          ...documentData,
          repDocFront: [
            {
              loading: false,
              url: "",
            },
          ],
        });
        message.error(`${info.file.name} file upload failed.`);
      } else if (status === "removed") {
        sethaveuploaddocfront(0);
        setUploadLoading(false);
      }
    },
  };
  const uploadBackDoc = {
    name: "file",
    headers: {
      authorization: `Bearer ${Token}`,
    },
    action: REACT_APP_SERVER_URL + "/api/v1/ekyc/updateDocuments",
    beforeUpload: async (file: any) => {
      const checkBeforeUpload = beforeUploadFile(file, "");
      // if (!file || file.type !== "application/pdf") {
        // if (value === "PASSPORT") {
        //   setUploadLoading(true);
        //   const imageData = await readImageData(file);
        //   const extractedText = await extractTextFromImage(imageData);
        //   setAccuracy(extractedText?.averageAccuracy);
        //   const isPassport = validatePassportText(extractedText?.text);
        //   if (!isPassport) {
        //     setUploadLoading(false);
        //     message.error('Please upload a valid passport document.');
        //     return Upload.LIST_IGNORE; // Prevent upload
        //   }
        // }
        // if (value === "EMIRATES_ID") {
        //   setUploadLoading(true);
        //   const extractedText = await extractTextFromImage(file);
        //   setAccuracy(extractedText?.averageAccuracy);
        //   const isEmiratesId = validateEmiratIDText(extractedText?.text);
        //   if (!isEmiratesId) {
        //     setUploadLoading(false);
        //     message.error('Please upload a valid emirates ID document.');
        //     return Upload.LIST_IGNORE; // Prevent upload
        //   }
        // }
      // }
      if (checkBeforeUpload === true) {
        setUploadLoading(true);
        setDocumentData({
          ...documentData,
          repDocBack: [
            {
              loading: true,
              url: "",
            },
          ],
        });
        setUploadError((prevState:any) =>({
          ...prevState,
          emiratesBack: "",
        }))
  
        return true;
      }
      else{
        setUploadError((prevState:any) =>({
          ...prevState,
          emiratesBack: checkBeforeUpload,
        }));
        setUploadLoading(false);
        return false;
      }
    },
    onChange: (info: any) => {
      const { status } = info.file;
      if (status !== "uploading") {
        sethaveuploaddocback(info.fileList?.length ? 1 : 0);
      }
      if (status === "done") {
        sethaveuploaddocback(1);
        if (info?.file?.response?.data?.key) {
          userKyc({
            fileName: info?.file?.response?.data?.key,
            userAlias: userAlias,
          })
            .then((res) => {
              setUploadLoading(false);
              setDocumentData({
                ...documentData,
                repDocBack: [info?.file?.response?.data],
              });
              let finalList = [];
              const filtered = res?.data?.data?.wordList.filter(function (el: any) {
                return el != null;
              });
              finalList = filtered;
              // Get document no. since the number is seperated by '-'
              for (let i = 1; i < filtered?.length; i++) {
                if (filtered[i].includes("-")) {
                  const getDocNo = filtered[i]
                    .split("-")
                    .toString()
                    .replace(/,/g, "");
                  finalList.push(getDocNo);
                }
              }
              if (validateFile(info)) {
                setBackFile(info);
              }
            })
            .catch(() => {
              setUploadLoading(false);
              message.error("Oops! Something went wrong. Please try again later!");
            });
        } else {
          setUploadLoading(false);
        }
      } else if (status === "error") {
        setUploadLoading(false);
        setDocumentData({
          ...documentData,
          repDocBack: [
            {
              loading: false,
              url: "",
            },
          ],
        });
        sethaveuploaddocback(0);
        message.error(`${info.file.name} file upload failed.`);
      } else if (status === "removed") {
        sethaveuploaddocback(0);
        setUploadLoading(false);
      }
    },
  };  

  const uploadButton = (
    <div className="dash-upload-block">
      {(frontFile?.file?.name || typeof frontFile === 'string') && (documentData?.repDocFront?.[0]?.status !== "REJECTED") ? (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}
      <div>
        <Image src={Passport} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          <Tooltip
            title={(documentData?.repDocFront?.[0]?.status === "REJECTED") ? "Re-upload" : (typeof frontFile == 'string') ? frontFile : frontFile?.file?.name || (DOCUMENT_TYPE[value] + " front") }
            overlayClassName="custom-tooltip"
          >
            {(documentData?.repDocFront?.[0]?.status === "REJECTED") ? ( <span className="rejectReasonText">Re-upload</span> ) : ( typeof frontFile == 'string' ? frontFile : frontFile?.file?.name || DOCUMENT_TYPE[value] + " front" )}
          </Tooltip>
        </div>
      </div>
    </div>
  );

  const uploadButton1 = (
    <div>
      {(backFile?.file?.name || typeof backFile === 'string') && (documentData?.repDocBack?.[0]?.status !== "REJECTED") ? (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}
      <div >
        <Image src={Passport} alt="passport" preview={false} />
         <div className="mt-3 subText_xs overflowText w-upload">
          <Tooltip
            title={(documentData?.repDocBack?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof backFile == 'string')? backFile : backFile?.file?.name ? backFile?.file?.name : DOCUMENT_TYPE[value] + " back"
          }
            overlayClassName="custom-tooltip"
          >
           {(documentData?.repDocBack?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof backFile == 'string')? backFile : backFile?.file?.name ? backFile?.file?.name : DOCUMENT_TYPE[value] + " back"
          }
          </Tooltip>
        </div>
      </div>
    </div>
  );

  const uploadButton2 = (
    <div>
      {(addressFile?.file?.name || typeof addressFile === 'string') && (documentData?.repAddProof?.[0]?.status !== "REJECTED") ? (
        <div className="endtoend mt-3">
          <div></div>
          <Image
            src={Tick}
            alt="circle"
            className="tick_upload"
            preview={false}
          />
        </div>
      ) : null}
      <div >
        <Image src={Doc_large} alt="passport" preview={false} />
        <div className="mt-3 subText_xs overflowText w-upload">
          <Tooltip
            title={(documentData?.repAddProof?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
            : (typeof addressFile == 'string') ? addressFile : addressFile?.file?.name ? addressFile?.file?.name : "Address proof"
          }
            overlayClassName="custom-tooltip"
          >{(documentData?.repAddProof?.[0]?.status === "REJECTED") ? (<span className="rejectReasonText">Re-upload</span>)
          : (typeof addressFile == 'string') ? addressFile : addressFile?.file?.name ? addressFile?.file?.name : "Address proof"
        }
          </Tooltip>
        </div>
      </div>
    </div>
  );

  const removeDocument = async (docType: DocumentType, id: string) => {
    const payload = {
      id,
      userAlias: userAlias,
      docType,
    };

    const addressproof = { ...documentData };
    const url = addressproof[docType][0].url;

    addressproof[docType] = [{ loading: true, url: '' }];
    setDocumentData({ ...addressproof });

    await deleteFile(payload)
      .then((response: any) => {
        if (response?.status === 201 || response?.status === 200) {
          addressproof[docType] = [];
          setDocumentData(addressproof);
          switch (docType) {
            case DocumentType.RepAddProof:
              setAddressFile({});
              break;
            case DocumentType.RepDocFront:
              sethaveuploaddocfront(0);
              setFrontFile({});
              // eslint-disable-next-line no-case-declarations
              const localStroragevalue = JSON.parse(getLocalStorage("auth")!);
              localStroragevalue.name = null;
              setLocalStorage('auth',JSON.stringify(localStroragevalue))
              form.setFieldValue('docName',"")
              form.setFieldValue('docNumber',"")
              break;
            case DocumentType.RepDocBack:
              sethaveuploaddocback(0);
              setBackFile({});
              break;
            default:
              break;
          }
        }
      })
      .catch(() => {
        addressproof[docType] = [{ loading: false, url }];
        setDocumentData({ ...addressproof });
        message.error('Something went wrong. Please try again!');
      });
  };

  const handleDateChange = (_date: any,dateString:string | string[]) => { 
    setSelectedDate(dateString);
}
const updateName = (name:any) =>{
  const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
  localStroragevalue.name = name;
  setLocalStorage('auth',JSON.stringify(localStroragevalue))
} 

useEffect(() => {
  if(ENTITY_TYPE !== 'individual' || STEP !== 4){
    navigate(-1)
  }
  else{
    fetchKybDetails(userAlias)
      .then((res) => {
        const documents = res.data?.data?.[0]?.documents?.[0];
        const representative = res.data?.data?.[0]?.representative?.[0];
        setBasicDetails(res.data?.data?.[0]?.basic?.[0]);
        setAddressDetails(res?.data?.data?.[0]?.addressDetails?.[0]);
        if (documents) {
          setDocumentData(documents);
          setValue(documents?.repDocType || "EMIRATES_ID");
          sethaveuploaddocfront(documents?.repDocFront?.[0]?.url ? 1 : 0);
          sethaveuploaddocback(documents?.repDocBack?.[0]?.url ? 1 : 0);
          setFrontFile(documents?.repDocFront?.[0]?.url ? documents?.repDocFront?.[0]?.fileName : {})
          setBackFile(documents?.repDocBack?.[0]?.url ? documents?.repDocBack?.[0]?.fileName : {})
          setAddressFile(documents?.repAddProof?.[0]?.url ? documents?.repAddProof?.[0]?.fileName : {})
          setSelectedDate(dayjs.utc(representative?.repExpiryDate).format("DD-MM-YYYY"));
          updateName(representative?.representativeName);
          form.setFieldsValue({
            repSameAddress: documents?.repSameAddress,
            repDocType: documents?.repDocType,
            docType: documents?.repDocType,
            docName: representative?.representativeName,
            docNumber: representative?.repDocNumber,
            expiryDate: representative?.repExpiryDate
              ? dayjs.utc(representative?.repExpiryDate)
              : null,
            documentNationality: representative?.documentNationality
          });
        }
        // if (res?.data?.data[0]?.basic?.length > 0 && ((res?.data?.data[0]?.basic[0]?.typeOfEntity !== undefined || res?.data?.data[0]?.basic[0]?.typeOfEntity !== ""))) {
          // const reqObj: Object = {
          //   CustomerType: "I",
          //   Gender: res?.data?.data[0]?.basic[0]?.gender,
          //   LastName: res?.data?.data?.[0]?.representative?.[0]?.representativeName,
          //   DOB: res?.data?.data[0]?.basic[0]?.dob ? res?.data?.data[0]?.basic[0]?.dob : "",
          //   PlaceOfBirth: res?.data?.data[0]?.basic[0]?.placeOfBirth ? res?.data?.data[0]?.basic[0]?.placeOfBirth : "",
          //   Datasets: ['ALL']
          // }
          // setDigiScreeningReqObj(reqObj);
        // }
      })
      .catch(() => {
        message.error("Oops! Something went wrong. Please try again later!");
      });
    getRiskConfiguration({ RiskCategory: "I" })
      .then((response) => {
        setRiskDetails(response?.data?.result)
        if (response?.data?.status === 201 || response?.data?.status === 200) {
          if (response?.data?.result && response?.data?.result?.length) {
            const result = response?.data?.result
            const graphicRiskIndex = result.findIndex((d: any) => d?.riskCategory == 'Geographic Risk')

            if (graphicRiskIndex > -1) {
              result[graphicRiskIndex]['riskTypes'].map((r: any) => {
                if (r?.riskType == 'Nationality') {
                  setCountryList(r?.riskItems || [])
                }
              })
            }
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        message.error(error?.message ? error?.message : error);
      })

      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    if (userName === undefined || userName == "" || userName === null) {
      const docName = form.getFieldValue("docName");
      if (docName?.length === 0) {
        const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
        localStroragevalue.name = null;
        setLocalStorage('auth',JSON.stringify(localStroragevalue))
        form.setFieldValue('docName',"")
      } else {
        const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
        localStroragevalue.name = docName;
        setLocalStorage('auth',JSON.stringify(localStroragevalue))
      }
    }
  }, [form.getFieldValue("docName")]);

  // const getDigiScreening = async (reqObj: Object) => {
  //   try {
  //     const response = await getKyc(reqObj);
  //     if (response?.data?.status === 201 || 200) {
  //       const reqbody = {
  //         userAlias: userAlias,
  //         digiScreeningPayload: response?.data?.data?.digiScreeningPayload,
  //         ...response?.data?.data?.data
  //       }
  //       await saveDigiScreening(reqbody);
  //     } else {
  //       throw (response)
  //     }
  //   } catch (error: any) {
  //     setLoading(false)
  //     message.error(error?.data?.error?.message ? error?.data?.error?.message : error?.message ? error?.message : error?.data?.error ? error?.data?.error : "Something Went wrong!")
  //   }
  // }

  const saveDigiScreening = async (reqbody: object, type?: string) => {
    saveKyc(reqbody)
      .then(async (response) => {
        if (response?.data?.kycDetails?.status === 201 || response?.data?.kycDetails?.status === 200) {
          if (type == "risk_save") {
            setLoading(false);
            const localStroragevalue = JSON.parse(getLocalStorage("auth")!)
            localStroragevalue.step = 5;
            setLocalStorage('auth',JSON.stringify(localStroragevalue))
            navigate(KYCVerificatioStep5,{state:{
              basic: basicDetails?basicDetails:params?.state,
              addressDetails: params?.state?.formValues
            }});
          } else {
            await saveRiskAssessment();
          }
        }
      })
      .catch((error) => {
        setLoading(false) 
        message.error(error?.data?.error ? error?.data?.error : "Oops! Something went wrong. Please try again later!");
      });
  }

  const saveRiskAssessment = async () => {
    try {
      setLoading(true)
      const response = await fetchKybDetails(userAlias);
      if (response?.data?.data[0]?.basic?.length > 0 && (response?.data?.data[0]?.basic[0]?.typeOfEntity !== undefined || response?.data?.data[0]?.basic[0]?.typeOfEntity !== "")) {
        const reqObj = {
          reqType: "risk_assessment",
          RiskCategory: "I",
          CustomerName: response?.data?.data?.[0]?.representative?.[0]?.representativeName,
          CustomerId: response?.data?.data[0]?.digiScreeningPayload?.CustomerId,
          digiScreeningPayload: response?.data?.data[0]?.digiScreeningPayload,
          MainNationality: response.data?.data?.[0]?.basic?.[0]?.country,
          caseId: response?.data?.data[0]?.kybInfo[0]?.caseId,
          isMatched: response?.data?.data[0]?.kybInfo[0]?.isMatched,
          matchScore: response?.data?.data[0]?.kybInfo[0]?.matchScore,
          highestScoringResult: response?.data?.data[0]?.kybInfo[0]?.highestScoringResult,
          shareholders: response?.data?.data[0]?.kybInfo[0]?.shareholders
        }
        const riskAssessmentFormPayload = response?.data?.data[0]?.riskAssessmentFormPayload;
        let riskDetails2 = riskDetails;
        if (riskDetails2?.length == 0) {
          const riskDetails1 = await getRiskConfiguration({ RiskCategory: "I" })
          if (riskDetails1?.data?.status === 200 || riskDetails1?.data?.status === 201) {
            riskDetails2 = riskDetails1?.data?.result
          }
        }

        if (riskDetails2?.length > 0) {
          const riskTypeList: any = [];

          riskAssessmentFormPayload?.riskTypes?.forEach((riskTypeId: any) => {
            const riskType = riskDetails2
              ?.flatMap((riskCategory: any) => riskCategory.riskTypes)
              ?.find((rt: any) => rt.id === riskTypeId);

            if (riskType) {
              const riskItemList = riskAssessmentFormPayload?.riskItems
                ?.map((riskItemId: any) => {
                  const riskItem = riskType.riskItems.find((ri: any) => ri.id === riskItemId);
                  return riskItem ? { Id: riskItem.id.toString() } : null;
                })
                ?.filter((item: any) => item !== null);

              if (riskItemList.length > 0) {
                riskTypeList.push({
                  Id: riskType.id.toString(),
                  RiskItemList: riskItemList,
                });
              }
            }
          });

          if (riskTypeList?.length) {
            const riskReqObj = {
              RiskTypeList: riskTypeList,
              RiskCategory: "I",
              CustomerId: response?.data?.data[0]?.digiScreeningPayload?.CustomerId,
              CustomerName: response?.data?.data?.[0]?.representative?.[0]?.representativeName,
              MainNationality: response.data?.data?.[0]?.basic?.[0]?.country,
            }
            const riskAssesment = await getRiskAssessment(riskReqObj)
  
            if (riskAssesment?.data?.statusCode === 201 || riskAssesment?.data?.statusCode === 200) {
              const reqBoday = {
                userAlias: userAlias,
                riskAssessmentPayload: riskReqObj,
                riskAssessment: riskAssesment?.data?.user,
                riskAssessmentFormPayload: response?.data?.data[0]?.riskAssessmentFormPayload,
                customerId: response?.data?.data[0]?.digiScreeningPayload?.CustomerId,
                ...reqObj
              }
              await saveDigiScreening(reqBoday, "risk_save");
            }
          }
        } else {
          setLoading(false);
          message.error("Oops! Something went wrong. Please try again later!");
        }
      } else {
        setLoading(false);
        throw (response)
      }
    } catch (error: any) {
      setLoading(false)
      message.error(error?.error?.message ? error?.error?.message : error?.data?.message ? error?.data?.message : 'Something went wrong!')
    }

  }

  const handleImagePreview = (url: any) => {
    setImagUrl(url);
    setTimeout(() => {
      setImagePreviewModal(true);
    }, 500);
  }

  const generateRow = ({ icon, text }: any) => (
    <Col xs={24} className="d-flex align-items-baseline mt-3">
      <Image src={icon} alt="icon" preview={false} className="sidebar-submenu-icons" />
      <Paragraph className="stepDetails_sub mx-2 mb-0">{text}</Paragraph>
    </Col>
  );

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.BASIC_INFORMATION}</div> <Image
            src={BlueTick}
            alt="tick"
            preview={false}
            className="hw-20"
          />
        </span>
      ),
      children: (<>
      {generateRow({ icon: Mail, text: email })}
      {generateRow({ icon: Country, text: params?.state?.basic?.country ? params?.state?.basic?.country : basicDetails?.country })}
      {generateRow({ icon: Mobile, text: (params?.state?.basic?.callingCode && params?.state?.basic?.contactNumber) ? `${params?.state?.basic?.callingCode} ${params?.state?.basic?.contactNumber}` : `${basicDetails?.callingCode} ${basicDetails?.contactNumber}`})}
      </>)
    },
    {
      key: '2',
      label: (
        <span >
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.ADDRESS_DETAILS}</div><Image
            src={BlueTick}
            alt="tick"
            preview={false}
            className="hw-20"
          />
        </span>
      ),
      children: (<>
          {generateRow({ icon: address, text: (params?.state?.formValues?.address1 && params?.state?.formValues?.address2) ? `${params?.state?.formValues?.address1},${params?.state?.formValues?.address2}` : `${addressDetails?.companyAddress1}, ${addressDetails?.companyAddress2}` })}
          {generateRow({ icon: City, text: params?.state?.formValues?.countryCode ? params?.state?.formValues?.countryCode : addressDetails?.companyCountry })}
          {generateRow({ icon: POBOX, text: params?.state?.formValues?.postalCode ? params?.state?.formValues?.postalCode : addressDetails?.postalCode })}
      </>)
    },
    {
      key: '3',
      label: (
        <span className="step1 activeBtn pl--24px">
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.REQUIRED_DOCUMENTS}</div>
        </span>
      ),
      showArrow: false,
    },
    {
      key: '4',
      label: (
        <span className="step1 pl--24px">
          <div className="stepDetails">{KYC_VERIFICATION_STEPS_TITLE.FATCA_SELF_CERTIFICATION_FORM}</div>
        </span>
      ),
      showArrow:false
    },
  ];

  const handlePDFView =(url:any)=>{
    setImagUrl(url);
    setverifyVisible(true)
     }

     const validatePassportText = (text: string): boolean => {
      return text.toLowerCase().includes('passport');
    };

  function parseEmiratesIDText(text: string): any {
    const NAME = "Name";
    const NATIONALITY = "United Arab Emirates";
    const lines = text.split('\n');
    const idNumber = lines.find((line: any) => line.includes("784")) || '';
    const nameLine = lines.find((line: any) => line.includes(NAME)) || '';
    const nationality = lines.find((line: any) => line.includes(NATIONALITY)) || '';

    return {
      idNumber: [idNumber.trim()],
      name: nameLine.trim(),
      nationality: [nationality.trim()]
    };
  }

  const validateEmiratIDText = (text: any): boolean => {
    const data = parseEmiratesIDText(text);

    const EXPECTED_ID_NUMBER = "784";
    const NAME_INDICATORS = ["Name:", "Name :"];
    const EXPECTED_NATIONALITY = "United Arab Emirates";

    const isIDNumberValid = data.idNumber.some((id: any) => id.includes(EXPECTED_ID_NUMBER));
    const isNameValid = NAME_INDICATORS.some((validName: any) => data.name.includes(validName));
    const isNationalityValid = data.nationality.some((nat: any) => nat.includes(EXPECTED_NATIONALITY));

    const validChecksCount = [isIDNumberValid, isNameValid, isNationalityValid].filter(Boolean).length;
    return validChecksCount >= 2;
  }


  return (
    <div>
      {loading && (
        <div
          className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
        >
          <Spin size="large" className="mainloader"/>
        </div>
      )}
      {ENTITY_TYPE === 'individual' && STEP === 4 ? 
      <div>
      {uploadLoading == true && (
        <div
          className="d-flex align-items-center justify-content-center w-100 kyc-kyb-center-loader"
        >
          <Spin size="large" className="mainloader"/>
        </div>
      )} 
      <UserHeader step={60} />
      <div className="text-right formSubText p-5">Step 4/5</div>
      <IndividualResponsiveSidebar step={4} />
      <div className="d-flex center_res pb-5">
        <div className="px-5 verification_sidebar">
          <div className="slidebar-step-3-block">
            <Collapse items={items} bordered={false} />
            <div className="step_info p-50 d-flex mb-5">
              <Image src={InfoImg} alt="info" preview={false} className="mb-1" />
              <div>
                <div className="step">Tips for taking pictures</div>
                <div className="mt-2 step4">(Size upto 5mb)</div>
                <div className="mt-2 step4">Jpg, jpeg, png, pdf format</div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 px-5-res w-100">
          <div className="d-flex step-title">
            <Image src={LeftArrow} alt="arrow" preview={false} className="cursor" onClick={() => { goBack() }} />
            <div className="titleText px-5">Required documents</div>
          </div>
          <Form form={form} scrollToFirstError onFinish={onFinish}>
            { basicDetails?.residenceStatus && [116753, 137686].includes(basicDetails?.residenceStatus) && (
              <div className="card text-bg-light mt-4">
                <div className="card-body">
                  <p className="subText_xs mb-0">
                    The identification documentation provided should be certified as a true copy of the original document by any one of the following: a) registered lawyer, b) registered notary, c) chartered accountant, d) government ministry, e) post office, f) police officer or g) an embassy or consulate.
                  </p>
                </div>
              </div>
            )}
            <div className="doc-upload-row mt-4">
              <div >
                <Row>
                  <div className="d-flex w-100">
                    <Radio.Group onChange={onChange} value={value}>
                      {basicDetails?.residenceStatus && [116752, 137685].includes(basicDetails?.residenceStatus) && (
                        <Radio value="EMIRATES_ID" >
                          Emirates ID 
                          {/* <span> <Image className="i_-info_icons" src={i_icon} alt="i_icon" preview={false} /></span> */}
                        </Radio>
                      )}
                      <Radio value="PASSPORT">Passport</Radio> 
                    </Radio.Group>
                  </div>
                </Row>
                <div>
                  <div className="d-flex doc-upload-block sub-doc-upload-row">
                    <div>
                      <Upload
                        disabled={uploadLoading}
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        maxCount={1}
                         accept={acceptedFileExtension}
                        {...uploadFrontDoc}
                        {...{
                          data: {
                            businessType: "repDocFront",
                            type: "documents",
                            userAlias: userAlias,
                            repDocType: value,
                          },
                        }}
                      >
                        {uploadButton}
                      </Upload>
                      {frontFile?.file?.name || typeof frontFile == 'string' ? (
                        <div>
                          {documentData?.repDocFront?.[0]?.url &&
                            !documentData?.repDocFront?.[0]?.loading && (
                              documentData?.repDocFront?.[0]?.url &&
                                documentData?.repDocFront?.[0]?.url.includes(".pdf") ? (
                                <span className="d-flex endtoend p-1">
                                    <div className="blue_text cursor" onClick={() => {handlePDFView(documentData?.repDocFront?.[0]?.url)}}>
                                      <Image
                                        preview={false}
                                        src={Pdf} alt="view"
                                      /> <span className="px-1" >View</span>
                                    </div>
                                  {documentData?.repDocFront?.[0]?.status !==
                                    "VERIFIED" && (
                                      <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepDocFront, documentData?.repDocFront?.[0]?.id)} className="cursor" />
                                    )}
                                </span>
                              ) : (
                                <div className="d-flex endtoend p-1 doc-block">
                                  <div className="blue_text cursor" onClick={() => {
                                    handleImagePreview(documentData?.repDocFront?.[0]?.url)
                                  }}
                                  >
                                    <Image
                                      preview={false}
                                      src={BlueEye} alt="view"
                                    />
                                    <span className="px-1" >View</span>
                                  </div>
                                  {documentData?.repDocFront?.[0]?.status !== "VERIFIED" && (
                                    <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepDocFront, documentData?.repDocFront?.[0]?.id)} className="cursor" />
                                  )}
                                  {documentData?.repDocFront?.[0]?.status === "VERIFIED" && (
                                    <span className="text-green mb-2 ml-3rem">
                                      <CheckCircleOutlined /> Verified
                                    </span>
                                  )}
                                </div>
                              )
                            )}
                          {documentData?.repDocFront?.[0]?.loading && (
                            <Spin indicator={Loader} className="ml-20" />
                          )}
                        </div>
                      
                      ) : null}
                      <div>
                        {documentData?.repDocFront?.[0]?.status === "REJECTED" && (
                          <Tooltip title={documentData?.repDocFront?.[0]?.reason}>
                          <span className="rejectReasonText text-ellipsis mx-0 my-2">
                            Reason : {documentData?.repDocFront?.[0]?.reason}
                          </span>
                        </Tooltip>
                        )}
                      </div>
                      {haveuploaddocfront != 1 && formTouched === true ? <div className="errMsg px-2">Proof required!</div> : ""}
                      <span className="uploaderror ant-form-item-explain-error">{uploadError?.emiratesFront}</span>
                    </div>
                    <div>
                      <Upload
                        disabled={uploadLoading}
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        maxCount={1}
                         accept={acceptedFileExtension}
                        {...uploadBackDoc}
                        {...{
                          data: {
                            businessType: "repDocBack",
                            type: "documents",
                            userAlias: userAlias,
                            repDocType: value,
                          },
                        }}
                      >
                        {uploadButton1}
                      </Upload>
                      {backFile?.file?.name || typeof backFile == 'string' ? (
                        <div>
                          {documentData?.repDocBack?.[0]?.url &&
                            !documentData?.repDocBack?.[0]?.loading && (
                              documentData?.repDocBack?.[0]?.url &&
                                documentData?.repDocBack?.[0]?.url.includes(".pdf") ? (
                                  
                                 <span className="d-flex endtoend p-1">
                                    <div className="blue_text cursor" onClick={() => {handlePDFView(documentData?.repDocBack?.[0]?.url)}}>
                                      <Image
                                        preview={false}
                                        src={Pdf} alt="view"
                                      /> <span className="px-1" >View</span>
                                    </div>
                                  {documentData?.repDocBack?.[0]?.status !==
                                    "VERIFIED" && (
                                      <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepDocBack, documentData?.repDocBack?.[0]?.id)} className="cursor" />
                                    )}
                                </span>
                              ) : (
                                <>
                                  <div className="d-flex endtoend p-1 doc-block">
                                    <div className="blue_text cursor" onClick={() => { handleImagePreview(documentData?.repDocBack?.[0]?.url) }}>
                                      <Image
                                        preview={false}
                                        src={BlueEye} alt="view"
                                      /> <span className="px-1" >View</span>
                                    </div>
                                    {documentData?.repDocBack?.[0]?.status !== "VERIFIED" && (
                                      <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepDocBack, documentData?.repDocBack?.[0]?.id)} className="cursor" />
                                    )}
                                    {documentData?.repDocBack?.[0]?.status === "VERIFIED" && (
                                      <span className="text-green mb-2 ml-3rem">
                                        <CheckCircleOutlined /> Verified
                                      </span>
                                    )}
                                  </div>
                                </>
                              )
                            )}
                          {documentData?.repDocBack?.[0]?.loading && (
                            <Spin indicator={Loader} className="ml-20" />
                          )}
                        </div>
                      ) : null}
                        <div>
                          {documentData?.repDocBack?.[0]?.status === "REJECTED" && (
                            <Tooltip title={documentData?.repDocBack?.[0]?.reason}>
                              <span className="rejectReasonText text-ellipsis mx-0 my-2">
                                Reason : {documentData?.repDocBack?.[0]?.reason}
                              </span>
                            </Tooltip>
                          )}
                        </div>
                       {haveuploaddocback != 1 && formTouched === true ? <div className="errMsg px-2">Proof Required!</div> : ""}
                       <span className="uploaderror ant-form-item-explain-error">{uploadError?.emiratesBack}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Row>
                  <div className="d-flex w-100">
                    <div className="stepDetails_medium upload_address">
                      Address proof
                      {/* <span> <Image className="i_-info_icons" src={i_icon} alt="i_icon" preview={false} /></span> */}
                    </div>
                  </div>
                </Row>
                <div>
                  <div className="d-flex doc-upload-block">
                    <div className="upload_address">
                      <Upload
                        disabled={uploadLoading}
                        listType="picture-card"
                        className="avatar-uploader"
                         accept={acceptedFileExtension}
                        maxCount={1}
                        showUploadList={false}
                        {...uploadDoc}
                        {...{
                          data: {
                            businessType: "repAddProof",
                            type: "documents",
                            userAlias: userAlias,
                            repSameAddress: false,
                          },
                        }}                >
                        {uploadButton2}
                      </Upload>
                      {addressFile?.file?.name || typeof addressFile == 'string' ? (
                        <div>
                          {documentData?.repAddProof?.[0]?.url &&
                            !documentData?.repAddProof?.[0]?.loading && (
                              documentData?.repAddProof?.[0]?.url &&
                                documentData?.repAddProof?.[0]?.url.includes(".pdf") ? (
                                <span className="d-flex endtoend p-1">
                                    <div className="blue_text cursor" onClick={() => { handlePDFView(documentData?.repAddProof?.[0]?.url)}}>
                                      <Image
                                        preview={false}
                                        src={Pdf} alt="view"
                                      /> <span className="px-1" >View</span>
                                    </div>
                                  {documentData?.repAddProof?.[0]?.status !==
                                    "VERIFIED" && (
                                      <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepAddProof, documentData?.repAddProof?.[0]?.id)} className="cursor" />
                                    )}
                                </span>
                              ) : (
                                <>
                                  <div className="d-flex endtoend p-1 doc-block">
                                    <div className="blue_text cursor" onClick={() => {
                                      handleImagePreview(documentData?.repAddProof?.[0]?.url)
                                    }}>
                                      <Image
                                        preview={false}
                                        src={BlueEye} alt="view"
                                      /> <span className="px-1" >View</span>
                                    </div>
                                    {documentData?.repAddProof?.[0]?.status !== "VERIFIED" && (
                                      <Image src={Delete} alt="Delete" preview={false} onClick={() => removeDocument(DocumentType.RepAddProof, documentData?.repAddProof?.[0]?.id)} className="cursor" />
                                    )}
                                    {documentData?.repAddProof?.[0]?.status === "VERIFIED" && (
                                      <span className="text-green mb-2 ml-3rem">
                                        <CheckCircleOutlined /> Verified
                                      </span>
                                    )}
                                  </div>
                                </>
                              )
                            )}
                          {documentData?.repAddProof?.[0]?.loading && (
                            <Spin indicator={Loader} className="ml-20" />
                          )}
                        </div>
                      ) : null}
                      <div>
                      {documentData?.repAddProof?.[0]?.status === "REJECTED" && (
                        <Tooltip title={documentData?.repAddProof?.[0]?.reason}>
                        <span className="rejectReasonText text-ellipsis mx-0 my-2">
                          Reason :{documentData?.repAddProof?.[0]?.reason}
                        </span>
                      </Tooltip>
                      )}</div>
                      <span className="uploaderror ant-form-item-explain-error">{uploadError?.address}</span>
                    </div>
                  </div>
                </div>
              </div> 

            </div>
            <Row>
              <div className="pr-25 w-100-res">
              <Tooltip title="Name auto-retrieved upon document upload">
                <div className="subText_small mb-2 mt-2">
                  Full name <span className="red">*</span>
                </div>
                <InputText
                  fieldname="docName"
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
                      message: "Name is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid name!",
                    },
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter the full name"
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={User}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                    onChange={(e) => validateName(e)}
                  />
                </InputText>
              </Tooltip>
              </div>
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">ID Number <span className="red">*</span></div>
                <InputText
                  fieldname="docNumber"
                  className="inputField mb-4"
                  rules={[
                    {
                      required: true,
                      message: "Number is required!",
                    },
                    {
                      whitespace: true,
                      message: "Enter valid number!",
                    },
                    // {
                    //   pattern: new RegExp(/^[0-9]{15}$/),
                    //   message: "Enter valid number!"
                    // }
                  ]}
                >
                  <Input
                    type="text"
                    placeholder="Enter ID number"
                    prefix={
                      <span className="inputGlobe">
                        <Image
                          src={Doc}
                          alt="address"
                          className="me-3"
                          preview={false}
                        />
                      </span>
                    }
                    maxLength={50}
                  />
                </InputText>
              </div>
            </Row>
            <Row>
              <div className="pr-25 w-100-res">
                <div className="subText_small mb-2 mt-2">ID Expiry Date <span className="red">*</span></div>
                <Form.Item
                  name="expiryDate"
                  className="inputField"
                  rules={[
                    {
                      required: true,
                      message: "Expiry date is required!",
                    },
                  ]}
                >
                  <DatePicker
                    onChange={handleDateChange}
                    format={{
                      format: 'DD-MM-YYYY',
                      type: 'mask',
                    }}
                    placeholder="Select expiry date"
                    disabledDate={(current:any)=>{
                      return current && current.valueOf() < Date.now()
                    }}
                  />
                </Form.Item>
              </div>
              <div className="w-100-res">
                <div className="subText_small mb-2 mt-2">Nationality <span className="red">*</span></div>
                <Form.Item
                  className="w-100"
                  name={"documentNationality"}
                  rules={[
                    {
                      required: true,
                      message: "Document nationality is required!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select nationality *"
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {countryList?.length > 0 && countryList?.map((value: any, index: any) => {
                      return (
                        <Option key={index} value={value.riskItem} >{value.riskItem}</Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </div>
            </Row>
            <Row className="center_res step4-individual mt-5">
              <div className="d-flex mb-4 step-control-btn">
                {((addressFile?.file || typeof addressFile === 'string') && documentData?.repAddProof?.[0]?.status !== "REJECTED")
                 && (frontFile?.file || typeof frontFile === 'string') && (backFile?.file || typeof backFile === 'string') &&(documentData?.repDocFront?.[0]?.status !== "REJECTED" &&
                  documentData?.repDocBack?.[0]?.status !== "REJECTED" ) && Name != '' && DocNumber != '' ?
                  <Button className="rounded" htmlType="submit" loading={loading || uploadLoading} onClick={() => { setformTouched(true) }}>{uploadLoading ? "Please wait..." : "Save & Next"}</Button>
                  : <Button className="rounded disabled" loading={loading || uploadLoading}>{uploadLoading ? "Please wait..." : "Save & Next"}</Button>}
              </div>
            </Row>

          </Form>
        </div>
      </div>
      {/** Image Preview Modal */}
      <ImagePreviewModal
        imagePreviewModal={imagePreviewModal}
        setImagePreviewModal={setImagePreviewModal}
        imagUrl={imagUrl}
        setImagUrl={setImagUrl}
      />
      <PdfPreviewModal
      isverifyVisible={isverifyVisible}
      setverifyVisible={setverifyVisible}
      imagUrl={imagUrl}
      setImagUrl={setImagUrl}
      />
    </div> : ""}
    </div>
  );
};

export default IndividualStep4;
