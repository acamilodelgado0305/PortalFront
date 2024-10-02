import React from 'react';
import { Form, Input, Select, Checkbox } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { Option } = Select;

const AboutStep = ({ countriesOfLatinAmerica, onChange }) => {
  const handleValuesChange = (changedValues) => {
    onChange(changedValues);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Personal Information</h2>

      <Form
        layout="vertical"
        onValuesChange={handleValuesChange}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<span className="text-lg font-medium">First Name</span>}
            name="firstName"
            rules={[{ required: true, message: 'Please input your first name!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Your first name"
              className="text-lg p-3 border-2 border-gray-300 rounded-md"
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
              className="text-lg p-3 border-2 border-gray-300 rounded-md"
            />
          </Form.Item>
        </div>

        <Form.Item
          label={<span className="text-lg font-medium">Email Address</span>}
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Your email address"
            className="text-lg p-3 border-2 border-gray-300 rounded-md"
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-lg font-medium">Country of Birth</span>}
          name="countryOfBirth"
          rules={[{ required: true, message: 'Please select your country of birth!' }]}
        >
          <Select
            placeholder="Select your country of birth"
            className="text-lg border-2 border-gray-300 rounded-md"
            size="large"
          >
            {countriesOfLatinAmerica.map((country) => (
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
            className="text-lg border-2 border-gray-300 rounded-md"
            size="large"
          >
            <Option value="math">Mathematics</Option>
            <Option value="science">Science</Option>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label={<span className="text-lg font-medium">Language</span>}
            name="language"
            rules={[{ required: true, message: 'Please select your language!' }]}
          >
            <Select
              placeholder="Select your language"
              className="text-lg border-2 border-gray-300 rounded-md"
              size="large"
            >
              <Option value="english">English</Option>
              <Option value="spanish">Spanish</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="text-lg font-medium">Language Level</span>}
            name="languageLevel"
            rules={[{ required: true, message: 'Please select your language level!' }]}
          >
            <Select
              placeholder="Select your level"
              className="text-lg border-2 border-gray-300 rounded-md"
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
            inputStyle={{ width: '100%', height: '48px', fontSize: '18px' }}
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
