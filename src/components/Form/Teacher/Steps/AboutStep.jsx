import React from 'react';
import { Form, Input, Select,Checkbox } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const { Option } = Select;

const AboutStep = ({ countriesOfLatinAmerica }) => {
  return (
    <>
      <Form.Item
        name="firstName"
        rules={[
          { required: true, message: 'Please input your first name!' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="First name"
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </Form.Item>
      <Form.Item
        name="lastName"
        rules={[
          { required: true, message: 'Please input your last name!' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Last name"
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            type: 'email',
            message: 'Please input a valid email!',
          },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded-md"
        />
      </Form.Item>
      <Form.Item
        name="countryOfBirth"
        rules={[
          {
            required: true,
            message: 'Please select your country of birth!',
          },
        ]}
      >
        <Select
          placeholder="Country of birth"
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          {countriesOfLatinAmerica.map((country) => (
            <Option key={country.code} value={country.code}>
              {country.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="subjectYouTeach"
        rules={[
          {
            required: true,
            message: 'Please select the subject you teach!',
          },
        ]}
      >
        <Select
          placeholder="Subject you teach"
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <Option value="math">Mathematics</Option>
          <Option value="science">Science</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="language"
        rules={[
          { required: true, message: 'Please select your language!' },
        ]}
      >
        <Select
          placeholder="Language"
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <Option value="english">English</Option>
          <Option value="spanish">Spanish</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="languageLevel"
        rules={[
          { required: true, message: 'Please select your language level!' },
        ]}
      >
        <Select
          placeholder="Language level"
          className="w-full border border-gray-300 p-2 rounded-md"
        >
          <Option value="native">Native</Option>
          <Option value="fluent">Fluent</Option>
          <Option value="intermediate">Intermediate</Option>
          <Option value="beginner">Beginner</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="phoneNumber"
        rules={[
          { required: true, message: 'Please input your phone number!' },
        ]}
      >
        <PhoneInput
          country={'us'}
          placeholder="Phone number"
          className="w-full border p-2 rounded-md"
        />
      </Form.Item>
      <Form.Item name="isOver18" valuePropName="checked">
        <Checkbox className="text-gray-700">I confirm I'm over 18</Checkbox>
      </Form.Item>
    </>
  );
};

export default AboutStep;