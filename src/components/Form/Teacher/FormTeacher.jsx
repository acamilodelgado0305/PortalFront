import React, { useState } from "react";
import { Form, Button, Steps as AntSteps, Card, Modal, message } from "antd";
import Header from "../Header";
import AboutStep from "./Steps/AboutStep";
import PhotoStep from "./Steps/PhotoStep";
import CertificationStep from "./Steps/CertificacionStep";
import EducationStep from "./Steps/EducationStep";
import DescriptionSet from "./Steps/DescriptionStep";
import VideoStep from "./Steps/VideoStep";
import ScheduleStep from "./Steps/ScheduleStep";
import PricingStep from "./Steps/PricingStep";

import { createTeacher } from "../../../services/TeacherServices.js"

const { Step } = AntSteps;

const MultiStepForm = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (changedValues, allValues) => {
    setFormData((prevData) => ({ ...prevData, ...changedValues }));
  };

  const handleCertificationChange = (certifications) => {
    setFormData((prevData) => ({ ...prevData, certifications }));
  };

  const countriesOfLatinAmerica = [
    { code: "ar", name: "Argentina" },
    { code: "bo", name: "Bolivia" },
    { code: "br", name: "Brazil" },
    { code: "cl", name: "Chile" },
    { code: "co", name: "Colombia" },
    { code: "cr", name: "Costa Rica" },
    { code: "cu", name: "Cuba" },
    { code: "do", name: "Dominican Republic" },
    { code: "ec", name: "Ecuador" },
    { code: "sv", name: "El Salvador" },
    { code: "gt", name: "Guatemala" },
    { code: "hn", name: "Honduras" },
    { code: "mx", name: "Mexico" },
    { code: "ni", name: "Nicaragua" },
    { code: "pa", name: "Panama" },
    { code: "py", name: "Paraguay" },
    { code: "pe", name: "Peru" },
    { code: "pr", name: "Puerto Rico" },
    { code: "uy", name: "Uruguay" },
    { code: "ve", name: "Venezuela" },
  ];

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
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 0:
        return <AboutStep countriesOfLatinAmerica={countriesOfLatinAmerica} onChange={handleFormChange} />;
      case 1:
        return <PhotoStep onChange={handleFormChange} />;
      case 2:
        return <CertificationStep onChange={handleCertificationChange} />;
      case 3:
        return <EducationStep onChange={handleFormChange} />;
      case 4:
        return <DescriptionSet onChange={handleFormChange} />;
      case 5:
        return <VideoStep onChange={handleFormChange} />;
      case 6:
        return <ScheduleStep onChange={handleFormChange} />;
      case 7:
        return <PricingStep onChange={handleFormChange} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="p-4 bg-gray-200 mb-6">
        <AntSteps current={currentStep}>
          {stepTitles.map((title) => (
            <Step key={title} title={title} />
          ))}
        </AntSteps>
      </div>

      <div className="max-w-[50rem] mx-auto">
        <Card
          title={stepTitles[currentStep]}
          className="p-6 shadow-md rounded-md bg-white h-[100%]"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            {getCurrentStepContent()}
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <Button
                  onClick={prev}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                >
                  Previous
                </Button>
              )}
              {currentStep < stepTitles.length - 1 && (
                <Button
                  onClick={next}
                  className="bg-[#5CEFFF] hover:bg-blue-600 text-black py-2 px-4 rounded-md"
                >
                  Next
                </Button>
              )}
              {currentStep === stepTitles.length - 1 && (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  className="bg-[#5CEFFF] hover:bg-green-600 text-black py-2 px-4 rounded-md"
                >
                  Submit
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </div>

      <Modal
        title="Registration Successful"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleModalOk}>
            OK
          </Button>,
        ]}
      >
        <p>Your registration was successful. Thank you for signing up!</p>
      </Modal>
    </div>
  );
};

export default MultiStepForm;