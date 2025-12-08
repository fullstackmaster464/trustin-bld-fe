import React, { useState, useEffect, useRef } from "react";
import { Col, Form, Row, Select, Card, Input, Divider, message } from "antd";
import { getUserData } from "../../services/admin";
import { emailRegex } from "../Common/Constants";


const MultiCounter: React.FC = () => { // props: object
  // const { countryList } = props;

  // removed unused sourceOfFundUrls from props to avoid lint error
  const { Option } = Select;

  const [form] = Form.useForm();


  // form instance (used by validation helpers below)

  // viewport width helper used in layout decisions
  const [Width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // simple flags / helpers to satisfy references in the component
  const [isDraft] = useState<boolean>(false);

  // Minimal placeholder implementations to avoid compile errors in this isolated file.
  // Replace these with your real implementations when integrating.
  const sellerCountryError = { status: false, message: "" };
  
  

  // milestone count selector and list state
  const userLength = Array.from({ length: 3 });
  const [userList, setUserList] = useState<any[]>(
    Array.from({ length: 2 }).map((_, i) => ({
      id: i + 1,
      email: "",
      name: "",
    }))
  );
  const handleCountChange = (value: any) => {
    const count = Number(value) || 0;
    setUserList(
      Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        email: "",
        name: "",
      }))
    );
  };

  // console.log("countryList",countryList);
  

   const timer: any | undefined = useRef();
    const debounce = (email: any, func: any, delay: any) => {
      return () => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          func(email);
        }, delay);
      };
    };const searchUserByEmail = (e: any, index: number) => {
  const email = String(e.target.value || "").toLowerCase();

  if (!emailRegex.test(email)) return;

  const fetchUser = debounce(email, async (email: string) => {
    try {
      const res = await getUserData(email);

      if (!res?.data) {
        message.error("User not found");
        return;
      }

      const name = res.data.name;

      // update state list (optional)
      setUserList((prev) => {
        const next = [...prev];
        next[index] = { ...(next[index] || {}), email, name };
        return next;
      });

      // 🔥 PRE-FILL FORM HERE
      form.setFieldsValue({
        users: {
          [index]: {
            email,
            name,
          },
        },
      });

    } catch (err) {
      message.error("User not found");
    }
  }, 1000);

  fetchUser();
};


  return (
    <Form form={form} layout="vertical">

    <Row>
      <Col md={12} sm={24} xs={24}>
        <Form.Item
          labelCol={{ span: 24 }}
          label="Select number of seller"
          name="milestoneCount"
          className="mb-4"
        >
          <Select
            placeholder="Seller count"
            onChange={handleCountChange}
            defaultValue={2}
          >
            {userLength.map((_: any, index: number) => {
              const value = index + 2;
              return (
                <Option key={value} value={value}>
                  {value}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Col>

      <Col span={24}>
        {userList.map((user: any, index: number) => (
          <Card key={index} className="border-0 hide-divider">
            <Row gutter={Width < 992 ? [8, 8] : [0, 0]}>
              <Col span={Width > 992 ? 2 : Width < 550 ? 12 : 8}>
                <p className="mb-0">S no.</p>
                <Form.Item
                  name={[`milestone_${index}`, "id"]}
                  initialValue={user.id}
                  className="milestoneInput "
                >
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={Width > 992 ? 8 : 24}>
                <p className="enter-text-category">seller’s contact email</p>
                <Form.Item
                  name={["users", index, "email"]}
                  className={`inputField w-100 error-input ${
                    sellerCountryError?.status ? "error-border" : ""
                  }`}
                  rules={[
                    {
                      required: !isDraft,
                      message: `contact email is required!`,
                    },
                    {
                      pattern: emailRegex,
                      message: `Enter valid contact email!`,
                    }
                  ]}
                >
                  <Input
                    placeholder={`Enter seller’s contact email`}
                    onInput={(e: any) => {
                      e.target.value = e.target.value.toLowerCase();
                    }}
                    onChange={(e)=>{searchUserByEmail(e,index)}} 
                  />
                </Form.Item>
                {/* {countryError?.status && (
                               <p className="errMsg">{countryError?.message}</p>
                             )} */}
                {sellerCountryError?.status && (
                  <p style={{ color: "red", margin: "-16px 0px 16px" }}>
                    {sellerCountryError?.message}
                  </p>
                )}
              </Col>
              <Col span={Width > 992 ? 8 : 24}>
                <p className="enter-text-category">seller’s name</p>
                <Form.Item
                  name={["users", index, "name"]}
                  className="inputField w-100 error-input"
                  rules={[
                    {
                      required: true,
                      message: `seller’s name is required!`,
                    },
                  ]}
                >
                  <Input placeholder={`Enter seller’s name`} maxLength={45} />
                </Form.Item>
              </Col>
            </Row>
            <Divider className="divider mt-0 mb-3" />
          </Card>
        ))}
      </Col>
    </Row>
    </Form>
  );
};

export default MultiCounter;
