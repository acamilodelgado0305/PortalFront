import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import { UserOutlined, MailOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { allCountries } from '../../../../services/allcountries';
import { checkTeacherEmailExists } from '../../../../services/teacher.services';

const { Option } = Select;

const AboutStep = ({ onChange, setIsVerified }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailStatus, setEmailStatus] = useState(null); // null, 'success', 'error'
  const [formValues, setFormValues] = useState({}); // To track form values

  const handleValuesChange = (changedValues) => {
    setFormValues((prevValues) => ({ ...prevValues, ...changedValues })); // Update local form values
    onChange(changedValues);
  };

  const handleEmailBlur = async (email) => {
    if (email) {
      const emailExists = await checkTeacherEmailExists(email);
      if (emailExists) {
        setEmailStatus('error');
        setEmailError('This email is already registered');
      } else {
        setEmailStatus('success');
        setEmailError('');
      }
    }
  };

  // Effect to check if all required fields are filled
  useEffect(() => {
    const allFieldsFilled = Object.keys(formValues).length >= 10 && // Check for the expected number of filled fields
      formValues.firstName &&
      formValues.lastName &&
      formValues.email &&
      formValues.password &&
      formValues.confirmPassword &&
      formValues.countryOfBirth &&
      formValues.subjectYouTeach &&
      formValues.language &&
      formValues.languageLevel &&
      formValues.phoneNumber &&
      formValues.isOver18;

    setIsVerified(allFieldsFilled);
  }, [formValues, setIsVerified]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Personal Information</h2>

      <Form layout="vertical" onValuesChange={handleValuesChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<span className="text-lg font-medium">First Name</span>}
            name="firstName"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Your first name"
              className="text-lg p-3 border-2 border-black rounded-md"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-lg font-medium">Last Name</span>}
            name="lastName"
            rules={[{ required: true, message: 'Please input your last name!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Your last name"
              className="text-lg p-3 border-2 border-black rounded-md"
            />
          </Form.Item>
        </div>

        {/* Email Field with Validation */}
        <Form.Item
          label={<span className="text-lg font-medium">Email Address</span>}
          name="email"
          validateStatus={emailStatus}
          help={emailError}
          rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Your email address"
            className={`text-lg p-3 border-2 rounded-md ${emailStatus === 'error' ? 'border-red-500' : 'border-black'}`}
            onBlur={(e) => handleEmailBlur(e.target.value)}
          />
        </Form.Item>

        {/* Password Fields */}
        <Form.Item
          label={<span className="text-lg font-medium">Password</span>}
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            placeholder="Enter your password"
            className="text-lg p-3 border-2 border-black rounded-md"
            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            visibilityToggle={{ onClick: () => setPasswordVisible(!passwordVisible) }}
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-lg font-medium">Confirm Password</span>}
          name="confirmPassword"
          rules={[{ required: true, message: 'Please confirm your password!' }]}
        >
          <Input.Password
            placeholder="Confirm your password"
            className="text-lg p-3 border-2 border-black rounded-md"
            iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            visibilityToggle={{ onClick: () => setConfirmPasswordVisible(!confirmPasswordVisible) }}
          />
        </Form.Item>

        {/* Country of Birth */}
        <Form.Item
          label={<span className="text-lg font-medium">Country of Birth</span>}
          name="countryOfBirth"
          rules={[{ required: true, message: 'Please select your country of birth!' }]}
        >
          <Select
            placeholder="Select your country of birth"
            className="text-lg border-2 border-black rounded-md"
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
          rules={[{ required: true, message: 'Please select the subject you teach!' }]}
        >
          <Select
            placeholder="Select the subject you teach"
            className="text-lg border-2 border-black rounded-md"
            size="large"
          >
            <Option value="math">Mathematics</Option>
            <Option value="science">Science</Option>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<span className="text-lg font-medium">Languages you speak</span>}
            name="language"
            rules={[{ required: true, message: 'Please select your language!' }]}
          >
            <Select
              placeholder="Select your language"
              className="text-lg border-2 border-black rounded-md"
              size="large"
            >
              <Option value="ingles">Inglés</Option>
              <Option value="espanol">Español</Option>
              <Option value="frances">Francés</Option>
              <Option value="aleman">Alemán</Option>
              <Option value="mandarin">Mandarín</Option>
              <Option value="italiano">Italiano</Option>
              <Option value="portugues">Portugués</Option>
              <Option value="ruso">Ruso</Option>
              <Option value="arabe">Árabe</Option>
              <Option value="japones">Japonés</Option>
              <Option value="coreano">Coreano</Option>
              <Option value="holandes">Holandés</Option>
              <Option value="sueco">Sueco</Option>
              <Option value="danes">Danés</Option>
              <Option value="noruego">Noruego</Option>
              <Option value="finlandes">Finlandés</Option>
              <Option value="griego">Griego</Option>
              <Option value="turco">Turco</Option>
              <Option value="hebreo">Hebreo</Option>
              <Option value="hungaro">Húngaro</Option>
              <Option value="checo">Checo</Option>

            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-lg font-medium">Language Level</span>}
            name="languageLevel"
            rules={[{ required: true, message: 'Please select your language level!' }]}
          >
            <Select
              placeholder="Select your level"
              className="text-lg border-2 border-black rounded-md"
              size="large"
            >
              <Option value="native">Native</Option>
              <Option value="fluent">Fluent</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="beginner">Beginner</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="text-lg font-medium">Phone Number</span>}
          name="phoneNumber"
          rules={[{ required: true, message: 'Please input your phone number!' }]}
        >
          <PhoneInput
            country={'us'}
            placeholder="Your phone number"
            containerClass="text-lg"
            inputStyle={{
              width: '100%',
              height: '48px',
              fontSize: '18px',
              border: '2px solid black'
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
