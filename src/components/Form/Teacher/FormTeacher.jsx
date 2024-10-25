import  { useEffect, useState } from "react";
import { Form, Button, Steps as AntSteps, Card, Modal, message } from "antd";
import { CheckCircle, Circle } from 'lucide-react';
import Header from "../../Header";
import AboutStep from "./Steps/AboutStep";
import PhotoStep from "./Steps/PhotoStep";
import CertificationStep from "./Steps/CertificacionStep";
import EducationStep from "./Steps/EducationStep";
import DescriptionSet from "./Steps/DescriptionStep";
import VideoStep from "./Steps/VideoStep";
import ScheduleStep from "./Steps/ScheduleStep";
import PricingStep from "./Steps/PricingStep";
import { createTeacher } from '../../../services/teacher.services'



const { Step } = AntSteps;

const MultiStepForm = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");




  const handleFormChange = (changedValues) => {
    setFormData((prevData) => ({ ...prevData, ...changedValues }));
  };

  useEffect(() => {
  }, [formData])



  const stepTitles = [
    "About",
    "Photo",
    "Certification",
    "Education",
    "Description",
    "Video",
    "Availability",
    "Pricing",
  ];





  const onFinish = async () => {
     if (currentStep != '7') {
      return
    }
    setIsSubmitting(true);
    try {
      await createTeacher(formData);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Registration failed:", error);
      message.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    } 
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    // Reset form or redirect to another page
    form.resetFields();
    setCurrentStep(0);
    setFormData({});
  };

const next = () => {
if(isVerified) {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
        setIsVerified(false);
        setErrorMessage("");
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
    } else{
      setErrorMessage("Please ensure all required fields are complete.")
    }
  
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
    setIsVerified(false)
  };

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 0:
        return <AboutStep  onChange={handleFormChange} setIsVerified={setIsVerified}/>;
      case 1:
        return <PhotoStep onChange={handleFormChange} setIsVerified={setIsVerified} />;
      case 2:
        return <CertificationStep onChange={handleFormChange} setIsVerified={setIsVerified}  />;
      case 3:
        return <EducationStep onChange={handleFormChange} setIsVerified={setIsVerified} />;
      case 4:
        return <DescriptionSet onChange={handleFormChange} setIsVerified={setIsVerified} />;
      case 5:
        return <VideoStep onChange={handleFormChange} setIsVerified={setIsVerified} />;
      case 6:
        return <ScheduleStep onChange={handleFormChange} setIsVerified={setIsVerified} />;
      case 7:
        return <PricingStep onChange={handleFormChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
    <Header />
    <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg mb-8">
      <AntSteps current={currentStep} className="custom-steps">
        {stepTitles.map((title, index) => (
          <Step
            key={title}
            title={<span className="text-white font-medium">{title}</span>}
            icon={
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${index < currentStep ? 'bg-green-500' : index === currentStep ? 'bg-[#FFFF45]' : 'bg-gray-300'}
                transition-all duration-300 ease-in-out
              `}>
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <Circle className="w-5 h-5 text-white" />
                )}
              </div>
            }
          />
        ))}
      </AntSteps>
    </div>

    <div className="max-w-4xl mx-auto px-4">
      <Card
        title={<h2 className="text-2xl font-bold text-gray-800">{stepTitles[currentStep]}</h2>}
        className="shadow-xl rounded-lg bg-white mb-8"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
        >
          {getCurrentStepContent()}
          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <Button
                onClick={prev}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-md transition duration-300"
              >
                Previous
              </Button>
            )}
          {(currentStep != 0 && errorMessage) && errorMessage}
            {currentStep < stepTitles.length - 1 && (
              <Button
                onClick={next}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md transition duration-300"
              >
                Next
              </Button>
            )}  {(currentStep == 0 && errorMessage) && errorMessage}
            {currentStep === stepTitles.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition duration-300"
              >
                Submit
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>

    <Modal
      title={<h3 className="text-xl font-bold text-green-600">Registration Successful</h3>}
      visible={isModalVisible}
      onOk={handleModalOk}
      onCancel={handleModalOk}
      footer={[
        <Button key="ok" onClick={handleModalOk} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300">
          OK
        </Button>,
      ]}
    >
      <p className="text-gray-700">Your registration was successful. Thank you for signing up!</p>
    </Modal>
  </div>
);
};

export default MultiStepForm;