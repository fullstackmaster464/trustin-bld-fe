import React, { useEffect, useState } from "react";
import { Row, Col, Form, Input, Select, message } from "antd";
import { getAllCountries } from "../../services/masterData";
import { getSearchUserData } from "../../services/cheque";
import {
  DEFAULT_COUNTRY_CODE,
  emailRegex,
  getLocalStorage,
} from "../Common/Constants";
import { useDebounce } from "./hook";
import CountryFlag from "../Common/CountryFlag";
import CallingCodeContract from "../Common/CallingCodeContract";
import PoaDocumentUploader from "./PoaDocumentUploader";
import { getRiskConfigurationDetails } from "../../services/riskConfigurationService";
import dayjs from "dayjs";
import McUserDigiScreeningFields from "./McUserDigiScreeningFields";
// import OnboardPartySection from "./OnboardPartySection";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const { Option } = Select;

interface PoaDetailsFormProps {
  prefix: "partyPoa" | "counterPoa" | "counterBroker";
  poaParty: string;
  form: any;
  // formValues: any;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  userExists: boolean;
  setUserExists: React.Dispatch<React.SetStateAction<boolean>>;
  countryCode: string;
  setCountryCode: React.Dispatch<React.SetStateAction<string>>;
  country: string;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  nationality: string;
  setNationality: React.Dispatch<React.SetStateAction<string>>;
  // nationalityCallingCode: string;
  setNationalityCallingCode: React.Dispatch<React.SetStateAction<string>>;
  setUserAlias: React.Dispatch<React.SetStateAction<string>>;
  fileList: any;
  setFileList: any;
  poaDetails: object;
  setDocumentCheck: React.Dispatch<React.SetStateAction<boolean>>;
  // setUserOnboarded:React.Dispatch<React.SetStateAction<boolean>>;
  // isDocumentCheck:boolean;
  // residenceStatusTypeId: number;
  setResidenceStatusTypeId: React.Dispatch<React.SetStateAction<number | any>>;
  // professionTypeId: number;
  setProfessionTypeId: React.Dispatch<React.SetStateAction<number | any>>;
  // businessNatureTypeId: number;
  setBusinessNatureTypeId: React.Dispatch<React.SetStateAction<number | any>>;
  // countryofIncorporationTypeId: number;
  setCountryofIncorporationTypeId: React.Dispatch<React.SetStateAction<number | any>>;
  selectedDob: Date;
  setSelectedDob: React.Dispatch<React.SetStateAction<any>>;
  isDraft: any;
}

interface SetPoaDetailsParams {
  form: any;
  poaDetails?: any;
  setCountry: (val: string) => void;
  setCountryCode: (val: string) => void;
  setNationality: (val: string) => void;
  setNationalityCallingCode: (val: string) => void;
  setUserAlias: (val: string) => void;
  setUserExists: (val: boolean) => void;
  setFileList: (val: any[]) => void;
  setFormValues: React.Dispatch<React.SetStateAction<any>>;
  setResidenceStatusTypeId: React.Dispatch<React.SetStateAction<number | null>>;
  setProfessionTypeId: React.Dispatch<React.SetStateAction<number | null>>;
  setBusinessNatureTypeId: React.Dispatch<React.SetStateAction<number | null>>;
  setCountryofIncorporationTypeId: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedDob: React.Dispatch<React.SetStateAction<any>>;
}

