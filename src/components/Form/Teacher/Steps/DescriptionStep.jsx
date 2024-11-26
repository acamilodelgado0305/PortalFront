import React, { useEffect, useState } from "react";
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

const ProfileDescriptionStep = ({ onChange, setIsVerified }) => {
  const [form] = Form.useForm();
  const [charCount, setCharCount] = useState(0);
  const [step, setStep] = useState(0);
  const [formValues, setFormValues] = useState({
    introduction: "",
    experience: "",
    motivateStudents: "",
    headline: "",
  });

  const handleTextChange = (e) => {
    setCharCount(e.target.value.length);
  };

  const handleNextStep = () => {
    if (step < stepsContent.length - 1) setStep(step + 1);
  };

  const handleBackStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    onChange({ 'description': formValues });
    const allFieldsFilled = Object.values(formValues).every(value => value.trim() !== "");
    setIsVerified(allFieldsFilled);
  }, [formValues]);

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl md:text-3xl font-bold">Profile description</h1>
      <Paragraph>
        This info will go on your public profile. Write it in the language
        you'll be teaching and make sure to follow our{" "}
        <Link href="#" target="_blank">
          guidelines to get approved
        </Link>
      </Paragraph>

      <Form form={form} layout="vertical">
        {stepsContent.slice(0, step + 1).map((item, index) => (
          <div key={index}>
            <Title level={window.innerWidth < 640 ? 4 : 3} className="py-2 md:py-0">{item.title}</Title>
            {index === step && item.description && (
              <Paragraph>{item.description}</Paragraph>
            )}
            {index === step && (
              <Form.Item
                name={item.name}
                rules={[{ required: true, message: item.message }]}
              >
                <TextArea
                className="text-lg border-2 border-black rounded-md"
                  rows={6}
                  placeholder={item.placeholder}
                  name={item.name}
                  value={formValues[item.name]}
                  onChange={(e) => {
                    handleTextChange(e);
                    handleInputChange(e);
                  }}
                  maxLength={400}
                />
              </Form.Item>
            )}
          </div>
        ))}

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

