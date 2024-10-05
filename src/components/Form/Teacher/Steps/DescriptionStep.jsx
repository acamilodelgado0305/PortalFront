import React, { useState } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";

const { TextArea } = Input;
const { Title, Paragraph, Link } = Typography;

const ProfileDescriptionStep = () => {
  const [form] = Form.useForm();
  const [charCount, setCharCount] = useState(0);
  const [step, setStep] = useState(1); // Controla el estado de cada paso

  const handleTextChange = (e) => {
    setCharCount(e.target.value.length);
  };

  // Función para manejar el cambio de paso
  const handleNextStep = () => {
    setStep(step + 1);
  };
  const handleBackStep = () => {
    setStep(step - 1);
  }; 

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
        {/* Step 1: Introduce yourself */}
        <Title level={3}>1. Introduce yourself</Title>
        {step == 1 && (
          <>
            <Paragraph>
              Show potential students who you are! Share your teaching
              experience and passion for education and briefly mention your
              interests and hobbies.
            </Paragraph>
            <Form.Item
              name="introduction"
              rules={[{ required: true, message: "Please introduce yourself" }]}
            >
              <TextArea
                rows={6}
                placeholder="Hello, my name is... and I'm from..."
                onChange={handleTextChange}
                maxLength={400}
              />
            </Form.Item>
            <div className="mt-6 flex items-center justify-between">
              <span>{charCount} / 400</span>
            </div>
      
            
            <Button className="mb-6" onClick={handleNextStep}>
              Continue
            </Button>
          </>
        )}

        {/* Step 2: Teaching experience */}
        <Title level={3}>2. Teaching experience</Title>
        {step == 2 && (
          <>
            <Form.Item
              name="experience"
              rules={[
                { required: true, message: "Please share your experience" },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Share your teaching experience..."
                onChange={handleTextChange}
                maxLength={400}
              />
            </Form.Item>
            <div className="mt-6 flex items-center justify-between">
              <span>{charCount} / 400</span>
            </div>
            {/* handleBackStep */}
            <Button className="mb-6 mr-2" onClick={handleBackStep}>
            Previous
            </Button>
            <Button className="mb-6" onClick={handleNextStep}>
              Continue
            </Button>
          </>
        )}

        {/* Step 3: Motivate potential students */}
        <Title level={3}>3. Motivate potential students</Title>
        {step == 3 && (
          <>
            <Form.Item
              name="motivateStudents"
              rules={[
                { required: true, message: "Please motivate your students" },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="Motivate your students..."
                onChange={handleTextChange}
                maxLength={400}
              />
            </Form.Item>
            <div className="mt-6 flex items-center justify-between">
              <span>{charCount} / 400</span>
            </div>
            <Button className="mb-6 mr-2" onClick={handleBackStep}>
            Previous
            </Button>
            <Button className="mb-6" onClick={handleNextStep}>
              Continue
            </Button>
          </>
        )}

        <Title level={3}>4. Write a catchy headline</Title>
        {step == 4 && (
          <>
            <Form.Item
              name="headline"
              rules={[{ required: true, message: "Please write a headline" }]}
            >
              <TextArea
                rows={6}
                placeholder="Write a catchy headline..."
                onChange={handleTextChange}
                maxLength={400}
              />
            </Form.Item>
            <div className="mt-6 flex items-center justify-between">
              <span>{charCount} / 400</span>
            </div>
            <Button className="mb-6" onClick={handleBackStep}>
              Previous
            </Button>
          </>
        )}
      </Form>
      <Alert
              message="Don't include your last name or present your information in a CV format"
              type="info"
              showIcon
              className="mb-4"
            />
    </div>
  );
};

export default ProfileDescriptionStep;