const PoaDetailsForm: React.FC<PoaDetailsFormProps> = ({
  prefix,
  poaParty,
  form,
  // formValues,
  setFormValues,
  userExists,
  setUserExists,
  countryCode,
  setCountryCode,
  country,
  setCountry,
  nationality,
  setNationality,
  // nationalityCallingCode,
  setNationalityCallingCode,
  setUserAlias,
  fileList,
  setFileList,
  poaDetails = {},
  setDocumentCheck,
  // setUserOnboarded,
  // residenceStatusTypeId,
  setResidenceStatusTypeId,
  // professionTypeId,
  setProfessionTypeId,
  // businessNatureTypeId,
  setBusinessNatureTypeId,
  // countryofIncorporationTypeId,
  setCountryofIncorporationTypeId,
  selectedDob,
  setSelectedDob,
  isDraft
}) => {
  const localAuth = JSON.parse(getLocalStorage("auth") || "{}");
  // const userAlias = localAuth?.userAlias || "";
  const Email = localAuth?.email || "";

  const [width, setWidth] = useState<number>(window.innerWidth);
  const [countryList, setCountryList] = useState<any[]>([]);
  const [entityType, setEntityType] = useState<string>("");
  const [professionTypeList, setProfessionTypeList] = useState<any[]>([]);
  const [residenceStatusList, setResidenceStatusList] = useState<any[]>([]);
  const [businessNatureList, setBusinessNatureList] = useState<any[]>([]);
  const [incoporationCountryList, setIncoporationCountryList] = useState<any[]>([]);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getAllCountries()
      .then((res: any) => setCountryList(res.data))
      .catch((err) => console.error("getAllCountries error", err));
  }, []);

  const isDesktop = width > 992;

  const field = (name: string) => `${prefix}${name}`;

  // const clearDetails = useCallback(() => {
  //   form.setFieldsValue({
  //     [field("Country")]: null,
  //     [field("ContactNumber")]: "",
  //     [field("ContactName")]: "",
  //     [field("Email")]: "",
  //     [field("Nationality")]: "",
  //     [field("TypeOfEntity")]: "",
  //   });
  //   setCountryCode("");
  //   setCountry("");
  //   setNationalityCallingCode("");
  //   setNationality("");
  //   setUserAlias("");
  //   setFormValues((prev: any) => ({
  //     ...prev,
  //     [field("Country")]: "",
  //     [field("ContactNumber")]: "",
  //     [field("ContactName")]: "",
  //     [field("Nationality")]: "",
  //     [field("TypeOfEntity")]: "",
  //     [field("UserAlias")]: "",
  //   }));
  //   setUserExists(false);
  // }, [form, prefix, setUserExists]);

  const onEmailInput = useDebounce(
    (_e: React.ChangeEvent<HTMLInputElement>) => {
      form.setFieldsValue({
        [field("Country")]: null,
        [field("ContactNumber")]: "",
        [field("ContactName")]: "",
        [field("Nationality")]: null,
        [field("TypeOfEntity")]: null,
        [field("Profession")]: null,
        [field("ResidenceStatus")]: null,
        [field("CountryofIncorporation")]: null,
        [field("NatureofBusiness")]: null,
        [field("Dob")]: null,
      });
      //Update React states
      setUserExists(false);
      setCountryCode("");
      setCountry("");
      setNationalityCallingCode("");
      setNationality("");
      setUserAlias("");
      setFileList([]);
      setSelectedDob(null);
      setResidenceStatusTypeId(null);
      setProfessionTypeId(null);
      setBusinessNatureTypeId(null);
      setCountryofIncorporationTypeId(null);
      setEntityType("");
      setFormValues((prev: any) => ({
        ...prev,
        [field("Country")]: null,
        [field("ContactNumber")]: "",
        [field("ContactName")]: "",
        [field("Nationality")]: null,
        [field("TypeOfEntity")]: null,
        [field("UserAlias")]: "",
      }));
    },
    500
  );

  const searchUserByEmail = useDebounce(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const email = e.target.value;
      if (!email.match(emailRegex) || Email === email) return;

      try {
        const res: any = await getSearchUserData(email);
        const userDetails = res?.data;
        if (userDetails?.userType === "GUEST_SELLER") {
          setPoaDetails({
            form,
            poaDetails: userDetails,
            setCountry,
            setCountryCode,
            setNationality,
            setNationalityCallingCode,
            setUserAlias,
            setUserExists,
            setFileList,
            setFormValues,
            setResidenceStatusTypeId,
            setProfessionTypeId,
            setBusinessNatureTypeId,
            setCountryofIncorporationTypeId,
            setSelectedDob,
          });
        } else {
          // clearDetails();
          message.warning("User not found.");
        }
      } catch (err: any) {
        // clearDetails();
        const errMsg = err?.data?.error?.message || "Something went wrong!";
        message.warning(errMsg);
      }
    },
    1000
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^a-z ]/gi, "");
    form.setFieldValue(field("ContactName"), sanitized);
  };

  const handleLocationChange = (
    type: "country" | "nationality",
    isoCode: string
  ) => {
    const selected = countryList?.find((c) => c.isoCode === isoCode);
    const defaultCode = DEFAULT_COUNTRY_CODE;
    if (type === "country") {
      setCountry(isoCode);
      setCountryCode(selected?.callingCode || defaultCode);
      form.setFieldValue(field("Country"), isoCode);
      setFormValues((prev: any) => ({ ...prev, [field("Country")]: isoCode }));
    } else {
      setNationality(isoCode);
      setNationalityCallingCode(selected?.callingCode || defaultCode);
      form.setFieldValue(field("Nationality"), isoCode);
      setFormValues((prev: any) => ({
        ...prev,
        [field("Nationality")]: isoCode,
      }));
    }
  };

  const validateContactNumber =
    (callingCode: string) =>
      async (_: any, value?: string): Promise<void> => {
        const number = (value || "").trim();
        if (callingCode === DEFAULT_COUNTRY_CODE && !number.startsWith("5")) {
          throw new Error("UAE numbers should start with 5");
        }
        if (isDraft) {
          return Promise.resolve();
        }
        if (number.length < 7)
          throw new Error("Contact number must have at least 7 digits");
      };

  const handleContactBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const rawValue = e?.target?.value?.trim() || "";
    const normalizedValue = rawValue.startsWith("0")
      ? rawValue.substring(1)
      : rawValue;
    form.setFieldValue(field("ContactNumber"), normalizedValue);
  };

  const loadRiskData = async (entityTypeValue: string) => {
    if (entityTypeValue) {
      const entityTypeCode = entityTypeValue === "COMPANY" ? "C" : "I";
      setEntityType(entityTypeValue);
      const riskData: any = await getRiskConfigurationDetails(entityTypeCode);
      try {
        if (!riskData) return;
        if (entityTypeCode === "C") {
          // COMPANY
          setBusinessNatureTypeId(riskData?.businessNature?.id ?? null);
          setBusinessNatureList(riskData?.businessNature?.riskItems ?? []);
          setCountryofIncorporationTypeId(riskData?.countryOfIncorporation?.id ?? null);
          setIncoporationCountryList(riskData?.countryOfIncorporation?.riskItems ?? []);
        } else {
          // INDIVIDUAL
          setProfessionTypeId(riskData?.profession.id ?? null);
          setProfessionTypeList(riskData?.profession?.riskItems ?? []);
          setResidenceStatusTypeId(riskData?.residenceStatus?.id ?? null);
          setResidenceStatusList(riskData?.residenceStatus?.riskItems ?? []);
        }
      } catch (err: any) {
        const errMsg: any = err?.data?.message ? err?.data?.message : err?.data?.error ? err?.data?.error : "Something went wrong!";
        message.error(errMsg);
      }

    }
  };

  const setPoaDetails = async ({
    form,
    poaDetails,
    setCountry,
    setCountryCode,
    setNationality,
    setNationalityCallingCode,
    setUserAlias,
    setUserExists,
    setFileList,
    setFormValues,
    setResidenceStatusTypeId,
    setProfessionTypeId,
    setBusinessNatureTypeId,
    setCountryofIncorporationTypeId,
    setSelectedDob,
  }: SetPoaDetailsParams) => {
    if (!poaDetails) return;

    //DEFAULT_COUNTRY DEFAULT_COUNTRY_CODE
    const countryAlias = poaDetails?.countryAlias;
    const nationalityAlias = poaDetails?.nationality;

    const countryData = countryList?.find((c) => c.isoCode === countryAlias);
    const nationalityData = countryList?.find(
      (c) => c.isoCode === nationalityAlias
    );

    const callingCode = countryData?.callingCode;
    const nationalityCode = nationalityData?.callingCode;

    //Update form fields
    form.setFieldsValue({
      [field("Email")]: poaDetails?.email ?? "",
      [field("ContactName")]: poaDetails?.name ?? "",
      [field("ContactNumber")]: poaDetails?.contactNumber ?? "",
      [field("Country")]: countryAlias,
      [field("Nationality")]: nationalityAlias,
      [field("TypeOfEntity")]:
        poaDetails?.typeOfEntity || poaDetails?.eKycType || poaDetails?.entityType || null,
      [field("NatureofBusiness")]: Number(poaDetails?.natureofBusiness) || null,
      [field("Profession")]: poaDetails?.profession != null ? Number(poaDetails.profession) : null,
      [field("ResidenceStatus")]: poaDetails?.residenceStatus != null ? Number(poaDetails.residenceStatus) : null,
      [field("CountryofIncorporation")]: poaDetails?.countryofIncorporation != null ? Number(poaDetails.countryofIncorporation) : null,
      [field("NatureofBusiness")]: poaDetails?.natureofBusiness != null ? Number(poaDetails.natureofBusiness) : null,
      [field("Dob")]: poaDetails?.dob ? dayjs(poaDetails?.dob) : null,
    });
    //Update React states
    setCountry(countryAlias);
    setCountryCode(callingCode);
    setNationality(nationalityAlias);
    setNationalityCallingCode(nationalityCode);

   
    setUserAlias(poaDetails?.userAlias ?? "");
    setUserExists(
      poaDetails?.ekycState === "COMPLETED" ||
      poaDetails?.sellerEKycStatus === "COMPLETED"
    );

    //Document handling
    const documentList = poaDetails?.uploadedDocuments || poaDetails?.sellerDocuments;
    if (documentList) {
      const document = documentList?.map((a: any) => {
        return { ...a, isExpired: dayjs(a.expirydate).isBefore(dayjs()) };
      });
      setFileList(document);
      setDocumentCheck(document?.map((a: any) => a.isExpired).includes(true));
    }
    setFormValues((prev: any) => ({
      ...prev,
      [field("Email")]: poaDetails?.email ?? "",
      [field("ContactName")]: poaDetails?.name ?? "",
      [field("ContactNumber")]: poaDetails?.contactNumber ?? "",
      [field("Country")]: countryAlias,
      [field("Nationality")]: nationalityAlias,
      [field("TypeOfEntity")]:
        poaDetails?.typeOfEntity || poaDetails?.eKycType || poaDetails?.entityType || null,
      [field("UserAlias")]: poaDetails?.userAlias ?? "",
    }));
     if (poaDetails?.typeOfEntity || poaDetails?.eKycType || poaDetails?.entityType) {
      setSelectedDob(poaDetails?.dob ? dayjs(poaDetails?.dob).format("DD-MM-YYYY") : null);
      setResidenceStatusTypeId(Number(poaDetails?.residenceStatusTypeId) || null);
      setProfessionTypeId(Number(poaDetails?.professionTypeId) || null);
      setBusinessNatureTypeId(Number(poaDetails?.natureofBusinessTypeId) || null);
      setCountryofIncorporationTypeId(poaDetails?.countryofIncorporationTypeId || null);
      await loadRiskData(poaDetails?.typeOfEntity || poaDetails?.eKycType || poaDetails?.entityType);
    }
  };


  const handleDateChange = (date: dayjs.Dayjs | null, dateString: string | string[]) => {
    if (date && !date?.isValid()) {
      message.error('Please enter a valid date');
      return;
    }
    setSelectedDob(dateString);
  }

  useEffect(() => {
    // const currentEmail = form.getFieldValue(field("Email"));
    //  && !currentEmail
    if (poaDetails) {
      setPoaDetails({
        form,
        poaDetails,
        setCountry,
        setCountryCode,
        setNationality,
        setNationalityCallingCode,
        setUserAlias,
        setUserExists,
        setFileList,
        setFormValues,
        setResidenceStatusTypeId,
        setProfessionTypeId,
        setBusinessNatureTypeId,
        setCountryofIncorporationTypeId,
        setSelectedDob,
      });
    }
  }, []);


  return (
    <>
      {/* Onboard Party Section */}
      {/* <OnboardPartySection
          width={width}
          userExists={userExists}
          form={form}
          fieldName={field("Onboarded")}
          onChange={(value) => {
            setUserOnboarded(value === "YES");
            // form.setFieldsValue({ counterContactEmail: null });
          }}
        /> */}

      <Row gutter={36}>
        {/* Email */}
        <Col span={isDesktop ? 8 : 24}>
          <p className="seller-text-category">
            {poaParty}&apos;s contact email
          </p>
          <Form.Item
            name={field("Email")}
            className="inputField w-100 error-input"
            rules={[
              { required: !isDraft, message: "Email is required!" },
              { pattern: emailRegex, message: "Enter valid email!" },
              {
                validator(_, value) {
                  if (value && value !== Email) return Promise.resolve();
                  else if (value && value === Email)
                    return Promise.reject(
                      new Error(
                        "POA email cannot be the same as logged-in user."
                      )
                    );
                },
              },
            ]}
          >
            <Input
              placeholder="Enter email"
              onInput={onEmailInput}
              onChange={searchUserByEmail}
            />
          </Form.Item>
        </Col>

        {/* Name */}
        <Col span={isDesktop ? 8 : 24}>
          <p className="seller-text-category">{poaParty}&apos;s name</p>
          <Form.Item
            name={field("ContactName")}
            className="inputField w-100 error-input"
            rules={[{ required: !isDraft, message: "Name is required!" }]}
          >
            <Input
              readOnly={userExists}
              // disabled={userExists}
              placeholder="Enter name"
              onChange={handleNameChange}
              maxLength={45}
            />
          </Form.Item>
        </Col>

        {/* Country */}
        <Col span={isDesktop ? 8 : 24}>
          <p className="seller-text-category">{poaParty}&apos;s residence country</p>
          <Form.Item
            name={field("Country")}
            className="modal_inputField w-100 select"
            rules={[{ required: !isDraft, message: "Country is required!" }]}
          >
            <div className="country-selection w-100 inputField">
              <CountryFlag isoCode={country} />
              <Select
                disabled={userExists}
                placeholder="Select country"
                onChange={(isoCode: string) =>
                  handleLocationChange("country", isoCode)
                }
                showSearch
                optionFilterProp="children"
                popupClassName="lowerz"
                value={country || undefined}
              >
                {countryList.map((c) => (
                  <Option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Form.Item>
        </Col>

        {/* Nationality */}
        <Col span={isDesktop ? 8 : 24}>
          <p className="seller-text-category">{poaParty}&apos;s nationality</p>
          <Form.Item
            name={field("Nationality")}
            className="modal_inputField w-100 select"
            rules={[{ required: !isDraft, message: "Nationality is required!" }]}
          >
            <div className="country-selection w-100 inputField">
              <CountryFlag isoCode={nationality} />
              <Select
                // disabled={userExists && nationality}
                placeholder="Select nationality"
                onChange={(isoCode: string) =>
                  handleLocationChange("nationality", isoCode)
                }
                showSearch
                optionFilterProp="children"
                popupClassName="lowerz"
                value={nationality || undefined}
              >
                {countryList?.map((c) => (
                  <Option key={c.isoCode} value={c.isoCode}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Form.Item>
        </Col>

        {/* Contact Number */}
        <Col span={isDesktop ? 8 : 24}>
          <p className="seller-text-category agreement-text-category">
            {poaParty}&apos;s contact number
          </p>
          <Form.Item
            name={field("ContactNumber")}
            className="inputField w-100 error-input"
            rules={[
              { required: !isDraft, message: "Contact number is required!" },
              { validator: validateContactNumber(countryCode) },
            ]}
          >
            <Input
              addonBefore={
                <CallingCodeContract
                  callingCode={countryCode}
                  setCallingCode={setCountryCode}
                  isoCode={country}
                  setIsoCode={setCountry}
                />
              }
              disabled={userExists}
              prefix={countryCode}
              placeholder="Enter contact number"
              inputMode="numeric"
              maxLength={10}
              onBlur={handleContactBlur}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                form.setFieldValue(field("ContactNumber"), val);
              }}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />
          </Form.Item>
        </Col>

        {/* Entity Type */}
        <Col span={isDesktop ? 8 : 24} className="pe-4">
          <p className="seller-text-category capitalize">
            {poaParty}&apos;s entity type
          </p>
          <Form.Item
            name={field("TypeOfEntity")}
            className="modal_inputField w-100 select"
            rules={[{ required: !isDraft, message: "Entity type is required!" }]}
          >
            <Select
              disabled={userExists}
              popupClassName="lowerz"
              placeholder="Select entity type"
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={async (value) => {
                await loadRiskData(value);
              }}
              options={[
                { label: "Company", value: "COMPANY" },
                { label: "Individual", value: "INDIVIDUAL" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={36}>
        <McUserDigiScreeningFields
          entityType={entityType}
          width={width}
          prefix={prefix}
          userExists={userExists}
          professionTypeList={professionTypeList}
          residenceStatusList={residenceStatusList}
          incoporationCountryList={incoporationCountryList}
          businessNatureList={businessNatureList}
          selectedDate={selectedDob}
          handleDateChange={handleDateChange}
        />
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <PoaDocumentUploader
            label={`${poaParty}'s document`}
            fileList={fileList}
            setFileList={setFileList}
            userExists={userExists}
            form={form}
          />
        </Col>
      </Row>
    </>
  );
};

export default PoaDetailsForm;
