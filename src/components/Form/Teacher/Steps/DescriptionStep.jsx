import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';

const { TextArea } = Input;
const { Title, Paragraph, Link } = Typography;

const ProfileDescriptionStep = () => {
  const [form] = Form.useForm();
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <Title level={2}>Profile description</Title>
      <Paragraph>
        This info will go on your public profile. Write it in the language 
        you'll be teaching and make sure to follow our{' '}
        <Link href="#" target="_blank">guidelines to get approved</Link>
      </Paragraph>

      <Form form={form} layout="vertical">
        <Title level={3}>1. Introduce yourself</Title>
        <Paragraph>
          Show potential students who you are! Share your teaching 
          experience and passion for education and briefly mention your 
          interests and hobbies.
        </Paragraph>

        <Form.Item
          name="introduction"
          rules={[{ required: true, message: 'Please introduce yourself' }]}
        >
          <TextArea
            rows={6}
            placeholder="Hello, my name is... and I'm from..."
            onChange={handleTextChange}
            maxLength={400}
          />
        </Form.Item>

        <Alert
          message="Don't include your last name or present your information in a CV format"
          type="info"
          showIcon
          className="mb-4"
        />

        <Button className="mb-6">Continue</Button>

        <Title level={3}>2. Teaching experience</Title>
        <Title level={3}>3. Motivate potential students</Title>
        <Title level={3}>4. Write a catchy headline</Title>

        <div className="flex justify-between items-center mt-6">
          <span>{charCount} / 400</span>
          
        </div>
      </Form>
    </div>
  );
};

export default ProfileDescriptionStep;