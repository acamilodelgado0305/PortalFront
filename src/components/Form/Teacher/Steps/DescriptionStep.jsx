import React, { useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";

const { TextArea } = Input;
const { Title, Paragraph, Link } = Typography;

const stepsContent = [
  {
    title: "1. Introduce yourself",
    description:
      "Show potential students who you are! Share your teaching experience and passion for education and briefly mention your interests and hobbies.",
    placeholder: "Hello, my name is... and I'm from...",
    name: "introduction",
    message: "Please introduce yourself",
  },
  {
    title: "2. Teaching experience",
    description: "Share your teaching experience and highlight your skills.",
    placeholder: "Share your teaching experience...",
    name: "experience",
    message: "Please share your experience",
  },
  {
    title: "3. Motivate potential students",
    description: "Motivate your students and show them why they should choose you as a teacher.",
    placeholder: "Motivate your students...",
    name: "motivateStudents",
    message: "Please motivate your students",
  },
  {
    title: "4. Write a catchy headline",
    description: "",
    placeholder: "Write a catchy headline...",
    name: "headline",
    message: "Please write a headline",
  },
];

const ProfileDescriptionStep = () => {
  const [form] = Form.useForm();
  const [charCount, setCharCount] = useState(0);
  const [step, setStep] = useState(0); // El estado empieza en 0 (primer paso)

  const handleTextChange = (e) => {
    setCharCount(e.target.value.length);
  };

  const handleNextStep = () => {
    if (step < stepsContent.length - 1) setStep(step + 1);
  };

  const handleBackStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const { title, description, placeholder, name, message } = stepsContent[step];

  return (
    <div className="mx-auto max-w-lg p-6">
      <Title level={2}>Profile description</Title>
      <Paragraph>
        This info will go on your public profile. Write it in the language
        you'll be teaching and make sure to follow our{" "}
        <Link href="#" target="_blank">
          guidelines to get approved
        </Link>
      </Paragraph>

      <Form form={form} layout="vertical">
        <Title level={3}>{title}</Title>
        {description && <Paragraph>{description}</Paragraph>}
        <Form.Item name={name} rules={[{ required: true, message }]}>
          <TextArea
            rows={6}
            placeholder={placeholder}
            onChange={handleTextChange}
            maxLength={400}
          />
        </Form.Item>

        <div className="mt-6 flex items-center justify-between">
          <span>{charCount} / 400</span>
        </div>

        <div className="mt-4">
          {step > 0 && (
            <Button onClick={handleBackStep} className="mr-2">
              Previous
            </Button>
          )}
          {step < stepsContent.length - 1 && (
            <Button type="primary" onClick={handleNextStep}>
              Continue
            </Button>
          )}
        </div>
      </Form>

      <Alert
        message="Don't include your last name or present your information in a CV format"
        type="info"
        showIcon
        className="mt-6"
      />
    </div>
  );
};

export default ProfileDescriptionStep;

