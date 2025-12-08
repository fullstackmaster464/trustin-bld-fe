import { Row, Col, Form, Input, Select, Tooltip } from "antd";
import CountryFlag from "../../Common/CountryFlag";
import CallingCodeContract from "../../Common/CallingCodeContract";
import { emailRegex } from "../../Common/Constants";

const { Option } = Select;

interface PartyFormProps {
    parties: any[];
    width: number;
    isDraft: boolean;
    allOtherParties?: any[];
    updatePartyField: (id: number, key: string, value: any) => void;
    markAsMainParty: (id: number) => void;
    validateContactNumber: (code: string) => any;
    searchUserByEmail: (id: number, email: string) => void; 
    countryList: any[];
    form: any
    getLabel: (type: string, field: string, id: number) => { label: string; placeholder: string };
}

export const MultiPartyForm = ({
    parties,
    countryList,
    width,
    isDraft,
    // allOtherParties,
    updatePartyField,
    markAsMainParty,
    validateContactNumber,
    searchUserByEmail,
    form,
    getLabel,
}: PartyFormProps) => { 

    const getPartyFieldName = (party: any) =>
        party.type === "BUYER" ? "buyerList" : "sellerList";

    const validateNameFields = (value: string, maxCommentLength: number) => {
        if (!value || value.trim() === "") {
            return Promise.reject(new Error("Name is required!"));
        }
        const allowedChars = /^[a-zA-Z0-9\s,\/#?\-\.]*$/;
        if (!allowedChars.test(value)) {
            return Promise.reject(
            new Error("Only letters, numbers, spaces, and , - ? # / . are allowed")
            );
        }
        if (value.trim().length > maxCommentLength) {
            return Promise.reject(
            new Error(`Maximum characters allowed: ${maxCommentLength}`)
            );
        }

        return Promise.resolve();
    };

    const getCallingCode = (countryName: string) => {
        const selectedCountry = countryList.find((country: any) => {
            return country.name === countryName || country.isoCode === countryName;
        });
    
        return selectedCountry?.callingCode || '';
    };

    return (
        <>
            {parties?.map((party: any, index: number) => {
            const title = party.type === "BUYER" ? "Buyer" : "Seller";
            const listName = getPartyFieldName(party); 

                return (
                    <div key={party.id} className="party-block">
                        <div className="d-flex mx-2 gap-4 mb-3">
                            <Tooltip
                                title={`You can select as main ${title.toLowerCase()}. (Marking as main will make them the primary contact.)`}
                                placement={width > 475 ? "right" : "top"}
                            >
                                <div
                                    className="titleText gap-2 d-flex align-items-center cursor"
                                    onClick={() => markAsMainParty(party.id)}
                                >
                                    {title} {index + 1}
                                </div>
                            </Tooltip>
                        </div>

                        <Row gutter={16}>
                            {/* EMAIL */}
                            <Col span={width < 992 ? 24 : 8} className="pe-4">
                                <p className="enter-text-category">{getLabel(party.type, "email", index + 1).label}</p>
                                        <Form.Item
                                            name={[listName, party.id, "email"]}
                                            className="inputField w-100 error-input"
                                            initialValue={party.email}  
                                            rules={[
                                                { 
                                                    required: !isDraft, message: "Email is required!" 
                                                },
                                                { 
                                                    pattern: emailRegex, message: "Enter valid email!" 
                                                },
                                                {
                                                    validator: (_, value) => {
                                                        if (!value) return Promise.resolve();
                                                        const normalized = value.trim().toLowerCase();
                                                        const duplicate = parties.some(
                                                            (p) =>
                                                                p.id !== party.id &&
                                                                p.email &&
                                                                p.email.trim().toLowerCase() === normalized
                                                        );
                                                        return duplicate
                                                            ? Promise.reject(new Error("Email must be unique for each party"))
                                                            : Promise.resolve();
                                                    },
                                                },
                                            ]}
                                        >
                                            <Input
                                                disabled={index === 0 ? true : false}
                                                placeholder={getLabel(party.type, "email", index + 1).placeholder}
                                                onBlur={(e) => {
                                                    updatePartyField(party.id, "email", e.target.value)                                                    
                                                }}
                                                onChange={(e) => {
                                                    searchUserByEmail(party.id, e.target.value);
                                                }}
                                            />
                                        </Form.Item>
                            </Col>

                            {/* NAME */}
                            <Col span={width < 992 ? 24 : 8} className="pe-4">
                                <p className="enter-text-category">{getLabel(party.type, "name", index + 1).label}</p>
                                <Form.Item
                                    name={[listName, party.id, "name"]}
                                    className="inputField w-100 error-input"
                                    initialValue={party.name} 
                                    rules={[
                                        {
                                            validator: (_, value) => validateNameFields(value, 50),
                                        },
                                    ]}
                                >
                                    <Input
                                        disabled={party.isAutoFilled || index === 0 ? true : false}
                                        placeholder={getLabel(party.type, "name", index + 1).placeholder}
                                        maxLength={50}
                                        onChange={(e) => updatePartyField(party.id, "name", e.target.value)}

                                    />
                                </Form.Item>
                            </Col>

                            {/* COUNTRY */}
                            <Col span={width < 992 ? 24 : 8} className="pe-4">
                                <p className="enter-text-category">{getLabel(party.type, "country", index + 1).label}</p>
                                <Form.Item
                                    name={[listName, party.id, "country"]} 
                                    className="modal_inputField w-100 select"
                                    initialValue={party.country} 
                                    rules={[{ required: !isDraft, message: "Country is required!" }]}
                                >
                                    <div className="country-selection w-100 inputField">
                                        <CountryFlag isoCode={party.country || ""} />
                                        <Select
                                            disabled={party.isAutoFilled || index === 0 ? true : false}
                                            value={party.country || null}
                                            placeholder="Select country"
                                            onChange={(value) => {
                                                updatePartyField(party.id, "country", value);
                                                const listName = party.type === "BUYER" ? "buyerList" : "sellerList";
                                                form.setFieldsValue({
                                                    [listName]: {
                                                        [party.id]: {
                                                            country: value
                                                        }
                                                    }
                                                });
                                            }}
                                            showSearch
                                            optionFilterProp="children"
                                            allowClear
                                        >
                                            {countryList.map((country: any) => (
                                                <Option key={country.isoCode} value={country.isoCode}>
                                                    {country.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </Form.Item>
                            </Col>

                            {/* CONTACT */}
                            <Col span={width < 992 ? 24 : 8} className="pe-4">
                                <p className="enter-text-category">{getLabel(party.type, "contact", index + 1).label}</p>
                                <Form.Item
                                    name={[listName, party.id, "contact"]}
                                    className="inputField w-100 error-input"
                                    initialValue={party.contact} 
                                    rules={[
                                        { required: !isDraft, message: "Contact number is required!" }, 
                                        { validator: validateContactNumber(party.callingCode) }
                                    ]}
                                >
                                    <Input
                                        disabled={party.isAutoFilled || index === 0 ? true : false}
                                        addonBefore={
                                            <CallingCodeContract
                                                callingCode={party.callingCode}
                                                isoCode={party.country}
                                                onChange={(code: any, iso: any) => {
                                                    updatePartyField(party.id, "callingCode", code);
                                                    updatePartyField(party.id, "country", iso);
                                                }}
                                            />
                                        }
                                        prefix={getCallingCode(party.country) || ""}
                                        className="input_callingcode"
                                        maxLength={10}
                                        placeholder={getLabel(party.type, "contact", index + 1).placeholder}
                                        onChange={(e) => updatePartyField(party.id, "contact", e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                );
            })}
        </>
    );
};
