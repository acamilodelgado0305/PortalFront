import React, { useState, useEffect } from "react";
import { Form, Input, Select, Checkbox } from "antd";
import {
  UserOutlined,
  MailOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { allCountries } from "../../../../services/allcountries";
import { checkTeacherEmailExists } from "../../../../services/teacher.services";
import { languages, levels } from "./data/languages";


const { Option, OptGroup } = Select;

const AboutStep = ({ onChange, setIsVerified }) => {

  const [emailError, setEmailError] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [formValues, setFormValues] = useState({});

  const handleValuesChange = (changedValues) => {
    setFormValues((prevValues) => ({ ...prevValues, ...changedValues }));
    onChange(changedValues);
  };

  const handleEmailBlur = async (email) => {
    if (email) {
      const emailExists = await checkTeacherEmailExists(email);
      if (emailExists) {
        setEmailStatus("error");
        setEmailError("This email is already registered");
      } else {
        setEmailStatus("success");
        setEmailError("");
      }
    }
  };

  useEffect(() => {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "countryOfBirth",
      "subjectYouTeach",
      "language",
      "languageLevel",
      "phoneNumber",
      "isOver18",
    ];

    const allFieldsFilled =
      requiredFields.length === Object.keys(formValues).length &&
      requiredFields.every((field) => Boolean(formValues[field]));

    setIsVerified(allFieldsFilled);
  }, [formValues, setIsVerified]);

  return (
    <div className="mx-auto max-w-full rounded-lg bg-white shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Personal Information
      </h2>

      <Form layout="vertical" onValuesChange={handleValuesChange}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            label={<span className="text-lg font-medium">First Name</span>}
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Your first name"
              className="rounded-md border-2 border-black p-3 text-lg"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-lg font-medium">Last Name</span>}
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Your last name"
              className="rounded-md border-2 border-black p-3 text-lg"
            />
          </Form.Item>
        </div>

        {/* Email Field with Validation */}
        <Form.Item
          label={<span className="text-lg font-medium">Email Address</span>}
          name="email"
          validateStatus={emailStatus}
          help={emailError}
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Your email address"
            className={`rounded-md border-2 p-3 text-lg ${emailStatus === "error" ? "border-red-500" : "border-black"}`}
            onBlur={(e) => handleEmailBlur(e.target.value)}
          />
        </Form.Item>

    
        

        <Form.Item
          label={<span className="text-lg font-medium">Country of Birth</span>}
          name="countryOfBirth"
          rules={[
            { required: true, message: "Please select your country of birth!" },
          ]}
        >
          <Select
            placeholder="Select your country of birth"
            className="rounded-md border-2 border-black text-lg"
            size="large"
          >
            {allCountries.map((country) => (
              <Option key={country.code} value={country.code}>
                {country.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={<span className="text-lg font-medium">Subject You Teach</span>}
          name="subjectYouTeach"
          rules={[
            { required: true, message: "Please select the subject you teach!" },
          ]}
        >



          <Select
            placeholder="Select the subject you teach"
            className="rounded-md border-2 border-black text-lg"
            size="large"
          >
            {/* Arts */}
            <OptGroup label="Arts">
              <Option value="painting">Painting</Option>
              <Option value="drawing">Drawing</Option>
              <Option value="music">Music</Option>
              <Option value="dance">Dance</Option>
              <Option value="theater">Theater</Option>
              <Option value="photography">Photography</Option>
              <Option value="sculpture">Sculpture</Option>
            </OptGroup>

            {/* Programming */}
            <OptGroup label="Programming">
              <Option value="python">Python</Option>
              <Option value="javascript">JavaScript</Option>
              <Option value="java">Java</Option>
              <Option value="cpp">C++</Option>
              <Option value="web_dev">Web Development</Option>
              <Option value="mobile_dev">Mobile Development</Option>
              <Option value="data_science">Data Science</Option>
            </OptGroup>

            {/* Crafts */}
            <OptGroup label="Crafts">
              <Option value="knitting">Knitting</Option>
              <Option value="ceramics">Ceramics</Option>
              <Option value="origami">Origami</Option>
              <Option value="jewelry">Handmade Jewelry</Option>
              <Option value="sewing">Sewing</Option>
            </OptGroup>

            {/* Languages */}
            <OptGroup label="Languages">
              <Option value="english">English</Option>
              <Option value="spanish">Spanish</Option>
              <Option value="french">French</Option>
              <Option value="german">German</Option>
              <Option value="portuguese">Portuguese</Option>
              <Option value="italian">Italian</Option>
              <Option value="chinese">Mandarin Chinese</Option>
            </OptGroup>

            {/* Academic */}
            <OptGroup label="Academic">
              <Option value="mathematics">Mathematics</Option>
              <Option value="physics">Physics</Option>
              <Option value="chemistry">Chemistry</Option>
              <Option value="biology">Biology</Option>
              <Option value="history">History</Option>
              <Option value="literature">Literature</Option>
              <Option value="geography">Geography</Option>
            </OptGroup>

            {/* Music */}
            <OptGroup label="Musical Instruments">
              <Option value="piano">Piano</Option>
              <Option value="guitar">Guitar</Option>
              <Option value="violin">Violin</Option>
              <Option value="drums">Drums</Option>
              <Option value="singing">Singing</Option>
            </OptGroup>

            {/* Sports */}
            <OptGroup label="Sports">
              <Option value="yoga">Yoga</Option>
              <Option value="fitness">Fitness</Option>
              <Option value="dance">Dance</Option>
              <Option value="martial_arts">Martial Arts</Option>
              <Option value="swimming">Swimming</Option>
            </OptGroup>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Form.Item
            label={
              <span className="text-lg font-medium">Languages you speak</span>
            }
            name="language"
            rules={[
              { required: true, message: "Please select your language!" },
            ]}
          >
            <Select
              placeholder="Select your language"
              className="rounded-md border-2 border-black text-lg"
              size="large"
            >
              {languages.map((lang) => (
                <Option key={lang.value} value={lang.value}>
                  {lang.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-lg font-medium">Language Level</span>}
            name="languageLevel"
            rules={[
              { required: true, message: "Please select your language level!" },
            ]}
          >
            <Select
              placeholder="Select your level"
              className="rounded-md border-2 border-black text-lg"
              size="large"
            >
              {levels.map((level) => (
                <Option key={level.value} value={level.value}>
                  {level.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="text-lg font-medium">Phone Number</span>}
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <PhoneInput
            country={"us"}
            placeholder="Your phone number"
            containerClass="text-lg"
            inputStyle={{
              width: "100%",
              height: "48px",
              fontSize: "18px",
              border: "2px solid black",
            }}
          />
        </Form.Item>

        <Form.Item name="isOver18" valuePropName="checked">
          <Checkbox className="text-lg text-gray-700">
            I confirm I'm over 18 years old
          </Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AboutStep;
